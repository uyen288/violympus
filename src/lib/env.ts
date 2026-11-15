import { z } from 'zod';

const DEFAULT_SUPABASE_URL = 'https://qflelakcnvljznbdkpoh.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_-3aQI7U09ulABGJ5Vbjo8Q_gVWuum3T';

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
    VITE_SUPABASE_URL:
      import.meta.env.VITE_SUPABASE_URL ||
      DEFAULT_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY:
      import.meta.env.VITE_SUPABASE_ANON_KEY ||
      import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
      DEFAULT_SUPABASE_ANON_KEY,
    VITE_APP_URL:
      import.meta.env.VITE_APP_URL ||
      (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'),
  };

  const result = envSchema.safeParse(raw);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const message = Object.entries(errors)
      .map(([key, msgs]) => `  ${key}: ${msgs?.join(', ')}`)
      .join('\n');

    // Never crash the entire application; return default config with a clear console warning
    console.warn(
      `⚠️ Missing or invalid environment variables:\n${message}\nUsing default configuration.`,
    );

    return {
      VITE_SUPABASE_URL: DEFAULT_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: DEFAULT_SUPABASE_ANON_KEY,
      VITE_APP_URL:
        typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173',
    };
  }

  return result.data;
}

export const env = validateEnv();
