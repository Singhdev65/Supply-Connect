export const normalizeMessage = (message) => {
  if (!message) return message;

  let senderId = null;

  if (typeof message.sender === "string") {
    senderId = message.sender;
  } else if (message.sender?._id) {
    senderId = message.sender._id;
  } else if (message.senderId) {
    senderId = message.senderId;
  }

  return {
    ...message,
    sender: {
      _id: senderId,
      name: message.sender?.name || "",
    },
  };
};
