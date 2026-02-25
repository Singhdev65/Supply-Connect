import { useEffect, useState } from "react";
export default function ChatWindow({
  currentUserId,
  role,
  buyerId,
  vendorId,
  onClose,
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const room = buyerId && vendorId ? `chat_${buyerId}_${vendorId}` : null;

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
  }, []);

  useEffect(() => {
    if (!buyerId || !vendorId) {
      console.warn("Missing buyerId or vendorId");
      return;
    }

    socket.emit("joinRoom", { buyerId, vendorId });

    socket.on("chatHistory", (history) => {
      setMessages(history);
    });

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chatHistory");
      socket.off("receiveMessage");
    };
  }, [buyerId, vendorId]);

  const sendMessage = () => {
    if (!input.trim()) return;
    if (!buyerId || !vendorId) return;

    socket.emit("sendMessage", {
      buyerId,
      vendorId,
      sender: currentUserId,
      role,
      content: input,
    });

    setInput("");
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h4>Chat</h4>
        <button onClick={onClose}>X</button>
      </div>

      <div className="chat-body">
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.role === role ? "right" : "left",
              marginBottom: "8px",
            }}
          >
            <strong>{msg.sender}</strong>
            <div>{msg.content}</div>
          </div>
        ))}
      </div>

      <div className="chat-footer">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
