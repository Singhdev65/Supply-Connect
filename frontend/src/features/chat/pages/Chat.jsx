import React, { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { ConversationList, ChatPanel } from "../components";
import ErrorBoundary from "@/shared/ui/ErrorBoundary";
import { useChat } from "../hooks";
import { useAuth } from "@/shared/hooks";

export default function Chat() {
  const { user } = useAuth();
  const location = useLocation();
  const conversationId = location?.state?.conversationId;

  const {
    conversations,
    messages,
    activeChat,
    setActiveChat,
    sendMessage,
    conversationsLoading,
    messagesLoading,
    sending,
    handleTyping,
    handleStopTyping,
    typingUsers,
    onlineUsers,
  } = useChat(user?.id);

  useEffect(() => {
    if (!conversationId || !conversations.length) return;

    const conversation = conversations.find((c) => c._id === conversationId);
    if (conversation) setActiveChat(conversation);
  }, [conversationId, conversations, setActiveChat]);

  const enhancedConversations = useMemo(
    () =>
      conversations.map((conversation) => ({
        ...conversation,
        currentUser: user,
      })),
    [conversations, user],
  );

  return (
    <ErrorBoundary>
      <div className="flex h-[calc(100vh-70px)] overflow-hidden bg-gray-100">
        <ConversationList
          conversations={enhancedConversations}
          activeChat={activeChat}
          onlineUsers={onlineUsers}
          onConversationSelect={setActiveChat}
          loading={conversationsLoading}
        />

        <ChatPanel
          activeChat={activeChat}
          messages={messages}
          sendMessage={sendMessage}
          handleTyping={handleTyping}
          handleStopTyping={handleStopTyping}
          typingUsers={typingUsers}
          onlineUsers={onlineUsers}
          loading={messagesLoading}
          sending={sending}
          currentUser={user}
        />
      </div>
    </ErrorBoundary>
  );
}
