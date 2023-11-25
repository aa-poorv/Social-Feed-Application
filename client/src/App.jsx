/* eslint-disable no-unused-vars */
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/http";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import RootLayout from "./pages/RootLayout";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import NewFeed from "./pages/NewFeed";
import Feed from "./pages/Feed";
import Search from "./pages/Search";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <SignIn />,
      },
      {
        path: "sign-up",
        element: <SignUp />,
      },
      {
        path: "/feed/:id",
        element: <Feed />,
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "create-feed",
            element: <NewFeed />,
          },
          {
            path: "search",
            element: <Search />,
          },
        ],
      },
    ],
  },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
