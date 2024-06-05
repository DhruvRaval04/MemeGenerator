const express = require("express")
const collection = require("./mongo")
const cors = require("cors")
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

//connectng frontend to backend 

//for login page
app.get("/", cors(), (req, res) =>{

})

//get data from login page
app.post("/", async(req, res) =>{
    //taking info from axios 
    const{email, password} = req.body

    try{
        //checking if email already exists 
        //collection is our database
        const check = await collection.findOne({email:email})

        //sends a json response from server - confirmation code - "exist"
        if (check){
            res.json("exist")
        }
        else{
            res.json("not exist")
        }
        
    }
    catch(e){
        res.json("notexist")

    }
})

//get data from signup page
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

app.listen(3000, () => {
    console.log("port connected")
})