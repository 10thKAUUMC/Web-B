import { axiosInstance } from './axios';
import type { 
  PaginationDto, 
  RequestLpDto, 
  ApiResponse, 
  LpListResponse, 
  LpDetail 
} from '../types/lp';

export const getLpList = async (params: PaginationDto) => {
  const response = await axiosInstance.get<ApiResponse<LpListResponse>>('/lps', { params });
  return response.data.data;
};

export const getUserLpList = async (userId: number, params: PaginationDto) => {
  const response = await axiosInstance.get<ApiResponse<LpListResponse>>(`/lps/user/${userId}`, { params });
  return response.data.data;
};

export const getMyLpList = async (params: PaginationDto) => {
  const response = await axiosInstance.get<ApiResponse<LpListResponse>>('/lps/user', { params });
  return response.data.data;
};

export const getLpsByTag = async (tagName: string, params: PaginationDto) => {
  const response = await axiosInstance.get<ApiResponse<LpListResponse>>(`/lps/tag/${tagName}`, { params });
  return response.data.data;
};

export const getLpDetail = async (lpId: number) => {
  const response = await axiosInstance.get<ApiResponse<LpDetail>>(`/lps/${lpId}`);
  return response.data.data;
};

export const postLp = async (data: RequestLpDto) => {
  const response = await axiosInstance.post<ApiResponse<any>>('/lps', data);
  return response.data;
};

export const patchLp = async (lpId: number, data: RequestLpDto) => {
  const response = await axiosInstance.patch<ApiResponse<any>>(`/lps/${lpId}`, data);
  return response.data;
};

export const deleteLp = async (lpId: number) => {
  const response = await axiosInstance.delete<ApiResponse<boolean>>(`/lps/${lpId}`);
  return response.data;
};

export const getLikedLpList = async (params: PaginationDto) => {
  const response = await axiosInstance.get<ApiResponse<LpListResponse>>('/lps/likes/me', { params });
  return response.data.data;
};