import { useState, useEffect, useRef } from 'react';

function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // 이미 타이머가 돌아가고 있다면 무시
    if (timerRef.current) return;

    // 타이머가 없다면 새로 설정
    timerRef.current = setTimeout(() => {
      setThrottledValue(value);
      timerRef.current = null; // 실행 후 타이머 초기화
    }, interval);

    // 컴포넌트 언마운트 또는 의존성(value, interval) 변경 시 기존 타이머 정리
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [value, interval]);

  return throttledValue;
}

export default useThrottle;