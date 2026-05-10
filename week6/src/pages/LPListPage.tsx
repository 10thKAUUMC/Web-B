import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useGetLpList from "../hooks/queries/useGetLpList";
import LPSkeleton from "../components/common/LPSkeleton";
import Error from "../components/common/Error";

interface LP {
  id: string | number;
  title: string;
  thumbnail: string;
  likes: number;
}

const LPListPage = () => {
  const navigate = useNavigate();
  const observerRef = useRef<HTMLDivElement | null>(null);
  
  const [sort, setSort] = useState<"desc" | "asc">("desc");
  const [visibleCount, setVisibleCount] = useState(8);
  const [isFakeLoading, setIsFakeLoading] = useState(false);

  const { data, isLoading, isError, refetch } = useGetLpList();

  const rawData = Array.isArray(data) ? data : (data as any)?.data || [];
  const sortedLps = [...rawData].sort((a, b) => {
    return sort === "desc" ? Number(b.id) - Number(a.id) : Number(a.id) - Number(b.id);
  });

  const displayLps = sortedLps.slice(0, visibleCount);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < sortedLps.length) {
          setIsFakeLoading(true);
          
          setTimeout(() => {
            setVisibleCount((prev) => prev + 8);
            setIsFakeLoading(false);
          }, 1000);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [visibleCount, sortedLps.length]);

  if (isError) return <Error retry={refetch} />;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => { setSort("desc"); setVisibleCount(8); }}
          className={`px-5 py-2 rounded font-bold transition ${sort === "desc" ? "bg-pink-500" : "bg-zinc-800 text-gray-400"}`}
        >
          최신순
        </button>
        <button
          onClick={() => { setSort("asc"); setVisibleCount(8); }}
          className={`px-5 py-2 rounded font-bold transition ${sort === "asc" ? "bg-pink-500" : "bg-zinc-800 text-gray-400"}`}
        >
          오래된순
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => <LPSkeleton key={`initial-${i}`} />)
        ) : (
          displayLps.map((lp: LP) => (
            <div
              key={lp.id}
              onClick={() => navigate(`/lp/${lp.id}`)}
              className="relative overflow-hidden rounded-lg cursor-pointer group bg-zinc-900 aspect-square border border-zinc-800"
            >
              <img src={lp.thumbnail} alt={lp.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-3">
                <p className="font-bold text-sm truncate">{lp.title}</p>
                <p className="text-xs text-pink-400">❤️ {lp.likes}</p>
              </div>
            </div>
          ))
        )}

        {isFakeLoading && 
          Array.from({ length: 4 }).map((_, i) => <LPSkeleton key={`fake-${i}`} />)
        }
      </div>

      <div ref={observerRef} className="h-10 w-full" />
      
      {!isFakeLoading && visibleCount >= sortedLps.length && sortedLps.length > 0 && (
        <div className="text-center py-10 text-zinc-600 italic">
          마지막 페이지입니다.
        </div>
      )}
    </div>
  );
};

export default LPListPage;