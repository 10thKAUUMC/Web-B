import { axiosInstance } from "./axios";

export interface RequestSignInDTO {
  email: string;
  password: string;
}

export interface RequestSignUpDTO {
  email: string;
  password: string;
  name: string;
}

export const postSignIn = async (data: RequestSignInDTO) => {
  const response = await axiosInstance.post("/auth/signin", data);
  return response.data;
};

export const postSignUp = async (data: RequestSignUpDTO) => {
  const response = await axiosInstance.post("/auth/signup", data);
  return response.data;
};

export const postSignOut = async (accessToken: string) => {
  const response = await axiosInstance.post(
    "/auth/signout",
    null,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};