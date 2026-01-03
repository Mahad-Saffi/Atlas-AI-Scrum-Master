import React, { useState } from "react";
import logo from "../assets/logo.png";
import { authService } from "../services/auth";
import theme from "../styles/theme";

const SignIn: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleGitHubSignIn = async () => {
    setIsLoading(true);
    try {
      const user = await authService.signInWithGitHub();
      console.log("User signed in:", user);
      // TODO: Redirect to dashboard
    } catch (error) {
      console.error("Sign in failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.background.primary,
        padding: "20px",
        fontFamily: theme.typography.fontFamily.primary,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Simple Background */}
      <div
        style={{
          position: "absolute",
          inset: "0",
          background: theme.colors.brand.redGradient,
          zIndex: "1",
        }}
      />

      {/* Additional Background Glow Effects */}
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "50%",
          transform: "translateX(-50%)",
          width: "120vh",
          height: "60vh",
          borderRadius: "0 0 50% 50%",
          background: `radial-gradient(ellipse, ${theme.colors.brand.red}33 0%, transparent 70%)`,
          filter: "blur(80px)",
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "0",
          left: "50%",
          transform: "translateX(-50%)",
          width: "90vh",
          height: "90vh",
          borderRadius: "50% 50% 0 0",
          background: `radial-gradient(ellipse, ${theme.colors.brand.redDark}33 0%, transparent 70%)`,
          filter: "blur(60px)",
          zIndex: 1,
          animation: "pulse 6s ease-in-out infinite",
        }}
      />

      {/* Floating Glow Spots */}
      <div
        style={{
          position: "absolute",
          left: "25%",
          top: "25%",
          width: "300px",
          height: "300px",
          background: `${theme.colors.brand.red}08`,
          borderRadius: "50%",
          filter: "blur(100px)",
          animation: "float 8s ease-in-out infinite",
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: "absolute",
          right: "25%",
          bottom: "25%",
          width: "300px",
          height: "300px",
          background: `${theme.colors.brand.redLight}0D`,
          borderRadius: "50%",
          filter: "blur(100px)",
          animation: "float 8s ease-in-out infinite reverse",
          animationDelay: "2s",
          zIndex: 1,
        }}
      />

      {/* Main Card Container */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "400px",
          perspective: "1500px",
        }}
      >
        <div
          style={{
            position: "relative",
            transform: `rotateX(${mousePosition.y * 0.03}deg) rotateY(${
              mousePosition.x * 0.03
            }deg)`,
            transition: "transform 0.1s ease-out",
            transformStyle: "preserve-3d",
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              backgroundColor: theme.colors.background.card,
              border: `1px solid ${theme.colors.border.red}`,
              borderRadius: theme.borderRadius.xl,
              padding: "32px",
              boxShadow: `${theme.shadows.lg}, 0 0 0 1px ${theme.colors.border.red}`,
              backdropFilter: theme.effects.backdropBlur.lg,
              background: `linear-gradient(135deg, ${theme.colors.background.card} 0%, ${theme.colors.background.secondary} 100%)`,
              overflow: "hidden",
            }}
          >
            {/* Traveling Light Beams */}
            <div
              style={{
                position: "absolute",
                top: "-1px",
                left: "-1px",
                right: "-1px",
                bottom: "-1px",
                borderRadius: theme.borderRadius.xl,
                overflow: "hidden",
              }}
            >
              {/* Top beam */}
              <div
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  height: "3px",
                  width: "50%",
                  background: `linear-gradient(90deg, transparent, ${theme.colors.brand.red}CC, transparent)`,
                  animation: "slideRight 3s ease-in-out infinite",
                  filter: "blur(1px)",
                }}
              />

              {/* Right beam */}
              <div
                style={{
                  position: "absolute",
                  top: "0",
                  right: "0",
                  height: "50%",
                  width: "3px",
                  background: `linear-gradient(180deg, transparent, ${theme.colors.brand.red}CC, transparent)`,
                  animation: "slideDown 3s ease-in-out infinite",
                  animationDelay: "0.75s",
                  filter: "blur(1px)",
                }}
              />

              {/* Bottom beam */}
              <div
                style={{
                  position: "absolute",
                  bottom: "0",
                  right: "0",
                  height: "3px",
                  width: "50%",
                  background: `linear-gradient(270deg, transparent, ${theme.colors.brand.red}CC, transparent)`,
                  animation: "slideLeft 3s ease-in-out infinite",
                  animationDelay: "1.5s",
                  filter: "blur(1px)",
                }}
              />

              {/* Left beam */}
              <div
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: "0",
                  height: "50%",
                  width: "3px",
                  background: `linear-gradient(0deg, transparent, ${theme.colors.brand.red}CC, transparent)`,
                  animation: "slideUp 3s ease-in-out infinite",
                  animationDelay: "2.25s",
                  filter: "blur(1px)",
                }}
              />
            </div>

            {/* Corner Glow Spots */}
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: `${theme.colors.brand.red}99`,
                filter: "blur(2px)",
                animation: "glow 2s ease-in-out infinite",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "0",
                right: "0",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: `${theme.colors.brand.redLight}66`,
                filter: "blur(2px)",
                animation: "glow 2.4s ease-in-out infinite",
                animationDelay: "0.5s",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "0",
                right: "0",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: `${theme.colors.brand.red}99`,
                filter: "blur(2px)",
                animation: "glow 2.2s ease-in-out infinite",
                animationDelay: "1s",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "0",
                left: "0",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: `${theme.colors.brand.redLight}66`,
                filter: "blur(2px)",
                animation: "glow 2.3s ease-in-out infinite",
                animationDelay: "1.5s",
              }}
            />

            {/* Subtle Inner Pattern */}
            <div
              style={{
                position: "absolute",
                inset: "0",
                opacity: "0.02",
                backgroundImage: `linear-gradient(135deg, ${theme.colors.text.primary} 0.5px, transparent 0.5px), linear-gradient(45deg, ${theme.colors.text.primary} 0.5px, transparent 0.5px)`,
                backgroundSize: "30px 30px",
              }}
            />

            {/* Logo Section */}
            <div
              style={{
                textAlign: "center",
                marginBottom: "28px",
                position: "relative",
                zIndex: 2,
              }}
            >
              <div
                style={{
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                  }}
                >
                  {/* Enhanced Glow effect behind logo */}
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "120px",
                      height: "120px",
                      background: `radial-gradient(circle, ${theme.colors.brand.red}33 0%, ${theme.colors.brand.red}1A 40%, transparent 70%)`,
                      borderRadius: "50%",
                      filter: "blur(20px)",
                      zIndex: 1,
                      animation: "logoGlow 4s ease-in-out infinite",
                    }}
                  />

                  {/* Logo */}
                  <img
                    src={logo}
                    alt="Ideal Assistant Scrum Master"
                    style={{
                      width: "72px",
                      height: "72px",
                      position: "relative",
                      zIndex: 2,
                      filter: `drop-shadow(0 8px 20px ${theme.colors.brand.red}66) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))`,
                      transition: "all 0.3s ease",
                      animation: "logoFloat 6s ease-in-out infinite",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        "scale(1.1) translateZ(20px)";
                      e.currentTarget.style.filter = `drop-shadow(0 12px 30px ${theme.colors.brand.red}99) drop-shadow(0 6px 12px rgba(0, 0, 0, 0.4))`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform =
                        "scale(1) translateZ(0px)";
                      e.currentTarget.style.filter = `drop-shadow(0 8px 20px ${theme.colors.brand.red}66) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))`;
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "8px" }}>
                <span
                  style={{
                    color: theme.colors.text.primary,
                    fontSize: "22px",
                    fontWeight: "bold",
                    letterSpacing: "0.5px",
                    textShadow: "0 2px 6px rgba(0,0,0,0.4)",
                    background: `linear-gradient(135deg, ${theme.colors.text.primary} 0%, ${theme.colors.text.white} 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    animation: "textShimmer 3s ease-in-out infinite",
                  }}
                >
                  AI SCRUM MASTER
                </span>
              </div>

              <div
                style={{
                  color: theme.colors.brand.red,
                  fontSize: "12px",
                  letterSpacing: "2px",
                  fontWeight: "600",
                  animation: "fadeInOut 4s ease-in-out infinite",
                }}
              >
                ATLAS
              </div>
            </div>

            {/* Title */}
            <h1
              style={{
                color: theme.colors.text.primary,
                fontSize: "20px",
                fontWeight: "600",
                textAlign: "center",
                marginBottom: "28px",
                textShadow: "0 3px 6px rgba(0,0,0,0.4)",
                letterSpacing: "0.3px",
                lineHeight: "1.2",
                position: "relative",
                zIndex: 2,
              }}
            >
              Sign In to Your Account
            </h1>

            {/* Enhanced GitHub Sign In Button */}
            <div style={{ position: "relative", marginBottom: "20px" }}>
              {/* Button glow effect */}
              <div
                style={{
                  position: "absolute",
                  inset: "0",
                  background: `${theme.colors.text.primary}1A`,
                  borderRadius: theme.borderRadius.md,
                  filter: "blur(10px)",
                  opacity: "0",
                  transition: "opacity 0.3s ease",
                  animation: isLoading
                    ? "buttonGlow 1s ease-in-out infinite"
                    : "none",
                }}
              />

              <button
                onClick={handleGitHubSignIn}
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "14px 20px",
                  borderRadius: theme.borderRadius.md,
                  fontSize: "16px",
                  fontWeight: "600",
                  backgroundColor: isLoading
                    ? `${theme.colors.text.primary}B3`
                    : theme.colors.text.primary,
                  color: theme.colors.background.primary,
                  border: `1px solid ${theme.colors.border.light}`,
                  boxShadow: `0 8px 20px ${theme.colors.text.primary}33, 0 3px 6px rgba(0, 0, 0, 0.1)`,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  transition: "all 0.3s ease",
                  transform: "translateY(0px) translateZ(0px)",
                  position: "relative",
                  overflow: "hidden",
                  zIndex: 2,
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor =
                      theme.colors.text.white;
                    e.currentTarget.style.transform =
                      "translateY(-3px) translateZ(10px)";
                    e.currentTarget.style.boxShadow = `0 15px 40px ${theme.colors.text.primary}66`;
                    (
                      e.currentTarget.previousElementSibling as HTMLElement
                    ).style.opacity = "0.7";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor =
                      theme.colors.text.primary;
                    e.currentTarget.style.transform =
                      "translateY(0px) translateZ(0px)";
                    e.currentTarget.style.boxShadow = `0 8px 20px ${theme.colors.text.primary}33, 0 3px 6px rgba(0, 0, 0, 0.1)`;
                    (
                      e.currentTarget.previousElementSibling as HTMLElement
                    ).style.opacity = "0";
                  }
                }}
              >
                {/* Button shimmer effect */}
                {isLoading && (
                  <div
                    style={{
                      position: "absolute",
                      inset: "0",
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                      animation: "shimmer 1.5s ease-in-out infinite",
                    }}
                  />
                )}

                {isLoading ? (
                  <>
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        border: `2px solid ${theme.colors.background.primary}4D`,
                        borderTop: `2px solid ${theme.colors.background.primary}`,
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                      }}
                    />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <svg
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    <span>Continue with GitHub</span>
                  </>
                )}
              </button>
            </div>

            {/* Security Notice */}
            <p
              style={{
                textAlign: "center",
                fontSize: "14px",
                color: theme.colors.text.secondary,
                marginBottom: "0",
                position: "relative",
                zIndex: 2,
                animation: "fadeInOut 5s ease-in-out infinite",
              }}
            >
              Your data is secured with advanced encryption.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <p
          style={{
            fontSize: "12px",
            color: theme.colors.text.tertiary,
            margin: 0,
            animation: "fadeInOut 6s ease-in-out infinite",
          }}
        >
          Powered by AI • Built for Development Teams
        </p>
      </div>

      {/* Enhanced CSS Animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.3; transform: translateX(-50%) scale(1.05); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0.3; }
          50% { transform: translateY(-20px); opacity: 0.5; }
        }
        
        @keyframes slideRight {
          0% { left: -50%; opacity: 0; }
          50% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        
        @keyframes slideDown {
          0% { top: -50%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        
        @keyframes slideLeft {
          0% { right: -50%; opacity: 0; }
          50% { opacity: 1; }
          100% { right: 100%; opacity: 0; }
        }
        
        @keyframes slideUp {
          0% { bottom: -50%; opacity: 0; }
          50% { opacity: 1; }
          100% { bottom: 100%; opacity: 0; }
        }
        
        @keyframes glow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
        
        @keyframes logoGlow {
          0%, 100% { opacity: 0.2; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.4; transform: translate(-50%, -50%) scale(1.1); }
        }
        
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        
        @keyframes textShimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        
        @keyframes buttonGlow {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.7; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default SignIn;
