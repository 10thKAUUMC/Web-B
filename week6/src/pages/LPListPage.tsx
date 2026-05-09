import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useGetLpList from "../hooks/queries/useGetLpList";

import Loading from "../components/common/Loading";
import Error from "../components/common/Error";

const LPListPage = () => {
  const navigate =
    useNavigate();

  const [sort, setSort] =
    useState("desc");

  const {
    data,
    isPending,
    isError,
    refetch,
  } = useGetLpList(1, sort);

  console.log(data);

  if (isPending) {
    return <Loading />;
  }

  if (isError) {
    return (
      <Error retry={refetch} />
    );
  }

  // API 응답 구조 맞춤
  const lps = data ?? [];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* 정렬 버튼 */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() =>
            setSort("desc")
          }
          className={`
            px-5 py-2 rounded
            ${
              sort === "desc"
                ? "bg-pink-500"
                : "bg-gray-600"
            }
          `}
        >
          최신순
        </button>

        <button
          onClick={() =>
            setSort("asc")
          }
          className={`
            px-5 py-2 rounded
            ${
              sort === "asc"
                ? "bg-pink-500"
                : "bg-gray-600"
            }
          `}
        >
          오래된순
        </button>
      </div>

      {/* LP 카드 */}
      <div
        className="
          grid
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-5
          gap-4
        "
      >
        {lps.map((lp: any) => (
          <div
            key={lp.id}
            onClick={() =>
              navigate(
                `/lp/${lp.id}`
              )
            }
            className="
              relative
              overflow-hidden
              rounded-lg
              cursor-pointer
              group
              transition-transform
              duration-300
              hover:scale-105
            "
          >
            {/* 썸네일 */}
            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="
                w-full
                aspect-square
                object-cover
              "
            />

            {/* hover overlay */}
            <div
              className="
                absolute
                inset-0
                bg-black/60
                opacity-0
                group-hover:opacity-100
                transition
                flex
                flex-col
                justify-end
                p-3
              "
            >
              <p className="font-bold text-sm">
                {lp.title}
              </p>

              <p className="text-xs text-gray-300">
                {lp.createdAt}
              </p>

              <p className="text-xs">
                ❤️{" "}
                {lp.likes?.length ??
                  0}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LPListPage;