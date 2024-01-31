import { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { dbHandler } from "../utils/dbHandler.js";
import { RequestWithUser } from "../models/model.js";

const createPlaylist = dbHandler(async (req: RequestWithUser, res) => {
  const { name, description } = req.body;

  if (!name) throw new ApiError(400, "Name is required");
  if (!description) throw new ApiError(400, "Description is required");

  const user = req.user;
  if (!user) throw new ApiError(400, "User not found");

  try {
    const playlist = await Playlist.create({
      name,
      description,
      owner: user._id,
      tracks: [],
    });

    res.status(200).json(
      new ApiResponse(200, "Playlist created successfully", {
        playlist,
      })
    );
  } catch (error) {
    throw new ApiError(500, "Error while creating playlist");
  }
});

const getUserPlaylists = dbHandler(async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid user id");

  const playList = await Playlist.find({ owner: userId });

  if (!playList) throw new ApiError(400, "Playlists not found");

  res.status(200).json(
    new ApiResponse(200, "Playlists found successfully", {
      playList,
    })
  );
});

const getPlaylistById = dbHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(404, "Invalid playlist id");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "No playlist found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Playlists fetched successfully", { playlist }));
});

const addVideoToPlaylist = dbHandler(async (req: RequestWithUser, res) => {
  const { playlistId, videoId } = req.params;
  const userId = req.user?._id;

  if (!userId) throw new ApiError(400, "User not found");

  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId))
    throw new ApiError(400, "Invalid playlist ID or video ID");

  try {
    const updatedPlaylist = await Playlist.findOneAndUpdate(
      { _id: playlistId, owner: userId }, // Ensure ownership
      { $addToSet: { videos: videoId } },
      { new: true }
    );

    return res.status(200).json(
      new ApiResponse(200, "Video added to the playlist successfully", {
        updatedPlaylist,
      })
    );
  } catch (error) {
    throw new ApiError(500, "Error while adding video to playlist");
  }
});

const removeVideoFromPlaylist = dbHandler(async (req: RequestWithUser, res) => {
  const { playlistId, videoId } = req.params;
  const userId = req.user?._id;

  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId))
    throw new ApiError(400, "Invalid playlist ID or video ID");

  try {
    const updatedPlaylist = await Playlist.findOneAndUpdate(
      { _id: playlistId, owner: userId }, // Ensure ownership
      { $pull: { videos: videoId } },
      { new: true }
    );

    return res.status(200).json(
      new ApiResponse(200, "Video removed from playlist successfully", {
        updatedPlaylist,
      })
    );
  } catch (error) {
    throw new ApiError(500, "Error while adding video to the playlist");
  }
});

const deletePlaylist = dbHandler(async (req: RequestWithUser, res) => {
  const { playlistId } = req.params;
  const userId = req.user?._id;

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(404, "Invalid playlist id");
  }

  try {
    const playlist = await Playlist.findByIdAndDelete({
      _id: playlistId,
      owner: userId,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, "playlist deleted successfully", { playlist })
      );
  } catch (error) {
    throw new ApiError(500, "Error while deleting playlist");
  }
});

const updatePlaylist = dbHandler(async (req: RequestWithUser, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  const userId = req.user?._id;

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(404, "Invalid playlist id");
  }

  if (!name) {
    throw new ApiError(404, "Please provide a name");
  }

  try {
    const playlist = await Playlist.findByIdAndUpdate(
      { _id: playlistId, owner: userId },
      {
        $set: {
          name: name,
          description: description,
        },
      },
      { new: true }
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, "playlist updated successfully", { playlist })
      );
  } catch (error) {
    throw new ApiError(500, "Error while updating playlist");
  }
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
