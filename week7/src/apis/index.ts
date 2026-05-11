import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8000' });

// LP 관련
export const postLp = (data: any) => api.post('/lps', data);
export const deleteLp = (id: string) => api.delete(`/lps/${id}`);
export const updateLp = (id: string, data: any) => api.patch(`/lps/${id}`, data);

// 댓글 관련
export const postComment = (data: { lpId: string; content: string }) => api.post('/comments', data);
export const deleteComment = (id: string) => api.delete(`/comments/${id}`);
export const updateComment = (id: string, content: string) => api.patch(`/comments/${id}`, { content });

// 인증 관련
export const login = (credentials: any) => api.post('/login', credentials);
export const deleteAccount = () => api.delete('/users/me'); 