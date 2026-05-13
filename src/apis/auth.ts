import { axiosInstance } from './axios';

export interface RequestSignInDTO {
  email?: string;
  password?: string;
}

export const postSignIn = async (data: RequestSignInDTO) => {
  const response = await axiosInstance.post('/auth/signin', data);
  return response.data;
};

export const postSignOut = async () => {
  const response = await axiosInstance.post('/auth/signout');
  return response.data;
};

export const getProtectedTest = async () => {
  const response = await axiosInstance.get('/auth/protected');
  return response.data;
};