export interface DummyTodo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

export interface DummyTodosResponse {
  todos: DummyTodo[];
  total: number;
  skip: number;
  limit: number;
}
