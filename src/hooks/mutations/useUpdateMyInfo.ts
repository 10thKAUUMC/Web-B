import { useMutation } from '@tanstack/react-query';
import { patchMyInfo } from '../../apis/user';
import { queryClient } from '../../App';
import { QUERY_KEY } from '../../constants/key';

export default function useUpdateMyInfo() {
  return useMutation({
    mutationFn: patchMyInfo,
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.myInfo] });
      const previousInfo = queryClient.getQueryData([QUERY_KEY.myInfo]);
      
      queryClient.setQueryData([QUERY_KEY.myInfo], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          name: newData.name !== undefined ? newData.name : old.name,
          bio: newData.bio !== undefined ? newData.bio : old.bio,
          avatar: newData.avatar !== undefined ? newData.avatar : old.avatar,
        };
      });

      if (newData.name) {
        localStorage.setItem('userName', newData.name);
      }

      return { previousInfo };
    },
    onError: (_, __, context) => {
      if (context?.previousInfo) {
        queryClient.setQueryData([QUERY_KEY.myInfo], context.previousInfo);
      }
      alert('프로필 수정에 실패했습니다.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myInfo] });
    },
    onSuccess: () => {
      alert('프로필이 성공적으로 수정되었습니다.');
    }
  });
}