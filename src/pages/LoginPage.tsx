import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../utils/schemas';
import { useAuth } from '../context/AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { FiEye, FiEyeOff, FiChevronLeft } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useMutation } from '@tanstack/react-query';
import { postSignIn } from '../apis/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken, login } = useAuth();
  const [, setAccessToken] = useLocalStorage<string | null>('accessToken', null);
  const [, setRefreshToken] = useLocalStorage<string | null>('refreshToken', null);
  const [, setUserName] = useLocalStorage<string | null>('userName', null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (accessToken) navigate('/', { replace: true });
  }, [accessToken, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: LoginFormData) => postSignIn({ email: data.email, password: data.password }),
    onSuccess: (result, variables) => {
      setAccessToken(result.data.accessToken);
      setRefreshToken(result.data.refreshToken);
      setUserName(variables.email.split('@')[0]);
      const from = (location.state as any)?.location?.pathname || '/login-success';
      navigate(from, { replace: true });
    },
    onError: () => {
      alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutate(data);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 bg-[#0f0f11] text-white h-full py-12">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-10">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-[#151518]">
            <FiChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold tracking-tight">로그인</h1>
          <div className="w-10"></div>
        </div>

        <button
          type="button"
          onClick={() => { window.location.href = 'http://localhost:8000/v1/auth/google/login'; }}
          className="w-full border border-gray-700 bg-[#151518] rounded-xl py-3.5 flex items-center justify-center gap-3 hover:bg-[#222226] transition-colors mb-6"
        >
          <FcGoogle size={22} />
          <span className="text-sm font-semibold text-gray-200">구글로 로그인</span>
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-800"></div>
          <span className="text-gray-500 text-xs font-semibold tracking-wider">OR</span>
          <div className="flex-1 h-px bg-gray-800"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="이메일 주소를 입력해주세요"
              {...register('email')}
              className={`w-full bg-[#151518] border rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-1 transition-all ${
                errors.email ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' : 'border-gray-800 focus:border-pink-500 focus:ring-pink-500'
              }`}
            />
            {errors.email && <p className="text-red-500 text-xs ml-1">{errors.email.message}</p>}
          </div>

          <div className="relative flex flex-col gap-2">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호를 입력해주세요"
              {...register('password')}
              className={`w-full bg-[#151518] border rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-1 transition-all pr-12 ${
                errors.password ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' : 'border-gray-800 focus:border-pink-500 focus:ring-pink-500'
              }`}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[14px] text-gray-400 hover:text-white transition-colors">
              {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
            </button>
            {errors.password && <p className="text-red-500 text-xs ml-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={!isValid || isPending}
            className={`w-full py-4 rounded-xl font-bold transition-all mt-4 ${
              isValid && !isPending ? 'bg-pink-500 text-white hover:bg-pink-600 shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 'bg-[#1f1f22] text-gray-500 cursor-not-allowed'
            }`}
          >
            {isPending ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}