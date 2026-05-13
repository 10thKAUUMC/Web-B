import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // 👈 이 경로가 맞는지 꼭 확인!

const HomeLayout = () => {
  const navigate = useNavigate();
  const { accessToken, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // 로컬스토리지에서 이름을 가져와 상태로 관리
  const [userName, setUserName] = useState<string | null>(localStorage.getItem("userName"));

  useEffect(() => {
    // 닉네임 변경 시 상단 이름을 즉시 바꾸기 위한 리스너
    const handleProfileUpdate = () => {
      setUserName(localStorage.getItem("userName"));
    };

    window.addEventListener("profileUpdate", handleProfileUpdate);
    window.addEventListener("storage", handleProfileUpdate); // 다른 탭 변경 대응

    return () => {
      window.removeEventListener("profileUpdate", handleProfileUpdate);
      window.removeEventListener("storage", handleProfileUpdate);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* 사이드바 (모바일용 등) */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-zinc-900 border-r border-gray-800 transform transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <h2 className="font-bold text-lg">메뉴</h2>
          <button onClick={() => setIsOpen(false)}><X /></button>
        </div>
        <div className="flex flex-col p-4 gap-3">
          <button onClick={() => { navigate("/"); setIsOpen(false); }} className="text-left hover:text-pink-400">홈</button>
          <button onClick={() => { navigate("/search"); setIsOpen(false); }} className="text-left hover:text-pink-400">찾기</button>
          {accessToken && (
            <>
              <button onClick={() => { navigate("/mypage"); setIsOpen(false); }} className="text-left hover:text-pink-400">마이페이지</button>
              <button onClick={() => { logout(); setIsOpen(false); }} className="text-left text-red-400">로그아웃</button>
            </>
          )}
        </div>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 flex flex-col">
        <nav className="w-full h-16 bg-black border-b border-gray-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsOpen(true)}><Menu /></button>
            <div 
              className="text-pink-500 font-extrabold text-xl cursor-pointer" 
              onClick={() => navigate("/")}
            >
              돌려돌려LP판
            </div>
          </div>

          <div className="flex items-center gap-3">
            {accessToken ? (
              <>
                <p className="text-sm font-semibold">
                  {userName || "google-user"}님 반갑습니다.
                </p>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors text-sm font-semibold"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                {/* 👈 로그인 버튼 확인 */}
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md text-sm font-semibold"
                >
                  로그인
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-4 py-2 bg-pink-500 rounded-md text-sm font-bold hover:bg-pink-600 transition-colors"
                >
                  회원가입
                </button>
              </>
            )}
          </div>
        </nav>

        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default HomeLayout;