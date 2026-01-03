import React from "react";
import {
  MagnifyingGlassIcon,
  KeyIcon,
  UserIcon,
  TrashIcon,
  LockClosedIcon,
  BeakerIcon,
  PlayIcon,
} from "@heroicons/react/24/solid";
import theme from "../styles/theme";

const DebugAuth: React.FC = () => {
  const jwt = localStorage.getItem("jwt");
  const user = localStorage.getItem("user");

  const clearAuth = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div
      style={{
        padding: `${theme.spacing["4xl"]} ${theme.spacing.xl}`,
        backgroundColor: theme.colors.background.primary,
        minHeight: "100vh",
        fontFamily: theme.typography.fontFamily.primary,
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: theme.typography.fontSize["4xl"],
            color: theme.colors.text.primary,
            marginBottom: theme.spacing["2xl"],
            textShadow: theme.effects.textShadow.md,
            display: "flex",
            alignItems: "center",
            gap: theme.spacing.md,
          }}
        >
          <MagnifyingGlassIcon style={{ width: "40px", height: "40px" }} />
          Authentication Debug
        </h1>

        <div
          style={{
            marginBottom: theme.spacing["2xl"],
            border: `3px solid ${theme.colors.border.default}`,
            backgroundColor: theme.colors.background.card,
            boxShadow: theme.shadows.brutal,
            padding: theme.spacing.xl,
            borderRadius: theme.borderRadius.sm,
          }}
        >
          <h2
            style={{
              fontSize: theme.typography.fontSize["2xl"],
              color: theme.colors.text.primary,
              marginBottom: theme.spacing.lg,
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.sm,
            }}
          >
            <KeyIcon style={{ width: "24px", height: "24px" }} />
            JWT Token:
          </h2>
          <pre
            style={{
              backgroundColor: theme.colors.background.secondary,
              border: `2px solid ${theme.colors.border.default}`,
              padding: theme.spacing.lg,
              overflow: "auto",
              maxWidth: "100%",
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.primary,
              fontFamily: theme.typography.fontFamily.mono,
              wordBreak: "break-all",
              whiteSpace: "pre-wrap",
              borderRadius: theme.borderRadius.sm,
            }}
          >
            {jwt || "No token found"}
          </pre>
        </div>

        <div
          style={{
            marginBottom: theme.spacing["2xl"],
            border: `3px solid ${theme.colors.border.default}`,
            backgroundColor: theme.colors.background.card,
            boxShadow: theme.shadows.brutal,
            padding: theme.spacing.xl,
            borderRadius: theme.borderRadius.sm,
          }}
        >
          <h2
            style={{
              fontSize: theme.typography.fontSize["2xl"],
              color: theme.colors.text.primary,
              marginBottom: theme.spacing.lg,
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.sm,
            }}
          >
            <UserIcon style={{ width: "24px", height: "24px" }} />
            User Data:
          </h2>
          <pre
            style={{
              backgroundColor: theme.colors.background.secondary,
              border: `2px solid ${theme.colors.border.default}`,
              padding: theme.spacing.lg,
              overflow: "auto",
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.primary,
              fontFamily: theme.typography.fontFamily.mono,
              wordBreak: "break-all",
              whiteSpace: "pre-wrap",
              borderRadius: theme.borderRadius.sm,
            }}
          >
            {user || "No user data found"}
          </pre>
        </div>

        <div
          style={{
            marginBottom: theme.spacing["2xl"],
            display: "flex",
            gap: theme.spacing.lg,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={clearAuth}
            style={{
              backgroundColor: theme.colors.background.card,
              color: theme.colors.text.primary,
              border: `3px solid ${theme.colors.border.default}`,
              padding: `${theme.spacing.md} ${theme.spacing.xl}`,
              fontSize: theme.typography.fontSize.base,
              fontWeight: theme.typography.fontWeight.bold,
              cursor: "pointer",
              boxShadow: theme.shadows.brutal,
              fontFamily: theme.typography.fontFamily.primary,
              transition: theme.effects.transition.fast,
              borderRadius: theme.borderRadius.sm,
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.sm,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translate(2px, 2px)";
              e.currentTarget.style.boxShadow =
                "2px 2px 0 " + theme.colors.border.default;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translate(0, 0)";
              e.currentTarget.style.boxShadow = theme.shadows.brutal;
            }}
          >
            <TrashIcon style={{ width: "20px", height: "20px" }} />
            Clear Auth & Reload
          </button>

          <button
            onClick={() =>
              (window.location.href = "http://localhost:8000/auth/github")
            }
            style={{
              backgroundColor: theme.colors.background.card,
              color: theme.colors.text.primary,
              border: `3px solid ${theme.colors.border.default}`,
              padding: `${theme.spacing.md} ${theme.spacing.xl}`,
              fontSize: theme.typography.fontSize.base,
              fontWeight: theme.typography.fontWeight.bold,
              cursor: "pointer",
              boxShadow: theme.shadows.brutal,
              fontFamily: theme.typography.fontFamily.primary,
              transition: theme.effects.transition.fast,
              borderRadius: theme.borderRadius.sm,
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.sm,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translate(2px, 2px)";
              e.currentTarget.style.boxShadow =
                "2px 2px 0 " + theme.colors.border.default;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translate(0, 0)";
              e.currentTarget.style.boxShadow = theme.shadows.brutal;
            }}
          >
            <LockClosedIcon style={{ width: "20px", height: "20px" }} />
            Re-authenticate with GitHub
          </button>
        </div>

        <div
          style={{
            border: `3px solid ${theme.colors.border.default}`,
            backgroundColor: theme.colors.background.card,
            boxShadow: theme.shadows.brutal,
            padding: theme.spacing.xl,
            borderRadius: theme.borderRadius.sm,
          }}
        >
          <h2
            style={{
              fontSize: theme.typography.fontSize["2xl"],
              color: theme.colors.text.primary,
              marginBottom: theme.spacing.lg,
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.sm,
            }}
          >
            <BeakerIcon style={{ width: "24px", height: "24px" }} />
            Test API Call:
          </h2>
          <button
            onClick={async () => {
              try {
                const response = await fetch("http://localhost:8000/users/me", {
                  headers: {
                    Authorization: `Bearer ${jwt}`,
                  },
                });
                const data = await response.json();
                alert(JSON.stringify(data, null, 2));
              } catch (error) {
                alert("Error: " + error);
              }
            }}
            style={{
              backgroundColor: theme.colors.background.card,
              color: theme.colors.text.primary,
              border: `3px solid ${theme.colors.border.default}`,
              padding: `${theme.spacing.md} ${theme.spacing.xl}`,
              fontSize: theme.typography.fontSize.base,
              fontWeight: theme.typography.fontWeight.bold,
              cursor: "pointer",
              boxShadow: theme.shadows.brutal,
              fontFamily: theme.typography.fontFamily.primary,
              transition: theme.effects.transition.fast,
              borderRadius: theme.borderRadius.sm,
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.sm,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translate(2px, 2px)";
              e.currentTarget.style.boxShadow =
                "2px 2px 0 " + theme.colors.border.default;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translate(0, 0)";
              e.currentTarget.style.boxShadow = theme.shadows.brutal;
            }}
          >
            <PlayIcon style={{ width: "20px", height: "20px" }} />
            Test /users/me Endpoint
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebugAuth;
