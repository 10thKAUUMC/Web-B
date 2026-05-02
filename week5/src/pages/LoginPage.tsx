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
  const { login, user } = useAuth(); // ✅ accessToken → user
  const [, setUserName] = useLocalStorage<string | null>('userName', null);

  useEffect(() => {
    if (user) { // ✅ accessToken → user
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

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

      const from = (location.state as any)?.location?.pathname || '/';
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

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div>
            <input
              type="email"
              placeholder="이메일을 입력해주세요!"
              {...register('email')}
              className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-3 text-sm"
            />
            {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email.message}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="비밀번호를 입력해주세요!"
              {...register('password')}
              className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-3 text-sm"
            />
            {errors.password && <p className="text-red-500 text-xs mt-2">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className="w-full py-4 rounded-lg font-bold bg-pink-500 text-white"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}