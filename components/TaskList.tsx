'use client';

import { useState } from 'react';
import { TaskCard } from '@/components/TaskCard';
import { Task } from '@/types/task';
import { TaskForm } from '@/components/TaskForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDragAndDrop } from '@/app/hooks/useDragAndDrop';
import { DragAndDropService } from '@/lib/dragAndDropService';

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

  // ? Use the drag and drop hook
  const {
    draggedTaskId,
    dragOverColumn,
    localTasks,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useDragAndDrop({ tasks, onTaskUpdate });

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      await onTaskUpdate({ ...editingTask, ...taskData, updatedAt: new Date().toISOString() });
    } else {
      await onTaskCreate(taskData);
    }
    setEditingTask(undefined);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(undefined);
  };

  const filteredTasks = localTasks.filter((task) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      task.title.toLowerCase().includes(search) || task.description.toLowerCase().includes(search);
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const tasksByStatus = {
    todo: filteredTasks.filter((t) => t.status === 'todo'),
    'in-progress': filteredTasks.filter((t) => t.status === 'in-progress'),
    completed: filteredTasks.filter((t) => t.status === 'completed'),
  } as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-white">Tasks</h1>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
        >
          Create New Task
        </Button>
      </div>
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
          <div key={status} className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg border border-gray-700">
              <h2 className="text-lg font-semibold capitalize text-white">{status.replace('-', ' ')}</h2>
              <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-gray-300 bg-gray-700 rounded-full border border-gray-600">
                {statusTasks.length}
              </span>
            </div>
            <div
              className={DragAndDropService.getDragOverClassName(dragOverColumn, status as Task['status'])}
              onDrop={(e) => handleDrop(e, status as Task['status'])}
              onDragOver={(e) => handleDragOver(e, status as Task['status'])}
              onDragLeave={handleDragLeave}
            >
              {statusTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={onTaskDelete}
                  isDragging={draggedTaskId === task.id}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                />
              ))}
              {statusTasks.length === 0 && (
                <div className="text-center py-8 text-gray-400 bg-gray-800/50 rounded-lg border border-gray-700 border-dashed">
                  Drop tasks here or no tasks in this status
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <TaskForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        initialTask={editingTask}
      />
    </div>
  );
}
