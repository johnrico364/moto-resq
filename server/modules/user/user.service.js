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
    if (err.code !== "ENOENT")
      console.error("Failed to delete user image:", err);
  }
}

export const UserService = {
  // SIGN UP USER ====================================
  async signupUser(data, userImage) {
    const img_path = userImage ? path.join("images", "user", userImage) : null;

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
  // LOGIN USER ====================================
  async loginUser(data) {
    // Validations
    const user = await User.findOne({ email: data.email });
    if (!user) {
      const error = new Error("Email not found");
      throw error;
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      const error = new Error("Invalid password");
      throw error;
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || "7d" },
    );

    const userObj = user.toObject();
    delete userObj.password;
    return { user: userObj, token };
  },
  // LOGOUT USER ====================================================================
  async logoutUser(id) {
    let user;

    user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    user = await User.findByIdAndUpdate(id, { status: "inactive" }, { new: true });

    return user;
  },
  // GET ALL USERS ===================================================================
  async getAllUsers() {
    const users = await User.find();
    return users;
  },
  // GET USER BY ID ===================================================================
  async getUserById(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
    },
};
