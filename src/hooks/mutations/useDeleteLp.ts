import { useMutation } from '@tanstack/react-query';
import { deleteLp } from '../../apis/lp';
import { queryClient } from '../../App';
import { useNavigate } from 'react-router-dom';

export default function useDeleteLp() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (lpId: number) => deleteLp(lpId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      alert('LP가 삭제되었습니다.');
      navigate('/', { replace: true });
    },
  });
}