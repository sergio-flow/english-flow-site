import { createClient } from "@supabase/supabase-js";

const projectID = process.env.SUPABASE_PROJECT_ID;
const anonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(`https://${projectID}.supabase.co`, anonKey);

export default supabase;