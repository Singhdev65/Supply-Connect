import React, { useState, useMemo, memo, useCallback } from "react";
import { MessageCircle, Search } from "lucide-react";

export const ConversationList = memo(
  ({
    conversations = [],
    activeChat,
    onlineUsers = [],
    onConversationSelect,
    loading,
  }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = useCallback((e) => {
      setSearchTerm(e.target.value);
    }, []);

    const conversationsWithUser = useMemo(() => {
      return conversations.map((conv) => {
        const currentUserId = conv?.currentUser?.id;
        const otherUser = conv.participants?.find((p) => p._id !== currentUserId);

        return {
          ...conv,
          participantName: otherUser?.name || "Unknown",
          participantId: otherUser?._id,
        };
      });
    }, [conversations]);

    const filteredConversations = useMemo(() => {
      const term = searchTerm.trim().toLowerCase();
      if (!term) return conversationsWithUser;
      return conversationsWithUser.filter((conv) =>
        conv.participantName.toLowerCase().includes(term),
      );
    }, [searchTerm, conversationsWithUser]);

    return (
      <div className="w-80 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 h-full flex flex-col shadow-lg">
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Messages</h2>
          </div>

          <div className="relative">
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Loading...</p>
              </div>
            </div>
          ) : filteredConversations.length > 0 ? (
            <div className="space-y-1 p-2">
              {filteredConversations.map((conversation) => {
                const isOnline = onlineUsers.includes(conversation.participantId);
                const isActive = activeChat?._id === conversation._id;
                const unread = Number(conversation.unreadCount || 0);

                return (
                  <button
                    key={conversation._id}
                    onClick={() => onConversationSelect(conversation)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <div
                          className={`w-10 h-10 rounded-full ${
                            isActive ? "bg-blue-700" : "bg-gray-300"
                          } flex items-center justify-center`}
                        >
                          <span className="text-sm text-white font-semibold">
                            {conversation.participantName[0]?.toUpperCase()}
                          </span>
                        </div>

                        {isOnline && (
                          <span
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${
                              isActive
                                ? "bg-green-400 border-blue-600"
                                : "bg-green-500 border-white"
                            }`}
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`truncate ${
                            unread > 0 && !isActive ? "font-semibold" : "font-medium"
                          } ${isActive ? "text-white" : "text-gray-900"}`}
                        >
                          {conversation.participantName}
                        </p>

                        <p
                          className={`text-xs truncate mt-1 ${
                            isActive ? "text-blue-100" : "text-gray-500"
                          }`}
                        >
                          {conversation.lastMessage || "No messages yet"}
                        </p>
                      </div>

                      {unread > 0 && !isActive && (
                        <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                          {unread}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <MessageCircle size={48} className="text-gray-300 mb-2" />
              <p className="text-gray-500 text-sm">
                {searchTerm ? "No conversations found" : "No conversations yet"}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  },
);

ConversationList.displayName = "ConversationList";
