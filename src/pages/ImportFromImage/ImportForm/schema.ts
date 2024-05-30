import { z } from 'zod';

export const formSchema = z.object({
  files: z
    .instanceof(FileList)
    .nullable()
    .refine((files) => files?.length !== 0, 'File is required'),
  name: z.string().min(1),
  top: z.number().nonnegative(),
  left: z.number().nonnegative(),
  width: z.number().positive(),
  height: z.number().positive(),
  threshold: z.number().gte(1).lte(255),
  invertColor: z.boolean(),
});
