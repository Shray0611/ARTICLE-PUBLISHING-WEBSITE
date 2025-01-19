import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    authorName: {type:String},
    email:{type:String, required:true},
    password:{type:String, required:true},
}, 
{timestamps:true})

module.exports = mongoose.model('User', userSchema)
