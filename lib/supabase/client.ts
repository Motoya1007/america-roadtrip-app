import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy singleton — avoids module-level createClient() call during SSR/prerender
// where env vars may not be present. Only instantiated on first actual use (browser).
let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return _client;
}
