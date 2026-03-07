import path from "path";
import fs from "fs/promises";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "./user.model.js";

async function deleteUserImageIfExists(imgPath) {
  if (!imgPath) return;
  try {
    await fs.unlink(imgPath);
  } catch (err) {
    if (err.code !== "ENOENT") console.error("Failed to delete user image:", err);
  }
}

export const UserService = {
  // SIGN UP USER ====================================
  async signupUser(data, userImage) {
    const img_path = userImage
      ? path.join("images", "user", userImage)
      : null;

    // Validations
    if (!data?.email || !validator.isEmail(data.email)) {
      await deleteUserImageIfExists(img_path);
      throw new Error("Invalid Email Format");
    }
    if (!data?.password || !validator.isStrongPassword(data.password)) {
      await deleteUserImageIfExists(img_path);
      throw new Error(
        "Password must contains one capital letter and one special character",
      );
    }

    const checkEmail = await User.findOne({ email: data.email });
    if (checkEmail) {
      await deleteUserImageIfExists(img_path);
      throw new Error("Email already exists");
    }

    // Hash and Salt Password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(data.password, salt);

    try {
      const createUser = await User.create({
        ...data,
        password: hashPassword,
        profile_image: userImage,
      });
      return createUser;
    } catch (err) {
      await deleteUserImageIfExists(img_path);
      throw err;
    }
  },
};
