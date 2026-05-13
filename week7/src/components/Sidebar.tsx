import { useNavigate } from "react-router-dom";
import { useLpMutation } from "../hooks/useLpMutation";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user } = useLpMutation();
  const { setAuthToken } = useAuth();

  const handleLogout = () => {
    // 괄호 안을 비우면(void) TypeScript 에러가 사라집니다.
    user.logout.mutate(undefined, { 
      onSuccess: () => {
        setAuthToken(null);
        localStorage.clear();
        navigate("/login");
      }
    });
  };

  const handleWithdraw = () => {
    if (window.confirm("정말로 탈퇴하시겠습니까? 모든 데이터가 사라집니다.")) {
      // 여기도 undefined를 명시하거나 mutationFn 정의에 맞춰 비워줍니다.
      user.withdraw.mutate(undefined, {
        onSuccess: () => {
          setAuthToken(null);
          localStorage.clear();
          navigate("/login");
        }
      });
    }
  };

  return (
    <div className="w-64 bg-zinc-950 h-screen p-6 flex flex-col border-r border-zinc-900">
      <div className="flex-1 space-y-4">
        <button onClick={() => navigate("/")} className="w-full text-left font-bold text-lg text-pink-500 mb-10">LP RECORD</button>
        <button onClick={() => navigate("/")} className="w-full text-left text-zinc-400 hover:text-white">홈</button>
        <button onClick={() => navigate("/mypage")} className="w-full text-left text-zinc-400 hover:text-white">마이페이지</button>
      </div>
      
      <div className="pt-10 border-t border-zinc-900 space-y-4">
        <button onClick={handleLogout} className="w-full text-left text-sm text-zinc-500 hover:text-white">로그아웃</button>
        <button onClick={handleWithdraw} className="w-full text-left text-sm text-red-900 hover:text-red-500">탈퇴하기</button>
      </div>
    </div>
  );
};

export default Sidebar;