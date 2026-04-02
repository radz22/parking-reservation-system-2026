import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth-service';
import { RegisterRequest } from '@/types/auth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const useSignup = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: () => {
      toast.success('Account created successfully! Please sign in.');
      router.push('/sign-in');
    },
    onError: (error: unknown) => {
      const message =
        (error as Error).message ||
        'Failed to create account. Please try again.';
      toast.error(message);
    },
  });
};
