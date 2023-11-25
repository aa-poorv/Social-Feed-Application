import { Schema, model } from "mongoose";

const commentSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    feed: {
      type: Schema.Types.ObjectId,
      ref: "Feed",
    },
  },
  { timestamps: true }
);

const Comment = model("Comment", commentSchema);

export default Comment;
