const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
// const multer = require("multer");

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

// Configure multer for file upload
// const upload = multer({ dest: "uploads/" });

// Handle WebSocket connections here
io.on("connection", (socket) => {
  console.log("A new user has connected", socket.id);

  // create a room for the user
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User with ID: ${socket.id} joined room: ${room}`);
  });

  // Listen for incoming messages from clients
  socket.on("message", (message) => {
    // Emit the message to clients in the same room
    io.to(message.room).emit("message", message);
  });

  // Handle file uploads
  // socket.on("file", upload.single("file"), (data) => {
  //   const { room, timestamp, id, avatar } = data;
  //   const file = req.file; // Uploaded file object
  //   // Handle file processing (save to disk, etc.)
  //   // Emit the file data to clients in the same room
  //   io.to(room).emit("file", { file, timestamp, id, avatar });
  // });

  // Exit the room
  socket.on("exit_room", (room) => {
    socket.leave(room);
    console.log("User left room: ", room);
  });

  // Handle disconnections
  socket.on("disconnect", () => {
    console.log(socket.id, " disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
