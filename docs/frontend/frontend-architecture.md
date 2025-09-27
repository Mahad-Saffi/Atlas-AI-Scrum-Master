# Frontend Architecture & Design

## Document Information
- **Version:** 1.0
- **Date:** September 27, 2025
- **Author:** Mahad Saffi (Project Lead/Author)
- **Related:** [Architecture Overview](architecture.md), [API Design](api-design.md)
- **Target Audience:** Frontend Developers (Primary), QA Engineers (Component testing)
- **Phase Relevance:** Phase 1 (Important), Phase 2 (Critical), Phase 3 (Performance optimization)
- **Reading Time:** 20 minutes

## Frontend Overview

### Technology Foundation
- **Framework:** React 18.2.0 with TypeScript 5.2.2
- **Build Tool:** Vite 4.4.9 for fast development and builds
- **Styling:** Tailwind CSS 3.3.0 for utility-first styling
- **State Management:** React Context + useReducer pattern
- **HTTP Client:** Axios 1.5.0 with interceptors
- **WebSocket:** Native WebSocket API with reconnection logic

### Architecture Principles
1. **Component Composition** - Build complex UIs from simple, reusable components
2. **Type Safety** - TypeScript everywhere with strict type checking
3. **State Locality** - Keep state as close to usage as possible
4. **Performance First** - Code splitting, lazy loading, and memoization
5. **Accessibility** - WCAG 2.1 AA compliance built-in
6. **Responsive Design** - Mobile-first with flexible layouts

## Project Structure

### Directory Organization
```
src/
├── components/           # Reusable UI components
│   ├── common/          # Generic components (Button, Modal, etc.)
│   ├── forms/           # Form-specific components
│   ├── layout/          # Layout components (Header, Sidebar, etc.)
│   └── ui/              # Low-level UI primitives
├── pages/               # Page-level components
│   ├── Dashboard/       # Dashboard page and subcomponents
│   ├── Tasks/           # Task management pages
│   ├── Chat/            # Chat interface
│   └── Settings/        # User settings
├── hooks/               # Custom React hooks
├── context/             # React context providers
├── services/            # API services and external integrations
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── styles/              # Global styles and Tailwind config
└── __tests__/           # Test files
```

## Component Architecture

### Component Hierarchy
```
App
├── AuthProvider
├── ThemeProvider
└── Router
    ├── ProtectedRoute
    │   ├── Layout
    │   │   ├── Header
    │   │   ├── Sidebar
    │   │   └── MainContent
    │   │       ├── Dashboard
    │   │       ├── TaskBoard
    │   │       ├── ChatPanel
    │   │       └── TriagePanel
    │   └── NotificationProvider
    └── PublicRoute
        └── LoginPage
```

### Base Component Pattern
```typescript
// components/common/Button.tsx
import React from 'react';
import { cn } from '@/utils/classNames';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
};
```

## State Management

### Authentication Context
```typescript
// context/AuthContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthService } from '@/services/auth';
import { User } from '@/types/user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'TOKEN_REFRESH'; payload: User };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload, isAuthenticated: true, isLoading: false, error: null };
    case 'LOGIN_ERROR':
      return { ...state, error: action.payload, isLoading: false, isAuthenticated: false };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    case 'TOKEN_REFRESH':
      return { ...state, user: action.payload, isAuthenticated: true };
    default:
      return state;
  }
};

interface AuthContextValue extends AuthState {
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async () => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const loginUrl = await AuthService.getGitHubLoginUrl();
      window.location.href = loginUrl;
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: 'Failed to initiate login' });
    }
  };

  const logout = () => {
    AuthService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  // Token refresh logic
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = AuthService.getToken();
        if (token) {
          const user = await AuthService.getCurrentUser();
          dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        } else {
          dispatch({ type: 'LOGOUT' });
        }
      } catch (error) {
        dispatch({ type: 'LOGOUT' });
      }
    };

    initializeAuth();
  }, []);

  const value: AuthContextValue = {
    ...state,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### Task Management State
```typescript
// hooks/useTasks.ts
import { useState, useEffect, useCallback } from 'react';
import { TaskService } from '@/services/tasks';
import { Task, TaskStatus, TaskFilters } from '@/types/task';

interface UseTasksReturn {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  filters: TaskFilters;
  setFilters: (filters: TaskFilters) => void;
  createTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (id: number, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  refreshTasks: () => Promise<void>;
}

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({
    status: null,
    assignedRole: null,
    assignedUserId: null,
  });

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedTasks = await TaskService.getTasks(filters);
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const createTask = async (taskData: Partial<Task>) => {
    try {
      const newTask = await TaskService.createTask(taskData);
      setTasks(prev => [...prev, newTask]);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create task');
    }
  };

