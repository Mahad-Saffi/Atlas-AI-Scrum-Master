import React, { useState } from "react";
import { taskService } from "../../services/taskService";
import { useToast } from "../Toast";
import { CalendarIcon, ClockIcon, CheckIcon } from "@heroicons/react/24/solid";

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

// Exact mockup styling
const columnStyles = {
  "To Do": {
    headerBg: "rgba(100, 116, 139, 0.12)",
    accentColor: "#64748b",
    borderColor: "rgba(100, 116, 139, 0.4)",
    badgeBg: "rgba(100, 116, 139, 0.2)",
  },
  "In Progress": {
    headerBg: "rgba(245, 158, 11, 0.12)",
    accentColor: "#f59e0b",
    borderColor: "rgba(245, 158, 11, 0.4)",
    badgeBg: "rgba(245, 158, 11, 0.2)",
  },
  "Done": {
    headerBg: "rgba(34, 197, 94, 0.12)",
    accentColor: "#22c55e",
    borderColor: "rgba(34, 197, 94, 0.4)",
    badgeBg: "rgba(34, 197, 94, 0.2)",
  },
};

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, onTaskUpdate }) => {
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleCompleteTask = async (taskId: string) => {
    try {
      setCompletingTaskId(taskId);
      await taskService.completeTask(taskId);
      showToast("Task completed successfully!", "success");
      if (onTaskUpdate) onTaskUpdate();
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || "Unknown error";
      showToast(`Failed to complete task: ${errorMessage}`, "error");
    } finally {
      setCompletingTaskId(null);
    }
  };

  const columns = {
    "To Do": tasks.filter((task) => task.status === "To Do"),
    "In Progress": tasks.filter((task) => task.status === "In Progress"),
    "Done": tasks.filter((task) => task.status === "Done"),
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "#ef4444";
      case "medium": return "#f59e0b";
      default: return "#64748b";
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", height: "100%", padding: "0.5rem" }}>
      {(Object.entries(columns) as [keyof typeof columnStyles, Task[]][]).map(([status, tasksInStatus]) => {
        const style = columnStyles[status];
        return (
          <div key={status} style={{ display: "flex", flexDirection: "column" }}>
            {/* Column Header - Glass with accent border */}
            <div
              style={{
                padding: "1rem 1.25rem",
                background: style.headerBg,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderRadius: "16px",
                marginBottom: "1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderLeft: `4px solid ${style.accentColor}`,
                boxShadow: `0 4px 20px rgba(0, 0, 0, 0.15)`,
              }}
            >
              <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#f1f5f9", margin: 0, letterSpacing: "-0.01em" }}>
                {status}
              </h3>
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  color: style.accentColor,
                  background: style.badgeBg,
                  padding: "0.375rem 0.875rem",
                  borderRadius: "20px",
                }}
              >
                {tasksInStatus.length}
              </span>
            </div>

            {/* Tasks Container */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", flex: 1 }}>
              {tasksInStatus.length === 0 ? (
                <div
                  style={{
                    padding: "3rem 1.5rem",
                    textAlign: "center",
                    color: "#64748b",
                    fontSize: "0.9375rem",
                    background: "rgba(255, 255, 255, 0.02)",
                    borderRadius: "16px",
                    border: "2px dashed rgba(255, 255, 255, 0.08)",
                  }}
                >
                  No tasks
                </div>
              ) : (
                tasksInStatus.map((task) => (
                  <div
                    key={task.id}
                    style={{
                      background: "rgba(17, 17, 24, 0.85)",
                      backdropFilter: "blur(16px)",
                      WebkitBackdropFilter: "blur(16px)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "16px",
                      padding: "1.25rem",
                      cursor: "pointer",
                      position: "relative",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(220, 38, 38, 0.4)";
                      e.currentTarget.style.boxShadow = "0 8px 28px rgba(220, 38, 38, 0.12)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    {/* Risk Indicator */}
                    {task.risk_level && task.risk_level !== "low" && (
                      <div
                        style={{
                          position: "absolute",
                          top: "1rem",
                          right: "1rem",
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          background: getRiskColor(task.risk_level),
                          boxShadow: `0 0 10px ${getRiskColor(task.risk_level)}`,
                        }}
                      />
                    )}

                    {/* Title */}
                    <h4 style={{ fontSize: "1rem", fontWeight: 600, color: "#f1f5f9", marginBottom: "0.625rem", paddingRight: "1.5rem", lineHeight: 1.45 }}>
                      {task.title}
                    </h4>

                    {/* Description */}
                    {task.description && (
                      <p style={{ fontSize: "0.875rem", color: "#94a3b8", marginBottom: "1rem", lineHeight: 1.6 }}>
                        {task.description.length > 90 ? `${task.description.substring(0, 90)}...` : task.description}
                      </p>
                    )}

                    {/* Progress Bar */}
                    {task.progress_percentage !== undefined && task.progress_percentage > 0 && (
                      <div style={{ marginBottom: "1rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                          <span style={{ fontSize: "0.8125rem", color: "#64748b" }}>Progress</span>
                          <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#f1f5f9" }}>{task.progress_percentage}%</span>
                        </div>
                        <div style={{ width: "100%", height: "6px", background: "rgba(26, 26, 36, 0.9)", borderRadius: "20px", overflow: "hidden" }}>
                          <div
                            style={{
                              width: `${task.progress_percentage}%`,
                              height: "100%",
                              background: "linear-gradient(90deg, #dc2626, #ef4444)",
                              borderRadius: "20px",
                              transition: "width 0.4s ease",
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Meta */}
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: status !== "Done" ? "1rem" : "0", fontSize: "0.8125rem", color: "#64748b" }}>
                      {task.due_date && (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <CalendarIcon style={{ width: "16px", height: "16px" }} />
                          {new Date(task.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </div>
                      )}
                      {task.estimate_hours && (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <ClockIcon style={{ width: "16px", height: "16px" }} />
                          {task.estimate_hours}h
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    {status !== "Done" && (
                      <button
                        onClick={() => handleCompleteTask(task.id)}
                        disabled={completingTaskId === task.id}
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          borderRadius: "12px",
                          color: "#f1f5f9",
                          cursor: completingTaskId === task.id ? "not-allowed" : "pointer",
                          opacity: completingTaskId === task.id ? 0.6 : 1,
                          transition: "all 0.25s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px"
                        }}
                        onMouseEnter={(e) => {
                          if (completingTaskId !== task.id) {
                            e.currentTarget.style.background = "rgba(34, 197, 94, 0.15)";
                            e.currentTarget.style.borderColor = "rgba(34, 197, 94, 0.4)";
                            e.currentTarget.style.color = "#4ade80";
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                          e.currentTarget.style.color = "#f1f5f9";
                        }}
                      >
                        {completingTaskId === task.id ? (
                          "Completing..."
                        ) : (
                          <>
                            <CheckIcon style={{ width: "16px", height: "16px" }} /> Mark Complete
                          </>
                        )}
                      </button>
                    )}

                    {/* Done Badge */}
                    {status === "Done" && (
                      <div
                        style={{
                          padding: "0.75rem",
                          textAlign: "center",
                          background: "rgba(34, 197, 94, 0.15)",
                          borderRadius: "12px",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: "#4ade80",
                          border: "1px solid rgba(34, 197, 94, 0.3)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px"
                        }}
                      >
                         <CheckIcon style={{ width: "16px", height: "16px" }} /> Completed
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskBoard;
