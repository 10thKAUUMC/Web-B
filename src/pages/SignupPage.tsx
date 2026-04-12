import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  email: z.string().email({ message: '올바른 이메일 형식을 입력해 주세요.' }),
  password: z
    .string()
    .min(8, { message: '비밀번호는 8자 이상이어야 합니다.' })
    .max(20, { message: '비밀번호는 20자 이하이어야 합니다.' }),
  name: z.string().min(1, { message: '이름은 2자 이상이어야 합니다.' }),
});

const passwordConfirmSchema = z
  .object({
    password: schema.shape.password,
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  });

type FormFields = z.infer<typeof schema>;
type PasswordFields = z.infer<typeof passwordConfirmSchema>;

const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [savedEmail, setSavedEmail] = useState('');
  const [savedPassword, setSavedPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // Step 1: 이메일
  const emailForm = useForm<Pick<FormFields, 'email'>>({
    defaultValues: { email: '' },
    resolver: zodResolver(schema.pick({ email: true })),
  });

  // Step 2: 비밀번호
  const passwordForm = useForm<PasswordFields>({
    defaultValues: { password: '', passwordConfirm: '' },
    resolver: zodResolver(passwordConfirmSchema),
  });

  // Step 3: 닉네임
  const nameForm = useForm<Pick<FormFields, 'name'>>({
    defaultValues: { name: '' },
    resolver: zodResolver(schema.pick({ name: true })),
  });

  const handleEmailNext = emailForm.handleSubmit((data) => {
    setSavedEmail(data.email);
    setStep(2);
  });

  const handlePasswordNext = passwordForm.handleSubmit((data) => {
    setSavedPassword(data.password);
    setStep(3);
  });

  const handleSignup = nameForm.handleSubmit(async (data) => {
    // TODO: API 호출
    console.log({ email: savedEmail, password: savedPassword, name: data.name });
    navigate('/');
  });

  const handleBack = () => {
    if (step === 1) navigate(-1);
    else setStep((prev) => (prev - 1) as 1 | 2 | 3);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-80 flex flex-col gap-4">

        <div className="flex items-center justify-center relative mb-2">
          <button onClick={handleBack} className="absolute left-0 text-xl">〈</button>
          <h1 className="text-lg font-semibold">회원가입</h1>
        </div>

        {/* Step 1: 이메일 */}
        {step === 1 && (
          <form onSubmit={handleEmailNext} className="flex flex-col gap-3">
            <button
                type="button"
                className="border border-gray-600 rounded px-4 py-2 flex items-center gap-2 justify-center bg-gray-800 text-white"
                >
                구글 로그인
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-400">
                <hr className="flex-1" /> OR <hr className="flex-1" />
            </div>
            <div>
                <input
                    {...emailForm.register('email')}
                    placeholder="이메일을 입력해주세요!"
                    className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-800 text-white placeholder-gray-500"
                />
                {emailForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                    {emailForm.formState.errors.email.message}
                    </p>
                )}
            </div>
            <button
              type="submit"
              disabled={!emailForm.watch('email')}
              className="bg-pink-500 text-white rounded py-2 disabled:opacity-40"
            >
              다음
            </button>
          </form>
        )}

        {/* Step 2: 비밀번호 */}
        {step === 2 && (
          <form onSubmit={handlePasswordNext} className="flex flex-col gap-3">
            <p className="text-sm text-gray-400">✉ {savedEmail}</p>
            <div>
              <div className="flex border border-gray-600 rounded px-3 py-2 items-center bg-gray-800">
                    <input
                        {...passwordForm.register('password')}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="비밀번호를 입력해주세요!"
                        className="flex-1 outline-none bg-transparent text-white placeholder-gray-500"
                    />
                    <button type="button" onClick={() => setShowPassword((v) => !v)}>
                        {showPassword ? '🙈' : '👁'}
                    </button>
                    </div>
              {passwordForm.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {passwordForm.formState.errors.password.message}
                </p>
              )}
            </div>
            <div>
              <div className="flex border border-gray-600 rounded px-3 py-2 items-center bg-gray-800">
                <input
                  {...passwordForm.register('passwordConfirm')}
                  type={showPasswordConfirm ? 'text' : 'password'}
                  placeholder="비밀번호를 다시 한 번 입력해주세요!"
                  className="flex-1 outline-none bg-transparent text-white placeholder-gray-500"
                />
                <button type="button" onClick={() => setShowPasswordConfirm((v) => !v)}>
                  {showPasswordConfirm ? '🙈' : '👁'}
                </button>
              </div>
              {passwordForm.formState.errors.passwordConfirm && (
                <p className="text-red-500 text-sm mt-1">
                  {passwordForm.formState.errors.passwordConfirm.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={!passwordForm.watch('password') || !passwordForm.watch('passwordConfirm')}
              className="bg-pink-500 text-white rounded py-2 disabled:opacity-40"
            >
              다음
            </button>
          </form>
        )}

        {/* Step 3: 닉네임 */}
        {step === 3 && (
          <form onSubmit={handleSignup} className="flex flex-col gap-3 items-center">
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-4xl cursor-pointer">
              👤
            </div>
            <input
                {...nameForm.register('name')}
                placeholder="닉네임을 입력해주세요!"
                className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-800 text-white placeholder-gray-500"
            />
            {nameForm.formState.errors.name && (
              <p className="text-red-500 text-sm">
                {nameForm.formState.errors.name.message}
              </p>
            )}
            <button
              type="submit"
              disabled={!nameForm.watch('name')}
              className="w-full bg-pink-500 text-white rounded py-2 disabled:opacity-40"
            >
              회원가입 완료
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default SignupPage;