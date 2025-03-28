import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

export const createChat = async (req, res) => {
  try {
    const { users, isGroup, groupName, groupPicture } = req.body;
    const chat = await Chat.create({ users, isGroup, groupName, groupPicture });
    res.status(201).json(chat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { sender, content, chatId } = req.body;
    const message = await Message.create({ sender, content, chatId });
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
