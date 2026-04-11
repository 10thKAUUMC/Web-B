import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import LoginSuccessPage from './pages/LoginSuccessPage';
import SignupPage from './pages/SignupPage';
import Navbar from './components/Navbar';

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
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
        path: '/login-success',
        element: <LoginSuccessPage />,
      },
      {
        path: '/signup', 
        element: <SignupPage />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}