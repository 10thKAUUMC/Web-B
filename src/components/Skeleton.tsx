export function LpCardSkeleton() {
  return (
    <div className="aspect-square bg-[#2a2a2d] animate-pulse rounded-md" />
  );
}

export function CommentSkeleton() {
  return (
    <div className="flex gap-4 items-start py-4 animate-pulse">
      <div className="w-10 h-10 bg-[#2a2a2d] rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="w-24 h-4 bg-[#2a2a2d] rounded" />
        <div className="w-full h-4 bg-[#2a2a2d] rounded" />
        <div className="w-3/4 h-4 bg-[#2a2a2d] rounded" />
      </div>
    </div>
  );
}