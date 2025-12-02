import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import PrivateRoute from "./components/PrivateRoute";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user, logout } = useAuth();

  return (
    <Router>
      <div className="app-shell">
        <header className="app-header">
          <div className="logo">TaskFlow</div>
          <nav className="nav-links">
            {!user && (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
              </>
            )}
            {user && (
              <>
                <span className="nav-user">Hi, {user.name}</span>
                <Link to="/dashboard">Dashboard</Link>
                <button className="btn-secondary" onClick={logout}>
                  Logout
                </button>
              </>
            )}
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

