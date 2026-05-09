import { useParams } from "react-router-dom";

import useGetLpDetail
from "../hooks/queries/useGetLpDetail";

import Loading
from "../components/common/Loading";

import Error
from "../components/common/Error";

const LPDetailPage =
() => {
  const { lpid } =
    useParams();

  const {
    data,
    isPending,
    isError,
    refetch,
  } =
    useGetLpDetail(
      lpid || ""
    );

  if (isPending) {
    return <Loading />;
  }

  if (isError) {
    return (
      <Error
        retry={
          refetch
        }
      />
    );
  }

  const lp = data;

  if (!lp) {
    return (
      <div className="text-white text-center mt-20">
        LP가 없습니다.
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen
        bg-black
        text-white
        p-10
        flex
        justify-center
      "
    >
      <div
        className="
          max-w-5xl
          w-full
          flex
          gap-10
        "
      >
        {/* 썸네일 */}
        <img
          src={lp.thumbnail}
          alt={lp.title}
          className="
            w-[350px]
            h-[350px]
            object-cover
            rounded-xl
          "
        />

        {/* 내용 */}
        <div className="flex flex-col gap-5">
          <h1
            className="
              text-4xl
              font-bold
            "
          >
            {lp.title}
          </h1>

          <p className="text-gray-400">
            업로드:
            {" "}
            {
              lp.createdAt
            }
          </p>

          <p>
            ❤️ 좋아요
            {" "}
            {lp.likes}
          </p>

          <div
            className="
              bg-zinc-900
              p-5
              rounded-xl
            "
          >
            <p>
              {lp.content}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              className="
                bg-pink-500
                px-4
                py-2
                rounded
              "
            >
              수정
            </button>

            <button
              className="
                bg-red-500
                px-4
                py-2
                rounded
              "
            >
              삭제
            </button>

            <button
              className="
                bg-white
                text-black
                px-4
                py-2
                rounded
              "
            >
              ❤️ 좋아요
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default
  LPDetailPage;