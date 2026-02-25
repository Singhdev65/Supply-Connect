import React, { useState, useEffect, useMemo } from "react";
import ConversationItem from "./ConversationItem";
import { Search } from "lucide-react";

function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

function SearchBar({ value, onChange }) {
  return (
    <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
      <Search size={16} className="text-gray-400" />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search conversations..."
        className="bg-transparent ml-2 outline-none w-full text-sm"
      />
    </div>
  );
}

export default function ConversationList({
  conversations,
  activeChat,
  onlineUsers,
  onConversationSelect,
  loading,
}) {
  const [search, setSearch] = useState("");

  /* =========================
     DEBOUNCE SEARCH
  ========================= */
  const debouncedSearch = useDebounce(search, 400);

  /* =========================
     FILTER LOGIC
  ========================= */
  const filteredConversations = useMemo(() => {
    if (!debouncedSearch.trim()) return conversations;

    const query = debouncedSearch.toLowerCase();

    return conversations.filter((conversation) => {
      const currentUserId =
        conversation.currentUser?.id || conversation.currentUser?._id;

      const otherUser = conversation.participants?.find(
        (p) => (p.id || p._id) !== currentUserId,
      );

      return (
        otherUser?.name?.toLowerCase().includes(query) ||
        conversation.lastMessage?.toLowerCase().includes(query)
      );
    });
  }, [debouncedSearch, conversations]);

  return (
    <div className="w-[340px] bg-white flex flex-col border-r">
      {/* HEADER */}
      <div className="p-5">
        <h2 className="text-xl font-semibold mb-4">Messages</h2>

        <SearchBar value={search} onChange={setSearch} />
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-6 text-gray-400">Loading...</div>
        ) : filteredConversations.length ? (
          filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation._id}
              conversation={conversation}
              activeChat={activeChat}
              onlineUsers={onlineUsers}
              onClick={onConversationSelect}
            />
          ))
        ) : (
          <div className="p-6 text-gray-400 text-center">
            No conversations found
          </div>
        )}
      </div>
    </div>
  );
}
