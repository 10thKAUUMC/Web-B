import { axiosInstance } from './axios';

export const postLike = async (lpId: number) => {
  const response = await axiosInstance.post(`/lps/${lpId}/likes`);
  return response.data;
};

export const deleteLike = async (lpId: number) => {
  const response = await axiosInstance.delete(`/lps/${lpId}/likes`);
  return response.data;
};