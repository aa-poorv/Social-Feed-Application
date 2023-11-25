import express from "express";
import {
  newFeed,
  userFeed,
  userFeedSearch,
} from "../controllers/user.controller.js";
import { verifyAccessToken } from "../helper/jwt_helper.js";

const router = express.Router();

router.use(verifyAccessToken);

router.post("/feed/new", newFeed);

router.get("/feed", userFeed);

router.get("/search", userFeedSearch);

export default router;
