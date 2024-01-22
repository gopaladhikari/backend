import { Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { dbHandler } from "../utils/dbHandler.js";
import { IUser } from "../models/model.js";

const { ACCESS_TOKEN_SECRET } = process.env;

interface CustomRequest extends Request {
  user?: IUser;
}

export const verifyJwt = dbHandler(async (req: CustomRequest, res, next) => {
  const incomingAccessToken =
    req.cookies["accessToken"] ||
    req.headers.authorization?.replace("Bearer ", "");

  if (!incomingAccessToken) throw new ApiError(400, "Unauthorized request");

  const decodedToken = jwt.verify(
    incomingAccessToken,
    ACCESS_TOKEN_SECRET!
  ) as JwtPayload;

  const user = await User.findById(decodedToken._id).select(
    "-password -refreshToken"
  );

  if (!user) throw new ApiError(400, "User not found");

  req.user = user;

  next();
});
