import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    accountType:{
        type: String,
        enum:["student","creator"],
        required:true
    },
    attemptContest:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"ContestAttempt"
        }
    ]
},{timestamps:true})

export default mongoose.model('User', userSchema)