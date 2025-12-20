import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
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

          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              background: "rgba(17, 17, 24, 0.95)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "20px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
              maxWidth: "600px",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Error Icon */}
            <div
              style={{
                width: "80px",
                height: "80px",
                margin: "0 auto 1.5rem",
                borderRadius: "50%",
                background: "rgba(220, 38, 38, 0.15)",
                border: "2px solid rgba(220, 38, 38, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "3rem",
              }}
            >
              ⚠️
            </div>

            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: "700",
                color: "#f1f5f9",
                marginBottom: "1rem",
                letterSpacing: "-0.01em",
              }}
            >
              Oops! Something went wrong
            </h2>

            <p
              style={{
                fontSize: "1rem",
                color: "#94a3b8",
                marginBottom: "0.5rem",
                lineHeight: "1.6",
              }}
            >
              {this.state.error?.message || "An unexpected error occurred"}
            </p>

            <p
              style={{
                fontSize: "0.875rem",
                color: "#64748b",
                marginBottom: "2rem",
                lineHeight: "1.6",
              }}
            >
              Don't worry, we've logged this error. Try reloading the page or
              contact support if the problem persists.
            </p>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: "0.875rem 2rem",
                  background: "linear-gradient(135deg, #dc2626, #991b1b)",
                  border: "none",
                  borderRadius: "12px",
                  color: "white",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(220, 38, 38, 0.4)",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(220, 38, 38, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(220, 38, 38, 0.4)";
                }}
              >
                <span>🔄</span>
                <span>Reload Page</span>
              </button>

              <button
                onClick={() => window.history.back()}
                style={{
                  padding: "0.875rem 2rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  color: "#f1f5f9",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.05)";
                }}
              >
                <span>←</span>
                <span>Go Back</span>
              </button>
            </div>

            {/* Error Details (for development) */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details
                style={{
                  marginTop: "2rem",
                  padding: "1rem",
                  background: "rgba(0, 0, 0, 0.3)",
                  borderRadius: "12px",
                  textAlign: "left",
                  fontSize: "0.75rem",
                  color: "#94a3b8",
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                <summary
                  style={{
                    cursor: "pointer",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    color: "#f1f5f9",
                  }}
                >
                  Error Details (Development Only)
                </summary>
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    margin: 0,
                    fontFamily: "monospace",
                  }}
                >
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
