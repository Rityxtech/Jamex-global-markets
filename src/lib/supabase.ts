import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dfqmyuroykqdzrpfxqwe.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmcW15dXJveWtxZHpycGZ4cXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNzA3NTUsImV4cCI6MjA5NDc0Njc1NX0.ALjqOTD28yS6NyNes9b9pFiOfP1nTDJVzJ01FR7zbMw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
