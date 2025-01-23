import { useQuery } from '@tanstack/react-query';

interface Todo {
  id: number;
  title: string;
}

const fetchTodos = async (): Promise<Todo[]> => {
  const response = await fetch('http://localhost:8000/api/todos');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export default function Home() {
  const { data, error, isLoading } = useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>To-Do List</h1>
      <ul>
        {data?.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}
