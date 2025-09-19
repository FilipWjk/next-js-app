import { Task } from '@/types/task';
import {
  CreateTaskRequest,
  UpdateTaskRequest,
  ApiResponse,
  ValidationError,
  ApiErrorResponse,
  ValidationErrorResponse,
} from '@/types/api';

export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
    public code?: string,
    public errors?: ValidationError[],
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleApiResponse<T>(response: Response): Promise<T> {
  const data: ApiResponse<T> = await response.json();

  if (!response.ok || !data.success) {
    const errorData = data as ApiErrorResponse;

    // * Check if it's a validation error response
    const validationErrors =
      'errors' in errorData ? (errorData as ValidationErrorResponse).errors : undefined;

    throw new ApiError(
      errorData.error || 'An unexpected error occurred',
      response.status,
      errorData.code,
      validationErrors,
    );
  }

  return data.data;
}

export const tasksApi = {
  async create(data: CreateTaskRequest): Promise<Task> {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleApiResponse<Task>(response);
  },

  async getById(id: string): Promise<Task> {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'GET',
    });
    return handleApiResponse<Task>(response);
  },

  async update(id: string, data: UpdateTaskRequest): Promise<Task> {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleApiResponse<Task>(response);
  },

  async delete(id: string): Promise<{ id: string }> {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
    return handleApiResponse<{ id: string }>(response);
  },
};
