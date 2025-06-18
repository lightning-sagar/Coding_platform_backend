import mongoose,{ Schema } from "mongoose";

const ContestSchema = new Schema({
    quesId:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Ques"
        }
    ],
    userId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    createdby:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    contesttitle:{
        type:String,
        required:true
    },
    contestdesc :{
        type:String,
        required:true
    },
    startTime:{
        type:Date,
        required:true
    },
    endTime:{
        type:Date,
        required:true
    },
})

export default mongoose.model('Contest',ContestSchema)