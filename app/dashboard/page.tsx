import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Task } from '@/types/task';
import { listTasks } from '@/app/tasks/repo';

export const dynamic = 'force-dynamic';

async function getTasks(): Promise<Task[]> {
  try {
    const tasks: Task[] = await listTasks();
    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}

async function DashboardStats() {
  const tasks = await getTasks();

  const stats = {
    total: tasks.length,
    completed: tasks.filter((task) => task.status === 'completed').length,
    inProgress: tasks.filter((task) => task.status === 'in-progress').length,
    todo: tasks.filter((task) => task.status === 'todo').length,
  };

  const recentTasks = tasks
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const upcomingTasks = tasks
    .filter((task) => task.dueDate && task.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-2">Welcome back! Here's an overview of your tasks.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <div className="h-4 w-4 text-gray-400 text-2xl">📋</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <div className="h-4 w-4 text-gray-400 text-2xl">✅</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.completed}</div>
            <p className="text-xs text-gray-400">
              {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% of total Tasks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <div className="h-4 w-4 text-gray-400 text-2xl">🔄</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Todo</CardTitle>
            <div className="h-4 w-4 text-gray-400 text-2xl">⏳</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.todo}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tasks and Upcoming Tasks */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.length > 0 ? (
                recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-white">{task.title}</p>
                      <p className="text-xs text-gray-400">
                        Updated {new Date(task.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs ${
                        task.status === 'completed'
                          ? 'bg-green-700 text-green-200'
                          : task.status === 'in-progress'
                          ? 'bg-blue-700 text-blue-200'
                          : 'bg-gray-700 text-gray-200'
                      }`}
                    >
                      {task.status.replace('-', ' ')}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No recent tasks found</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-white">{task.title}</p>
                      <p className="text-xs text-gray-400">
                        Due {new Date(task.dueDate!).toLocaleDateString()}
                      </p>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs ${
                        task.priority === 'high'
                          ? 'bg-red-700 text-red-200'
                          : task.priority === 'medium'
                          ? 'bg-yellow-700 text-yellow-200'
                          : 'bg-gray-700 text-gray-200'
                      }`}
                    >
                      {task.priority}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No upcoming deadlines</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// * Main Dashboard page
export default function Dashboard() {
  return <DashboardStats />;
}
