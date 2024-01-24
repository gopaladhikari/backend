import { Schema, Model, model } from "mongoose";
import { ITweet } from "./model.js";

const tweetSchema = new Schema(
  {
    content: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
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

export const Tweet: Model<ITweet> = model<ITweet>("Tweet", tweetSchema);
