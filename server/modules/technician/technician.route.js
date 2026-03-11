import express from "express";
import upload from "../../middlewear/multer.js";
import {
  createTechnician,
  getAllTechnicians,
  getTechnicianById,
  updateTechnician,
  softDeleteTechnician,
} from "./technician.controller.js";

const router = express.Router();

router.post("/", upload.single("image"), createTechnician);
router.get("/", getAllTechnicians);
router.get("/:id", getTechnicianById);
router.patch("/:id", upload.single("image"), updateTechnician);
router.delete("/:id", softDeleteTechnician);

export default router;
