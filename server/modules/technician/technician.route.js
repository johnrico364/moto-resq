import express from "express";
import upload from "../../middlewear/multer.js";
import {
  createTechnician,
  getAllTechnicians,
  getTechnicianById,
  updateTechnician,
} from "./technician.controller.js";

const router = express.Router();

router.post("/", upload.single("image"), createTechnician);
router.get("/", getAllTechnicians);
router.get("/:id", getTechnicianById);
router.patch("/:id", upload.single("image"), updateTechnician);

export default router;
