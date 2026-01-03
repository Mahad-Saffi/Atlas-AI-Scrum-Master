import React, { createContext, useContext, useState, useCallback } from "react";
import theme from "../styles/theme";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

interface ToastContextType {
  showToast: (message: string, type?: Toast["type"]) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: Toast["type"] = "info") => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);

      // Auto remove after 4 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 4000);
    },
    []
  );

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const getToastStyles = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return {
          background: `${theme.colors.status.success}f2`,
          border: `1px solid ${theme.colors.status.success}80`,
          icon: "✓",
        };
      case "error":
        return {
          background: `${theme.colors.status.error}f2`,
          border: `1px solid ${theme.colors.status.error}80`,
          icon: "✕",
        };
      case "warning":
        return {
          background: `${theme.colors.status.warning}f2`,
          border: `1px solid ${theme.colors.status.warning}80`,
          icon: "!",
        };
      default:
        return {
          background: `${theme.colors.status.info}f2`,
          border: `1px solid ${theme.colors.status.info}80`,
          icon: "i",
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          pointerEvents: "none",
        }}
      >
        {toasts.map((toast) => {
          const styles = getToastStyles(toast.type);
          return (
            <div
              key={toast.id}
              style={{
                background: styles.background,
                backdropFilter: theme.effects.backdropBlur.sm,
                border: styles.border,
                borderRadius: theme.borderRadius.md,
                padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
                minWidth: "300px",
                maxWidth: "500px",
                boxShadow: theme.shadows.md,
                display: "flex",
                alignItems: "center",
                gap: theme.spacing.md,
                pointerEvents: "auto",
                animation: "slideIn 0.3s ease-out",
              }}
            >
              <span
                style={{
                  fontSize: theme.typography.fontSize.xl,
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text.white,
                }}
              >
                {styles.icon}
              </span>
              <span
                style={{
                  flex: 1,
                  fontSize: theme.typography.fontSize.base,
                  color: theme.colors.text.white,
                  fontWeight: theme.typography.fontWeight.medium,
                }}
              >
                {toast.message}
              </span>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: theme.colors.text.white,
                  cursor: "pointer",
                  fontSize: theme.typography.fontSize.xl,
                  padding: "0",
                  lineHeight: "1",
                  opacity: 0.7,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </ToastContext.Provider>
  );
};
