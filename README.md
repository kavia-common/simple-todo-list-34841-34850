# simple-todo-list-34841-34850

Frontend: todo_frontend (React)
- Dev server: http://localhost:3000
- Start:
  cd todo_frontend
  npm install
  npm start

API base URL
- Default: http://localhost:5001
- Location to change: todo_frontend/src/App.js
  const API_BASE = 'http://localhost:5001';

If API port 5001 is busy
- Start the Flask API on a different port (e.g., 5002):
  cd ../simple-todo-list-34841-34851/todo_database
  PORT=5002 python3 api_server.py
- Then update the frontend base URL:
  In todo_frontend/src/App.js set:
  const API_BASE = 'http://localhost:5002';
  Restart npm start if it was running.

API server quick info (see the other workspace folder)
- Path: ../simple-todo-list-34841-34851/todo_database
- Start: python3 api_server.py
- Binds: 0.0.0.0:5001
- CORS: http://localhost:3000
- Health check: curl http://localhost:5001/todos

Quick verification checklist
- View: page shows "Your Tasks" and existing items or empty state
- Add: type a task and click Add; it appears in the list
- Refresh: click Refresh; list reloads with the item
- Delete: click Delete next to the item; it disappears

For detailed integration steps:
- See INTEGRATION.md in both workspace folders.
