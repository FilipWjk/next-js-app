'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mergeClasses } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useNavigationLoading } from '@/contexts/NavigationLoadingContext';
import { Edit, Trash2, Eye, Calendar, Clock, AlertCircle, Circle, CheckCircle } from 'lucide-react';
import { Task } from '@/types/task';
import { DragAndDropService } from '@/lib/dragAndDropService';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: Task['status']) => void;
  isDragging?: boolean;
  onDragStart?: (taskId: string) => void;
  onDragEnd?: () => void;
}

const priorityConfig = {
  low: {
    color: 'border-l-green-400',
    bg: 'bg-green-900/20',
    text: 'text-green-400',
    badge: 'bg-green-900/30 text-green-300 border border-green-700/50',
    icon: Circle,
  },
  medium: {
    color: 'border-l-yellow-400',
    bg: 'bg-yellow-900/20',
    text: 'text-yellow-400',
    badge: 'bg-yellow-900/30 text-yellow-300 border border-yellow-700/50',
    icon: AlertCircle,
  },
  high: {
    color: 'border-l-red-400',
    bg: 'bg-red-900/20',
    text: 'text-red-400',
    badge: 'bg-red-900/30 text-red-300 border border-red-700/50',
    icon: AlertCircle,
  },
} as const;

const statusConfig = {
  todo: {
    color: 'bg-gray-700/50 text-gray-300 border border-gray-600/50',
    icon: Circle,
    label: 'To Do',
  },
  'in-progress': {
    color: 'bg-blue-900/30 text-blue-300 border border-blue-700/50',
    icon: Clock,
    label: 'In Progress',
  },
  completed: {
    color: 'bg-green-900/30 text-green-300 border border-green-700/50',
    icon: CheckCircle,
    label: 'Completed',
  },
} as const;

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  isDragging,
  onDragStart,
  onDragEnd,
}: TaskCardProps) {
  const router = useRouter();
  const { startNavigation } = useNavigationLoading();

  const handleViewDetails = () => {
    startNavigation();
    router.push(`/tasks/${task.id}`);
  };

  const priority = priorityConfig[task.priority];
  const status = statusConfig[task.status];
  const StatusIcon = status.icon;
  const PriorityIcon = priority.icon;

  const handleDragStartEvent = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', DragAndDropService.createDragData(task.id, task.status));
    e.dataTransfer.effectAllowed = 'move';

    // * Create a custom drag image
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.transform = 'rotate(5deg)';
    dragImage.style.opacity = '0.8';
    dragImage.style.width = '300px';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 150, 50);
    setTimeout(() => document.body.removeChild(dragImage), 0);

    onDragStart?.(task.id);
  };

  const handleDragEndEvent = () => {
    onDragEnd?.();
  };

  return (
    <Card
      className={mergeClasses(
        'transition-all duration-200 hover:shadow-lg border-l-4 bg-gray-800 hover:bg-gray-750 group cursor-move',
        priority.color,
        isDragging && 'opacity-50 rotate-1 scale-105 shadow-2xl',
      )}
      draggable
      onDragStart={handleDragStartEvent}
      onDragEnd={handleDragEndEvent}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg font-semibold text-white group-hover:text-gray-200 truncate">
                {task.title}
              </CardTitle>
            </div>

            {/* Status and Priority Badges */}
            <div className="flex items-center gap-2">
              <span
                className={mergeClasses(
                  'inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap',
                  status.color,
                )}
              >
                <StatusIcon size={12} />
                {status.label}
              </span>

              <span
                className={mergeClasses(
                  'inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap',
                  priority.badge,
                )}
              >
                <PriorityIcon size={12} />
                {task.priority} priority
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewDetails}
              className="h-10 w-10 p-0 cursor-pointer hover:bg-blue-500/30 text-blue-300 hover:text-blue-100 border border-transparent hover:border-blue-400/50 rounded-md"
              title="View Details"
            >
              <Eye size={16} />
            </Button>
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(task)}
                className="h-10 w-10 p-0 cursor-pointer hover:bg-amber-500/30 text-amber-300 hover:text-amber-100 border border-transparent hover:border-amber-400/50 rounded-md"
                title="Edit Task"
              >
                <Edit size={16} />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(task.id)}
                className="h-10 w-10 p-0 cursor-pointer hover:bg-red-500/30 text-red-300 hover:text-red-100 border border-transparent hover:border-red-400/50 rounded-md"
                title="Delete Task"
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {task.dueDate && (
          <div className="bg-amber-900/20 border border-amber-700/50 rounded-md mb-4 p-2">
            <div className="flex items-center justify-center gap-2">
              <Calendar size={14} className="text-amber-400" />
              <span className="text-sm font-medium text-amber-300">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
