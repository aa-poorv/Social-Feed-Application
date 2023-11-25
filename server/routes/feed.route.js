import express from "express";
import {
  getComments,
  getFeed,
  postComment,
} from "../controllers/feed.controller.js";
import { verifyAccessToken } from "../helper/jwt_helper.js";

const router = express.Router();

router.route("/:id").get(getFeed);

router
  .route("/comment/:id")
  .post(verifyAccessToken, postComment)
  .get(getComments);

export default router;
