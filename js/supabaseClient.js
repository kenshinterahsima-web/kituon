import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = window.SUPABASE_URL;
const supabaseAnonKey = window.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase設定が不足しています。index.html と submit.html に SUPABASE_URL / SUPABASE_ANON_KEY を設定してください。"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
