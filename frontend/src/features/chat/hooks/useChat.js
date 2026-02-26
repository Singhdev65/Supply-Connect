import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import {
  createConversationApi,
  getConversationsApi,
  getMessagesByConversationApi,
  markConversationMessagesReadApi,
  sendMessageApi,
} from "@/features/chat/api";

import {
  connectSocket,
  disconnectSocket,
  joinConversation,
  leaveConversation,
  listenEvents,
  sendTyping,
  sendStopTyping,
} from "@/utils/socket";

import { normalizeMessage } from "@/utils/normalizeMessage";

const getConversationId = (message) =>
  message?.conversation?._id || message?.conversationId || message?.conversation || null;

const getSenderId = (message) =>
  message?.senderId || message?.sender?._id || message?.sender || null;

const sortByLastActivity = (items = []) =>
  [...items].sort((a, b) => {
    const aTime = new Date(a?.lastMessageAt || a?.updatedAt || 0).getTime();
    const bTime = new Date(b?.lastMessageAt || b?.updatedAt || 0).getTime();
    return bTime - aTime;
  });

const useChat = (userId) => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [typingUsers, setTypingUsers] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const typingTimeoutRef = useRef(null);

  const fetchConversations = useCallback(async () => {
    if (!userId) return;
    setConversationsLoading(true);
    try {
      const data = await getConversationsApi();
      setConversations(sortByLastActivity(data?.data || []));
    } finally {
      setConversationsLoading(false);
    }
  }, [userId]);

  const fetchMessages = useCallback(async (conversationId) => {
    if (!conversationId) return;

    setMessagesLoading(true);
    try {
      const data = await getMessagesByConversationApi(conversationId);
      const normalized = data?.data?.map(normalizeMessage) || [];
      setMessages(normalized);
      await markConversationMessagesReadApi(conversationId);
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === conversationId ? { ...conv, unreadCount: 0 } : conv,
        ),
      );
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  const sendMessage = useCallback(
    async (text) => {
      if (!text || !activeChat) return;

      const tempId = `temp-${Date.now()}`;
      const optimisticMessage = normalizeMessage({
        _id: tempId,
        conversation: activeChat._id,
        sender: { _id: userId, name: "You" },
        text,
        createdAt: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        _optimistic: true,
      });

      setMessages((prev) => [...prev, optimisticMessage]);
      setSending(true);

      try {
        const payload = await sendMessageApi({
          conversationId: activeChat._id,
          text,
        });
        const saved = normalizeMessage(payload?.data || payload);

        setMessages((prev) =>
          prev.map((message) => (message._id === tempId ? saved : message)),
        );

        setConversations((prev) =>
          sortByLastActivity(
            prev.map((conv) =>
              conv._id === activeChat._id
                ? {
                    ...conv,
                    lastMessage: saved?.text || text,
                    lastMessageAt: saved?.createdAt || new Date().toISOString(),
                  }
                : conv,
            ),
          ),
        );
      } catch (err) {
        console.error("Send message failed:", err);
        setMessages((prev) => prev.filter((message) => message._id !== tempId));
      } finally {
        setSending(false);
      }
    },
    [activeChat, userId],
  );

  useEffect(() => {
    if (!userId) return;

    connectSocket(userId);

    const cleanup = listenEvents({
      onMessage: (message) => {
        const normalized = normalizeMessage(message);
        const conversationId = getConversationId(normalized);
        const senderId = getSenderId(normalized);
        const belongsToActiveChat = conversationId && conversationId === activeChat?._id;
        const isOwnMessage = String(senderId) === String(userId);

        if (belongsToActiveChat) {
          setMessages((prev) => {
            const withoutTemp = prev.filter((m) => !(m._optimistic && m.text === normalized.text));
            if (withoutTemp.some((m) => m._id === normalized._id)) return withoutTemp;
            return [...withoutTemp, normalized];
          });

          if (!isOwnMessage) {
            markConversationMessagesReadApi(conversationId).catch(() => null);
          }
        }

        setConversations((prev) => {
          const exists = prev.some((conv) => conv._id === conversationId);
          if (!exists) {
            fetchConversations();
            return prev;
          }

          return sortByLastActivity(
            prev.map((conv) => {
              if (conv._id !== conversationId) return conv;
              const nextUnread =
                belongsToActiveChat || isOwnMessage ? 0 : Number(conv.unreadCount || 0) + 1;
              return {
                ...conv,
                lastMessage: normalized.text || conv.lastMessage,
                lastMessageAt: normalized.createdAt || new Date().toISOString(),
                unreadCount: nextUnread,
              };
            }),
          );
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
  }, [activeChat?._id, fetchConversations, userId]);

  useEffect(() => {
    if (!activeChat?._id) return;

    joinConversation(activeChat._id);
    fetchMessages(activeChat._id);
    setConversations((prev) =>
      prev.map((conv) => (conv._id === activeChat._id ? { ...conv, unreadCount: 0 } : conv)),
    );

    return () => leaveConversation(activeChat._id);
  }, [activeChat?._id, fetchMessages]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const startChat = useCallback(
    async (participantId) => {
      const data = await createConversationApi({
        participantId,
      });

      const conversation = data?.data;

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

  const handleTyping = useCallback(() => {
    if (!activeChat) return;

    sendTyping(activeChat._id, {
      id: userId,
      name: "You",
    });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      sendStopTyping(activeChat._id, {
        id: userId,
        name: "You",
      });
    }, 1200);
  }, [activeChat, userId]);

  const handleStopTyping = useCallback(() => {
    if (!activeChat) return;
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    sendStopTyping(activeChat._id, {
      id: userId,
      name: "You",
    });
  }, [activeChat, userId]);

  const sortedConversations = useMemo(() => sortByLastActivity(conversations), [conversations]);

  useEffect(
    () => () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    },
    [],
  );

  return {
    conversations: sortedConversations,
    messages,
    activeChat,
    setActiveChat,
    sendMessage,
    typingUsers,
    onlineUsers,
    conversationsLoading,
    messagesLoading,
    sending,
    startChat,
    unreadCount,
    handleStopTyping,
    handleTyping,
  };
};

export default useChat;
