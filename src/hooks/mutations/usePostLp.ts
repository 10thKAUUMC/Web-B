import { useMutation } from '@tanstack/react-query';
import { postLp } from '../../apis/lp';
import type { RequestLpDto } from '../../types/lp';
import { queryClient } from '../../App';
import { QUERY_KEY } from '../../constants/key';

export default function usePostLp() {
  return useMutation({
    mutationFn: (data: RequestLpDto) => postLp(data),
    onSuccess: () => {
      // POST 성공 시 메인 페이지의 LP 목록 캐시를 무효화하여 자동 새로고침
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps],
      });
    },
  });
}