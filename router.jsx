import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./src/pages/Home";
import SignIn from "./src/pages/SignIn";
import SignUp from "./src/pages/SignUp";
import OwnerListing from "./src/pages/OwnerListing";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/signin", element: <SignIn /> },
      { path: "/signup", element: <SignUp /> },
      { path: "/listings/new", element: <OwnerListing /> },
    ],
  },
]);
