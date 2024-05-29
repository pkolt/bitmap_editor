import { z } from 'zod';
import { formSchema } from './schema';

export type FormValues = z.infer<typeof formSchema>;
