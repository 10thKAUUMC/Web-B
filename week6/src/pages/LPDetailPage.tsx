import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import LPSkeleton from "../components/common/LPSkeleton";

interface Comment {
  id: number;
  author: string;
  text: string;
  createdAt: string;
}

const LPDetailPage = () => {
  const { lpid } = useParams<{ lpid: string }>();
  const navigate = useNavigate();
  const observerRef = useRef<HTMLDivElement | null>(null);

  const { data: lp, isLoading, isError } = useGetLpDetail(lpid);

  const [comments, setComments] = useState<Comment[]>([]);
  const [sort, setSort] = useState<"desc" | "asc">("desc");
  const [visibleCount, setVisibleCount] = useState(5);
  const [isFakeLoading, setIsFakeLoading] = useState(false);

  useEffect(() => {
    const fakeData: Comment[] = Array.from({ length: 15 }).map((_, i) => ({
      id: i + 1,
      author: `레코드매니아_${i + 1}`,
      text: `${i + 1}번 트랙 너무 좋아요! 이 앨범은 정말 명반입니다.`,
      createdAt: `2026.05.10`,
    }));
    setComments(fakeData);
  }, []);

  const sortedComments = [...comments].sort((a, b) => {
    return sort === "desc" ? b.id - a.id : a.id - b.id;
  });
  const displayComments = sortedComments.slice(0, visibleCount);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < comments.length) {
          setIsFakeLoading(true);
          setTimeout(() => {
            setVisibleCount((prev) => prev + 5);
            setIsFakeLoading(false);
          }, 800);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [visibleCount, comments.length]);

  if (isLoading) return <div className="min-h-screen bg-black text-white p-10 font-bold">로딩 중...</div>;
  if (isError || !lp) return <div className="min-h-screen bg-black text-white p-10 font-bold">데이터를 찾을 수 없습니다.</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-20">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-8 text-zinc-400 hover:text-pink-500 transition flex items-center gap-2"
      >
        <span className="text-xl">←</span> 뒤로가기
      </button>

      <div className="flex flex-col lg:flex-row gap-12 mb-16 items-start">
        <div className="w-full lg:w-[400px] shrink-0">
          <img 
            src={lp.thumbnail} 
            alt={lp.title} 
            className="w-full aspect-square object-cover rounded-2xl shadow-2xl shadow-pink-500/10 border border-zinc-800"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-5xl font-black mb-6 bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
            {lp.title}
          </h1>
          <div className="flex items-center gap-4 mb-8">
            <span className="px-4 py-1.5 bg-pink-500/10 text-pink-500 rounded-full font-bold border border-pink-500/20">
              ❤️ {lp.likes} Likes
            </span>
            <span className="text-zinc-500">{lp.createdAt}</span>
          </div>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
            {lp.content || "상세 설명이 포함되어 있지 않은 앨범입니다. 하지만 수록곡만으로도 충분히 가치가 있습니다."}
          </p>
        </div>
      </div>

      <div className="h-[1px] bg-zinc-900 w-full mb-12" />

      <div className="max-w-3xl mx-auto lg:mx-0">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            Comments <span className="text-pink-500">{comments.length}</span>
          </h2>
          <div className="bg-zinc-900 p-1 rounded-lg flex gap-1">
            <button 
              onClick={() => { setSort("desc"); setVisibleCount(5); }}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${sort === "desc" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              최신순
            </button>
            <button 
              onClick={() => { setSort("asc"); setVisibleCount(5); }}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${sort === "asc" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              오래된순
            </button>
          </div>
        </div>

        <div className="flex gap-4 mb-12">
          <div className="w-12 h-12 rounded-full bg-zinc-800 shrink-0 border border-zinc-700" />
          <div className="flex-1">
            <input 
              type="text" 
              placeholder="음악에 대한 생각을 나눠보세요..." 
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 focus:outline-none focus:border-pink-500/50 focus:bg-zinc-900 transition"
            />
          </div>
        </div>

        <div className="space-y-8">
          {displayComments.map((comment) => (
            <div key={comment.id} className="flex gap-5 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 shrink-0 border border-zinc-800" />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-zinc-200">{comment.author}</span>
                  <span className="text-xs text-zinc-600">{comment.createdAt}</span>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">{comment.text}</p>
              </div>
            </div>
          ))}

          {isFakeLoading && (
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-5 animate-pulse">
                  <div className="w-12 h-12 rounded-full bg-zinc-900" />
                  <div className="flex-1 space-y-3">
                    <div className="h-3 bg-zinc-900 rounded w-1/4" />
                    <div className="h-3 bg-zinc-900 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div ref={observerRef} className="h-20 w-full" />
      </div>
    </div>
  );
};

export default LPDetailPage;