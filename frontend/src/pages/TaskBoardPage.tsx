import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TaskBoard from "../components/tasks/TaskBoard";
import { taskService } from "../services/taskService";
import NotificationBell from "../components/NotificationBell";
import theme from "../styles/theme";

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
  const [searchParams] = useSearchParams();
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
        console.log("[TaskBoard] Fetched projects:", fetchedProjects);
        setProjects(fetchedProjects);

        // Check if project ID is in URL params
        const projectIdFromUrl = searchParams.get("projectId");
        console.log("[TaskBoard] 🔍 Project ID from URL:", projectIdFromUrl);

        if (
          projectIdFromUrl &&
          fetchedProjects.some((p) => p.id === projectIdFromUrl)
        ) {
          // Use project from URL if it exists
          const project = fetchedProjects.find(
            (p) => p.id === projectIdFromUrl
          );
          console.log(
            "[TaskBoard] ✅ Using project from URL:",
            project?.name,
            projectIdFromUrl
          );
          setSelectedProjectId(projectIdFromUrl);
        } else if (fetchedProjects.length > 0) {
          // Otherwise use first project
          console.log(
            "[TaskBoard] No URL project, using first project:",
            fetchedProjects[0].name,
            fetchedProjects[0].id
          );
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
  }, [searchParams]);

  useEffect(() => {
    const fetchTasks = async (isInitialLoad = false) => {
      if (!selectedProjectId) {
        console.log("[TaskBoard] ⚠️ No project selected, skipping fetch");
        return;
      }

      try {
        if (isInitialLoad) {
          setLoading(true);
        }
        console.log(
          `\n[TaskBoard] 📡 Fetching tasks for project: ${selectedProjectId}`
        );
        const fetchedTasks = await taskService.getTasks(selectedProjectId);
        console.log(
          `[TaskBoard] ✅ Received ${fetchedTasks.length} tasks for project ${selectedProjectId}`
        );

        // Log first 3 tasks with their project IDs
        if (fetchedTasks.length > 0) {
          console.log("[TaskBoard] 📋 First 3 tasks:");
          fetchedTasks.slice(0, 3).forEach((t, i) => {
            console.log(
              `  ${i + 1}. "${t.title}" (project_id: ${t.project_id})`
            );
          });
        } else {
          console.log("[TaskBoard] ⚠️ No tasks returned from API");
        }

        // Verify all tasks belong to the selected project
        const wrongProjectTasks = fetchedTasks.filter(
          (t) => t.project_id !== selectedProjectId
        );
        if (wrongProjectTasks.length > 0) {
          console.error(
            `[TaskBoard] ❌ ERROR: ${wrongProjectTasks.length} tasks belong to different projects!`
          );
          wrongProjectTasks.forEach((t) => {
            console.error(
              `  - "${t.title}" has project_id: ${t.project_id} (expected: ${selectedProjectId})`
            );
          });
        } else {
          console.log(
            `[TaskBoard] ✅ All ${fetchedTasks.length} tasks belong to project ${selectedProjectId}`
          );
        }

        setTasks(fetchedTasks);
        setError(null);
      } catch (err) {
        console.error("[TaskBoard] ❌ Error fetching tasks:", err);
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
          padding: theme.spacing.xl,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          className="card-glass-solid"
          style={{
            textAlign: "center",
            padding: theme.spacing["4xl"],
            maxWidth: "500px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              background: `${theme.colors.background.card}1a`,
              borderRadius: theme.borderRadius.full,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: `0 auto ${theme.spacing.lg}`,
              border: `1px solid ${theme.colors.border.light}`,
            }}
          >
            <span
              style={{
                fontSize: theme.typography.fontSize["2xl"],
                color: theme.colors.text.muted,
              }}
            >
              !
            </span>
          </div>
          <h2
            style={{
              fontSize: theme.typography.fontSize["2xl"],
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing.sm,
              textShadow: theme.effects.textShadow.sm,
            }}
          >
            Oops!
          </h2>
          <p
            style={{
              fontSize: theme.typography.fontSize.base,
              color: theme.colors.text.muted,
              marginBottom: theme.spacing.xl,
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
          padding: `${theme.spacing.lg} ${theme.spacing["2xl"]}`,
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
              gap: theme.spacing.lg,
            }}
          >
            <button
              onClick={() => navigate("/")}
              className="btn-secondary"
              style={{
                padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
              }}
            >
              Back
            </button>
            <h1
              style={{
                fontSize: theme.typography.fontSize.xl,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.primary,
              }}
            >
              Task Board
            </h1>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.lg,
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
              />
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
          padding: theme.spacing["2xl"],
        }}
      >
        {/* Stats Bar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: theme.spacing.lg,
            marginBottom: theme.spacing["2xl"],
          }}
        >
          <div
            className="card"
            style={{
              padding: theme.spacing.lg,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.text.secondary,
                marginBottom: theme.spacing.sm,
                fontWeight: theme.typography.fontWeight.semibold,
              }}
            >
              Total Tasks
            </div>
            <div
              style={{
                fontSize: theme.typography.fontSize["3xl"],
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                textShadow: theme.effects.textShadow.sm,
              }}
            >
              {taskStats.total}
            </div>
          </div>

          <div
            className="card"
            style={{
              padding: theme.spacing.lg,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.text.secondary,
                marginBottom: theme.spacing.sm,
                fontWeight: theme.typography.fontWeight.semibold,
              }}
            >
              To Do
            </div>
            <div
              style={{
                fontSize: theme.typography.fontSize["3xl"],
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                textShadow: theme.effects.textShadow.sm,
              }}
            >
              {taskStats.todo}
            </div>
          </div>

          <div
            className="card"
            style={{
              padding: theme.spacing.lg,
              textAlign: "center",
              background: `${theme.colors.status.warning}26`,
              border: `1px solid ${theme.colors.status.warning}66`,
            }}
          >
            <div
              style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.text.secondary,
                marginBottom: theme.spacing.sm,
                fontWeight: theme.typography.fontWeight.semibold,
              }}
            >
              In Progress
            </div>
            <div
              style={{
                fontSize: theme.typography.fontSize["3xl"],
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                textShadow: theme.effects.textShadow.sm,
              }}
            >
              {taskStats.inProgress}
            </div>
          </div>

          <div
            className="card"
            style={{
              padding: theme.spacing.lg,
              textAlign: "center",
              background: `${theme.colors.status.success}26`,
              border: `1px solid ${theme.colors.status.success}66`,
            }}
          >
            <div
              style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.text.secondary,
                marginBottom: theme.spacing.sm,
                fontWeight: theme.typography.fontWeight.semibold,
              }}
            >
              Done
            </div>
            <div
              style={{
                fontSize: theme.typography.fontSize["3xl"],
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                textShadow: theme.effects.textShadow.sm,
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
            marginBottom: theme.spacing.xl,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: theme.spacing.lg,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.lg,
            }}
          >
            <span
              style={{
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.primary,
              }}
            >
              Project:
            </span>
            {projects.length > 0 && (
              <select
                value={selectedProjectId || ""}
                onChange={(e) => {
                  console.log(
                    `[TaskBoard] Project changed from ${selectedProjectId} to ${e.target.value}`
                  );
                  setSelectedProjectId(e.target.value);
                }}
                style={{
                  padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
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
          <TaskBoard
            key={selectedProjectId}
            tasks={filteredTasks}
            onTaskUpdate={handleTaskUpdate}
          />
        </div>
      </main>
    </div>
  );
};

export default TaskBoardPage;
