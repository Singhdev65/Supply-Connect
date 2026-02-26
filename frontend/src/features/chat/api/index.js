import API from "@/api/api";
import { API_ENDPOINTS } from "@/utils/constants";

export const getConversationsApi = async () => {
  const { data } = await API.get(API_ENDPOINTS.CONVERSATIONS);
  return data;
};

export const createConversationApi = async ({ participantId }) => {
  const { data } = await API.post(API_ENDPOINTS.CONVERSATIONS, { participantId });
  return data;
};

export const getMessagesByConversationApi = async (conversationId) => {
  const { data } = await API.get(
    API_ENDPOINTS.MESSAGES_BY_CONVERSATION(conversationId),
  );
  return data;
};

export const markConversationMessagesReadApi = async (conversationId) => {
  const { data } = await API.put(API_ENDPOINTS.MARK_MESSAGES_READ(conversationId));
  return data;
};

export const sendMessageApi = async ({ conversationId, text }) => {
  const { data } = await API.post(API_ENDPOINTS.MESSAGES, { conversationId, text });
  return data;
};

