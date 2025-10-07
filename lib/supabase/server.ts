import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  // Get auth token from cookies
  const authToken = cookieStore.get("sb-access-token")?.value

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: {
      persistSession: false,
    },
    global: {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    },
  })
}

export { createSupabaseServerClient as createClient }
