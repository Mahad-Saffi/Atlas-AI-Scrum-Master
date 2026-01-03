import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import theme from "../styles/theme";

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
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Header */}
      <header
        className="glass-header"
        style={{
          padding: "1rem 2rem",
          position: "sticky",
          top: 0,
          zIndex: 100,
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
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              onClick={() => navigate("/")}
              className="btn-secondary"
              style={{ padding: "0.5rem 1rem" }}
            >
              Back
            </button>
            <div
              style={{
                width: "32px",
                height: "32px",
                background: theme.colors.brand.redGradient,
                borderRadius: "var(--radius-md)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.625rem",
                fontWeight: "bold",
                color: theme.colors.text.primary,
              }}
            >
              TEAM
            </div>
            <h1
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: theme.colors.text.primary,
              }}
            >
              Team Members
            </h1>
          </div>

          <button
            id="btn-add-member"
            onClick={() => navigate("/organization-setup")}
            className="btn-primary"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span>+</span>
            <span>Add Member</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "2rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Stats */}
        <div
          className="card"
          style={{
            padding: "1.25rem 1.5rem",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: theme.colors.brand.redGradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: theme.colors.text.primary,
              fontWeight: "bold",
              fontSize: "0.75rem",
            }}
          >
            TEAM
          </div>
          <div>
            <div
              style={{
                fontSize: "1.75rem",
                fontWeight: "700",
                color: "#f5f5f5",
                lineHeight: "1",
                marginBottom: "0.375rem",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              {members.length}
            </div>
            <div
              style={{
                fontSize: "0.875rem",
                color: "#a0a0a0",
                fontWeight: "500",
              }}
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
              className="spinner"
              style={{ width: "40px", height: "40px" }}
            />
          </div>
        ) : members.length === 0 ? (
          <div
            className="card-glass-solid"
            style={{
              padding: "4rem 2rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                background: "rgba(236, 223, 204, 0.1)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
                border: "1px solid rgba(236, 223, 204, 0.2)",
              }}
            >
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "#a0a0a0",
                  fontWeight: "bold",
                }}
              >
                TEAM
              </span>
            </div>
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#f5f5f5",
                marginBottom: "0.5rem",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              No Team Members Yet
            </h3>
            <p
              style={{
                fontSize: "1rem",
                color: "#a0a0a0",
                marginBottom: "2rem",
              }}
            >
              Add team members to collaborate on projects
            </p>
            <button
              onClick={() => navigate("/organization-setup")}
              className="btn-primary"
            >
              Add First Member
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {members.map((member) => (
              <div key={member.id} className="card">
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
                      background: theme.colors.brand.redGradient,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: theme.colors.text.primary,
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
                        color: theme.colors.text.primary,
                        marginBottom: "0.25rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                      }}
                    >
                      {member.username}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.8125rem",
                        color: theme.colors.text.primary,
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
                      color: theme.colors.text.primary,
                      textTransform: "uppercase",
                      padding: "0.25rem 0.75rem",
                      background: "rgba(220, 38, 38, 0.2)",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    {member.role}
                  </span>
                </div>

                {member.description && (
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: theme.colors.text.primary,
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
                    color: theme.colors.text.primary,
                    marginBottom: "1rem",
                  }}
                >
                  Invited by {member.invited_by} •{" "}
                  {new Date(member.joined_at).toLocaleDateString()}
                </div>

                {member.id !== currentUserId && (
                  <button
                    onClick={() => removeMember(member.id)}
                    className="btn-secondary"
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      fontSize: "0.875rem",
                      background: "rgba(239, 68, 68, 0.1)",
                      color: "#dc2626",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
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
    </div>
  );
};

export default TeamMembers;
