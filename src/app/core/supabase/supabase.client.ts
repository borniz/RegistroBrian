import { createClient } from "@supabase/supabase-js";
import { environment } from "../../../enviroment/enviroment";

export const supabase = createClient(
  environment.supabaseUrl,
  environment.supabaseKey
);