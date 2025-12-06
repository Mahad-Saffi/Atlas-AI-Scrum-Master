import React from "react";
import { useNavigate } from "react-router-dom";
import ChatInterface from "../components/chat/ChatInterface";

const ProjectCreation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-cream)",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "var(--color-white)",
          borderBottom: "1px solid var(--color-border)",
          padding: "1rem 2rem",
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
              gap: "1rem",
            }}
          >
            <button
              onClick={() => navigate("/")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1.25rem",
                color: "var(--color-text-secondary)",
              }}
            >
              ←
            </button>
            <h1
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "var(--color-text-primary)",
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
          padding: "2rem",
        }}
      >
        {/* Info Card */}
        <div
          className="card"
          style={{
            padding: "1.5rem",
            marginBottom: "1.5rem",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              marginBottom: "0.5rem",
            }}
          >
            Let's create your project together
          </h2>
          <p
            style={{
              fontSize: "0.9375rem",
              opacity: 0.95,
            }}
          >
            Tell me about your project goals, timeline, and team. I'll help you
            build a complete plan with tasks, milestones, and assignments.
          </p>
        </div>

        {/* Chat Interface */}
        <div
          className="card"
          style={{
            padding: "0",
            height: "600px",
            overflow: "hidden",
          }}
        >
          <ChatInterface />
        </div>

        {/* Tips */}
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            background: "var(--color-light-gray)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div
            style={{
              fontSize: "0.875rem",
              color: "var(--color-text-secondary)",
            }}
          >
            <strong style={{ color: "var(--color-text-primary)" }}>
              💡 Tips:
            </strong>{" "}
            Be specific about your project scope, timeline, and team size. The
            more details you provide, the better I can help you plan.
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectCreation;
