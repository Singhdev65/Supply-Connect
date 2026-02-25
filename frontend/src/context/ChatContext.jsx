import useChat from "../hooks/useChat";
import { createContext } from "react";

export const ChatContext = createContext();

export const ChatProvider = ({ user, children }) => {
  const chat = useChat(user?.id);

  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>;
};
