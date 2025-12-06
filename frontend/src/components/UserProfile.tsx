import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  avatar_url?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

interface UserProfileProps {
  user: User;
  onSignOut: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onSignOut }) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch("http://localhost:8000/api/v1/projects/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
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
              🤖
            </div>
            <h1
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "var(--color-text-primary)",
              }}
            >
              Atlas AI
            </h1>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <button
              onClick={() => navigate("/organization-setup")}
              className="btn-secondary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span>👥</span>
              <span>Team</span>
            </button>

            <button
              onClick={() => navigate("/create-project")}
              className="btn-primary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span>+</span>
              <span>New Project</span>
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.375rem 0.75rem",
                background: "rgba(236, 223, 204, 0.8)",
                backdropFilter: "blur(10px)",
                borderRadius: "var(--radius-md)",
                border: "1px solid rgba(236, 223, 204, 0.3)",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  background:
                    "linear-gradient(135deg, #697565 0%, #3C3D37 100%)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ECDFCC",
                  fontSize: "0.8125rem",
                  fontWeight: "600",
                }}
              >
                {user.username.charAt(0).toUpperCase()}
              </div>
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "var(--color-text-primary)",
                }}
              >
                {user.username}
              </span>
            </div>

            <button
              onClick={onSignOut}
              className="btn-secondary"
              style={{
                padding: "0.5rem 1rem",
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "2rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Stats Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.25rem",
            marginBottom: "2.5rem",
          }}
        >
          <div
            className="card"
            style={{
              padding: "1.5rem",
              background: "rgba(236, 223, 204, 0.9)",
              border: "2px solid #697565",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.borderColor = "#3C3D37";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "#697565";
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  background:
                    "linear-gradient(135deg, #697565 0%, #3C3D37 100%)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                }}
              >
                📊
              </div>
            </div>
            <div
              style={{
                fontSize: "2.25rem",
                fontWeight: "700",
                color: "#181C14",
                marginBottom: "0.25rem",
              }}
            >
              {projects.length}
            </div>
            <div
              style={{
                fontSize: "0.9375rem",
                color: "#3C3D37",
                fontWeight: "500",
              }}
            >
              Total Projects
            </div>
          </div>

          <div
            className="card"
            style={{
              padding: "1.5rem",
              background: "rgba(236, 223, 204, 0.9)",
              border: "2px solid #697565",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.borderColor = "#3C3D37";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "#697565";
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  background:
                    "linear-gradient(135deg, #697565 0%, #3C3D37 100%)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                }}
              >
                ✅
              </div>
            </div>
            <div
              style={{
                fontSize: "2.25rem",
                fontWeight: "700",
                color: "#181C14",
                marginBottom: "0.25rem",
              }}
            >
              0
            </div>
            <div
              style={{
                fontSize: "0.9375rem",
                color: "#3C3D37",
                fontWeight: "500",
              }}
            >
              Tasks Completed
            </div>
          </div>

          <div
            className="card"
            style={{
              padding: "1.5rem",
              background: "rgba(236, 223, 204, 0.9)",
              border: "2px solid #697565",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.borderColor = "#3C3D37";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "#697565";
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  background:
                    "linear-gradient(135deg, #697565 0%, #3C3D37 100%)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                }}
              >
                ⚡
              </div>
            </div>
            <div
              style={{
                fontSize: "2.25rem",
                fontWeight: "700",
                color: "#181C14",
                marginBottom: "0.25rem",
              }}
            >
              0
            </div>
            <div
              style={{
                fontSize: "0.9375rem",
                color: "#3C3D37",
                fontWeight: "500",
              }}
            >
              In Progress
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div
          style={{
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.75rem",
              fontWeight: "700",
              color: "#ECDFCC",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Your Projects
          </h2>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
            }}
          >
            <button
              className="btn-secondary"
              style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}
            >
              📅 Sort by
            </button>
            <button
              className="btn-secondary"
              style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}
            >
              🔍 Filters
            </button>
          </div>
        </div>

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "4rem",
            }}
          >
            <div
              className="spinner"
              style={{ width: "40px", height: "40px", borderWidth: "3px" }}
            />
          </div>
        ) : projects.length === 0 ? (
          <div
            className="card"
            style={{
              padding: "4rem 2rem",
              textAlign: "center",
              background: "rgba(236, 223, 204, 0.95)",
              border: "2px dashed #697565",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                background: "linear-gradient(135deg, #697565 0%, #3C3D37 100%)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "3rem",
                margin: "0 auto 1.5rem",
              }}
            >
              📋
            </div>
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#181C14",
                marginBottom: "0.75rem",
              }}
            >
              No projects yet
            </h3>
            <p
              style={{
                fontSize: "1rem",
                color: "#3C3D37",
                marginBottom: "2rem",
                maxWidth: "500px",
                margin: "0 auto 2rem",
              }}
            >
              Create your first project to get started with AI-powered project
              management and collaboration
            </p>
            <button
              onClick={() => navigate("/create-project")}
              className="btn-primary"
              style={{
                padding: "0.875rem 2rem",
                fontSize: "1rem",
              }}
            >
              🚀 Create Your First Project
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {projects.map((project) => (
              <div
                key={project.id}
                className="card"
                style={{
                  padding: "1.5rem",
                  cursor: "pointer",
                  background: "rgba(236, 223, 204, 0.9)",
                  border: "2px solid #697565",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
                onClick={() => navigate(`/project/${project.id}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.borderColor = "#3C3D37";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "#697565";
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    width: "40px",
                    height: "40px",
                    background:
                      "linear-gradient(135deg, #697565 0%, #3C3D37 100%)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem",
                  }}
                >
                  📁
                </div>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "700",
                    color: "#181C14",
                    marginBottom: "0.75rem",
                    paddingRight: "3rem",
                  }}
                >
                  {project.name}
                </h3>
                <p
                  style={{
                    fontSize: "0.9375rem",
                    color: "#3C3D37",
                    marginBottom: "1.25rem",
                    lineHeight: "1.6",
                    minHeight: "3rem",
                  }}
                >
                  {project.description || "No description provided"}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "1rem",
                    borderTop: "2px solid #697565",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span style={{ fontSize: "0.875rem" }}>📅</span>
                    <span
                      style={{
                        fontSize: "0.875rem",
                        color: "#697565",
                        fontWeight: "500",
                      }}
                    >
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    className="btn-secondary"
                    style={{
                      padding: "0.375rem 0.875rem",
                      fontSize: "0.8125rem",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/task-board`);
                    }}
                  >
                    View Tasks →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserProfile;
