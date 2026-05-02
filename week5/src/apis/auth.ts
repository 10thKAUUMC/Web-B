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


export const postSignIn = async (data: RequestSignInDTO) => {
  const response = await axiosInstance.get('/users', {
    params: {
      email: data.email,
      password: data.password,
    },
  });

 
  if (response.data.length === 0) {
    throw new Error('이메일 또는 비밀번호가 틀렸습니다.');
  }

  return response.data[0]; // 로그인 성공
};

// 그대로 유지
export const postSignOut = async (accessToken: string) => {
  return true;
};

// 회원가입 (이미 잘됨)
export const postSignUp = async (data: RequestSignUpDTO) => {
  const response = await axiosInstance.post('/users', data);
  return response.data;
};