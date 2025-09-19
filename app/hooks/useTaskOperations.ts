'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import { tasksApi } from '@/lib/tasksApi';
import { Task } from '@/types/task';

type OperationType = 'create' | 'update' | 'delete' | 'toggle';

interface UseTaskOperationsOptions {
  onSuccess?: {
    create?: (task: Task) => void;
    update?: (task: Task) => void;
    delete?: (taskId: string) => void;
  };
  redirectAfterDelete?: string;
}

export function useTaskOperations(options: UseTaskOperationsOptions = {}) {
  const [busy, setBusy] = useState<OperationType | null>(null);
  const toast = useToast();
  const router = useRouter();

  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setBusy('create');
      const created = await tasksApi.create(taskData);
      toast.success('Task created');
      options.onSuccess?.create?.(created);
      return created;
    } catch (error) {
      console.error('Create task failed', error);
      toast.error('Failed to create task');
      throw error;
    } finally {
      setBusy(null);
    }
  };

  const updateTask = async (
    taskId: string,
    updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>,
  ) => {
    try {
      setBusy('update');
      const updated = await tasksApi.update(taskId, updates);
      toast.success('Task updated');
      options.onSuccess?.update?.(updated);
      router.refresh();
      return updated;
    } catch (error) {
      console.error('Update task failed', error);
      toast.error('Failed to update task');
      throw error;
    } finally {
      setBusy(null);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      setBusy('delete');
      await tasksApi.delete(taskId);
      toast.success('Task deleted');
      options.onSuccess?.delete?.(taskId);
      if (options.redirectAfterDelete) {
        router.push(options.redirectAfterDelete);
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error('Delete task failed', error);
      toast.error('Failed to delete task');
      throw error;
    } finally {
      setBusy(null);
    }
  };

  const toggleTaskStatus = async (task: Task) => {
    const nextStatus = task.status === 'completed' ? 'todo' : 'completed';
    try {
      setBusy('toggle');
      const updated = await tasksApi.update(task.id, { status: nextStatus });
      toast.success(`Marked as ${nextStatus.replace('-', ' ')}`);
      options.onSuccess?.update?.(updated);
      router.refresh();
      return updated;
    } catch (error) {
      console.error('Toggle task status failed', error);
      toast.error('Failed to update status');
      throw error;
    } finally {
      setBusy(null);
    }
  };

  return {
    busy,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
  };
}
