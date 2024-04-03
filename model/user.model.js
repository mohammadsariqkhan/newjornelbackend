import mongoose from "mongoose";
import * as string_decoder from "string_decoder";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String , required:true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token:{type:String},
    role:{type:String},
    file_urlAndTitle:[
        {
            title:{
            type:String,required:true
            },
            urls:{
            type:String,require:true
            }
        }
    ]
});

// Create a model based on the schema
const User = mongoose.model('User', userSchema);

export default User
