'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSession } from 'next-auth/react';
import { profileService } from '@/services/profile-service';
import { Profile } from '@/types/profile-type';
import { ProfileFormValues } from '@/schemas/profile-schema';
export function useProfile() {
  const queryClient = useQueryClient();

  const fetchProfile = async (): Promise<Profile> => {
    const session = await getSession();

    const userId = session?.user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    return await profileService.getProfile(userId);
  };

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProfileFormValues }) =>
      profileService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const handleUpdateProfile = async (data: ProfileFormValues) => {
    if (!profile?.id) return;
    try {
      await updateMutation.mutateAsync({ id: profile.id, data });
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };
  return {
    profile,
    isLoading,
    error,
    handleUpdateProfile,
    updateMutation,
  };
}
