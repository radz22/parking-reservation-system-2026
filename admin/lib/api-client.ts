import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { getSession, signOut } from 'next-auth/react';

const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || 'https://api.parkingreservation.online',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const session = await getSession();

  if (session?.error === 'RefreshAccessTokenError') {
    await signOut({ callbackUrl: '/login' });
    return config;
  }

  if (session?.user?.accessToken) {
    config.headers.Authorization = `Bearer ${session.user.accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!original || original._retry || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    original._retry = true;

    const session = await getSession();

    if (session?.error === 'RefreshAccessTokenError' || !session?.user?.accessToken) {
      await signOut({ callbackUrl: '/login' });
      return Promise.reject(error);
    }

    original.headers.Authorization = `Bearer ${session.user.accessToken}`;
    return apiClient(original);
  },
);

export default apiClient;
