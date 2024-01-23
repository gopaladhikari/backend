import express, { Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const { CORS_ORIGIN } = process.env;

app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// import routess

import { userRouter } from "./routes/user.route.js";

// declaration

app.use("/api/v1/user", userRouter);

app.get("/", (_, res: Response) => {
  res.json({ message: "Hi from express!" });
});

export { app };
