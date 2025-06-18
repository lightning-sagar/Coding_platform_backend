import express from "express";  
import { protectRoute } from "../Middleware/protectRoute.js";
import { submitCode } from "../controller/submit.controller.js";
import multer  from 'multer'
const upload = multer({ dest: 'uploads/' })

const route = express.Router();

route.post('/',upload.single('code'),protectRoute,submitCode)

export default route;