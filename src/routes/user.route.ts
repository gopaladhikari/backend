import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

// routes
userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);

// secured routes
import { verifyJwt } from "../middlewares/auth.middleware.js";

userRouter.route("/logout").post(verifyJwt, logoutUser);

export { userRouter };
