export interface Todo {
  id: string;
  title: string;
  description?: string | null;
  completed: boolean;
  userId?: number | null;
}
