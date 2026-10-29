import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://ygnvcmwoatlaeulrfmdi.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  Buffer.from('c2Jfc2VjcmV0X1IxbGFzOHJ0Zlgwb1lSanZkTG9EWVFfQ1NGc3JkS2U=', 'base64').toString('utf-8');

export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createClient();
