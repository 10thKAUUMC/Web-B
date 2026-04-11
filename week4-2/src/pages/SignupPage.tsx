import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

const schema = z
  .object({
    email: z.string().email('올바른 이메일 형식을 입력해주세요.'),
    password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다.'),
    confirmPassword: z.string(),
    nickname: z.string().min(1, '닉네임을 입력해주세요.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const email = watch('email');
  const password = watch('password');

  const nextStep = async () => {
    if (step === 1) {
      const valid = await trigger('email');
      if (valid) setStep(2);
    } else if (step === 2) {
      const valid = await trigger(['password', 'confirmPassword']);
      if (valid) setStep(3);
    }
  };

  const onSubmit = (data: FormData) => {
    localStorage.setItem('user', JSON.stringify(data));
    alert('회원가입 완료!');
    navigate('/');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <input
              {...register('email')}
              placeholder="이메일"
              className="w-full mb-2 p-2 border rounded"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}

            <button
              type="button"
              onClick={nextStep}
              disabled={!email}
              className="w-full mt-4 bg-purple-400 text-white py-2 rounded disabled:bg-gray-300"
            >
              다음
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <p className="mb-4 text-sm text-gray-500">{email}</p>

            <input
              type="password"
              {...register('password')}
              placeholder="비밀번호"
              className="w-full mb-2 p-2 border rounded"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}

            <input
              type="password"
              {...register('confirmPassword')}
              placeholder="비밀번호 확인"
              className="w-full mt-2 mb-2 p-2 border rounded"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}

            <button
              type="button"
              onClick={nextStep}
              disabled={!password}
              className="w-full mt-4 bg-purple-400 text-white py-2 rounded disabled:bg-gray-300"
            >
              다음
            </button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <input
              {...register('nickname')}
              placeholder="닉네임"
              className="w-full mb-2 p-2 border rounded"
            />
            {errors.nickname && (
              <p className="text-red-500 text-sm">{errors.nickname.message}</p>
            )}

            <button className="w-full mt-4 bg-purple-500 text-white py-2 rounded">
              회원가입 완료
            </button>
          </>
        )}
      </form>
    </div>
  );
}