import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import UserAccount from "./pages/UserAccount";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading authentication...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <SignIn /> },
      { path: "register", element: <SignUp /> },
      {
        path: "account",
        element: <ProtectedRoute />,
        children: [{ index: true, element: <UserAccount /> }],
      },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
