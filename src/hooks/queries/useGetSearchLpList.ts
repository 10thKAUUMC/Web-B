import { useInfiniteQuery } from '@tanstack/react-query';
import { getLpList } from '../../apis/lp';

function useGetSearchLpList(query: string) {
  return useInfiniteQuery({
    queryKey: ['search', query],
    queryFn: ({ pageParam = 0 }) =>
      getLpList({ cursor: pageParam, search: query, limit: 12, order: 'desc' }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!query.trim(),
    staleTime: 1000 * 60 * 5,
  });
}

export default useGetSearchLpList;