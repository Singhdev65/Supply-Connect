const { Server } = require("socket.io");
const Message = require("../models/Message");
const registerSocketHandlers = require("./socket.handlers");

const onlineUsers = new Map();

let io;

function initializeSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:5174"],
      credentials: true,
    },
  });

  console.log("✅ Socket.IO initialized");

  registerSocketHandlers(io); // ⭐ EVENT LISTENERS

  io.on("connection", (socket) => {
    console.log("🟢 Connected:", socket.id);

    /* ---------------- ONLINE ---------------- */

    socket.on("userOnline", (userId) => {
      socket.userId = userId;

      if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());

      onlineUsers.get(userId).add(socket.id);

      io.emit("onlineUsers", [...onlineUsers.keys()]);
    });

    /* ---------------- JOIN ---------------- */

    socket.on("joinConversation", async (conversationId) => {
      socket.join(conversationId);

      const history = await Message.find({
        conversation: conversationId,
      })
        .populate("sender", "name")
        .sort({ createdAt: 1 });

      socket.emit("chatHistory", history);
    });

    socket.on("leaveConversation", (id) => {
      socket.leave(id);
    });

    /* ---------------- TYPING ---------------- */

    socket.on("typing", ({ conversationId, user }) => {
      socket.to(conversationId).emit("userTyping", {
        conversationId,
        user,
      });
    });

    socket.on("stopTyping", ({ conversationId, user }) => {
      socket.to(conversationId).emit("userStoppedTyping", {
        conversationId,
        user,
      });
    });

    /* ---------------- DISCONNECT ---------------- */

    socket.on("disconnect", () => {
      const userId = socket.userId;
      if (!userId) return;

      const sockets = onlineUsers.get(userId);

      if (sockets) {
        sockets.delete(socket.id);
        if (!sockets.size) onlineUsers.delete(userId);
      }

      io.emit("onlineUsers", [...onlineUsers.keys()]);
    });
  });

  return io;
}

module.exports = initializeSocket;
