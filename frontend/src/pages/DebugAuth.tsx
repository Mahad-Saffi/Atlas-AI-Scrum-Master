import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

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
        padding: "40px 20px",
        backgroundColor: "#fefefe",
        minHeight: "100vh",
        fontFamily: '"Segoe Print", "Comic Sans MS", cursive',
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
            fontSize: "42px",
            color: "#1a1a1a",
            marginBottom: "30px",
            textShadow: "3px 3px 0 rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <MagnifyingGlassIcon style={{ width: "32px", height: "32px" }} />
          Authentication Debug
        </h1>

        <div
          style={{
            marginBottom: "30px",
            border: "3px solid #1a1a1a",
            backgroundColor: "white",
            boxShadow: "6px 6px 0 #1a1a1a",
            padding: "20px",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              color: "#1a1a1a",
              marginBottom: "15px",
            }}
          >
            🎫 JWT Token:
          </h2>
          <pre
            style={{
              backgroundColor: "#f5f5f5",
              border: "2px solid #1a1a1a",
              padding: "15px",
              overflow: "auto",
              maxWidth: "100%",
              fontSize: "12px",
              color: "#1a1a1a",
              fontFamily: "monospace",
              wordBreak: "break-all",
              whiteSpace: "pre-wrap",
            }}
          >
            {jwt || "No token found"}
          </pre>
        </div>

        <div
          style={{
            marginBottom: "30px",
            border: "3px solid #1a1a1a",
            backgroundColor: "white",
            boxShadow: "6px 6px 0 #1a1a1a",
            padding: "20px",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              color: "#1a1a1a",
              marginBottom: "15px",
            }}
          >
            👤 User Data:
          </h2>
          <pre
            style={{
              backgroundColor: "#f5f5f5",
              border: "2px solid #1a1a1a",
              padding: "15px",
              overflow: "auto",
              fontSize: "14px",
              color: "#1a1a1a",
              fontFamily: "monospace",
              wordBreak: "break-all",
              whiteSpace: "pre-wrap",
            }}
          >
            {user || "No user data found"}
          </pre>
        </div>

        <div
          style={{
            marginBottom: "30px",
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={clearAuth}
            style={{
              backgroundColor: "white",
              color: "#1a1a1a",
              border: "3px solid #1a1a1a",
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "4px 4px 0 #1a1a1a",
              fontFamily: "inherit",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translate(2px, 2px)";
              e.currentTarget.style.boxShadow = "2px 2px 0 #1a1a1a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translate(0, 0)";
              e.currentTarget.style.boxShadow = "4px 4px 0 #1a1a1a";
            }}
          >
            🗑️ Clear Auth & Reload
          </button>

          <button
            onClick={() =>
              (window.location.href = "http://localhost:8000/auth/github")
            }
            style={{
              backgroundColor: "white",
              color: "#1a1a1a",
              border: "3px solid #1a1a1a",
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "4px 4px 0 #1a1a1a",
              fontFamily: "inherit",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translate(2px, 2px)";
              e.currentTarget.style.boxShadow = "2px 2px 0 #1a1a1a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translate(0, 0)";
              e.currentTarget.style.boxShadow = "4px 4px 0 #1a1a1a";
            }}
          >
            🔐 Re-authenticate with GitHub
          </button>
        </div>

        <div
          style={{
            border: "3px solid #1a1a1a",
            backgroundColor: "white",
            boxShadow: "6px 6px 0 #1a1a1a",
            padding: "20px",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              color: "#1a1a1a",
              marginBottom: "15px",
            }}
          >
            🧪 Test API Call:
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
              backgroundColor: "white",
              color: "#1a1a1a",
              border: "3px solid #1a1a1a",
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "4px 4px 0 #1a1a1a",
              fontFamily: "inherit",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translate(2px, 2px)";
              e.currentTarget.style.boxShadow = "2px 2px 0 #1a1a1a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translate(0, 0)";
              e.currentTarget.style.boxShadow = "4px 4px 0 #1a1a1a";
            }}
          >
            ▶️ Test /users/me Endpoint
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebugAuth;
