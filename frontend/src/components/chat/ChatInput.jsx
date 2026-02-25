import React, { useRef } from "react";
import { Send } from "lucide-react";

export default function ChatInput({
  value,
  onChange,
  onSend,
  onTyping,
  onStopTyping,
  disabled,
}) {
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (!value.trim()) return;

    onSend(value);
    onStopTyping();
    onChange("");

    textareaRef.current.style.height = "auto";
  };

  const handleChange = (e) => {
    onChange(e.target.value);
    e.target.value ? onTyping() : onStopTyping();

    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white  p-4">
      <div className="flex items-end gap-3 bg-gray-100 rounded-2xl px-4 py-2">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="
            flex-1
            bg-transparent
            outline-none
            resize-none
            max-h-40
            overflow-y-auto
          "
        />

        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className="
            bg-blue-600
            text-white
            p-2
            rounded-full
            hover:bg-blue-700
            hover:scale-105
            active:scale-95
            transition
            disabled:opacity-50
          "
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
