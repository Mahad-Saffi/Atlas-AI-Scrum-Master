import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../components/NotificationBell";

interface LogEntry {
  message: string;
  level: string;
  timestamp: string;
}

const AIAssistant: React.FC = () => {
  const [task, setTask] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const navigate = useNavigate();
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const startAutomation = () => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    const ws = new WebSocket(
      `ws://localhost:8000/api/v1/ai-automation/ws/automation?token=${token}`
    );

    ws.onopen = () => {
      setIsRunning(true);
      setLogs([]);
      setScreenshot(null);
      ws.send(JSON.stringify({ task }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "update") {
        setLogs((prev) => [
          ...prev,
          {
            message: data.message,
            level: data.level,
            timestamp: new Date(data.timestamp).toLocaleTimeString(),
          },
        ]);
      } else if (data.type === "screenshot") {
        setScreenshot(data.data);
      } else if (data.type === "error") {
        setLogs((prev) => [
          ...prev,
          {
            message: `Error: ${data.message}`,
            level: "error",
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
        setIsRunning(false);
      }
    };

    ws.onclose = () => {
      setIsRunning(false);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsRunning(false);
      setLogs((prev) => [
        ...prev,
        {
          message: "Connection error. Please try again.",
          level: "error",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    };

    wsRef.current = ws;
  };

  const stopAutomation = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    setIsRunning(false);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "rgba(239, 68, 68, 0.2)";
      case "success":
        return "rgba(16, 185, 129, 0.2)";
      case "warning":
        return "rgba(245, 158, 11, 0.2)";
      case "action":
        return "rgba(59, 130, 246, 0.2)";
      default:
        return "rgba(236, 223, 204, 0.1)";
    }
  };

  const getLevelBorderColor = (level: string) => {
    switch (level) {
      case "error":
        return "#ef4444";
      case "success":
        return "#10b981";
      case "warning":
        return "#f59e0b";
      case "action":
        return "#3b82f6";
      default:
        return "rgba(236, 223, 204, 0.5)";
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case "error":
        return "[ERROR]";
      case "success":
        return "[OK]";
      case "warning":
        return "[WARN]";
      case "action":
        return "[ACTION]";
      case "info":
        return "[INFO]";
      default:
        return "";
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Header */}
      <header
        className="glass-header"
        style={{
          padding: "0.75rem 2rem",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            maxWidth: "1800px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              onClick={() => navigate("/")}
              className="btn-secondary"
              style={{ padding: "0.5rem 1rem", fontSize: "1.25rem" }}
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
                fontSize: "0.875rem",
                fontWeight: "bold",
                color: "#ECDFCC",
              }}
            >
              AI
            </div>
            <h1
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "#ECDFCC",
              }}
            >
              AI Assistant
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {isRunning && (
              <button
                onClick={stopAutomation}
                className="btn-secondary"
                style={{
                  background: "rgba(239, 68, 68, 0.2)",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                  color: "#ECDFCC",
                }}
              >
                Stop
              </button>
            )}
            <NotificationBell />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          overflow: "hidden",
          padding: "1rem 2rem",
        }}
      >
        <div
          style={{
            maxWidth: "1800px",
            margin: "0 auto",
            height: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr",
            gap: "1.5rem",
          }}
        >
          {/* Left Panel - Task Input and Logs */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              height: "100%",
              overflow: "hidden",
            }}
          >
            {/* Task Input */}
            <div
              className="card-glass-solid"
              style={{ flexShrink: 0 }}
            >
              <h2
                style={{
                  fontSize: "1rem",
                  fontWeight: "700",
                  color: "#ECDFCC",
                  marginBottom: "0.75rem",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                Task Input
              </h2>
              <textarea
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder={`Enter your task...

Examples:
- Create a new project named 'Q4 Report'
- Start the task 'Design UI mockups'
- Add a team member with email john@example.com`}
                rows={5}
                disabled={isRunning}
                style={{
                  width: "100%",
                  marginBottom: "0.75rem",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid rgba(236, 223, 204, 0.3)",
                  backgroundColor: "#1a1a1a",
                  color: "#f5f5f5",
                  fontFamily: "inherit",
                  fontSize: "0.875rem",
                  boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.4)",
                  resize: "none",
                }}
              />

              <button
                onClick={startAutomation}
                disabled={isRunning || !task.trim()}
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  fontSize: "0.9375rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                {isRunning ? (
                  <>
                    <div
                      className="spinner"
                      style={{
                        width: "18px",
                        height: "18px",
                        borderWidth: "2px",
                      }}
                    />
                    <span>AI is working...</span>
                  </>
                ) : (
                  <span>Start Automation</span>
                )}
              </button>
            </div>

            {/* Action Log */}
            <div
              className="card-glass-solid"
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                minHeight: 0,
              }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: "700",
                  color: "#ECDFCC",
                  marginBottom: "0.75rem",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  flexShrink: 0,
                }}
              >
                Action Log
              </h3>
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  background: "#1a1a1a",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid rgba(236, 223, 204, 0.2)",
                  minHeight: 0,
                }}
              >
                {logs.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "2rem 1rem",
                      color: "#a0a0a0",
                      fontSize: "0.875rem",
                    }}
                  >
                    Logs will appear here when automation starts
                  </div>
                ) : (
                  logs.map((log, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "0.5rem 0.75rem",
                        marginBottom: "0.375rem",
                        background: getLevelColor(log.level),
                        borderRadius: "4px",
                        fontSize: "0.8125rem",
                        color: "#f5f5f5",
                        borderLeft: `3px solid ${getLevelBorderColor(log.level)}`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          fontSize: "0.75rem",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "600",
                            color: getLevelBorderColor(log.level),
                          }}
                        >
                          {getLevelLabel(log.level)}
                        </span>
                        <span style={{ color: "#a0a0a0" }}>{log.timestamp}</span>
                      </div>
                      <div style={{ marginTop: "0.25rem" }}>{log.message}</div>
                    </div>
                  ))
                )}
                <div ref={logsEndRef} />
              </div>
            </div>
          </div>

          {/* Right Panel - Live Browser View */}
          <div
            className="card-glass-solid"
            style={{
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              maxHeight: "80vh",
            }}
          >
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: "700",
                color: "#ECDFCC",
                marginBottom: "0.75rem",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                flexShrink: 0,
              }}
            >
              Live Browser View
            </h2>
            <div
              style={{
                flex: 1,
                overflow: "hidden",
                borderRadius: "8px",
                minHeight: 0,
              }}
            >
              {screenshot ? (
                <div style={{ position: "relative", height: "100%" }}>
                  <img
                    src={`data:image/png;base64,${screenshot}`}
                    alt="Browser view"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      border: "2px solid rgba(236, 223, 204, 0.3)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    }}
                  />
                  {isRunning && (
                    <div
                      style={{
                        position: "absolute",
                        top: "0.75rem",
                        right: "0.75rem",
                        padding: "0.375rem 0.75rem",
                        background: "#10b981",
                        color: "#ffffff",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.375rem",
                      }}
                    >
                      <div
                        className="spinner"
                        style={{
                          width: "12px",
                          height: "12px",
                          borderWidth: "2px",
                        }}
                      />
                      <span>LIVE</span>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#1a1a1a",
                    borderRadius: "8px",
                    border: "2px dashed rgba(236, 223, 204, 0.3)",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      background: "rgba(236, 223, 204, 0.1)",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1rem",
                      border: "1px solid rgba(236, 223, 204, 0.3)",
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#f5f5f5"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </div>
                  <p
                    style={{
                      color: "#e0e0e0",
                      fontSize: "0.875rem",
                    }}
                  >
                    Browser view will appear here when automation starts
                  </p>
                  <p
                    style={{
                      color: "#808080",
                      fontSize: "0.75rem",
                      marginTop: "0.5rem",
                      textAlign: "center",
                      maxWidth: "300px",
                    }}
                  >
                    Real-time screenshots of the AI navigating the application
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIAssistant;
