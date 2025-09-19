import { listTasks } from './repo';
import { TaskListSSR } from './components/TaskListSSR';

export const dynamic = 'force-dynamic';

export default async function TasksPage() {
  try {
    const tasks = await listTasks();
    return <TaskListSSR initialTasks={tasks} />;
  } catch (err) {
    console.error('Error fetching tasks for tasks page:', err);
    return <TaskListSSR initialTasks={[]} />;
  }
}
