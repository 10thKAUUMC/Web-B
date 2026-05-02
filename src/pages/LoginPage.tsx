import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../utils/schemas';
import { useAuth } from '../context/AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, accessToken } = useAuth();
  const [, setUserName] = useLocalStorage<string | null>('userName', null);

  useEffect(() => {
    if (accessToken) {
      navigate('/', { replace: true });
    }
  }, [accessToken, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login({ email: data.email, password: data.password });
      setUserName(data.email.split('@')[0]);

      const from = (location.state as any)?.location?.pathname || '/login-success';
      navigate(from, { replace: true });
      
    } catch (error) {
      console.error(error);
      alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 bg-black text-white">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-10">
          <button onClick={() => navigate(-1)} className="text-2xl font-bold text-gray-300 hover:text-white transition-colors">
            &lt;
          </button>
          <h1 className="text-xl font-bold">로그인</h1>
          <div className="w-8"></div>
        </div>

        <button className="w-full border border-gray-600 rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors mb-6">
          <span className="text-lg font-bold text-blue-500">G</span>
          <span className="text-sm">구글 로그인</span>
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-600"></div>
          <span className="text-gray-400 text-sm font-semibold">OR</span>
          <div className="flex-1 h-px bg-gray-600"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div>
            <input
              type="email"
              placeholder="이메일을 입력해주세요!"
              {...register('email')}
              className={`w-full bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-colors ${
                errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-pink-500 focus:ring-pink-500'
              }`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-2 ml-1">{errors.email.message}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="비밀번호를 입력해주세요!"
              {...register('password')}
              className={`w-full bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-colors ${
                errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-pink-500 focus:ring-pink-500'
              }`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-2 ml-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-4 rounded-lg font-bold transition-colors mt-2 ${
              isValid ? 'bg-pink-500 text-white hover:bg-pink-600' : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}