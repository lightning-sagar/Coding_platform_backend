import mongoose,{ Schema } from "mongoose";

const ContestAttemptSchema = new Schema({
    contestId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Contest"
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    quesAttempt:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Ques"
        }
    ],
    starttime:Date,
    totalTimeTaken:Date,
    attemptques:Number,
    Total_Score: Number,
},{timestamps:true})

export default mongoose.model('ContestAttempt',ContestAttemptSchema)