  const updateTask = async (id: number, updates: Partial<Task>) => {
    try {
      const updatedTask = await TaskService.updateTask(id, updates);
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await TaskService.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    isLoading,
    error,
    filters,
    setFilters,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks: fetchTasks,
  };
};
```

## Page Components

### Dashboard Page
```typescript
// pages/Dashboard/Dashboard.tsx
import React from 'react';
import { DashboardStats } from './DashboardStats';
import { RecentTasks } from './RecentTasks';
import { TeamActivity } from './TeamActivity';
import { QuickActions } from './QuickActions';

export const Dashboard: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's what's happening with your projects.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardStats />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RecentTasks />
        <TeamActivity />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <QuickActions />
      </div>
    </div>
  );
};
```

### Task Board Component
```typescript
// pages/Tasks/TaskBoard.tsx
import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useTasks } from '@/hooks/useTasks';
import { TaskCard } from './TaskCard';
import { TaskStatus } from '@/types/task';

const COLUMNS = [
  { id: 'todo' as TaskStatus, title: 'To Do', color: 'bg-gray-100' },
  { id: 'in_progress' as TaskStatus, title: 'In Progress', color: 'bg-blue-100' },
  { id: 'done' as TaskStatus, title: 'Done', color: 'bg-green-100' },
];

