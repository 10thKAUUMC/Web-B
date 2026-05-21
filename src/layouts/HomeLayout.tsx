import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LuMenu, LuSearch, LuUser } from 'react-icons/lu';
import { FiX } from 'react-icons/fi';
import LpWriteModal from '../components/LpWriteModal';
import { useLogoutMutation, useWithdrawMutation } from '../hooks/mutations/useAuthMutations';
import useGetMyInfo from '../hooks/queries/useGetMyInfo';

export default function HomeLayout() {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  
  const { data: me } = useGetMyInfo(!!accessToken);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  
  const userName = me?.name || localStorage.getItem('userName') || '회원';
  
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const { mutate: logoutMutate } = useLogoutMutation();
  const { mutate: withdrawMutate } = useWithdrawMutation();

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
          <button 
            onClick={() => navigate('/search')} 
            className="text-gray-300 hover:text-white hidden sm:block"
          >
            <LuSearch size={20} />
          </button>
          
          {accessToken ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-300">{userName}님 반갑습니다.</span>
              <button onClick={() => logoutMutate()} className="text-gray-400 hover:text-white">로그아웃</button>
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
        <aside 
          className={`bg-[#121212] flex flex-col transition-all duration-300 overflow-hidden shrink-0 ${
            isSidebarOpen ? 'w-56' : 'w-0'
          }`}
        >
          <div className="flex-1 p-6 flex flex-col gap-6 mt-2 whitespace-nowrap">
            {/* ✨ 모바일/사이드바 찾기 버튼에 navigate 추가 */}
            <button onClick={() => navigate('/search')} className="text-left text-gray-300 hover:text-white flex items-center gap-3 text-sm font-semibold">
              <LuSearch size={20} /> 찾기
            </button>
            <button onClick={() => navigate('/my')} className="text-left text-gray-300 hover:text-white flex items-center gap-3 text-sm font-semibold">
              <LuUser size={20} /> 마이페이지
            </button>
          </div>
          <div className="p-6 whitespace-nowrap">
            {accessToken && (
              <button onClick={() => setIsWithdrawModalOpen(true)} className="text-gray-500 text-xs hover:text-gray-300">
                탈퇴하기
              </button>
            )}
          </div>
        </aside>

        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden top-16" 
            onClick={() => setIsSidebarOpen(false)} 
          />
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#0f0f11]">
          <Outlet />
        </main>

        {accessToken && (
          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="fixed bottom-8 right-8 md:bottom-10 md:right-10 w-14 h-14 bg-pink-500 rounded-full flex items-center justify-center text-white text-3xl shadow-lg hover:bg-pink-600 hover:scale-105 transition-all z-40"
          >
            +
          </button>
        )}
      </div>

      {isWriteModalOpen && (
        <LpWriteModal onClose={() => setIsWriteModalOpen(false)} />
      )}

      {isWithdrawModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-[110] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#222226] w-full max-w-sm rounded-3xl p-8 relative flex flex-col items-center gap-6 shadow-2xl border border-[#333338]">
            <button onClick={() => setIsWithdrawModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <FiX size={20} />
            </button>
            
            <p className="text-lg font-bold text-white mt-4">정말 탈퇴하시겠습니까?</p>
            
            <div className="flex gap-4 w-full mt-2">
              <button 
                onClick={() => withdrawMutate()}
                className="flex-1 bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
              >
                예
              </button>
              <button 
                onClick={() => setIsWithdrawModalOpen(false)}
                className="flex-1 bg-pink-500 text-white font-bold py-3 rounded-xl hover:bg-pink-600 transition-colors"
              >
                아니오
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}