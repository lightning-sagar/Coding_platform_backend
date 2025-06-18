import express from "express";
import { protectRoute } from "../Middleware/protectRoute.js";
import { loginController, logoutController, signupController } from "../controller/user.controller.js";

const route = express.Router();


route.post('/signup',signupController)
route.post('/login',loginController)
route.post('/logout',logoutController)

export default route;