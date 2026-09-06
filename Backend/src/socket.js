const { Server } = require("socket.io");

let io;
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: frontendUrl,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {

    socket.on("joinPartner", (partnerId) => {
      socket.join(partnerId.toString());
    });
    socket.on("joinUser", (userId) => {
      socket.join(userId.toString());
      console.log("User joined room:", userId);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket not initialized");
  }
  return io;
};

module.exports = { initSocket, getIO };