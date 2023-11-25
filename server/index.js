import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import feedRouter from "./routes/feed.route.js";
import cookieParser from "cookie-parser";
import path from "path";
const app = express();

// cookieParser middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/feed", feedRouter);

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.static(path.resolve("../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve("../client/dist/index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server is listening on port 3000...");
});
