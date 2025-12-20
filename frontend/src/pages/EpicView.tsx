import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  BookOpenIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

interface Task {
  id: string;
  title: string;
  status: string;
  assignee_id?: number;
  progress_percentage: number;
}

interface Story {
  id: string;
  name: string;
  description: string;
  order: number;
  tasks: Task[];
}

interface Epic {
  id: string;
  name: string;
  description: string;
  order: number;
  stories: Story[];
}

const EpicView: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [epics, setEpics] = useState<Epic[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedEpics, setExpandedEpics] = useState<Set<string>>(new Set());
  const [expandedStories, setExpandedStories] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (projectId) {
      fetchEpics();

      const interval = setInterval(() => {
        fetchEpics();
      }, 15000);

      return () => clearInterval(interval);
    }
  }, [projectId]);

  const fetchEpics = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(
        `http://localhost:8000/api/v1/projects/${projectId}/epics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setEpics(data);
        if (data.length > 0 && expandedEpics.size === 0) {
          setExpandedEpics(new Set([data[0].id]));
        }
      }
    } catch (error) {
      console.error("Error fetching epics:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleEpic = (epicId: string) => {
    const newExpanded = new Set(expandedEpics);
    if (newExpanded.has(epicId)) {
      newExpanded.delete(epicId);
    } else {
      newExpanded.add(epicId);
    }
    setExpandedEpics(newExpanded);
  };

  const toggleStory = (storyId: string) => {
    const newExpanded = new Set(expandedStories);
    if (newExpanded.has(storyId)) {
      newExpanded.delete(storyId);
    } else {
      newExpanded.add(storyId);
    }
    setExpandedStories(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Done":
        return {
          bg: "rgba(34, 197, 94, 0.15)",
          border: "rgba(34, 197, 94, 0.3)",
          text: "#22c55e",
        };
      case "In Progress":
        return {
          bg: "rgba(245, 158, 11, 0.15)",
          border: "rgba(245, 158, 11, 0.3)",
          text: "#f59e0b",
        };
      default:
        return {
          bg: "rgba(100, 116, 139, 0.15)",
          border: "rgba(100, 116, 139, 0.3)",
          text: "#64748b",
        };
    }
  };

  const calculateEpicProgress = (epic: Epic) => {
    const allTasks = epic.stories.flatMap((s) => s.tasks);
    if (allTasks.length === 0) return 0;

    const completedTasks = allTasks.filter((t) => t.status === "Done").length;
    return Math.round((completedTasks / allTasks.length) * 100);
  };

  const calculateStoryProgress = (story: Story) => {
    if (story.tasks.length === 0) return 0;

    const completedTasks = story.tasks.filter(
      (t) => t.status === "Done"
    ).length;
    return Math.round((completedTasks / story.tasks.length) * 100);
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
                <BookOpenIcon
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
                Epics & Stories
              </h1>
            </div>
          </div>
          <button
            onClick={() => {
              setLoading(true);
              fetchEpics();
            }}
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
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(220, 38, 38, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 16px rgba(220, 38, 38, 0.4)";
            }}
          >
            <ArrowPathIcon style={{ width: "18px", height: "18px" }} />
            <span>Refresh</span>
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
        ) : epics.length === 0 ? (
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
              <BookOpenIcon
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
              No Epics Yet
            </h3>
            <p style={{ fontSize: "1.0625rem", color: "#94a3b8" }}>
              Create a project with AI to generate epics and stories
            </p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {epics.map((epic, epicIndex) => {
              const isExpanded = expandedEpics.has(epic.id);
              const progress = calculateEpicProgress(epic);

              return (
                <div
                  key={epic.id}
                  style={{
                    background: "rgba(17, 17, 24, 0.7)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "20px",
                    padding: "2rem",
                  }}
                >
                  {/* Epic Header */}
                  <div
                    onClick={() => toggleEpic(epic.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      cursor: "pointer",
                      marginBottom: isExpanded ? "1.5rem" : "0",
                    }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        background: "linear-gradient(135deg, #dc2626, #991b1b)",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.25rem",
                        fontWeight: "700",
                        color: "white",
                        flexShrink: 0,
                      }}
                    >
                      {epicIndex + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h2
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: "700",
                          color: "#f1f5f9",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {epic.name}
                      </h2>
                      <p
                        style={{
                          fontSize: "0.9375rem",
                          color: "#94a3b8",
                          marginBottom: "0.75rem",
                        }}
                      >
                        {epic.description}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.875rem",
                            color: "#94a3b8",
                            fontWeight: 600,
                          }}
                        >
                          {epic.stories.length} Stories •{" "}
                          {epic.stories.reduce(
                            (sum, s) =>
                              sum +
                              s.tasks.filter((t) => t.status === "Done").length,
                            0
                          )}{" "}
                          /{" "}
                          {epic.stories.reduce(
                            (sum, s) => sum + s.tasks.length,
                            0
                          )}{" "}
                          Tasks Complete
                        </div>
                        <div
                          style={{
                            flex: 1,
                            maxWidth: "200px",
                            height: "8px",
                            background: "rgba(26, 26, 36, 0.9)",
                            borderRadius: "20px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${progress}%`,
                              height: "100%",
                              background:
                                "linear-gradient(90deg, #dc2626, #ef4444)",
                              borderRadius: "20px",
                              transition: "width 0.3s",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: "700",
                            color: "#f1f5f9",
                          }}
                        >
                          {progress}%
                        </div>
                      </div>
                    </div>
                    <ChevronRightIcon
                      style={{
                        width: "24px",
                        height: "24px",
                        color: "#94a3b8",
                        transform: isExpanded
                          ? "rotate(90deg)"
                          : "rotate(0deg)",
                        transition: "transform 0.2s",
                      }}
                    />
                  </div>

                  {/* Stories */}
                  {isExpanded && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                      }}
                    >
                      {epic.stories.map((story, storyIndex) => {
                        const isStoryExpanded = expandedStories.has(story.id);
                        const storyProgress = calculateStoryProgress(story);

                        return (
                          <div
                            key={story.id}
                            style={{
                              background: "rgba(255, 255, 255, 0.03)",
                              backdropFilter: "blur(10px)",
                              borderRadius: "16px",
                              padding: "1.5rem",
                              border: "1px solid rgba(255, 255, 255, 0.08)",
                            }}
                          >
                            {/* Story Header */}
                            <div
                              onClick={() => toggleStory(story.id)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                cursor: "pointer",
                                marginBottom: isStoryExpanded ? "1rem" : "0",
                              }}
                            >
                              <div
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  background: "rgba(220, 38, 38, 0.2)",
                                  borderRadius: "8px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "0.875rem",
                                  fontWeight: "700",
                                  color: "#dc2626",
                                  flexShrink: 0,
                                }}
                              >
                                {storyIndex + 1}
                              </div>
                              <div style={{ flex: 1 }}>
                                <h3
                                  style={{
                                    fontSize: "1.125rem",
                                    fontWeight: "600",
                                    color: "#f1f5f9",
                                    marginBottom: "0.25rem",
                                  }}
                                >
                                  {story.name}
                                </h3>
                                <p
                                  style={{
                                    fontSize: "0.875rem",
                                    color: "#94a3b8",
                                    marginBottom: "0.5rem",
                                  }}
                                >
                                  {story.description}
                                </p>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.75rem",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: "0.8125rem",
                                      color: "#94a3b8",
                                      fontWeight: 600,
                                    }}
                                  >
                                    {
                                      story.tasks.filter(
                                        (t) => t.status === "Done"
                                      ).length
                                    }{" "}
                                    / {story.tasks.length} Tasks Complete
                                  </div>
                                  <div
                                    style={{
                                      flex: 1,
                                      maxWidth: "150px",
                                      height: "6px",
                                      background: "rgba(26, 26, 36, 0.9)",
                                      borderRadius: "20px",
                                      overflow: "hidden",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: `${storyProgress}%`,
                                        height: "100%",
                                        background: "#dc2626",
                                        transition: "width 0.3s",
                                      }}
                                    />
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "0.8125rem",
                                      fontWeight: "700",
                                      color: "#f1f5f9",
                                    }}
                                  >
                                    {storyProgress}%
                                  </div>
                                </div>
                              </div>
                              <ChevronRightIcon
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  color: "#94a3b8",
                                  transform: isStoryExpanded
                                    ? "rotate(90deg)"
                                    : "rotate(0deg)",
                                  transition: "transform 0.2s",
                                }}
                              />
                            </div>

                            {/* Tasks */}
                            {isStoryExpanded && (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "0.5rem",
                                }}
                              >
                                {story.tasks.map((task) => {
                                  const colors = getStatusColor(task.status);
                                  return (
                                    <div
                                      key={task.id}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.75rem",
                                        padding: "0.875rem",
                                        background: colors.bg,
                                        backdropFilter: "blur(10px)",
                                        border: `1px solid ${colors.border}`,
                                        borderRadius: "12px",
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: "8px",
                                          height: "8px",
                                          borderRadius: "50%",
                                          background: colors.text,
                                          flexShrink: 0,
                                        }}
                                      />
                                      <div style={{ flex: 1 }}>
                                        <div
                                          style={{
                                            fontSize: "0.9375rem",
                                            fontWeight: "500",
                                            color: "#f1f5f9",
                                            marginBottom: "0.25rem",
                                          }}
                                        >
                                          {task.title}
                                        </div>
                                        <div
                                          style={{
                                            fontSize: "0.8125rem",
                                            color: colors.text,
                                            fontWeight: 600,
                                          }}
                                        >
                                          {task.status}
                                        </div>
                                      </div>
                                      <div
                                        style={{
                                          fontSize: "0.8125rem",
                                          fontWeight: "700",
                                          color: "#f1f5f9",
                                          padding: "0.25rem 0.625rem",
                                          background:
                                            "rgba(255, 255, 255, 0.05)",
                                          borderRadius: "8px",
                                        }}
                                      >
                                        {task.status === "Done"
                                          ? "100"
                                          : task.progress_percentage || 0}
                                        %
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
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

export default EpicView;
