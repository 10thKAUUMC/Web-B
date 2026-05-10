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

import SearchPage from "./pages/SearchPage";
import MyPage from "./pages/MyPage";

import { AuthProvider } from "./context/AuthContext";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center text-2xl">
      404 페이지를 찾을 수 없습니다.
    </div>
  );
};

const router =
  createBrowserRouter([
    {
      path: "/",
      element: <HomeLayout />,

      errorElement:
        <NotFound />,

      children: [
        {
          path: "/",
          element:
            <HomePage />,
        },

        {
          path: "/login",
          element:
            <LoginPage />,
        },

        {
          path: "/signup",
          element:
            <SignupPage />,
        },

        {
          path: "/lps",
          element:
            <LPListPage />,
        },

        {
          path: "/search",
          element:
            <SearchPage />,
        },

        {
          element:
            <ProtectedLayout />,

          children: [
            {
              path:
                "/login-success",

              element:
                <LoginSuccessPage />,
            },

            {
              path:
                "/lp/:lpid",

              element:
                <LPDetailPage />,
            },

            {
              path:
                "/mypage",

              element:
                <MyPage />,
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