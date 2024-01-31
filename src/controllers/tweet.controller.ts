import { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { dbHandler } from "../utils/dbHandler.js";
import { RequestWithUser } from "../models/model.js";

const createTweet = dbHandler(async (req: RequestWithUser, res) => {
  const { content } = req.body;

  if (!content) throw new ApiError(400, "Content is required");

  const user = req.user;

  if (!user) throw new ApiError(400, "User not found");

  const createdTweet = await Tweet.create({
    content,
    owner: user._id,
  });

  const tweet = await Tweet.findById(createdTweet._id);

  if (!tweet) throw new ApiError(400, "Tweet not found");

  res
    .status(200)
    .json(new ApiResponse(200, "Tweet created successfully", { tweet }));
});

const getUserTweets = dbHandler(async (req: RequestWithUser, res) => {
  // TODO: get user tweets
  const user = req.user;

  const { tweetId } = req.params;

  if (!user) throw new ApiError(400, "User not found");
  if (!isValidObjectId(tweetId)) throw new ApiError(400, "Invalid tweed id");
});

const updateTweet = dbHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) throw new ApiError(400, "Invalid tweed id");

  const { content } = req.body;

  if (!content) throw new ApiError(400, "Content is required");

  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    { $set: { content } },
    { new: true }
  );

  if (!updatedTweet) throw new ApiError(400, "Tweet not found");

  res.status(200).json(
    new ApiResponse(200, "Tweet updated successfully", {
      tweet: updatedTweet,
    })
  );
});

const deleteTweet = dbHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!isValidObjectId(tweetId)) throw new ApiError(400, "Invalid tweed id");

  const deletedTweet = await Tweet.findByIdAndDelete(tweetId);
  if (!deletedTweet) throw new ApiError(400, "Tweet not found");

  res.status(200).json(
    new ApiResponse(200, "Tweet deleted successfully", {
      tweet: deletedTweet,
    })
  );
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
