import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { dbHandler } from "../utils/dbHandler.js";
import { registerSchema } from "../schema/register.schema.js";
import { LoginUser, RegisterUser, UserDetails } from "./controller.js";
import { loginSchema } from "../schema/login.schema.js";
import { passwordChangeSchema } from "../schema/passwordChange.schema.js";
import { RequestWithUser } from "../models/model.js";
import { updateUserSchema } from "../schema/updateUserDetail.schema.js";

const options = {
  httpOnly: true,
  secure: true,
};

const { REFRESH_TOKEN_SECRET } = process.env;

const generateAccessAndRefreshToken = async (id: string) => {
  const user = await User.findById(id);

  if (!user) throw new ApiError(400, "User not found");

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

const registerUser = dbHandler(async (req, res) => {
  const userData: RegisterUser = req.body;

  const result = registerSchema.safeParse(userData);

  if (result.success === false) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    throw new ApiError(400, "Validation Error", errors);
  }

  const existedUser = await User.findOne({ email: userData.email });

  if (existedUser)
    throw new ApiError(409, "User already exist with this email.");

  const user = await User.create(userData);

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) throw new ApiError(400, "User not created");

  res
    .status(201)
    .json(new ApiResponse(201, "User created", { user: createdUser }));
});

const loginUser = dbHandler(async (req, res) => {
  const credential: LoginUser = req.body;

  const result = loginSchema.safeParse(credential);

  if (result.success === false) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    throw new ApiError(400, "Validation Error", errors);
  }

  const existedUser = await User.findOne({ email: credential.email });
  if (!existedUser) throw new ApiError(400, "User not found");

  const isPasswordCorrect = await existedUser.isPasswordCorrect(
    credential.password
  );
  if (!isPasswordCorrect) throw new ApiError(400, "Incorrect password");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    existedUser._id
  );

  const loginedUser = await User.findById(existedUser._id).select(
    "-password -refreshToken"
  );
  res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(200, "Login successful", {
        user: loginedUser,
        accessToken,
        refreshToken,
      })
    );
});

const logoutUser = dbHandler(async (req: RequestWithUser, res) => {
  const { _id } = req.user!;

  const user = await User.findByIdAndUpdate(_id, {
    $unset: { refreshToken: 1 },
  }).select("-password -refreshToken");

  if (!user) throw new ApiError(400, "User not found");

  res
    .status(200)
    .clearCookie("refreshToken")
    .clearCookie("accessToken")
    .json(new ApiResponse(200, "Logout successful", { user }));
});

const refreshAccessToken = dbHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  const decodedRefreshToken = jwt.verify(
    incomingRefreshToken,
    REFRESH_TOKEN_SECRET!
  ) as JwtPayload;

  const user = await User.findById(decodedRefreshToken._id).select("-password");

  if (!user) throw new ApiError(400, "User not found");

  if (user.refreshToken !== incomingRefreshToken)
    throw new ApiError(400, "Invalid refresh token");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, "Refresh successful", {
        accessToken,
        refreshToken,
      })
    );
});

const updatePassword = dbHandler(async (req: RequestWithUser, res) => {
  const id = req.user?._id;
  const passwords = req.body;
  const result = passwordChangeSchema.safeParse(passwords);
  if (result.success === false) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    throw new ApiError(400, "Validation Error", errors);
  }

  const user = await User.findById(id).select("-password -refreshToken");
  if (!user) throw new ApiError(400, "User not found");

  const isPasswordCorrect = user.isPasswordCorrect(passwords.oldPassword);

  if (!isPasswordCorrect) throw new ApiError(400, "Incorrect password");

  user.password = passwords.newPassword;
  await user.save({ validateBeforeSave: false });
  res
    .status(200)
    .json(new ApiResponse(200, "Password updated successfully", user));
});

const updateUserDetails = dbHandler(async (req: RequestWithUser, res) => {
  const id = req.user?._id;
  const details: UserDetails = req.body;
  const result = updateUserSchema.safeParse(details);

  if (result.success === false) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    throw new ApiError(400, "Validation Error", errors);
  }

  const user = await User.findByIdAndUpdate(
    id,
    {
      $set: { ...details },
    },
    { new: true }
  ).select("-password -refreshToken");

  res
    .status(200)
    .json(new ApiResponse(200, "User details updated successfully", user));
});

const getCurrentUser = dbHandler(async (req: RequestWithUser, res) => {
  const user = req.user;
  res.status(200).json(new ApiResponse(200, "User found", { user }));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  updatePassword,
  updateUserDetails,
  getCurrentUser,
};
