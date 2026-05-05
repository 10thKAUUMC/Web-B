import { axiosInstance } from './axios';

export interface RequestSignInDTO {
  email?: string;
  password?: string;
}

// 로그인 API 호출
export const postSignIn = async (data: RequestSignInDTO) => {
  const response = await axiosInstance.post('/auth/signin', data);
  return response.data;
};

// 로그아웃 API 호출
export const postSignOut = async (accessToken: string) => {
  const response = await axiosInstance.post('/auth/signout', null, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const getProtectedTest = async () => {
  const response = await axiosInstance.get('/auth/protected');
  return response.data;
};