import { z } from 'zod';

const envSchema = z.object({
  VITE_SUPABASE_URL: z
    .string()
    .url('VITE_SUPABASE_URL must be a valid URL'),
  VITE_SUPABASE_ANON_KEY: z
    .string()
    .min(1, 'VITE_SUPABASE_ANON_KEY is required'),
  VITE_APP_URL: z
    .string()
    .url('VITE_APP_URL must be a valid URL')
    .default('http://localhost:5173'),
});

function validateEnv() {
  const raw = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    VITE_APP_URL: import.meta.env.VITE_APP_URL,
  };

  const result = envSchema.safeParse(raw);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const message = Object.entries(errors)
      .map(([key, msgs]) => `  ${key}: ${msgs?.join(', ')}`)
      .join('\n');

    throw new Error(
      `❌ Missing or invalid environment variables:\n${message}\n\nCheck .env.local against .env.example`,
    );
  }

  return result.data;
}

export const env = validateEnv();
