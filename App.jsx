import { Link, Outlet } from "react-router-dom";
import { useAuth } from "./src/context/AuthContext";

export default function App() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <Link to="/">Tool Lending Library</Link>
        </div>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          {!user ? (
            <>
              <Link to="/login">Sign In</Link>
              <Link to="/register">Sign Up</Link>
            </>
          ) : (
            <div className="signed-in-nav">
              <Link to="/account" className="profile-link">
                {user.name || user.email || 'Profile'}
              </Link>
              <button type="button" className="link-button logout-button" onClick={logout}>
                Sign Out
              </button>
            </div>
          )}
        </nav>
      </header>

      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
}
