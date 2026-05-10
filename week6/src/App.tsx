// src/App.tsx
import { useState } from 'react';
import { useMyQuery } from './hooks/useMyQuery';

interface UserData {
  id: number;
  name: string;
  email: string;
}

const UserDataDisplay = ({ userId }: { userId: number }) => {
  const { data, isPending, isError } = useMyQuery<UserData>(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );

  if (isPending) return <div style={{color: 'cyan'}}>Loading... (User ID: {userId})</div>;
  if (isError) return <div style={{color: 'red'}}>Error Occurred (최대 재시도 후 실패)</div>;

  return (
    <div style={{ border: '1px solid #444', padding: '15px', borderRadius: '10px', marginTop: '10px' }}>
      <h2>{data?.name}</h2>
      <p>Email: {data?.email}</p>
      <p style={{ fontSize: '12px', color: '#888' }}>User ID: {data?.id}</p>
    </div>
  );
};

function App() {
  const [userId, setUserId] = useState<number>(1);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  return (
    <div style={{ padding: '40px', backgroundColor: '#1a1a1a', color: 'white', minHeight: '100vh' }}>
      <h1>실습 1. React Query 직접 구현</h1>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setUserId(Math.floor(Math.random() * 10) + 1)}>다른 유저 (Abort 테스트)</button>
        <button onClick={() => setIsVisible(!isVisible)}>컴포넌트 토글 (언마운트 테스트)</button>
        <button onClick={() => setUserId(99999)} style={{ background: '#ff9800' }}>재시도 테스트 (404 에러)</button>
      </div>

      {isVisible && <UserDataDisplay userId={userId} />}
      
      <div style={{ marginTop: '30px', color: '#666', fontSize: '14px' }}>
        * 개발자 도구(F12)의 Console 탭을 열어 [Retry]와 [Cache] 로그를 확인하세요.
      </div>
    </div>
  );
}

export default App;