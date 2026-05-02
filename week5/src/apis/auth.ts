import { axiosInstance } from './axios';

export interface RequestSignInDTO {
  email?: string;
  password?: string;
}

export interface RequestSignUpDTO {
  email: string;
  password: string;
  name: string;
}

// ✅ 회원가입
export const postSignUp = async (data: RequestSignUpDTO) => {
  const response = await axiosInstance.post('/users', data);
  return response.data;
};


export const postSignIn = async (data: RequestSignInDTO) => {
  const response = await axiosInstance.get('/users', {
    params: {
      email: data.email,
      password: data.password,
    },
  });

  if (response.data.length === 0) {
    throw new Error('로그인 실패');
  }


  return {
    status: true,
    data: {
      accessToken: 'fake-access-token',
      refreshToken: 'fake-refresh-token',
    },
  };
};


export const postSignOut = async () => {
  return true;
};