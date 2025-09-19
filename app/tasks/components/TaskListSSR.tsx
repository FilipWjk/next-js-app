'use client';

import { useState } from 'react';
import { TaskList } from '@/components/TaskList';
import { Task } from '@/types/task';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { useTaskOperations } from '../../hooks/useTaskOperations';

interface TaskListSSRProps {
  initialTasks: Task[];
}

export function TaskListSSR({ initialTasks }: TaskListSSRProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const { busy, createTask, updateTask, deleteTask } = useTaskOperations({
    onSuccess: {
      create: (newTask) => setTasks((prev) => [newTask, ...prev]),
      update: (updatedTask) =>
        setTasks((prev) =>
          prev.map((task) => (task.id === updatedTask.id ? { ...task, ...updatedTask } : task)),
        ),
      delete: (taskId) => setTasks((prev) => prev.filter((task) => task.id !== taskId)),
    },
  });

  const handleTaskUpdate = async (updatedTask: Task) => {
    await updateTask(updatedTask.id, {
      title: updatedTask.title,
      description: updatedTask.description,
      status: updatedTask.status,
      priority: updatedTask.priority,
      dueDate: updatedTask.dueDate,
    });
  };

  const handleTaskDelete = async (taskId: string) => {
    await deleteTask(taskId);
  };

  const handleTaskCreate = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    await createTask(taskData);
  };

  return (
    <div className="space-y-6 relative">
      <LoadingOverlay
        isVisible={!!busy}
        message={
          busy === 'create'
            ? 'Creating task...'
            : busy === 'update'
            ? 'Updating task...'
            : busy === 'delete'
            ? 'Deleting task...'
            : undefined
        }
      />
      <TaskList
        tasks={tasks}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
        onTaskCreate={handleTaskCreate}
      />
    </div>
  );
}
