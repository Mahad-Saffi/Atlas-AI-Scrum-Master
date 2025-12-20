import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  BuildingOfficeIcon,
  ArrowLeftIcon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

const OrganizationSetup: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasOrganization, setHasOrganization] = useState(false);
  const [organization, setOrganization] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [showAddMember, setShowAddMember] = useState(false);

  const [orgForm, setOrgForm] = useState({
    name: "",
    description: "",
  });

  const [memberForm, setMemberForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "developer",
    description: "",
  });

  useEffect(() => {
    checkOrganization();
  }, []);

  const checkOrganization = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(
        "http://localhost:8000/api/v1/organizations/my-organization",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOrganization(data);
        setHasOrganization(true);
        fetchTeamMembers();
      } else {
        setHasOrganization(false);
      }
    } catch (error) {
      console.error("Error checking organization:", error);
      setHasOrganization(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
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
        setTeamMembers(data);
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(
        "http://localhost:8000/api/v1/organizations/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orgForm),
        }
      );

      if (response.ok) {
        await checkOrganization();
      } else {
        const error = await response.json();
        alert(error.detail || "Failed to create organization");
      }
    } catch (error) {
      console.error("Error creating organization:", error);
      alert("Failed to create organization");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(
        "http://localhost:8000/api/v1/organizations/add-member",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(memberForm),
        }
      );

      if (response.ok) {
        setMemberForm({
          username: "",
          email: "",
          password: "",
          role: "developer",
          description: "",
        });
        setShowAddMember(false);
        fetchTeamMembers();
      } else {
        const error = await response.json();
        alert(error.detail || "Failed to add team member");
      }
    } catch (error) {
      console.error("Error adding team member:", error);
      alert("Failed to add team member");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId: number) => {
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
        fetchTeamMembers();
      } else {
        const error = await response.json();
        alert(error.detail || "Failed to remove team member");
      }
    } catch (error) {
      console.error("Error removing team member:", error);
      alert("Failed to remove team member");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="spinner"
          style={{ width: "40px", height: "40px", borderWidth: "3px" }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        zIndex: 1,
        background: "#0a0a0f",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "1rem 2rem",
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(17, 17, 24, 0.7)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              onClick={() => navigate("/")}
              style={{
                padding: "0.75rem 1rem",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                color: "#f1f5f9",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <ArrowLeftIcon style={{ width: "20px", height: "20px" }} />
            </button>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "var(--radius-md)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <img
                src={logo}
                alt="Ideal Assistant"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <h1
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "#f1f5f9",
              }}
            >
              {hasOrganization ? "Team Management" : "Organization Setup"}
            </h1>
          </div>
        </div>
      </header>

      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        {!hasOrganization ? (
          <div
            style={{
              padding: "2rem",
              background: "rgba(17, 17, 24, 0.7)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "20px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  background: "linear-gradient(135deg, #dc2626, #991b1b)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                }}
              >
                <BuildingOfficeIcon
                  style={{ width: "48px", height: "48px", color: "white" }}
                />
              </div>
              <h2
                style={{
                  fontSize: "1.75rem",
                  fontWeight: "700",
                  color: "#f1f5f9",
                  marginBottom: "0.5rem",
                }}
              >
                Create Your Organization
              </h2>
              <p style={{ fontSize: "1rem", color: "#94a3b8" }}>
                Set up your organization to start managing projects and team
                members
              </p>
            </div>

            <form
              onSubmit={handleCreateOrganization}
              style={{ maxWidth: "500px", margin: "0 auto" }}
            >
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    color: "#f1f5f9",
                  }}
                >
                  Organization Name *
                </label>
                <input
                  type="text"
                  required
                  value={orgForm.name}
                  onChange={(e) =>
                    setOrgForm({ ...orgForm, name: e.target.value })
                  }
                  placeholder="Enter organization name"
                  style={{
                    width: "100%",
                    padding: "0.875rem 1rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "12px",
                    color: "#f1f5f9",
                    fontSize: "0.9375rem",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    color: "#f1f5f9",
                  }}
                >
                  Description
                </label>
                <input
                  type="text"
                  value={orgForm.description}
                  onChange={(e) =>
                    setOrgForm({ ...orgForm, description: e.target.value })
                  }
                  placeholder="What does your organization do?"
                  style={{
                    width: "100%",
                    padding: "0.875rem 1rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "12px",
                    color: "#f1f5f9",
                    fontSize: "0.9375rem",
                    outline: "none",
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "0.875rem",
                  background: loading
                    ? "rgba(220, 38, 38, 0.5)"
                    : "linear-gradient(135deg, #dc2626, #991b1b)",
                  border: "none",
                  borderRadius: "12px",
                  color: "white",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 16px rgba(220, 38, 38, 0.4)",
                }}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Organization"}
              </button>
            </form>
          </div>
        ) : (
          <>
            <div
              style={{
                marginBottom: "2rem",
                padding: "2rem",
                background: "rgba(17, 17, 24, 0.7)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "20px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "700",
                      color: "#f1f5f9",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {organization.name}
                  </h2>
                  <p style={{ fontSize: "0.9375rem", color: "#94a3b8" }}>
                    {organization.description || "No description"}
                  </p>
                </div>
                {organization.is_owner && (
                  <button
                    onClick={() => setShowAddMember(true)}
                    style={{
                      padding: "0.75rem 1.5rem",
                      background: "linear-gradient(135deg, #dc2626, #991b1b)",
                      border: "none",
                      borderRadius: "12px",
                      color: "white",
                      fontSize: "0.9375rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      boxShadow: "0 4px 16px rgba(220, 38, 38, 0.4)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <UserPlusIcon style={{ width: "20px", height: "20px" }} />
                    Add Team Member
                  </button>
                )}
              </div>
            </div>

            {showAddMember && (
              <div
                style={{
                  marginBottom: "2rem",
                  padding: "2rem",
                  background: "rgba(17, 17, 24, 0.7)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "20px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "1.5rem",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "700",
                      color: "#f1f5f9",
                    }}
                  >
                    Add New Team Member
                  </h3>
                  <button
                    onClick={() => setShowAddMember(false)}
                    style={{
                      padding: "0.5rem 1rem",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "12px",
                      color: "#f1f5f9",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleAddMember}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(250px, 1fr))",
                      gap: "1rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "0.5rem",
                          fontWeight: "600",
                          color: "#f1f5f9",
                          fontSize: "0.875rem",
                        }}
                      >
                        Username *
                      </label>
                      <input
                        type="text"
                        required
                        value={memberForm.username}
                        onChange={(e) =>
                          setMemberForm({
                            ...memberForm,
                            username: e.target.value,
                          })
                        }
                        placeholder="john_doe"
                        style={{
                          width: "100%",
                          padding: "0.75rem 1rem",
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          borderRadius: "12px",
                          color: "#f1f5f9",
                          fontSize: "0.9375rem",
                          outline: "none",
                        }}
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "0.5rem",
                          fontWeight: "600",
                          color: "#ECDFCC",
                          fontSize: "0.875rem",
                        }}
                      >
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={memberForm.email}
                        onChange={(e) =>
                          setMemberForm({
                            ...memberForm,
                            email: e.target.value,
                          })
                        }
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "0.5rem",
                          fontWeight: "600",
                          color: "#ECDFCC",
                          fontSize: "0.875rem",
                        }}
                      >
                        Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={memberForm.password}
                        onChange={(e) =>
                          setMemberForm({
                            ...memberForm,
                            password: e.target.value,
                          })
                        }
                        placeholder="••••••••"
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "0.5rem",
                          fontWeight: "600",
                          color: "#ECDFCC",
                          fontSize: "0.875rem",
                        }}
                      >
                        Role *
                      </label>
                      <select
                        required
                        value={memberForm.role}
                        onChange={(e) =>
                          setMemberForm({ ...memberForm, role: e.target.value })
                        }
                      >
                        <option value="developer">Developer</option>
                        <option value="designer">Designer</option>
                        <option value="qa">QA Engineer</option>
                        <option value="manager">Manager</option>
                        <option value="product_owner">Product Owner</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        fontWeight: "600",
                        color: "#ECDFCC",
                        fontSize: "0.875rem",
                      }}
                    >
                      Description
                    </label>
                    <input
                      type="text"
                      value={memberForm.description}
                      onChange={(e) =>
                        setMemberForm({
                          ...memberForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="What will they work on?"
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      padding: "0.75rem 2rem",
                      background: loading
                        ? "rgba(220, 38, 38, 0.5)"
                        : "linear-gradient(135deg, #dc2626, #991b1b)",
                      border: "none",
                      borderRadius: "12px",
                      color: "white",
                      fontSize: "0.9375rem",
                      fontWeight: 600,
                      cursor: loading ? "not-allowed" : "pointer",
                      boxShadow: "0 4px 16px rgba(220, 38, 38, 0.4)",
                    }}
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add Member"}
                  </button>
                </form>
              </div>
            )}

            <div
              style={{
                padding: "2rem",
                background: "rgba(17, 17, 24, 0.7)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "20px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
              }}
            >
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "700",
                  color: "#f1f5f9",
                  marginBottom: "1.5rem",
                }}
              >
                Team Members ({teamMembers.length})
              </h3>

              <div style={{ display: "grid", gap: "1rem" }}>
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    style={{
                      padding: "1rem",
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(10px)",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          background:
                            "linear-gradient(135deg, #dc2626, #991b1b)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "1.25rem",
                          fontWeight: "700",
                        }}
                      >
                        {member.username.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginBottom: "0.25rem",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "1rem",
                              fontWeight: "600",
                              color: "#f1f5f9",
                            }}
                          >
                            {member.username}
                          </span>
                          <span
                            style={{
                              padding: "0.25rem 0.75rem",
                              background: "rgba(220, 38, 38, 0.2)",
                              color: "#fca5a5",
                              borderRadius: "12px",
                              fontSize: "0.75rem",
                              fontWeight: "600",
                            }}
                          >
                            {member.role}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.875rem", color: "#94a3b8" }}>
                          {member.email}
                        </div>
                        {member.description && (
                          <div
                            style={{
                              fontSize: "0.8125rem",
                              color: "#94a3b8",
                              marginTop: "0.25rem",
                            }}
                          >
                            {member.description}
                          </div>
                        )}
                      </div>
                    </div>
                    {organization.is_owner && member.role !== "owner" && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        style={{
                          padding: "0.5rem 1rem",
                          fontSize: "0.875rem",
                          background: "rgba(239, 68, 68, 0.1)",
                          border: "1px solid rgba(239, 68, 68, 0.3)",
                          borderRadius: "12px",
                          color: "#fca5a5",
                          cursor: "pointer",
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {teamMembers.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    color: "#94a3b8",
                  }}
                >
                  No team members yet. Add your first team member to get
                  started!
                </div>
              )}
            </div>

            <div style={{ marginTop: "2rem", textAlign: "center" }}>
              <button
                onClick={() => navigate("/")}
                style={{
                  padding: "0.875rem 2rem",
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
                Go to Dashboard
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default OrganizationSetup;
