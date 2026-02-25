import React, { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatMessages({
  messages,
  typingUsers,
  activeChat,
  currentUser,
}) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  const currentUserId = currentUser?.id || currentUser?._id;

  const isTyping = typingUsers?.[activeChat?._id];

  return (
    <div className="flex-1 overflow-y-auto px-10 py-6 space-y-5">
      {messages.map((msg) => {
        const isMine = msg.sender?._id === currentUserId;

        return <MessageBubble key={msg._id} message={msg} isMine={isMine} />;
      })}

      {isTyping && <MessageBubble isTyping />}

      <div ref={endRef} />
    </div>
  );
}
