import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../utils/schemas";
import { useAuth } from "../context/AuthContext";
import { useLpMutation } from "../hooks/useLpMutation";
import { useGoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const navigate = useNavigate();
  const { accessToken, setAuthToken } = useAuth();
  const mutation = useLpMutation() as any; // 훅 전체를 가져옴
  
  // 훅 내부 구조에 맞춰 안전하게 접근
  const userMutation = mutation?.user || mutation; 

  useEffect(() => {
    if (accessToken) {
      navigate("/", { replace: true });
    }
  }, [accessToken, navigate]);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const token = tokenResponse.access_token;
      
      if (userMutation?.googleLogin?.mutate) {
        userMutation.googleLogin.mutate({ token }, {
          onSuccess: (res: any) => {
            const serverToken = res?.data?.accessToken || res?.accessToken;
            completeLogin(serverToken, "Google User");
          },
          onError: () => completeLogin(token, "Google User")
        });
      } else {
        completeLogin(token, "Google User");
      }
    },
    onError: () => alert("Google 로그인 실패"),
  });

  const { register, handleSubmit, formState: { isValid } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = (data: LoginFormData) => {
    if (userMutation?.login?.mutate) {
      userMutation.login.mutate(data, {
        onSuccess: (res: any) => {
          const token = res?.data?.accessToken || res?.accessToken || "dummy-token";
          completeLogin(token, data.email.split("@")[0]);
        },
        onError: () => alert("로그인 실패: 정보를 확인하세요.")
      });
    } else {
      // 훅이 제대로 동작 안 할 경우 비상용
      completeLogin("emergency-token", "User");
    }
  };

  const completeLogin = (token: string, name: string) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("userName", name);
    if (setAuthToken) setAuthToken(token);
    window.dispatchEvent(new Event("profileUpdate"));
    navigate("/", { replace: true });
  };

  // 🔥 에러 원인 해결: isLoading/isPending을 안전하게 체크
  const isLoggingIn = 
    userMutation?.login?.isLoading || 
    userMutation?.login?.isPending || 
    false;

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-black text-white p-6 min-h-screen">
      <div className="w-full max-w-sm">
        <h1 className="text-4xl font-black mb-10 italic text-pink-500 text-center">LP RECORD</h1>
        
        <button
          type="button"
          onClick={() => googleLogin()}
          className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-bold mb-6 w-full justify-center hover:bg-zinc-200 transition"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-6 h-6" />
          Google로 시작하기
        </button>

        <div className="flex items-center gap-4 w-full mb-6 text-zinc-700">
          <div className="h-[1px] bg-zinc-800 flex-1" />
          <span className="text-xs font-bold text-zinc-500 uppercase">OR</span>
          <div className="h-[1px] bg-zinc-800 flex-1" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input 
            placeholder="Email" 
            {...register("email")} 
            className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-pink-500 transition text-white" 
          />
          <input 
            type="password" 
            placeholder="Password" 
            {...register("password")} 
            className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-pink-500 transition text-white" 
          />
          
          <button 
            type="submit"
            disabled={!isValid || isLoggingIn} 
            className="bg-pink-600 p-4 rounded-xl font-bold text-lg hover:bg-pink-500 transition disabled:opacity-50 disabled:bg-zinc-800 mt-4 shadow-lg shadow-pink-600/20 active:scale-95"
          >
            {isLoggingIn ? "인증 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
}