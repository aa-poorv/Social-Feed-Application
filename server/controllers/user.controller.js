import User from "../models/user.model.js";
import Feed from "../models/feed.model.js";
import { errorHandler } from "../utils/error.js";
import Comment from "../models/comment.model.js";

export const test = (req, res) => {
  res.json({
    message: "Hello This is the test Api!!",
  });
};

export const newFeed = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { message } = req.body;
    const feed = new Feed({ message, owner: userId });
    await feed.save();
    console.log(feed);
    res.status(201).json(feed);
  } catch (error) {
    next(error);
  }
};

export const userFeed = async (req, res, next) => {
  try {
    const id = req.userId;

    const feeds = await Feed.find({ owner: id });
    res.status(200).json(feeds);
  } catch (err) {
    next(err);
  }
};

export const userFeedSearch = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const page = parseInt(req.query.page) || 1;
    const searchTerm = req.query.searchTerm || "";

    console.log(searchTerm);

    const feeds = await Feed.find({
      message: { $regex: searchTerm, $options: "i" },
    })
      .populate("owner")
      .populate("comments")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    res.status(200).json(feeds);
  } catch (error) {
    next(error);
  }
};
