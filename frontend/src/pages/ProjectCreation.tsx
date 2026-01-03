import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import ChatInterface from "../components/chat/ChatInterface";
import theme from "../styles/theme";

const ProjectCreation: React.FC = () => {
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
          padding: `${theme.spacing.lg} ${theme.spacing["2xl"]}`,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.lg,
            }}
          >
            <button
              onClick={() => navigate("/")}
              className="btn-secondary"
              style={{
                padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
              }}
            >
              Back
            </button>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: theme.borderRadius.md,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <img
                src={logo}
                alt="Ideal Assistant"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <h1
              style={{
                fontSize: theme.typography.fontSize.xl,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.primary,
              }}
            >
              Create New Project
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: theme.spacing["2xl"],
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Info Card
        <div
          className="card"
          style={{
            padding: "1.25rem",
            marginBottom: "1.5rem",
            background: theme.colors.background.card,
            backdropFilter: "blur(20px)",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "700",
              marginBottom: "0.5rem",
              color: theme.colors.background.primary,
            }}
          >
            Let's create your project together
          </h2>
          <p
            style={{
              fontSize: "0.875rem",
              color: theme.colors.brand.redDark,
              lineHeight: "1.5",
            }}
          >
            Tell me about your project goals, timeline, and team. I'll help you
            build a complete plan with tasks, milestones, and assignments.
          </p>
        </div> */}

        {/* Chat Interface */}
        <div
          className="card"
          style={{
            padding: "0",
            height: "calc(100vh - 145px)",
            maxHeight: "600px",
            minHeight: "400px",
            overflow: "hidden",
          }}
        >
          <ChatInterface />
        </div>

        {/* Tips */}
        {/* <div
          className="card"
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            background: theme.colors.background.card,
            backdropFilter: "blur(15px)",
          }}
        >
          <div
            style={{
              fontSize: "0.875rem",
              color: theme.colors.brand.redDark,
              display: "flex",
              alignItems: "flex-start",
              gap: "0.5rem",
            }}
          >
            <span style={{ fontSize: "1rem" }}>💡</span>
            <div>
              <strong
                style={{
                  color: theme.colors.background.primary,
                  display: "block",
                  marginBottom: "0.25rem",
                }}
              >
                Pro Tips:
              </strong>
              Be specific about your project scope, timeline, and team size. The
              more details you provide, the better I can help you plan.
            </div>
          </div>
        </div> */}
      </main>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default ProjectCreation;
