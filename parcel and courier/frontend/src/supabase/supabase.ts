import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://varhcrezovyhonajushr.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhcmhjcmV6b3Z5aG9uYWp1c2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNTQ5MzgsImV4cCI6MjA3MDYzMDkzOH0.GxC_jnH0nnOPDvoa7SIE4UplcD_-c--dxKHTk_il6dY";

export const supabase = createClient(supabaseUrl, supabaseKey);
