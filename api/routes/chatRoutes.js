import express from "express";
import { createChat, sendMessage } from "../controllers/chatController.js";

const router = express.Router();

router.post("/create", createChat);
router.post("/message", sendMessage);

export default router;
