import { useMutation } from '@tanstack/react-query';
import { patchLp } from '../../apis/lp';
import type { RequestLpDto } from '../../types/lp';
import { queryClient } from '../../App';

export default function usePatchLp() {
  return useMutation({
    mutationFn: ({ lpId, data }: { lpId: number; data: RequestLpDto }) => patchLp(lpId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lp', variables.lpId] });
      queryClient.invalidateQueries({ queryKey: ['lps'] });
    },
  });
}