import "server-only"
import { cookies, headers } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export function createSupabaseServerClient() {
  const cookieStore = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get: (n) => cookieStore.get(n)?.value,
      set: (n, v, o) => cookieStore.set({ name: n, value: v, ...o }),
      remove: (n, o) => cookieStore.set({ name: n, value: "", ...o }),
    },
    headers,
  })
}
