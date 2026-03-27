import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth-service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const useSignin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: any) => authService.login(data),
    onSuccess: (data) => {
      toast.success('Signed in successfully!');
      // Typically you'd store tokens in localStorage/cookies here
      // But we'll just redirect for now
      router.push('/admin/dashboard'); // Or wherever appropriate
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to sign in. Please check your credentials.';
      toast.error(message);
    },
  });
};
