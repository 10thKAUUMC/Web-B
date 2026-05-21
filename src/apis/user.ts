import { axiosInstance } from './axios';

export const patchMyInfo = async (data: { name?: string; bio?: string; avatar?: string }) => {
  const response = await axiosInstance.patch('/users', data); 
  return response.data;
};

export const postUploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosInstance.post('/uploads', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
};