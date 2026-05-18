import { axiosInstance } from './axios';

export interface UpdateUserDto {
  name?: string;
  bio?: string;
  avatar?: string;
}

export const getMyInfo = async () => {
  const response = await axiosInstance.get('/users/me');
  return response.data.data;
};

export const updateMyInfo = async (data: UpdateUserDto) => {
  const response = await axiosInstance.patch('/users', data);
  return response.data;
};

export const deleteMyAccount = async () => {
  const response = await axiosInstance.delete('/users');
  return response.data;
};