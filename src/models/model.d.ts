import { Document } from "mongoose";
import { Request } from "express";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  refreshToken: string;
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
