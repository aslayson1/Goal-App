import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/client"

export async function GET() {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  return NextResponse.json({ user: data.user ? { id: data.user.id, email: data.user.email } : null })
}
