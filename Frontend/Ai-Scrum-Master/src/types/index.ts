// User types
export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  role?: "admin" | "scrum_master" | "developer" | "product_owner";
  teamId?: string;
}

// Authentication types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Task types
export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "critical";
  assigneeId?: string;
  reporterId: string;
  sprintId?: string;
  estimatedHours?: number;
  actualHours?: number;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  tags: string[];
}

// Sprint types
export interface Sprint {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status: "planning" | "active" | "completed";
  teamId: string;
  goals: string[];
  tasks: Task[];
}

// Team types
export interface Team {
  id: string;
  name: string;
  description?: string;
  members: User[];
  scrumMasterId: string;
  productOwnerId?: string;
  currentSprintId?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
}

// Component Props types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "textarea" | "select" | "date";
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

// Chat/AI types
export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  type: "text" | "suggestion" | "task_update" | "sprint_update";
}

export interface AIInsight {
  id: string;
  type: "productivity" | "blocker" | "suggestion" | "risk";
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  actionable: boolean;
  relatedTaskIds?: string[];
  createdAt: Date;
}
