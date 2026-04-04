import apiClient from '@/lib/api';
import { Profile } from '@/types/profile-type';
import { ProfileFormValues } from '@/schemas/profile-schema';
export const profileService = {
  getProfile: async (userId: string): Promise<Profile> => {
    const res = await apiClient.get<Profile>(`/api/user/profile/${userId}`);
    return res.data;
  },

  update: async (userId: string, data: ProfileFormValues): Promise<Profile> => {
    const response = await apiClient.put<Profile>(
      `/api/user/profile/${userId}`,
      data,
    );
    return response.data;
  },
};
