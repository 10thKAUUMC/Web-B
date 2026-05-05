import axios, { type InternalAxiosRequestConfig, type AxiosError } from 'axios';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../constants/key';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessTokenStr = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (accessTokenStr) {
      const accessToken = JSON.parse(accessTokenStr);
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let refreshPromise: Promise<string> | null = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!originalRequest || !error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest.url === '/v1/auth/refresh' || originalRequest._retry) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem('userName');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          const refreshTokenStr = localStorage.getItem(REFRESH_TOKEN_KEY);
          if (!refreshTokenStr) throw new Error('No refresh token');
          
          const refreshToken = JSON.parse(refreshTokenStr);

          const { data } = await axios.post('http://localhost:8000/v1/auth/refresh', {
            refresh: refreshToken,
          });

          const newAccessToken = data.data.accessToken;
          const newRefreshToken = data.data.refreshToken;

          localStorage.setItem(ACCESS_TOKEN_KEY, JSON.stringify(newAccessToken));
          localStorage.setItem(REFRESH_TOKEN_KEY, JSON.stringify(newRefreshToken));

          return newAccessToken;
        } catch (err) {
          localStorage.removeItem(ACCESS_TOKEN_KEY);
          localStorage.removeItem(REFRESH_TOKEN_KEY);
          localStorage.removeItem('userName');
          window.location.href = '/login';
          throw err;
        } finally {
          refreshPromise = null;
        }
      })();
    }

    return refreshPromise.then((newAccessToken: string) => {
      originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
      return axiosInstance.request(originalRequest);
    });
  }
);