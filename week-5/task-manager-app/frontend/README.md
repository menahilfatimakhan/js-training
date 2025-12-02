## Task Manager Frontend

This React + Vite app is the authenticated task manager UI for the week-5 project.

### Environment variables

Create a `.env` file in the `frontend` folder:

```bash
VITE_API_URL=http://localhost:3000
```

The app reads this value via `import.meta.env.VITE_API_URL` (see `src/api/client.js`). If the variable is missing, it falls back to `http://localhost:3000`.

