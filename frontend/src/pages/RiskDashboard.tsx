import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  CalendarIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

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
                  background: "linear-gradient(135deg, #ef4444, #dc2626)",
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
                Risk Dashboard
              </h1>
            </div>
          </div>

          <button
            onClick={detectDelays}
            disabled={detecting}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.5rem",
              background: detecting
                ? "rgba(220, 38, 38, 0.5)"
                : "linear-gradient(135deg, #dc2626, #991b1b)",
              border: "none",
              borderRadius: "12px",
              color: "white",
              fontSize: "0.9375rem",
              fontWeight: 600,
              cursor: detecting ? "not-allowed" : "pointer",
              boxShadow: "0 4px 16px rgba(220, 38, 38, 0.4)",
            }}
          >
            {detecting ? (
              <>
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid white",
                    borderTop: "2px solid transparent",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                <span>Detecting...</span>
              </>
            ) : (
              <>
                <MagnifyingGlassIcon
                  style={{ width: "18px", height: "18px" }}
                />
                <span>Detect Delays</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "3rem 2rem",
        }}
      >
        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
            marginBottom: "3rem",
          }}
        >
          <div
            style={{
              background: "rgba(239, 68, 68, 0.12)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "20px",
              padding: "2rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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
                  style={{ width: "28px", height: "28px", color: "#ef4444" }}
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
                  {riskSummary?.high_risk_count || 0}
                </div>
                <div
                  style={{
                    fontSize: "0.9375rem",
                    color: "#ef4444",
                    marginTop: "0.25rem",
                    fontWeight: 600,
                  }}
                >
                  High Severity
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
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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
                  style={{ width: "28px", height: "28px", color: "#f59e0b" }}
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
                  {riskSummary?.medium_risk_count || 0}
                </div>
                <div
                  style={{
                    fontSize: "0.9375rem",
                    color: "#f59e0b",
                    marginTop: "0.25rem",
                    fontWeight: 600,
                  }}
                >
                  Medium Severity
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
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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
                  style={{ width: "28px", height: "28px", color: "#22c55e" }}
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
                  {riskSummary?.low_risk_count || 0}
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
        ) : !riskSummary || riskSummary.high_risk_tasks.length === 0 ? (
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
              <CheckCircleIcon
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
              No High Risk Tasks
            </h3>
            <p style={{ fontSize: "1.0625rem", color: "#94a3b8" }}>
              Your project is on track!
            </p>
          </div>
        ) : (
          <div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#f1f5f9",
                marginBottom: "1.5rem",
              }}
            >
              High Risk Tasks
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              {riskSummary.high_risk_tasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    background: "rgba(239, 68, 68, 0.12)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    borderRadius: "20px",
                    padding: "2rem",
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
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        background: "rgba(239, 68, 68, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <ExclamationTriangleIcon
                        style={{
                          width: "24px",
                          height: "24px",
                          color: "#ef4444",
                        }}
                      />
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
                            color: "#ef4444",
                            textTransform: "uppercase",
                            padding: "0.375rem 0.875rem",
                            background: "rgba(239, 68, 68, 0.2)",
                            borderRadius: "8px",
                            border: "1px solid rgba(239, 68, 68, 0.4)",
                          }}
                        >
                          HIGH RISK
                        </span>
                      </div>
                      <h3
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: "700",
                          color: "#f1f5f9",
                          marginBottom: "0.75rem",
                        }}
                      >
                        {task.title}
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          gap: "1.5rem",
                          fontSize: "0.875rem",
                          color: "#94a3b8",
                        }}
                      >
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
                            Due: {new Date(task.due_date).toLocaleDateString()}
                          </div>
                        )}
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
                          Progress: {task.progress}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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

export default RiskDashboard;
