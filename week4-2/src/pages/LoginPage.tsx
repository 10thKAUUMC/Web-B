import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from '../hooks/useForm';

export default function LoginPage() {
  const navigate = useNavigate();

  const { values, errors, touched, handleChange, handleBlur } = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: (values) => {
      const newErrors: Record<string, string> = {};
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!values.email) {
        newErrors.email = '이메일을 입력해주세요!';
      } else if (!emailRegex.test(values.email)) {
        newErrors.email = '올바른 이메일 형식을 입력해주세요.';
      }

      if (!values.password) {
        newErrors.password = '비밀번호를 입력해주세요!';
      } else if (values.password.length < 8) {
        newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
      }

      return newErrors;
    },
  });

  const isFormValid = 
    values.email !== '' && 
    values.password !== '' && 
    Object.keys(errors).length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      const response = await axios.post('http://localhost:8000/v1/auth/signin', {
        email: values.email,
        password: values.password,
      });

      if (response.data.status) {
        const { accessToken, refreshToken, name } = response.data.data;
        
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userName', name);

        navigate('/login-success');
      }
    } catch (error) {
      console.error(error);
      alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 bg-black text-white">
      <div className="w-full max-w-md">
        
        <div className="flex items-center justify-between mb-10">
          <button 
            onClick={() => navigate(-1)} 
            className="text-2xl font-bold text-gray-300 hover:text-white transition-colors"
          >
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="이메일을 입력해주세요!"
              className={`w-full bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-colors ${
                touched.email && errors.email 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-600 focus:border-pink-500 focus:ring-pink-500'
              }`}
            />
            {touched.email && errors.email && (
              <p className="text-red-500 text-xs mt-2 ml-1">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="비밀번호를 입력해주세요!"
              className={`w-full bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-colors ${
                touched.password && errors.password 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-600 focus:border-pink-500 focus:ring-pink-500'
              }`}
            />
            {touched.password && errors.password && (
              <p className="text-red-500 text-xs mt-2 ml-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-4 rounded-lg font-bold transition-colors mt-2 ${
              isFormValid 
                ? 'bg-pink-500 text-white hover:bg-pink-600' 
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}