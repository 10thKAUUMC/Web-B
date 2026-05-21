import { createContext, useContext, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
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
  const [accessToken, setAccessTokenToStorage, removeAccessTokenFromStorage] = 
    useLocalStorage<string | null>(ACCESS_TOKEN_KEY, null);
  const [refreshToken, setRefreshTokenToStorage, removeRefreshTokenFromStorage] = 
    useLocalStorage<string | null>(REFRESH_TOKEN_KEY, null);

  const login = async (signInData: RequestSignInDTO) => {
    try {
      const result = await postSignIn(signInData);
      if (result.status) {
        setAccessTokenToStorage(result.data.accessToken);
        setRefreshTokenToStorage(result.data.refreshToken);
      }
    } catch (error) {
      console.error("로그인 에러:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (accessToken) {
        await postSignOut(accessToken);
      }
    } catch (error) {
      console.error("로그아웃 에러:", error);
    } finally {
      removeAccessTokenFromStorage();
      removeRefreshTokenFromStorage();
      localStorage.removeItem('userName');
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