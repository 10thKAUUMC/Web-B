import { useState, useEffect, useRef } from 'react';

function useThrottle<T>(value: T, interval: number = 1000): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdated = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const now = Date.now();
    const remaining = interval - (now - lastUpdated.current);

    if (remaining <= 0) {
      // interval이 지났으면 바로 실행
      if (timerRef.current) clearTimeout(timerRef.current);
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      // interval이 안 지났으면 남은 시간 후 실행
      timerRef.current = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottledValue(value);
      }, remaining);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, interval]);

  return throttledValue;
}

export default useThrottle;