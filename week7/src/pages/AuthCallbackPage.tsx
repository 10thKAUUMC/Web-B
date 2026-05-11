import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');

    console.log('Google OAuth Code:', code);

    
    if (code) {
      localStorage.setItem('accessToken', 'google_fake_access_token');
      localStorage.setItem('refreshToken', 'google_fake_refresh_token');
      localStorage.setItem('userName', 'google_user');

      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen text-white bg-black">
      Google 로그인 처리 중...
    </div>
  );
}