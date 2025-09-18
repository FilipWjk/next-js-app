'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Modal } from './ui/modal';
import { Task } from '@/types/task';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void | Promise<void>;
  initialTask?: Task;
}

export function TaskForm({ isOpen, onClose, onSubmit, initialTask }: TaskFormProps) {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    status: Task['status'];
    priority: Task['priority'];
    dueDate: string;
  }>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
  });

  useEffect(() => {
    const dateOnly = (d?: string) => (d ? d.slice(0, 10) : '');
    setFormData({
      title: initialTask?.title || '',
      description: initialTask?.description || '',
      status: initialTask?.status || ('todo' as Task['status']),
      priority: initialTask?.priority || ('medium' as Task['priority']),
      dueDate: dateOnly(initialTask?.dueDate),
    });
  }, [initialTask]);

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSubmit) return;
    try {
      setSubmitting(true);
      await onSubmit(formData);
      onClose();
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: '',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={submitting ? () => {} : onClose}
      title={initialTask ? 'Edit Task' : 'Create New Task'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Title</label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Enter task title"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1 text-white">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter task description"
            className="flex min-h-[80px] w-full rounded-md border border-gray-600 bg-gray-700 text-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1 text-white">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="flex h-9 w-full rounded-md border border-gray-600 bg-gray-700 text-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium mb-1 text-white">
              Priority
            </label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              className="flex h-9 w-full rounded-md border border-gray-600 bg-gray-700 text-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-bold mb-1 text-white">
            Due Date
          </label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="cursor-pointer border-red-400 text-red-300"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 disabled:opacity-60"
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
