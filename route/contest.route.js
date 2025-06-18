import express from "express";
import {
  createcontest,
  allContest,
  fetch_multiple,
  startContest,
  rankcontest
} from "../controller/contest.controller.js";
import { protectRoute } from "../Middleware/protectRoute.js";
const route = express.Router();

route.post("/create", protectRoute, createcontest);
route.get("/", protectRoute, allContest);
route.post("/fetch-multiple", protectRoute, fetch_multiple);
route.post("/start", protectRoute, startContest);
route.get("/rankings/:cid", protectRoute, rankcontest);

export default route;
