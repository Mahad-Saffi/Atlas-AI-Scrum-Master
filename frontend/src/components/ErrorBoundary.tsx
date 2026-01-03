import { Component, type ErrorInfo, type ReactNode } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import theme from "../styles/theme";

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
            minHeight: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: theme.spacing["4xl"],
            fontFamily: theme.typography.fontFamily.primary,
          }}
        >
          <div
            style={{
              textAlign: "center",
              padding: theme.spacing["4xl"],
              border: `2px solid ${theme.colors.status.error}`,
              backgroundColor: theme.colors.background.card,
              backdropFilter: theme.effects.backdropBlur.md,
              borderRadius: theme.borderRadius.xl,
              boxShadow: theme.shadows.lg,
              maxWidth: "500px",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                margin: `0 auto ${theme.spacing.xl}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `rgba(239, 68, 68, 0.1)`,
                borderRadius: theme.borderRadius.full,
              }}
            >
              <ExclamationTriangleIcon
                style={{
                  width: "40px",
                  height: "40px",
                  color: theme.colors.status.error,
                }}
              />
            </div>
            <h2
              style={{
                fontSize: theme.typography.fontSize["2xl"],
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing.md,
              }}
            >
              Oops! Something went wrong
            </h2>
            <p
              style={{
                fontSize: theme.typography.fontSize.base,
                color: theme.colors.text.secondary,
                marginBottom: theme.spacing["2xl"],
                lineHeight: theme.typography.lineHeight.relaxed,
              }}
            >
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
              style={{
                padding: `${theme.spacing.md} ${theme.spacing["2xl"]}`,
                fontSize: theme.typography.fontSize.base,
                fontWeight: theme.typography.fontWeight.semibold,
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
