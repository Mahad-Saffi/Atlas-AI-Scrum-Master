import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import theme from "../styles/theme";

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

      // Auto-refresh every 15 seconds
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
        console.log("Fetched epics data:", data); // Debug log
        setEpics(data);
        // Expand first epic by default only on initial load
        if (data.length > 0 && expandedEpics.size === 0) {
          setExpandedEpics(new Set([data[0].id]));
        }
      } else {
        console.error(
          "Failed to fetch epics:",
          response.status,
          response.statusText
        );
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
          bg: `rgba(34, 197, 94, 0.2)`,
          border: `${theme.colors.status.success}66`,
          text: theme.colors.text.primary,
        };
      case "In Progress":
        return {
          bg: `rgba(245, 158, 11, 0.2)`,
          border: `${theme.colors.status.warning}66`,
          text: theme.colors.text.primary,
        };
      default:
        return {
          bg: theme.colors.background.hover,
          border: theme.colors.border.light,
          text: theme.colors.text.primary,
        };
    }
  };

  const calculateEpicProgress = (epic: Epic) => {
    const allTasks = epic.stories.flatMap((s) => s.tasks);
    if (allTasks.length === 0) return 0;
    const totalProgress = allTasks.reduce((sum, t) => {
      // If task is Done, count as 100%, otherwise use progress_percentage
      const taskProgress =
        t.status === "Done" ? 100 : t.progress_percentage || 0;
      return sum + taskProgress;
    }, 0);
    return Math.round(totalProgress / allTasks.length);
  };

  const calculateStoryProgress = (story: Story) => {
    if (story.tasks.length === 0) return 0;
    const totalProgress = story.tasks.reduce((sum, t) => {
      // If task is Done, count as 100%, otherwise use progress_percentage
      const taskProgress =
        t.status === "Done" ? 100 : t.progress_percentage || 0;
      return sum + taskProgress;
    }, 0);
    return Math.round(totalProgress / story.tasks.length);
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
                background: theme.colors.brand.redGradient,
                borderRadius: theme.borderRadius.md,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: theme.typography.fontSize.xs,
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.white,
              }}
            >
              EP
            </div>
            <h1
              style={{
                fontSize: theme.typography.fontSize.xl,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.primary,
              }}
            >
              Epics & Stories
            </h1>
          </div>
          <button
            id="btn-refresh-epics"
            onClick={() => {
              setLoading(true);
              fetchEpics();
            }}
            className="btn-secondary"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            Refresh
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
        ) : epics.length === 0 ? (
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
                background: theme.colors.background.hover,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
                border: `1px solid ${theme.colors.border.light}`,
              }}
            >
              <span
                style={{
                  fontSize: theme.typography.fontSize["2xl"],
                  color: theme.colors.text.muted,
                }}
              >
                EP
              </span>
            </div>
            <h3
              style={{
                fontSize: theme.typography.fontSize["2xl"],
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing.sm,
                textShadow: theme.shadows.sm,
              }}
            >
              No Epics Yet
            </h3>
            <p
              style={{
                fontSize: theme.typography.fontSize.lg,
                color: theme.colors.text.secondary,
              }}
            >
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
                <div key={epic.id} className="card-glass-solid">
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
                        background: theme.colors.brand.redGradient,
                        borderRadius: theme.borderRadius.md,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: theme.typography.fontSize["2xl"],
                        flexShrink: 0,
                      }}
                    >
                      {epicIndex + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h2
                        style={{
                          fontSize: theme.typography.fontSize.xl,
                          fontWeight: theme.typography.fontWeight.bold,
                          color: theme.colors.text.primary,
                          marginBottom: theme.spacing.xs,
                          textShadow: theme.shadows.sm,
                        }}
                      >
                        {epic.name}
                      </h2>
                      <p
                        style={{
                          fontSize: theme.typography.fontSize.sm,
                          color: theme.colors.text.secondary,
                          marginBottom: theme.spacing.sm,
                        }}
                      >
                        {epic.description}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: theme.spacing.lg,
                        }}
                      >
                        <div
                          style={{
                            fontSize: theme.typography.fontSize.sm,
                            color: theme.colors.text.primary,
                            fontWeight: theme.typography.fontWeight.semibold,
                          }}
                        >
                          {epic.stories.length} Stories •{" "}
                          {epic.stories.reduce(
                            (sum, s) => sum + s.tasks.length,
                            0
                          )}{" "}
                          Tasks
                        </div>
                        <div
                          style={{
                            flex: 1,
                            maxWidth: "200px",
                            height: "8px",
                            background: theme.colors.background.tertiary,
                            borderRadius: "4px",
                            overflow: "hidden",
                            border: `1px solid ${theme.colors.border.light}`,
                          }}
                        >
                          <div
                            style={{
                              width: `${progress}%`,
                              height: "100%",
                              background: theme.colors.brand.redGradient,
                              transition: "width 0.3s",
                              boxShadow: theme.shadows.red,
                            }}
                          />
                        </div>
                        <div
                          style={{
                            fontSize: theme.typography.fontSize.sm,
                            fontWeight: theme.typography.fontWeight.bold,
                            color: theme.colors.text.primary,
                            textShadow: theme.shadows.sm,
                          }}
                        >
                          {progress}%
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "1.5rem",
                        transform: isExpanded
                          ? "rotate(90deg)"
                          : "rotate(0deg)",
                        transition: "transform 0.2s",
                      }}
                    >
                      ▶
                    </div>
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
                              background: theme.colors.background.hover,
                              backdropFilter: theme.effects.backdropBlur.sm,
                              borderRadius: theme.borderRadius.lg,
                              padding: theme.spacing.xl,
                              border: `1px solid ${theme.colors.border.light}`,
                            }}
                          >
                            {/* Story Header */}
                            <div
                              onClick={() => toggleStory(story.id)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: theme.spacing.md,
                                cursor: "pointer",
                                marginBottom: isStoryExpanded
                                  ? theme.spacing.lg
                                  : "0",
                              }}
                            >
                              <div
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  background:
                                    theme.colors.background.hoverStrong,
                                  borderRadius: theme.borderRadius.sm,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: theme.typography.fontSize.sm,
                                  fontWeight: theme.typography.fontWeight.bold,
                                  color: theme.colors.text.primary,
                                  flexShrink: 0,
                                }}
                              >
                                {storyIndex + 1}
                              </div>
                              <div style={{ flex: 1 }}>
                                <h3
                                  style={{
                                    fontSize: theme.typography.fontSize.lg,
                                    fontWeight:
                                      theme.typography.fontWeight.semibold,
                                    color: theme.colors.text.primary,
                                    marginBottom: theme.spacing.xs,
                                  }}
                                >
                                  {story.name}
                                </h3>
                                <p
                                  style={{
                                    fontSize: theme.typography.fontSize.sm,
                                    color: theme.colors.text.secondary,
                                    marginBottom: theme.spacing.sm,
                                  }}
                                >
                                  {story.description}
                                </p>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: theme.spacing.md,
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: theme.typography.fontSize.xs,
                                      color: theme.colors.text.primary,
                                      fontWeight:
                                        theme.typography.fontWeight.semibold,
                                    }}
                                  >
                                    {story.tasks.length} Tasks
                                  </div>
                                  <div
                                    style={{
                                      flex: 1,
                                      maxWidth: "150px",
                                      height: "6px",
                                      background:
                                        theme.colors.background.tertiary,
                                      borderRadius: "3px",
                                      overflow: "hidden",
                                      border: `1px solid ${theme.colors.border.light}`,
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: `${storyProgress}%`,
                                        height: "100%",
                                        background: theme.colors.brand.red,
                                        transition: "width 0.3s",
                                        boxShadow: theme.shadows.red,
                                      }}
                                    />
                                  </div>
                                  <div
                                    style={{
                                      fontSize: theme.typography.fontSize.xs,
                                      fontWeight:
                                        theme.typography.fontWeight.bold,
                                      color: theme.colors.text.primary,
                                    }}
                                  >
                                    {storyProgress}%
                                  </div>
                                </div>
                              </div>
                              <div
                                style={{
                                  fontSize: "1rem",
                                  transform: isStoryExpanded
                                    ? "rotate(90deg)"
                                    : "rotate(0deg)",
                                  transition: "transform 0.2s",
                                }}
                              >
                                ▶
                              </div>
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
                                        gap: theme.spacing.md,
                                        padding: theme.spacing.md,
                                        background: colors.bg,
                                        backdropFilter:
                                          theme.effects.backdropBlur.sm,
                                        border: `1px solid ${colors.border}`,
                                        borderRadius: theme.borderRadius.md,
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: "6px",
                                          height: "6px",
                                          borderRadius: "50%",
                                          background: colors.border,
                                          flexShrink: 0,
                                          boxShadow: `0 0 4px ${colors.border}`,
                                        }}
                                      />
                                      <div style={{ flex: 1 }}>
                                        <div
                                          style={{
                                            fontSize:
                                              theme.typography.fontSize.sm,
                                            fontWeight:
                                              theme.typography.fontWeight
                                                .medium,
                                            color: theme.colors.text.primary,
                                            marginBottom: theme.spacing.xs,
                                          }}
                                        >
                                          {task.title}
                                        </div>
                                        <div
                                          style={{
                                            fontSize:
                                              theme.typography.fontSize.xs,
                                            color: colors.text,
                                            fontWeight:
                                              theme.typography.fontWeight
                                                .semibold,
                                          }}
                                        >
                                          {task.status}
                                        </div>
                                      </div>
                                      <div
                                        style={{
                                          fontSize:
                                            theme.typography.fontSize.xs,
                                          fontWeight:
                                            theme.typography.fontWeight.bold,
                                          color: theme.colors.text.primary,
                                          padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                                          background:
                                            theme.colors.background.hover,
                                          borderRadius: theme.borderRadius.sm,
                                        }}
                                      >
                                        {task.progress_percentage}%
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
    </div>
  );
};

export default EpicView;
