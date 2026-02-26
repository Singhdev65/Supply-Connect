import React, { useEffect, useRef, useState, memo, useCallback } from "react";
import { Send } from "lucide-react";

export const ChatPanel = memo(
  ({
    activeChat,
    messages = [],
    sendMessage,
    handleTyping,
    handleStopTyping,
    typingUsers,
    onlineUsers = [],
    loading,
    sending,
    currentUser,
  }) => {
    const [messageText, setMessageText] = useState("");
    const [messageError, setMessageError] = useState("");
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const MAX_MESSAGE_LENGTH = 500;

    const currentUserId =
      currentUser?.id || currentUser?._id || currentUser?.userId;

    useEffect(() => {
      const container = messagesContainerRef.current;
      if (!container) return;
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      if (distanceFromBottom < 120) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }, [messages]);

    const handleSendMessage = useCallback(
      (e) => {
        e.preventDefault();

        const trimmed = messageText.trim();
        if (!trimmed || !activeChat) return;
        if (trimmed.length > MAX_MESSAGE_LENGTH) {
          setMessageError(`Message should be under ${MAX_MESSAGE_LENGTH} characters`);
          return;
        }

        sendMessage(trimmed);
        setMessageText("");
        setMessageError("");
      },
      [messageText, activeChat, sendMessage],
    );

    const handleInputChange = useCallback(
      (e) => {
        const nextValue = e.target.value;
        setMessageText(nextValue);
        if (nextValue.trim().length > MAX_MESSAGE_LENGTH) {
          setMessageError(`Message should be under ${MAX_MESSAGE_LENGTH} characters`);
        } else {
          setMessageError("");
        }

        if (activeChat) {
          handleTyping(activeChat._id);
        }
      },
      [activeChat, handleTyping],
    );

    const handleInputBlur = useCallback(() => {
      if (activeChat) {
        handleStopTyping(activeChat._id);
      }
    }, [activeChat, handleStopTyping]);

    if (!activeChat) {
      return (
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <p className="text-gray-500">Select a chat to start messaging</p>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        <div className="border-b border-gray-200 p-4 bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {activeChat.participantName?.[0]?.toUpperCase() || "?"}
                </span>
              </div>

              {onlineUsers.includes(activeChat.participantId) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                {activeChat.participantName}
              </h3>
              <p className="text-xs text-gray-500">
                {onlineUsers.includes(activeChat.participantId) ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        </div>

        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-white to-gray-50"
        >
          {loading ? (
            <p className="text-center text-gray-500">Loading messages...</p>
          ) : messages.length > 0 ? (
            <>
              {messages.map((message) => {
                const senderId =
                  message.senderId || message.sender?._id || message.sender;
                const isSentByCurrentUser =
                  String(senderId) === String(currentUserId);

                return (
                  <div
                    key={message._id}
                    className={`flex ${
                      isSentByCurrentUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-sm px-4 py-2.5 rounded-2xl shadow-sm ${
                        isSentByCurrentUser
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isSentByCurrentUser ? "text-blue-100" : "text-gray-400"
                        }`}
                      >
                        {new Date(
                          message.timestamp || message.createdAt,
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}

              {typingUsers?.[activeChat._id] && (
                <p className="text-xs text-gray-500">
                  {activeChat.participantName} is typing...
                </p>
              )}

              <div ref={messagesEndRef} />
            </>
          ) : (
            <p className="text-center text-gray-500">No messages yet.</p>
          )}
        </div>

        <form
          onSubmit={handleSendMessage}
          className="border-t border-gray-200 p-4 bg-white"
        >
          <div className="flex gap-3">
            <input
              value={messageText}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={!messageText.trim() || Boolean(messageError)}
              className="px-4 py-3 bg-blue-600 text-white rounded-full disabled:bg-gray-300"
            >
              <Send size={18} />
            </button>
          </div>
          {messageError && <p className="mt-2 text-xs text-red-600">{messageError}</p>}
          {sending && <p className="mt-2 text-xs text-gray-500">Sending...</p>}
        </form>
      </div>
    );
  },
);

ChatPanel.displayName = "ChatPanel";
