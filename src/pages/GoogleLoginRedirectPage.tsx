import { useEffect } from 'react';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../constants/key';

const GoogleLoginRedirectPage = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('accessToken');
    const refreshToken = urlParams.get('refreshToken');
    const name = urlParams.get('name');

    if (accessToken && refreshToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, JSON.stringify(accessToken));
      localStorage.setItem(REFRESH_TOKEN_KEY, JSON.stringify(refreshToken));
      if (name) localStorage.setItem('userName', JSON.stringify(name));
      window.location.href = '/login-success';
    } else {
      alert('구글 로그인에 실패했습니다.');
      window.location.href = '/login';
    }
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <p className="text-xl font-bold text-pink-500">구글 로그인 처리 중입니다...</p>
    </div>
  );
};

export default GoogleLoginRedirectPage;