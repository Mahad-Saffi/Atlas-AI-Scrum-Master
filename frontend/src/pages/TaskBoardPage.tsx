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
          className="card-glass-solid"
          style={{
            textAlign: "center",
            padding: "3rem",
            maxWidth: "500px",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>😕</div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "#ECDFCC",
              marginBottom: "0.5rem",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Oops!
          </h2>
          <p
            style={{
              fontSize: "0.9375rem",
              color: "#ECDFCC",
              marginBottom: "1.5rem",
            }}
          >
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
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
              gap: "1rem",
            }}
          >
            <button
              onClick={() => navigate("/")}
              className="btn-secondary"
              style={{
                padding: "0.5rem 1rem",
                fontSize: "1.25rem",
              }}
            >
              ←
            </button>
            <h1
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "#ECDFCC",
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
            {/* Search */}
            <div
              style={{
                position: "relative",
                width: "300px",
              }}
            >
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-modern"
                style={{
                  paddingLeft: "2.5rem",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--color-text-muted)",
                }}
              >
                🔍
              </span>
            </div>

            <NotificationBell />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          maxWidth: "1600px",
          margin: "0 auto",
          padding: "2rem",
        }}
      >
        {/* Stats Bar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div
            className="card"
            style={{
              padding: "1rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "0.75rem",
                color: "#ECDFCC",
                marginBottom: "0.5rem",
                fontWeight: "600",
              }}
            >
              Total Tasks
            </div>
            <div
              style={{
                fontSize: "1.75rem",
                fontWeight: "700",
                color: "#ECDFCC",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              {taskStats.total}
            </div>
          </div>

          <div
            className="card"
            style={{
              padding: "1rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "0.75rem",
                color: "#ECDFCC",
                marginBottom: "0.5rem",
                fontWeight: "600",
              }}
            >
              To Do
            </div>
            <div
              style={{
                fontSize: "1.75rem",
                fontWeight: "700",
                color: "#ECDFCC",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              {taskStats.todo}
            </div>
          </div>

          <div
            className="card"
            style={{
              padding: "1rem",
              textAlign: "center",
              background: "rgba(245, 158, 11, 0.15)",
              border: "1px solid rgba(245, 158, 11, 0.4)",
            }}
          >
            <div
              style={{
                fontSize: "0.75rem",
                color: "#ECDFCC",
                marginBottom: "0.5rem",
                fontWeight: "600",
              }}
            >
              In Progress
            </div>
            <div
              style={{
                fontSize: "1.75rem",
                fontWeight: "700",
                color: "#ECDFCC",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              {taskStats.inProgress}
            </div>
          </div>

          <div
            className="card"
            style={{
              padding: "1rem",
              textAlign: "center",
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.4)",
            }}
          >
            <div
              style={{
                fontSize: "0.75rem",
                color: "#ECDFCC",
                marginBottom: "0.5rem",
                fontWeight: "600",
              }}
            >
              Done
            </div>
            <div
              style={{
                fontSize: "1.75rem",
                fontWeight: "700",
                color: "#ECDFCC",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              {taskStats.done}
            </div>
          </div>
        </div>

        {/* Project Selector & Filters */}
        <div
          className="card-glass-solid"
          style={{
            marginBottom: "1.5rem",
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
            }}
          >
            <span style={{ fontWeight: "600", color: "#ECDFCC" }}>
              Project:
            </span>
            {projects.length > 0 && (
              <select
                value={selectedProjectId || ""}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                style={{
                  padding: "0.625rem 1rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  minWidth: "200px",
                }}
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Task Board */}
        <div
          className="card-glass-solid"
          style={{
            minHeight: "500px",
          }}
        >
          <TaskBoard tasks={filteredTasks} onTaskUpdate={handleTaskUpdate} />
        </div>
      </main>
    </div>
  );
};

export default TaskBoardPage;
