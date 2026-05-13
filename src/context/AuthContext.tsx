import { createContext, useContext, type ReactNode, useEffect, useState } from 'react';
import { postSignIn, postSignOut, type RequestSignInDTO } from '../apis/auth';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../constants/key';

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (signInData: RequestSignInDTO) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    try {
      const item = localStorage.getItem(ACCESS_TOKEN_KEY);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  });

  const [refreshToken, setRefreshToken] = useState<string | null>(() => {
    try {
      const item = localStorage.getItem(REFRESH_TOKEN_KEY);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const item = localStorage.getItem(ACCESS_TOKEN_KEY);
        setAccessToken(item ? JSON.parse(item) : null);
      } catch {
        setAccessToken(null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (signInData: RequestSignInDTO) => {
    try {
      const result = await postSignIn(signInData);
      if (result.status) {
        const newAccessToken = result.data.accessToken;
        const newRefreshToken = result.data.refreshToken;
        localStorage.setItem(ACCESS_TOKEN_KEY, JSON.stringify(newAccessToken));
        localStorage.setItem(REFRESH_TOKEN_KEY, JSON.stringify(newRefreshToken));
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
      }
    } catch (error) {
      console.error('로그인 에러:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await postSignOut();
    } catch (error) {
      console.error('로그아웃 에러:', error);
    } finally {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem('userName');
      setAccessToken(null);
      setRefreshToken(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};