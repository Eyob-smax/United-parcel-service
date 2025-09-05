import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bauwdzvnaxvhdafukphb.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhdXdkenZuYXh2aGRhZnVrcGhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NTc4MTAsImV4cCI6MjA3MjEzMzgxMH0.qipATg5VKxpwRFkxVD63qq3AHuDD6gh-S2KqjPOUeXQ";

export const supabase = createClient(supabaseUrl, supabaseKey);
