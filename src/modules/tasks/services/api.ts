import { apiClient, API_BASE_URL } from '../../../core/api/client';
import { Workspace } from '../../../core/workspace-sdk';
import type {
  Project, Task, TaskLabel, TaskMilestone,
  TaskChecklistItem, TaskComment, TaskTimeLog,
  TasksDashboardKPIs, TaskStatus
} from '../types';

const interceptError = async (promise: Promise<any>, path: string) => {
  try {
    return await promise;
  } catch (error: any) {
    const statusMatch = error.message?.match(/API Error (\d+):/);
    const status = statusMatch ? parseInt(statusMatch[1], 10) : 500;

    Workspace.events.publish('Tasks:APIError', {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
      status,
      message: error.message || 'Une erreur inattendue est survenue dans le module Tâches',
      path: `/tasks${path}`,
      timestamp: Date.now()
    });

    throw error;
  }
};

export const tasksApi = {
  // KPIs & Analytics
  getKPIs: async (): Promise<TasksDashboardKPIs> =>
    interceptError(apiClient.get('/tasks/dashboard-kpis/'), '/dashboard-kpis/'),

  // Projects
  getProjects: async (params?: Record<string, string>): Promise<Project[]> =>
    interceptError(apiClient.get('/tasks/projects/', { params }), '/projects/'),

  getProject: async (id: string): Promise<Project> =>
    interceptError(apiClient.get(`/tasks/projects/${id}/`), `/projects/${id}/`),

  createProject: async (data: Partial<Project>): Promise<Project> =>
    interceptError(apiClient.post('/tasks/projects/', data), '/projects/'),

  updateProject: async (id: string, data: Partial<Project>): Promise<Project> =>
    interceptError(apiClient.patch(`/tasks/projects/${id}/`, data), `/projects/${id}/`),

  deleteProject: async (id: string): Promise<void> =>
    interceptError(apiClient.delete(`/tasks/projects/${id}/`), `/projects/${id}/`),

  getProjectStats: async (id: string): Promise<any> =>
    interceptError(apiClient.get(`/tasks/projects/${id}/stats/`), `/projects/${id}/stats/`),

  // Tasks
  getTasks: async (params?: Record<string, string>): Promise<Task[]> =>
    interceptError(apiClient.get('/tasks/tasks/', { params }), '/tasks/'),

  getTask: async (id: string): Promise<Task> =>
    interceptError(apiClient.get(`/tasks/tasks/${id}/`), `/tasks/${id}/`),

  createTask: async (data: Partial<Task>): Promise<Task> =>
    interceptError(apiClient.post('/tasks/tasks/', data), '/tasks/'),

  updateTask: async (id: string, data: Partial<Task>): Promise<Task> =>
    interceptError(apiClient.patch(`/tasks/tasks/${id}/`, data), `/tasks/${id}/`),

  deleteTask: async (id: string): Promise<void> =>
    interceptError(apiClient.delete(`/tasks/tasks/${id}/`), `/tasks/${id}/`),

  changeTaskStatus: async (id: string, newStatus: TaskStatus, orderIndex?: number): Promise<Task> =>
    interceptError(apiClient.post(`/tasks/tasks/${id}/change_status/`, { status: newStatus, order_index: orderIndex }), `/tasks/${id}/change_status/`),

  addChecklistItem: async (taskId: string, title: string): Promise<TaskChecklistItem> =>
    interceptError(apiClient.post(`/tasks/tasks/${taskId}/add_checklist_item/`, { title }), `/tasks/${taskId}/add_checklist_item/`),

  toggleChecklistItem: async (taskId: string, itemId: string): Promise<TaskChecklistItem> =>
    interceptError(apiClient.post(`/tasks/tasks/${taskId}/toggle_checklist_item/`, { item_id: itemId }), `/tasks/${taskId}/toggle_checklist_item/`),

  addComment: async (taskId: string, content: string): Promise<TaskComment> =>
    interceptError(apiClient.post(`/tasks/tasks/${taskId}/add_comment/`, { content }), `/tasks/${taskId}/add_comment/`),

  logTime: async (taskId: string, data: { hours: number | string; description?: string; log_date?: string }): Promise<TaskTimeLog> =>
    interceptError(apiClient.post(`/tasks/tasks/${taskId}/log_time/`, data), `/tasks/${taskId}/log_time/`),

  getMyTasks: async (): Promise<Task[]> =>
    interceptError(apiClient.get('/tasks/tasks/my_tasks/'), '/tasks/my_tasks/'),

  // Milestones
  getMilestones: async (params?: Record<string, string>): Promise<TaskMilestone[]> =>
    interceptError(apiClient.get('/tasks/milestones/', { params }), '/milestones/'),

  createMilestone: async (data: Partial<TaskMilestone>): Promise<TaskMilestone> =>
    interceptError(apiClient.post('/tasks/milestones/', data), '/milestones/'),

  updateMilestone: async (id: string, data: Partial<TaskMilestone>): Promise<TaskMilestone> =>
    interceptError(apiClient.patch(`/tasks/milestones/${id}/`, data), `/milestones/${id}/`),

  deleteMilestone: async (id: string): Promise<void> =>
    interceptError(apiClient.delete(`/tasks/milestones/${id}/`), `/milestones/${id}/`),

  // Labels
  getLabels: async (): Promise<TaskLabel[]> =>
    interceptError(apiClient.get('/tasks/labels/'), '/labels/'),

  createLabel: async (data: Partial<TaskLabel>): Promise<TaskLabel> =>
    interceptError(apiClient.post('/tasks/labels/', data), '/labels/'),
};

export { API_BASE_URL };
