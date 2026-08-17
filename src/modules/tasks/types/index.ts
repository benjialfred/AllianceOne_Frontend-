export type TaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'BLOCKED' | 'CANCELLED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type ProjectStatus = 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'ARCHIVED';

export interface TaskLabel {
  id: string;
  name: string;
  color: string;
  description?: string;
  created_at: string;
}

export interface TaskChecklistItem {
  id: string;
  task: string;
  title: string;
  is_completed: boolean;
  order_index: number;
  completed_at?: string;
  created_at: string;
}

export interface TaskComment {
  id: string;
  task: string;
  author?: string;
  author_name: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface TaskTimeLog {
  id: string;
  task: string;
  user?: string;
  user_name: string;
  hours: number | string;
  log_date: string;
  description?: string;
  created_at: string;
}

export interface TaskMilestone {
  id: string;
  project: string;
  project_name?: string;
  project_code?: string;
  name: string;
  description?: string;
  due_date?: string;
  is_reached: boolean;
  reached_at?: string;
  tasks_count?: number;
  created_at: string;
}

export interface Task {
  id: string;
  task_number: string;
  title: string;
  description?: string;
  project?: string;
  project_name?: string;
  project_code?: string;
  project_color?: string;
  milestone?: string;
  milestone_name?: string;
  status: TaskStatus;
  status_display: string;
  priority: TaskPriority;
  priority_display: string;
  assigned_to?: string;
  assigned_to_name: string;
  created_by?: string;
  created_by_name: string;
  labels?: string[];
  labels_details?: TaskLabel[];
  start_date?: string;
  due_date?: string;
  completed_at?: string;
  estimated_hours: number | string;
  logged_hours: number | string;
  order_index: number;
  is_overdue: boolean;
  checklist_total: number;
  checklist_completed: number;
  progress_percentage: number;
  checklist_items?: TaskChecklistItem[];
  comments?: TaskComment[];
  time_logs?: TaskTimeLog[];
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  code: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  status_display: string;
  priority: TaskPriority;
  priority_display: string;
  color: string;
  icon: string;
  start_date?: string;
  due_date?: string;
  budget_hours: number | string;
  manager?: string;
  manager_name: string;
  created_by?: string;
  created_by_name: string;
  total_tasks_count: number;
  completed_tasks_count: number;
  progress_percentage: number;
  total_logged_hours: number | string;
  milestones?: TaskMilestone[];
  created_at: string;
  updated_at: string;
}

export interface TasksDashboardKPIs {
  total_projects: number;
  active_projects: number;
  total_tasks: number;
  done_tasks: number;
  in_progress_tasks: number;
  todo_tasks: number;
  in_review_tasks: number;
  blocked_tasks: number;
  completion_rate: number;
  overdue_count: number;
  urgent_count: number;
  high_count: number;
  total_estimated_hours: number;
  total_logged_hours: number;
  status_distribution: {
    TODO: number;
    IN_PROGRESS: number;
    IN_REVIEW: number;
    DONE: number;
    BLOCKED: number;
  };
  recent_tasks: Task[];
  overdue_tasks: Task[];
}
