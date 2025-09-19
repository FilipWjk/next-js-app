'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { Modal } from '@/components/ui/modal';
import { useTaskOperations } from '../../hooks/useTaskOperations';
import { Task, TaskPriority } from '@/types/task';

export default function ClientActions({ task }: { task: Task }) {
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const { busy, toggleTaskStatus, deleteTask, changePriority } = useTaskOperations({
    redirectAfterDelete: '/tasks',
  });

  const handleToggleStatus = () => toggleTaskStatus(task);
  const handleDelete = () => deleteTask(task.id);
  const handleChangePriority = (newPriority: TaskPriority) => {
    changePriority(task.id, newPriority);
    setShowPriorityModal(false);
  };

  const priorityOptions: { value: TaskPriority; label: string; color: string }[] = [
    { value: 'low', label: 'Low Priority', color: 'text-gray-400' },
    { value: 'medium', label: 'Medium Priority', color: 'text-yellow-400' },
    { value: 'high', label: 'High Priority', color: 'text-red-400' },
  ];

  return (
    <div className="relative">
      <LoadingOverlay
        isVisible={!!busy}
        message={
          busy === 'toggle'
            ? 'Updating status...'
            : busy === 'priority'
            ? 'Updating priority...'
            : busy === 'delete'
            ? 'Deleting task...'
            : undefined
        }
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
          onClick={() => setShowPriorityModal(true)}
          className="cursor-pointer hover:bg-yellow-600/20 text-yellow-400 hover:text-yellow-300"
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

      <Modal
        isOpen={showPriorityModal}
        onClose={() => setShowPriorityModal(false)}
        title="Change Task Priority"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Current priority: <span className="capitalize font-medium text-white">{task.priority}</span>
          </p>
          <div className="space-y-2">
            {priorityOptions.map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={task.priority === option.value ? 'default' : 'outline'}
                onClick={() => handleChangePriority(option.value)}
                className={`w-full justify-start ${option.color} ${
                  task.priority === option.value
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'hover:bg-gray-700'
                }`}
                disabled={task.priority === option.value}
              >
                {option.label}
                {task.priority === option.value && <span className="ml-auto text-sm">(Current)</span>}
              </Button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
