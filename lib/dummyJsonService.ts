import { Task } from '@/types/task';
import { DummyTodo, DummyTodosResponse } from '@/types/dummyjson';

// * Convert DummyJSON todo to Task interface
export function convertToTask(dummyTodo: DummyTodo): Task {
  const randomStatus = (): Task['status'] => {
    if (dummyTodo.completed) return 'completed';

    const rand = Math.random();
    if (rand < 0.33) return 'todo';
    if (rand < 0.66) return 'in-progress';
    return 'todo';
  };

  const randomPriority = (): Task['priority'] => {
    const priorities: Task['priority'][] = ['low', 'medium', 'high'];
    return priorities[Math.floor(Math.random() * priorities.length)];
  };

  const randomDueDate = (): string => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
    return futureDate.toISOString().split('T')[0];
  };

  return {
    id: dummyTodo.id.toString(),
    title: dummyTodo.todo.split(' ')[0],
    description: dummyTodo.todo,
    status: randomStatus(),
    priority: randomPriority(),
    dueDate: Math.random() > 0.3 ? randomDueDate() : undefined,
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export class DummyJsonService {
  private static readonly BASE_URL = 'https://dummyjson.com';

  static async fetchTodos(limit = 10): Promise<Task[]> {
    const response = await fetch(`${this.BASE_URL}/todos?limit=${limit}`);

    if (!response.ok) {
      throw new Error(`DummyJSON API error: ${response.status}`);
    }

    const data: DummyTodosResponse = await response.json();
    const tasks = data.todos.map(convertToTask);

    return tasks;
  }
}
