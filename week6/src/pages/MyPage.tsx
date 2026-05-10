const MyPage = () => {
  const userName =
    localStorage.getItem(
      "userName"
    );

  return (
    <div className="flex-1 bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-5">
        마이페이지
      </h1>

      <p className="text-lg">
        {userName ??
          "사용자"}
        님 환영합니다.
      </p>
    </div>
  );
};

export default MyPage;