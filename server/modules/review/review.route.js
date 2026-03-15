import express from "express";

import { createReview, getReviewsByTechnician } from "./review.controller.js";

const router = express.Router();

router.post("/", createReview);
router.get("/technician/:technician_id", getReviewsByTechnician);

export default router;
