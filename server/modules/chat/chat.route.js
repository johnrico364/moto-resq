import express from "express";
import { getChat, sendMessage } from "./chat.controller.js";

const router = express.Router();

router.get("/:request", getChat);
router.post("/:request_id/messages", sendMessage);

export default router;
