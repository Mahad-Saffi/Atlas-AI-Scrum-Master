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
  assignee_id?: number;
  due_date?: string;
  priority?: number;
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
    const fetchTasks = async () => {
      if (!selectedProjectId) return;

      try {
        setLoading(true);
        const fetchedTasks = await taskService.getTasks(selectedProjectId);
        setTasks(fetchedTasks);
        setError(null);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [selectedProjectId]);

  const handleTaskUpdate = async () => {
    if (selectedProjectId) {
      const fetchedTasks = await taskService.getTasks(selectedProjectId);
      setTasks(fetchedTasks);
    }
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          background: "var(--color-cream)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <div
          className="card"
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
              fontWeight: "600",
              color: "var(--color-text-primary)",
              marginBottom: "0.5rem",
            }}
          >
            Oops!
          </h2>
          <p
            style={{
              fontSize: "0.9375rem",
              color: "var(--color-text-secondary)",
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
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1.25rem",
                color: "var(--color-text-secondary)",
              }}
            >
              ←
            </button>
            <h1
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "var(--color-text-primary)",
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
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div className="card" style={{ padding: "1.25rem" }}>
            <div
              style={{
                fontSize: "0.875rem",
                color: "var(--color-text-secondary)",
                marginBottom: "0.5rem",
              }}
            >
              Total Tasks
            </div>
            <div
              style={{
                fontSize: "1.75rem",
                fontWeight: "600",
                color: "var(--color-text-primary)",
              }}
            >
              {taskStats.total}
            </div>
          </div>

          <div className="card" style={{ padding: "1.25rem" }}>
            <div
              style={{
                fontSize: "0.875rem",
                color: "var(--color-text-secondary)",
                marginBottom: "0.5rem",
              }}
            >
              To Do
            </div>
            <div
              style={{
                fontSize: "1.75rem",
                fontWeight: "600",
                color: "var(--color-text-primary)",
              }}
            >
              {taskStats.todo}
            </div>
          </div>

          <div className="card" style={{ padding: "1.25rem" }}>
            <div
              style={{
                fontSize: "0.875rem",
                color: "var(--color-text-secondary)",
                marginBottom: "0.5rem",
              }}
            >
              In Progress
            </div>
            <div
              style={{
                fontSize: "1.75rem",
                fontWeight: "600",
                color: "var(--color-text-primary)",
              }}
            >
              {taskStats.inProgress}
            </div>
          </div>

          <div className="card" style={{ padding: "1.25rem" }}>
            <div
              style={{
                fontSize: "0.875rem",
                color: "var(--color-text-secondary)",
                marginBottom: "0.5rem",
              }}
            >
              Done
            </div>
            <div
              style={{
                fontSize: "1.75rem",
                fontWeight: "600",
                color: "var(--color-success)",
              }}
            >
              {taskStats.done}
            </div>
          </div>
        </div>

        {/* Project Selector & Filters */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            {projects.length > 0 && (
              <select
                value={selectedProjectId || ""}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                style={{
                  padding: "0.625rem 1rem",
                  fontSize: "0.9375rem",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-white)",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  color: "var(--color-text-primary)",
                  fontWeight: "500",
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

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
            }}
          >
            <button
              className="btn-secondary"
              style={{ padding: "0.625rem 1rem", fontSize: "0.875rem" }}
            >
              Sort by
            </button>
            <button
              className="btn-secondary"
              style={{ padding: "0.625rem 1rem", fontSize: "0.875rem" }}
            >
              Filters
            </button>
          </div>
        </div>

        {/* Task Board */}
        <div
          className="card"
          style={{
            padding: "1.5rem",
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
