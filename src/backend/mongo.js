const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/react-login")
.then(() => {
    console.log("mongodb connected");
})
.catch(()=> {
    console.log('failed');
})

//creating database schema for mongodb 
const newSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    }, 
    password:{
        type:String, 
        required:true
    }

})

const collection = mongoose.model("collection", newSchema)

module.exports = collection

//mongodb+srv://dhruvraval04:llV5QvYvpsecJPiK@serverlessinstance0.indklss.mongodb.net/?retryWrites=true&w=majority&appName=ServerlessInstance0