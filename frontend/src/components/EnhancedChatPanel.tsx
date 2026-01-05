import React, { useState, useEffect, useRef } from "react";
import { PaperAirplaneIcon, MegaphoneIcon } from "@heroicons/react/24/solid";
import theme from "../styles/theme";

interface Message {
  id: number;
  sender_id: number;
  sender_username?: string;
  sender_avatar?: string;
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
  is_member?: boolean;
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
        "http://localhost:8000/api/v1/chat/channels/available",
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
        height: "calc(100vh - 135px)",
        maxHeight: "850px",
        overflow: "hidden",
        background: theme.colors.background.secondary,
        backdropFilter: theme.effects.backdropBlur.lg,
        border: `1px solid ${theme.colors.border.light}`,
        borderRadius: theme.borderRadius.lg,
        boxShadow: theme.shadows.lg,
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "280px",
          borderRight: `1px solid ${theme.colors.border.light}`,
          display: "flex",
          flexDirection: "column",
          background: theme.colors.background.tertiary,
          backdropFilter: theme.effects.backdropBlur.md,
        }}
      >
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            borderBottom: `1px solid ${theme.colors.border.light}`,
          }}
        >
          <button
            onClick={() => {
              setActiveView("channels");
              setSelectedUser(null);
            }}
            style={{
              flex: 1,
              padding: theme.spacing.md,
              background:
                activeView === "channels"
                  ? theme.colors.background.hover
                  : "transparent",
              border: "none",
              borderBottom:
                activeView === "channels"
                  ? `2px solid ${theme.colors.brand.red}`
                  : "none",
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.text.primary,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.sm,
            }}
          >
            <MegaphoneIcon style={{ width: "16px", height: "16px" }} />
            Channels
          </button>
          <button
            onClick={() => {
              setActiveView("dms");
              setSelectedChannel(null);
            }}
            style={{
              flex: 1,
              padding: theme.spacing.md,
              background:
                activeView === "dms"
                  ? theme.colors.background.hover
                  : "transparent",
              border: "none",
              borderBottom:
                activeView === "dms"
                  ? `2px solid ${theme.colors.brand.red}`
                  : "none",
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.text.primary,
              cursor: "pointer",
            }}
          >
            DMs
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
                    if (channel.is_member) {
                      setSelectedChannel(channel.id);
                      setSelectedUser(null);
                    }
                  }}
                  onMouseEnter={(e) => {
                    if (selectedChannel !== channel.id) {
                      e.currentTarget.style.background =
                        theme.colors.background.hoverStrong;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedChannel !== channel.id) {
                      e.currentTarget.style.background =
                        theme.colors.background.hover;
                    }
                  }}
                  style={{
                    padding: theme.spacing.md,
                    marginBottom: theme.spacing.sm,
                    background:
                      selectedChannel === channel.id
                        ? theme.colors.background.hoverStrong
                        : theme.colors.background.hover,
                    backdropFilter: theme.effects.backdropBlur.sm,
                    border:
                      selectedChannel === channel.id
                        ? `1px solid ${theme.colors.border.light}`
                        : `1px solid ${theme.colors.border.default}`,
                    borderRadius: theme.borderRadius.md,
                    cursor: channel.is_member ? "pointer" : "default",
                    transition: theme.effects.transition.normal,
                    opacity: channel.is_member ? 1 : 0.7,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: theme.typography.fontSize.sm,
                          fontWeight: theme.typography.fontWeight.semibold,
                          color: theme.colors.text.primary,
                        }}
                      >
                        # {channel.name}
                      </div>
                      {channel.description && (
                        <div
                          style={{
                            fontSize: theme.typography.fontSize.xs,
                            color: theme.colors.text.secondary,
                            marginTop: theme.spacing.xs,
                          }}
                        >
                          {channel.description}
                        </div>
                      )}
                    </div>
                    {!channel.is_member && (
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            const token = localStorage.getItem("jwt");
                            const response = await fetch(
                              `http://localhost:8000/api/v1/chat/channels/${channel.id}/join`,
                              {
                                method: "POST",
                                headers: { Authorization: `Bearer ${token}` },
                              }
                            );
                            if (response.ok) {
                              fetchChannels();
                            }
                          } catch (error) {
                            console.error("Error joining channel:", error);
                          }
                        }}
                        style={{
                          padding: "0.25rem 0.75rem",
                          fontSize: theme.typography.fontSize.xs,
                          background: theme.colors.brand.redGradient,
                          color: theme.colors.text.white,
                          border: "none",
                          borderRadius: theme.borderRadius.sm,
                          cursor: "pointer",
                          fontWeight: theme.typography.fontWeight.semibold,
                        }}
                      >
                        Join
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <h3
                style={{
                  fontSize: theme.typography.fontSize.xs,
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text.primary,
                  textTransform: "uppercase",
                  marginBottom: theme.spacing.md,
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
                        theme.colors.background.hoverStrong;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedUser !== user.id) {
                      e.currentTarget.style.background =
                        theme.colors.background.hover;
                    }
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: theme.spacing.md,
                    padding: theme.spacing.md,
                    marginBottom: theme.spacing.sm,
                    background:
                      selectedUser === user.id
                        ? theme.colors.background.hoverStrong
                        : theme.colors.background.hover,
                    backdropFilter: theme.effects.backdropBlur.sm,
                    border:
                      selectedUser === user.id
                        ? `1px solid ${theme.colors.border.light}`
                        : `1px solid ${theme.colors.border.default}`,
                    borderRadius: theme.borderRadius.md,
                    cursor: "pointer",
                    transition: theme.effects.transition.normal,
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
                    }}
                  />
                  <span
                    style={{
                      fontSize: theme.typography.fontSize.sm,
                      fontWeight: theme.typography.fontWeight.medium,
                      color: theme.colors.text.primary,
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
          background: theme.colors.background.tertiary,
        }}
      >
        {/* Header with Search */}
        <div
          style={{
            padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
            borderBottom: `1px solid ${theme.colors.border.light}`,
            background: theme.colors.background.secondary,
            backdropFilter: theme.effects.backdropBlur.sm,
            display: "flex",
            alignItems: "center",
            gap: theme.spacing.md,
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
            Search
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
                color: theme.colors.text.primary,
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
                  padding: `${theme.spacing.md} ${theme.spacing.md}`,
                  background: theme.colors.background.hover,
                  backdropFilter: theme.effects.backdropBlur.sm,
                  border: `1px solid ${theme.colors.border.light}`,
                  borderRadius: theme.borderRadius.md,
                  transition: theme.effects.transition.normal,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    theme.colors.background.hoverStrong;
                  e.currentTarget.style.borderColor =
                    theme.colors.border.medium;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    theme.colors.background.hover;
                  e.currentTarget.style.borderColor = theme.colors.border.light;
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: theme.spacing.sm,
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: theme.colors.brand.redGradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: theme.typography.fontSize.xs,
                      color: theme.colors.text.white,
                      fontWeight: theme.typography.fontWeight.semibold,
                    }}
                  >
                    {msg.sender_id}
                  </div>
                  <span
                    style={{
                      fontSize: theme.typography.fontSize.sm,
                      color: theme.colors.text.primary,
                      fontWeight: theme.typography.fontWeight.semibold,
                    }}
                  >
                    {msg.sender_username || `User #${msg.sender_id}`}
                  </span>
                  <span
                    style={{
                      fontSize: theme.typography.fontSize.xs,
                      color: theme.colors.text.secondary,
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
                    fontSize: theme.typography.fontSize.base,
                    color: theme.colors.text.primary,
                    lineHeight: theme.typography.lineHeight.normal,
                    paddingLeft: theme.spacing["2xl"],
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
            padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
            borderTop: `1px solid ${theme.colors.border.light}`,
            background: theme.colors.background.secondary,
            backdropFilter: theme.effects.backdropBlur.md,
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
        background: theme.colors.overlay.light,
        backdropFilter: theme.effects.backdropBlur.sm,
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
            fontSize: theme.typography.fontSize["2xl"],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing["2xl"],
            textShadow: theme.shadows.sm,
          }}
        >
          Create Channel
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: theme.spacing.xl }}>
            <label
              style={{
                display: "block",
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing.sm,
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

          <div style={{ marginBottom: theme.spacing["2xl"] }}>
            <label
              style={{
                display: "block",
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing.sm,
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
