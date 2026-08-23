import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./src/context/AuthContext";
import Navbar from "./src/components/Navbar";
import Footer from "./src/components/Footer";
const AUTH_MODE_BY_PATH = {
  "/catalog": "hidden",
  "/": "hideSignUp",
  "/login": "hidden",
  "/register": "promptSignIn",
};
export default function App() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  return (
    <div className="app-shell">
      <Navbar
        isAuthenticated={Boolean(user)}
        userName={user?.name || user?.email}
        onLogout={logout}
        authMode={AUTH_MODE_BY_PATH[pathname] || "default"}
      />
      <div className="app-shell__content">
        <div className="page-transition" key={pathname}>
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}