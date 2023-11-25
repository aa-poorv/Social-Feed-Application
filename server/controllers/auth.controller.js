import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import { signAccessToken } from "../helper/jwt_helper.js";

export const signup = async (req, res, next) => {
  const { username, name, password } = req.body;
  try {
    console.log("Hello Hello");
    console.log(username, name, password);
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, name, password: hashedPassword });
    res.status(201).json("User created Successfully!!");
  } catch (err) {
    next(errorHandler(550, "Error from the function"));
  }
};

export const signin = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const validUser = await User.checkUser(username, password);
    if (!validUser)
      return next(errorHandler(404, "email/password is not valid"));
    const token = await signAccessToken(validUser.id);
    res.cookie("jwt", token, { httpOnly: true });
    const { password: _, ...userData } = validUser._doc;
    res.status(200).json(userData);
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const id = req.userId;
    const user = await User.findById(id);
    if (user) {
      res.clearCookie("jwt");
      res.status(200).json("User is logged out");
    } else res.status(404).json("Logout failed due to user not found");
  } catch (err) {
    next(err);
  }
};
