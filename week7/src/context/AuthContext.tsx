import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

import { useLocalStorage } from "../hooks/useLocalStorage";

import {
  postSignIn,
  type RequestSignInDTO,
} from "../apis/auth";

import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from "../contants/key";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (data: RequestSignInDTO) => Promise<void>;
  logout: () => void;
  
  setAuthToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [
    accessToken,
    setAccessToken,
    removeAccessToken,
  ] = useLocalStorage<string | null>(ACCESS_TOKEN_KEY, null);

  const [
    refreshToken,
    setRefreshToken,
    removeRefreshToken,
  ] = useLocalStorage<string | null>(REFRESH_TOKEN_KEY, null);

  // 일반 로그인
  const login = async (data: RequestSignInDTO) => {
    const result = await postSignIn(data);

    if (result?.data?.accessToken) {
      setAccessToken(result.data.accessToken);
      setRefreshToken(result.data.refreshToken);
    }
  };

  
  const setAuthToken = (token: string | null) => {
    setAccessToken(token);
  };

  // 로그아웃
  const logout = () => {
    removeAccessToken();
    removeRefreshToken();
    localStorage.removeItem("userName");
    // 로그아웃 후 메인으로 이동
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        login,
        logout,
        setAuthToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};