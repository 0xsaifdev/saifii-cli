import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import { useAuthStore } from '../store/auth.store';

export const useAuth = () => {
  const { setAuth, clearAuth, user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const login = useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      apiClient.post('/auth/login', credentials).then((r) => r.data),
    onSuccess: (data) => {
      setAuth(data.data.user, data.data.accessToken);
      localStorage.setItem('accessToken', data.data.accessToken);
    },
  });

  const logout = useMutation({
    mutationFn: () => apiClient.post('/auth/logout').then((r) => r.data),
    onSettled: () => {
      clearAuth();
      localStorage.removeItem('accessToken');
      queryClient.clear();
    },
  });

  const register = useMutation({
    mutationFn: (dto: { name: string; email: string; password: string }) =>
      apiClient.post('/auth/register', dto).then((r) => r.data),
  });

  return { user, isAuthenticated, login, logout, register };
};
