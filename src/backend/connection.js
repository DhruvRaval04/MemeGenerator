const express = require("express")
const collection = require("./mongo")
const cors = require("cors")
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

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

app.listen(5000, () => {
    console.log("port connected")
})