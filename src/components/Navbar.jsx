import { useEffect, useRef, useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const profileMenuRef = useRef(null);
  const prevCountRef = useRef(count);

  useEffect(() => {
    if (count > prevCountRef.current) {
      setCartPulse(true);
      const timer = setTimeout(() => setCartPulse(false), 400);
      prevCountRef.current = count;
      return () => clearTimeout(timer);
    }
    prevCountRef.current = count;
  }, [count]);

  useEffect(() => {
    if (!profileMenuOpen) return;
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileMenuOpen]);

  return (
    <header className="navbar">
      <NavLink to="/" className="navbar__brand" onClick={() => setMenuOpen(false)}>
        <img src={logo} alt="toolbnb" className="navbar__logo" />
      </NavLink>

      <button
        type="button"
        className="navbar__hamburger"
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>

      <div
        className={`navbar__actions${menuOpen ? " navbar__actions--open" : ""}`}
        onClick={() => setMenuOpen(false)}
      >
        <NavLink
          to="/catalog"
          className={({ isActive }) =>
            `navbar__link navbar__browse-link${isActive ? " navbar__link--active" : ""}`
          }
          aria-label="Browse Tools"
        >
          <svg
            className="navbar__browse-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          <span className="navbar__link-label">Browse Tools</span>
        </NavLink>

        {isAuthenticated ? (
          <>
            <NavLink to="/cart" className="navbar__cart" aria-label="Cart">
              <svg
                className="navbar__cart-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span className="navbar__link-label">Cart</span>
              {count > 0 && (
                <span className={`navbar__cart-count${cartPulse ? " navbar__cart-count--pulse" : ""}`}>
                  {count}
                </span>
              )}
            </NavLink>
            <div className="navbar__user-menu" ref={profileMenuRef}>
              <button
                type="button"
                className="navbar__user"
                aria-expanded={profileMenuOpen}
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileMenuOpen((open) => !open);
                }}
              >
                <span className="navbar__avatar">{initialsFor(userName)}</span>
                {userName || "Profile"}
              </button>

              {profileMenuOpen && (
                <div className="navbar__user-dropdown">
                  <NavLink
                    to="/account"
                    className="navbar__user-dropdown-item"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    Account
                  </NavLink>
                  <button
                    type="button"
                    className="navbar__user-dropdown-item"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onLogout?.();
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
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
