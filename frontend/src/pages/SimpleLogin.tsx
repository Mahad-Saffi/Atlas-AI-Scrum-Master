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
        background: "var(--color-cream)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
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
              width: "64px",
              height: "64px",
              background: "var(--color-dark)",
              borderRadius: "var(--radius-xl)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              fontSize: "2rem",
            }}
          >
            🤖
          </div>
          <h1
            style={{
              fontSize: "1.875rem",
              fontWeight: "600",
              color: "var(--color-text-primary)",
              marginBottom: "0.25rem",
              letterSpacing: "-0.01em",
            }}
          >
            Atlas AI
          </h1>
          <p
            style={{
              fontSize: "0.9375rem",
              color: "var(--color-text-secondary)",
              fontWeight: "400",
            }}
          >
            Intelligent Scrum Master
          </p>
        </div>

        {/* Login Card */}
        <div
          style={{
            background: "var(--color-white)",
            borderRadius: "var(--radius-xl)",
            padding: "2rem",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--color-border)",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
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
              marginBottom: "1.5rem",
            }}
          >
            {isLogin
              ? "Sign in to continue to your dashboard"
              : "Get started with your free account"}
          </p>

          {error && (
            <div
              style={{
                padding: "0.875rem",
                marginBottom: "1.25rem",
                backgroundColor: "#fee2e2",
                border: "1px solid #fecaca",
                borderRadius: "var(--radius-md)",
                color: "#dc2626",
                fontSize: "0.875rem",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
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

            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
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

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
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
                padding: "0.75rem",
                marginBottom: "1rem",
                opacity: loading ? 0.6 : 1,
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
                  }}
                >
                  <div className="spinner" />
                  Processing...
                </span>
              ) : isLogin ? (
                "Sign in"
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <div
            style={{
              textAlign: "center",
              marginBottom: "1.25rem",
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
                fontWeight: "400",
              }}
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>

          <div
            style={{
              borderTop: "1px solid var(--color-border)",
              paddingTop: "1.25rem",
            }}
          >
            <button
              onClick={handleDemoLogin}
              disabled={loading}
              className="btn-secondary"
              style={{
                width: "100%",
                padding: "0.75rem",
                opacity: loading ? 0.6 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              Try demo account
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div
          style={{
            marginTop: "1.25rem",
            textAlign: "center",
            fontSize: "0.8125rem",
            color: "var(--color-text-muted)",
          }}
        >
          <p>Demo: demo@atlas.ai / demo123</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleLogin;
