import express from "express";
import upload from "../../middlewear/multer.js";
import {
  createTechnician,
  getAllTechnicians,
  getTechnicianById,
  updateTechnician,
  softDeleteTechnician,
  uploadDocuments,
} from "./technician.controller.js";

const router = express.Router();

router.post("/", upload.single("image"), createTechnician);
router.get("/", getAllTechnicians);
router.get("/:id", getTechnicianById);
router.patch("/:id", upload.single("image"), updateTechnician);
router.delete("/:id", softDeleteTechnician);
router.post("/documents", upload.array("images"), uploadDocuments);

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
