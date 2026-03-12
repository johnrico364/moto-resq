import path from "path";
import fs from "fs/promises";
import validator from "validator";
import bcrypt from "bcrypt";

import Technician from "./technician.model.js";

async function deleteTechnicianImageIfExists(imgPath) {
  if (!imgPath) return;
  try {
    await fs.unlink(imgPath);
  } catch (err) {
    if (err.code !== "ENOENT")
      console.error("Failed to delete technician image:", err);
  }
}

export const TechnicianService = {
  // CREATE TECHNICIAN =========================================
  async createTechnician(data, profileImage) {
    const img_path = profileImage
      ? path.join("images", "technician", profileImage)
      : null;

    if (!data?.email || !validator.isEmail(data.email)) {
      await deleteTechnicianImageIfExists(img_path);
      throw new Error("Invalid email format");
    }
    if (!data?.password || !validator.isStrongPassword(data.password)) {
      await deleteTechnicianImageIfExists(img_path);
      throw new Error(
        "Password must contain one capital letter and one special character",
      );
    }

    const existing = await Technician.findOne({
      email: data.email.toLowerCase(),
    });
    if (existing) {
      await deleteTechnicianImageIfExists(img_path);
      throw new Error("Email already registered");
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(data.password, salt);

    try {
      console.log({
        ...data,
        password: hashPassword,
        profile_image: profileImage || undefined,
      });
      const technician = await Technician.create({
        ...data,
        password: hashPassword,
        profile_image: profileImage,
      });

      const result = technician.toObject();
      return result;
    } catch (err) {
      await deleteTechnicianImageIfExists(img_path);
      throw err;
    }
  },
  // GET ALL TECHNICIANS =========================================
  async getAllTechnicians() {
    const technicians = await Technician.find({ is_deleted: { $ne: true } });
    return technicians;
  },
  // GET TECHNICIAN BY ID =========================================
  async getTechnicianById(id) {
    const technician = await Technician.findOne({
      _id: id,
      is_deleted: { $ne: true },
    });
    return technician;
  },
  // UPDATE TECHNICIAN =========================================
  async updateTechnician(id, data, profileImage) {
    const technician = await Technician.findOne({
      _id: id,
      is_deleted: { $ne: true },
    });
    if (!technician) throw new Error("Technician not found");

    const updateFields = { ...data };

    if (data?.email !== undefined) {
      if (!validator.isEmail(data.email)) {
        if (profileImage) await deleteTechnicianImageIfExists(path.join("images", "technician", profileImage));
        throw new Error("Invalid email format");
      }
      const existing = await Technician.findOne({
        email: data.email.toLowerCase(),
        _id: { $ne: id },
      });
      if (existing) {
        if (profileImage) await deleteTechnicianImageIfExists(path.join("images", "technician", profileImage));
        throw new Error("Email already registered");
      }
      updateFields.email = data.email.toLowerCase();
    }

    if (data?.password) {
      if (!validator.isStrongPassword(data.password)) {
        if (profileImage) await deleteTechnicianImageIfExists(path.join("images", "technician", profileImage));
        throw new Error(
          "Password must contain one capital letter and one special character",
        );
      }
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(data.password, salt);
    }

    if (profileImage) {
      const oldImg = technician.profile_image;
      if (oldImg && oldImg !== "default.png") {
        const oldPath = path.join("images", "technician", oldImg);
        await deleteTechnicianImageIfExists(oldPath);
      }
      updateFields.profile_image = profileImage;
    }

    const updated = await Technician.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true },
    );
    return updated.toObject();
  },
  // SOFT DELETE TECHNICIAN =========================================
  async softDeleteTechnician(id) {
    const technician = await Technician.findOne({
      _id: id,
      is_deleted: { $ne: true },
    });
    if (!technician) throw new Error("Technician not found");

    await Technician.findByIdAndUpdate(id, {
      $set: { is_deleted: true, deleted_at: new Date() },
    });
    return { message: "Technician deleted successfully" };
  },
  // UPLOAD TECHNICIAN DOCUMENTS =======================================
  async uploadTechnicianDocuments() {
    
  }
};
