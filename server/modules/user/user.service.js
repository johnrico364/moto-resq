import path from "path";
import fs from "fs/promises";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "./user.model.js";

/** Valid `expiresIn` for jsonwebtoken: seconds (number), or a short span like `"7d"`, `"12h"`. */
function resolveJwtExpiresIn() {
  const raw = process.env.JWT_EXPIRES?.trim();
  if (!raw) return "7d";
  if (/^\d+$/.test(raw)) return parseInt(raw, 10);
  if (/^\d+[smhdw]$/i.test(raw)) return raw;
  console.warn(
    `JWT_EXPIRES "${raw}" is invalid; using "7d". Examples: 3600, "1h", "7d".`,
  );
  return "7d";
}

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
      { expiresIn: resolveJwtExpiresIn() },
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
    user = await User.findByIdAndUpdate(
      id,
      { status: "inactive" },
      { returnDocument: "after" },
    );

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
  // UPDATE USER ===================================================================
  async updateUser(id, data) {
    // Get current user data to check existing profile_image
    const user = await User.findById(id);
    let oldImage = user?.profile_image;

    console.log(data?.profile_image);

    // If a new image is being set and it's different from the old one, remove the old image (unless it's default.png)
    if (
      data?.profile_image &&
      oldImage &&
      data.profile_image !== oldImage &&
      oldImage !== "default.png"
    ) {
      const imgPath = path.join("images", "user", oldImage);
      fs.unlink(imgPath, (err) => {
        if (err) {
          console.error(`Error deleting old user image: ${err}`);
        } else {
          console.log("Old user image deleted");
        }
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        ...data,
        profile_image: data?.profile_image,
      },
      { returnDocument: "after" },
    );
    return updatedUser;
  },
  // GET USER VEHICLES ===================================================================
  async getUserVehicles(id) {
    const user = await User.findById(id).select("vehicles");
    if (!user) {
      throw new Error("User not found");
    }
    return user.vehicles || [];
  },
  // ADD USER VEHICLE ===================================================================
  async addUserVehicle(id, vehicleData) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    if (!user.vehicles) {
      user.vehicles = [];
    }
    user.vehicles.push(vehicleData);
    await user.save();
    return user.vehicles[user.vehicles.length - 1];
  },
  // UPDATE USER VEHICLE ===================================================================
  async updateUserVehicle(userId, vehicleId, vehicleData) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const vehicle = user.vehicles?.id(vehicleId);
    if (!vehicle) {
      throw new Error("Vehicle not found");
    }
    if (vehicleData.type !== undefined) vehicle.type = vehicleData.type;
    if (vehicleData.brand !== undefined) vehicle.brand = vehicleData.brand;
    if (vehicleData.model !== undefined) vehicle.model = vehicleData.model;
    if (vehicleData.plate_number !== undefined) vehicle.plate_number = vehicleData.plate_number;
    await user.save();
    return vehicle;
  },
  // DELETE USER VEHICLE ===================================================================
  async deleteUserVehicle(userId, vehicleId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const vehicle = user.vehicles?.id(vehicleId);
    if (!vehicle) {
      throw new Error("Vehicle not found");
    }
    user.vehicles.pull(vehicleId);
    await user.save();
    return { deleted: true, vehicleId };
  },
};
