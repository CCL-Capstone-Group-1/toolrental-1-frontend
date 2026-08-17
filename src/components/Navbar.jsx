import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

function initialsFor(name) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function Navbar({
  isAuthenticated = false,
  userName = "",
  onLogout,
  authMode = "default",
}) {
  const { count } = useCart();
  return (
    <header className="navbar">
      <NavLink to="/" className="navbar__brand">
        <img src={logo} alt="toolbnb" className="navbar__logo" />
      </NavLink>

      <div className="navbar__actions">
        <NavLink
          to="/catalog"
          className={({ isActive }) =>
            `navbar__link navbar__browse-link${isActive ? " navbar__link--active" : ""}`
          }
        >
          Browse Tools
        </NavLink>

        {isAuthenticated ? (
          <>
            <NavLink to="/cart" className="navbar__cart">
              Cart
              {count > 0 && <span className="navbar__cart-count">{count}</span>}
            </NavLink>
            <NavLink to="/account" className="navbar__user">
              <span className="navbar__avatar">{initialsFor(userName)}</span>
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
          <NavLink to="/login" className="navbar__link navbar__link--cta">
            Sign In
          </NavLink>
        ) : (
          <>
            <NavLink to="/login" className="navbar__link navbar__link--cta">
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
