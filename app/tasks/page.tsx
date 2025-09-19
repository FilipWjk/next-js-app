import { Task } from '@/types/task';
import { listTasks } from './repo';
import { TaskListSSR } from './components/TaskListSSR';

export const dynamic = 'force-dynamic';

async function getTasks(): Promise<Task[]> {
  try {
    const tasks: Task[] = await listTasks();
    return tasks;
  } catch (error) {
    console.error('Error fetching tasks for tasks page:', error);
    return [];
  }
}

async function TasksContent() {
  const tasks = await getTasks();
  return <TaskListSSR initialTasks={tasks} />;
}

export default function TasksPage() {
  return <TasksContent />;
}
