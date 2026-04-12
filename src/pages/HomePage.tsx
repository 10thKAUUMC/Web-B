import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');
  const isLoggedIn = !!localStorage.getItem('accessToken');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userName');
    window.location.reload();
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-bold mb-8">메인 페이지</h1>
      
      {isLoggedIn ? (
        <div className="text-center">
          <p className="text-xl mb-6 text-pink-500">{userName}님, 로그인이 완료되었습니다!</p>
          <button 
            onClick={handleLogout}
            className="px-6 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            로그아웃
          </button>
        </div>
      ) : (
        <button 
          onClick={() => navigate('/login')}
          className="px-6 py-3 bg-pink-500 text-white font-bold rounded-lg hover:bg-pink-600 transition-colors"
        >
          로그인하러 가기
        </button>
      )}
    </div>
  );
}