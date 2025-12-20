import React from "react";
import { useNavigate } from "react-router-dom";
import EnhancedChatPanel from "../components/EnhancedChatPanel";
import NotificationBell from "../components/NotificationBell";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";

const ChatPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        position: "relative",
      }}
    >
      {/* Background Grid Pattern */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(17, 17, 24, 0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "1.25rem 2rem",
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
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <button
              onClick={() => navigate("/")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.25rem",
                background: "rgba(220, 38, 38, 0.15)",
                border: "1px solid rgba(220, 38, 38, 0.3)",
                borderRadius: "12px",
                color: "#dc2626",
                fontSize: "0.9375rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(220, 38, 38, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(220, 38, 38, 0.15)";
              }}
            >
              ← Back to Home
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #dc2626, #991b1b)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.25rem",
                }}
              >
                <ChatBubbleLeftRightIcon
                  style={{ width: "48px", height: "48px", color: "#dc2626" }}
                />
              </div>
              <h1
                style={{
                  fontSize: "1.75rem",
                  fontWeight: "700",
                  color: "#f1f5f9",
                  letterSpacing: "-0.01em",
                }}
              >
                Team Chat
              </h1>
            </div>
          </div>
          <NotificationBell />
        </div>
      </header>

      {/* Chat Panel */}
      <main
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "2rem",
          height: "calc(100vh - 120px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <EnhancedChatPanel />
      </main>
    </div>
  );
};

export default ChatPage;
