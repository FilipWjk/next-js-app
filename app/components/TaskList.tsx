'use client';

import { useState } from 'react';
import { TaskCard } from './TaskCard';
import { Task } from '@/types/task';
import { TaskForm } from './TaskForm';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface TaskListProps {
  tasks: Task[];
  onTaskUpdate: (task: Task) => void | Promise<void>;
  onTaskDelete: (taskId: string) => void | Promise<void>;
  onTaskCreate: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void | Promise<void>;
}

export function TaskList({ tasks, onTaskUpdate, onTaskDelete, onTaskCreate }: TaskListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Task['status'] | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Task['priority'] | 'all'>('all');

  // * Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      await onTaskUpdate({
        ...editingTask,
        ...taskData,
        updatedAt: new Date().toISOString(),
      });
    } else {
      await onTaskCreate(taskData);
    }
    setEditingTask(undefined);
  };

  const handleStatusChange = async (taskId: string, status: Task['status']) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      await onTaskUpdate({
        ...task,
        status,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(undefined);
  };

  // * Group tasks by status for kanban-style display
  const tasksByStatus = {
    todo: filteredTasks.filter((task) => task.status === 'todo'),
    'in-progress': filteredTasks.filter((task) => task.status === 'in-progress'),
    completed: filteredTasks.filter((task) => task.status === 'completed'),
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-white">Tasks</h1>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
        >
          Create New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="sm:max-w-xs"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as Task['status'] | 'all')}
          className="flex h-9 w-full rounded-md border border-gray-600 bg-gray-700 text-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 sm:max-w-[120px]"
        >
          <option value="all">All Status</option>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as Task['priority'] | 'all')}
          className="flex h-9 w-full rounded-md border border-gray-600 bg-gray-700 text-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 sm:max-w-[120px]"
        >
          <option value="all">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
          <div key={status} className="space-y-4">
            <h2 className="text-lg font-semibold capitalize text-white">
              {status.replace('-', ' ')} ({statusTasks.length})
            </h2>
            <div className="space-y-4">
              {statusTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={onTaskDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
              {statusTasks.length === 0 && (
                <div className="text-center py-8 text-gray-400">No tasks in this status</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Task Form Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        initialTask={editingTask}
      />
    </div>
  );
}
