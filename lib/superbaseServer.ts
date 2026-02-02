import { createClient } from '@supabase/supabase-js';

const suparbaseServer = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_PUBLISHABLE_SERVICE_ROLE!
);

export default suparbaseServer;
