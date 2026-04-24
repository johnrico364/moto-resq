import express from "express";
import { getRecentActivity } from "./activity_log.controller.js";

const router = express.Router();

router.get("/recent", getRecentActivity);

export default router;
