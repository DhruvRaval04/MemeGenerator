const mongoose = require("mongoose")
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI)
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
    },
    savedmemes:{
        type:Array,
        default:[]
    }

})

const collection = mongoose.model("collection", newSchema)

module.exports = collection

