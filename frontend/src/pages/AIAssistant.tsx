import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../components/NotificationBell";
import theme from "../styles/theme";

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
        return `${theme.colors.status.error}33`;
      case "success":
        return `${theme.colors.status.success}33`;
      case "warning":
        return `${theme.colors.status.warning}33`;
      case "action":
        return `${theme.colors.brand.red}33`;
      default:
        return `${theme.colors.background.card}1a`;
    }
  };

  const getLevelBorderColor = (level: string) => {
    switch (level) {
      case "error":
        return theme.colors.status.error;
      case "success":
        return theme.colors.status.success;
      case "warning":
        return theme.colors.status.warning;
      case "action":
        return theme.colors.brand.red;
      default:
        return theme.colors.border.default;
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
          padding: `${theme.spacing.md} ${theme.spacing["2xl"]}`,
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
                fontSize: theme.typography.fontSize.xl,
              }}
            >
              Back
            </button>
            <div
              style={{
                width: "32px",
                height: "32px",
                background: `linear-gradient(135deg, ${theme.colors.brand.red} 0%, ${theme.colors.brand.redDark} 100%)`,
                borderRadius: theme.borderRadius.md,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
              }}
            >
              AI
            </div>
            <h1
              style={{
                fontSize: theme.typography.fontSize.xl,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.primary,
              }}
            >
              AI Assistant
            </h1>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.lg,
            }}
          >
            {isRunning && (
              <button
                onClick={stopAutomation}
                className="btn-secondary"
                style={{
                  background: `${theme.colors.status.error}33`,
                  border: `1px solid ${theme.colors.status.error}66`,
                  color: theme.colors.text.primary,
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
          padding: `${theme.spacing.lg} ${theme.spacing["2xl"]}`,
        }}
      >
        <div
          style={{
            maxWidth: "1800px",
            margin: "0 auto",
            height: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr",
            gap: theme.spacing.xl,
          }}
        >
          {/* Left Panel - Task Input and Logs */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: theme.spacing.lg,
              height: "100%",
              overflow: "hidden",
            }}
          >
            {/* Task Input */}
            <div className="card-glass-solid" style={{ flexShrink: 0 }}>
              <h2
                style={{
                  fontSize: theme.typography.fontSize.base,
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text.primary,
                  marginBottom: theme.spacing.md,
                  textShadow: theme.effects.textShadow.sm,
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
                  marginBottom: theme.spacing.md,
                  padding: theme.spacing.md,
                  borderRadius: theme.borderRadius.lg,
                  border: `1px solid ${theme.colors.border.light}`,
                  backgroundColor: theme.colors.background.tertiary,
                  color: theme.colors.text.primary,
                  fontFamily: theme.typography.fontFamily.primary,
                  fontSize: theme.typography.fontSize.sm,
                  boxShadow: theme.shadows.sm,
                  resize: "none",
                }}
              />

              <button
                onClick={startAutomation}
                disabled={isRunning || !task.trim()}
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: theme.spacing.md,
                  fontSize: theme.typography.fontSize.base,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: theme.spacing.sm,
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
                  fontSize: theme.typography.fontSize.base,
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text.primary,
                  marginBottom: theme.spacing.md,
                  textShadow: theme.effects.textShadow.sm,
                  flexShrink: 0,
                }}
              >
                Action Log
              </h3>
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  background: theme.colors.background.tertiary,
                  padding: theme.spacing.md,
                  borderRadius: theme.borderRadius.lg,
                  border: `1px solid ${theme.colors.border.light}`,
                  minHeight: 0,
                }}
              >
                {logs.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: `${theme.spacing["2xl"]} ${theme.spacing.lg}`,
                      color: theme.colors.text.muted,
                      fontSize: theme.typography.fontSize.sm,
                    }}
                  >
                    Logs will appear here when automation starts
                  </div>
                ) : (
                  logs.map((log, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                        marginBottom: theme.spacing.xs,
                        background: getLevelColor(log.level),
                        borderRadius: theme.borderRadius.sm,
                        fontSize: theme.typography.fontSize.sm,
                        color: theme.colors.text.primary,
                        borderLeft: `3px solid ${getLevelBorderColor(
                          log.level
                        )}`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: theme.spacing.sm,
                          fontSize: theme.typography.fontSize.xs,
                        }}
                      >
                        <span
                          style={{
                            fontWeight: theme.typography.fontWeight.semibold,
                            color: getLevelBorderColor(log.level),
                          }}
                        >
                          {getLevelLabel(log.level)}
                        </span>
                        <span style={{ color: theme.colors.text.muted }}>
                          {log.timestamp}
                        </span>
                      </div>
                      <div style={{ marginTop: theme.spacing.xs }}>
                        {log.message}
                      </div>
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
                fontSize: theme.typography.fontSize.base,
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing.md,
                textShadow: theme.effects.textShadow.sm,
                flexShrink: 0,
              }}
            >
              Live Browser View
            </h2>
            <div
              style={{
                flex: 1,
                overflow: "hidden",
                borderRadius: theme.borderRadius.lg,
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
                      border: `2px solid ${theme.colors.border.light}`,
                      borderRadius: theme.borderRadius.lg,
                      boxShadow: theme.shadows.lg,
                    }}
                  />
                  {isRunning && (
                    <div
                      style={{
                        position: "absolute",
                        top: theme.spacing.md,
                        right: theme.spacing.md,
                        padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                        background: theme.colors.status.success,
                        color: "#ffffff",
                        borderRadius: theme.borderRadius.md,
                        fontSize: theme.typography.fontSize.xs,
                        fontWeight: theme.typography.fontWeight.semibold,
                        display: "flex",
                        alignItems: "center",
                        gap: theme.spacing.xs,
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
                    background: theme.colors.background.tertiary,
                    borderRadius: theme.borderRadius.lg,
                    border: `2px dashed ${theme.colors.border.light}`,
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      background: `${theme.colors.background.card}1a`,
                      borderRadius: theme.borderRadius.lg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: theme.spacing.lg,
                      border: `1px solid ${theme.colors.border.light}`,
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={theme.colors.text.primary}
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
                      color: theme.colors.text.secondary,
                      fontSize: theme.typography.fontSize.sm,
                    }}
                  >
                    Browser view will appear here when automation starts
                  </p>
                  <p
                    style={{
                      color: theme.colors.text.muted,
                      fontSize: theme.typography.fontSize.xs,
                      marginTop: theme.spacing.sm,
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
