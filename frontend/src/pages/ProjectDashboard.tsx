import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { taskService } from "../services/taskService";
import NotificationBell from "../components/NotificationBell";

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
  assignee_id?: number;
  due_date?: string;
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
  const [tasks, setTasks] = useState<Task[]>([]);
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
          setTasks(fetchedTasks);

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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          className="spinner"
          style={{ width: "40px", height: "40px", borderWidth: "3px" }}
        />
      </div>
    );
  }

  if (!project) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          className="card-glass-solid"
          style={{
            textAlign: "center",
            padding: "3rem",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>😕</div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "#ECDFCC",
              marginBottom: "1rem",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Project Not Found
          </h2>
          <button onClick={() => navigate("/")} className="btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const recentTasks = tasks.slice(0, 5);

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
                color: "#ECDFCC",
              }}
            >
              {project.name}
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
              onClick={() => navigate(`/project/${projectId}/epics`)}
              className="btn-secondary"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <span>📚</span>
              <span>Epics</span>
            </button>
            <button
              onClick={() => navigate(`/project/${projectId}/risk-dashboard`)}
              className="btn-secondary"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <span>⚠️</span>
              <span>Risks</span>
            </button>
            <button
              onClick={() => navigate(`/project/${projectId}/issues`)}
              className="btn-secondary"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <span>🐛</span>
              <span>Issues</span>
            </button>
            <button
              onClick={() => navigate("/task-board")}
              className="btn-secondary"
            >
              View Task Board
            </button>
            <NotificationBell />
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
        {/* Project Info */}
        <div
          className="card-glass-solid"
          style={{
            marginBottom: "2rem",
          }}
        >
          <p
            style={{
              fontSize: "0.9375rem",
              color: "#ECDFCC",
              lineHeight: "1.6",
            }}
          >
            {project.description || "No description provided"}
          </p>
          <div
            style={{
              marginTop: "1rem",
              fontSize: "0.8125rem",
              color: "#ECDFCC",
            }}
          >
            Created{" "}
            {new Date(project.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            <div
              className="card"
              style={{
                padding: "1rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#ECDFCC",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                }}
              >
                Total Tasks
              </div>
              <div
                style={{
                  fontSize: "1.75rem",
                  fontWeight: "700",
                  color: "#ECDFCC",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                {stats.totalTasks}
              </div>
            </div>

            <div
              className="card"
              style={{
                padding: "1rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#ECDFCC",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                }}
              >
                To Do
              </div>
              <div
                style={{
                  fontSize: "1.75rem",
                  fontWeight: "700",
                  color: "#ECDFCC",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                {stats.todoTasks}
              </div>
            </div>

            <div
              className="card"
              style={{
                padding: "1rem",
                textAlign: "center",
                background: "rgba(245, 158, 11, 0.15)",
                border: "1px solid rgba(245, 158, 11, 0.4)",
              }}
            >
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#ECDFCC",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                }}
              >
                In Progress
              </div>
              <div
                style={{
                  fontSize: "1.75rem",
                  fontWeight: "700",
                  color: "#f59e0b",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                {stats.inProgressTasks}
              </div>
            </div>

            <div
              className="card"
              style={{
                padding: "1rem",
                textAlign: "center",
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.4)",
              }}
            >
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#ECDFCC",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                }}
              >
                Completed
              </div>
              <div
                style={{
                  fontSize: "1.75rem",
                  fontWeight: "700",
                  color: "#10b981",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                {stats.doneTasks}
              </div>
            </div>
          </div>
        )}

        {/* Progress Section */}
        {stats && (
          <div
            className="card-glass-solid"
            style={{
              marginBottom: "2rem",
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
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "700",
                  color: "#ECDFCC",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                Overall Progress
              </h3>
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#ECDFCC",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                {stats.completionPercentage}%
              </span>
            </div>
            <div
              style={{
                width: "100%",
                height: "12px",
                background: "rgba(24, 28, 20, 0.3)",
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid rgba(236, 223, 204, 0.2)",
              }}
            >
              <div
                style={{
                  width: `${stats.completionPercentage}%`,
                  height: "100%",
                  background:
                    "linear-gradient(90deg, #10b981 0%, #34d399 100%)",
                  transition: "width 0.5s ease",
                  boxShadow: "0 0 10px rgba(16, 185, 129, 0.5)",
                }}
              />
            </div>
          </div>
        )}

        {/* Recent Tasks */}
        <div className="card-glass-solid">
          <h3
            style={{
              fontSize: "1.125rem",
              fontWeight: "700",
              color: "#ECDFCC",
              marginBottom: "1.25rem",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Recent Tasks
          </h3>
          {recentTasks.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                color: "#ECDFCC",
              }}
            >
              No tasks yet. Create tasks to get started.
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    padding: "1rem",
                    background: "rgba(236, 223, 204, 0.1)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "8px",
                    border: "1px solid rgba(236, 223, 204, 0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "0.75rem",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "rgba(236, 223, 204, 0.15)";
                    e.currentTarget.style.borderColor =
                      "rgba(236, 223, 204, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "rgba(236, 223, 204, 0.1)";
                    e.currentTarget.style.borderColor =
                      "rgba(236, 223, 204, 0.25)";
                  }}
                >
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <div
                      style={{
                        fontSize: "0.9375rem",
                        fontWeight: "600",
                        color: "#ECDFCC",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {task.title}
                    </div>
                    {task.due_date && (
                      <div
                        style={{
                          fontSize: "0.8125rem",
                          color: "#ECDFCC",
                          opacity: 0.8,
                        }}
                      >
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <span
                    style={{
                      padding: "0.375rem 0.75rem",
                      fontSize: "0.8125rem",
                      fontWeight: "600",
                      borderRadius: "8px",
                      background:
                        task.status === "Done"
                          ? "rgba(16, 185, 129, 0.2)"
                          : task.status === "In Progress"
                          ? "rgba(245, 158, 11, 0.2)"
                          : "rgba(236, 223, 204, 0.2)",
                      color:
                        task.status === "Done"
                          ? "#10b981"
                          : task.status === "In Progress"
                          ? "#f59e0b"
                          : "#ECDFCC",
                      border:
                        task.status === "Done"
                          ? "1px solid rgba(16, 185, 129, 0.5)"
                          : task.status === "In Progress"
                          ? "1px solid rgba(245, 158, 11, 0.5)"
                          : "1px solid rgba(236, 223, 204, 0.3)",
                    }}
                  >
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProjectDashboard;
