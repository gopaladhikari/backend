import { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { dbHandler } from "../utils/dbHandler.js";
import { Video } from "../models/video.model.js";

const getAllVideos = dbHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = dbHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
});

const getVideoById = dbHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video id");

  const video = Video.findOne({ _id: videoId });

  if (!video) throw new ApiError(404, "Video not found");

  res
    .status(200)
    .json(new ApiResponse(200, "Video found successfully", { video }));
});

const updateVideo = dbHandler(async (req, res) => {
  const { videoId } = req.params;

  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = dbHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video id");

  const deletedVideo = await Video.findByIdAndDelete(videoId);

  if (!deletedVideo) throw new ApiError(400, "Video not found");

  res.status(200).json(
    new ApiResponse(200, "Video deleted successfully", {
      video: deletedVideo,
    })
  );
});

const togglePublishStatus = dbHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video id");

  const video = await Video.findById(videoId);

  if (!video) throw new ApiError(400, "Video not found");

  video.isPublished = !video.isPublished;
  await video.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(new ApiResponse(200, "Video status updated successfully", { video }));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
