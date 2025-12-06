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
          background: "var(--color-cream)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
          background: "var(--color-cream)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="card"
          style={{
            textAlign: "center",
            padding: "3rem",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>😕</div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              color: "var(--color-text-primary)",
              marginBottom: "1rem",
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
              onClick={() => navigate("/task-board")}
              className="btn-primary"
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
        }}
      >
        {/* Project Info */}
        <div
          className="card"
          style={{
            padding: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <p
            style={{
              fontSize: "0.9375rem",
              color: "var(--color-text-secondary)",
              lineHeight: "1.6",
            }}
          >
            {project.description || "No description provided"}
          </p>
          <div
            style={{
              marginTop: "1rem",
              fontSize: "0.8125rem",
              color: "var(--color-text-muted)",
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
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.25rem",
              marginBottom: "2rem",
            }}
          >
            <div className="card" style={{ padding: "1.5rem" }}>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "var(--color-text-secondary)",
                  marginBottom: "0.75rem",
                }}
              >
                Total Tasks
              </div>
              <div
                style={{
                  fontSize: "2.25rem",
                  fontWeight: "600",
                  color: "var(--color-text-primary)",
                }}
              >
                {stats.totalTasks}
              </div>
            </div>

            <div className="card" style={{ padding: "1.5rem" }}>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "var(--color-text-secondary)",
                  marginBottom: "0.75rem",
                }}
              >
                To Do
              </div>
              <div
                style={{
                  fontSize: "2.25rem",
                  fontWeight: "600",
                  color: "var(--color-text-primary)",
                }}
              >
                {stats.todoTasks}
              </div>
            </div>

            <div className="card" style={{ padding: "1.5rem" }}>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "var(--color-text-secondary)",
                  marginBottom: "0.75rem",
                }}
              >
                In Progress
              </div>
              <div
                style={{
                  fontSize: "2.25rem",
                  fontWeight: "600",
                  color: "var(--color-warning)",
                }}
              >
                {stats.inProgressTasks}
              </div>
            </div>

            <div className="card" style={{ padding: "1.5rem" }}>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "var(--color-text-secondary)",
                  marginBottom: "0.75rem",
                }}
              >
                Completed
              </div>
              <div
                style={{
                  fontSize: "2.25rem",
                  fontWeight: "600",
                  color: "var(--color-success)",
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
            className="card"
            style={{
              padding: "1.5rem",
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
                  fontWeight: "600",
                  color: "var(--color-text-primary)",
                }}
              >
                Progress
              </h3>
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  color: "var(--color-text-primary)",
                }}
              >
                {stats.completionPercentage}%
              </span>
            </div>
            <div
              style={{
                width: "100%",
                height: "12px",
                background: "var(--color-light-gray)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${stats.completionPercentage}%`,
                  height: "100%",
                  background:
                    "linear-gradient(90deg, var(--color-success), #34d399)",
                  transition: "width 0.5s ease",
                }}
              />
            </div>
          </div>
        )}

        {/* Recent Tasks */}
        <div
          className="card"
          style={{
            padding: "1.5rem",
          }}
        >
          <h3
            style={{
              fontSize: "1.125rem",
              fontWeight: "600",
              color: "var(--color-text-primary)",
              marginBottom: "1.25rem",
            }}
          >
            Recent Tasks
          </h3>
          {recentTasks.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                color: "var(--color-text-secondary)",
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
                    background: "var(--color-light-gray)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "0.9375rem",
                        fontWeight: "500",
                        color: "var(--color-text-primary)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {task.title}
                    </div>
                    {task.due_date && (
                      <div
                        style={{
                          fontSize: "0.8125rem",
                          color: "var(--color-text-muted)",
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
                      fontWeight: "500",
                      borderRadius: "var(--radius-sm)",
                      background:
                        task.status === "Done"
                          ? "#d1fae5"
                          : task.status === "In Progress"
                          ? "#fef3c7"
                          : "#e5e7eb",
                      color:
                        task.status === "Done"
                          ? "#065f46"
                          : task.status === "In Progress"
                          ? "#92400e"
                          : "#374151",
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
