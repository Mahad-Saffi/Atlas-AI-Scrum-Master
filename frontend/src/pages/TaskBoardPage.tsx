import React, { useState, useEffect } from 'react';
import TaskBoard from '../components/tasks/TaskBoard';
import { taskService } from '../services/taskService';
import NotificationBell from '../components/NotificationBell';

interface Task {
  id: string;
  title: string;
  status: string;
  description?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
}

const TaskBoardPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await taskService.getProjects();
        setProjects(fetchedProjects);
        
        // Auto-select the first project
        if (fetchedProjects.length > 0) {
          setSelectedProjectId(fetchedProjects[0].id);
        } else {
          setError('No projects found. Create a project first!');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to fetch projects');
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
        console.error('Error fetching tasks:', err);
        setError('Failed to fetch tasks');
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
            Loading your tasks...
          </h2>
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#fefefe',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Segoe Print", "Comic Sans MS", cursive',
        padding: '20px',
      }}>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          border: '3px solid #1a1a1a',
          backgroundColor: 'white',
          boxShadow: '8px 8px 0 #1a1a1a',
          maxWidth: '500px',
        }}>
          <div style={{
            fontSize: '64px',
            marginBottom: '20px',
          }}>
            😕
          </div>
          <h2 style={{
            fontSize: '28px',
            color: '#1a1a1a',
            marginBottom: '12px',
          }}>
            Oops!
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#4a4a4a',
            marginBottom: '24px',
          }}>
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
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
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(2px, 2px)';
              e.currentTarget.style.boxShadow = '2px 2px 0 #1a1a1a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(0, 0)';
              e.currentTarget.style.boxShadow = '4px 4px 0 #1a1a1a';
            }}
          >
            🔄 Try Again
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
      {/* Notification Bell - Top Right */}
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
          📋 Task Board
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

      {/* Project Selector */}
      {projects.length > 0 && (
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto 30px',
          textAlign: 'center',
        }}>
          <label style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#1a1a1a',
            marginRight: '12px',
          }}>
            Select Project:
          </label>
          <select
            value={selectedProjectId || ''}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            style={{
              padding: '10px 16px',
              fontSize: '16px',
              border: '2px solid #1a1a1a',
              backgroundColor: 'white',
              boxShadow: '3px 3px 0 #1a1a1a',
              fontFamily: 'inherit',
              cursor: 'pointer',
            }}
          >
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Task Board Container */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        border: '3px solid #1a1a1a',
        backgroundColor: 'white',
        boxShadow: '8px 8px 0 #1a1a1a',
        padding: '30px',
        position: 'relative',
      }}>
        {/* Corner decorations */}
        <div style={{
          position: 'absolute',
          top: '-3px',
          left: '-3px',
          width: '30px',
          height: '30px',
          border: '3px solid #1a1a1a',
          borderRight: 'none',
          borderBottom: 'none',
          backgroundColor: '#fefefe',
        }} />
        <div style={{
          position: 'absolute',
          top: '-3px',
          right: '-3px',
          width: '30px',
          height: '30px',
          border: '3px solid #1a1a1a',
          borderLeft: 'none',
          borderBottom: 'none',
          backgroundColor: '#fefefe',
        }} />
        
        <TaskBoard tasks={tasks} onTaskUpdate={handleTaskUpdate} />
      </div>

      {/* Back Button */}
      <div style={{
        textAlign: 'center',
        marginTop: '30px',
      }}>
        <button
          onClick={() => window.location.href = '/'}
          style={{
            backgroundColor: 'white',
            color: '#1a1a1a',
            border: '2px solid #1a1a1a',
            padding: '10px 24px',
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
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default TaskBoardPage;
