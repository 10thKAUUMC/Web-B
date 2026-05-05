import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../apis/axios';

// API 호출 함수
const fetchLpList = async (order: 'asc' | 'desc', search: string = '') => {
  const response = await axiosInstance.get('/lps', {
    params: { order, search, limit: 20 },
  });
  return response.data.data;
};

export default function useGetLpList(order: 'asc' | 'desc', search: string = '') {
  return useQuery({
    queryKey: ['lps', order, search],
    queryFn: () => fetchLpList(order, search),
    staleTime: 1000 * 60 * 5, // 5분 
    gcTime: 1000 * 60 * 10, // 10분 (캐시에 유지되는 시간)
    retry: 3, // 실패 시 3번 재시도
  });
}