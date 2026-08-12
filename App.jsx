import { Outlet } from "react-router-dom";
import { useAuth } from "./src/context/AuthContext";
import Navbar from "./src/components/Navbar";

export default function App() {
  const { user, logout } = useAuth();

  return (
    <div>
      <Navbar isAuthenticated={Boolean(user)} userName={user?.name || user?.email} onLogout={logout} />
      <Outlet />
    </div>
  );
}
