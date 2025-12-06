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

interface Channel {
  id: number;
  name: string;
  description: string;
  channel_type: string;
}

interface Conversation {
  id: number;
  username: string;
  avatar_url: string;
}

const EnhancedChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [activeView, setActiveView] = useState<"channels" | "dms">("channels");
  const [selectedChannel, setSelectedChannel] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    connectWebSocket();
    fetchChannels();
    fetchConversations();
    return () => {
      wsRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (selectedChannel) {
      fetchChannelMessages(selectedChannel);
    } else if (selectedUser) {
      fetchDirectMessages(selectedUser);
    }
  }, [selectedChannel, selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const connectWebSocket = () => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    const ws = new WebSocket(
      `ws://localhost:8000/api/v1/chat/ws?token=${token}`
    );
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      fetchOnlineUsers();
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "message") {
        if (
          (selectedChannel && data.channel_id === selectedChannel) ||
          (selectedUser &&
            (data.sender_id === selectedUser ||
              data.recipient_id === selectedUser))
        ) {
          setMessages((prev) => [...prev, data]);
        }
      } else if (data.type === "presence_update") {
        fetchOnlineUsers();
      }
    };

    ws.onclose = () => setIsConnected(false);
    ws.onerror = (error) => console.error("WebSocket error:", error);
  };

  const fetchOnlineUsers = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(
        "http://localhost:8000/api/v1/chat/online-users",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const users = await response.json();
      setOnlineUsers(users);
    } catch (error) {
      console.error("Error fetching online users:", error);
    }
  };

  const fetchChannels = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(
        "http://localhost:8000/api/v1/chat/channels",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setChannels(data);
    } catch (error) {
      console.error("Error fetching channels:", error);
    }
  };

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(
        "http://localhost:8000/api/v1/chat/conversations",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const fetchChannelMessages = async (channelId: number) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(
        `http://localhost:8000/api/v1/chat/channels/${channelId}/messages`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchDirectMessages = async (userId: number) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(
        `http://localhost:8000/api/v1/chat/direct-messages/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching DMs:", error);
    }
  };

  const searchMessages = async () => {
    if (!searchQuery.trim()) return;

    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(
        `http://localhost:8000/api/v1/chat/search?query=${encodeURIComponent(
          searchQuery
        )}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error searching messages:", error);
    }
  };

  const sendMessage = () => {
    if (!inputValue.trim() || !wsRef.current || !isConnected) return;

    const messageData = {
      type: "message",
      content: inputValue,
      channel_id: selectedChannel,
      recipient_id: selectedUser,
    };

    wsRef.current.send(JSON.stringify(messageData));
    setInputValue("");
  };

  const createChannel = async (name: string, description: string) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(
        "http://localhost:8000/api/v1/chat/channels",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, description, channel_type: "public" }),
        }
      );

      if (response.ok) {
        fetchChannels();
        setShowCreateChannel(false);
      }
    } catch (error) {
      console.error("Error creating channel:", error);
    }
  };

  return (
    <div
      className="card-glass-solid"
      style={{
        display: "flex",
        height: "calc(100vh - 135px)",
        maxHeight: "850px",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "280px",
          borderRight: "1px solid rgba(236, 223, 204, 0.3)",
          display: "flex",
          flexDirection: "column",
          background: "rgba(236, 223, 204, 0.15)",
          backdropFilter: "blur(15px)",
        }}
      >
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid rgba(236, 223, 204, 0.3)",
          }}
        >
          <button
            onClick={() => {
              setActiveView("channels");
              setSelectedUser(null);
            }}
            style={{
              flex: 1,
              padding: "0.875rem",
              background:
                activeView === "channels"
                  ? "rgba(236, 223, 204, 0.3)"
                  : "transparent",
              border: "none",
              borderBottom:
                activeView === "channels"
                  ? "2px solid rgba(236, 223, 204, 0.5)"
                  : "none",
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "#ECDFCC",
              cursor: "pointer",
            }}
          >
            📢 Channels
          </button>
          <button
            onClick={() => {
              setActiveView("dms");
              setSelectedChannel(null);
            }}
            style={{
              flex: 1,
              padding: "0.875rem",
              background:
                activeView === "dms"
                  ? "rgba(236, 223, 204, 0.3)"
                  : "transparent",
              border: "none",
              borderBottom:
                activeView === "dms"
                  ? "2px solid rgba(236, 223, 204, 0.5)"
                  : "none",
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "#ECDFCC",
              cursor: "pointer",
            }}
          >
            💬 DMs
          </button>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
          {activeView === "channels" ? (
            <>
              <button
                onClick={() => setShowCreateChannel(true)}
                className="btn-primary"
                style={{
                  width: "100%",
                  marginBottom: "1rem",
                  padding: "0.5rem",
                  fontSize: "0.875rem",
                }}
              >
                + New Channel
              </button>
              {channels.map((channel) => (
                <div
                  key={channel.id}
                  onClick={() => {
                    setSelectedChannel(channel.id);
                    setSelectedUser(null);
                  }}
                  style={{
                    padding: "0.75rem",
                    marginBottom: "0.5rem",
                    background:
                      selectedChannel === channel.id
                        ? "rgba(236, 223, 204, 0.25)"
                        : "rgba(236, 223, 204, 0.1)",
                    backdropFilter: "blur(10px)",
                    border:
                      selectedChannel === channel.id
                        ? "1px solid rgba(236, 223, 204, 0.4)"
                        : "1px solid rgba(236, 223, 204, 0.2)",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "#ECDFCC",
                    }}
                  >
                    # {channel.name}
                  </div>
                  {channel.description && (
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#ECDFCC",
                        opacity: 0.8,
                        marginTop: "0.25rem",
                      }}
                    >
                      {channel.description}
                    </div>
                  )}
                </div>
              ))}
            </>
          ) : (
            <>
              <h3
                style={{
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  color: "#ECDFCC",
                  textTransform: "uppercase",
                  marginBottom: "0.75rem",
                }}
              >
                Online ({onlineUsers.length})
              </h3>
              {onlineUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => {
                    setSelectedUser(user.id);
                    setSelectedChannel(null);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.75rem",
                    marginBottom: "0.5rem",
                    background:
                      selectedUser === user.id
                        ? "rgba(236, 223, 204, 0.25)"
                        : "rgba(236, 223, 204, 0.1)",
                    backdropFilter: "blur(10px)",
                    border:
                      selectedUser === user.id
                        ? "1px solid rgba(236, 223, 204, 0.4)"
                        : "1px solid rgba(236, 223, 204, 0.2)",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <img
                    src={user.avatar_url}
                    alt={user.username}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      border: "2px solid #10b981",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#ECDFCC",
                    }}
                  >
                    {user.username}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "rgba(236, 223, 204, 0.08)",
        }}
      >
        {/* Header with Search */}
        <div
          style={{
            padding: "0.75rem 1.25rem",
            borderBottom: "1px solid rgba(236, 223, 204, 0.3)",
            background: "rgba(236, 223, 204, 0.15)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && searchMessages()}
            className="input-modern"
            style={{
              flex: 1,
              padding: "0.5rem 0.75rem",
              fontSize: "0.875rem",
            }}
          />
          <button
            onClick={searchMessages}
            className="btn-secondary"
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
            }}
          >
            🔍
          </button>
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
                color: "#ECDFCC",
                padding: "3rem 1rem",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💬</div>
              <div style={{ fontSize: "0.9375rem", fontWeight: "500" }}>
                {selectedChannel || selectedUser
                  ? "No messages yet. Start chatting!"
                  : "Select a channel or user to start chatting"}
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  padding: "1rem",
                  background: "rgba(236, 223, 204, 0.15)",
                  backdropFilter: "blur(15px)",
                  border: "1px solid rgba(236, 223, 204, 0.25)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "0 2px 8px rgba(24, 28, 20, 0.15)",
                  transition: "all 0.2s ease",
                }}
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#ECDFCC",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    opacity: 0.8,
                  }}
                >
                  User #{msg.sender_id}
                </div>
                <div
                  style={{
                    fontSize: "0.9375rem",
                    color: "#ECDFCC",
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
            background: "rgba(236, 223, 204, 0.15)",
            backdropFilter: "blur(15px)",
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
            disabled={!isConnected || (!selectedChannel && !selectedUser)}
            className="input-modern"
            style={{ flex: 1 }}
          />
          <button
            onClick={sendMessage}
            disabled={
              !isConnected ||
              !inputValue.trim() ||
              (!selectedChannel && !selectedUser)
            }
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

      {/* Create Channel Modal */}
      {showCreateChannel && (
        <CreateChannelModal
          onClose={() => setShowCreateChannel(false)}
          onCreate={createChannel}
        />
      )}
    </div>
  );
};

// Create Channel Modal Component
const CreateChannelModal: React.FC<{
  onClose: () => void;
  onCreate: (name: string, description: string) => void;
}> = ({ onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name, description);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(24, 28, 20, 0.7)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        className="card-glass-solid"
        style={{
          maxWidth: "450px",
          width: "100%",
          padding: "2rem",
          margin: "1rem",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "#ECDFCC",
            marginBottom: "1.5rem",
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          Create Channel
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.25rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#ECDFCC",
                marginBottom: "0.5rem",
              }}
            >
              Channel Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., general, announcements"
              required
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#ECDFCC",
                marginBottom: "0.5rem",
              }}
            >
              Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this channel about?"
              style={{ width: "100%" }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "flex-end",
            }}
          >
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Channel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnhancedChatPanel;
