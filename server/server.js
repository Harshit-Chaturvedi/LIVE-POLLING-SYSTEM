const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // You can restrict this later
    methods: ["GET", "POST"]
  }
});

// ======================
// 🔌 Socket.IO Logic
// ======================
let currentPoll = null;
let responses = [];

io.on("connection", (socket) => {
  console.log("🔌 New socket connected:", socket.id);

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
    console.log("❌ Client disconnected:", socket.id);
  });
});

// ======================
// ⚙️ Serve React frontend
// ======================
app.get("*", (req, res) => {
  try {
    res.sendFile(path.join(buildPath, "index.html"));
  } catch (err) {
    console.error("Static serve error:", err);
    res.status(500).send("Server error");
  }
});


// ======================
// 🚀 Start the server
// ======================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
