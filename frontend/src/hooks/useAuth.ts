import { useMutation } from '@tanstack/react-query';
import { useAuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import type { ApiResponse, AuthResponseData } from '../types/api';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const useAuth = () => {
  const { login: setAuthUser, logout } = useAuthContext();

  const registerMutation = useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      try {
        const response = await api.post<ApiResponse<AuthResponseData>>(
          '/auth/register',
          payload
        );
        return response.data;
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Registration failed. Please try again.';
        throw new Error(message);
      }
    },
    onSuccess: (data) => {
      setAuthUser(data.data);
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (payload: LoginPayload) => {
      try {
        const response = await api.post<ApiResponse<AuthResponseData>>(
          '/auth/login',
          payload
        );
        return response.data;
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Login failed. Please check your credentials.';
        throw new Error(message);
      }
    },
    onSuccess: (data) => {
      setAuthUser(data.data);
    },
  });

  return {
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error?.message || null,

    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error?.message || null,

    logout,
  };
};

export default useAuth;