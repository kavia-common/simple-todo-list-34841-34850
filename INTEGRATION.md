# Integration Quick Notes

- API server:
  - Path: ../simple-todo-list-34841-34851/todo_database
  - Start: python3 api_server.py
  - Default bind: 0.0.0.0:5001
  - CORS: http://localhost:3000
  - Change port if 5001 busy: PORT=5002 python3 api_server.py

- Frontend:
  - Path: todo_frontend
  - Start: npm start (http://localhost:3000)
  - API base URL file: src/App.js
  - Default: const API_BASE = 'http://localhost:5001'
  - If API on 5002: set API_BASE to 'http://localhost:5002' and restart dev server

- Verify:
  - Add: enter text, click Add, item shows in list
  - View: click Refresh, list reloads with item
  - Delete: click Delete, item disappears
