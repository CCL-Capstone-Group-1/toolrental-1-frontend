import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./src/context/AuthContext";
import Navbar from "./src/components/Navbar";

export default function App() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  return (
    <div>
      <Navbar
        isAuthenticated={Boolean(user)}
        userName={user?.name || user?.email}
        onLogout={logout}
        hideAuthLinks={pathname === "/catalog"}
      />
      <Outlet />
    </div>
  );
}
