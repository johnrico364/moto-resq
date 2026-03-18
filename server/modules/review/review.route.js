import express from "express";

import {
  createReview,
  getReviewsByTechnician,
  getReviewsByUser,
  updateReview,
  softDeleteReview,
} from "./review.controller.js";

const router = express.Router();

router.post("/", createReview);
router.get("/technician/:technician_id", getReviewsByTechnician);
router.get("/me/:user_id", getReviewsByUser);
router.patch("/:id", updateReview);
router.delete("/:id", softDeleteReview);

export default router;
