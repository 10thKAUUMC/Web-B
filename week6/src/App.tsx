import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import HomeLayout from "./layouts/HomeLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import LoginSuccessPage from "./pages/LoginSuccessPage";
import SignupPage from "./pages/SignupPage";

import LPListPage from "./pages/LPListPage";
import LPDetailPage from "./pages/LPDetailPage";

import { AuthProvider } from "./context/AuthContext";

const router =
  createBrowserRouter([
    {
      path: "/",
      element: <HomeLayout />,

      children: [
        {
          path: "/",
          element: <HomePage />,
        },

        {
          path: "/login",
          element: <LoginPage />,
        },

        {
          path: "/signup",
          element: <SignupPage />,
        },

        {
          path: "/lps",
          element: <LPListPage />,
        },

        {
          element: (
            <ProtectedLayout />
          ),

          children: [
            {
              path:
                "/login-success",

              element: (
                <LoginSuccessPage />
              ),
            },

            {
              path:
                "/lp/:lpid",

              element: (
                <LPDetailPage />
              ),
            },
          ],
        },
      ],
    },
  ]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider
        router={router}
      />
    </AuthProvider>
  );
}