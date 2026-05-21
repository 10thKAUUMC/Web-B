import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '../../apis/axios';
import { queryClient } from '../../App';
import { QUERY_KEY } from '../../constants/key';

const deleteLike = async (lpId: number) => {
  const response = await axiosInstance.delete(`/lps/${lpId}/likes`);
  return response.data;
};

export default function useDeleteLike() {
  return useMutation({
    mutationFn: (lpId: number) => deleteLike(lpId),
    onMutate: async (lpId) => {
      await queryClient.cancelQueries({ queryKey: ['lp', lpId] });
      const previousLp = queryClient.getQueryData(['lp', lpId]);
      
      const me: any = queryClient.getQueryData([QUERY_KEY.myInfo]);
      const currentUserId = me?.id || me?.data?.id;

      queryClient.setQueryData(['lp', lpId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          likes: (old.likes || []).filter((like: any) => Number(like.userId) !== Number(currentUserId))
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