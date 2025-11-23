import React, { useState, useMemo } from 'react';
import { taskService } from '../../services/taskService';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  assignee_id?: string;
  due_date?: string;
  estimate_hours?: number;
  progress_percentage?: number;
  risk_level?: string;
}

interface TaskBoardProps {
  tasks: Task[];
  onTaskUpdate?: () => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, onTaskUpdate }) => {
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

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

  // Filter and search tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchQuery, statusFilter]);

  const columns = {
    'To Do': { tasks: filteredTasks.filter(task => task.status === 'To Do'), emoji: '📝' },
    'In Progress': { tasks: filteredTasks.filter(task => task.status === 'In Progress'), emoji: '⚡' },
    'Done': { tasks: filteredTasks.filter(task => task.status === 'Done'), emoji: '✅' },
  };

  return (
    <div style={{
      fontFamily: '"Segoe Print", "Comic Sans MS", cursive',
    }}>
      {/* Search and Filter Bar */}
      <div style={{
        marginBottom: '30px',
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        {/* Search Input */}
        <div style={{ flex: '1', minWidth: '250px' }}>
          <input
            type="text"
            placeholder="🔍 Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '16px',
              border: '2px solid #1a1a1a',
              backgroundColor: 'white',
              boxShadow: '3px 3px 0 #1a1a1a',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = '4px 4px 0 #2563eb';
              e.currentTarget.style.borderColor = '#2563eb';
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = '3px 3px 0 #1a1a1a';
              e.currentTarget.style.borderColor = '#1a1a1a';
            }}
          />
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#1a1a1a',
          }}>
            Filter:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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
            <option value="all">All Tasks</option>
            <option value="To Do">📝 To Do</option>
            <option value="In Progress">⚡ In Progress</option>
            <option value="Done">✅ Done</option>
          </select>
        </div>

        {/* Clear Filters */}
        {(searchQuery || statusFilter !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              border: '2px solid #1a1a1a',
              backgroundColor: 'white',
              boxShadow: '3px 3px 0 #1a1a1a',
              fontFamily: 'inherit',
              cursor: 'pointer',
              fontWeight: 'bold',
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
            🔄 Clear Filters
          </button>
        )}

        {/* Results Count */}
        <div style={{
          fontSize: '14px',
          color: '#4a4a4a',
          padding: '10px 16px',
          border: '2px dashed #1a1a1a',
          backgroundColor: '#f5f5f5',
        }}>
          Showing {filteredTasks.length} of {tasks.length} tasks
        </div>
      </div>

      {/* Task Columns */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
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
                role="article"
                tabIndex={0}
                aria-label={`Task: ${task.title}. Status: ${status}. ${task.risk_level ? `Risk level: ${task.risk_level}` : ''}`}
                style={{ 
                  backgroundColor: 'white',
                  border: '2px solid #1a1a1a',
                  boxShadow: '4px 4px 0 #1a1a1a',
                  padding: '16px',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  borderLeft: task.risk_level === 'high' ? '6px solid #ff4444' : 
                             task.risk_level === 'medium' ? '6px solid #ffaa00' : 
                             '2px solid #1a1a1a',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translate(2px, 2px)';
                  e.currentTarget.style.boxShadow = '2px 2px 0 #1a1a1a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translate(0, 0)';
                  e.currentTarget.style.boxShadow = '4px 4px 0 #1a1a1a';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const button = e.currentTarget.querySelector('button');
                    if (button) button.focus();
                  }
                }}
              >
                {/* Risk Badge */}
                {task.risk_level && task.risk_level !== 'low' && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    padding: '4px 8px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    backgroundColor: task.risk_level === 'high' ? '#ff4444' : '#ffaa00',
                    color: 'white',
                    border: '2px solid #1a1a1a',
                  }}>
                    {task.risk_level === 'high' ? '⚠️ HIGH RISK' : '⚡ AT RISK'}
                  </div>
                )}

                {/* Task Title */}
                <div style={{ 
                  color: '#1a1a1a',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  lineHeight: '1.4',
                  paddingRight: task.risk_level && task.risk_level !== 'low' ? '100px' : '0',
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

                {/* Progress Bar */}
                {task.progress_percentage !== undefined && task.progress_percentage > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{
                      fontSize: '12px',
                      color: '#4a4a4a',
                      marginBottom: '4px',
                      fontWeight: 'bold',
                    }}>
                      Progress: {task.progress_percentage}%
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      border: '2px solid #1a1a1a',
                      backgroundColor: '#f5f5f5',
                    }}>
                      <div style={{
                        width: `${task.progress_percentage}%`,
                        height: '100%',
                        backgroundColor: '#1a1a1a',
                        transition: 'width 0.3s ease',
                      }} />
                    </div>
                  </div>
                )}

                {/* Due Date & Estimate */}
                {(task.due_date || task.estimate_hours) && (
                  <div style={{
                    fontSize: '12px',
                    color: '#4a4a4a',
                    marginBottom: '12px',
                    display: 'flex',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}>
                    {task.due_date && (
                      <div>
                        📅 Due: {new Date(task.due_date).toLocaleDateString()}
                      </div>
                    )}
                    {task.estimate_hours && (
                      <div>
                        ⏱️ Est: {task.estimate_hours}h
                      </div>
                    )}
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
    </div>
  );
};

export default TaskBoard;
