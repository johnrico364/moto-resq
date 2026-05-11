import express from "express";
import {
  getSummary,
  getNewRequests,
  getNewUsers,
  getRecentActivity,
} from "./dashboard.controller.js";

const router = express.Router();

router.get("/summary", getSummary);
router.get("/new-requests", getNewRequests);
router.get("/new-users", getNewUsers);
router.get("/recent-activity", getRecentActivity);

export default router;
