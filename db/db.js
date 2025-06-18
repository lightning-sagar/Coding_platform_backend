import moongose from "mongoose"

export const connectdb = async()=>{
    try {
        await moongose.connect(process.env.MONGO_ATLAS)
        console.log("connected to db");
    } catch (error) {
        console.log(`error while connecting db${error}`)
        process.exit(-1)
    }
}