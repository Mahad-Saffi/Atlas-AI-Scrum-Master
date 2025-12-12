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
    // Auto-scroll logs
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

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error":
        return "❌";
      case "success":
        return "✅";
      case "warning":
        return "⚠️";
      case "action":
        return "⚡";
      case "info":
        return "ℹ️";
      default:
        return "•";
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
              ←
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
                fontSize: "1.25rem",
              }}
            >
              🤖
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
                ⏹ Stop
              </button>
            )}
            <NotificationBell />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          maxWidth: "1800px",
          margin: "0 auto",
          padding: "2rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }}
        >
          {/* Control Panel */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {/* Task Input */}
            <div className="card-glass-solid">
              <h2
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "700",
                  color: "#ECDFCC",
                  marginBottom: "1rem",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                📝 Task Input
              </h2>
              <textarea
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder={`Enter your task...

Examples:
• Create a new project named 'Q4 Report'
• Start the task 'Design UI mockups'
• Add a team member with email john@example.com`}
                rows={8}
                disabled={isRunning}
                style={{
                  width: "100%",
                  marginBottom: "1rem",
                  padding: "1rem",
                  borderRadius: "15px",
                  border: "none",
                  backgroundColor: "#697565",
                  color: "#ECDFCC",
                  fontFamily: "inherit",
                  fontSize: "0.9375rem",
                  boxShadow: "inset 2px 5px 10px rgba(0, 0, 0, 0.3)",
                  resize: "vertical",
                }}
              />

              <button
                onClick={startAutomation}
                disabled={isRunning || !task.trim()}
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "0.875rem",
                  fontSize: "1rem",
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
                        width: "20px",
                        height: "20px",
                        borderWidth: "2px",
                      }}
                    />
                    <span>AI is working...</span>
                  </>
                ) : (
                  <>
                    <span>▶</span>
                    <span>Start Automation</span>
                  </>
                )}
              </button>
            </div>

            {/* Action Log */}
            <div className="card-glass-solid" style={{ flex: 1 }}>
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "700",
                  color: "#ECDFCC",
                  marginBottom: "1rem",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                📋 Action Log
              </h3>
              <div
                style={{
                  maxHeight: "500px",
                  overflowY: "auto",
                  background: "rgba(0,0,0,0.3)",
                  padding: "1rem",
                  borderRadius: "8px",
                  border: "1px solid rgba(236, 223, 204, 0.2)",
                }}
              >
                {logs.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "#ECDFCC",
                      opacity: 0.6,
                    }}
                  >
                    Logs will appear here when automation starts
                  </div>
                ) : (
                  logs.map((log, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "0.75rem",
                        marginBottom: "0.5rem",
                        background: getLevelColor(log.level),
                        borderRadius: "6px",
                        fontSize: "0.875rem",
                        color: "#ECDFCC",
                        borderLeft: `3px solid ${getLevelBorderColor(
                          log.level
                        )}`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <span>{getLevelIcon(log.level)}</span>
                        <span
                          style={{ opacity: 0.7, fontSize: "0.75rem" }}
                        >
                          {log.timestamp}
                        </span>
                      </div>
                      <div
                        style={{ marginTop: "0.25rem", paddingLeft: "1.5rem" }}
                      >
                        {log.message}
                      </div>
                    </div>
                  ))
                )}
                <div ref={logsEndRef} />
              </div>
            </div>
          </div>

          {/* Live Browser View */}
          <div className="card-glass-solid">
            <h2
              style={{
                fontSize: "1.125rem",
                fontWeight: "700",
                color: "#ECDFCC",
                marginBottom: "1rem",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              🖥️ Live Browser View
            </h2>
            {screenshot ? (
              <div style={{ position: "relative" }}>
                <img
                  src={`data:image/png;base64,${screenshot}`}
                  alt="Browser view"
                  style={{
                    width: "100%",
                    border: "2px solid rgba(236, 223, 204, 0.3)",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  }}
                />
                {isRunning && (
                  <div
                    style={{
                      position: "absolute",
                      top: "1rem",
                      right: "1rem",
                      padding: "0.5rem 1rem",
                      background: "rgba(16, 185, 129, 0.9)",
                      color: "#ECDFCC",
                      borderRadius: "8px",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <div
                      className="spinner"
                      style={{
                        width: "16px",
                        height: "16px",
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
                  height: "700px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: "8px",
                  border: "2px dashed rgba(236, 223, 204, 0.3)",
                }}
              >
                <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>
                  🖥️
                </div>
                <p
                  style={{
                    color: "#ECDFCC",
                    fontSize: "1rem",
                    opacity: 0.8,
                  }}
                >
                  Browser view will appear here when automation starts
                </p>
                <p
                  style={{
                    color: "#ECDFCC",
                    fontSize: "0.875rem",
                    opacity: 0.6,
                    marginTop: "0.5rem",
                    textAlign: "center",
                    maxWidth: "400px",
                  }}
                >
                  You'll see real-time screenshots of the AI navigating the
                  application
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIAssistant;
