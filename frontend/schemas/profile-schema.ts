// schemas/profile-schema.ts
import { z } from 'zod';

export const profileSchema = z.object({
  username: z.string().min(2, 'Username is required'),
  email: z.string().email('Invalid email'),
  contact: z.string().min(5, 'Contact is required'),
  plateNumber: z.string().min(3, 'Plate number is required'),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
