import React from "react";

export default function ConversationItem({
  conversation,
  activeChat,
  onlineUsers,
  onClick,
}) {
  const currentUserId =
    conversation.currentUser?.id || conversation.currentUser?._id;

  const otherUser = conversation.participants.find(
    (p) => (p.id || p._id) !== currentUserId,
  );

  console.log(otherUser, "otherUser");

  const isOnline =
    otherUser && onlineUsers?.includes(otherUser.id || otherUser._id);

  const isActive = activeChat?._id === conversation._id;

  return (
    <div
      onClick={() => onClick(conversation)}
      className={`flex items-center gap-3 px-5 py-4 cursor-pointer transition
      ${isActive ? "bg-gray-100" : "hover:bg-gray-50"}`}
    >
      {/* Avatar */}
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-semibold capitalize">
          {otherUser?.name?.[0]}
        </div>

        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
        )}
      </div>

      {/* Name + Message */}
      <div className="flex-1 overflow-hidden">
        <h4 className="font-medium truncate capitalize">{otherUser?.name}</h4>

        <p className="text-sm text-gray-500 truncate">
          {conversation.lastMessage || "Start chatting"}
        </p>
      </div>

      {conversation.unreadCount > 0 && (
        <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
          {conversation.unreadCount}
        </span>
      )}
    </div>
  );
}
