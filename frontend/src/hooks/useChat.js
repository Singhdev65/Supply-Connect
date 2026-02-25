import { useEffect, useState, useCallback } from "react";
import API from "../api/api";

import {
  connectSocket,
  disconnectSocket,
  joinConversation,
  leaveConversation,
  listenEvents,
  sendTyping,
  sendStopTyping,
} from "../utils/socket";

import { normalizeMessage } from "../utils/normalizeMessage";

const useChat = (userId) => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [typingUsers, setTypingUsers] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchConversations = useCallback(async () => {
    if (!userId) return;

    const res = await API.get("/conversations");
    setConversations(res.data?.data || []);
  }, [userId]);

  const fetchMessages = useCallback(async (conversationId) => {
    if (!conversationId) return;

    setLoading(true);

    const res = await API.get(`/messages/${conversationId}`);

    const normalized = res.data?.data?.map(normalizeMessage) || [];

    setMessages(normalized);

    await API.put(`/messages/read/${conversationId}`);

    setLoading(false);
  }, []);

  const sendMessage = useCallback(
    async (text) => {
      if (!text || !activeChat) return;

      try {
        await API.post("/messages", {
          conversationId: activeChat._id,
          text,
        });
      } catch (err) {
        console.error("Send message failed:", err);
      }
    },
    [activeChat],
  );

  useEffect(() => {
    if (!userId) return;

    connectSocket(userId);

    const cleanup = listenEvents({
      onMessage: (message) => {
        const normalized = normalizeMessage(message);

        setMessages((prev) => {
          if (prev.some((m) => m._id === normalized._id)) return prev;

          return [...prev, normalized];
        });
      },

      onHistory: (history) => {
        setMessages(history.map(normalizeMessage));
      },

      onTyping: ({ conversationId }) => {
        setTypingUsers((prev) => ({
          ...prev,
          [conversationId]: true,
        }));
      },

      onStopTyping: ({ conversationId }) => {
        setTypingUsers((prev) => ({
          ...prev,
          [conversationId]: false,
        }));
      },

      onOnlineUsers: setOnlineUsers,
    });

    return () => {
      cleanup();
      disconnectSocket();
    };
  }, [userId]);

  useEffect(() => {
    if (!activeChat?._id) return;

    joinConversation(activeChat._id);
    fetchMessages(activeChat._id);

    return () => leaveConversation(activeChat._id);
  }, [activeChat?._id, fetchMessages]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const startChat = useCallback(
    async (participantId) => {
      const res = await API.post("/conversations", {
        participantId,
      });

      const conversation = res.data?.data;

      setActiveChat(conversation);
      fetchConversations();

      return conversation;
    },
    [fetchConversations],
  );

  useEffect(() => {
    if (!conversations.length || !userId) return;

    const totalUnread = conversations.reduce((total, conv) => {
      return total + (conv.unreadCount || 0);
    }, 0);

    setUnreadCount(totalUnread);
  }, [conversations, userId]);

  const handleTyping = () => {
    if (!activeChat) return;

    sendTyping(activeChat._id, {
      id: userId,
      name: "You",
    });
  };

  const handleStopTyping = () => {
    if (!activeChat) return;

    sendStopTyping(activeChat._id, {
      id: userId,
      name: "You",
    });
  };

  return {
    conversations,
    messages,
    activeChat,
    setActiveChat,
    sendMessage,
    typingUsers,
    onlineUsers,
    loading,
    startChat,
    unreadCount,
    handleStopTyping,
    handleTyping,
  };
};

export default useChat;
