// src/hooks/useMyQuery.ts (최종본)
import { useEffect, useMemo, useRef, useState } from 'react';

const STALE_TIME = 5 * 60 * 1_000; // 5분 캐시 유지
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

interface CacheEntry<T> {
  data: T;
  lastFetched: number;
}

export const useMyQuery = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const storageKey = useMemo(() => url, [url]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    abortControllerRef.current = new AbortController();
    setIsError(false);

    const fetchData = async (currentRetry = 0) => {
      const currentTime = new Date().getTime();
      const cachedItem = localStorage.getItem(storageKey);

      // 1. 캐싱 로직
      if (cachedItem) {
        try {
          const cachedData: CacheEntry<T> = JSON.parse(cachedItem);
          if (currentTime - cachedData.lastFetched < STALE_TIME) {
            setData(cachedData.data);
            setIsPending(false);
            console.log(`[Cache Hit] 신선한 데이터 사용 중: ${url}`);
            return;
          }
          setData(cachedData.data); // 오래된 데이터라도 먼저 보여주기
        } catch {
          localStorage.removeItem(storageKey);
        }
      }

      // 2. 네트워크 요청
      setIsPending(true);
      try {
        const response = await fetch(url, {
          signal: abortControllerRef.current?.signal,
        });
        if (!response.ok) throw new Error(`HTTP Status: ${response.status}`);
        
        const newData: T = await response.json();
        setData(newData);

        // 캐시 저장
        const newCacheEntry: CacheEntry<T> = {
          data: newData,
          lastFetched: new Date().getTime(),
        };
        localStorage.setItem(storageKey, JSON.stringify(newCacheEntry));
        setIsPending(false);
      } catch (error) {
        // AbortController로 취소된 경우 에러 처리 안함
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('[Fetch Cancelled] 요청이 취소됨');
          return;
        }

        // 3. 재시도 로직 (Retry)
        if (currentRetry < MAX_RETRIES) {
          const retryDelay = INITIAL_RETRY_DELAY * Math.pow(2, currentRetry);
          console.log(`[Retry ${currentRetry + 1}/${MAX_RETRIES}] ${retryDelay}ms 후 재시도...`);
          
          retryTimeoutRef.current = window.setTimeout(() => {
            fetchData(currentRetry + 1);
          }, retryDelay);
        } else {
          setIsError(true);
          setIsPending(false);
        }
      }
    };

    fetchData();

    return () => {
      abortControllerRef.current?.abort(); // 언마운트 시 요청 취소
      if (retryTimeoutRef.current !== null) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [url, storageKey]);

  return { data, isPending, isError };
};