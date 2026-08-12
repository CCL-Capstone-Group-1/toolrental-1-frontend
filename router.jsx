import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import App from "./App";
import Landing from "./src/pages/Landing";
import Catalog from "./src/pages/Catalog";
import SignIn from "./src/pages/SignIn";
import SignUp from "./src/pages/SignUp";
import UserAccount from "./src/pages/UserAccount";
import OwnerListing from "./src/pages/OwnerListing";
import { useAuth } from "./src/context/AuthContext";

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
      { index: true, element: <Landing /> },
      { path: "catalog", element: <Catalog /> },
      { path: "login", element: <SignIn /> },
      { path: "register", element: <SignUp /> },
      { path: "listings/new", element: <OwnerListing /> },
      {
        path: "account",
        element: <ProtectedRoute />,
        children: [{ index: true, element: <UserAccount /> }],
      },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
