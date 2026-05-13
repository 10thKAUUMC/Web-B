import { axiosInstance } from './axios';
import type { ApiResponse } from '../types/lp';
import type { CommentListResponse, Comment } from '../types/lp';

// 1. 댓글 목록 조회 (무한 스크롤용)
export const getCommentList = async (
  lpId: number, 
  cursor?: number, 
  limit = 10, 
  order: 'asc' | 'desc' = 'desc'
) => {
  const params: any = { limit, order };
  if (cursor) params.cursor = cursor; // cursor가 있을 때만 포함

  const response = await axiosInstance.get<ApiResponse<CommentListResponse>>(`/lps/${lpId}/comments`, { params });
  return response.data.data;
};

// 2. 댓글 생성
export const postComment = async (lpId: number, content: string) => {
  const response = await axiosInstance.post<Comment>(`/lps/${lpId}/comments`, { content });
  return response.data;
};

// 3. 댓글 수정
export const patchComment = async (lpId: number, commentId: number, content: string) => {
  const response = await axiosInstance.patch<ApiResponse<Comment>>(`/lps/${lpId}/comments/${commentId}`, { content });
  return response.data.data;
};

// 4. 댓글 삭제
export const deleteComment = async (lpId: number, commentId: number) => {
  const response = await axiosInstance.delete<ApiResponse<{ message: string }>>(`/lps/${lpId}/comments/${commentId}`);
  return response.data.data;
};