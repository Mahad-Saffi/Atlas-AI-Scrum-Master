import React, { createContext, useContext, useState, useCallback } from "react";

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
          background: "rgba(16, 185, 129, 0.95)",
          border: "1px solid rgba(16, 185, 129, 0.5)",
          icon: "✓",
        };
      case "error":
        return {
          background: "rgba(239, 68, 68, 0.95)",
          border: "1px solid rgba(239, 68, 68, 0.5)",
          icon: "✕",
        };
      case "warning":
        return {
          background: "rgba(245, 158, 11, 0.95)",
          border: "1px solid rgba(245, 158, 11, 0.5)",
          icon: "⚠",
        };
      default:
        return {
          background: "rgba(59, 130, 246, 0.95)",
          border: "1px solid rgba(59, 130, 246, 0.5)",
          icon: "ℹ",
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
                backdropFilter: "blur(10px)",
                border: styles.border,
                borderRadius: "var(--radius-md)",
                padding: "1rem 1.25rem",
                minWidth: "300px",
                maxWidth: "500px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                pointerEvents: "auto",
                animation: "slideIn 0.3s ease-out",
              }}
            >
              <span
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "700",
                  color: "#ECDFCC",
                }}
              >
                {styles.icon}
              </span>
              <span
                style={{
                  flex: 1,
                  fontSize: "0.9375rem",
                  color: "#ECDFCC",
                  fontWeight: "500",
                }}
              >
                {toast.message}
              </span>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ECDFCC",
                  cursor: "pointer",
                  fontSize: "1.25rem",
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
