import { Schema, Model, model } from "mongoose";
import { IPlaylist } from "./model.js";

const playlistSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    tracks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Playlist: Model<IPlaylist> = model<IPlaylist>(
  "Playlist",
  playlistSchema
);
