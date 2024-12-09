const express = require("express");
const collection = require("./mongo");
const cors = require("cors");
const bycrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { requireAuth } = require('./middleware/Authenticatetoken');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
  {
    origin: ENV_FRONTEND_URL, 
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }
));
require("dotenv").config();


//jsonwebtoken intialization 
const createToken = (_id) =>{
  return jwt.sign({_id}, process.env.JWT_SECRET, {expiresIn: '3d'})
}
//connectng frontend to backend (writing the API)

//for login page
app.get("/", cors(), (req, res) => {
  res.json("Server is running" );
});

//get data from login page (for POST) - checks if POST request's (if user exists or not)
app.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await collection.findOne({ email: email });

    if (user) {
      //using hashed password 
      const match = await bycrypt.compare(password, user.password)
      if (match) {
        //create token 
        const token  = createToken(user._id);
        res.status(200).json({email, token});
      } else {
        res.json("wrongpassword");
      }
    } else {
      res.json("notexist");
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json("error");
  }
});

//handling POST from signup page - putting it inside the database
app.post("/signup", async (req, res) => {
  //taking info from axios
  const { email, password } = req.body;
  if (!validator.isStrongPassword(password)){
    res.json("Password not strong enough");
  }
  else{
    try {
      //checking if email already exists
      //collection is our database
      const check = await collection.findOne({ email: email });
  
  
      //sends a json response from server - confirmation code - "exist"
      if (check) {
        res.json("exist");
      } else {
        const salt = await bycrypt.genSalt(10);
        const hash = await bycrypt.hash(password, salt);
        //res.json("notexist");
        //creating new user and saving info in database
        const data = {
          email: email,
          password: hash,
        };
  
        //store data in mongo db if email does not exist yet
        await collection.insertMany([data]);

        const user = await collection.findOne({ email: email });

        //create token 
        const token = createToken(user._id)
        res.status(200).json({email, token});
      }
    } catch (e) {
      res.json("notexist");
    }

  }
  
});

//for creating unique ids
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const AWS = require("aws-sdk");
//AWS S3 backend:
// Set the region and access keys
AWS.config.update({
  region: process.env.BUCKET_REGION,
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

// Configure multer for handling multipart/form-data
const upload = multer({ storage: multer.memoryStorage() });

app.post("/home", requireAuth,  upload.single("file"), async (req, res) => {
  console.log("Received request to /home");
  console.log("File:", req.file);
  console.log("User email:", req.body.email);
  console.log("Access Key:", process.env.ACCESS_KEY);
  console.log("Secret Access Key:", process.env.SECRET_ACCESS_KEY);
  console.log("Region:", process.env.BUCKET_REGION);

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const userEmail = req.body.email;

  if (userEmail == "undefined") {
    return res.status(400).json("User email is required");
  }

  const uniqueKey = `${uuidv4()}.png`;

  const params = {
    Bucket: "memegeneratorimages",
    Key: uniqueKey,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  try {
    const data = await s3.upload(params).promise();
    console.log("File uploaded successfully. File location:", data.Location);

    // save the objectname
    const objectname = uniqueKey;

    try {
      const updatedUser = await collection.findOneAndUpdate(
        { email: userEmail },
        { $push: { savedmemes: objectname } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        message: "success",
        location: data.Location,
        objectName: objectname,
      });
      console.log("User's meme updated in DB:", updatedUser);
    } catch (DBerr) {
      console.log("Could not update DB:", DBerr);
      res
        .status(500)
        .json({ error: "Database update failed", details: DBerr.message });
    }
  } catch (S3err) {
    console.log("Error uploading file:", S3err);
    res.status(500).json({ error: "S3 upload failed", details: S3err.message });
  }
});

//get request to see all the saved memes
//must give email as part of request
app.get("/saved", requireAuth, async (req, res) => {
  try {
    const userEmail = req.query.email;
    if (!userEmail) {
      return res.status(400).json({ error: "User email is required" });
    }
    const user = await collection.findOne({ email: userEmail });

    if (!user || !user.savedmemes) {
      return res.json({ memes: [] });
    }

    // Generate signed URLs for each saved meme
    const memeUrls = await Promise.all(
      user.savedmemes.map(async (objectKey) => {
        const params = {
          Bucket: process.env.BUCKET_NAME,
          Key: objectKey,
          Expires: 3600, // URL expires in 1 hour
        };
        const url = await s3.getSignedUrlPromise("getObject", params);
        return { objectKey, url };
      })
    );

    res.json({ memes: memeUrls });
  } catch (err) {
    console.log("Error retrieving saved memes:", err);
    res.status(500).json({ err: "Failed to retrieve memes" });
  }
});

//delete saved memes
//will recieve meme object in req
app.delete("/saved/:objectKey", requireAuth, async (req, res) => {
  const objectKey = req.params.objectKey;

  if (!objectKey) {
    return res.status(400).json({ error: "Object key is required" });
  }

  try {
    // First, verify the image exists in MongoDB
    const post = await collection.findOne({
      savedmemes: objectKey,
    });

    if (!post) {
      console.log("Meme not found");
      return res.status(404).json({ error: "Meme not found" });
    }

    // Delete from S3
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: objectKey,
    };

    try {
      const s3deleteresponse = await s3.deleteObject(params).promise();

      console.log("S3 Delete Response:", s3deleteresponse);
    } catch (s3error) {
      console.error("S3 Deletion Error:", s3Error);
    }

    // Remove the objectKey from the savedmemes array
    const update = await collection.updateOne(
      { _id: post._id },
      { $pull: { savedmemes: objectKey } }
    );

    if (update.modifiedCount === 0) {
      return res.status(500).json({ error: "Failed to update MongoDB" });
    }

    res.status(200).json({ message: "Successfully deleted meme" });
  } catch (err) {
    console.error("Error in deletion process:", err);
    res.status(500).json({ error: "Error during deletion process" });
  }
});

module.exports = (req, res) => {
  // Handle the request using the Express app
  app(req, res);
};


