import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ChartBarIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";

interface Risk {
  task_id: string;
  task_title: string;
  risk_level: string;
  risk_factors: string[];
  estimated_delay_days?: number;
  assignee_username?: string;
  due_date?: string;
  progress_percentage?: number;
  status?: string;
}

interface RiskSummary {
  total_tasks: number;
  high_risk_count: number;
  medium_risk_count: number;
  low_risk_count: number;
  at_risk_tasks: Risk[];
}

const ProjectRisks: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [riskData, setRiskData] = useState<RiskSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState<string>("all");

  useEffect(() => {
    if (projectId) {
      fetchRisks();

      const interval = setInterval(() => {
        fetchRisks();
      }, 15000);

      return () => clearInterval(interval);
    }
  }, [projectId]);

  const fetchRisks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("jwt");
      const response = await fetch(
        `http://localhost:8000/api/v1/projects/${projectId}/risks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRiskData(data);
      }
    } catch (error) {
      console.error("Error fetching risks:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#22c55e";
      default:
        return "#64748b";
    }
  };

  const filteredTasks =
    riskData?.at_risk_tasks?.filter((task) =>
      filterLevel === "all" ? true : task.risk_level === filterLevel
    ) || [];

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
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <button
              onClick={() => navigate(`/project/${projectId}`)}
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
              ← Back to Project
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ExclamationTriangleIcon
                  style={{ width: "24px", height: "24px", color: "white" }}
                />
              </div>
              <h1
                style={{
                  fontSize: "1.75rem",
                  fontWeight: "700",
                  color: "#f1f5f9",
                  letterSpacing: "-0.01em",
                }}
              >
                Project Risks
              </h1>
            </div>
          </div>
          <button
            onClick={fetchRisks}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
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
            <ArrowPathIcon style={{ width: "18px", height: "18px" }} />
            Refresh
          </button>
        </div>
      </header>

      <main
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "3rem 2rem",
        }}
      >
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
              style={{
                width: "48px",
                height: "48px",
                border: "3px solid #1a1a24",
                borderTop: "3px solid #dc2626",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
          </div>
        ) : !riskData ? (
          <div
            style={{
              background: "rgba(17, 17, 24, 0.7)",
              backdropFilter: "blur(16px)",
              border: "2px dashed rgba(255, 255, 255, 0.12)",
              borderRadius: "24px",
              padding: "5rem 2rem",
              textAlign: "center",
            }}
          >
            <h3
              style={{
                fontSize: "1.625rem",
                fontWeight: "700",
                color: "#f1f5f9",
              }}
            >
              No risk data available
            </h3>
          </div>
        ) : (
          <>
            {/* Risk Summary Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1.5rem",
                marginBottom: "3rem",
              }}
            >
              <div
                style={{
                  background: "rgba(17, 17, 24, 0.7)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "20px",
                  padding: "2rem",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "14px",
                      background: "rgba(100, 116, 139, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ChartBarIcon
                      style={{
                        width: "28px",
                        height: "28px",
                        color: "#64748b",
                      }}
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "2.25rem",
                        fontWeight: "700",
                        color: "#f1f5f9",
                        lineHeight: 1,
                      }}
                    >
                      {riskData.total_tasks}
                    </div>
                    <div
                      style={{
                        fontSize: "0.9375rem",
                        color: "#94a3b8",
                        marginTop: "0.25rem",
                      }}
                    >
                      Total Tasks
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: "rgba(239, 68, 68, 0.12)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "20px",
                  padding: "2rem",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "14px",
                      background: "rgba(239, 68, 68, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ExclamationTriangleIcon
                      style={{
                        width: "28px",
                        height: "28px",
                        color: "#ef4444",
                      }}
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "2.25rem",
                        fontWeight: "700",
                        color: "#f1f5f9",
                        lineHeight: 1,
                      }}
                    >
                      {riskData.high_risk_count}
                    </div>
                    <div
                      style={{
                        fontSize: "0.9375rem",
                        color: "#ef4444",
                        marginTop: "0.25rem",
                        fontWeight: 600,
                      }}
                    >
                      High Risk
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: "rgba(245, 158, 11, 0.12)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                  borderRadius: "20px",
                  padding: "2rem",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "14px",
                      background: "rgba(245, 158, 11, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ExclamationTriangleIcon
                      style={{
                        width: "28px",
                        height: "28px",
                        color: "#f59e0b",
                      }}
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "2.25rem",
                        fontWeight: "700",
                        color: "#f1f5f9",
                        lineHeight: 1,
                      }}
                    >
                      {riskData.medium_risk_count}
                    </div>
                    <div
                      style={{
                        fontSize: "0.9375rem",
                        color: "#f59e0b",
                        marginTop: "0.25rem",
                        fontWeight: 600,
                      }}
                    >
                      Medium Risk
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: "rgba(34, 197, 94, 0.12)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                  borderRadius: "20px",
                  padding: "2rem",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "14px",
                      background: "rgba(34, 197, 94, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ChartBarIcon
                      style={{
                        width: "28px",
                        height: "28px",
                        color: "#22c55e",
                      }}
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "2.25rem",
                        fontWeight: "700",
                        color: "#f1f5f9",
                        lineHeight: 1,
                      }}
                    >
                      {riskData.low_risk_count}
                    </div>
                    <div
                      style={{
                        fontSize: "0.9375rem",
                        color: "#22c55e",
                        marginTop: "0.25rem",
                        fontWeight: 600,
                      }}
                    >
                      Low Risk
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div
              style={{
                background: "rgba(17, 17, 24, 0.7)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "16px",
                padding: "1.5rem",
                marginBottom: "2rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontWeight: "600", color: "#f1f5f9" }}>
                  Filter by Risk:
                </span>
                {["all", "high", "medium", "low"].map((level) => (
                  <button
                    key={level}
                    onClick={() => setFilterLevel(level)}
                    style={{
                      padding: "0.625rem 1.25rem",
                      background:
                        filterLevel === level
                          ? "linear-gradient(135deg, #dc2626, #991b1b)"
                          : "rgba(255, 255, 255, 0.05)",
                      border:
                        filterLevel === level
                          ? "none"
                          : "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "12px",
                      color: filterLevel === level ? "white" : "#f1f5f9",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {level === "all" ? "All" : level.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* At-Risk Tasks List */}
            {filteredTasks.length === 0 ? (
              <div
                style={{
                  background: "rgba(17, 17, 24, 0.7)",
                  backdropFilter: "blur(16px)",
                  border: "2px dashed rgba(255, 255, 255, 0.12)",
                  borderRadius: "24px",
                  padding: "5rem 2rem",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "88px",
                    height: "88px",
                    borderRadius: "22px",
                    background: "linear-gradient(135deg, #22c55e, #15803d)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.75rem",
                    boxShadow: "0 12px 36px rgba(34, 197, 94, 0.35)",
                  }}
                >
                  <ChartBarIcon
                    style={{ width: "48px", height: "48px", color: "white" }}
                  />
                </div>
                <h3
                  style={{
                    fontSize: "1.625rem",
                    fontWeight: "700",
                    color: "#f1f5f9",
                    marginBottom: "0.75rem",
                  }}
                >
                  No {filterLevel !== "all" ? filterLevel : ""} risk tasks
                </h3>
                <p style={{ fontSize: "1.0625rem", color: "#94a3b8" }}>
                  All tasks are on track!
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "1.5rem" }}>
                {filteredTasks.map((task) => (
                  <div
                    key={task.task_id}
                    style={{
                      background: "rgba(17, 17, 24, 0.7)",
                      backdropFilter: "blur(16px)",
                      border: `1px solid ${getRiskColor(task.risk_level)}40`,
                      borderRadius: "20px",
                      padding: "2rem",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "1rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: "300px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            marginBottom: "0.75rem",
                          }}
                        >
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "12px",
                              background: `${getRiskColor(task.risk_level)}20`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <ExclamationTriangleIcon
                              style={{
                                width: "24px",
                                height: "24px",
                                color: getRiskColor(task.risk_level),
                              }}
                            />
                          </div>
                          <h3
                            style={{
                              fontSize: "1.25rem",
                              fontWeight: "700",
                              color: "#f1f5f9",
                              flex: 1,
                            }}
                          >
                            {task.task_title}
                          </h3>
                          <span
                            style={{
                              padding: "0.375rem 0.875rem",
                              background: `${getRiskColor(task.risk_level)}20`,
                              color: getRiskColor(task.risk_level),
                              borderRadius: "12px",
                              fontSize: "0.75rem",
                              fontWeight: "600",
                              border: `1px solid ${getRiskColor(
                                task.risk_level
                              )}40`,
                            }}
                          >
                            {task.risk_level.toUpperCase()} RISK
                          </span>
                        </div>

                        {/* Risk Factors */}
                        <div style={{ marginBottom: "1rem" }}>
                          <div
                            style={{
                              fontSize: "0.875rem",
                              fontWeight: "600",
                              color: "#f1f5f9",
                              marginBottom: "0.5rem",
                            }}
                          >
                            Risk Factors:
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "0.5rem",
                            }}
                          >
                            {task.risk_factors.map((factor, index) => (
                              <span
                                key={index}
                                style={{
                                  padding: "0.375rem 0.875rem",
                                  background: "rgba(100, 116, 139, 0.15)",
                                  color: "#94a3b8",
                                  borderRadius: "8px",
                                  fontSize: "0.8125rem",
                                  border: "1px solid rgba(100, 116, 139, 0.3)",
                                }}
                              >
                                {factor}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Task Details */}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(150px, 1fr))",
                            gap: "1rem",
                            fontSize: "0.875rem",
                            color: "#94a3b8",
                          }}
                        >
                          {task.assignee_username && (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              <UserIcon
                                style={{ width: "16px", height: "16px" }}
                              />
                              <span
                                style={{ fontWeight: "600", color: "#f1f5f9" }}
                              >
                                Assignee:
                              </span>{" "}
                              {task.assignee_username}
                            </div>
                          )}
                          {task.due_date && (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              <CalendarIcon
                                style={{ width: "16px", height: "16px" }}
                              />
                              <span
                                style={{ fontWeight: "600", color: "#f1f5f9" }}
                              >
                                Due:
                              </span>{" "}
                              {new Date(task.due_date).toLocaleDateString()}
                            </div>
                          )}
                          {task.progress_percentage !== undefined && (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              <ChartBarIcon
                                style={{ width: "16px", height: "16px" }}
                              />
                              <span
                                style={{ fontWeight: "600", color: "#f1f5f9" }}
                              >
                                Progress:
                              </span>{" "}
                              {task.progress_percentage}%
                            </div>
                          )}
                          {task.estimated_delay_days !== undefined &&
                            task.estimated_delay_days > 0 && (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.5rem",
                                  color: "#ef4444",
                                  fontWeight: "600",
                                }}
                              >
                                <ClockIcon
                                  style={{ width: "16px", height: "16px" }}
                                />
                                Delay: {task.estimated_delay_days} days
                              </div>
                            )}
                        </div>

                        {/* Progress Bar */}
                        {task.progress_percentage !== undefined && (
                          <div style={{ marginTop: "1rem" }}>
                            <div
                              style={{
                                width: "100%",
                                height: "8px",
                                background: "rgba(26, 26, 36, 0.9)",
                                borderRadius: "20px",
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  width: `${task.progress_percentage}%`,
                                  height: "100%",
                                  background: `linear-gradient(90deg, ${getRiskColor(
                                    task.risk_level
                                  )}, ${getRiskColor(task.risk_level)}dd)`,
                                  transition: "width 0.3s ease",
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
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

export default ProjectRisks;
