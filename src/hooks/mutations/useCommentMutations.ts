import { useMutation } from '@tanstack/react-query';
import { patchComment } from '../../apis/comment';
import { queryClient } from '../../App';
import { QUERY_KEY } from '../../constants/key';

export function usePatchComment() {
  return useMutation({
    mutationFn: ({ lpId, commentId, content }: { lpId: number; commentId: number; content: string }) => 
      patchComment(lpId, commentId, content),
    onSuccess: (_, variables) => {
      // "lpComments" 하드코딩 대신 QUERY_KEY 활용
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.comments, variables.lpId] });
    },
    onError: (error) => {
      console.error('댓글 수정 실패:', error);
      alert('댓글 수정에 실패했습니다.');
    }
  });
}