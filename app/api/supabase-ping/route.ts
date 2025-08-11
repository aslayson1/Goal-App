import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return Response.json({ ok: true, authenticated: !!user })
  } catch (e: any) {
    return Response.json({ ok: false, error: e.message })
  }
}
