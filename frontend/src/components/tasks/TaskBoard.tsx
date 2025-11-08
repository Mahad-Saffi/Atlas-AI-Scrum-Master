import React, { useState } from 'react';
import { taskService } from '../../services/taskService';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  assignee_id?: string;
}

interface TaskBoardProps {
  tasks: Task[];
  onTaskUpdate?: () => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, onTaskUpdate }) => {
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);

  const handleCompleteTask = async (taskId: string) => {
    try {
      setCompletingTaskId(taskId);
      await taskService.completeTask(taskId);
      if (onTaskUpdate) {
        onTaskUpdate();
      }
    } catch (error) {
      console.error('Failed to complete task:', error);
      alert('Failed to complete task. Please try again.');
    } finally {
      setCompletingTaskId(null);
    }
  };

  const columns = {
    'To Do': tasks.filter(task => task.status === 'To Do'),
    'In Progress': tasks.filter(task => task.status === 'In Progress'),
    'Done': tasks.filter(task => task.status === 'Done'),
  };

  return (
    <div style={{ 
      display: 'flex', 
      gap: '20px', 
      padding: '20px',
      backgroundColor: '#0d1b2a',
      minHeight: '100vh'
    }}>
      {Object.entries(columns).map(([status, tasksInStatus]) => (
        <div 
          key={status} 
          style={{ 
            flex: 1,
            backgroundColor: 'rgba(27, 38, 59, 0.6)',
            border: '1px solid rgba(119, 141, 169, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            minHeight: '400px'
          }}
        >
          <h2 style={{ 
            textAlign: 'center',
            color: '#e0e1dd',
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: '2px solid rgba(119, 141, 169, 0.3)'
          }}>
            {status}
            <span style={{
              marginLeft: '8px',
              fontSize: '14px',
              color: '#778da9',
              fontWeight: '400'
            }}>
              ({tasksInStatus.length})
            </span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tasksInStatus.map(task => (
              <div 
                key={task.id} 
                style={{ 
                  backgroundColor: 'rgba(224, 225, 221, 0.05)',
                  border: '1px solid rgba(119, 141, 169, 0.2)',
                  borderRadius: '8px',
                  padding: '12px',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(224, 225, 221, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(119, 141, 169, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(224, 225, 221, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(119, 141, 169, 0.2)';
                }}
              >
                <div style={{ 
                  color: '#e0e1dd',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px'
                }}>
                  {task.title}
                </div>
                {task.description && (
                  <div style={{ 
                    color: '#778da9',
                    fontSize: '12px',
                    marginBottom: '8px'
                  }}>
                    {task.description}
                  </div>
                )}
                {status !== 'Done' && (
                  <button
                    onClick={() => handleCompleteTask(task.id)}
                    disabled={completingTaskId === task.id}
                    style={{
                      width: '100%',
                      padding: '8px',
                      backgroundColor: completingTaskId === task.id 
                        ? 'rgba(119, 141, 169, 0.3)' 
                        : 'rgba(119, 141, 169, 0.6)',
                      color: '#e0e1dd',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: completingTaskId === task.id ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (completingTaskId !== task.id) {
                        e.currentTarget.style.backgroundColor = 'rgba(119, 141, 169, 0.8)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (completingTaskId !== task.id) {
                        e.currentTarget.style.backgroundColor = 'rgba(119, 141, 169, 0.6)';
                      }
                    }}
                  >
                    {completingTaskId === task.id ? 'Completing...' : 'Mark as Complete'}
                  </button>
                )}
              </div>
            ))}
            {tasksInStatus.length === 0 && (
              <div style={{
                color: '#778da9',
                fontSize: '14px',
                textAlign: 'center',
                padding: '20px',
                fontStyle: 'italic'
              }}>
                No tasks
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskBoard;
