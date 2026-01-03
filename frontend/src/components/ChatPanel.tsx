import React, { useState, useEffect, useRef } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import theme from "../styles/theme";

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
          borderRight: `1px solid ${theme.colors.border.light}`,
          padding: theme.spacing.xl,
          background: theme.colors.background.secondary,
          backdropFilter: theme.effects.backdropBlur.sm,
        }}
      >
        <h3
          style={{
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.semibold,
            marginBottom: theme.spacing.lg,
            color: theme.colors.text.primary,
            display: "flex",
            alignItems: "center",
            gap: theme.spacing.sm,
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: theme.colors.status.success,
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
                gap: theme.spacing.md,
                padding: theme.spacing.md,
                background: theme.colors.background.card,
                backdropFilter: theme.effects.backdropBlur.sm,
                borderRadius: theme.borderRadius.md,
                border: `1px solid ${theme.colors.border.light}`,
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.primary,
                transition: theme.effects.transition.normal,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  theme.colors.background.hover;
                e.currentTarget.style.transform = "translateX(4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = theme.colors.background.card;
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
                  border: `2px solid ${theme.colors.status.success}`,
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
          background: theme.colors.background.tertiary,
        }}
      >
        {/* Connection Status */}
        <div
          style={{
            padding: `${theme.spacing.md} ${theme.spacing.xl}`,
            borderBottom: `1px solid ${theme.colors.border.light}`,
            background: isConnected
              ? `rgba(34, 197, 94, 0.1)`
              : `rgba(239, 68, 68, 0.1)`,
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.primary,
            display: "flex",
            alignItems: "center",
            gap: theme.spacing.sm,
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: isConnected
                ? theme.colors.status.success
                : theme.colors.status.error,
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
                color: theme.colors.text.secondary,
                padding: "3rem 1rem",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: theme.colors.background.hover,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                  border: `1px solid ${theme.colors.border.light}`,
                }}
              >
                <span
                  style={{
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.text.muted,
                    fontWeight: theme.typography.fontWeight.bold,
                  }}
                >
                  CHAT
                </span>
              </div>
              <div
                style={{
                  fontSize: theme.typography.fontSize.base,
                  fontWeight: theme.typography.fontWeight.medium,
                }}
              >
                No messages yet. Start chatting!
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className="card"
                style={{
                  padding: theme.spacing.lg,
                  background: theme.colors.background.card,
                  backdropFilter: theme.effects.backdropBlur.md,
                  border: `1px solid ${theme.colors.border.light}`,
                  borderRadius: theme.borderRadius.md,
                  boxShadow: theme.shadows.sm,
                }}
              >
                <div
                  style={{
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.text.secondary,
                    marginBottom: theme.spacing.sm,
                    fontWeight: theme.typography.fontWeight.semibold,
                  }}
                >
                  User #{msg.sender_id}
                </div>
                <div
                  style={{
                    fontSize: theme.typography.fontSize.base,
                    color: theme.colors.text.primary,
                    lineHeight: theme.typography.lineHeight.normal,
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
            padding: theme.spacing.xl,
            borderTop: `1px solid ${theme.colors.border.light}`,
            background: theme.colors.background.secondary,
            backdropFilter: theme.effects.backdropBlur.sm,
            display: "flex",
            gap: theme.spacing.md,
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
              padding: `${theme.spacing.md} ${theme.spacing.xl}`,
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.sm,
            }}
          >
            <PaperAirplaneIcon style={{ width: "20px", height: "20px" }} />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
