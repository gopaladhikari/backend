import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { dbHandler } from "../utils/dbHandler.js";
import { RequestWithUser } from "../models/model.js";
import mongoose, { isValidObjectId } from "mongoose";

const getVideoComments = dbHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  let { page = 1, limit = 10 } = req.query;

  page = Number(page) || 1;
  limit = Number(limit) || 10;

  const comments = await Comment.aggregate([
    {
      $match: {
        videoId: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: limit,
    },
  ]);

  if (!comments) throw new ApiError(404, "Comments not found");

  res.status(200).json(
    new ApiResponse(200, "Comments found successfully", {
      comments,
    })
  );
});

const addComment = dbHandler(async (req: RequestWithUser, res) => {
  const { videoId } = req.params;

  if (!videoId) throw new ApiError(400, "Video id is required");

  const { content } = req.body;

  if (!content) throw new ApiError(400, "Content is required");

  const user = req.user;
  if (!user) throw new ApiError(400, "User not found");

  const comment = await Comment.create({ content, videoId, owner: user._id });

  const createdComment = await Comment.findById(comment._id);

  if (!createdComment) throw new ApiError(400, "Comment not created");

  res.status(200).json(
    new ApiResponse(200, "Comment created successfully", {
      comment: createdComment,
    })
  );
});

const updateComment = dbHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!isValidObjectId(commentId))
    throw new ApiError(400, "Invalid comment id");

  const { content } = req.body;
  if (!content) throw new ApiError(400, "Content is required");

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    { $set: { content } },
    { new: true }
  );
  if (!updatedComment) throw new ApiError(400, "Comment not found");

  res.status(200).json(
    new ApiResponse(200, "Comment updated successfully", {
      comment: updatedComment,
    })
  );
});

const deleteComment = dbHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;

  if (!commentId) throw new ApiError(400, "Comment id is required");

  const deletedComment = await Comment.findByIdAndDelete(commentId);
  if (!deletedComment) throw new ApiError(400, "Comment not found");

  res.status(200).json(
    new ApiResponse(200, "Comment deleted successfully", {
      comment: deletedComment,
    })
  );
});

export { getVideoComments, addComment, updateComment, deleteComment };
