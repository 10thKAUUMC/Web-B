import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormData } from '../utils/schemas';
import { postSignUp } from '../apis/auth';

export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isValid },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });

  const emailValue = watch('email');

  const handleNextStep = async () => {
    const isEmailValid = await trigger('email');
    if (isEmailValid) {
      setStep(2);
    }
  };

  const onSubmit = async (data: SignupFormData) => {
    try {
      const response = await postSignUp({
        name: data.email.split('@')[0],
        email: data.email,
        password: data.password,
      });

      if (response.status) {
        alert('회원가입이 완료되었습니다! 로그인해주세요.');
        navigate('/login');
      }
    } catch (error) {
      console.error(error);
      alert('회원가입에 실패했습니다.');
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 bg-black text-white py-12">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => (step === 2 ? setStep(1) : navigate(-1))}
            className="text-2xl font-bold text-gray-300 hover:text-white transition-colors"
          >
            &lt;
          </button>
          <h1 className="text-xl font-bold">회원가입</h1>
          <div className="w-8"></div>
        </div>

        {step === 1 && (
          <div className="flex flex-col gap-5">
            <button className="w-full border border-gray-600 rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors mb-2">
              <span className="text-lg font-bold text-blue-500">G</span>
              <span className="text-sm">구글 로그인</span>
            </button>

            <div className="flex items-center gap-4 mb-2">
              <div className="flex-1 h-px bg-gray-600"></div>
              <span className="text-gray-400 text-sm font-semibold">OR</span>
              <div className="flex-1 h-px bg-gray-600"></div>
            </div>

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

            <button
              type="button"
              onClick={handleNextStep}
              disabled={!emailValue || !!errors.email}
              className={`w-full py-4 rounded-lg font-bold transition-colors mt-2 ${
                emailValue && !errors.email ? 'bg-pink-500 text-white hover:bg-pink-600' : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              다음
            </button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="flex items-center gap-2 mb-2 text-gray-300 text-sm bg-gray-900 p-3 rounded-lg border border-gray-700">
              <span className="opacity-70">✉</span>
              <span>{emailValue}</span>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호를 입력해주세요!"
                {...register('password')}
                className={`w-full bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-colors pr-10 ${
                  errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-pink-500 focus:ring-pink-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
              >
                {showPassword ? '🐵' : '🙈'}
              </button>
              {errors.password && <p className="text-red-500 text-xs mt-2 ml-1">{errors.password.message}</p>}
            </div>

            <div className="relative">
              <input
                type={showPasswordConfirm ? 'text' : 'password'}
                placeholder="비밀번호를 다시 한번 입력해주세요!"
                {...register('passwordConfirm')}
                className={`w-full bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-colors pr-10 ${
                  errors.passwordConfirm ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-pink-500 focus:ring-pink-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
              >
                {showPasswordConfirm ? '🐵' : '🙈'}
              </button>
              {errors.passwordConfirm && <p className="text-red-500 text-xs mt-2 ml-1">{errors.passwordConfirm.message}</p>}
            </div>

            <button
              type="submit"
              disabled={!isValid}
              className={`w-full py-4 rounded-lg font-bold transition-colors mt-2 ${
                isValid ? 'bg-pink-500 text-white hover:bg-pink-600' : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              다음
            </button>
          </form>
        )}
      </div>
    </div>
  );
}