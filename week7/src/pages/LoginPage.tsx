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
  const { user } = useLpMutation();

  // 이미 로그인된 토큰이 있으면 즉시 홈으로 이동
  useEffect(() => {
    if (accessToken) {
      console.log("이미 토큰이 있음:", accessToken);
      navigate("/", { replace: true });
    }
  }, [accessToken, navigate]);

  
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("구글 인증 성공, 서버 확인 중...");
      
      // 1. 서버 연동이 아직 안 되어 있다면 우선 로컬에서 로그인 처리 (테스트용)
      // 서버 연동 시에는 아래 user.googleLogin.mutate를 사용하세요.
      const token = tokenResponse.access_token;
      
      // 2. 상태 업데이트 (Context -> LocalStorage 순서가 중요)
      localStorage.setItem("accessToken", token);
      localStorage.setItem("userName", "google-user");
      setAuthToken(token); // Context 상태를 마지막에 업데이트하여 리렌더링 유발
      
      alert("구글 로그인 성공!");
      navigate("/", { replace: true });
    },
    onError: () => alert("Google 로그인 실패"),
  });

  const { register, handleSubmit, formState: { isValid } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  // 일반 로그인 로직
  const onSubmit = (data: LoginFormData) => {
    user.login.mutate(data, {
      onSuccess: (res: any) => {
        // 서버 응답 구조(res.data 혹은 res.accessToken)를 확인하세요!
        const token = res?.data?.accessToken || res?.accessToken || "dummy-token";
        
        localStorage.setItem("accessToken", token);
        localStorage.setItem("userName", data.email.split("@")[0]);
        setAuthToken(token);
        
        navigate("/", { replace: true });
      },
      onError: (err) => {
        console.error("로그인 에러:", err);
        alert("로그인 정보가 올바르지 않습니다.");
      }
    });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-black text-white p-6 min-h-screen">
      <h1 className="text-4xl font-black mb-10 italic text-pink-500">LOG IN</h1>
      
      <button
        onClick={() => googleLogin()}
        className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-bold mb-6 w-full max-w-sm justify-center hover:bg-zinc-200 transition"
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-6 h-6" />
        Google로 시작하기
      </button>

      <div className="flex items-center gap-4 w-full max-w-sm mb-6 text-zinc-700">
        <div className="h-[1px] bg-zinc-800 flex-1" />
        <span className="text-xs">OR</span>
        <div className="h-[1px] bg-zinc-800 flex-1" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-sm">
        <input 
          placeholder="Email" 
          {...register("email")} 
          className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-pink-500 transition" 
        />
        <input 
          type="password" 
          placeholder="Password" 
          {...register("password")} 
          className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-pink-500 transition" 
        />
        <button 
          disabled={!isValid || user.login.isPending} 
          className="bg-pink-600 p-4 rounded-xl font-bold text-lg hover:bg-pink-500 transition disabled:opacity-50 mt-4 shadow-lg shadow-pink-600/20"
        >
          {user.login.isPending ? "처리 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}