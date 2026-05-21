import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { LuSearch } from 'react-icons/lu';
import useDebounce from '../hooks/useDebounce';
import useGetSearchLpList from '../hooks/queries/useGetSearchLpList';
// ✨ 기존에 만들어두신 LpCard 컴포넌트 임포트! (경로는 실제 폴더 구조에 맞게 맞춰주세요)
import LpCard from '../components/LpCard'; 

export default function SearchPage() {
  const [searchInput, setSearchInput] = useState('');
  
  const debouncedSearch = useDebounce(searchInput, 300);

  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading 
  } = useGetSearchLpList(debouncedSearch);

  const { ref, inView } = useInView({ threshold: 0.5 });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const searchResults = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="max-w-5xl mx-auto w-full pt-8 pb-20 flex flex-col gap-8">
      <div className="relative w-full max-w-2xl mx-auto">
        <LuSearch size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="검색어를 입력해주세요"
          className="w-full bg-[#151518] border-2 border-[#2a2a2d] rounded-full pl-14 pr-6 py-4 text-white focus:outline-none focus:border-pink-500 transition-colors text-lg font-semibold shadow-lg"
        />
      </div>

      <div className="mt-4">
        {!debouncedSearch.trim() ? (
          <div className="text-center text-gray-500 mt-20 text-lg">
            원하는 LP를 검색해보세요!
          </div>
        ) : isLoading ? (
          <div className="flex justify-center mt-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="text-center text-gray-400 mt-20 text-lg">
            "{debouncedSearch}"에 대한 검색 결과가 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {searchResults.map((lp: any) => (
              <LpCard key={lp.id} lp={lp} />
            ))}
          </div>
        )}
        
        {isFetchingNextPage && (
          <div className="flex justify-center my-8">
            <div className="animate-pulse flex gap-2">
              <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
              <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
              <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
            </div>
          </div>
        )}
        <div ref={ref} className="h-4" />
      </div>
    </div>
  );
}