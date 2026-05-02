import { createContext, useContext, type ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { postSignIn, postSignOut, type RequestSignInDTO } from "../apis/auth";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../contants/key";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (data: RequestSignInDTO) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken, removeAccessToken] =
    useLocalStorage<string | null>(ACCESS_TOKEN_KEY, null);

  const [refreshToken, setRefreshToken, removeRefreshToken] =
    useLocalStorage<string | null>(REFRESH_TOKEN_KEY, null);

  const login = async (data: RequestSignInDTO) => {
    const result = await postSignIn(data);

    if (result?.data?.accessToken) {
      setAccessToken(result.data.accessToken);
      setRefreshToken(result.data.refreshToken);
    }
  };

  // 🔥 구글 로그인/일반 로그인 둘 다 대응 가능하게 유지
  const logout = async () => {
    try {
      if (accessToken) {
        await postSignOut(accessToken);
      }
    } catch (e) {
      console.log(e);
    } finally {
      removeAccessToken();
      removeRefreshToken();
      localStorage.removeItem("userName");
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
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};