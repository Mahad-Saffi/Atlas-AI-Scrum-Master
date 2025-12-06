import React, { useState } from "react";
import { taskService } from "../../services/taskService";

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
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);

  const handleCompleteTask = async (taskId: string) => {
    try {
      setCompletingTaskId(taskId);
      await taskService.completeTask(taskId);
      if (onTaskUpdate) {
        onTaskUpdate();
      }
    } catch (error) {
      console.error("Failed to complete task:", error);
      alert("Failed to complete task. Please try again.");
    } finally {
      setCompletingTaskId(null);
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
              padding: "0.75rem 1rem",
              background: "var(--color-light-gray)",
              borderRadius: "var(--radius-md)",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3
              style={{
                fontSize: "0.9375rem",
                fontWeight: "600",
                color: "var(--color-text-primary)",
                margin: 0,
              }}
            >
              {status}
            </h3>
            <span
              style={{
                fontSize: "0.8125rem",
                fontWeight: "500",
                color: "var(--color-text-secondary)",
                background: "var(--color-white)",
                padding: "0.25rem 0.625rem",
                borderRadius: "var(--radius-sm)",
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
                  color: "var(--color-text-muted)",
                  fontSize: "0.875rem",
                  background: "var(--color-light-gray)",
                  borderRadius: "var(--radius-md)",
                  border: "1px dashed var(--color-border)",
                }}
              >
                No tasks
              </div>
            ) : (
              tasksInStatus.map((task) => (
                <div
                  key={task.id}
                  className="card"
                  style={{
                    padding: "1rem",
                    cursor: "pointer",
                    position: "relative",
                  }}
                >
                  {/* Risk Indicator */}
                  {task.risk_level && task.risk_level !== "low" && (
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
                        📅{" "}
                        {new Date(task.due_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    )}
                    {task.estimate_hours && (
                      <span>⏱️ {task.estimate_hours}h</span>
                    )}
                  </div>

                  {/* Action Button */}
                  {status !== "Done" && (
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      disabled={completingTaskId === task.id}
                      className="btn-secondary"
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        fontSize: "0.8125rem",
                        opacity: completingTaskId === task.id ? 0.6 : 1,
                        cursor:
                          completingTaskId === task.id
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      {completingTaskId === task.id
                        ? "Completing..."
                        : "Mark Complete"}
                    </button>
                  )}

                  {/* Done Badge */}
                  {status === "Done" && (
                    <div
                      style={{
                        padding: "0.5rem",
                        textAlign: "center",
                        background: "#d1fae5",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "0.8125rem",
                        fontWeight: "500",
                        color: "#065f46",
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
