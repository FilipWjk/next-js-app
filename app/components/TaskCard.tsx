'use client';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { mergeClasses } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Task } from '@/types/task';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: Task['status']) => void;
}

const priorityColors = {
  low: 'border-l-gray-500',
  medium: 'border-l-yellow-500',
  high: 'border-l-red-500',
};

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/tasks/${task.id}`);
  };

  return (
    <Card
      className={mergeClasses('transition-shadow hover:shadow-md border-l-4', priorityColors[task.priority])}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{task.title}</CardTitle>
            <div className="flex items-center gap-2"></div>
          </div>
          <div className="flex gap-1">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(task)}
                className="cursor-pointer hover:bg-blue-600/20 text-blue-400 hover:text-blue-300"
              >
                <Edit size={16} />
                <span className="ml-1">Edit</span>
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(task.id)}
                className="cursor-pointer hover:bg-red-600/20 text-red-400 hover:text-red-300"
              >
                <Trash2 size={16} />
                <span className="ml-1">Delete</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {task.dueDate && (
          <p className="text-sm font-bold text-red-400 mb-3">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </p>
        )}

        <div className="flex gap-2 mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDetails}
            className="flex-1 cursor-pointer border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 transition-all duration-200"
          >
            <Eye size={16} />
            <span className="ml-2">View Details</span>
          </Button>
        </div>

        {onStatusChange && (
          <div className="flex gap-2">
            <Button
              variant={task.status === 'todo' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onStatusChange(task.id, 'todo')}
              className="cursor-pointer"
            >
              Todo
            </Button>
            <Button
              variant={task.status === 'in-progress' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onStatusChange(task.id, 'in-progress')}
              className="cursor-pointer"
            >
              In Progress
            </Button>
            <Button
              variant={task.status === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onStatusChange(task.id, 'completed')}
              className="cursor-pointer"
            >
              Completed
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
