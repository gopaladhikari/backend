import express from "express";
import {
  getCurrentUser,
  getUserChannelProfile,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updatePassword,
  updateUserDetails,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

// routes
userRouter.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser
);
userRouter.route("/login").post(loginUser);
userRouter.route("/refresh-access-token").post(refreshAccessToken);

// auth check middlware
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

// secured routes
userRouter.route("/get-current-user").get(verifyJwt, getCurrentUser);
userRouter.route("/channel/:email").get(verifyJwt, getUserChannelProfile);
userRouter.route("/update-user-details").patch(verifyJwt, updateUserDetails);
userRouter.route("/logout").post(verifyJwt, logoutUser);
userRouter.route("/update-password").post(verifyJwt, updatePassword);

export { userRouter };
