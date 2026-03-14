import express from "express";
import { getChat, sendMessage } from "./chat.controller.js";

const router = express.Router();

router.get("/:request_id", getChat);
router.post("/:request_id/messages", sendMessage);

export default router;
