import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { taskService } from '../services/taskService';
import NotificationBell from '../components/NotificationBell';

interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

interface Task {
  id: string;
  title: string;
  status: string;
}

interface ProjectStats {
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  doneTasks: number;
  completionPercentage: number;
}

const ProjectDashboard: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch projects to get project details
        const projects = await taskService.getProjects();
        const currentProject = projects.find((p: Project) => p.id === projectId);
        
        if (currentProject) {
          setProject(currentProject);
        }

        // Fetch tasks
        if (projectId) {
          const fetchedTasks = await taskService.getTasks(projectId);

          // Calculate stats
          const todoCount = fetchedTasks.filter((t: Task) => t.status === 'To Do').length;
          const inProgressCount = fetchedTasks.filter((t: Task) => t.status === 'In Progress').length;
          const doneCount = fetchedTasks.filter((t: Task) => t.status === 'Done').length;
          const total = fetchedTasks.length;
          const completion = total > 0 ? Math.round((doneCount / total) * 100) : 0;

          setStats({
            totalTasks: total,
            todoTasks: todoCount,
            inProgressTasks: inProgressCount,
            doneTasks: doneCount,
            completionPercentage: completion,
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#fefefe',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Segoe Print", "Comic Sans MS", cursive',
      }}>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          border: '3px solid #1a1a1a',
          backgroundColor: 'white',
          boxShadow: '8px 8px 0 #1a1a1a',
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '20px',
            animation: 'spin 2s linear infinite',
          }}>
            ⏳
          </div>
          <h2 style={{
            fontSize: '24px',
            color: '#1a1a1a',
            margin: 0,
          }}>
            Loading dashboard...
          </h2>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#fefefe',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Segoe Print", "Comic Sans MS", cursive',
      }}>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          border: '3px solid #1a1a1a',
          backgroundColor: 'white',
          boxShadow: '8px 8px 0 #1a1a1a',
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>😕</div>
          <h2 style={{ fontSize: '28px', color: '#1a1a1a', marginBottom: '12px' }}>
            Project Not Found
          </h2>
          <button
            onClick={() => navigate('/')}
            style={{
              backgroundColor: 'white',
              color: '#1a1a1a',
              border: '3px solid #1a1a1a',
              padding: '12px 28px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '4px 4px 0 #1a1a1a',
              fontFamily: 'inherit',
              marginTop: '20px',
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fefefe',
      padding: '40px 20px',
      fontFamily: '"Segoe Print", "Comic Sans MS", cursive',
    }}>
      {/* Notification Bell */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 100,
      }}>
        <NotificationBell />
      </div>

      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#1a1a1a',
          marginBottom: '16px',
          textShadow: '3px 3px 0 rgba(0,0,0,0.1)',
        }}>
          📊 Project Dashboard
        </h1>
        <svg width="200" height="20" style={{ margin: '0 auto', display: 'block' }}>
          <path
            d="M 10 10 Q 50 5, 100 10 T 190 10"
            stroke="#1a1a1a"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {/* Project Info */}
        <div style={{
          backgroundColor: 'white',
          border: '3px solid #1a1a1a',
          boxShadow: '8px 8px 0 #1a1a1a',
          padding: '30px',
          marginBottom: '30px',
        }}>
          <h2 style={{
            fontSize: '32px',
            color: '#1a1a1a',
            marginBottom: '12px',
            fontWeight: 'bold',
          }}>
            {project.name}
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#4a4a4a',
            marginBottom: '0',
          }}>
            {project.description}
          </p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '30px',
          }}>
            {/* Total Tasks */}
            <div style={{
              backgroundColor: 'white',
              border: '3px solid #1a1a1a',
              boxShadow: '6px 6px 0 #1a1a1a',
              padding: '24px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📋</div>
              <div style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: '#1a1a1a',
                marginBottom: '8px',
              }}>
                {stats.totalTasks}
              </div>
              <div style={{ fontSize: '16px', color: '#4a4a4a' }}>
                Total Tasks
              </div>
            </div>

            {/* To Do */}
            <div style={{
              backgroundColor: 'white',
              border: '3px solid #1a1a1a',
              boxShadow: '6px 6px 0 #1a1a1a',
              padding: '24px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📝</div>
              <div style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: '#1a1a1a',
                marginBottom: '8px',
              }}>
                {stats.todoTasks}
              </div>
              <div style={{ fontSize: '16px', color: '#4a4a4a' }}>
                To Do
              </div>
            </div>

            {/* In Progress */}
            <div style={{
              backgroundColor: 'white',
              border: '3px solid #1a1a1a',
              boxShadow: '6px 6px 0 #1a1a1a',
              padding: '24px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚡</div>
              <div style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: '#1a1a1a',
                marginBottom: '8px',
              }}>
                {stats.inProgressTasks}
              </div>
              <div style={{ fontSize: '16px', color: '#4a4a4a' }}>
                In Progress
              </div>
            </div>

            {/* Done */}
            <div style={{
              backgroundColor: 'white',
              border: '3px solid #1a1a1a',
              boxShadow: '6px 6px 0 #1a1a1a',
              padding: '24px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
              <div style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: '#1a1a1a',
                marginBottom: '8px',
              }}>
                {stats.doneTasks}
              </div>
              <div style={{ fontSize: '16px', color: '#4a4a4a' }}>
                Done
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {stats && (
          <div style={{
            backgroundColor: 'white',
            border: '3px solid #1a1a1a',
            boxShadow: '6px 6px 0 #1a1a1a',
            padding: '30px',
            marginBottom: '30px',
          }}>
            <h3 style={{
              fontSize: '24px',
              color: '#1a1a1a',
              marginBottom: '20px',
              fontWeight: 'bold',
            }}>
              📈 Progress
            </h3>
            <div style={{
              width: '100%',
              height: '40px',
              border: '3px solid #1a1a1a',
              backgroundColor: '#f5f5f5',
              position: 'relative',
            }}>
              <div style={{
                width: `${stats.completionPercentage}%`,
                height: '100%',
                backgroundColor: '#1a1a1a',
                transition: 'width 0.5s ease',
              }} />
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '18px',
                fontWeight: 'bold',
                color: stats.completionPercentage > 50 ? 'white' : '#1a1a1a',
              }}>
                {stats.completionPercentage}%
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
        }}>
          <button
            onClick={() => navigate('/task-board')}
            style={{
              backgroundColor: 'white',
              color: '#1a1a1a',
              border: '3px solid #1a1a1a',
              padding: '14px 32px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '5px 5px 0 #1a1a1a',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(2px, 2px)';
              e.currentTarget.style.boxShadow = '3px 3px 0 #1a1a1a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(0, 0)';
              e.currentTarget.style.boxShadow = '5px 5px 0 #1a1a1a';
            }}
          >
            📋 View Task Board
          </button>

          <button
            onClick={() => navigate('/')}
            style={{
              backgroundColor: 'white',
              color: '#1a1a1a',
              border: '2px solid #1a1a1a',
              padding: '14px 32px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '3px 3px 0 #1a1a1a',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(1px, 1px)';
              e.currentTarget.style.boxShadow = '2px 2px 0 #1a1a1a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(0, 0)';
              e.currentTarget.style.boxShadow = '3px 3px 0 #1a1a1a';
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
