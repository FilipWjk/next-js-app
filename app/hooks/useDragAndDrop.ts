'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import { DragAndDropService } from '@/lib/dragAndDropService';

interface UseDragAndDropOptions {
  tasks: Task[];
  onTaskUpdate: (task: Task) => void | Promise<void>;
}

interface DragAndDropState {
  isDragging: boolean;
  draggedTaskId: string | null;
  dragOverColumn: Task['status'] | null;
  dropPosition: { status: Task['status']; index: number } | null;
  isUpdating: boolean;
  localTasks: Task[];
  recentlyDropped: string | null;
}

interface DragAndDropActions {
  handleDragStart: (taskId: string) => void;
  handleDragEnd: () => void;
  handleDragOver: (e: React.DragEvent, status: Task['status']) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, targetStatus: Task['status']) => Promise<void>;
  setLocalTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export function useDragAndDrop({
  tasks,
  onTaskUpdate,
}: UseDragAndDropOptions): DragAndDropState & DragAndDropActions {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<Task['status'] | null>(null);
  const [dropPosition, setDropPosition] = useState<{ status: Task['status']; index: number } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const [recentlyDropped, setRecentlyDropped] = useState<string | null>(null);

  // Update local tasks when props change, but preserve local ordering during drag operations
  useEffect(() => {
    if (!isDragging && !recentlyDropped) {
      setLocalTasks(tasks);
    } else if (recentlyDropped) {
      // ? When we have a recently dropped task, merge server updates but preserve our local ordering
      setLocalTasks((prevLocal) => DragAndDropService.mergeTasksPreservingOrder(prevLocal, tasks));
    }
  }, [tasks, isDragging, recentlyDropped]);

  const handleStatusChange = async (taskId: string, status: Task['status']) => {
    if (isUpdating) return; // ? Prevent concurrent updates
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setIsUpdating(true);
      try {
        await onTaskUpdate({ ...task, status, updatedAt: new Date().toISOString() });
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleDragStart = (taskId: string) => {
    setIsDragging(true);
    setDraggedTaskId(taskId);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedTaskId(null);
    setDropPosition(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(status);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // * Only clear drag over if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: Task['status']) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isDragging || isUpdating || !draggedTaskId) return;

    const data = e.dataTransfer.getData('text/plain');
    try {
      const dragData = DragAndDropService.parseDragData(data);
      if (!dragData) return;

      const { taskId, currentStatus } = dragData;

      if (DragAndDropService.isDropAllowed(isDragging, isUpdating, draggedTaskId, taskId)) {
        // * Update local state immediately for instant visual feedback
        setLocalTasks((prevTasks) => {
          const taskToMove = prevTasks.find((t) => t.id === taskId);
          if (!taskToMove) return prevTasks;

          return DragAndDropService.insertTaskAtTop(prevTasks, taskToMove, targetStatus);
        });

        // * Reset drag state
        setIsDragging(false);
        setDraggedTaskId(null);
        setDropPosition(null);
        setDragOverColumn(null);

        // * Update backend only if status changed
        if (currentStatus !== targetStatus) {
          setRecentlyDropped(taskId);
          await handleStatusChange(taskId, targetStatus);
        }
      }
    } catch (error) {
      console.error('Error handling drop:', error);
      // * Reset local tasks to server state on error
      setLocalTasks(tasks);
    } finally {
      setIsDragging(false);
      setDraggedTaskId(null);
      setDropPosition(null);
      setDragOverColumn(null);
      setRecentlyDropped(null);
    }
  };

  return {
    // State
    isDragging,
    draggedTaskId,
    dragOverColumn,
    dropPosition,
    isUpdating,
    localTasks,
    recentlyDropped,
    // Actions
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    setLocalTasks,
  };
}
