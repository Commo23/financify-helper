// Re-export everything from the auto-generated client
// This wrapper ensures the Supabase client works even if .env is not loaded
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pmtkufkwfsxxuleuyweb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtdGt1Zmt3ZnN4eHVsZXV5d2ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4ODY4NzQsImV4cCI6MjA4NzQ2Mjg3NH0.AEIKeY0NzEtToW5TI6GSn26u_3vnhHsxLRKSQQWcyFY";

export const isSupabaseConfigured = true;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
