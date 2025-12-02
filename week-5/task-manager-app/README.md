# Task Manager Web App

A full-stack authenticated task management application built with the MERN stack (MongoDB, Express, React, Node.js).

## 🚀 Features

- **User Authentication**
  - Secure signup and login with JWT tokens
  - Protected routes for authenticated users only
  - Automatic token management with axios interceptors
  - Logout functionality with token invalidation

- **Task Management**
  - Create, read, update, and delete tasks
  - User-specific tasks (each user only sees their own tasks)
  - Filter tasks by status (All, Pending, Done)
  - Beautiful, modern UI with responsive design

- **Security**
  - Password hashing with bcrypt
  - JWT-based authentication
  - Protected API endpoints
  - Token blacklisting for logout

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## 🛠️ Installation

### Backend Setup

```bash
cd backend
npm install
```

### Frontend Setup

```bash
cd frontend
npm install
```

## ⚙️ Configuration

### Backend Environment Variables (Optional)

Create a `.env` file in the `backend` directory:

```env
MONGO_URI=mongodb://localhost:27017/authDB
JWT_SECRET=your-secret-key-here
PORT=3000
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:3000
```

## 🏃 Running the Application

### 1. Start MongoDB

Make sure MongoDB is running on your system:
- **Windows**: Start MongoDB service or run `mongod`
- **macOS/Linux**: `sudo systemctl start mongod` or `mongod`

### 2. Start Backend Server

```bash
cd backend
node index.mjs
```

You should see:
```
✅ MongoDB Connected
✅ Auth + Task API running → http://localhost:3000
```

### 3. Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The app will open at `http://localhost:5173`

## 📁 Project Structure

```
task-manager-app/
├── backend/
│   ├── index.mjs          # Express server with auth & task routes
│   ├── package.json
│   └── node_modules/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js          # Axios client with interceptors
│   │   ├── components/
│   │   │   └── PrivateRoute.jsx   # Protected route component
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Auth state management
│   │   ├── pages/
│   │   │   ├── login.jsx          # Login page
│   │   │   ├── signup.jsx         # Signup page
│   │   │   └── dashboard.jsx      # Task management dashboard
│   │   ├── App.jsx                # Main app component
│   │   └── main.jsx               # Entry point
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /signup` - Create a new user account
- `POST /login` - Login and get JWT token
- `POST /logout` - Logout and invalidate token (protected)

### Tasks (All Protected)
- `GET /tasks` - Get all tasks for authenticated user
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

## 🧪 Testing

1. **Sign Up**: Create a new account
2. **Login**: Log in with your credentials
3. **Create Tasks**: Add new tasks with different statuses
4. **Filter Tasks**: Use the filter buttons to view All/Pending/Done tasks
5. **Edit Tasks**: Click Edit to modify task title or status
6. **Delete Tasks**: Remove tasks you no longer need
7. **Logout**: Test logout functionality

## 🛡️ Security Features

- Passwords are hashed using bcrypt (10 rounds)
- JWT tokens expire after 7 days
- All task endpoints require authentication
- Users can only access their own tasks
- Token blacklisting prevents reuse of logged-out tokens

## 🎨 Tech Stack

- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, bcrypt
- **Frontend**: React, React Router, Axios, Vite
- **Styling**: Modern CSS with responsive design

## 📝 License

This project is for educational purposes.

## 👨‍💻 Author

Built as part of JavaScript training course - Week 5

