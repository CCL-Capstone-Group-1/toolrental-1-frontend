import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import App from "./App";
import Landing from "./src/pages/Landing";
import Catalog from "./src/pages/Catalog";
import SignIn from "./src/pages/SignIn";
import SignUp from "./src/pages/SignUp";
import UserAccount from "./src/pages/UserAccount";
import OwnerListing from "./src/pages/OwnerListing";
import ToolDetails from "./src/pages/ToolDetails";
import Rental from "./src/pages/Rental";
import Cart from "./src/pages/Cart";
import Review from "./src/pages/Review";
import ChatRoom from "./src/pages/ChatRoom";
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
      {
        element: <ProtectedRoute />,
        children: [
          { path: "account", element: <UserAccount /> },
          { path: "listings/new", element: <OwnerListing /> },
          { path: "tools/:id", element: <ToolDetails /> },
          { path: "rental/:id", element: <Rental /> },
          { path: "cart", element: <Cart /> },
          { path: "review/:id", element: <Review /> },
          { path: "chat/:id", element: <ChatRoom /> },
        ],
      },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
