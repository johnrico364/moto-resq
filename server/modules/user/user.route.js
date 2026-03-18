import express from "express";
import upload from "../../middlewear/multer.js";
import {
  signupUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getUserById,
  updateUser,
  getUserVehicles,
  addUserVehicle,
  updateUserVehicle,
  deleteUserVehicle,
} from "./user.controller.js";

const router = express.Router();

// auth
router.post("/auth/signup", upload.single("image"), signupUser);
router.post("/auth/signin", loginUser);
router.patch("/auth/logout/:id", logoutUser);

// users
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.patch("/:id", upload.single("image"), updateUser);

// user vehicles (more specific routes first)
router.get("/:id/vehicles", getUserVehicles);
router.post("/:id/vehicles", addUserVehicle);
router.patch("/:id/vehicles/:vehicleId", updateUserVehicle);
router.delete("/:id/vehicles/:vehicleId", deleteUserVehicle);

// Error handler for multer limits (e.g., fileSize)
router.use((err, req, res, next) => {
  if (err && err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "File size exceeds 5MB limit",
    });
  }
  next(err);
});

export default router;
