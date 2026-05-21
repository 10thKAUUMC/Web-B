import { useInfiniteQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../apis/axios';

// API Fetch 함수
const fetchSearchLps = async ({ pageParam = 0, queryKey }: any) => {
  const [_key, search] = queryKey;
  
  const params = new URLSearchParams({ limit: '10' });
  if (pageParam) params.append('cursor', pageParam.toString());
  if (search) params.append('search', search); // 검색어 파라미터 추가
  
  const response = await axiosInstance.get(`/lps?${params.toString()}`);
  return response.data.data;
};

export default function useGetSearchLpList(searchQuery: string) {
  return useInfiniteQuery({
    queryKey: ['search', searchQuery], 
    queryFn: fetchSearchLps,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
    
    // 빈 문자열이나 공백만 있을 때는 쿼리 실행 방지
    enabled: !!searchQuery.trim(), 
    
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}