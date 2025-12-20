import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface RiskTask {
  id: string;
  title: string;
  due_date: string | null;
  progress: number;
}

interface RiskSummary {
  total_active_tasks: number;
  high_risk_count: number;
  medium_risk_count: number;
  low_risk_count: number;
  high_risk_tasks: RiskTask[];
}

const RiskDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [riskSummary, setRiskSummary] = useState<RiskSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [detecting, setDetecting] = useState(false);

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
        setRiskSummary(data);
      }
    } catch (error) {
      console.error("Error fetching risks:", error);
    } finally {
      setLoading(false);
    }
  };

  const detectDelays = async () => {
    setDetecting(true);
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(
        "http://localhost:8000/api/v1/projects/detect-delays",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchRisks();
      }
    } catch (error) {
      console.error("Error detecting delays:", error);
    } finally {
      setDetecting(false);
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
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                borderRadius: "var(--radius-md)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.625rem",
                fontWeight: "bold",
                color: "#fff",
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
              Risk Dashboard
            </h1>
          </div>

          <button
            onClick={detectDelays}
            className="btn-primary"
            disabled={detecting}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            {detecting ? (
              <>
                <span className="spinner"></span>
                <span>Detecting...</span>
              </>
            ) : (
              <span>Detect Delays</span>
            )}
          </button>
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
        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div
            className="card"
            style={{
              padding: "1.25rem 1.5rem",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#ef4444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                }}
              >
                H
              </div>
              <div>
                <div
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: "700",
                    color: "#ef4444",
                    lineHeight: "1",
                    marginBottom: "0.375rem",
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  {riskSummary?.high_risk_count || 0}
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "#f5f5f5",
                    fontWeight: "500",
                  }}
                >
                  High Severity
                </div>
              </div>
            </div>
          </div>

          <div
            className="card"
            style={{
              padding: "1.25rem 1.5rem",
              background: "rgba(245, 158, 11, 0.15)",
              border: "1px solid rgba(245, 158, 11, 0.4)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#f59e0b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                }}
              >
                M
              </div>
              <div>
                <div
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: "700",
                    color: "#f59e0b",
                    lineHeight: "1",
                    marginBottom: "0.375rem",
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  {riskSummary?.medium_risk_count || 0}
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "#f5f5f5",
                    fontWeight: "500",
                  }}
                >
                  Medium Severity
                </div>
              </div>
            </div>
          </div>

          <div
            className="card"
            style={{
              padding: "1.25rem 1.5rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#10b981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                }}
              >
                L
              </div>
              <div>
                <div
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: "700",
                    color: "#10b981",
                    lineHeight: "1",
                    marginBottom: "0.375rem",
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  {riskSummary?.low_risk_count || 0}
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "#f5f5f5",
                    fontWeight: "500",
                  }}
                >
                  Low Risk
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Risks List */}
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "4rem",
            }}
          >
            <div
              className="spinner"
              style={{ width: "40px", height: "40px" }}
            />
          </div>
        ) : !riskSummary || riskSummary.high_risk_tasks.length === 0 ? (
          <div
            className="card-glass-solid"
            style={{
              padding: "4rem 2rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                background: "rgba(16, 185, 129, 0.2)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
                border: "1px solid rgba(16, 185, 129, 0.4)",
              }}
            >
              <span style={{ fontSize: "1.5rem", color: "#10b981", fontWeight: "bold" }}>OK</span>
            </div>
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#f5f5f5",
                marginBottom: "0.5rem",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              No High Risk Tasks
            </h3>
            <p style={{ fontSize: "1rem", color: "#a0a0a0" }}>
              Your project is on track!
            </p>
          </div>
        ) : (
          <div>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: "700",
                color: "#ECDFCC",
                marginBottom: "1rem",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              High Risk Tasks
            </h2>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {riskSummary.high_risk_tasks.map((task) => (
                <div
                  key={task.id}
                  className="card"
                  style={{
                    padding: "1.5rem",
                    background: "rgba(239, 68, 68, 0.15)",
                    backdropFilter: "blur(15px)",
                    border: "1px solid rgba(239, 68, 68, 0.4)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: "#ef4444",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "0.875rem",
                      }}
                    >
                      H
                    </div>
                    <div style={{ flex: 1 }}>
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
                            fontWeight: "700",
                            color: "#dc2626",
                            textTransform: "uppercase",
                            padding: "0.25rem 0.75rem",
                            background: "rgba(255, 255, 255, 0.5)",
                            borderRadius: "var(--radius-sm)",
                          }}
                        >
                          HIGH RISK
                        </span>
                      </div>
                      <h3
                        style={{
                          fontSize: "1.125rem",
                          fontWeight: "700",
                          color: "#ECDFCC",
                          marginBottom: "0.75rem",
                          textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                        }}
                      >
                        {task.title}
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          gap: "1.5rem",
                          fontSize: "0.875rem",
                          color: "#ECDFCC",
                        }}
                      >
                        {task.due_date && (
                          <div>
                            Due:{" "}
                            {new Date(task.due_date).toLocaleDateString()}
                          </div>
                        )}
                        <div>Progress: {task.progress}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RiskDashboard;
