import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
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
              }}
            >
              Back
            </button>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "var(--radius-md)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <img
                src={logo}
                alt="Atlas AI"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <h1
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "#ECDFCC",
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
        {/* Info Card
        <div
          className="card"
          style={{
            padding: "1.25rem",
            marginBottom: "1.5rem",
            background: "rgba(236, 223, 204, 0.95)",
            backdropFilter: "blur(20px)",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "700",
              marginBottom: "0.5rem",
              color: "#181C14",
            }}
          >
            Let's create your project together
          </h2>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#3C3D37",
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
            background: "rgba(236, 223, 204, 0.9)",
            backdropFilter: "blur(15px)",
          }}
        >
          <div
            style={{
              fontSize: "0.875rem",
              color: "#3C3D37",
              display: "flex",
              alignItems: "flex-start",
              gap: "0.5rem",
            }}
          >
            <span style={{ fontSize: "1rem" }}>💡</span>
            <div>
              <strong
                style={{
                  color: "#181C14",
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
