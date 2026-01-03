import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { taskService } from "../services/taskService";
import NotificationBell from "../components/NotificationBell";
import {
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  BoltIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  BugAntIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";

interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

interface Task {
  id: string;
  title: string;
  status: string;
}

interface ProjectStats {
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  doneTasks: number;
  completionPercentage: number;
}

const ProjectDashboard: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const projects = await taskService.getProjects();
        const currentProject = projects.find(
          (p: Project) => p.id === projectId
        );

        if (currentProject) {
          setProject(currentProject);
        }

        if (projectId) {
          const fetchedTasks = await taskService.getTasks(projectId);
          const todoCount = fetchedTasks.filter(
            (t: Task) => t.status === "To Do"
          ).length;
          const inProgressCount = fetchedTasks.filter(
            (t: Task) => t.status === "In Progress"
          ).length;
          const doneCount = fetchedTasks.filter(
            (t: Task) => t.status === "Done"
          ).length;
          const total = fetchedTasks.length;
          const completion =
            total > 0 ? Math.round((doneCount / total) * 100) : 0;

          setStats({
            totalTasks: total,
            todoTasks: todoCount,
            inProgressTasks: inProgressCount,
            doneTasks: doneCount,
            completionPercentage: completion,
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0a0a0f",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "rgba(17, 17, 24, 0.7)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "20px",
            padding: "3rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "3px solid #1a1a24",
              borderTop: "3px solid #dc2626",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 1rem",
            }}
          />
          <p style={{ color: "#94a3b8" }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0a0a0f",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <div
          style={{
            background: "rgba(17, 17, 24, 0.7)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "20px",
            padding: "3rem",
            textAlign: "center",
            maxWidth: "500px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "rgba(239, 68, 68, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
            }}
          >
            <ExclamationTriangleIcon
              style={{ width: "48px", height: "48px", color: "#dc2626" }}
            />
          </div>
          <h2
            style={{
              fontSize: "1.75rem",
              fontWeight: "700",
              color: "#f1f5f9",
              marginBottom: "0.75rem",
            }}
          >
            Project Not Found
          </h2>
          <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>
            The project you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "0.75rem 1.5rem",
              background: "linear-gradient(135deg, #dc2626, #991b1b)",
              border: "none",
              borderRadius: "12px",
              color: "white",
              fontSize: "0.9375rem",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(220, 38, 38, 0.4)",
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Tasks",
      value: stats?.totalTasks || 0,
      Icon: ClipboardDocumentListIcon,
      color: "#64748b",
      bg: "rgba(100, 116, 139, 0.15)",
    },
    {
      label: "To Do",
      value: stats?.todoTasks || 0,
      Icon: DocumentTextIcon,
      color: "#94a3b8",
      bg: "rgba(148, 163, 184, 0.15)",
    },
    {
      label: "In Progress",
      value: stats?.inProgressTasks || 0,
      Icon: BoltIcon,
      color: "#f59e0b",
      bg: "rgba(245, 158, 11, 0.15)",
    },
    {
      label: "Completed",
      value: stats?.doneTasks || 0,
      Icon: CheckCircleIcon,
      color: "#22c55e",
      bg: "rgba(34, 197, 94, 0.15)",
    },
  ];

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
            gap: "2rem",
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
            <h1
              style={{
                fontSize: "1.75rem",
                fontWeight: "700",
                color: "#f1f5f9",
                letterSpacing: "-0.01em",
              }}
            >
              {project.name}
            </h1>
          </div>

          {/* Action Buttons */}
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <button
              onClick={() => navigate("/task-board")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.25rem",
                background: "linear-gradient(135deg, #dc2626, #991b1b)",
                border: "none",
                borderRadius: "12px",
                color: "white",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(220, 38, 38, 0.4)",
              }}
            >
              <ClipboardDocumentListIcon
                style={{ width: "16px", height: "16px" }}
              />
              Task Board
            </button>

            <button
              onClick={() => navigate("/chat")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.25rem",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                color: "#f1f5f9",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <ChatBubbleLeftRightIcon
                style={{ width: "16px", height: "16px" }}
              />
              Chat
            </button>

            <button
              onClick={() => navigate(`/project/${projectId}/risks`)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.25rem",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                color: "#f1f5f9",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <ExclamationTriangleIcon
                style={{ width: "16px", height: "16px" }}
              />
              Risks
            </button>

            <button
              onClick={() => navigate(`/project/${projectId}/issues`)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.25rem",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                color: "#f1f5f9",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <BugAntIcon style={{ width: "16px", height: "16px" }} />
              Issues
            </button>

            <button
              onClick={() => navigate(`/project/${projectId}/epics`)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.25rem",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                color: "#f1f5f9",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <RectangleStackIcon style={{ width: "16px", height: "16px" }} />
              Epics
            </button>

            <NotificationBell />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          position: "relative",
          zIndex: 1,
          padding: "2rem 3rem",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* Project Description */}
        {project.description && (
          <p
            style={{
              fontSize: "1.125rem",
              color: "#94a3b8",
              marginBottom: "2rem",
            }}
          >
            {project.description}
          </p>
        )}

        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1.5rem",
            marginBottom: "3rem",
          }}
        >
          {statCards.map((stat, index) => (
            <div
              key={stat.label}
              style={{
                background: "rgba(17, 17, 24, 0.7)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "20px",
                padding: "1.25rem 1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: stat.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <stat.Icon
                  style={{ width: "24px", height: "24px", color: stat.color }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: "700",
                    color: "#f1f5f9",
                    lineHeight: 1,
                    marginBottom: "0.25rem",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "#94a3b8",
                    lineHeight: 1,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Section */}
        {stats && (
          <div
            style={{
              background: "rgba(17, 17, 24, 0.7)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "20px",
              padding: "2rem",
              marginBottom: "3rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.5rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  color: "#f1f5f9",
                }}
              >
                Project Progress
              </h3>
              <span
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  color: "#dc2626",
                }}
              >
                {stats.completionPercentage}%
              </span>
            </div>

            <div
              style={{
                width: "100%",
                height: "12px",
                background: "rgba(26, 26, 36, 0.9)",
                borderRadius: "20px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${stats.completionPercentage}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #dc2626, #ef4444)",
                  borderRadius: "20px",
                  transition: "width 0.4s ease",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "1rem",
                fontSize: "0.9375rem",
                color: "#94a3b8",
              }}
            >
              <span>
                {stats.doneTasks} of {stats.totalTasks} tasks completed
              </span>
              <span>{stats.totalTasks - stats.doneTasks} remaining</span>
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ProjectDashboard;
