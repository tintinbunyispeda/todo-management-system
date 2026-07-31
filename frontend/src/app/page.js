"use client";

import { useState, useEffect } from 'react';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reusable fetch function
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

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create todo');
      }
      
      // Reset form
      setTitle('');
      setDescription('');
      // Refresh list
      await fetchTodos();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleTodo = async (id, currentStatus) => {
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentStatus })
      });
      
      if (!response.ok) throw new Error('Failed to update todo status');
      await fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTodo = async (id) => {
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/todos/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete todo');
      await fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 lg:p-24 bg-gray-50 text-gray-900">
      <h1 className="text-4xl font-bold mb-8">Todo Management System</h1>
      
      {/* Create Todo Form */}
      <form onSubmit={handleAddTodo} className="w-full max-w-md bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Todo</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Title (Required)</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="What needs to be done?"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add details..."
            rows="2"
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Saving...' : 'Add Todo'}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="w-full max-w-md bg-red-100 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Loading State */}
      {loading && <p className="text-xl">Loading todos...</p>}
      
      {/* Empty State */}
      {!loading && !error && todos.length === 0 && (
        <p className="text-gray-500 text-xl">No todos available. Create one above!</p>
      )}

      {/* Todo List */}
      {!loading && !error && todos.length > 0 && (
        <ul className="w-full max-w-md space-y-4">
          {todos.map((todo) => (
            <li 
              key={todo.id} 
              className={`p-4 border rounded shadow flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white transition-opacity ${todo.completed ? 'opacity-75' : ''}`}
            >
              <div className="mb-3 sm:mb-0 max-w-[70%]">
                <h2 className={`text-xl font-semibold break-words ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                  {todo.title}
                </h2>
                {todo.description && (
                  <p className={`text-sm mt-1 break-words ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                    {todo.description}
                  </p>
                )}
              </div>
              <div className="flex space-x-2 shrink-0">
                <button
                  onClick={() => handleToggleTodo(todo.id, todo.completed)}
                  className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                    todo.completed 
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  {todo.completed ? 'Undo' : 'Complete'}
                </button>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="px-3 py-1 text-sm font-medium rounded bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
