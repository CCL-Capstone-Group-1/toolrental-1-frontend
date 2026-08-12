import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ isAuthenticated = false, userName = "", onLogout, hideAuthLinks = false }) {
  return (
    <header className="navbar">
      <NavLink to="/" className="navbar__brand">
        toolbnb
      </NavLink>

      <nav className="navbar__links" aria-label="Main">
        <NavLink
          to="/catalog"
          className={({ isActive }) => `navbar__link${isActive ? " navbar__link--active" : ""}`}
        >
          Browse Tools
        </NavLink>
      </nav>

      <div className="navbar__actions">
        {isAuthenticated ? (
          <>
            <NavLink to="/account" className="navbar__user">
              {userName || "Profile"}
            </NavLink>
            <button type="button" className="navbar__logout" onClick={onLogout}>
              Sign Out
            </button>
          </>
        ) : (
          !hideAuthLinks && (
            <>
              <NavLink to="/login" className="navbar__link">
                Sign In
              </NavLink>
              <NavLink to="/register" className="navbar__link navbar__link--cta">
                Sign Up
              </NavLink>
            </>
          )
        )}
      </div>
    </header>
  );
}
