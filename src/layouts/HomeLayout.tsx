import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LuMenu, LuSearch, LuUser } from 'react-icons/lu';
import LpWriteModal from '../components/LpWriteModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMyAccount } from '../apis/user';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function HomeLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { accessToken, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [, , removeAccessToken] = useLocalStorage<string | null>('accessToken', null);
  const [, , removeRefreshToken] = useLocalStorage<string | null>('refreshToken', null);
  const [userName, setUserName] = useState(() => {
    try {
      const item = localStorage.getItem('userName');
      return item ? JSON.parse(item) : '회원';
    } catch {
      return '회원';
    }
  });

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const item = localStorage.getItem('userName');
        setUserName(item ? JSON.parse(item) : '회원');
      } catch {
        setUserName('회원');
      }
    };
    window.addEventListener('storage', handleStorageChange);

    const interval = setInterval(() => {
      try {
        const item = localStorage.getItem('userName');
        const name = item ? JSON.parse(item) : '회원';
        setUserName(name);
      } catch {
        setUserName('회원');
      }
    }, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: deleteMyAccount,
    onSuccess: () => {
      removeAccessToken();
      removeRefreshToken();
      localStorage.removeItem('userName');
      queryClient.clear();
      navigate('/login');
    },
    onError: () => alert('탈퇴에 실패했습니다.'),
  });

  return (
    <div className="flex flex-col h-screen bg-[#0f0f11] text-white overflow-hidden">
      <header className="h-16 flex items-center justify-between px-6 bg-[#0f0f11] shrink-0 z-50 border-b border-[#1f1f22]">
        <div className="flex items-center gap-4">
          <button onClick={toggleSidebar} className="text-gray-400 hover:text-gray-200 transition-colors">
            <LuMenu size={24} />
          </button>
          <span className="text-pink-500 font-extrabold text-xl cursor-pointer tracking-tight" onClick={() => navigate('/')}>
            돌려돌려LP판
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm font-semibold">
          <button className="text-gray-300 hover:text-white hidden sm:block">
            <LuSearch size={20} />
          </button>

          {accessToken ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-300">{userName}님 반갑습니다.</span>
              <button onClick={() => logout()} className="text-gray-400 hover:text-white">로그아웃</button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button onClick={() => navigate('/login')} className="text-gray-300 hover:text-white">로그인</button>
              <button onClick={() => navigate('/signup')} className="px-4 py-1.5 bg-pink-500 text-white rounded-md hover:bg-pink-600">회원가입</button>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <aside className={`bg-[#121212] flex flex-col transition-all duration-300 overflow-hidden shrink-0 ${isSidebarOpen ? 'w-56' : 'w-0'}`}>
          <div className="flex-1 p-6 flex flex-col gap-6 mt-2 whitespace-nowrap">
            <button onClick={() => navigate('/')} className="text-left text-gray-300 hover:text-white flex items-center gap-3 text-sm font-semibold">
              <LuSearch size={20} /> 찾기
            </button>
            <button onClick={() => navigate('/my')} className="text-left text-gray-300 hover:text-white flex items-center gap-3 text-sm font-semibold">
              <LuUser size={20} /> 마이페이지
            </button>
          </div>
          <div className="p-6 whitespace-nowrap relative z-50">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteModalOpen(true);
              }}
              className="text-gray-500 text-xs hover:text-red-400 transition-colors"
            >
              탈퇴하기
            </button>
          </div>
        </aside>

        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden top-16" onClick={() => setIsSidebarOpen(false)} />
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#0f0f11]">
          <Outlet />
        </main>

        {accessToken && (
          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="fixed bottom-8 right-8 md:bottom-10 md:right-10 w-14 h-14 bg-pink-500 rounded-full flex items-center justify-center text-white text-3xl shadow-lg hover:bg-pink-600 hover:scale-105 transition-all z-50"
          >
            +
          </button>
        )}

        {isWriteModalOpen && (
          <LpWriteModal onClose={() => setIsWriteModalOpen(false)} />
        )}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4">
            <div className="bg-[#1a1a1e] border border-[#222226] rounded-2xl p-8 w-full max-w-sm">
              <h2 className="text-white font-bold text-xl mb-3">정말 탈퇴하시겠습니까?</h2>
              <p className="text-gray-400 text-sm mb-6">탈퇴하면 모든 데이터가 삭제되며 복구할 수 없습니다.</p>
              <div className="flex gap-3">
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-[#2a2a2d] text-white rounded-lg hover:bg-[#3a3a3d] transition-colors">아니오</button>
                <button onClick={() => deleteMutate()} disabled={isDeleting} className="flex-1 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50">
                  {isDeleting ? '탈퇴 중...' : '예'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}