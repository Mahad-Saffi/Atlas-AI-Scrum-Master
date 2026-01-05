import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { taskService } from "../services/taskService";
import NotificationBell from "../components/NotificationBell";
import theme from "../styles/theme";

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
    const fetchData = async (isInitialLoad = false) => {
      try {
        if (isInitialLoad) {
          setLoading(true);
        }

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
        if (isInitialLoad) {
          setLoading(false);
        }
      }
    };

    fetchData(true);

    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      fetchData(false);
    }, 10000);

    return () => clearInterval(interval);
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
            padding: theme.spacing["4xl"],
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              background: `${theme.colors.background.card}1a`,
              borderRadius: theme.borderRadius.full,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: `0 auto ${theme.spacing.lg}`,
              border: `1px solid ${theme.colors.border.light}`,
            }}
          >
            <span
              style={{
                fontSize: theme.typography.fontSize["2xl"],
                color: theme.colors.text.muted,
              }}
            >
              ?
            </span>
          </div>
          <h2
            style={{
              fontSize: theme.typography.fontSize["2xl"],
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing.lg,
              textShadow: theme.effects.textShadow.sm,
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
            <h1
              style={{
                fontSize: theme.typography.fontSize.xl,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.primary,
              }}
            >
              {project.name}
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
              id="btn-epics"
              onClick={() => navigate(`/project/${projectId}/epics`)}
              className="btn-secondary"
            >
              Epics
            </button>
            <button
              id="btn-risks"
              onClick={() => navigate(`/project/${projectId}/risk-dashboard`)}
              className="btn-secondary"
            >
              Risks
            </button>
            <button
              id="btn-issues"
              onClick={() => navigate(`/project/${projectId}/issues`)}
              className="btn-secondary"
            >
              Issues
            </button>
            <button
              id="btn-task-board"
              onClick={() => navigate(`/task-board?projectId=${projectId}`)}
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
          padding: theme.spacing["2xl"],
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Project Info */}
        <div
          className="card-glass-solid"
          style={{
            marginBottom: theme.spacing["2xl"],
          }}
        >
          <p
            style={{
              fontSize: theme.typography.fontSize.base,
              color: theme.colors.text.secondary,
              lineHeight: theme.typography.lineHeight.relaxed,
            }}
          >
            {project.description || "No description provided"}
          </p>
          <div
            style={{
              marginTop: theme.spacing.lg,
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.muted,
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
              gap: theme.spacing.lg,
              marginBottom: theme.spacing["2xl"],
            }}
          >
            <div
              className="card"
              style={{
                padding: theme.spacing.lg,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.text.secondary,
                  marginBottom: theme.spacing.sm,
                  fontWeight: theme.typography.fontWeight.semibold,
                }}
              >
                Total Tasks
              </div>
              <div
                style={{
                  fontSize: theme.typography.fontSize["3xl"],
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text.primary,
                  textShadow: theme.effects.textShadow.sm,
                }}
              >
                {stats.totalTasks}
              </div>
            </div>

            <div
              className="card"
              style={{
                padding: theme.spacing.lg,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.text.secondary,
                  marginBottom: theme.spacing.sm,
                  fontWeight: theme.typography.fontWeight.semibold,
                }}
              >
                To Do
              </div>
              <div
                style={{
                  fontSize: theme.typography.fontSize["3xl"],
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text.primary,
                  textShadow: theme.effects.textShadow.sm,
                }}
              >
                {stats.todoTasks}
              </div>
            </div>

            <div
              className="card"
              style={{
                padding: theme.spacing.lg,
                textAlign: "center",
                background: `${theme.colors.status.warning}26`,
                border: `1px solid ${theme.colors.status.warning}66`,
              }}
            >
              <div
                style={{
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.text.secondary,
                  marginBottom: theme.spacing.sm,
                  fontWeight: theme.typography.fontWeight.semibold,
                }}
              >
                In Progress
              </div>
              <div
                style={{
                  fontSize: theme.typography.fontSize["3xl"],
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text.primary,
                  textShadow: theme.effects.textShadow.sm,
                }}
              >
                {stats.inProgressTasks}
              </div>
            </div>

            <div
              className="card"
              style={{
                padding: theme.spacing.lg,
                textAlign: "center",
                background: `${theme.colors.status.success}26`,
                border: `1px solid ${theme.colors.status.success}66`,
              }}
            >
              <div
                style={{
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.text.secondary,
                  marginBottom: theme.spacing.sm,
                  fontWeight: theme.typography.fontWeight.semibold,
                }}
              >
                Completed
              </div>
              <div
                style={{
                  fontSize: theme.typography.fontSize["3xl"],
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text.primary,
                  textShadow: theme.effects.textShadow.sm,
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
              marginBottom: theme.spacing["2xl"],
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: theme.spacing.lg,
              }}
            >
              <h3
                style={{
                  fontSize: theme.typography.fontSize.lg,
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text.primary,
                  textShadow: theme.effects.textShadow.sm,
                }}
              >
                Overall Progress
              </h3>
              <span
                style={{
                  fontSize: theme.typography.fontSize["2xl"],
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text.primary,
                  textShadow: theme.effects.textShadow.sm,
                }}
              >
                {stats.completionPercentage}%
              </span>
            </div>
            <div
              style={{
                width: "100%",
                height: "12px",
                background: `${theme.colors.background.tertiary}4d`,
                borderRadius: theme.borderRadius.lg,
                overflow: "hidden",
                border: `1px solid ${theme.colors.border.light}`,
              }}
            >
              <div
                style={{
                  width: `${stats.completionPercentage}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${theme.colors.status.success} 0%, #34d399 100%)`,
                  transition: theme.effects.transition.base,
                  boxShadow: `0 0 10px ${theme.colors.status.success}80`,
                }}
              />
            </div>
          </div>
        )}

        {/* Recent Tasks */}
        <div className="card-glass-solid">
          <h3
            style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing.xl,
              textShadow: theme.effects.textShadow.sm,
            }}
          >
            Recent Tasks
          </h3>
          {recentTasks.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: theme.spacing["2xl"],
                color: theme.colors.text.secondary,
              }}
            >
              No tasks yet. Create tasks to get started.
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing.md,
              }}
            >
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    padding: theme.spacing.lg,
                    background: `${theme.colors.background.card}1a`,
                    backdropFilter: theme.effects.backdropBlur.md,
                    borderRadius: theme.borderRadius.lg,
                    border: `1px solid ${theme.colors.border.light}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: theme.spacing.md,
                    transition: theme.effects.transition.fast,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      theme.colors.background.hover;
                    e.currentTarget.style.borderColor = `${theme.colors.border.light}66`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `${theme.colors.background.card}1a`;
                    e.currentTarget.style.borderColor =
                      theme.colors.border.light;
                  }}
                >
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <div
                      style={{
                        fontSize: theme.typography.fontSize.base,
                        fontWeight: theme.typography.fontWeight.semibold,
                        color: theme.colors.text.primary,
                        marginBottom: theme.spacing.xs,
                      }}
                    >
                      {task.title}
                    </div>
                    {task.due_date && (
                      <div
                        style={{
                          fontSize: theme.typography.fontSize.sm,
                          color: theme.colors.text.muted,
                        }}
                      >
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <span
                    style={{
                      padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                      fontSize: theme.typography.fontSize.sm,
                      fontWeight: theme.typography.fontWeight.semibold,
                      borderRadius: theme.borderRadius.lg,
                      background:
                        task.status === "Done"
                          ? `${theme.colors.status.success}33`
                          : task.status === "In Progress"
                          ? `${theme.colors.status.warning}33`
                          : `${theme.colors.background.card}33`,
                      color:
                        task.status === "Done"
                          ? theme.colors.status.success
                          : task.status === "In Progress"
                          ? theme.colors.status.warning
                          : theme.colors.text.secondary,
                      border:
                        task.status === "Done"
                          ? `1px solid ${theme.colors.status.success}80`
                          : task.status === "In Progress"
                          ? `1px solid ${theme.colors.status.warning}80`
                          : `1px solid ${theme.colors.border.light}`,
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
