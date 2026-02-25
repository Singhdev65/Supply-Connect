import React from "react";

export default function ChatHeader({ activeChat, onlineUsers }) {
  const getOtherUser = (conversation) => {
    if (!conversation?.participants || !conversation?.currentUser?.id)
      return null;

    return (
      conversation.participants.find(
        (p) => p._id !== conversation.currentUser.id,
      ) || null
    );
  };

  const otherUser = getOtherUser(activeChat);

  const isOnline = onlineUsers?.includes(otherUser?.id || otherUser?._id);

  return (
    <div className="bg-white px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center">
            {otherUser?.name?.[0]}
          </div>

          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
          )}
        </div>

        <div>
          <h3 className="font-semibold capitalize">{otherUser?.name}</h3>
          <p className="text-xs text-gray-400">
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>
    </div>
  );
}
