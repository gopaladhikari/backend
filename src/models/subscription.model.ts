import { Schema, Model, model } from "mongoose";
import { ISubscription } from "./model.js";

const subscriptionSchema = new Schema(
  {
    channel: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    subscriber: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Subscription: Model<ISubscription> = model<ISubscription>(
  "Subscription",
  subscriptionSchema
);
