import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TaskBoard from "../components/tasks/TaskBoard";
import { taskService } from "../services/taskService";
import NotificationBell from "../components/NotificationBell";

interface Task {
  id: string;
  title: string;
  status: string;
  description?: string;
  assignee_id?: string;
  due_date?: string;
  priority?: number;
  estimate_hours?: number;
  progress_percentage?: number;
  risk_level?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
}

const TaskBoardPage: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("default");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".dropdown-container")) {
        setShowSortMenu(false);
        setShowFilterMenu(false);
      }
    };

    if (showSortMenu || showFilterMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showSortMenu, showFilterMenu]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await taskService.getProjects();
        setProjects(fetchedProjects);

        if (fetchedProjects.length > 0) {
          setSelectedProjectId(fetchedProjects[0].id);
        } else {
          setError("No projects found. Create a project first!");
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to fetch projects");
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchTasks = async (isInitialLoad = false) => {
      if (!selectedProjectId) return;

      try {
        if (isInitialLoad) {
          setLoading(true);
        }
        const fetchedTasks = await taskService.getTasks(selectedProjectId);
        setTasks(fetchedTasks);
        setError(null);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to fetch tasks");
      } finally {
        if (isInitialLoad) {
          setLoading(false);
        }
      }
    };

    fetchTasks(true);

    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      if (selectedProjectId) {
        fetchTasks(false);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [selectedProjectId]);

  const handleTaskUpdate = async () => {
    if (selectedProjectId) {
      const fetchedTasks = await taskService.getTasks(selectedProjectId);
      setTasks(fetchedTasks);
    }
  };

  // Filter tasks
  let filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Apply status filter
  if (filterStatus !== "all") {
    filteredTasks = filteredTasks.filter(
      (task) => task.status === filterStatus
    );
  }

  // Sort tasks
  if (sortBy === "title") {
    filteredTasks = [...filteredTasks].sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  } else if (sortBy === "dueDate") {
    filteredTasks = [...filteredTasks].sort((a, b) => {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });
  } else if (sortBy === "priority") {
    filteredTasks = [...filteredTasks].sort((a, b) => {
      const priorityA = a.priority || 0;
      const priorityB = b.priority || 0;
      return priorityB - priorityA;
    });
  }

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "To Do").length,
    inProgress: tasks.filter((t) => t.status === "In Progress").length,
    done: tasks.filter((t) => t.status === "Done").length,
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          className="spinner"
          style={{ width: "40px", height: "40px", borderWidth: "3px" }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            maxWidth: "500px",
            background: "rgba(17, 17, 24, 0.95)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
          }}
        >
          <ExclamationTriangleIcon
            style={{
              width: "64px",
              height: "64px",
              margin: "0 auto 1rem",
              color: "#dc2626",
            }}
          />
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "#f1f5f9",
              marginBottom: "0.5rem",
            }}
          >
            Oops!
          </h2>
          <p
            style={{
              fontSize: "0.9375rem",
              color: "#94a3b8",
              marginBottom: "1.5rem",
            }}
          >
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
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
            Try Again
          </button>
        </div>
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

      {/* Header - Matching Mockup */}
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
            maxWidth: "1600px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2rem",
            }}
          >
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
            <h1
              style={{
                fontSize: "1.75rem",
                fontWeight: "700",
                color: "#f1f5f9",
                letterSpacing: "-0.01em",
              }}
            >
              Task Board
            </h1>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            {/* Project Selector Dropdown */}
            {projects.length > 0 && (
              <select
                value={selectedProjectId || ""}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                style={{
                  padding: "0.75rem 1.25rem",
                  background: "rgba(17, 17, 24, 0.95)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  color: "#f1f5f9",
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  minWidth: "200px",
                  outline: "none",
                }}
                className="custom-select"
              >
                {projects.map((project) => (
                  <option
                    key={project.id}
                    value={project.id}
                    style={{
                      background: "#111118",
                      color: "#f1f5f9",
                      padding: "0.75rem",
                    }}
                  >
                    {project.name}
                  </option>
                ))}
              </select>
            )}

            <NotificationBell />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1600px",
          margin: "0 auto",
          padding: "2rem",
        }}
      >
        {/* Stats Bar - Matching Mockup */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              background: "rgba(100, 116, 139, 0.12)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(100, 116, 139, 0.3)",
              borderRadius: "16px",
              padding: "1.5rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "0.875rem",
                color: "#94a3b8",
                marginBottom: "0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              To Do
            </div>
            <div
              style={{
                fontSize: "2.5rem",
                fontWeight: 700,
                color: "#f1f5f9",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              {taskStats.todo}
            </div>
          </div>

          <div
            style={{
              background: "rgba(245, 158, 11, 0.12)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              borderRadius: "16px",
              padding: "1.5rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "0.875rem",
                color: "#f59e0b",
                marginBottom: "0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              In Progress
            </div>
            <div
              style={{
                fontSize: "2.5rem",
                fontWeight: 700,
                color: "#f1f5f9",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              {taskStats.inProgress}
            </div>
          </div>

          <div
            style={{
              background: "rgba(34, 197, 94, 0.12)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(34, 197, 94, 0.3)",
              borderRadius: "16px",
              padding: "1.5rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "0.875rem",
                color: "#22c55e",
                marginBottom: "0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Done
            </div>
            <div
              style={{
                fontSize: "2.5rem",
                fontWeight: 700,
                color: "#f1f5f9",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              {taskStats.done}
            </div>
          </div>
        </div>

        {/* Task Board */}
        <div
          style={{
            background: "rgba(17, 17, 24, 0.7)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "20px",
            padding: "2rem",
            minHeight: "600px",
          }}
        >
          <TaskBoard tasks={filteredTasks} onTaskUpdate={handleTaskUpdate} />
        </div>
      </main>

      {/* Custom Select Styling */}
      <style>{`
        .custom-select {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394a3b8'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 20px;
          padding-right: 2.5rem !important;
        }
        
        .custom-select:hover {
          background-color: rgba(17, 17, 24, 1);
          border-color: rgba(255, 255, 255, 0.15);
        }
        
        .custom-select:focus {
          outline: none;
          border-color: rgba(220, 38, 38, 0.5);
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }
        
        .custom-select option {
          background: #111118;
          color: #f1f5f9;
          padding: 0.75rem;
        }
        
        .custom-select option:hover {
          background: rgba(220, 38, 38, 0.15);
        }
      `}</style>
    </div>
  );
};

export default TaskBoardPage;
