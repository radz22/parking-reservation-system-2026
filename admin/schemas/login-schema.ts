import * as z from 'zod/v3';

export const LoginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
