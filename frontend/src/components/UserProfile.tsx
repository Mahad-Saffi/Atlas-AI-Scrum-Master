import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import OrganizationInfo from "./OrganizationInfo";
import {
  RocketLaunchIcon,
  FolderIcon,
  HashtagIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import theme from "../styles/theme";

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
  const [sortBy, setSortBy] = useState<string>("default");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [taskStats, setTaskStats] = useState({
    completed: 0,
    inProgress: 0,
  });

  useEffect(() => {
    fetchProjects();
    fetchTaskStats();

    // Auto-refresh every 15 seconds
    const interval = setInterval(() => {
      fetchProjects();
      fetchTaskStats();
    }, 15000);

    return () => clearInterval(interval);
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

  const fetchTaskStats = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch("http://localhost:8000/api/v1/projects/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const projectsData = await response.json();
        let totalCompleted = 0;
        let totalInProgress = 0;

        // Fetch tasks for each project
        for (const project of projectsData) {
          try {
            const tasksResponse = await fetch(
              `http://localhost:8000/api/v1/projects/${project.id}/tasks`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (tasksResponse.ok) {
              const tasks = await tasksResponse.json();
              totalCompleted += tasks.filter(
                (t: any) => t.status === "Done"
              ).length;
              totalInProgress += tasks.filter(
                (t: any) => t.status === "In Progress"
              ).length;
            }
          } catch (error) {
            console.error(
              `Error fetching tasks for project ${project.id}:`,
              error
            );
          }
        }

        setTaskStats({
          completed: totalCompleted,
          inProgress: totalInProgress,
        });
      }
    } catch (error) {
      console.error("Error fetching task stats:", error);
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
          padding: `${theme.spacing.lg} ${theme.spacing["2xl"]}`,
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
              gap: theme.spacing.md,
            }}
          >
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
              Ideal Assistant
            </h1>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.lg,
            }}
          >
            <button
              id="btn-chat"
              onClick={() => navigate("/chat")}
              className="btn-secondary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing.sm,
              }}
            >
              <span>Chat</span>
            </button>

            <button
              id="btn-team-members"
              onClick={() => navigate("/team-members")}
              className="btn-secondary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing.sm,
              }}
            >
              <span>Team</span>
            </button>

            <button
              id="btn-new-project"
              onClick={() => navigate("/create-project")}
              className="btn-secondary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing.sm,
              }}
            >
              <span>+</span>
              <span>New Project</span>
            </button>

            <button
              id="btn-ai-assistant"
              onClick={() => navigate("/ai-assistant")}
              className="btn-secondary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing.sm,
                background: `linear-gradient(135deg, ${theme.colors.status.success}33 0%, ${theme.colors.brand.primary}33 100%)`,
                border: `1px solid ${theme.colors.status.success}66`,
              }}
            >
              <span>AI Automation</span>
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing.sm,
                padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                background: `${theme.colors.background.card}cc`,
                backdropFilter: theme.effects.backdropBlur.md,
                borderRadius: theme.borderRadius.md,
                border: `1px solid ${theme.colors.border.light}`,
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  background: `linear-gradient(135deg, ${theme.colors.brand.secondary} 0%, ${theme.colors.brand.tertiary} 100%)`,
                  borderRadius: theme.borderRadius.full,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: theme.colors.text.primary,
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.semibold,
                }}
              >
                {user.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <span
                style={{
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                  color: theme.colors.text.primary,
                }}
              >
                {user.username || "User"}
              </span>
            </div>

            <button
              id="btn-sign-out"
              onClick={onSignOut}
              className="btn-secondary"
              style={{
                padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
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
          padding: theme.spacing["2xl"],
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Organization Info */}
        <div style={{ marginBottom: theme.spacing["2xl"] }}>
          <OrganizationInfo />
        </div>

        {/* Stats Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: theme.spacing.lg,
            marginBottom: theme.spacing["2xl"],
          }}
        >
          <div
            className="card"
            style={{
              padding: `${theme.spacing.xl} ${theme.spacing["2xl"]}`,
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.lg,
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: theme.colors.background.hover,
                borderRadius: theme.borderRadius.md,
              }}
            >
              <HashtagIcon
                style={{
                  width: "24px",
                  height: "24px",
                  color: theme.colors.text.primary,
                }}
              />
            </div>
            <div>
              <div
                style={{
                  fontSize: theme.typography.fontSize["3xl"],
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text.primary,
                  lineHeight: theme.typography.lineHeight.tight,
                  marginBottom: theme.spacing.sm,
                }}
              >
                {projects.length}
              </div>
              <div
                style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.secondary,
                  fontWeight: theme.typography.fontWeight.medium,
                  whiteSpace: "nowrap",
                }}
              >
                Total Projects
              </div>
            </div>
          </div>

          <div
            className="card"
            style={{
              padding: `${theme.spacing.xl} ${theme.spacing["2xl"]}`,
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.lg,
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `rgba(34, 197, 94, 0.1)`,
                borderRadius: theme.borderRadius.md,
              }}
            >
              <CheckCircleIcon
                style={{
                  width: "24px",
                  height: "24px",
                  color: theme.colors.status.success,
                }}
              />
            </div>
            <div>
              <div
                style={{
                  fontSize: theme.typography.fontSize["3xl"],
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text.primary,
                  lineHeight: theme.typography.lineHeight.tight,
                  marginBottom: theme.spacing.sm,
                }}
              >
                {taskStats.completed}
              </div>
              <div
                style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.secondary,
                  fontWeight: theme.typography.fontWeight.medium,
                  whiteSpace: "nowrap",
                }}
              >
                Tasks Completed
              </div>
            </div>
          </div>

          <div
            className="card"
            style={{
              padding: `${theme.spacing.xl} ${theme.spacing["2xl"]}`,
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.lg,
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `rgba(245, 158, 11, 0.1)`,
                borderRadius: theme.borderRadius.md,
              }}
            >
              <ClockIcon
                style={{
                  width: "24px",
                  height: "24px",
                  color: theme.colors.status.warning,
                }}
              />
            </div>
            <div>
              <div
                style={{
                  fontSize: theme.typography.fontSize["3xl"],
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text.primary,
                  lineHeight: theme.typography.lineHeight.tight,
                  marginBottom: theme.spacing.sm,
                }}
              >
                {taskStats.inProgress}
              </div>
              <div
                style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.secondary,
                  fontWeight: theme.typography.fontWeight.medium,
                  whiteSpace: "nowrap",
                }}
              >
                In Progress
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div
          style={{
            marginBottom: theme.spacing.xl,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: theme.spacing.lg,
          }}
        >
          <h2
            style={{
              fontSize: theme.typography.fontSize["2xl"],
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text.primary,
              textShadow: theme.effects.textShadow.md,
            }}
          >
            Your Projects
          </h2>
          <div
            style={{
              display: "flex",
              gap: theme.spacing.md,
              position: "relative",
            }}
          >
            {/* Sort By Dropdown */}
            <div style={{ position: "relative" }}>
              <button
                className="btn-secondary"
                style={{
                  padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                  fontSize: theme.typography.fontSize.sm,
                }}
                onClick={() => setShowSortMenu(!showSortMenu)}
              >
                Sort by
              </button>
              {showSortMenu && (
                <div
                  style={{
                    position: "absolute",
                    top: `calc(100% + ${theme.spacing.sm})`,
                    right: 0,
                    background: `${theme.colors.background.card}fa`,
                    border: `2px solid ${theme.colors.border.default}`,
                    borderRadius: theme.borderRadius.lg,
                    padding: theme.spacing.sm,
                    minWidth: "180px",
                    zIndex: 1000,
                    boxShadow: theme.shadows.lg,
                  }}
                >
                  {[
                    { value: "default", label: "Default" },
                    { value: "name", label: "Name (A-Z)" },
                    { value: "date", label: "Newest First" },
                    { value: "oldest", label: "Oldest First" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setShowSortMenu(false);
                      }}
                      style={{
                        width: "100%",
                        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                        textAlign: "left",
                        background:
                          sortBy === option.value
                            ? theme.colors.background.hover
                            : "transparent",
                        border: "none",
                        borderRadius: theme.borderRadius.sm,
                        cursor: "pointer",
                        fontSize: theme.typography.fontSize.sm,
                        color: theme.colors.text.primary,
                        fontWeight:
                          sortBy === option.value
                            ? theme.typography.fontWeight.semibold
                            : theme.typography.fontWeight.medium,
                        marginBottom: theme.spacing.xs,
                        transition: theme.effects.transition.fast,
                      }}
                      onMouseEnter={(e) => {
                        if (sortBy !== option.value) {
                          e.currentTarget.style.background =
                            theme.colors.background.hover + "66";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (sortBy !== option.value) {
                          e.currentTarget.style.background = "transparent";
                        }
                      }}
                    >
                      {sortBy === option.value ? "✓ " : ""}
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: theme.spacing["4xl"],
            }}
          >
            <div
              className="spinner"
              style={{ width: "40px", height: "40px", borderWidth: "3px" }}
            />
          </div>
        ) : projects.length === 0 ? (
          <div
            className="card-glass-solid"
            style={{
              padding: `${theme.spacing["4xl"]} ${theme.spacing["2xl"]}`,
              textAlign: "center",
              border: `2px dashed ${theme.colors.border.light}66`,
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                background: `linear-gradient(135deg, ${theme.colors.brand.secondary} 0%, ${theme.colors.brand.tertiary} 100%)`,
                borderRadius: theme.borderRadius.full,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: theme.typography.fontSize["3xl"],
                margin: `0 auto ${theme.spacing.xl}`,
              }}
            >
              T
            </div>
            <h3
              style={{
                fontSize: theme.typography.fontSize["2xl"],
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing.md,
                textShadow: theme.effects.textShadow.sm,
              }}
            >
              No projects yet
            </h3>
            <p
              style={{
                fontSize: theme.typography.fontSize.base,
                color: theme.colors.text.secondary,
                marginBottom: theme.spacing["2xl"],
                maxWidth: "500px",
                margin: `0 auto ${theme.spacing["2xl"]}`,
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
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                margin: "0 auto",
              }}
            >
              <RocketLaunchIcon style={{ width: "20px", height: "20px" }} />
              Create Your First Project
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: theme.spacing.xl,
            }}
          >
            {(() => {
              let sortedProjects = [...projects];
              if (sortBy === "name") {
                sortedProjects.sort((a, b) => a.name.localeCompare(b.name));
              } else if (sortBy === "date") {
                sortedProjects.sort(
                  (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                );
              } else if (sortBy === "oldest") {
                sortedProjects.sort(
                  (a, b) =>
                    new Date(a.created_at).getTime() -
                    new Date(b.created_at).getTime()
                );
              }
              return sortedProjects;
            })().map((project, index) => (
              <div
                key={project.id}
                id={`project-card-${index}`}
                data-project-id={project.id}
                className="card-glass-solid project-card"
                style={{
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                }}
                onClick={() => navigate(`/project/${project.id}`)}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    width: "40px",
                    height: "40px",
                    background: theme.colors.brand.redGradient,
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FolderIcon
                    style={{
                      width: "24px",
                      height: "24px",
                      color: theme.colors.text.primary,
                    }}
                  />
                </div>
                <h3
                  style={{
                    fontSize: theme.typography.fontSize.xl,
                    fontWeight: theme.typography.fontWeight.bold,
                    color: theme.colors.text.primary,
                    marginBottom: theme.spacing.md,
                    paddingRight: theme.spacing["3xl"],
                    textShadow: theme.effects.textShadow.sm,
                  }}
                >
                  {project.name}
                </h3>
                <p
                  style={{
                    fontSize: theme.typography.fontSize.base,
                    color: theme.colors.text.secondary,
                    marginBottom: theme.spacing.xl,
                    lineHeight: theme.typography.lineHeight.relaxed,
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
                    paddingTop: theme.spacing.lg,
                    borderTop: `1px solid ${theme.colors.border.light}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: theme.spacing.sm,
                    }}
                  >
                    <span
                      style={{
                        fontSize: theme.typography.fontSize.xs,
                        color: theme.colors.text.muted,
                      }}
                    >
                      Due:
                    </span>
                    <span
                      style={{
                        fontSize: theme.typography.fontSize.sm,
                        color: theme.colors.text.secondary,
                        fontWeight: theme.typography.fontWeight.medium,
                      }}
                    >
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    className="btn-secondary"
                    style={{
                      padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                      fontSize: theme.typography.fontSize.sm,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/task-board`);
                    }}
                  >
                    View Tasks
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
