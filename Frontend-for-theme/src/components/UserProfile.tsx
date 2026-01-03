import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  PlusIcon,
  RocketLaunchIcon,
  FlagIcon,
  WrenchScrewdriverIcon,
  FolderIcon,
  CalendarIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import logo from "../assets/logo.png";
import { taskService } from "../services/taskService";
import OrganizationInfo from "./OrganizationInfo";

interface User {
  id: string;
  username: string;
  email: string;
}

interface UserProfileProps {
  user: User;
  onSignOut: () => void;
}

interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

interface Task {
  id: string;
  status: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onSignOut }) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
  });
  const [sortBy, setSortBy] = useState("default");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedProjects = await taskService.getProjects();
        setProjects(fetchedProjects);

        // Fetch all tasks across projects
        let allTasks: Task[] = [];
        for (const project of fetchedProjects) {
          const tasks = await taskService.getTasks(project.id);
          allTasks = [...allTasks, ...tasks];
        }

        setTaskStats({
          total: allTasks.length,
          completed: allTasks.filter((t) => t.status === "Done").length,
          inProgress: allTasks.filter((t) => t.status === "In Progress").length,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getSortedProjects = () => {
    let sorted = [...projects];
    if (sortBy === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "date") {
      sorted.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortBy === "oldest") {
      sorted.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    }
    return sorted;
  };

  // Mockup-inspired stat cards
  const statCards = [
    {
      label: "Projects",
      sublabel: "Active Now",
      value: projects.length,
      Icon: RocketLaunchIcon,
      iconBg: "linear-gradient(135deg, #dc2626, #991b1b)",
    },
    {
      label: "Completed",
      sublabel: "Successfully Delivered",
      value: taskStats.completed,
      Icon: FlagIcon,
      iconBg: "linear-gradient(135deg, #22c55e, #15803d)",
    },
    {
      label: "In Progress",
      sublabel: "Currently Active",
      value: taskStats.inProgress,
      Icon: WrenchScrewdriverIcon,
      iconBg: "linear-gradient(135deg, #f59e0b, #d97706)",
    },
  ];

  return (
    <div style={styles.page}>
      {/* Background Grid Pattern */}
      <div style={styles.gridPattern} />

      {/* Header - Matching Mockup */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          {/* Logo */}
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <img
                src={logo}
                alt="Ideal Assistant"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <span style={styles.logoText}>
              <span style={{ color: "#f1f5f9" }}>Ideal</span>{" "}
              <span style={{ color: "#dc2626" }}>Assistant</span>
            </span>
          </div>

          {/* Nav Actions */}
          <div style={styles.navActions}>
            <button onClick={() => navigate("/chat")} style={styles.navBtn}>
              <ChatBubbleLeftRightIcon
                style={{ width: "18px", height: "18px" }}
              />
              <span>Chat</span>
              <div style={styles.notificationDot} />
            </button>
            <button
              onClick={() => navigate("/team-members")}
              style={styles.navBtn}
            >
              <UserGroupIcon style={{ width: "18px", height: "18px" }} />
              <span>Team</span>
            </button>
            <button
              onClick={() => navigate("/create-project")}
              style={styles.primaryBtn}
            >
              <PlusIcon style={{ width: "18px", height: "18px" }} />
              <span>New Project</span>
            </button>
            <div style={{ position: "relative" }}>
              <div
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={styles.userMenu}
              >
                <div style={styles.avatar}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <ChevronDownIcon
                  style={{ width: "16px", height: "16px", color: "#94a3b8" }}
                />
              </div>
              {showUserMenu && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 0.5rem)",
                    right: 0,
                    minWidth: "200px",
                    background: "rgba(17, 17, 24, 0.95)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "12px",
                    padding: "0.5rem",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
                    zIndex: 1000,
                  }}
                >
                  <div
                    style={{
                      padding: "0.75rem 1rem",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "#f1f5f9",
                      }}
                    >
                      {user.username}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#94a3b8",
                        marginTop: "0.25rem",
                      }}
                    >
                      {user.email}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      navigate("/organization-setup");
                      setShowUserMenu(false);
                    }}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      background: "transparent",
                      border: "none",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                      fontSize: "0.875rem",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    Organization Settings
                  </button>
                  <button
                    onClick={() => {
                      onSignOut();
                      setShowUserMenu(false);
                    }}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      background: "transparent",
                      border: "none",
                      borderRadius: "8px",
                      color: "#dc2626",
                      fontSize: "0.875rem",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(220, 38, 38, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Stats Cards - Matching Mockup */}
        <div style={styles.statsGrid}>
          {statCards.map((stat, i) => (
            <div key={i} style={styles.statCard}>
              <div style={{ ...styles.statIcon, background: stat.iconBg }}>
                <stat.Icon
                  style={{ width: "40px", height: "40px", color: "white" }}
                />
              </div>
              <div style={styles.statContent}>
                <div style={styles.statValue}>
                  <span style={{ color: "#dc2626" }}>{stat.value}</span>{" "}
                  {stat.label}
                </div>
                <div style={styles.statLabel}>{stat.sublabel}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Projects Section */}
        <div style={styles.projectsSection}>
          <div style={styles.projectsHeader}>
            <h2 style={styles.projectsTitle}>Your Projects</h2>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                style={styles.sortBtn}
              >
                <span>Sort by: Recent</span>
                <ChevronDownIcon style={{ width: "16px", height: "16px" }} />
              </button>
              {showSortMenu && (
                <div style={styles.sortMenu}>
                  {[
                    { value: "default", label: "Recent" },
                    { value: "name", label: "Name (A-Z)" },
                    { value: "date", label: "Newest First" },
                    { value: "oldest", label: "Oldest First" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSortBy(opt.value);
                        setShowSortMenu(false);
                      }}
                      style={{
                        ...styles.sortOption,
                        background:
                          sortBy === opt.value
                            ? "rgba(220, 38, 38, 0.15)"
                            : "transparent",
                        color: sortBy === opt.value ? "#dc2626" : "#94a3b8",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Projects Grid - Matching Mockup */}
          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner} />
            </div>
          ) : projects.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <RocketLaunchIcon style={{ width: "48px", height: "48px" }} />
              </div>
              <h3 style={styles.emptyTitle}>No projects yet</h3>
              <p style={styles.emptyText}>
                Create your first project to get started
              </p>
              <button
                onClick={() => navigate("/create-project")}
                style={styles.primaryBtn}
              >
                <PlusIcon style={{ width: "20px", height: "20px" }} />
                <span>Create Your First Project</span>
              </button>
            </div>
          ) : (
            <div style={styles.projectsGrid}>
              {getSortedProjects().map((project) => (
                <div
                  key={project.id}
                  style={styles.projectCard}
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  <div style={styles.projectIcon}>
                    <FolderIcon
                      style={{
                        width: "48px",
                        height: "48px",
                        color: "#dc2626",
                      }}
                    />
                  </div>
                  <div style={styles.projectContent}>
                    <h3 style={styles.projectTitle}>{project.name}</h3>
                    <p style={styles.projectDesc}>
                      {project.description ||
                        "Machine learning model deployment for client X"}
                    </p>
                    <div style={styles.projectFooter}>
                      <div style={styles.projectDate}>
                        <span style={{ color: "#dc2626" }}>Due:</span>{" "}
                        {new Date(project.created_at).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" }
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/task-board");
                    }}
                    style={styles.viewTasksBtn}
                  >
                    View Tasks
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
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

// Styles matching the mockup
const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    background: "#0a0a0f",
    position: "relative",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  gridPattern: {
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
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "rgba(17, 17, 24, 0.85)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "1rem 2rem",
  },
  headerContent: {
    maxWidth: "1400px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  logoIcon: {
    width: "48px",
    height: "48px",
    position: "relative",
  },
  logoText: {
    fontSize: "1.5rem",
    fontWeight: 600,
    color: "#f1f5f9",
    letterSpacing: "-0.01em",
  },
  navActions: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  navBtn: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1.25rem",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    color: "#f1f5f9",
    fontSize: "0.9375rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: "8px",
    right: "8px",
    width: "8px",
    height: "8px",
    background: "#dc2626",
    borderRadius: "50%",
    boxShadow: "0 0 10px rgba(220, 38, 38, 0.6)",
  },
  primaryBtn: {
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
    transition: "all 0.2s",
    boxShadow: "0 4px 16px rgba(220, 38, 38, 0.4)",
  },
  userMenu: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    cursor: "pointer",
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #dc2626, #991b1b)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "0.875rem",
    fontWeight: 600,
  },
  main: {
    position: "relative",
    zIndex: 1,
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "3rem 2rem",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1.5rem",
    marginBottom: "3rem",
  },
  statCard: {
    background: "rgba(17, 17, 24, 0.7)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "20px",
    padding: "2rem",
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
    transition: "all 0.3s",
    cursor: "pointer",
  },
  statIcon: {
    width: "80px",
    height: "80px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: "1.75rem",
    fontWeight: 700,
    color: "#f1f5f9",
    marginBottom: "0.25rem",
    letterSpacing: "-0.01em",
  },
  statLabel: {
    fontSize: "0.9375rem",
    color: "#94a3b8",
  },
  projectsSection: {
    marginTop: "2rem",
  },
  projectsHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "2rem",
  },
  projectsTitle: {
    fontSize: "2rem",
    fontWeight: 700,
    color: "#f1f5f9",
    letterSpacing: "-0.02em",
  },
  sortBtn: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1.25rem",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    color: "#f1f5f9",
    fontSize: "0.9375rem",
    fontWeight: 500,
    cursor: "pointer",
  },
  sortMenu: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    background: "rgba(17, 17, 24, 0.98)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "14px",
    padding: "0.5rem",
    minWidth: "180px",
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  sortOption: {
    width: "100%",
    padding: "0.75rem 1rem",
    textAlign: "left",
    background: "transparent",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "0.9375rem",
    fontWeight: 500,
    transition: "all 0.2s",
  },
  projectsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(450px, 1fr))",
    gap: "1.5rem",
  },
  projectCard: {
    background: "rgba(17, 17, 24, 0.7)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "20px",
    padding: "2rem",
    cursor: "pointer",
    transition: "all 0.3s",
    position: "relative",
  },
  projectIcon: {
    width: "80px",
    height: "80px",
    borderRadius: "16px",
    background:
      "linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(153, 27, 27, 0.2))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "1.5rem",
  },
  projectContent: {
    marginBottom: "1.5rem",
  },
  projectTitle: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#f1f5f9",
    marginBottom: "0.75rem",
    letterSpacing: "-0.01em",
  },
  projectDesc: {
    fontSize: "1rem",
    color: "#94a3b8",
    lineHeight: 1.6,
    marginBottom: "1rem",
  },
  projectFooter: {
    paddingTop: "1rem",
    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
  },
  projectDate: {
    fontSize: "0.9375rem",
    color: "#94a3b8",
  },
  viewTasksBtn: {
    width: "100%",
    padding: "0.875rem",
    background: "rgba(220, 38, 38, 0.15)",
    border: "1px solid rgba(220, 38, 38, 0.3)",
    borderRadius: "12px",
    color: "#dc2626",
    fontSize: "0.9375rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    padding: "4rem",
  },
  spinner: {
    width: "48px",
    height: "48px",
    border: "3px solid #1a1a24",
    borderTop: "3px solid #dc2626",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  emptyState: {
    background: "rgba(17, 17, 24, 0.7)",
    backdropFilter: "blur(16px)",
    border: "2px dashed rgba(255, 255, 255, 0.12)",
    borderRadius: "24px",
    padding: "5rem 2rem",
    textAlign: "center",
  },
  emptyIcon: {
    width: "88px",
    height: "88px",
    borderRadius: "22px",
    background: "linear-gradient(135deg, #dc2626, #991b1b)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    margin: "0 auto 1.75rem",
    boxShadow: "0 12px 36px rgba(220, 38, 38, 0.35)",
  },
  emptyTitle: {
    fontSize: "1.625rem",
    fontWeight: 700,
    color: "#f1f5f9",
    marginBottom: "0.75rem",
  },
  emptyText: {
    fontSize: "1.0625rem",
    color: "#94a3b8",
    marginBottom: "2.25rem",
    maxWidth: "420px",
    margin: "0 auto 2.25rem",
  },
};

export default UserProfile;