export const TaskBoard: React.FC = () => {
  const { tasks, updateTask, isLoading } = useTasks();

  const handleDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const taskId = parseInt(draggableId);
    const newStatus = destination.droppableId as TaskStatus;

    try {
      await updateTask(taskId, { status: newStatus });
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Task Board</h1>
        <p className="text-gray-600">Drag and drop tasks to update their status</p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map(column => (
            <div key={column.id} className={`rounded-lg p-4 ${column.color}`}>
              <h3 className="font-semibold text-gray-900 mb-4">
                {column.title}
                <span className="ml-2 bg-white px-2 py-1 rounded-full text-xs">
                  {getTasksByStatus(column.id).length}
                </span>
              </h3>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[200px] transition-colors ${
                      snapshot.isDraggingOver ? 'bg-white bg-opacity-50' : ''
                    }`}
                  >
                    {getTasksByStatus(column.id).map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`mb-3 ${
                              snapshot.isDragging ? 'rotate-3 scale-105' : ''
                            } transition-transform`}
                          >
                            <TaskCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};
```

## Real-Time Features

### WebSocket Hook
```typescript
// hooks/useWebSocket.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

interface WebSocketMessage {
  type: string;
  data: any;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  sendMessage: (message: WebSocketMessage) => void;
  lastMessage: WebSocketMessage | null;
}

export const useWebSocket = (url: string): UseWebSocketReturn => {
  const { user, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    if (!isAuthenticated || !user) return;

    const token = localStorage.getItem('auth_token');
    const wsUrl = `${url}/${user.id}?token=${token}`;

    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    };

    ws.current.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);
      setLastMessage(message);
    };

    ws.current.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
      
      // Reconnect after 3 seconds
      reconnectTimeoutRef.current = setTimeout(connect, 3000);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };
  }, [url, user, isAuthenticated]);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (ws.current && isConnected) {
      ws.current.send(JSON.stringify(message));
    }
  }, [isConnected]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);

  return {
    isConnected,
    sendMessage,
    lastMessage,
  };
};
```

### Chat Component
```typescript
// pages/Chat/ChatPanel.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useChatMessages } from '@/hooks/useChatMessages';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { UserList } from './UserList';

export const ChatPanel: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, sendMessage, isLoading } = useChatMessages(selectedUser);
  const { isConnected, lastMessage } = useWebSocket('ws://localhost:8000/ws');

  // Handle real-time messages
  useEffect(() => {
    if (lastMessage?.type === 'chat_message') {
      // Message will be automatically added via useChatMessages hook
    }
  }, [lastMessage]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    try {
      await sendMessage({
        recipient_id: selectedUser,
        message: content,
        message_type: 'text',
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="flex h-full">
      {/* User List */}
      <div className="w-1/4 border-r border-gray-200">
        <UserList
          selectedUserId={selectedUser}
          onUserSelect={setSelectedUser}
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Connection Status */}
        {!isConnected && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
            <p className="text-sm text-yellow-700">
              Reconnecting to chat...
            </p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <ChatInput onSend={handleSendMessage} disabled={!isConnected} />
        </div>
      </div>
    </div>
  );
};
```

## API Service Layer

### Base API Service
```typescript
// services/api.ts
import axios, { AxiosInstance, AxiosResponse } from 'axios';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:8000/api/v1',
      timeout: 10000,
    });

    // Request interceptor for auth token
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, redirect to login
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, params?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.api.put(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await this.api.delete(url);
    return response.data;
  }
}

export const apiService = new ApiService();
```

## Performance Optimization

### Code Splitting
```typescript
// App.tsx with lazy loading
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

// Lazy load page components
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const TaskBoard = React.lazy(() => import('@/pages/Tasks/TaskBoard'));
const ChatPanel = React.lazy(() => import('@/pages/Chat/ChatPanel'));
const Settings = React.lazy(() => import('@/pages/Settings'));

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<TaskBoard />} />
            <Route path="/chat" element={<ChatPanel />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
};
```

### Memoization Strategy
```typescript
// hooks/useOptimizedTasks.ts
import { useMemo } from 'react';
import { Task, TaskStatus } from '@/types/task';

export const useOptimizedTasks = (tasks: Task[], filters: any) => {
  // Memoize filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filters.status && task.status !== filters.status) return false;
      if (filters.assignedRole && task.assigned_role !== filters.assignedRole) return false;
      if (filters.assignedUserId && task.assigned_user_id !== filters.assignedUserId) return false;
      return true;
    });
  }, [tasks, filters]);

  // Memoize tasks by status
  const tasksByStatus = useMemo(() => {
    return {
      todo: filteredTasks.filter(task => task.status === 'todo'),
      in_progress: filteredTasks.filter(task => task.status === 'in_progress'),
      done: filteredTasks.filter(task => task.status === 'done'),
    };
  }, [filteredTasks]);

  // Memoize statistics
  const statistics = useMemo(() => {
    return {
      total: filteredTasks.length,
      completed: tasksByStatus.done.length,
      inProgress: tasksByStatus.in_progress.length,
      overdue: filteredTasks.filter(task => 
        new Date(task.end_date) < new Date() && task.status !== 'done'
      ).length,
    };
  }, [filteredTasks, tasksByStatus]);

  return {
    filteredTasks,
    tasksByStatus,
    statistics,
  };
};
```

## Testing Strategy

### Component Testing
```typescript
// __tests__/components/Button.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/common/Button';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveClass('opacity-50');
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="danger">Delete</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-red-600');
  });
});
```

### Hook Testing
```typescript
// __tests__/hooks/useTasks.test.ts
import { renderHook, act } from '@testing-library/react';
import { useTasks } from '@/hooks/useTasks';
import { TaskService } from '@/services/tasks';

// Mock the TaskService
jest.mock('@/services/tasks');
const mockTaskService = TaskService as jest.Mocked<typeof TaskService>;

describe('useTasks Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches tasks on mount', async () => {
    const mockTasks = [
      { id: 1, title: 'Test Task', status: 'todo' },
      { id: 2, title: 'Another Task', status: 'done' },
    ];
    mockTaskService.getTasks.mockResolvedValue(mockTasks);

    const { result, waitForNextUpdate } = renderHook(() => useTasks());

    expect(result.current.isLoading).toBe(true);
    await waitForNextUpdate();

    expect(result.current.tasks).toEqual(mockTasks);
    expect(result.current.isLoading).toBe(false);
  });

  it('creates new task', async () => {
    const newTask = { id: 3, title: 'New Task', status: 'todo' };
    mockTaskService.createTask.mockResolvedValue(newTask);
    mockTaskService.getTasks.mockResolvedValue([]);

    const { result, waitForNextUpdate } = renderHook(() => useTasks());
    await waitForNextUpdate(); // Wait for initial fetch

    await act(async () => {
      await result.current.createTask({ title: 'New Task' });
    });

    expect(result.current.tasks).toContain(newTask);
  });
});
```

## Accessibility Features

### ARIA Implementation
```typescript
// components/common/Modal.tsx
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
        tabIndex={-1}
      >
        <h2 id="modal-title" className="text-lg font-semibold mb-4">
          {title}
        </h2>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close modal"
        >
          <span className="sr-only">Close</span>
          ×
        </button>
        
        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
};
```

## Build Configuration

### Vite Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@hello-pangea/dnd', 'axios'],
        },
      },
    },
    target: 'es2020',
    minify: 'terser',
    sourcemap: true,
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://localhost:8000',
        ws: true,
      },
    },
  },
});
```

Ready for frontend implementation! ⚛️
