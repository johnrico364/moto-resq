import express from "express";
import { getChat } from "./chat.controller.js";

const router = express.Router();

router.get("/:id", getChat);

export default router;