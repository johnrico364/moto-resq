import express from "express";
import upload from "../../middlewear/multer.js";
import { createServiceRequest } from "./service_request.controller.js";

const router = express.Router();

router.post("/", upload.single("image"), createServiceRequest);

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
