import { useInfiniteQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../apis/axios';

const fetchLpList = async ({ pageParam, queryKey }: any) => {
  const [_key, order, search] = queryKey;
  const params: any = { order, search, limit: 12 };
  
  if (pageParam !== null) {
    params.cursor = pageParam;
  }

  const response = await axiosInstance.get('/lps', { params });
  return response.data.data; // { data: [], nextCursor: number, hasNext: boolean } 예상
};

export default function useGetLpList(order: 'asc' | 'desc', search: string = '') {
  return useInfiniteQuery({
    queryKey: ['lps', order, search],
    queryFn: fetchLpList,
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.nextCursor : undefined;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 3,
  });
}