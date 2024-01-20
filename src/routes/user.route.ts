import express from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";

const userRouter = express.Router();

// routes
userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);

// secured routes

export { userRouter };
