import JWT from "jsonwebtoken";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import dotenv from "dotenv";

dotenv.config();

export const signAccessToken = async (userId) => {
  try {
    const validUser = await User.findById(userId);
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const options = {
        expiresIn: "1d",
        issuer: "adfsdf.com",
        audience: userId,
      };
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) return reject(errorHandler(500, "Json internal server error"));

        resolve(token);
      });
    });
  } catch (err) {
    console.error(err);
  }
};

export const verifyAccessToken = (req, res, next) => {
  if (!req.cookies.jwt)
    return next(errorHandler(401, "Unauthorized to access this route."));
  const token = req.cookies.jwt;
  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      const message =
        err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
      return next(errorHandler(401, message));
    }
    req.userId = payload.aud;
    const id = payload.aud;
    User.findById(id)
      .then((data) => {
        if (data) {
          next();
        } else return next(errorHandler(404, "User not found"));
      })
      .catch((error) => next(errorHandler(500, error.message)));
  });
};

export const logoutChecker = (req, res, next) => {
  if (!req.cookies.jwt)
    return next(errorHandler(401, "Unauthorized to access this route."));
  const token = req.cookies.jwt;

  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err && err.name !== "TokenExpiredError") {
      return next(errorHandler(401, "Unauthorized"));
    } else if (err && err.name === "TokenExpiredError") {
      const payload = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, {
        ignoreExpiration: true,
      });
      req.userId = payload.aud;
    } else {
      req.userId = decoded.aud;
    }

    User.findById(req.userId)
      .then((data) => {
        if (data) next();
        else return next(errorHandler(404, "User not found"));
      })
      .catch((error) => next(errorHandler(500, error.message)));
  });
};
