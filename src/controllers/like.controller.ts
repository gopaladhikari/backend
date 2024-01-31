import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { dbHandler } from "../utils/dbHandler.js";
import { RequestWithUser } from "../models/model.js";

const toggleVideoLike = dbHandler(async (req: RequestWithUser, res) => {
  const { videoId } = req.params;
  const { user } = req;

  if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video id");
  if (!user) throw new ApiError(400, "User not found");

  let like;
  let message = "";
  try {
    like = await Like.findOneAndDelete({
      video: videoId,
      likedBy: user._id,
    });
    message = "Like deleted successfully";
  } catch (error) {
    throw new ApiError(400, "Invalid videoId");
  }

  if (!like) {
    like = await Like.create({
      video: videoId,
      likedBy: user._id,
    });
    if (!like) {
      throw new ApiError(500, "Something went wrong during creating like");
    }
    message = "Like created successfully";
  }
  res.status(200).json(new ApiResponse(200, message, { like }));
});

const toggleCommentLike = dbHandler(async (req: RequestWithUser, res) => {
  const { commentId } = req.params;
  const { user } = req;
  if (!isValidObjectId(commentId))
    throw new ApiError(400, "Invalid comment id");

  if (!user) throw new ApiError(400, "User not found");

  let like;
  let message = "";
  try {
    like = await Like.findOneAndDelete({
      comment: commentId,
      likedBy: user._id,
    });
    message = "Like deleted successfully";
  } catch (error) {
    throw new ApiError(400, "Invalid videoId");
  }

  if (!like) {
    like = await Like.create({
      comment: commentId,
      likedBy: user._id,
    });
    if (!like) {
      throw new ApiError(500, "Something went wrong during creating like");
    }
    message = "Like created successfully";
  }
  res.status(200).json(new ApiResponse(200, message, { like }));
});

const toggleTweetLike = dbHandler(async (req: RequestWithUser, res) => {
  const { tweetId } = req.params;

  const { user } = req;
  if (!isValidObjectId(tweetId)) throw new ApiError(400, "Invalid tweet id");
  if (!user) throw new ApiError(400, "User not found");

  let like;
  let message = "";
  try {
    like = await Like.findOneAndDelete({
      tweet: tweetId,
      likedBy: user._id,
    });
    message = "Like deleted successfully";
  } catch (error) {
    throw new ApiError(400, "Invalid videoId");
  }

  if (!like) {
    like = await Like.create({
      tweet: tweetId,
      likedBy: user._id,
    });
    if (!like) {
      throw new ApiError(500, "Something went wrong during creating like");
    }
    message = "Like created successfully";
  }
  res.status(200).json(new ApiResponse(200, message, { like }));
});

const getLikedVideos = dbHandler(async (req: RequestWithUser, res) => {
  const { user } = req;
  if (!user) throw new ApiError(400, "User not found");

  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(user._id),
        video: {
          $exists: true,
        },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "likedVideos",
      },
    },
    {
      $unwind: "$likedVideos",
    },
    {
      $replaceRoot: {
        newRoot: "$likedVideos",
      },
    },
  ]);

  if (!likedVideos) {
    throw new ApiError(400, "Liked videos not found");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, "Liked videos fetched successfully", { likedVideos })
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
