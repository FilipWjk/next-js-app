'use client';

import { Button } from '../../components/ui/button';
import { LoadingOverlay } from '../../components/ui/loading-overlay';
import { useTaskOperations } from '../../hooks/useTaskOperations';
import { Task } from '@/types/task';

export default function ClientActions({ task }: { task: Task }) {
  const { busy, toggleTaskStatus, deleteTask } = useTaskOperations({
    redirectAfterDelete: '/tasks',
  });

  const handleToggleStatus = () => toggleTaskStatus(task);
  const handleDelete = () => deleteTask(task.id);

  return (
    <div className="relative">
      <LoadingOverlay
        isVisible={!!busy}
        message={busy === 'toggle' ? 'Updating status...' : busy === 'delete' ? 'Deleting task...' : ''}
      />
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleToggleStatus}
          className="cursor-pointer hover:bg-green-600/20 text-green-400 hover:text-green-300"
        >
          Mark as {task.status === 'completed' ? 'Incomplete' : 'Completed'}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled
          className="cursor-pointer hover:bg-yellow-600/20 text-yellow-400 hover:text-yellow-300 opacity-60"
          title="Not implemented yet"
        >
          Change Priority
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleDelete}
          className="cursor-pointer hover:bg-red-700"
        >
          Delete Task
        </Button>
      </div>
    </div>
  );
}
