import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { dbHandler } from "../utils/dbHandler.js";

const createTweet = dbHandler(async (req, res) => {
  //TODO: create tweet
});

const getUserTweets = dbHandler(async (req, res) => {
  // TODO: get user tweets
});

const updateTweet = dbHandler(async (req, res) => {
  //TODO: update tweet
});

const deleteTweet = dbHandler(async (req, res) => {
  //TODO: delete tweet
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
