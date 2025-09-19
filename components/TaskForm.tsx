'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Task } from '@/types/task';
import { CreateTaskRequest, UpdateTaskRequest } from '@/types/api';
import { tasksApi, ApiError } from '@/lib/tasksApi';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (task: Task) => void | Promise<void>;
  initialTask?: Task;
}

interface FormErrors {
  [key: string]: string;
}

export function TaskForm({ isOpen, onClose, onSubmit, initialTask }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as Task['status'],
    priority: 'medium' as Task['priority'],
    dueDate: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState('');

  useEffect(() => {
    const dateOnly = (d?: string) => (d ? d.slice(0, 10) : '');
    setFormData({
      title: initialTask?.title || '',
      description: initialTask?.description || '',
      status: initialTask?.status || 'todo',
      priority: initialTask?.priority || 'medium',
      dueDate: dateOnly(initialTask?.dueDate),
    });
    setErrors({});
    setGeneralError('');
  }, [initialTask, isOpen]);

  const clearErrors = () => {
    setErrors({});
    setGeneralError('');
  };

  const handleApiError = (error: ApiError) => {
    if (error.errors && Array.isArray(error.errors)) {
      const validationErrors: FormErrors = {};
      error.errors.forEach((err: any) => {
        validationErrors[err.field] = err.message;
      });
      setErrors(validationErrors);
    } else {
      setGeneralError(error.message || 'An unexpected error occurred');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (!onSubmit) return;

    try {
      setSubmitting(true);
      const requestData: CreateTaskRequest | UpdateTaskRequest = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate || undefined,
      };
      const result = initialTask
        ? await tasksApi.update(initialTask.id, requestData)
        : await tasksApi.create(requestData as CreateTaskRequest);
      await onSubmit(result);
      onClose();
      setFormData({ title: '', description: '', status: 'todo', priority: 'medium', dueDate: '' });
    } catch (error) {
      if (error instanceof ApiError) handleApiError(error);
      else setGeneralError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleClose = () => {
    if (!submitting) {
      clearErrors();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={initialTask ? 'Edit Task' : 'Create New Task'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {generalError && (
          <div className="p-3 rounded-md bg-red-900/20 border border-red-500 text-red-300 text-sm">
            {generalError}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1 text-white">
            Title <span className="text-red-400">*</span>
          </label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Enter task title"
            className={errors.title ? 'border-red-500' : ''}
            required
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? 'title-error' : undefined}
          />
          {errors.title && (
            <p id="title-error" className="mt-1 text-sm text-red-400">
              {errors.title}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1 text-white">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter task description"
            className={`flex min-h-[80px] w-full rounded-md border ${
              errors.description ? 'border-red-500' : 'border-gray-600'
            } bg-gray-700 text-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50`}
            required
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? 'description-error' : undefined}
          />
          {errors.description && (
            <p id="description-error" className="mt-1 text-sm text-red-400">
              {errors.description}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1 text-white">
              Status <span className="text-red-400">*</span>
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className={`flex h-9 w-full rounded-md border ${
                errors.status ? 'border-red-500' : 'border-gray-600'
              } bg-gray-700 text-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50`}
              required
              aria-invalid={!!errors.status}
              aria-describedby={errors.status ? 'status-error' : undefined}
            >
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            {errors.status && (
              <p id="status-error" className="mt-1 text-sm text-red-400">
                {errors.status}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="priority" className="block text-sm font-medium mb-1 text-white">
              Priority <span className="text-red-400">*</span>
            </label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              className={`flex h-9 w-full rounded-md border ${
                errors.priority ? 'border-red-500' : 'border-gray-600'
              } bg-gray-700 text-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50`}
              required
              aria-invalid={!!errors.priority}
              aria-describedby={errors.priority ? 'priority-error' : undefined}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {errors.priority && (
              <p id="priority-error" className="mt-1 text-sm text-red-400">
                {errors.priority}
              </p>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium mb-1 text-white">
            Due Date
          </label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            className={errors.dueDate ? 'border-red-500' : ''}
            aria-invalid={!!errors.dueDate}
            aria-describedby={errors.dueDate ? 'dueDate-error' : undefined}
          />
          {errors.dueDate && (
            <p id="dueDate-error" className="mt-1 text-sm text-red-400">
              {errors.dueDate}
            </p>
          )}
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="cursor-pointer border-red-400 text-red-300 hover:bg-red-900/20"
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting
              ? initialTask
                ? 'Updating...'
                : 'Creating...'
              : initialTask
              ? 'Update Task'
              : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
