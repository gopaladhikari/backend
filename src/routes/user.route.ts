import express from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updatePassword,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

// routes
userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/refresh-access-token").post(refreshAccessToken);

// auth check middlware
import { verifyJwt } from "../middlewares/auth.middleware.js";

// secured routes
userRouter.route("/logout").post(verifyJwt, logoutUser);
userRouter.route("/update-password").post(verifyJwt, updatePassword);

export { userRouter };
