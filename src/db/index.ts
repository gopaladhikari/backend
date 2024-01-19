import mongoose from "mongoose";
import { config } from "dotenv";

config();

const { MONGO_URI } = process.env;

export const connectDb = async () => {
  try {
    mongoose.connect(`${MONGO_URI}/express`);
  } catch (error) {
    console.log(`MongoDB connection error: ${error}`);
    process.exit(1);
  }
};
