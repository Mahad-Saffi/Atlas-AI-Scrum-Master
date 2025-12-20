import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

      // Auto-refresh every 15 seconds
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
        return "#10b981";
      default:
        return "#697565";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "high":
        return "H";
      case "medium":
        return "M";
      case "low":
        return "L";
      default:
        return "-";
    }
  };

  const filteredTasks =
    riskData?.at_risk_tasks?.filter((task) =>
      filterLevel === "all" ? true : task.risk_level === filterLevel
    ) || [];

  return (
    <div style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
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
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              onClick={() => navigate(`/project/${projectId}`)}
              className="btn-secondary"
              style={{ padding: "0.5rem 1rem" }}
            >
              Back
            </button>
            <div
              style={{
                width: "32px",
                height: "32px",
                background: "linear-gradient(135deg, #697565 0%, #3C3D37 100%)",
                borderRadius: "var(--radius-md)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.625rem",
                fontWeight: "bold",
                color: "#f5f5f5",
              }}
            >
              RISK
            </div>
            <h1
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "#ECDFCC",
              }}
            >
              Project Risks
            </h1>
          </div>
          <button
            onClick={fetchRisks}
            className="btn-primary"
            style={{ padding: "0.75rem 1.5rem" }}
          >
            Refresh
          </button>
        </div>
      </header>

      <main
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "2rem",
          position: "relative",
          zIndex: 1,
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
              className="spinner"
              style={{ width: "40px", height: "40px", borderWidth: "3px" }}
            />
          </div>
        ) : !riskData ? (
          <div
            className="card"
            style={{
              padding: "4rem 2rem",
              textAlign: "center",
              background: "rgba(236, 223, 204, 0.95)",
              border: "2px dashed #697565",
            }}
          >
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#181C14",
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
                gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
                gap: "0.75rem",
                marginBottom: "2rem",
              }}
            >
              <div
                className="card"
                style={{
                  padding: "0.75rem",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "700",
                    color: "#f5f5f5",
                    marginBottom: "0.25rem",
                  }}
                >
                  {riskData.total_tasks}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#a0a0a0",
                    fontWeight: "600",
                  }}
                >
                  Total Tasks
                </div>
              </div>

              <div
                className="card"
                style={{
                  padding: "0.75rem",
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "2px solid #ef4444",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "700",
                    color: "#ef4444",
                    marginBottom: "0.25rem",
                  }}
                >
                  {riskData.high_risk_count}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#f5f5f5",
                    fontWeight: "600",
                  }}
                >
                  High Risk
                </div>
              </div>

              <div
                className="card"
                style={{
                  padding: "0.75rem",
                  background: "rgba(245, 158, 11, 0.15)",
                  border: "2px solid #f59e0b",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "700",
                    color: "#f59e0b",
                    marginBottom: "0.25rem",
                  }}
                >
                  {riskData.medium_risk_count}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#f5f5f5",
                    fontWeight: "600",
                  }}
                >
                  Medium Risk
                </div>
              </div>

              <div
                className="card"
                style={{
                  padding: "0.75rem",
                  background: "rgba(16, 185, 129, 0.15)",
                  border: "2px solid #10b981",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "700",
                    color: "#10b981",
                    marginBottom: "0.25rem",
                  }}
                >
                  {riskData.low_risk_count}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#f5f5f5",
                    fontWeight: "600",
                  }}
                >
                  Low Risk
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div
              className="card"
              style={{
                padding: "1rem",
                marginBottom: "2rem",
                background: "rgba(236, 223, 204, 0.95)",
                border: "2px solid #697565",
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
                <span style={{ fontWeight: "600", color: "#181C14" }}>
                  Filter by Risk:
                </span>
                {["all", "high", "medium", "low"].map((level) => (
                  <button
                    key={level}
                    onClick={() => setFilterLevel(level)}
                    className={
                      filterLevel === level ? "btn-primary" : "btn-secondary"
                    }
                    style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}
                  >
                    {level.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* At-Risk Tasks List */}
            {filteredTasks.length === 0 ? (
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
                    background:
                      "linear-gradient(135deg, #697565 0%, #3C3D37 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    color: "#f5f5f5",
                    margin: "0 auto 1.5rem",
                  }}
                >
                  OK
                </div>
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "#f5f5f5",
                    marginBottom: "0.75rem",
                  }}
                >
                  No {filterLevel !== "all" ? filterLevel : ""} risk tasks
                </h3>
                <p style={{ fontSize: "1rem", color: "#a0a0a0" }}>
                  All tasks are on track!
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "1.25rem" }}>
                {filteredTasks.map((task) => (
                  <div
                    key={task.task_id}
                    className="card"
                    style={{
                      padding: "1.5rem",
                      background: "rgba(236, 223, 204, 0.9)",
                      border: `2px solid ${getRiskColor(task.risk_level)}`,
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
                          <span
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: "bold",
                              width: "24px",
                              height: "24px",
                              borderRadius: "50%",
                              background: getRiskColor(task.risk_level),
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {getRiskIcon(task.risk_level)}
                          </span>
                          <h3
                            style={{
                              fontSize: "1.125rem",
                              fontWeight: "700",
                              color: "#181C14",
                              flex: 1,
                            }}
                          >
                            {task.task_title}
                          </h3>
                          <span
                            style={{
                              padding: "0.25rem 0.75rem",
                              background: getRiskColor(task.risk_level),
                              color: "#ECDFCC",
                              borderRadius: "12px",
                              fontSize: "0.75rem",
                              fontWeight: "600",
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
                              color: "#181C14",
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
                                  padding: "0.25rem 0.75rem",
                                  background: "rgba(105, 117, 101, 0.2)",
                                  color: "#3C3D37",
                                  borderRadius: "8px",
                                  fontSize: "0.8125rem",
                                  border: "1px solid #697565",
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
                            color: "#697565",
                          }}
                        >
                          {task.assignee_username && (
                            <div>
                              <span
                                style={{ fontWeight: "600", color: "#3C3D37" }}
                              >
                                Assignee:
                              </span>{" "}
                              {task.assignee_username}
                            </div>
                          )}
                          {task.due_date && (
                            <div>
                              <span
                                style={{ fontWeight: "600", color: "#3C3D37" }}
                              >
                                Due Date:
                              </span>{" "}
                              {new Date(task.due_date).toLocaleDateString()}
                            </div>
                          )}
                          {task.progress_percentage !== undefined && (
                            <div>
                              <span
                                style={{ fontWeight: "600", color: "#3C3D37" }}
                              >
                                Progress:
                              </span>{" "}
                              {task.progress_percentage}%
                            </div>
                          )}
                          {task.estimated_delay_days !== undefined &&
                            task.estimated_delay_days > 0 && (
                              <div
                                style={{ color: "#ef4444", fontWeight: "600" }}
                              >
                                Estimated Delay: {task.estimated_delay_days}{" "}
                                days
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
                                background: "rgba(105, 117, 101, 0.2)",
                                borderRadius: "4px",
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  width: `${task.progress_percentage}%`,
                                  height: "100%",
                                  background: getRiskColor(task.risk_level),
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
    </div>
  );
};

export default ProjectRisks;
