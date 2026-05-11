import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useGetLpList from "../hooks/queries/useGetLpList";
import LPSkeleton from "../components/common/LPSkeleton";
import Error from "../components/common/Error";
import LpModal from "../components/LpModal"; // 우리가 만든 새 모달 임포트

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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <div className="min-h-screen bg-black text-white p-6 relative">
      {/* 상단 버튼 */}
      <div className="flex gap-3 mb-6">
        <button onClick={() => { setSort("desc"); setVisibleCount(8); }} className={`px-5 py-2 rounded font-bold transition ${sort === "desc" ? "bg-pink-500 text-white" : "bg-zinc-800 text-gray-400"}`}>최신순</button>
        <button onClick={() => { setSort("asc"); setVisibleCount(8); }} className={`px-5 py-2 rounded font-bold transition ${sort === "asc" ? "bg-pink-500 text-white" : "bg-zinc-800 text-gray-400"}`}>오래된순</button>
      </div>

      {/* 리스트 구역 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {isLoading ? Array.from({ length: 8 }).map((_, i) => <LPSkeleton key={`initial-${i}`} />) : 
          displayLps.map((lp: LP) => (
            <div key={lp.id} onClick={() => navigate(`/lp/${lp.id}`)} className="relative overflow-hidden rounded-lg cursor-pointer group bg-zinc-900 aspect-square border border-zinc-800 shadow-lg">
              <img src={lp.thumbnail} alt={lp.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <p className="font-bold text-sm truncate text-white">{lp.title}</p>
                <p className="text-xs text-pink-400 font-medium">❤️ {lp.likes}</p>
              </div>
            </div>
          ))
        }
        {isFakeLoading && Array.from({ length: 4 }).map((_, i) => <LPSkeleton key={`fake-${i}`} />)}
      </div>

      <div ref={observerRef} className="h-20 w-full" />

      {/* 플로팅 버튼 */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-10 right-10 bg-pink-500 w-16 h-16 rounded-full text-white text-4xl shadow-2xl hover:scale-110 active:scale-95 transition-all z-40 flex items-center justify-center font-light"
      > + </button>

      {/* [수정!] 외부 컴포넌트인 LpModal을 호출합니다. */}
      {isModalOpen && <LpModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default LPListPage;