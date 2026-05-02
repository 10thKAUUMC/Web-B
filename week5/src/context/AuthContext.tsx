import { createContext, useContext, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { postSignIn, type RequestSignInDTO } from '../apis/auth';

interface AuthContextType {
  user: any;
  login: (signInData: RequestSignInDTO) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser, removeUser] = useLocalStorage<any>('user', null);

  const login = async (signInData: RequestSignInDTO) => {
    try {
      const result = await postSignIn(signInData);

      // ✅ 로그인 성공 시 유저 저장
      setUser(result);

    } catch (error) {
      console.error("로그인 에러:", error);
      throw error;
    }
  };

  const logout = () => {
    removeUser();
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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