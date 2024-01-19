import express, { Response } from "express";

const app = express();

app.get("/", (_, res: Response) => {
  res.json({ message: "Hi from express!" });
});

export { app };
