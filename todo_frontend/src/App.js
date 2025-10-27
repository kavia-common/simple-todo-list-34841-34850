import React, { useState, useEffect } from 'react';
import './App.css';

// API base for future configurability
const API_BASE = 'http://localhost:5001';

// PUBLIC_INTERFACE
function App() {
  /**
   * This is the main App component that renders a retro-themed Todo UI.
   * It allows users to view, add, and delete tasks via a backend API.
   */
  const [theme, setTheme] = useState('light');
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // PUBLIC_INTERFACE
  async function fetchTodos() {
    /**
     * Fetches the list of todos from the backend API.
     * Updates loading and error state accordingly.
     */
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/todos`, { headers: { 'Accept': 'application/json' } });
      if (!res.ok) {
        throw new Error(`Failed to fetch todos: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      // Expecting array of { id, text } - adapt gracefully if keys differ
      const normalized = Array.isArray(data)
        ? data.map((t) => ({
            id: t.id ?? t.todo_id ?? t._id ?? String(Math.random()),
            text: t.text ?? t.title ?? t.task ?? '',
          }))
        : [];
      setTodos(normalized);
    } catch (e) {
      setError(e.message || 'Unknown error while fetching todos.');
    } finally {
      setLoading(false);
    }
  }

  // PUBLIC_INTERFACE
  async function addTodo(e) {
    /**
     * Adds a new todo by calling POST /todos.
     * Body: { text: string }
     */
    e?.preventDefault?.();
    const trimmed = input.trim();
    if (!trimmed) {
      setError('Please enter a task before adding.');
      return;
    }
    setActionLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ text: trimmed }),
      });
      if (!res.ok) {
        throw new Error(`Failed to add todo: ${res.status} ${res.statusText}`);
      }
      const created = await res.json();
      const newTodo = {
        id: created.id ?? created.todo_id ?? created._id ?? String(Date.now()),
        text: created.text ?? created.title ?? created.task ?? trimmed,
      };
      setTodos((prev) => [newTodo, ...prev]);
      setInput('');
    } catch (e) {
      setError(e.message || 'Unknown error while adding todo.');
    } finally {
      setActionLoading(false);
    }
  }

  // PUBLIC_INTERFACE
  async function deleteTodo(id) {
    /**
     * Deletes a todo by calling DELETE /todos/:id.
     */
    if (!id) return;
    setActionLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/todos/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) {
        throw new Error(`Failed to delete todo: ${res.status} ${res.statusText}`);
      }
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      setError(e.message || 'Unknown error while deleting todo.');
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="App retro-app">
      <header className="retro-header">
        <div className="retro-title">🕹️ Retro Todo</div>
        <button
          className="theme-toggle pixel-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </header>

      <main className="container">
        <section className="card input-card">
          <form className="todo-form" onSubmit={addTodo}>
            <input
              className="retro-input"
              type="text"
              placeholder="Type a task..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Todo input"
              disabled={actionLoading}
            />
            <button
              type="submit"
              className="pixel-btn add-btn"
              disabled={actionLoading}
              aria-busy={actionLoading}
            >
              {actionLoading ? 'Adding…' : 'Add'}
            </button>
          </form>
          {error && <div className="error-banner" role="alert">⚠️ {error}</div>}
        </section>

        <section className="card list-card">
          <div className="list-header">
            <h2 className="list-title">Your Tasks</h2>
            <button
              className="pixel-btn small refresh-btn"
              onClick={fetchTodos}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? 'Loading…' : 'Refresh'}
            </button>
          </div>

          {loading ? (
            <div className="loading">⌛ Loading tasks…</div>
          ) : todos.length === 0 ? (
            <div className="empty-state">No tasks yet. Add your first one!</div>
          ) : (
            <ul className="todo-list" aria-live="polite">
              {todos.map((t) => (
                <li className="todo-item" key={t.id}>
                  <span className="todo-text">{t.text}</span>
                  <button
                    className="pixel-btn danger delete-btn"
                    onClick={() => deleteTodo(t.id)}
                    disabled={actionLoading}
                    aria-label={`Delete ${t.text}`}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer className="retro-footer">
        <span>Made with ❤️ in 8-bit style</span>
      </footer>
    </div>
  );
}

export default App;
