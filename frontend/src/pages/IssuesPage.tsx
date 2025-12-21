import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../components/Toast";

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

      // Auto-refresh every 15 seconds
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

      // Build request body, only include task_id if it has a value
      const requestBody: any = {
        project_id: projectId,
        title: issueForm.title,
        description: issueForm.description,
        issue_type: issueForm.issue_type,
        priority: issueForm.priority,
      };

      // Only add task_id if it's not empty
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
    const resolution = prompt("Enter resolution details:");
    if (!resolution) return;

    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(
        `http://localhost:8000/api/v1/issues/${issueId}/resolve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ resolution }),
        }
      );

      if (response.ok) {
        showToast("Issue resolved successfully!", "success");
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
        return "BLK";
      case "bug":
        return "BUG";
      case "question":
        return "Q";
      default:
        return "ISS";
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
        return "#697565";
      default:
        return "#697565";
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
        return "#697565";
      default:
        return "#697565";
    }
  };

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
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              onClick={() => navigate(`/project/${projectId}`)}
              className="btn-secondary"
              style={{ padding: "0.5rem 1rem" }}
            >
              Back
            </button>
            <div
              style={{
                width: "32px",
                height: "32px",
                background: "linear-gradient(135deg, #697565 0%, #3C3D37 100%)",
                borderRadius: "var(--radius-md)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.625rem",
                fontWeight: "bold",
                color: "#f5f5f5",
              }}
            >
              BUG
            </div>
            <h1
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "#ECDFCC",
              }}
            >
              Issues & Bugs
            </h1>
          </div>
          <button
            id="btn-report-issue"
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
            style={{ padding: "0.75rem 1.5rem" }}
          >
            + Report Issue
          </button>
        </div>
      </header>

      <main
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "2rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Filter Bar */}
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
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontWeight: "600", color: "#ECDFCC" }}>Filter:</span>
            {["all", "open", "in_progress", "resolved", "closed"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={
                    filterStatus === status ? "btn-primary" : "btn-secondary"
                  }
                  style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}
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
                  color: "#ECDFCC",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                Report New Issue
              </h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="btn-secondary"
                style={{ padding: "0.5rem 1rem" }}
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
                    color: "#f5f5f5",
                    fontSize: "0.875rem",
                  }}
                >
                  Title *
                </label>
                <input
                  id="input-issue-title"
                  type="text"
                  required
                  value={issueForm.title}
                  onChange={(e) =>
                    setIssueForm({ ...issueForm, title: e.target.value })
                  }
                  placeholder="Brief description of the issue"
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    color: "#f5f5f5",
                    fontSize: "0.875rem",
                  }}
                >
                  Description *
                </label>
                <textarea
                  id="input-issue-description"
                  required
                  value={issueForm.description}
                  onChange={(e) =>
                    setIssueForm({ ...issueForm, description: e.target.value })
                  }
                  placeholder="Detailed description of the issue"
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "1em",
                    borderRadius: "8px",
                    border: "1px solid rgba(236, 223, 204, 0.3)",
                    backgroundColor: "#1a1a1a",
                    color: "#f5f5f5",
                    fontFamily: "inherit",
                    fontSize: "0.9375rem",
                    boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.4)",
                    resize: "vertical",
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
                      color: "#f5f5f5",
                      fontSize: "0.875rem",
                    }}
                  >
                    Type *
                  </label>
                  <select
                    id="select-issue-type"
                    required
                    value={issueForm.issue_type}
                    onChange={(e) =>
                      setIssueForm({ ...issueForm, issue_type: e.target.value })
                    }
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
                      color: "#f5f5f5",
                      fontSize: "0.875rem",
                    }}
                  >
                    Priority *
                  </label>
                  <select
                    id="select-issue-priority"
                    required
                    value={issueForm.priority}
                    onChange={(e) =>
                      setIssueForm({ ...issueForm, priority: e.target.value })
                    }
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <button
                id="btn-submit-issue"
                type="submit"
                className="btn-primary"
                style={{ padding: "0.75rem 2rem" }}
                disabled={loading}
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
              className="spinner"
              style={{ width: "40px", height: "40px", borderWidth: "3px" }}
            />
          </div>
        ) : issues.length === 0 ? (
          <div
            className="card-glass-solid"
            style={{
              padding: "4rem 2rem",
              textAlign: "center",
              border: "2px dashed rgba(236, 223, 204, 0.4)",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                background: "linear-gradient(135deg, #697565 0%, #3C3D37 100%)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
                fontWeight: "bold",
                color: "#f5f5f5",
                margin: "0 auto 1.5rem",
              }}
            >
              OK
            </div>
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#f5f5f5",
                marginBottom: "0.75rem",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              No issues found
            </h3>
            <p style={{ fontSize: "1rem", color: "#a0a0a0" }}>
              {filterStatus === "all"
                ? "Great! No issues reported yet."
                : `No ${filterStatus.replace("_", " ")} issues.`}
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1.25rem" }}>
            {issues.map((issue) => (
              <div key={issue.id} className="card-glass-solid">
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
                      <span
                        style={{
                          fontSize: "0.625rem",
                          fontWeight: "bold",
                          padding: "0.25rem 0.5rem",
                          background: "rgba(236, 223, 204, 0.2)",
                          borderRadius: "4px",
                          color: "#f5f5f5",
                        }}
                      >
                        {getIssueTypeIcon(issue.issue_type)}
                      </span>
                      <h3
                        style={{
                          fontSize: "1.125rem",
                          fontWeight: "700",
                          color: "#ECDFCC",
                          flex: 1,
                          textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                        }}
                      >
                        {issue.title}
                      </h3>
                      <span
                        style={{
                          padding: "0.25rem 0.75rem",
                          background: getStatusColor(issue.status),
                          color: "#ECDFCC",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                        }}
                      >
                        {issue.status.replace("_", " ").toUpperCase()}
                      </span>
                      <span
                        style={{
                          padding: "0.25rem 0.75rem",
                          background: getPriorityColor(issue.priority),
                          color: "#ECDFCC",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                        }}
                      >
                        {issue.priority.toUpperCase()}
                      </span>
                    </div>

                    <p
                      style={{
                        fontSize: "0.9375rem",
                        color: "#ECDFCC",
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
                        color: "#a0a0a0",
                      }}
                    >
                      <span>
                        {new Date(issue.created_at).toLocaleDateString()}
                      </span>
                      {issue.reporter_username && (
                        <span>Reported by: {issue.reporter_username}</span>
                      )}
                      {issue.assignee_username && (
                        <span>Assigned to: {issue.assignee_username}</span>
                      )}
                    </div>

                    {issue.resolution && (
                      <div
                        style={{
                          marginTop: "1rem",
                          padding: "0.75rem",
                          background: "rgba(16, 185, 129, 0.1)",
                          borderRadius: "8px",
                          borderLeft: "3px solid #10b981",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.8125rem",
                            fontWeight: "600",
                            color: "#ECDFCC",
                            marginBottom: "0.25rem",
                          }}
                        >
                          Resolution:
                        </div>
                        <div style={{ fontSize: "0.875rem", color: "#ECDFCC" }}>
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
                          handleAssignIssue(issue.id, parseInt(e.target.value))
                        }
                        style={{
                          padding: "0.5rem 1rem",
                          fontSize: "0.875rem",
                          borderRadius: "0.5em",
                          border: "1px solid #697565",
                          background: "#ECDFCC",
                          color: "#181C14",
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
                          className="btn-primary"
                          style={{
                            padding: "0.5rem 1rem",
                            fontSize: "0.875rem",
                          }}
                        >
                          Resolve
                        </button>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default IssuesPage;
