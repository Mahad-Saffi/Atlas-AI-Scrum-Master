import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import theme from "../styles/theme";

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
    <div style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
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
              className="btn-secondary"
              style={{ padding: "0.5rem 1rem" }}
            >
              Back
            </button>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: theme.borderRadius.md,
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
                color: theme.colors.text.primary,
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
          <div className="card-glass-solid">
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  background: theme.colors.brand.redGradient,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  color: theme.colors.text.primary,
                  margin: "0 auto 1rem",
                }}
              >
                ORG
              </div>
              <h2
                style={{
                  fontSize: "1.75rem",
                  fontWeight: "700",
                  color: theme.colors.text.primary,
                  marginBottom: "0.5rem",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                Create Your Organization
              </h2>
              <p
                style={{ fontSize: "1rem", color: theme.colors.text.secondary }}
              >
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
                    color: theme.colors.text.primary,
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
                  style={{ width: "100%" }}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    color: theme.colors.text.primary,
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
                  style={{ width: "100%" }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: "100%", padding: "0.875rem" }}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Organization"}
              </button>
            </form>
          </div>
        ) : (
          <>
            <div
              className="card-glass-solid"
              style={{
                marginBottom: "2rem",
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
                      color: theme.colors.text.primary,
                      marginBottom: "0.25rem",
                      textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                    }}
                  >
                    {organization.name}
                  </h2>
                  <p
                    style={{
                      fontSize: "0.9375rem",
                      color: theme.colors.text.primary,
                    }}
                  >
                    {organization.description || "No description"}
                  </p>
                </div>
                {organization.is_owner && (
                  <button
                    id="btn-add-team-member"
                    onClick={() => setShowAddMember(true)}
                    className="btn-primary"
                    style={{ padding: "0.75rem 1.5rem" }}
                  >
                    + Add Team Member
                  </button>
                )}
              </div>
            </div>

            {showAddMember && (
              <div
                className="card-glass-solid"
                style={{
                  marginBottom: "2rem",
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
                      color: theme.colors.text.primary,
                      textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                    }}
                  >
                    Add New Team Member
                  </h3>
                  <button
                    onClick={() => setShowAddMember(false)}
                    className="btn-secondary"
                    style={{ padding: "0.5rem 1rem" }}
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
                          color: theme.colors.text.primary,
                          fontSize: "0.875rem",
                        }}
                      >
                        Username *
                      </label>
                      <input
                        id="input-member-username"
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
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "0.5rem",
                          fontWeight: "600",
                          color: theme.colors.text.primary,
                          fontSize: "0.875rem",
                        }}
                      >
                        Email *
                      </label>
                      <input
                        id="input-member-email"
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
                          color: theme.colors.text.primary,
                          fontSize: "0.875rem",
                        }}
                      >
                        Password *
                      </label>
                      <input
                        id="input-member-password"
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
                          color: theme.colors.text.primary,
                          fontSize: "0.875rem",
                        }}
                      >
                        Role *
                      </label>
                      <select
                        id="select-member-role"
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
                        color: theme.colors.text.primary,
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
                    id="btn-submit-member"
                    type="submit"
                    className="btn-primary"
                    style={{ padding: "0.75rem 2rem" }}
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add Member"}
                  </button>
                </form>
              </div>
            )}

            <div className="card-glass-solid">
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "700",
                  color: theme.colors.text.primary,
                  marginBottom: "1.5rem",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
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
                      background: "rgba(236, 223, 204, 0.15)",
                      backdropFilter: "blur(10px)",
                      borderRadius: "8px",
                      border: "1px solid rgba(236, 223, 204, 0.3)",
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
                          background: theme.colors.brand.redGradient,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: theme.colors.text.primary,
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
                              color: theme.colors.text.primary,
                            }}
                          >
                            {member.username}
                          </span>
                          <span
                            style={{
                              padding: "0.25rem 0.75rem",
                              background: "rgba(236, 223, 204, 0.3)",
                              color: theme.colors.text.primary,
                              borderRadius: "12px",
                              fontSize: "0.75rem",
                              fontWeight: "600",
                            }}
                          >
                            {member.role}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: "0.875rem",
                            color: theme.colors.text.primary,
                          }}
                        >
                          {member.email}
                        </div>
                        {member.description && (
                          <div
                            style={{
                              fontSize: "0.8125rem",
                              color: theme.colors.text.primary,
                              marginTop: "0.25rem",
                              opacity: 0.9,
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
                        className="btn-secondary"
                        style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}
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
                    color: theme.colors.text.primary,
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
                className="btn-primary"
                style={{ padding: "0.875rem 2rem" }}
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
