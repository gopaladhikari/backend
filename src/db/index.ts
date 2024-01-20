import mongoose from "mongoose";
import { config } from "dotenv";
import { dbName } from "../constant.js";

config();

const { MONGO_URI } = process.env;

export const connectDb = async () => {
  try {
    mongoose.connect(`${MONGO_URI}/${dbName}`);
  } catch (error) {
    console.log(`MongoDB connection error: ${error}`);
    process.exit(1);
  }
};
