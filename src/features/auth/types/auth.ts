import { z } from 'zod';
import { loginSchema } from '../schemas/auth';

export type LoginFormData = z.infer<typeof loginSchema>;