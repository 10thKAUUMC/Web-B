import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import useGetLpList from '../hooks/queries/useGetLpList';
import LpCard from '../components/LpCard';
import { LpCardSkeleton } from '../components/Skeleton';
import { type Lp } from '../types/lp';
import useThrottle from '../hooks/useThrottle';

export default function HomePage() {
  const [order, setOrder] = useState<'desc' | 'asc'>('desc'); 
  const [search, setSearch] = useState('');
  
  const { 
    data, 
    isLoading, 
    isError, 
    refetch, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useGetLpList(order, search);

  const { ref, inView } = useInView();
  const throttledInView = useThrottle(inView, 1000);

  useEffect(() => {
    if (throttledInView && hasNextPage) { // ✅ inView → throttledInView
      console.log('🔥 Throttle 적용 - 다음 페이지 로드:', new Date().toLocaleTimeString());
      fetchNextPage();
    }
  }, [throttledInView, hasNextPage, fetchNextPage]);

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-full gap-4">
        <p className="text-red-500 text-lg">데이터 로드 실패</p>
        <button onClick={() => refetch()} className="px-4 py-2 bg-pink-500 text-white rounded">
          재시도
        </button>
      </div>
    );
  }

  const lpList = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-end px-2">
        <div className="flex border border-gray-600 rounded text-sm font-bold overflow-hidden">
          <button
            onClick={() => setOrder('asc')}
            className={`px-4 py-1.5 transition-colors ${
              order === 'asc' ? 'bg-white text-black' : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            오래된순
          </button>
          <div className="w-px bg-gray-600"></div>
          <button
            onClick={() => setOrder('desc')}
            className={`px-4 py-1.5 transition-colors ${
              order === 'desc' ? 'bg-white text-black' : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            최신순
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {isLoading && Array.from({ length: 10 }).map((_, i) => <LpCardSkeleton key={`init-skel-${i}`} />)}

        {lpList.map((lp: Lp) => (
          <LpCard key={lp.id} lp={lp} />
        ))}

        {isFetchingNextPage && Array.from({ length: 5 }).map((_, i) => <LpCardSkeleton key={`next-skel-${i}`} />)}
      </div>
      
      {!isLoading && lpList.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          표시할 LP가 없습니다.
        </div>
      )}

      <div ref={ref} className="h-10 w-full" /> 
    </div>
  );
}