import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../apis/axios';
import { QUERY_KEY } from '../../constants/key';

const getMyInfo = async () => {
  const response = await axiosInstance.get('/users/me'); 
  return response.data.data;
};

export default function useGetMyInfo(enabled: boolean = true) {
  return useQuery({
    queryKey: [QUERY_KEY.myInfo],
    queryFn: getMyInfo,
    enabled,
  });
}