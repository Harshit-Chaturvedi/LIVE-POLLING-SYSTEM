const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://your-frontend.vercel.app",
      "https://live-polling-system-xvcf.onrender.com" // your backend itself
    ],
    methods: ["GET", "POST"]
  }
});

// ✅ Health-check endpoint
app.get("/", (req, res) => {
  res.send("✅ Live Polling Backend is running!");
});

// (Optional) Add any other REST endpoints under "/api" here

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
    io.emit("newPoll", currentPoll);
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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
