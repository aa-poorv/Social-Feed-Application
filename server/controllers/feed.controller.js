import Feed from "../models/feed.model.js";
import Comment from "../models/comment.model.js";

export const getFeed = async (req, res, next) => {
  try {
    const { id } = req.params;
    const feed = await Feed.findById(id).populate("owner").populate("comments");
    const totalComments = await Comment.find({ feed: id }).count();
    res.status(200).json({ ...feed.toObject(), totalComments });
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const page = parseInt(req.query.page) || 1;
    const { id } = req.params;

    const comments = await Comment.find({ feed: id })
      .populate("owner")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const postComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { comment } = req.body;

    const newComment = new Comment({
      message: comment,
      owner: userId,
      feed: id,
    });

    newComment.save();

    res.status(201).json("New Comment has been created");
  } catch (error) {
    next(error);
  }
};
