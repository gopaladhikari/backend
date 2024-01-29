import { Schema, Model, model } from "mongoose";
import { IComment } from "./model.js";

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },

    videoId: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Comment: Model<IComment> = model<IComment>(
  "Comment",
  commentSchema
);
