import React, { useState } from "react";

const SimpleLogin: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/v1/auth/login" : "/api/v1/auth/register";
      const body = isLogin
        ? { email, password }
        : { email, password, username };

      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Authentication failed");
      }

      localStorage.setItem("jwt", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/auth/demo-login",
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Demo login failed");
      }

      localStorage.setItem("jwt", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        className="animate-fade-in"
        style={{
          width: "100%",
          maxWidth: "420px",
        }}
      >
        {/* Logo & Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "var(--radius-xl)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
              fontSize: "2.5rem",
              boxShadow: "0 10px 40px rgba(102, 126, 234, 0.5)",
              animation: "float 3s ease-in-out infinite",
            }}
          >
            🤖
          </div>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              color: "white",
              marginBottom: "0.5rem",
              letterSpacing: "-0.02em",
              textShadow: "0 2px 20px rgba(0,0,0,0.3)",
            }}
          >
            Atlas AI
          </h1>
          <p
            style={{
              fontSize: "1.125rem",
              color: "rgba(255,255,255,0.95)",
              fontWeight: "500",
            }}
          >
            Intelligent Scrum Master
          </p>
        </div>

        {/* Login Card */}
        <div
          className="card-glass"
          style={{
            padding: "2.5rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.75rem",
              fontWeight: "600",
              color: "var(--color-text-primary)",
              marginBottom: "0.5rem",
            }}
          >
            {isLogin ? "Welcome back" : "Create account"}
          </h2>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--color-text-secondary)",
              marginBottom: "2rem",
            }}
          >
            {isLogin
              ? "Sign in to continue to your dashboard"
              : "Get started with your free account"}
          </p>

          {error && (
            <div
              style={{
                padding: "1rem",
                marginBottom: "1.5rem",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "var(--radius-md)",
                color: "#dc2626",
                fontSize: "0.875rem",
                backdropFilter: "blur(10px)",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div style={{ marginBottom: "1.25rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "var(--color-text-primary)",
                  }}
                >
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required={!isLogin}
                  placeholder="Enter your username"
                  className="input-modern"
                />
              </div>
            )}

            <div style={{ marginBottom: "1.25rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "var(--color-text-primary)",
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="input-modern"
              />
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "var(--color-text-primary)",
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                className="input-modern"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "0.875rem",
                marginBottom: "1rem",
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    position: "relative",
                    zIndex: 3,
                  }}
                >
                  <div
                    className="spinner"
                    style={{
                      width: "16px",
                      height: "16px",
                      borderWidth: "2px",
                      borderTopColor: "white",
                    }}
                  />
                  Processing...
                </span>
              ) : (
                <span style={{ position: "relative", zIndex: 3 }}>
                  {isLogin ? "Sign in" : "Create account"}
                </span>
              )}
            </button>
          </form>

          <div
            style={{
              textAlign: "center",
              marginBottom: "1.5rem",
            }}
          >
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={{
                background: "none",
                border: "none",
                color: "var(--color-text-secondary)",
                fontSize: "0.875rem",
                cursor: "pointer",
                fontWeight: "500",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#667eea")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-text-secondary)")
              }
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(0, 0, 0, 0.1)",
              paddingTop: "1.5rem",
            }}
          >
            <button
              onClick={handleDemoLogin}
              disabled={loading}
              className="btn-secondary"
              style={{
                width: "100%",
                padding: "0.875rem",
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              <span style={{ position: "relative", zIndex: 3 }}>
                🎮 Try demo account
              </span>
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div
          style={{
            marginTop: "1.5rem",
            textAlign: "center",
            fontSize: "0.875rem",
            color: "rgba(255,255,255,0.9)",
            textShadow: "0 1px 3px rgba(0,0,0,0.3)",
          }}
        >
          <p>💡 Demo: demo@atlas.ai / demo123</p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default SimpleLogin;
