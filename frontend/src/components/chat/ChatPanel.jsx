import React, { useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

export default function ChatPanel({
  activeChat,
  messages,
  sendMessage,
  handleTyping,
  handleStopTyping,
  typingUsers,
  onlineUsers,
  loading,
  currentUser,
}) {
  const [inputValue, setInputValue] = useState("");

  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a conversation
      </div>
    );
  }

  const handleSend = (text) => {
    sendMessage(text);
    setInputValue("");
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f7f9fc]">
      <ChatHeader activeChat={activeChat} onlineUsers={onlineUsers} />

      <ChatMessages
        messages={messages}
        typingUsers={typingUsers}
        activeChat={activeChat}
        currentUser={currentUser}
      />

      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
        onTyping={handleTyping}
        onStopTyping={handleStopTyping}
        disabled={loading}
      />
    </div>
  );
}
