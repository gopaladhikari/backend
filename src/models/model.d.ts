import { Document } from "mongoose";
import { Request } from "express";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  refreshToken: string;
  avatar: string;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export interface RequestWithUser extends Request {
  user?: IUser;
}

export interface ISubscription extends Document {
  channel: string;
  subscriber: string;
}

export interface IComment extends Document {
  content: string;
  owner: string;
}

export interface ILike extends Document {
  video: string;
  comment: string;
  tweet: string;
  likedBy: string;
}

export interface IPlaylist extends Document {
  name: string;
  description: string;
  owner: string;
  tracks: string[];
}

export interface ITweet extends Document {
  comment: string;
  tweet: string;
  owner: string;
}
