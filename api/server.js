// api/server.js
import { Server } from "socket.io";

let io;

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("🔌 Initializing Socket.IO...");

    io = new Server(res.socket.server, {
      path: "/api/socketio",
      addTrailingSlash: false,
      cors: {
        origin: [
          "http://localhost:3000",
          "https://your-frontend.vercel.app" // ✅ Replace with actual frontend URL
        ],
        methods: ["GET", "POST"]
      }
    });

    let currentPoll = null;
    let responses = [];

    io.on("connection", (socket) => {
      console.log("✅ New socket connected:", socket.id);

      if (currentPoll) {
        socket.emit("newPoll", currentPoll);
      }

      socket.on("createPoll", (pollData) => {
        currentPoll = pollData;
        responses = [];
        io.emit("newPoll", pollData);
      });

      socket.on("submitAnswer", (answerData) => {
        responses.push(answerData);
        io.emit("pollUpdate", responses);
      });

      socket.on("endPoll", () => {
        currentPoll = null;
        responses = [];
        io.emit("pollEnded");
      });

      socket.on("disconnect", () => {
        console.log("❌ Disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("⚡ Socket.IO already running");
  }

  res.end();
}
