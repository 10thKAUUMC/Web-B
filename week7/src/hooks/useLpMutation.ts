import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8000" });

export const useLpMutation = () => {
  const queryClient = useQueryClient();

  return {
    createLp: useMutation({
      mutationFn: (newLp: any) => api.post("/lps", newLp),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lps"] }),
    }),
    deleteLp: useMutation({
      mutationFn: (id: string) => api.delete(`/lps/${id}`),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lps"] }),
    }),
    updateLp: useMutation({
      mutationFn: ({ id, data }: { id: string; data: any }) => api.patch(`/lps/${id}`, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["lps"] });
        queryClient.invalidateQueries({ queryKey: ["lpDetail"] });
      },
    }),
    likeLp: useMutation({
      mutationFn: ({ id, currentLikes }: { id: string; currentLikes: number }) => 
        api.patch(`/lps/${id}`, { likes: currentLikes + 1 }),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lpDetail"] }),
    }),
    comment: {
      add: useMutation({
        mutationFn: async ({ lpId, text, existingComments }: { lpId: string; text: string; existingComments: any[] }) => {
          try {
            return await api.post("/comments", { lpId, text, author: localStorage.getItem("userName") || "User", createdAt: new Date().toLocaleDateString() });
          } catch (err: any) {
            if (err.response?.status === 404) {
              const newComment = { id: Date.now().toString(), text, author: localStorage.getItem("userName") || "User" };
              return await api.patch(`/lps/${lpId}`, { comments: [...existingComments, newComment] });
            }
            throw err;
          }
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lpDetail"] }),
      }),
      edit: useMutation({
        mutationFn: async ({ lpId, commentId, text, existingComments }: { lpId: string; commentId: string; text: string; existingComments: any[] }) => {
          try {
            return await api.patch(`/comments/${commentId}`, { text });
          } catch (err: any) {
            if (err.response?.status === 404) {
              const updatedComments = existingComments.map(c => c.id === commentId ? { ...c, text } : c);
              return await api.patch(`/lps/${lpId}`, { comments: updatedComments });
            }
            throw err;
          }
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lpDetail"] }),
      }),
      delete: useMutation({
        mutationFn: async ({ lpId, commentId, existingComments }: { lpId: string; commentId: string; existingComments: any[] }) => {
          try {
            return await api.delete(`/comments/${commentId}`);
          } catch (err: any) {
            if (err.response?.status === 404) {
              const updatedComments = existingComments.filter(c => c.id !== commentId);
              return await api.patch(`/lps/${lpId}`, { comments: updatedComments });
            }
            throw err;
          }
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lpDetail"] }),
      }),
    },
    user: {
      login: useMutation({ mutationFn: (data: any) => api.post("/login", data) }),
      googleLogin: useMutation({ mutationFn: (token: string) => api.post("/auth/google", { token }) }),
      update: useMutation({
        mutationFn: async (data: any) => {
          try {
            return await api.patch("/user/profile", data);
          } catch (err: any) {
            if (err.response?.status === 404) return Promise.resolve({ data }); 
            throw err;
          }
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
      }),
      logout: useMutation({ mutationFn: () => api.post("/logout") }),
      withdraw: useMutation({ mutationFn: () => api.delete("/user/withdraw") }),
    }
  };
};