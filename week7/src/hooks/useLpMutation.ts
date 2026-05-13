import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// 백엔드 주소 설정
const api = axios.create({ baseURL: "http://localhost:8000" });

export const useLpMutation = () => {
  const queryClient = useQueryClient();

  return {
    // 1. LP 관련 기본 기능
    createLp: useMutation({
      mutationFn: (data: any) => api.post("/lps", data),
      onSettled: () => queryClient.invalidateQueries({ queryKey: ["lps"] }),
    }),

    deleteLp: useMutation({
      mutationFn: (id: string) => api.delete(`/lps/${id}`),
      onSettled: () => queryClient.invalidateQueries({ queryKey: ["lps"] }),
    }),

    updateLp: useMutation({
      mutationFn: ({ id, data }: { id: string; data: any }) => api.patch(`/lps/${id}`, data),
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["lpDetail"] });
        queryClient.invalidateQueries({ queryKey: ["lps"] });
      },
    }),

    // 2. 좋아요 기능 (낙관적 업데이트)
    likeLp: useMutation({
      mutationFn: ({ id, likes, likedBy }: { id: string; likes: number; likedBy: string[] }) => 
        api.patch(`/lps/${id}`, { likes, likedBy }),
      onMutate: async (variables) => {
        await queryClient.cancelQueries({ queryKey: ["lpDetail"] });
        const previousLp = queryClient.getQueryData(["lpDetail"]);

        queryClient.setQueryData(["lpDetail"], (old: any) => {
          if (!old) return old;
          const targetData = old.data ? old.data : old;
          const updatedData = { ...targetData, likes: variables.likes, likedBy: variables.likedBy };
          return old.data ? { ...old, data: updatedData } : updatedData;
        });

        return { previousLp };
      },
      onError: (err, variables, context) => {
        if (context?.previousLp) queryClient.setQueryData(["lpDetail"], context.previousLp);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["lpDetail"] });
        queryClient.invalidateQueries({ queryKey: ["lps"] });
      },
    }),

    // 3. 댓글 기능
    comment: {
      add: useMutation({
        mutationFn: ({ lpId, text, existingComments }: { lpId: string; text: string; existingComments: any[] }) => {
          const newComment = { 
            id: crypto.randomUUID(), 
            text, 
            author: localStorage.getItem("userName") || "사용자" 
          };
          return api.patch(`/lps/${lpId}`, { comments: [...existingComments, newComment] });
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ["lpDetail"] }),
      }),
      edit: useMutation({
        mutationFn: ({ lpId, commentId, text, existingComments }: { lpId: string; commentId: string; text: string; existingComments: any[] }) => {
          const updatedComments = existingComments.map(c => c.id === commentId ? { ...c, text } : c);
          return api.patch(`/lps/${lpId}`, { comments: updatedComments });
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ["lpDetail"] }),
      }),
      delete: useMutation({
        mutationFn: ({ lpId, commentId, existingComments }: { lpId: string; commentId: string; existingComments: any[] }) => {
          const updatedComments = existingComments.filter(c => c.id !== commentId);
          return api.patch(`/lps/${lpId}`, { comments: updatedComments });
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ["lpDetail"] }),
      })
    },

    // 4. 유저 및 인증 관련 (🔥 누락된 로그인 로직 추가됨)
    user: {
      // 일반 로그인
      login: useMutation({
        mutationFn: (data: any) => api.post("/auth/signin", data),
      }),
      
      // 구글 로그인
      googleLogin: useMutation({
        mutationFn: (data: { token: string }) => api.post("/auth/google", data),
      }),

      // 프로필 업데이트
      update: useMutation({
        mutationFn: async (data: any) => {
          try {
            return await api.patch("/user/profile", data);
          } catch (err: any) {
            if (err.response?.status === 404) return Promise.resolve({ data }); 
            throw err;
          }
        },
        onMutate: async (newData) => {
          await queryClient.cancelQueries({ queryKey: ["user"] });
          const previousUser = queryClient.getQueryData(["user"]);

          queryClient.setQueryData(["user"], (old: any) => ({ ...old, ...newData }));

          if (newData.name) {
            localStorage.setItem("userName", newData.name);
            window.dispatchEvent(new Event("profileUpdate"));
          }

          return { previousUser };
        },
        onError: (err, newData, context) => {
          if (context?.previousUser) queryClient.setQueryData(["user"], context.previousUser);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
      }),
    }
  };
};