import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://icon-library.com/images/avatar-icon-images/avatar-icon-images-4.jpg",
    },
  },
  { timestamps: true }
);

userSchema.statics.checkUser = async function (username, password) {
  const foundUser = await this.findOne({ username: username });
  let isValid = false;
  if (foundUser) {
    isValid = await bcrypt.compare(password, foundUser.password);
  }

  return isValid ? foundUser : false;
};

const User = mongoose.model("User", userSchema);

export default User;
