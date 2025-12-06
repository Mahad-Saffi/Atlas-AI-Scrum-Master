import React from "react";
import { useNavigate } from "react-router-dom";
import EnhancedChatPanel from "../components/EnhancedChatPanel";
import NotificationBell from "../components/NotificationBell";

const ChatPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Header */}
      <header
        className="glass-header"
        style={{
          padding: "1rem 2rem",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              onClick={() => navigate("/")}
              className="btn-secondary"
              style={{ padding: "0.5rem 1rem", fontSize: "1.25rem" }}
            >
              ←
            </button>
            <div
              style={{
                width: "32px",
                height: "32px",
                background: "linear-gradient(135deg, #697565 0%, #3C3D37 100%)",
                borderRadius: "var(--radius-md)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
              }}
            >
              💬
            </div>
            <h1
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "#181C14",
              }}
            >
              Team Chat
            </h1>
          </div>
          <NotificationBell />
        </div>
      </header>

      {/* Chat Panel */}
      <main
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "2rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <EnhancedChatPanel />
      </main>
    </div>
  );
};

export default ChatPage;
