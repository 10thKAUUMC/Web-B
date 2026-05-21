import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '../../apis/axios';
import { queryClient } from '../../App';
import { QUERY_KEY } from '../../constants/key';

const postLike = async (lpId: number) => {
  const response = await axiosInstance.post(`/lps/${lpId}/likes`);
  return response.data;
};

export default function usePostLike() {
  return useMutation({
    mutationFn: (lpId: number) => postLike(lpId),
    onMutate: async (lpId) => {
      await queryClient.cancelQueries({ queryKey: ['lp', lpId] });
      const previousLp = queryClient.getQueryData(['lp', lpId]);
      
      const me: any = queryClient.getQueryData([QUERY_KEY.myInfo]);
      const currentUserId = me?.id || me?.data?.id;

      queryClient.setQueryData(['lp', lpId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          likes: [...(old.likes || []), { userId: currentUserId, lpId }]
        };
      });

      return { previousLp };
    },
    onError: (_, lpId, context) => {
      if (context?.previousLp) {
        queryClient.setQueryData(['lp', lpId], context.previousLp);
      }
    },
    onSettled: (_, __, lpId) => {
      queryClient.invalidateQueries({ queryKey: ['lp', lpId] });
    },
  });
}