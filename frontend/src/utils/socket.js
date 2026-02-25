import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket"],
  reconnection: true,
});

let currentUserId = null;

export const connectSocket = (userId) => {
  if (!userId) return;

  currentUserId = userId;

  if (!socket.connected) socket.connect();
};

socket.on("connect", () => {
  console.log("🟢 Socket Connected:", socket.id);

  if (currentUserId) {
    socket.emit("userOnline", currentUserId);
  }
});

socket.on("disconnect", (reason) => {
  console.log("🔴 Socket Disconnected:", reason);
});

export const joinConversation = (conversationId) => {
  socket.emit("joinConversation", conversationId);
};

export const leaveConversation = (conversationId) => {
  socket.emit("leaveConversation", conversationId);
};

export const sendTyping = (conversationId, user) => {
  socket.emit("typing", { conversationId, user });
};

export const sendStopTyping = (conversationId, user) => {
  socket.emit("stopTyping", { conversationId, user });
};

export const listenEvents = ({
  onMessage,
  onHistory,
  onTyping,
  onStopTyping,
  onOnlineUsers,
}) => {
  if (onMessage) socket.on("receiveMessage", onMessage);
  if (onHistory) socket.on("chatHistory", onHistory);
  if (onTyping) socket.on("userTyping", onTyping);
  if (onStopTyping) socket.on("userStoppedTyping", onStopTyping);
  if (onOnlineUsers) socket.on("onlineUsers", onOnlineUsers);

  return () => {
    socket.off("receiveMessage");
    socket.off("chatHistory");
    socket.off("userTyping");
    socket.off("userStoppedTyping");
    socket.off("onlineUsers");
  };
};

export const disconnectSocket = () => {
  socket.disconnect();
};
