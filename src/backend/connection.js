const express = require("express")
const collection = require("./mongo")
const cors = require("cors")
const app = express()
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
require('dotenv').config();



//connectng frontend to backend (writing the API)

//for login page
app.get("/", cors(), (req, res) =>{

})

//get data from login page (for POST) - checks if POST request's (if user exists or not)
app.post("/", async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await collection.findOne({ email: email })

        if (user) {
            // In a real application, you should use proper password hashing and comparison
            if (user.password === password) {
                res.json("exist")
            } else {
                res.json("wrongpassword")
            }
        } else {
            res.json("notexist")
        }
    } catch (error) {
        console.error("Login error:", error)
        res.status(500).json("error")
    }
})


//handling POST from signup page - putting it inside the database 
app.post("/signup", async(req, res) =>{
    //taking info from axios 
    const{email, password} = req.body

    //creating new user and saving info in database 
    const data={
        email:email, 
        password:password
    }

    try{
        //checking if email already exists 
        //collection is our database
        const check = await collection.findOne({email:email})

        //sends a json response from server - confirmation code - "exist"
        if (check){
            res.json("exist")
        }
        else{
            res.json("notexist")
            
            //store data in mongo db if email does not exist yet 
            await collection.insertMany([data])
        }
        
    }
    catch(e){
        res.json("notexist")

    }
})

//for creating unique ids
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const AWS = require('aws-sdk');
//AWS S3 backend:
// Set the region and access keys
AWS.config.update({
    region: process.env.BUCKET_REGION,
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();

// Configure multer for handling multipart/form-data
const upload = multer({ storage: multer.memoryStorage() });


app.post("/home", upload.single('file'), async (req, res) => {
    console.log("Received request to /home");
    console.log("File:", req.file);
    console.log("User email:", req.body.email);
    console.log('Access Key:', process.env.ACCESS_KEY);
    console.log('Secret Access Key:', process.env.SECRET_ACCESS_KEY);
    console.log('Region:', process.env.BUCKET_REGION);


    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const userEmail = req.body.email;

    if (userEmail == "undefined") {
        return res.status(400).json("User email is required");
    }
  
    const uniqueKey = `${uuidv4()}.png`;
  
    const params = {
      Bucket: 'memegeneratorimages',
      Key: uniqueKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    };
  
    try {

      const data = await s3.upload(params).promise();
      console.log('File uploaded successfully. File location:', data.Location);

      // save the objectname
        const objectname = uniqueKey;

        try{
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
                objectName: objectname
            });
            console.log("User's meme updated in DB:", updatedUser)

        }

        catch(DBerr) {
            console.log("Could not update DB:", DBerr);
            res.status(500).json({ error: "Database update failed", details: DBerr.message });
        }
       

    } 
    
    catch (S3err) {
      console.log('Error uploading file:', S3err);
      res.status(500).json({ error: "S3 upload failed", details: S3err.message });

    }
  });

  //get request to see all the saved memes 
  //must give email as part of request
app.get("/saved", async (req, res) => {
    try{
        const userEmail = req.query.email
        if (!userEmail){
            return res.status(400).json({error:"User email is required"})
        }
        const user = await collection.findOne({ email:userEmail});

        if (!user || !user.savedmemes) {
            return res.json({ memes: [] });
        }

        // Generate signed URLs for each saved meme
        const memeUrls = await Promise.all(user.savedmemes.map(async (objectKey) => {
            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: objectKey,
                Expires: 3600 // URL expires in 1 hour
            };
            const url = await s3.getSignedUrlPromise('getObject', params);
            return { objectKey, url };
        }));

        res.json({ memes: memeUrls });
    }
    catch(err){
        console.log("Error retrieving saved memes:", err);
        res.status(500).json({err: "Failed to retrieve memes"});
    }


});
  


app.listen(5000, () => {
    console.log("port connected")
})