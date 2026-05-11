import express from "express";
import {
  getSummary,
  getNewRequests,
  getNewUsers,
  getRecentActivity,
  getRequestsOverview,
} from "./dashboard.controller.js";

const router = express.Router();

router.get("/summary", getSummary);
router.get("/new-requests", getNewRequests);
router.get("/new-users", getNewUsers);
router.get("/recent-activity", getRecentActivity);
router.get("/requests-overview", getRequestsOverview);

export default router;
