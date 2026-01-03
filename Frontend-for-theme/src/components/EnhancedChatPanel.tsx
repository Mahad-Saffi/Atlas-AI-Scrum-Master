import React, { useState, useEffect, useRef } from "react";
import {
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

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
      // Ensure users is an array
      if (Array.isArray(users)) {
        setOnlineUsers(users);
      } else {
        console.error("Online users data is not an array:", users);
        setOnlineUsers([]);
      }
    } catch (error) {
      console.error("Error fetching online users:", error);
      setOnlineUsers([]);
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
      // Ensure data is an array
      if (Array.isArray(data)) {
        setChannels(data);
      } else {
        console.error("Channels data is not an array:", data);
        setChannels([]);
      }
    } catch (error) {
      console.error("Error fetching channels:", error);
      setChannels([]);
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
      // Ensure data is an array
      if (Array.isArray(data)) {
        setConversations(data);
      } else {
        console.error("Conversations data is not an array:", data);
        setConversations([]);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setConversations([]);
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

    const token = localStorage.getItem("jwt");
    let currentUserId = 0;

    // Get current user ID from token
    try {
      if (token) {
        const parts = token.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          currentUserId = payload.id;
        }
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }

    const messageData = {
      type: "message",
      content: inputValue,
      channel_id: selectedChannel,
      recipient_id: selectedUser,
    };

    // Optimistically add message to UI
    const optimisticMessage: Message = {
      id: Date.now(), // Temporary ID
      sender_id: currentUserId,
      content: inputValue,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
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
      style={{
        display: "flex",
        height: "100%",
        overflow: "hidden",
        background: "rgba(17, 17, 24, 0.7)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "20px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "280px",
          borderRight: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          flexDirection: "column",
          background: "rgba(10, 10, 15, 0.5)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
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
                  ? "rgba(220, 38, 38, 0.1)"
                  : "transparent",
              border: "none",
              borderBottom:
                activeView === "channels" ? "2px solid #dc2626" : "none",
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "#f1f5f9",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            <UserGroupIcon style={{ width: "16px", height: "16px" }} />
            Channels
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
                activeView === "dms" ? "rgba(220, 38, 38, 0.1)" : "transparent",
              border: "none",
              borderBottom: activeView === "dms" ? "2px solid #dc2626" : "none",
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "#f1f5f9",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            <ChatBubbleLeftRightIcon
              style={{ width: "16px", height: "16px" }}
            />
            DMs
          </button>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
          {activeView === "channels" ? (
            <>
              <button
                onClick={() => setShowCreateChannel(true)}
                style={{
                  width: "100%",
                  marginBottom: "1rem",
                  padding: "0.75rem",
                  fontSize: "0.875rem",
                  background: "linear-gradient(135deg, #dc2626, #991b1b)",
                  border: "none",
                  borderRadius: "12px",
                  color: "white",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                <PlusIcon style={{ width: "16px", height: "16px" }} />
                New Channel
              </button>
              {channels.map((channel) => (
                <div
                  key={channel.id}
                  onClick={() => {
                    setSelectedChannel(channel.id);
                    setSelectedUser(null);
                  }}
                  onMouseEnter={(e) => {
                    if (selectedChannel !== channel.id) {
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.08)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedChannel !== channel.id) {
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.03)";
                    }
                  }}
                  style={{
                    padding: "0.75rem",
                    marginBottom: "0.5rem",
                    background:
                      selectedChannel === channel.id
                        ? "rgba(220, 38, 38, 0.15)"
                        : "rgba(255, 255, 255, 0.03)",
                    backdropFilter: "blur(10px)",
                    border:
                      selectedChannel === channel.id
                        ? "1px solid rgba(220, 38, 38, 0.4)"
                        : "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "#f1f5f9",
                    }}
                  >
                    # {channel.name}
                  </div>
                  {channel.description && (
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#94a3b8",
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
                  color: "#94a3b8",
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
                  onMouseEnter={(e) => {
                    if (selectedUser !== user.id) {
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.08)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedUser !== user.id) {
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.03)";
                    }
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.75rem",
                    marginBottom: "0.5rem",
                    background:
                      selectedUser === user.id
                        ? "rgba(220, 38, 38, 0.15)"
                        : "rgba(255, 255, 255, 0.03)",
                    backdropFilter: "blur(10px)",
                    border:
                      selectedUser === user.id
                        ? "1px solid rgba(220, 38, 38, 0.4)"
                        : "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "12px",
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
                      color: "#f1f5f9",
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
          background: "rgba(10, 10, 15, 0.3)",
        }}
      >
        {/* Header with Search */}
        <div
          style={{
            padding: "1rem 1.25rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            background: "rgba(10, 10, 15, 0.5)",
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
            style={{
              flex: 1,
              padding: "0.75rem 1rem",
              fontSize: "0.875rem",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              color: "#f1f5f9",
              outline: "none",
            }}
          />
          <button
            onClick={searchMessages}
            style={{
              padding: "0.75rem 1rem",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              color: "#f1f5f9",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <MagnifyingGlassIcon style={{ width: "16px", height: "16px" }} />
          </button>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            padding: "1rem",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "0.625rem",
          }}
        >
          {messages.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "#94a3b8",
                padding: "3rem 1rem",
              }}
            >
              <ChatBubbleLeftRightIcon
                style={{
                  width: "64px",
                  height: "64px",
                  margin: "0 auto 1rem",
                  color: "#475569",
                }}
              />
              <div
                style={{
                  fontSize: "0.9375rem",
                  fontWeight: "500",
                  color: "#f1f5f9",
                }}
              >
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
                  padding: "0.75rem 0.875rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "12px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.borderColor =
                    "rgba(255, 255, 255, 0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.borderColor =
                    "rgba(255, 255, 255, 0.08)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #dc2626, #991b1b)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    {msg.sender_id}
                  </div>
                  <span
                    style={{
                      fontSize: "0.8125rem",
                      color: "#f1f5f9",
                      fontWeight: "600",
                    }}
                  >
                    User #{msg.sender_id}
                  </span>
                  <span
                    style={{
                      fontSize: "0.6875rem",
                      color: "#94a3b8",
                      marginLeft: "auto",
                    }}
                  >
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "0.9375rem",
                    color: "#f1f5f9",
                    lineHeight: "1.5",
                    paddingLeft: "2rem",
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
            padding: "1rem 1.25rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            background: "rgba(10, 10, 15, 0.5)",
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
            disabled={!isConnected || (!selectedChannel && !selectedUser)}
            style={{
              flex: 1,
              padding: "0.875rem 1rem",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              color: "#f1f5f9",
              fontSize: "0.9375rem",
              outline: "none",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={
              !isConnected ||
              !inputValue.trim() ||
              (!selectedChannel && !selectedUser)
            }
            style={{
              padding: "0.875rem 1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background:
                !isConnected ||
                !inputValue.trim() ||
                (!selectedChannel && !selectedUser)
                  ? "rgba(220, 38, 38, 0.5)"
                  : "linear-gradient(135deg, #dc2626, #991b1b)",
              border: "none",
              borderRadius: "12px",
              color: "white",
              fontSize: "0.9375rem",
              fontWeight: 600,
              cursor:
                !isConnected ||
                !inputValue.trim() ||
                (!selectedChannel && !selectedUser)
                  ? "not-allowed"
                  : "pointer",
              boxShadow: "0 4px 16px rgba(220, 38, 38, 0.4)",
            }}
          >
            <PaperAirplaneIcon style={{ width: "18px", height: "18px" }} />
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
        style={{
          maxWidth: "450px",
          width: "100%",
          padding: "2rem",
          margin: "1rem",
          background: "rgba(17, 17, 24, 0.95)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "20px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "#f1f5f9",
            marginBottom: "1.5rem",
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
                color: "#f1f5f9",
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
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                color: "#f1f5f9",
                fontSize: "0.9375rem",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#f1f5f9",
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
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                color: "#f1f5f9",
                fontSize: "0.9375rem",
                outline: "none",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "0.75rem 1.5rem",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                color: "#f1f5f9",
                fontSize: "0.9375rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "0.75rem 1.5rem",
                background: "linear-gradient(135deg, #dc2626, #991b1b)",
                border: "none",
                borderRadius: "12px",
                color: "white",
                fontSize: "0.9375rem",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(220, 38, 38, 0.4)",
              }}
            >
              Create Channel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnhancedChatPanel;
