import { useEffect, useState } from "react";
import io from "socket.io-client";

// Establish the socket connection
const socket = io("http://localhost:5000");

export default function Chat() {
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [joined, setJoined] = useState(false);

  // Assuming the logged-in user information is available (replace with actual user info)
  const currentUserId = "user123"; // Replace with your actual logic to get the logged-in user ID

  useEffect(() => {
    socket.on("previousMessages", (messages) => {
      setMessages(messages);
    });

    // Listen for new messages from other users
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Clean up the socket listeners when component unmounts
    return () => {
      socket.off("previousMessages");
      socket.off("receiveMessage");
    };
  }, []);

  const joinRoom = () => {
    if (room.trim() !== "") {
      socket.emit("joinRoom", room); // Join the chat room
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (input.trim() !== "" && room.trim() !== "") {
      // Emit the message with the required details
      socket.emit("sendMessage", {
        sender: currentUserId, // The user who is sending the message (use actual user ID)
        chatId: room, // The chat room's ID
        content: input, // The message content
      });
      setInput(""); // Clear the input field
    }
  };

  return (
    <div>
      <h2>Chat Rooms</h2>

      {!joined ? (
        <div>
          <input
            type="text"
            placeholder="Enter room name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      ) : (
        <div>
          <h3>Room: {room}</h3>
          <div>
            {messages.map((msg, index) => (
              <p key={index}>{msg.content}</p>
            ))}
          </div>
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}
