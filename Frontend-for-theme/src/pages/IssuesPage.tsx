import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../components/Toast";
import {
  BugAntIcon,
  ShieldExclamationIcon,
  QuestionMarkCircleIcon,
  CalendarIcon,
  UserIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

interface Issue {
  id: number;
  project_id: string;
  task_id?: string;
  reporter_id: number;
  assignee_id?: number;
  title: string;
  description: string;
  issue_type: string;
  priority: string;
  status: string;
  resolution?: string;
  created_at: string;
  updated_at?: string;
  resolved_at?: string;
  reporter_username?: string;
  assignee_username?: string;
}

interface TeamMember {
  id: number;
  username: string;
  email: string;
  role: string;
}

const IssuesPage: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { showToast } = useToast();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);
  const [resolutionText, setResolutionText] = useState("");

  const [issueForm, setIssueForm] = useState({
    title: "",
    description: "",
    issue_type: "bug",
    priority: "medium",
    task_id: "",
  });

  useEffect(() => {
    if (projectId) {
      fetchIssues();
      fetchTeamMembers();

      const interval = setInterval(() => {
        fetchIssues();
      }, 15000);

      return () => clearInterval(interval);
    }
  }, [projectId, filterStatus]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("jwt");
      const statusParam =
        filterStatus !== "all" ? `?status=${filterStatus}` : "";
      const response = await fetch(
        `http://localhost:8000/api/v1/issues/project/${projectId}${statusParam}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIssues(data);
      }
    } catch (error) {
      console.error("Error fetching issues:", error);
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

  const handleCreateIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("jwt");
      const requestBody: any = {
        project_id: projectId,
        title: issueForm.title,
        description: issueForm.description,
        issue_type: issueForm.issue_type,
        priority: issueForm.priority,
      };

      if (issueForm.task_id && issueForm.task_id.trim()) {
        requestBody.task_id = issueForm.task_id;
      }

      const response = await fetch("http://localhost:8000/api/v1/issues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        setIssueForm({
          title: "",
          description: "",
          issue_type: "bug",
          priority: "medium",
          task_id: "",
        });
        setShowCreateForm(false);
        showToast("Issue created successfully!", "success");
        fetchIssues();
      } else {
        const error = await response.json();
        const errorMessage =
          typeof error.detail === "string"
            ? error.detail
            : JSON.stringify(error.detail) || "Failed to create issue";
        showToast(errorMessage, "error");
      }
    } catch (error: any) {
      console.error("Error creating issue:", error);
      const errorMessage = error?.message || "Failed to create issue";
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignIssue = async (issueId: number, assigneeId: number) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(
        `http://localhost:8000/api/v1/issues/${issueId}/assign`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ assignee_id: assigneeId }),
        }
      );

      if (response.ok) {
        showToast("Issue assigned successfully!", "success");
        fetchIssues();
      }
    } catch (error) {
      console.error("Error assigning issue:", error);
      showToast("Failed to assign issue", "error");
    }
  };

  const handleResolveIssue = async (issueId: number) => {
    setSelectedIssueId(issueId);
    setShowResolveModal(true);
  };

  const submitResolution = async () => {
    if (!resolutionText.trim() || !selectedIssueId) return;

    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(
        `http://localhost:8000/api/v1/issues/${selectedIssueId}/resolve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ resolution: resolutionText }),
        }
      );

      if (response.ok) {
        showToast("Issue resolved successfully!", "success");
        setShowResolveModal(false);
        setResolutionText("");
        setSelectedIssueId(null);
        fetchIssues();
      }
    } catch (error) {
      console.error("Error resolving issue:", error);
      showToast("Failed to resolve issue", "error");
    }
  };

  const getIssueTypeIcon = (type: string) => {
    switch (type) {
      case "blocker":
        return ShieldExclamationIcon;
      case "bug":
        return BugAntIcon;
      case "question":
        return QuestionMarkCircleIcon;
      default:
        return BugAntIcon;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "#ef4444";
      case "high":
        return "#f59e0b";
      case "medium":
        return "#3b82f6";
      case "low":
        return "#64748b";
      default:
        return "#64748b";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "#ef4444";
      case "in_progress":
        return "#f59e0b";
      case "resolved":
        return "#10b981";
      case "closed":
        return "#64748b";
      default:
        return "#64748b";
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
              onClick={() => navigate(`/project/${projectId}`)}
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
              ← Back to Project
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
                <BugAntIcon
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
                Issues & Bugs
              </h1>
            </div>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
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
            }}
          >
            + Report Issue
          </button>
        </div>
      </header>

      <main
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "3rem 2rem",
        }}
      >
        {/* Filter Bar */}
        <div
          style={{
            background: "rgba(17, 17, 24, 0.7)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontWeight: "600", color: "#f1f5f9" }}>Filter:</span>
            {["all", "open", "in_progress", "resolved", "closed"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  style={{
                    padding: "0.625rem 1.25rem",
                    background:
                      filterStatus === status
                        ? "linear-gradient(135deg, #dc2626, #991b1b)"
                        : "rgba(255, 255, 255, 0.05)",
                    border:
                      filterStatus === status
                        ? "none"
                        : "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "12px",
                    color: filterStatus === status ? "white" : "#f1f5f9",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {status.replace("_", " ").toUpperCase()}
                </button>
              )
            )}
          </div>
        </div>

        {/* Create Issue Form */}
        {showCreateForm && (
          <div
            style={{
              background: "rgba(17, 17, 24, 0.7)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "20px",
              padding: "2rem",
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
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#f1f5f9",
                }}
              >
                Report New Issue
              </h3>
              <button
                onClick={() => setShowCreateForm(false)}
                style={{
                  padding: "0.625rem 1.25rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  color: "#f1f5f9",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateIssue}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    color: "#f1f5f9",
                    fontSize: "0.875rem",
                  }}
                >
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={issueForm.title}
                  onChange={(e) =>
                    setIssueForm({ ...issueForm, title: e.target.value })
                  }
                  placeholder="Brief description of the issue"
                  style={{
                    width: "100%",
                    padding: "0.875rem 1rem",
                    background: "rgba(10, 10, 15, 0.6)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "12px",
                    color: "#f1f5f9",
                    fontSize: "0.9375rem",
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
                    fontSize: "0.875rem",
                  }}
                >
                  Description *
                </label>
                <textarea
                  required
                  value={issueForm.description}
                  onChange={(e) =>
                    setIssueForm({ ...issueForm, description: e.target.value })
                  }
                  placeholder="Detailed description of the issue"
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "0.875rem 1rem",
                    background: "rgba(10, 10, 15, 0.6)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "12px",
                    color: "#f1f5f9",
                    fontSize: "0.9375rem",
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
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
                    Type *
                  </label>
                  <select
                    required
                    value={issueForm.issue_type}
                    onChange={(e) =>
                      setIssueForm({ ...issueForm, issue_type: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "0.875rem 1rem",
                      background: "rgba(10, 10, 15, 0.6)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "12px",
                      color: "#f1f5f9",
                      fontSize: "0.9375rem",
                      cursor: "pointer",
                    }}
                  >
                    <option value="bug">Bug</option>
                    <option value="blocker">Blocker</option>
                    <option value="question">Question</option>
                  </select>
                </div>

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
                    Priority *
                  </label>
                  <select
                    required
                    value={issueForm.priority}
                    onChange={(e) =>
                      setIssueForm({ ...issueForm, priority: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "0.875rem 1rem",
                      background: "rgba(10, 10, 15, 0.6)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "12px",
                      color: "#f1f5f9",
                      fontSize: "0.9375rem",
                      cursor: "pointer",
                    }}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "0.875rem 2rem",
                  background: "linear-gradient(135deg, #dc2626, #991b1b)",
                  border: "none",
                  borderRadius: "12px",
                  color: "white",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                  boxShadow: "0 4px 16px rgba(220, 38, 38, 0.4)",
                }}
              >
                {loading ? "Creating..." : "Create Issue"}
              </button>
            </form>
          </div>
        )}

        {/* Issues List */}
        {loading && !showCreateForm ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
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
        ) : issues.length === 0 ? (
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
                background: "linear-gradient(135deg, #22c55e, #15803d)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.75rem",
                boxShadow: "0 12px 36px rgba(34, 197, 94, 0.35)",
              }}
            >
              <CheckCircleIcon
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
              No issues found
            </h3>
            <p style={{ fontSize: "1.0625rem", color: "#94a3b8" }}>
              {filterStatus === "all"
                ? "Great! No issues reported yet."
                : `No ${filterStatus.replace("_", " ")} issues.`}
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1.5rem" }}>
            {issues.map((issue) => {
              const TypeIcon = getIssueTypeIcon(issue.issue_type);
              return (
                <div
                  key={issue.id}
                  style={{
                    background: "rgba(17, 17, 24, 0.7)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "20px",
                    padding: "2rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "1rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: "300px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          marginBottom: "0.75rem",
                        }}
                      >
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "12px",
                            background: `${getPriorityColor(issue.priority)}20`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <TypeIcon
                            style={{
                              width: "24px",
                              height: "24px",
                              color: getPriorityColor(issue.priority),
                            }}
                          />
                        </div>
                        <h3
                          style={{
                            fontSize: "1.25rem",
                            fontWeight: "700",
                            color: "#f1f5f9",
                            flex: 1,
                          }}
                        >
                          {issue.title}
                        </h3>
                        <span
                          style={{
                            padding: "0.375rem 0.875rem",
                            background: `${getStatusColor(issue.status)}20`,
                            color: getStatusColor(issue.status),
                            borderRadius: "12px",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                            border: `1px solid ${getStatusColor(
                              issue.status
                            )}40`,
                          }}
                        >
                          {issue.status.replace("_", " ").toUpperCase()}
                        </span>
                        <span
                          style={{
                            padding: "0.375rem 0.875rem",
                            background: `${getPriorityColor(issue.priority)}20`,
                            color: getPriorityColor(issue.priority),
                            borderRadius: "12px",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                            border: `1px solid ${getPriorityColor(
                              issue.priority
                            )}40`,
                          }}
                        >
                          {issue.priority.toUpperCase()}
                        </span>
                      </div>

                      <p
                        style={{
                          fontSize: "1rem",
                          color: "#94a3b8",
                          marginBottom: "1rem",
                          lineHeight: "1.6",
                        }}
                      >
                        {issue.description}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1.5rem",
                          fontSize: "0.875rem",
                          color: "#64748b",
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <CalendarIcon
                            style={{ width: "16px", height: "16px" }}
                          />
                          {new Date(issue.created_at).toLocaleDateString()}
                        </span>
                        {issue.reporter_username && (
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <UserIcon
                              style={{ width: "16px", height: "16px" }}
                            />
                            Reported by: {issue.reporter_username}
                          </span>
                        )}
                        {issue.assignee_username && (
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <UserIcon
                              style={{ width: "16px", height: "16px" }}
                            />
                            Assigned to: {issue.assignee_username}
                          </span>
                        )}
                      </div>

                      {issue.resolution && (
                        <div
                          style={{
                            marginTop: "1rem",
                            padding: "1rem",
                            background: "rgba(34, 197, 94, 0.1)",
                            borderRadius: "12px",
                            borderLeft: "3px solid #22c55e",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "0.875rem",
                              fontWeight: "600",
                              color: "#22c55e",
                              marginBottom: "0.5rem",
                            }}
                          >
                            Resolution:
                          </div>
                          <div
                            style={{ fontSize: "0.9375rem", color: "#94a3b8" }}
                          >
                            {issue.resolution}
                          </div>
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "0.75rem",
                        flexWrap: "wrap",
                      }}
                    >
                      {issue.status === "open" && !issue.assignee_id && (
                        <select
                          onChange={(e) =>
                            handleAssignIssue(
                              issue.id,
                              parseInt(e.target.value)
                            )
                          }
                          style={{
                            padding: "0.625rem 1rem",
                            fontSize: "0.875rem",
                            borderRadius: "12px",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            background: "rgba(255, 255, 255, 0.05)",
                            color: "#f1f5f9",
                            cursor: "pointer",
                          }}
                        >
                          <option value="">Assign to...</option>
                          {teamMembers.map((member) => (
                            <option key={member.id} value={member.id}>
                              {member.username}
                            </option>
                          ))}
                        </select>
                      )}

                      {issue.status !== "resolved" &&
                        issue.status !== "closed" && (
                          <button
                            onClick={() => handleResolveIssue(issue.id)}
                            style={{
                              padding: "0.625rem 1.25rem",
                              background:
                                "linear-gradient(135deg, #22c55e, #15803d)",
                              border: "none",
                              borderRadius: "12px",
                              color: "white",
                              fontSize: "0.875rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <CheckCircleIcon
                              style={{ width: "16px", height: "16px" }}
                            />
                            Resolve
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Resolution Modal */}
      {showResolveModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(10, 10, 15, 0.8)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => {
            setShowResolveModal(false);
            setResolutionText("");
            setSelectedIssueId(null);
          }}
        >
          <div
            style={{
              maxWidth: "500px",
              width: "100%",
              margin: "1rem",
              background: "rgba(17, 17, 24, 0.95)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "20px",
              padding: "2rem",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckCircleIcon
                  style={{ width: "28px", height: "28px", color: "white" }}
                />
              </div>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#f1f5f9",
                  margin: 0,
                }}
              >
                Resolve Issue
              </h2>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#f1f5f9",
                  marginBottom: "0.5rem",
                }}
              >
                Resolution Details
              </label>
              <textarea
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                placeholder="Describe how this issue was resolved..."
                rows={5}
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  color: "#f1f5f9",
                  fontSize: "0.9375rem",
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => {
                  setShowResolveModal(false);
                  setResolutionText("");
                  setSelectedIssueId(null);
                }}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  color: "#f1f5f9",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.05)";
                }}
              >
                Cancel
              </button>
              <button
                onClick={submitResolution}
                disabled={!resolutionText.trim()}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: resolutionText.trim()
                    ? "linear-gradient(135deg, #10b981, #059669)"
                    : "rgba(16, 185, 129, 0.3)",
                  border: "none",
                  borderRadius: "12px",
                  color: "white",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  cursor: resolutionText.trim() ? "pointer" : "not-allowed",
                  boxShadow: resolutionText.trim()
                    ? "0 4px 16px rgba(16, 185, 129, 0.4)"
                    : "none",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
                onMouseEnter={(e) => {
                  if (resolutionText.trim()) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 20px rgba(16, 185, 129, 0.5)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = resolutionText.trim()
                    ? "0 4px 16px rgba(16, 185, 129, 0.4)"
                    : "none";
                }}
              >
                <CheckCircleIcon style={{ width: "18px", height: "18px" }} />
                <span>Mark as Resolved</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default IssuesPage;
