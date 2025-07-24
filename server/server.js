const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://your-frontend.vercel.app" // Replace with actual frontend domain
    ],
    methods: ["GET", "POST"]
  }
});

let currentPoll = null;
let responses = [];

io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

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
    console.log("❌ Socket disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
