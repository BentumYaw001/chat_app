import { Server } from "socket.io";
import Message from "../models/Message.js";

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(" A user connected:", socket.id);

    // User joins a chat room
    socket.on("joinRoom", async (chatId) => {
      try {
        socket.join(chatId);
        console.log(` User joined chat room: ${chatId}`);

        // Fetch previous messages for the chat
        const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
        socket.emit("previousMessages", messages);
      } catch (error) {
        console.error(" Error fetching messages:", error);
      }
    });

    socket.on("sendMessage", async ({ chatId, sender, content }) => {
      try {
        // Check if all required fields are present
        if (!chatId || !sender || !content) {
          console.error("Missing required fields in sendMessage event");
          return;
        }

        // Convert sender to ObjectId if it's a string (e.g., "user123")
        let senderId;
        try {
          senderId = mongoose.Types.ObjectId(sender); // Convert to ObjectId
        } catch (error) {
          console.error("Invalid sender ID format:", sender);
          return;
        }

        // Create the new message
        const newMessage = new Message({
          chatId,
          sender: senderId, // Store the sender as ObjectId
          content, // Store the message content
        });

        // Save the message to the database
        const savedMessage = await newMessage.save();

        // Emit the saved message to the room (chatId)
        io.to(chatId).emit("receiveMessage", savedMessage);
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
      console.log(" A user disconnected:", socket.id);
    });
  });

  return io;
};

export default setupSocket;
