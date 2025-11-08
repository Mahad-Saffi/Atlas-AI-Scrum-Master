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
    'To Do': { tasks: tasks.filter(task => task.status === 'To Do'), emoji: '📝' },
    'In Progress': { tasks: tasks.filter(task => task.status === 'In Progress'), emoji: '⚡' },
    'Done': { tasks: tasks.filter(task => task.status === 'Done'), emoji: '✅' },
  };

  return (
    <div style={{ 
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px',
      fontFamily: '"Segoe Print", "Comic Sans MS", cursive',
    }}>
      {Object.entries(columns).map(([status, { tasks: tasksInStatus, emoji }]) => (
        <div 
          key={status} 
          style={{ 
            backgroundColor: '#f5f5f5',
            border: '3px solid #1a1a1a',
            boxShadow: '6px 6px 0 #1a1a1a',
            padding: '20px',
            minHeight: '400px',
            position: 'relative',
          }}
        >
          {/* Column Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '20px',
            paddingBottom: '16px',
            borderBottom: '2px dashed #1a1a1a',
          }}>
            <div style={{
              fontSize: '32px',
              marginBottom: '8px',
            }}>
              {emoji}
            </div>
            <h2 style={{ 
              color: '#1a1a1a',
              fontSize: '22px',
              fontWeight: 'bold',
              margin: '0 0 4px 0',
            }}>
              {status}
            </h2>
            <span style={{
              fontSize: '14px',
              color: '#4a4a4a',
              fontWeight: '400'
            }}>
              {tasksInStatus.length} {tasksInStatus.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>

          {/* Tasks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {tasksInStatus.map(task => (
              <div 
                key={task.id} 
                style={{ 
                  backgroundColor: 'white',
                  border: '2px solid #1a1a1a',
                  boxShadow: '4px 4px 0 #1a1a1a',
                  padding: '16px',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  position: 'relative',
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
                {/* Task Title */}
                <div style={{ 
                  color: '#1a1a1a',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  lineHeight: '1.4',
                }}>
                  {task.title}
                </div>

                {/* Task Description */}
                {task.description && (
                  <div style={{ 
                    color: '#4a4a4a',
                    fontSize: '14px',
                    marginBottom: '12px',
                    lineHeight: '1.5',
                  }}>
                    {task.description}
                  </div>
                )}

                {/* Complete Button */}
                {status !== 'Done' && (
                  <button
                    onClick={() => handleCompleteTask(task.id)}
                    disabled={completingTaskId === task.id}
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: 'white',
                      color: '#1a1a1a',
                      border: '2px solid #1a1a1a',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: completingTaskId === task.id ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '2px 2px 0 #1a1a1a',
                      fontFamily: 'inherit',
                      opacity: completingTaskId === task.id ? 0.5 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (completingTaskId !== task.id) {
                        e.currentTarget.style.transform = 'translate(1px, 1px)';
                        e.currentTarget.style.boxShadow = '1px 1px 0 #1a1a1a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (completingTaskId !== task.id) {
                        e.currentTarget.style.transform = 'translate(0, 0)';
                        e.currentTarget.style.boxShadow = '2px 2px 0 #1a1a1a';
                      }
                    }}
                  >
                    {completingTaskId === task.id ? '⏳ Completing...' : '✓ Mark as Complete'}
                  </button>
                )}

                {/* Done Badge */}
                {status === 'Done' && (
                  <div style={{
                    textAlign: 'center',
                    padding: '8px',
                    backgroundColor: '#f5f5f5',
                    border: '2px dashed #1a1a1a',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#4a4a4a',
                  }}>
                    ✓ Completed
                  </div>
                )}
              </div>
            ))}

            {/* Empty State */}
            {tasksInStatus.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#4a4a4a',
                fontSize: '16px',
                border: '2px dashed #1a1a1a',
                backgroundColor: 'white',
              }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
                <div>No tasks here yet</div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskBoard;
