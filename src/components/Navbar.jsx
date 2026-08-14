import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Navbar.css";

export default function Navbar({
  isAuthenticated = false,
  userName = "",
  onLogout,
  authMode = "default",
}) {
  return (
    <header className="navbar">
      <NavLink to="/" className="navbar__brand">
        <img src={logo} alt="toolbnb" className="navbar__logo" />
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
        ) : authMode === "hidden" ? null : authMode === "promptSignUp" ? (
          <>
            <span className="navbar__prompt">Not a member yet?</span>
            <NavLink to="/register" className="navbar__link navbar__link--cta">
              Sign Up
            </NavLink>
          </>
        ) : authMode === "promptSignIn" ? (
          <>
            <span className="navbar__prompt">Already a member?</span>
            <NavLink to="/login" className="navbar__link navbar__link--cta">
              Sign In
            </NavLink>
          </>
        ) : authMode === "hideSignUp" ? (
          <NavLink to="/login" className="navbar__link">
            Sign In
          </NavLink>
        ) : (
          <>
            <NavLink to="/login" className="navbar__link">
              Sign In
            </NavLink>
            <NavLink to="/register" className="navbar__link navbar__link--cta">
              Sign Up
            </NavLink>
          </>
        )}
      </div>
    </header>
  );
}
