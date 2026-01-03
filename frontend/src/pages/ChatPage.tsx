import React from "react";
import { useNavigate } from "react-router-dom";
import EnhancedChatPanel from "../components/EnhancedChatPanel";
import NotificationBell from "../components/NotificationBell";
import theme from "../styles/theme";

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
              style={{ padding: "0.5rem 1rem" }}
            >
              Back
            </button>
            <div
              style={{
                width: "32px",
                height: "32px",
                background: theme.colors.brand.redGradient,
                borderRadius: theme.borderRadius.md,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: theme.typography.fontSize.xs,
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.white,
              }}
            >
              Chat
            </div>
            <h1
              style={{
                fontSize: theme.typography.fontSize.xl,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.primary,
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
