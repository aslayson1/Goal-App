import { cookies, headers } from "next/headers"
import { createServerClient } from "@supabase/auth-helpers-nextjs"

export function createSupabaseServerClient() {
  const cookieStore = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set() {},
      remove() {},
    },
    headers: {
      get(k: string) {
        return headers().get(k) ?? undefined
      },
    },
  })
}
