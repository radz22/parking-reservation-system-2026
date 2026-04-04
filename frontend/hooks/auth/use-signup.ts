import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth-service';
import { RegisterRequest } from '@/types/auth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

export const useSignup = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: () => {
      toast.success('Account created successfully! Please sign in.');
      router.push('/sign-in');
    },
    onError: (error: unknown) => {
      let message = 'Failed to create account. Please try again.';

      if (error instanceof AxiosError) {
        message =
          (error.response?.data as { message?: string })?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
    },
  });
};

