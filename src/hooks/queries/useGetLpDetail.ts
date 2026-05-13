import { useQuery } from '@tanstack/react-query';
import { getLpDetail } from '../../apis/lp'; // 이전 스텝에서 만든 API 함수

export default function useGetLpDetail(lpId: number) {
  return useQuery({
    queryKey: ['lp', lpId], // 미션 필수: queryKey에 lpid 포함
    queryFn: () => getLpDetail(lpId),
    enabled: !!lpId, // lpId가 유효할 때만 API 요청
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}