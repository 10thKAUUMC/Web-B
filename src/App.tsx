import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomeLayout from './layouts/HomeLayout';
import ProtectedLayout from './layouts/ProtectedLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import LoginSuccessPage from './pages/LoginSuccessPage';
import SignupPage from './pages/SignupPage';
import GoogleLoginRedirectPage from './pages/GoogleLoginRedirectPage';
import LpDetailPage from './pages/LpDetailPage';
import MyPage from './pages/MyPage';
import { AuthProvider } from './context/AuthContext';
import SearchPage from './pages/SearchPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/signup',
        element: <SignupPage />,
      },
      {
        path: '/search',
        element: <SearchPage />,
      },
      {
        path: '/google-callback',
        element: <GoogleLoginRedirectPage />,
      },
      {
        path: '/v1/auth/google/callback',
        element: <GoogleLoginRedirectPage />,
      },
      {
        element: <ProtectedLayout />,
        children: [
          {
            path: '/login-success',
            element: <LoginSuccessPage />,
          },
          {
            path: '/lp/:lpid',
            element: <LpDetailPage />,
          },
          {
            path: '/my',
            element: <MyPage />,
          },
        ],
      },
    ],
  },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}