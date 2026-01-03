import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./SimpleLogin.css";

const SimpleLogin: React.FC = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent, isLogin: boolean) => {
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
    <div className="login-page">
      <div className={`auth-container ${isSignUp ? "right-panel-active" : ""}`}>
        {/* Sign Up Form */}
        <div className="form-container sign-up-container">
          <form onSubmit={(e) => handleSubmit(e, false)}>
            <h1>Create Account</h1>
            <div className="logo-icon">
              <img
                src={logo}
                alt="Ideal Assistant"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <span>Join Ideal Assistant Scrum Master</span>

            {error && isSignUp && <div className="error-message">{error}</div>}

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />

            <div className="button-group">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary-form"
              >
                {loading ? "Creating..." : "Sign Up"}
              </button>
              <button
                type="button"
                className="demo-btn"
                onClick={handleDemoLogin}
                disabled={loading}
              >
                Try Demo
              </button>
            </div>
          </form>
        </div>

        {/* Sign In Form */}
        <div className="form-container sign-in-container">
          <form onSubmit={(e) => handleSubmit(e, true)}>
            <h1>Sign In</h1>
            <div className="logo-icon">
              <img
                src={logo}
                alt="Ideal Assistant"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <span>Use your Ideal Assistant account</span>

            {error && !isSignUp && <div className="error-message">{error}</div>}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="button-group">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary-form"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
              <button
                id="btn-demo-login"
                type="button"
                className="demo-btn"
                onClick={handleDemoLogin}
                disabled={loading}
              >
                Try Demo
              </button>
            </div>
          </form>
        </div>

        {/* Overlay */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <button className="ghost" onClick={() => setIsSignUp(false)}>
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>
                Enter your personal details and start your journey with Ideal
                Assistant
              </p>
              <button className="ghost" onClick={() => setIsSignUp(true)}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="demo-info">Demo Account: demo@atlas.ai / demo123</div>
    </div>
  );
};

export default SimpleLogin;
