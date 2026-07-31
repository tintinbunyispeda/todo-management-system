"use client";

import { useState, useEffect } from 'react';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('http://localhost:5000/todos');
        if (!response.ok) {
          throw new Error('Failed to fetch data from the server');
        }
        const data = await response.json();
        setTodos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">Todo Management System</h1>
      
      {loading && <p className="text-xl">Loading todos...</p>}
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          Error: {error}
        </div>
      )}
      
      {!loading && !error && todos.length === 0 && (
        <p className="text-gray-500 text-xl">No todos available.</p>
      )}

      {!loading && !error && todos.length > 0 && (
        <ul className="w-full max-w-md space-y-4">
          {todos.map((todo) => (
            <li 
              key={todo.id} 
              className="p-4 border rounded shadow flex justify-between items-center"
            >
              <div>
                <h2 className={`text-xl font-semibold ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                  {todo.title}
                </h2>
                {todo.description && (
                  <p className="text-gray-600 mt-1">{todo.description}</p>
                )}
              </div>
              <span className={`px-2 py-1 text-xs rounded font-medium ${todo.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {todo.completed ? 'Completed' : 'Pending'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
