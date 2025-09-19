import { Task } from '@/types/task';

export class DragAndDropService {
  static createDragData(taskId: string, currentStatus: Task['status']): string {
    return JSON.stringify({ taskId, currentStatus });
  }

  static parseDragData(data: string): { taskId: string; currentStatus: Task['status'] } | null {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  // * Inserts a task at the top of a specific status group
  static insertTaskAtTop(tasks: Task[], taskToMove: Task, targetStatus: Task['status']): Task[] {
    // ? Remove task from current position
    const tasksWithoutMoved = tasks.filter((t) => t.id !== taskToMove.id);

    // ? Update the task's status
    const updatedTask = { ...taskToMove, status: targetStatus, updatedAt: new Date().toISOString() };

    // ? Create new array and insert the updated task at the beginning
    const newTasks = [...tasksWithoutMoved];

    // ? Find the first task in the array with the target status
    const firstTargetStatusIndex = newTasks.findIndex((t) => t.status === targetStatus);

    if (firstTargetStatusIndex === -1) {
      // * No tasks with target status exist, add to the end
      newTasks.push(updatedTask);
    } else {
      // * Insert at the first position of target status (top of that list)
      newTasks.splice(firstTargetStatusIndex, 0, updatedTask);
    }

    return newTasks;
  }

  static mergeTasksPreservingOrder(localTasks: Task[], serverTasks: Task[]): Task[] {
    // * Update all tasks with server data but keep local ordering
    const updatedLocal = localTasks.map((localTask) => {
      const serverTask = serverTasks.find((t) => t.id === localTask.id);
      return serverTask ? { ...serverTask } : localTask;
    });

    // * Add any completely new tasks from server
    const newServerTasks = serverTasks.filter(
      (serverTask) => !localTasks.some((localTask) => localTask.id === serverTask.id),
    );

    return [...updatedLocal, ...newServerTasks];
  }

  static isDropAllowed(
    isDragging: boolean,
    isUpdating: boolean,
    draggedTaskId: string | null,
    targetTaskId: string,
  ): boolean {
    return isDragging && !isUpdating && draggedTaskId === targetTaskId;
  }

  // * Get visual feedback class for drag over state
  static getDragOverClassName(dragOverColumn: Task['status'] | null, currentStatus: Task['status']): string {
    const baseClasses = 'space-y-4 min-h-[200px] p-2 rounded-lg border-2 border-dashed transition-colors';

    if (dragOverColumn === currentStatus) {
      return `${baseClasses} border-blue-400 bg-blue-950/20`;
    }

    return `${baseClasses} border-gray-700 hover:border-gray-500`;
  }
}
