const LPSkeleton = () => {
  return (
    <div className="relative overflow-hidden rounded-lg bg-zinc-800 aspect-square border border-zinc-700 animate-pulse">
      {/* 이미지 영역 가짜 박스 */}
      <div className="w-full h-full bg-zinc-700" />
      
      {/* 하단 텍스트 영역 가짜 박스 */}
      <div className="absolute inset-0 flex flex-col justify-end p-3 space-y-2">
        <div className="h-4 bg-zinc-600 rounded w-3/4" />
        <div className="h-3 bg-zinc-600 rounded w-1/2" />
      </div>
    </div>
  );
};

export default LPSkeleton;