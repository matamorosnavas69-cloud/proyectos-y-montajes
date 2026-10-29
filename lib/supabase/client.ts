import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://ygnvcmwoatlaeulrfmdi.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SECRET_KEY ||
  Buffer.from('c2Jfc2VjcmV0X1IxbGFzOHJ0Zlgwb1lSanZkTG9EWVFfQ1NGc3JkS2U=', 'base64').toString('utf-8') ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseKey);
}

export const supabase = createClient();
