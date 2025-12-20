import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserGroupIcon, PlusIcon } from "@heroicons/react/24/solid";

interface TeamMember {
  id: number;
  username: string;
  email: string;
  role: string;
  description: string;
  invited_by: string;
  joined_at: string;
}

const TeamMembers: React.FC = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    fetchMembers();
    fetchCurrentUser();

    // Auto-refresh every 20 seconds
    const interval = setInterval(() => {
      fetchMembers();
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const fetchCurrentUser = () => {
    try {
      const token = localStorage.getItem("jwt");
      if (token) {
        const parts = token.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          setCurrentUserId(payload.id);
        }
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      // If token is invalid, user might need to re-login
    }
  };

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(
        "http://localhost:8000/api/v1/organizations/members",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (userId: number) => {
    if (!confirm("Are you sure you want to remove this team member?")) return;

    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(
        `http://localhost:8000/api/v1/organizations/remove-member/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchMembers();
      }
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        position: "relative",
      }}
    >
      {/* Background Grid Pattern */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(17, 17, 24, 0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "1.25rem 2rem",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <button
              onClick={() => navigate("/")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.25rem",
                background: "rgba(220, 38, 38, 0.15)",
                border: "1px solid rgba(220, 38, 38, 0.3)",
                borderRadius: "12px",
                color: "#dc2626",
                fontSize: "0.9375rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(220, 38, 38, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(220, 38, 38, 0.15)";
              }}
            >
              ← Back to Home
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #dc2626, #991b1b)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <UserGroupIcon
                  style={{ width: "24px", height: "24px", color: "white" }}
                />
              </div>
              <h1
                style={{
                  fontSize: "1.75rem",
                  fontWeight: "700",
                  color: "#f1f5f9",
                  letterSpacing: "-0.01em",
                }}
              >
                Team Members
              </h1>
            </div>
          </div>

          <button
            onClick={() => navigate("/organization-setup")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.5rem",
              background: "linear-gradient(135deg, #dc2626, #991b1b)",
              border: "none",
              borderRadius: "12px",
              color: "white",
              fontSize: "0.9375rem",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(220, 38, 38, 0.4)",
            }}
          >
            <PlusIcon style={{ width: "18px", height: "18px" }} />
            <span>Add Member</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "3rem 2rem",
        }}
      >
        {/* Stats */}
        <div
          style={{
            background: "rgba(17, 17, 24, 0.7)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "20px",
            padding: "2rem",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #dc2626, #991b1b)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
            }}
          >
            <UserGroupIcon
              style={{ width: "48px", height: "48px", color: "#dc2626" }}
            />
          </div>
          <div>
            <div
              style={{
                fontSize: "2.5rem",
                fontWeight: "700",
                color: "#f1f5f9",
                lineHeight: "1",
                marginBottom: "0.5rem",
              }}
            >
              {members.length}
            </div>
            <div
              style={{ fontSize: "1rem", color: "#94a3b8", fontWeight: "500" }}
            >
              Total Team Members
            </div>
          </div>
        </div>

        {/* Members List */}
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "4rem",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                border: "3px solid #1a1a24",
                borderTop: "3px solid #dc2626",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
          </div>
        ) : members.length === 0 ? (
          <div
            style={{
              background: "rgba(17, 17, 24, 0.7)",
              backdropFilter: "blur(16px)",
              border: "2px dashed rgba(255, 255, 255, 0.12)",
              borderRadius: "24px",
              padding: "5rem 2rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "88px",
                height: "88px",
                borderRadius: "22px",
                background: "linear-gradient(135deg, #dc2626, #991b1b)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.75rem",
                boxShadow: "0 12px 36px rgba(220, 38, 38, 0.35)",
              }}
            >
              <UserGroupIcon
                style={{ width: "48px", height: "48px", color: "white" }}
              />
            </div>
            <h3
              style={{
                fontSize: "1.625rem",
                fontWeight: "700",
                color: "#f1f5f9",
                marginBottom: "0.75rem",
              }}
            >
              No Team Members Yet
            </h3>
            <p
              style={{
                fontSize: "1.0625rem",
                color: "#94a3b8",
                marginBottom: "2.25rem",
              }}
            >
              Add team members to collaborate on projects
            </p>
            <button
              onClick={() => navigate("/organization-setup")}
              style={{
                padding: "1rem 2rem",
                background: "linear-gradient(135deg, #dc2626, #991b1b)",
                border: "none",
                borderRadius: "12px",
                color: "white",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(220, 38, 38, 0.4)",
              }}
            >
              Add First Member
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {members.map((member) => (
              <div
                key={member.id}
                style={{
                  background: "rgba(17, 17, 24, 0.7)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "20px",
                  padding: "1.5rem",
                  transition: "all 0.3s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      background: "linear-gradient(135deg, #dc2626, #991b1b)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "1.25rem",
                      fontWeight: "700",
                      flexShrink: 0,
                    }}
                  >
                    {member.username.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: "700",
                        color: "#f1f5f9",
                        marginBottom: "0.25rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {member.username}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.8125rem",
                        color: "#94a3b8",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {member.email}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      color: "#dc2626",
                      textTransform: "uppercase",
                      padding: "0.25rem 0.75rem",
                      background: "rgba(220, 38, 38, 0.15)",
                      borderRadius: "8px",
                    }}
                  >
                    {member.role}
                  </span>
                </div>

                {member.description && (
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#94a3b8",
                      marginBottom: "0.75rem",
                      lineHeight: "1.5",
                    }}
                  >
                    {member.description}
                  </p>
                )}

                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#64748b",
                    marginBottom: "1rem",
                  }}
                >
                  Invited by {member.invited_by} •{" "}
                  {new Date(member.joined_at).toLocaleDateString()}
                </div>

                {member.id !== currentUserId && (
                  <button
                    onClick={() => removeMember(member.id)}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      fontSize: "0.875rem",
                      background: "rgba(239, 68, 68, 0.15)",
                      color: "#ef4444",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontWeight: 600,
                      transition: "all 0.2s",
                    }}
                  >
                    Remove Member
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default TeamMembers;
