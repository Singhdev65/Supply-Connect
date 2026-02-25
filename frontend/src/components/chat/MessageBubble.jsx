import React from "react";

export default function MessageBubble({ message, isMine, isTyping }) {
  if (isTyping) {
    return (
      <div className="flex">
        <div className="bg-white px-4 py-3 rounded-2xl shadow flex gap-1">
          <span className="typing-dot" />
          <span className="typing-dot delay-150" />
          <span className="typing-dot delay-300" />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isMine ? "justify-end" : ""}`}>
      <div
        className={`max-w-[55%] px-5 py-3 rounded-2xl text-sm shadow
        ${
          isMine
            ? "bg-blue-600 text-white rounded-br-sm"
            : "bg-white text-gray-800 rounded-bl-sm"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}
