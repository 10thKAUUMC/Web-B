import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormData } from '../utils/schemas';
import { FiEye, FiEyeOff, FiMail, FiChevronLeft } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

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
      const response = await axios.post('http://localhost:8000/v1/auth/signup', {
        name: data.email.split('@')[0], 
        email: data.email,
        password: data.password,
      });

      if (response.data.status) {
        alert('회원가입이 완료되었습니다! 로그인해주세요.');
        navigate('/login');
      }
    } catch (error) {
      console.error(error);
      alert('회원가입에 실패했습니다.');
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 bg-[#0f0f11] text-white py-12 h-full">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => (step === 2 ? setStep(1) : navigate(-1))}
            className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-800"
          >
            <FiChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold tracking-tight">회원가입</h1>
          <div className="w-10"></div>
        </div>

        {step === 1 && (
          <div className="flex flex-col gap-6">
            <button className="w-full border border-gray-700 bg-[#151518] rounded-xl py-3.5 flex items-center justify-center gap-3 hover:bg-[#222226] transition-colors">
              <FcGoogle size={22} />
              <span className="text-sm font-semibold text-gray-200">구글로 계속하기</span>
            </button>

            <div className="flex items-center gap-4 my-2">
              <div className="flex-1 h-px bg-gray-800"></div>
              <span className="text-gray-500 text-xs font-semibold tracking-wider">OR</span>
              <div className="flex-1 h-px bg-gray-800"></div>
            </div>

            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="이메일 주소를 입력해주세요"
                {...register('email')}
                className={`w-full bg-[#151518] border rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-1 transition-all ${
                  errors.email 
                    ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-800 focus:border-pink-500 focus:ring-pink-500'
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs ml-1">{errors.email.message}</p>}
            </div>

            <button
              type="button"
              onClick={handleNextStep}
              disabled={!emailValue || !!errors.email}
              className={`w-full py-4 rounded-xl font-bold transition-all mt-4 ${
                emailValue && !errors.email 
                  ? 'bg-pink-500 text-white hover:bg-pink-600 shadow-[0_0_15px_rgba(236,72,153,0.3)]' 
                  : 'bg-[#1f1f22] text-gray-500 cursor-not-allowed'
              }`}
            >
              다음
            </button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="flex items-center gap-3 mb-2 text-gray-300 text-sm bg-[#151518] p-4 rounded-xl border border-gray-800">
              <FiMail className="text-pink-500" size={18} />
              <span className="font-medium">{emailValue}</span>
            </div>

            <div className="relative flex flex-col gap-2">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호를 입력해주세요"
                {...register('password')}
                className={`w-full bg-[#151518] border rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-1 transition-all pr-12 ${
                  errors.password 
                    ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-800 focus:border-pink-500 focus:ring-pink-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[14px] text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
              </button>
              {errors.password && <p className="text-red-500 text-xs ml-1">{errors.password.message}</p>}
            </div>

            <div className="relative flex flex-col gap-2">
              <input
                type={showPasswordConfirm ? 'text' : 'password'}
                placeholder="비밀번호를 다시 한번 입력해주세요"
                {...register('passwordConfirm')}
                className={`w-full bg-[#151518] border rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-1 transition-all pr-12 ${
                  errors.passwordConfirm 
                    ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-800 focus:border-pink-500 focus:ring-pink-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute right-4 top-[14px] text-gray-400 hover:text-white transition-colors"
              >
                {showPasswordConfirm ? <FiEye size={20} /> : <FiEyeOff size={20} />}
              </button>
              {errors.passwordConfirm && <p className="text-red-500 text-xs ml-1">{errors.passwordConfirm.message}</p>}
            </div>

            <button
              type="submit"
              disabled={!isValid}
              className={`w-full py-4 rounded-xl font-bold transition-all mt-4 ${
                isValid 
                  ? 'bg-pink-500 text-white hover:bg-pink-600 shadow-[0_0_15px_rgba(236,72,153,0.3)]' 
                  : 'bg-[#1f1f22] text-gray-500 cursor-not-allowed'
              }`}
            >
              가입 완료
            </button>
          </form>
        )}
      </div>
    </div>
  );
}