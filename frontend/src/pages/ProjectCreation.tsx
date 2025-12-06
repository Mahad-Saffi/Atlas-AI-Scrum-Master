import React from "react";
import { useNavigate } from "react-router-dom";
import ChatInterface from "../components/chat/ChatInterface";

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
          padding: "1rem 2rem",
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
              gap: "1rem",
            }}
          >
            <button
              onClick={() => navigate("/")}
              className="btn-secondary"
              style={{
                padding: "0.5rem 1rem",
                fontSize: "1.25rem",
              }}
            >
              ←
            </button>
            <h1
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "#090909",
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
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Info Card */}
        <div
          className="card"
          style={{
            padding: "2rem",
            marginBottom: "1.5rem",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "3rem",
              marginBottom: "1rem",
              animation: "float 3s ease-in-out infinite",
            }}
          >
            🤖
          </div>
          <h2
            style={{
              fontSize: "1.75rem",
              fontWeight: "700",
              marginBottom: "0.75rem",
              color: "#090909",
            }}
          >
            Let's create your project together
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "#666",
              lineHeight: "1.6",
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
          className="card"
          style={{
            marginTop: "1.5rem",
            padding: "1.25rem",
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(15px)",
          }}
        >
          <div
            style={{
              fontSize: "0.9375rem",
              color: "#666",
              display: "flex",
              alignItems: "flex-start",
              gap: "0.5rem",
            }}
          >
            <span style={{ fontSize: "1.25rem" }}>💡</span>
            <div>
              <strong
                style={{
                  color: "#090909",
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
        </div>
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
