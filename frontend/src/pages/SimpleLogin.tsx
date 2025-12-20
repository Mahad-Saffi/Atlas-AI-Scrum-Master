import React, { useState } from "react";
import logo from "../assets/logo.png";
import { authService } from "../services/auth";
import "./SimpleLogin.css";

const SimpleLogin: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
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
      const endpoint = !isSignUp
        ? "/api/v1/auth/login"
        : "/api/v1/auth/register";
      const body = !isSignUp
        ? { email, password }
        : { email, password, username };
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Authentication failed");
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
        { method: "POST" }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Demo login failed");
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
    <div className="login-page">
      <div className="login-card">
        <div className="logo-icon-container">
          <div className="logo-icon">
            <img src={logo} alt="Atlas AI" />
          </div>
        </div>
        <h1 className="app-title">
          <span style={{ color: "#ffffff" }}>Ideal</span>{" "}
          <span style={{ color: "#dc2626" }}>Assistant</span>
        </h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="input-group">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}

          <div className="input-group">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {!isSignUp && <span className="forgot-link">Forgot?</span>}
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading
              ? isSignUp
                ? "Creating..."
                : "Signing In..."
              : isSignUp
              ? "Sign Up"
              : "Sign In"}
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <button
          type="button"
          className="demo-btn"
          onClick={handleDemoLogin}
          disabled={loading}
        >
          Try Demo Account
        </button>

        <div className="auth-toggle">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <span onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? " Sign in" : " Sign up"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SimpleLogin;
