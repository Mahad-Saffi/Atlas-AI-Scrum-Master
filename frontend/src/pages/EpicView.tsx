import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
          bg: "rgba(16, 185, 129, 0.2)",
          border: "rgba(16, 185, 129, 0.4)",
          text: "#ECDFCC",
        };
      case "In Progress":
        return {
          bg: "rgba(245, 158, 11, 0.2)",
          border: "rgba(245, 158, 11, 0.4)",
          text: "#ECDFCC",
        };
      default:
        return {
          bg: "rgba(236, 223, 204, 0.2)",
          border: "rgba(236, 223, 204, 0.3)",
          text: "#ECDFCC",
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
              style={{ padding: "0.5rem 1rem", fontSize: "1.25rem" }}
            >
              ←
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
                fontSize: "1rem",
              }}
            >
              📚
            </div>
            <h1
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "#ECDFCC",
              }}
            >
              Epics & Stories
            </h1>
          </div>
          <button
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
            <span>🔄</span>
            <span>Refresh</span>
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
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📚</div>
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#ECDFCC",
                marginBottom: "0.5rem",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              No Epics Yet
            </h3>
            <p style={{ fontSize: "1rem", color: "#ECDFCC" }}>
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
                        background:
                          "linear-gradient(135deg, #697565 0%, #3C3D37 100%)",
                        borderRadius: "var(--radius-md)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem",
                        flexShrink: 0,
                      }}
                    >
                      {epicIndex + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h2
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: "700",
                          color: "#ECDFCC",
                          marginBottom: "0.25rem",
                          textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                        }}
                      >
                        {epic.name}
                      </h2>
                      <p
                        style={{
                          fontSize: "0.875rem",
                          color: "#ECDFCC",
                          marginBottom: "0.5rem",
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
                            fontSize: "0.8125rem",
                            color: "#ECDFCC",
                            fontWeight: "600",
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
                            background: "rgba(24, 28, 20, 0.3)",
                            borderRadius: "4px",
                            overflow: "hidden",
                            border: "1px solid rgba(236, 223, 204, 0.2)",
                          }}
                        >
                          <div
                            style={{
                              width: `${progress}%`,
                              height: "100%",
                              background:
                                "linear-gradient(90deg, #ECDFCC, #D4C7B4)",
                              transition: "width 0.3s",
                              boxShadow: "0 0 8px rgba(236, 223, 204, 0.5)",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            fontSize: "0.8125rem",
                            fontWeight: "700",
                            color: "#ECDFCC",
                            textShadow: "0 1px 2px rgba(0,0,0,0.3)",
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
                              background: "rgba(236, 223, 204, 0.15)",
                              backdropFilter: "blur(10px)",
                              borderRadius: "var(--radius-lg)",
                              padding: "1.25rem",
                              border: "1px solid rgba(236, 223, 204, 0.3)",
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
                                  background: "rgba(236, 223, 204, 0.3)",
                                  borderRadius: "var(--radius-sm)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "0.875rem",
                                  fontWeight: "700",
                                  color: "#ECDFCC",
                                  flexShrink: 0,
                                }}
                              >
                                {storyIndex + 1}
                              </div>
                              <div style={{ flex: 1 }}>
                                <h3
                                  style={{
                                    fontSize: "1rem",
                                    fontWeight: "600",
                                    color: "#ECDFCC",
                                    marginBottom: "0.25rem",
                                  }}
                                >
                                  {story.name}
                                </h3>
                                <p
                                  style={{
                                    fontSize: "0.8125rem",
                                    color: "#ECDFCC",
                                    marginBottom: "0.5rem",
                                    opacity: 0.9,
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
                                      fontSize: "0.75rem",
                                      color: "#ECDFCC",
                                      fontWeight: "600",
                                    }}
                                  >
                                    {story.tasks.length} Tasks
                                  </div>
                                  <div
                                    style={{
                                      flex: 1,
                                      maxWidth: "150px",
                                      height: "6px",
                                      background: "rgba(24, 28, 20, 0.3)",
                                      borderRadius: "3px",
                                      overflow: "hidden",
                                      border:
                                        "1px solid rgba(236, 223, 204, 0.2)",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: `${storyProgress}%`,
                                        height: "100%",
                                        background: "#ECDFCC",
                                        transition: "width 0.3s",
                                        boxShadow:
                                          "0 0 6px rgba(236, 223, 204, 0.5)",
                                      }}
                                    />
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "0.75rem",
                                      fontWeight: "700",
                                      color: "#ECDFCC",
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
                                        gap: "0.75rem",
                                        padding: "0.75rem",
                                        background: colors.bg,
                                        backdropFilter: "blur(10px)",
                                        border: `1px solid ${colors.border}`,
                                        borderRadius: "var(--radius-md)",
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
                                            fontSize: "0.875rem",
                                            fontWeight: "500",
                                            color: "#ECDFCC",
                                            marginBottom: "0.25rem",
                                          }}
                                        >
                                          {task.title}
                                        </div>
                                        <div
                                          style={{
                                            fontSize: "0.75rem",
                                            color: colors.text,
                                            fontWeight: "600",
                                          }}
                                        >
                                          {task.status}
                                        </div>
                                      </div>
                                      <div
                                        style={{
                                          fontSize: "0.75rem",
                                          fontWeight: "700",
                                          color: "#ECDFCC",
                                          padding: "0.25rem 0.5rem",
                                          background:
                                            "rgba(236, 223, 204, 0.2)",
                                          borderRadius: "var(--radius-sm)",
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
