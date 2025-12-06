import React, { useState, useEffect, useRef } from "react";

interface Message {
  id: number;
  sender_id: number;
  content: string;
  created_at: string;
}

interface OnlineUser {
  id: number;
  username: string;
  avatar_url: string;
}

const ChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to WebSocket
    const token = localStorage.getItem("jwt");
    if (!token) return;

    const ws = new WebSocket(
      `ws://localhost:8000/api/v1/chat/ws?token=${token}`
    );
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      fetchOnlineUsers();
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "message") {
        setMessages((prev) => [...prev, data]);
      } else if (data.type === "presence_update") {
        fetchOnlineUsers();
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchOnlineUsers = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(
        "http://localhost:8000/api/v1/chat/online-users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const users = await response.json();
      setOnlineUsers(users);
    } catch (error) {
      console.error("Error fetching online users:", error);
    }
  };

  const sendMessage = () => {
    if (!inputValue.trim() || !wsRef.current || !isConnected) return;

    const messageData = {
      type: "message",
      content: inputValue,
      channel_id: 1, // Default channel for now
    };

    wsRef.current.send(JSON.stringify(messageData));
    setInputValue("");
  };

  return (
    <div
      className="card-glass"
      style={{
        display: "flex",
        height: "calc(100vh - 150px)",
        maxHeight: "700px",
        overflow: "hidden",
      }}
    >
      {/* Online Users Sidebar */}
      <div
        style={{
          width: "240px",
          borderRight: "1px solid rgba(236, 223, 204, 0.3)",
          padding: "1.25rem",
          background: "rgba(236, 223, 204, 0.5)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h3
          style={{
            fontSize: "0.875rem",
            fontWeight: "600",
            marginBottom: "1rem",
            color: "#181C14",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#10b981",
              display: "inline-block",
            }}
          ></span>
          Online ({onlineUsers.length})
        </h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {onlineUsers.map((user) => (
            <div
              key={user.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem",
                background: "rgba(255, 255, 255, 0.6)",
                backdropFilter: "blur(10px)",
                borderRadius: "var(--radius-md)",
                border: "1px solid rgba(236, 223, 204, 0.3)",
                fontSize: "0.875rem",
                color: "#181C14",
                transition: "all 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.8)";
                e.currentTarget.style.transform = "translateX(4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.6)";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <img
                src={user.avatar_url}
                alt={user.username}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  border: "2px solid #ECDFCC",
                  objectFit: "cover",
                }}
              />
              <span style={{ fontWeight: "500" }}>{user.username}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "rgba(236, 223, 204, 0.3)",
        }}
      >
        {/* Connection Status */}
        <div
          style={{
            padding: "0.75rem 1.25rem",
            borderBottom: "1px solid rgba(236, 223, 204, 0.3)",
            background: isConnected
              ? "rgba(16, 185, 129, 0.1)"
              : "rgba(239, 68, 68, 0.1)",
            fontSize: "0.875rem",
            fontWeight: "600",
            color: "#181C14",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: isConnected ? "#10b981" : "#ef4444",
              display: "inline-block",
            }}
          ></span>
          {isConnected ? "Connected" : "Disconnected"}
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            padding: "1.25rem",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          {messages.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "#697565",
                padding: "3rem 1rem",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💬</div>
              <div style={{ fontSize: "0.9375rem", fontWeight: "500" }}>
                No messages yet. Start chatting!
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className="card"
                style={{
                  padding: "1rem",
                  background: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(15px)",
                  border: "1px solid rgba(236, 223, 204, 0.4)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "0 2px 8px rgba(24, 28, 20, 0.08)",
                }}
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#697565",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                  }}
                >
                  User #{msg.sender_id}
                </div>
                <div
                  style={{
                    fontSize: "0.9375rem",
                    color: "#181C14",
                    lineHeight: "1.5",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div
          style={{
            padding: "1.25rem",
            borderTop: "1px solid rgba(236, 223, 204, 0.3)",
            background: "rgba(236, 223, 204, 0.5)",
            backdropFilter: "blur(10px)",
            display: "flex",
            gap: "0.75rem",
          }}
        >
          <input
            type="text"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            disabled={!isConnected}
            className="input-modern"
            style={{
              flex: 1,
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!isConnected || !inputValue.trim()}
            className="btn-primary"
            style={{
              padding: "0.75rem 1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span>📤</span>
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
