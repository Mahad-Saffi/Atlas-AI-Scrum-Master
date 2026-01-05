import React, { useState } from "react";
import { taskService } from "../../services/taskService";
import { useToast } from "../Toast";
import theme from "../../styles/theme";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  assignee_id?: string;
  due_date?: string;
  estimate_hours?: number;
  progress_percentage?: number;
  risk_level?: string;
  priority?: number;
}

interface TaskBoardProps {
  tasks: Task[];
  onTaskUpdate?: () => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, onTaskUpdate }) => {
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const { showToast } = useToast();

  // Log when TaskBoard receives tasks
  React.useEffect(() => {
    console.log(
      `\n[TaskBoard Component] 🎨 Rendering with ${tasks.length} tasks`
    );
    if (tasks.length > 0) {
      const projectIds = [...new Set(tasks.map((t) => t.project_id))];
      console.log(
        `[TaskBoard Component] 📊 Unique project IDs: ${projectIds.join(", ")}`
      );

      if (projectIds.length > 1) {
        console.error(
          `[TaskBoard Component] ❌ ERROR: Tasks from ${projectIds.length} different projects!`
        );
        projectIds.forEach((pid) => {
          const count = tasks.filter((t) => t.project_id === pid).length;
          console.error(`  - Project ${pid}: ${count} tasks`);
        });
      } else {
        console.log(
          `[TaskBoard Component] ✅ All tasks from project: ${projectIds[0]}`
        );
      }
    }
  }, [tasks]);

  const handleStartTask = async (taskId: string) => {
    try {
      setUpdatingTaskId(taskId);
      await taskService.updateTask(taskId, { status: "In Progress" });
      showToast("Task started!", "success");
      if (onTaskUpdate) {
        onTaskUpdate();
      }
    } catch (error: any) {
      console.error("Failed to start task:", error);
      const errorMessage =
        error.response?.data?.detail || error.message || "Unknown error";
      showToast(`Failed to start task: ${errorMessage}`, "error");
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      setUpdatingTaskId(taskId);
      await taskService.completeTask(taskId);
      showToast("Task completed successfully!", "success");
      if (onTaskUpdate) {
        onTaskUpdate();
      }
    } catch (error: any) {
      console.error("Failed to complete task:", error);
      const errorMessage =
        error.response?.data?.detail || error.message || "Unknown error";
      showToast(`Failed to complete task: ${errorMessage}`, "error");
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const columns = {
    "To Do": tasks.filter((task) => task.status === "To Do"),
    "In Progress": tasks.filter((task) => task.status === "In Progress"),
    Done: tasks.filter((task) => task.status === "Done"),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "To Do":
        return "#e5e7eb";
      case "In Progress":
        return "#fef3c7";
      case "Done":
        return "#d1fae5";
      default:
        return "#e5e7eb";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "var(--color-error)";
      case "medium":
        return "var(--color-warning)";
      default:
        return "var(--color-text-muted)";
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1.25rem",
        height: "100%",
      }}
    >
      {Object.entries(columns).map(([status, tasksInStatus]) => (
        <div
          key={status}
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Column Header */}
          <div
            style={{
              padding: `${theme.spacing.md} ${theme.spacing.lg}`,
              background: theme.colors.background.hover,
              borderRadius: theme.borderRadius.md,
              marginBottom: theme.spacing.lg,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3
              style={{
                fontSize: theme.typography.fontSize.base,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.primary,
                margin: 0,
              }}
            >
              {status}
            </h3>
            <span
              style={{
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.text.primary,
                background: theme.colors.background.hoverStrong,
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                borderRadius: theme.borderRadius.sm,
              }}
            >
              {tasksInStatus.length}
            </span>
          </div>

          {/* Tasks */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              flex: 1,
            }}
          >
            {tasksInStatus.length === 0 ? (
              <div
                style={{
                  padding: "2rem 1rem",
                  textAlign: "center",
                  color: theme.colors.text.primary,
                  fontSize: theme.typography.fontSize.sm,
                  background: theme.colors.background.hover,
                  borderRadius: theme.borderRadius.md,
                  border: `1px dashed ${theme.colors.border.light}`,
                }}
              >
                No tasks
              </div>
            ) : (
              tasksInStatus.map((task, taskIndex) => (
                <div
                  key={task.id}
                  id={`task-card-${status
                    .toLowerCase()
                    .replace(" ", "-")}-${taskIndex}`}
                  data-task-id={task.id}
                  className="card task-card"
                  style={{
                    padding: "1rem",
                    cursor: "pointer",
                    position: "relative",
                  }}
                >
                  {/* Risk Indicator */}
                  {task.risk_level && (
                    <div
                      style={{
                        position: "absolute",
                        top: "0.75rem",
                        right: "0.75rem",
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: getRiskColor(task.risk_level),
                      }}
                    />
                  )}

                  {/* Task Title */}
                  <h4
                    style={{
                      fontSize: "0.9375rem",
                      fontWeight: "500",
                      color: "var(--color-text-primary)",
                      marginBottom: "0.5rem",
                      paddingRight: "1rem",
                      lineHeight: "1.4",
                    }}
                  >
                    {task.title}
                  </h4>

                  {/* Task Description */}
                  {task.description && (
                    <p
                      style={{
                        fontSize: "0.8125rem",
                        color: "var(--color-text-secondary)",
                        marginBottom: "0.75rem",
                        lineHeight: "1.5",
                      }}
                    >
                      {task.description.length > 80
                        ? `${task.description.substring(0, 80)}...`
                        : task.description}
                    </p>
                  )}

                  {/* Progress Bar */}
                  {task.progress_percentage !== undefined &&
                    task.progress_percentage > 0 && (
                      <div style={{ marginBottom: "0.75rem" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "0.375rem",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--color-text-muted)",
                            }}
                          >
                            Progress
                          </span>
                          <span
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: "600",
                              color: "var(--color-text-primary)",
                            }}
                          >
                            {task.progress_percentage}%
                          </span>
                        </div>
                        <div
                          style={{
                            width: "100%",
                            height: "4px",
                            background: "var(--color-light-gray)",
                            borderRadius: "var(--radius-sm)",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${task.progress_percentage}%`,
                              height: "100%",
                              background: "var(--color-dark)",
                              transition: "width 0.3s ease",
                            }}
                          />
                        </div>
                      </div>
                    )}

                  {/* Task Meta */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: status !== "Done" ? "0.75rem" : "0",
                      fontSize: "0.75rem",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    {task.due_date && (
                      <span>
                        Due:{" "}
                        {new Date(task.due_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    )}
                    {task.estimate_hours && <span>{task.estimate_hours}h</span>}
                  </div>

                  {/* Action Button */}
                  {status === "To Do" && (
                    <button
                      id={`btn-start-task-${taskIndex}`}
                      onClick={() => handleStartTask(task.id)}
                      disabled={updatingTaskId === task.id}
                      className="btn-secondary btn-start-task"
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        fontSize: "0.8125rem",
                        opacity: updatingTaskId === task.id ? 0.6 : 1,
                        cursor:
                          updatingTaskId === task.id
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      {updatingTaskId === task.id
                        ? "Starting..."
                        : "Start Task"}
                    </button>
                  )}
                  {status === "In Progress" && (
                    <button
                      id={`btn-complete-task-${taskIndex}`}
                      onClick={() => handleCompleteTask(task.id)}
                      disabled={updatingTaskId === task.id}
                      className="btn-secondary btn-complete-task"
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        fontSize: "0.8125rem",
                        opacity: updatingTaskId === task.id ? 0.6 : 1,
                        cursor:
                          updatingTaskId === task.id
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      {updatingTaskId === task.id
                        ? "Completing..."
                        : "Mark Complete"}
                    </button>
                  )}

                  {/* Done Badge */}
                  {status === "Done" && (
                    <div
                      style={{
                        padding: theme.spacing.sm,
                        textAlign: "center",
                        background: `rgba(34, 197, 94, 0.2)`,
                        borderRadius: theme.borderRadius.sm,
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.semibold,
                        color: theme.colors.text.primary,
                        border: `1px solid ${theme.colors.status.success}66`,
                      }}
                    >
                      ✓ Completed
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskBoard;
