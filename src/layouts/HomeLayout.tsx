import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomeLayout = () => {
  const navigate = useNavigate();
  const { accessToken, logout } = useAuth();

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <nav className="w-full h-16 bg-black border-b border-gray-800 flex items-center justify-between px-6">
        <div 
          className="text-pink-500 font-extrabold text-xl cursor-pointer"
          onClick={() => navigate('/')}
        >
          돌려돌려LP판
        </div>
        <div className="flex gap-2">
          {accessToken ? (
            <button 
              onClick={logout}
              className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors text-sm font-semibold"
            >
              로그아웃
            </button>
          ) : (
            <>
              <button 
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors text-sm font-semibold"
              >
                로그인
              </button>
              <button 
                onClick={() => navigate('/signup')}
                className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors text-sm font-bold"
              >
                회원가입
              </button>
            </>
          )}
        </div>
      </nav>

      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
};

export default HomeLayout;