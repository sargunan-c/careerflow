/**
 * Checks whether Supabase environment variables are properly provided
 * and do not contain placeholder/dummy values.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return false;
  }

  // Check if still placeholder
  if (
    url.includes("your-project.supabase.co") ||
    anonKey.includes("your-anon-key-here") ||
    url.trim() === "" ||
    anonKey.trim() === ""
  ) {
    return false;
  }

  return true;
}

