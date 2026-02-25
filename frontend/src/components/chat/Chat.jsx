import React, { useContext, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ConversationList, ChatPanel } from "./index";
import { ErrorBoundary } from "../../components";
import useChat from "../../hooks/useChat";

export default function Chat() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  let conversationId = location?.state?.conversationId;

  const {
    conversations,
    messages,
    activeChat,
    setActiveChat,
    sendMessage,
    loading,
    handleTyping,
    handleStopTyping,
    typingUsers,
    onlineUsers,
  } = useChat(user?.id);

  useEffect(() => {
    if (!conversationId || !conversations.length) return;

    const conversation = conversations.find((c) => c._id === conversationId);

    if (conversation) setActiveChat(conversation);
  }, [conversationId, conversations]);

  const enhancedConversations = conversations.map((conv) => ({
    ...conv,
    currentUser: user,
  }));

  return (
    <ErrorBoundary>
      <div className="h-[calc(100vh-70px)] flex bg-gray-100 overflow-hidden">
        <ConversationList
          conversations={enhancedConversations}
          activeChat={activeChat}
          onlineUsers={onlineUsers}
          onConversationSelect={setActiveChat}
          loading={loading}
        />

        <ChatPanel
          activeChat={activeChat}
          messages={messages}
          sendMessage={sendMessage}
          handleTyping={handleTyping}
          handleStopTyping={handleStopTyping}
          typingUsers={typingUsers}
          onlineUsers={onlineUsers}
          loading={loading}
          currentUser={user}
        />
      </div>
    </ErrorBoundary>
  );
}
