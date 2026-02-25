const eventBus = require("../events/eventBus");
const EVENTS = require("../events/chat.events");

module.exports = function registerSocketHandlers(io) {
  console.log("✅ Socket Event Handlers Registered");

  eventBus.on(EVENTS.MESSAGE_CREATED, (message) => {
    io.to(message.conversation.toString()).emit("receiveMessage", message);
  });

  eventBus.on(EVENTS.MESSAGE_READ, ({ conversationId, userId }) => {
    io.to(conversationId).emit("messagesRead", { userId });
  });
};
