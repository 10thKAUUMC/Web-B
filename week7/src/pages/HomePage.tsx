import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate =
    useNavigate();

  const token =
    localStorage.getItem(
      "accessToken"
    );

  const name =
    localStorage.getItem(
      "userName"
    );

  const isLoggedIn =
    !!token;

  return (
    <div className="text-white flex flex-col items-center justify-center h-screen gap-5">
      <h1 className="text-3xl">
        메인 페이지
      </h1>

      {isLoggedIn ? (
        <p>
          {name}님 로그인
          상태입니다
        </p>
      ) : (
        <button
          onClick={() =>
            navigate("/login")
          }
          className="bg-blue-500 px-4 py-2 rounded"
        >
          로그인하러 가기
        </button>
      )}

      <button
        onClick={() =>
          navigate("/lps")
        }
        className="bg-pink-500 px-5 py-2 rounded"
      >
        LP 목록 보기
      </button>
    </div>
  );
}