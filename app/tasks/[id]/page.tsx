import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Task } from '@/types/task';
import { BackButton } from '@/components/BackButton';
import { getTaskById } from '../repo';
import ClientActions from './ClientActions';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

async function getTask(id: string): Promise<Task | null> {
  try {
    const task = await getTaskById(id);
    return task;
  } catch (error) {
    console.error(`Error fetching task ${id}:`, error);
    return null;
  }
}

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const task = await getTask(id);

  if (!task) {
    notFound();
  }

  const statusColors = {
    todo: 'bg-gray-700 text-gray-200',
    'in-progress': 'bg-blue-700 text-blue-200',
    completed: 'bg-green-700 text-green-200',
  };

  const priorityColors = {
    low: 'bg-gray-700 text-gray-200',
    medium: 'bg-yellow-700 text-yellow-200',
    high: 'bg-red-700 text-red-200',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BackButton href="/tasks">← Back to Tasks</BackButton>
        <h1 className="text-2xl font-bold text-white">Task Details</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{task.title}</CardTitle>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[task.status]}`}>
                  {task.status.replace('-', ' ')}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColors[task.priority]}`}
                >
                  {task.priority} priority
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-white">Description</h3>
            <p className="text-gray-400">{task.description}</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">Task Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="capitalize text-white">{task.status.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Priority:</span>
                  <span className="capitalize text-white">{task.priority}</span>
                </div>
                {task.dueDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Due Date:</span>
                    <span className="text-white">{formatDate(task.dueDate)}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">Timeline</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Created:</span>
                  <span className="text-white">{formatDate(task.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Updated:</span>
                  <span className="text-white">{formatDate(task.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <h3 className="text-lg font-semibold mb-2 text-white">Actions</h3>
            <ClientActions task={task} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
