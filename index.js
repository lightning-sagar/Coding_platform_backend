import express from "express"
import cors from "cors";
import 'dotenv/config'
import { connectdb } from "./db/db.js";
import cookieParser from "cookie-parser"
import UserRoute from "./route/user.route.js"
import ContestRoute from "./route/contest.route.js"
import SubmitRoute from  "./route/submit.route.js"

const app = express();
app.use(cors("*"))
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
connectdb();

app.use('/api/user',UserRoute)
app.use('/api/contest',ContestRoute)
app.use('/api/submit',SubmitRoute)

const port = process.env.PORT
app.listen(port,()=>{
    console.log(`running on port ${port}`)
})