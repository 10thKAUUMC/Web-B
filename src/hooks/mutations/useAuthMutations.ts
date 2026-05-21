import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { axiosInstance } from '../../apis/axios';
import type { LoginFormData } from '../../utils/schemas'; 

export const useLoginMutation = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      await login(data);
    },
    onSuccess: () => {
      navigate('/', { replace: true });
    },
    onError: () => {
      alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    }
  });
};

export const useLogoutMutation = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      logout();
    },
    onSuccess: () => {
      navigate('/login', { replace: true });
    }
  });
};

export const useWithdrawMutation = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      await axiosInstance.delete('/users/me');
    },
    onSuccess: () => {
      logout();
      navigate('/login', { replace: true });
    },
    onError: () => {
      alert('탈퇴 처리에 실패했습니다.');
    }
  });
};