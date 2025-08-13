import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Try to get project settings
    const { data: settings, error } = await supabase.auth.admin.getSettings()

    return Response.json({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      settings: settings || "Could not fetch settings",
      error: error?.message || null,
    })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
