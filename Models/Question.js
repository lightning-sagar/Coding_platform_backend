import mongoose,{ Schema } from "mongoose";

const QuesSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true
    },
    input:{
        type:String,
        required:true
    },
    expectedOutput:{
        type:String,
        required:true
    },
    contestId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Contest"
    },
    difficulty:{
        type:String,
        required:true
    },
    timeLimit:Number,
    points:Number,
    mermoryLimit:Number
})

export default mongoose.model('Ques',QuesSchema)