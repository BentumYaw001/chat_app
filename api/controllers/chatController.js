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
    const { chatId, sender, content } = req.body;

    if (!chatId || !sender || !content) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newMessage = new Message({ chatId, sender, content });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error" });
  }
};
