import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Lp } from '../types/lp';
import { FaHeart } from 'react-icons/fa';
import { LpCardSkeleton } from './Skeleton';

interface LpCardProps {
  lp: Lp;
}

const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins} mins ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  return `${diffDays} days ago`;
};

export default function LpCard({ lp }: LpCardProps) {
  const navigate = useNavigate();
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div
      onClick={() => navigate(`/lp/${lp.id}`)}
      className="group relative aspect-square cursor-pointer bg-[#121212] overflow-hidden transition-transform duration-300 hover:scale-105 hover:z-20 hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
    >
      {!isImageLoaded && (
        <div className="absolute inset-0 z-10">
          <LpCardSkeleton />
        </div>
      )}

      <img
        src={lp.thumbnail || 'https://via.placeholder.com/400'}
        alt={lp.title}
        onLoad={() => setIsImageLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isImageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {isImageLoaded && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
          <h3 className="text-white font-bold text-lg leading-snug line-clamp-4 mb-4">
            {lp.title}
          </h3>
          <div className="flex justify-between items-center">
            <span className="text-gray-200 text-sm font-medium">
              {timeAgo(lp.createdAt)}
            </span>
            <div className="flex items-center gap-1.5 text-white text-sm font-semibold">
              <FaHeart size={14} className="text-white" />
              <span>{lp.likes?.length || 0}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}