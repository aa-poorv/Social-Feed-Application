import { Schema, model } from "mongoose";

const feedSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

feedSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "feed",
});

const Feed = model("Feed", feedSchema);

export default Feed;
