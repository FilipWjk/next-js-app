import { Task, TaskStatus, TaskPriority } from './task';

export interface CreateTaskRequest {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
}

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: unknown;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface CreateTaskResponse extends ApiSuccessResponse<Task> {}
export interface UpdateTaskResponse extends ApiSuccessResponse<Task> {}
export interface DeleteTaskResponse extends ApiSuccessResponse<{ id: string }> {}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationErrorResponse extends ApiErrorResponse {
  errors: ValidationError[];
}
