import { useNavigate } from 'react-router-dom';

export default function LoginSuccessPage() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || '회원';

  return (
    <div className="min-h-full flex flex-col items-center justify-center px-4 bg-[#0f0f11] text-white">
      <div className="w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4 text-pink-500">로그인 완료</h1>
        <p className="text-lg mb-10">{userName}님, 환영합니다!</p>
        
        <button
          onClick={() => navigate('/')}
          className="w-full py-4 rounded-lg font-bold bg-pink-500 text-white hover:bg-pink-600 transition-colors"
        >
          메인으로 가기
        </button>
      </div>
    </div>
  );
}