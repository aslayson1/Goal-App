import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Use service role key to execute DDL commands
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Check if columns already exist
    const { data: existingColumns, error: checkError } = await supabase
      .from("agents")
      .select("email, auth_user_id")
      .limit(1)

    // If no error, columns already exist
    if (!checkError) {
      return NextResponse.json({ success: true, message: "Columns already exist" })
    }

    // Add email and auth_user_id columns
    const { error: alterError } = await supabase.rpc("exec_sql", {
      sql: `
        ALTER TABLE agents 
        ADD COLUMN IF NOT EXISTS email TEXT UNIQUE,
        ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE;
        
        CREATE INDEX IF NOT EXISTS idx_agents_email ON agents(email);
        CREATE INDEX IF NOT EXISTS idx_agents_auth_user_id ON agents(auth_user_id);
      `,
    })

    if (alterError) {
      // Try alternative approach using raw SQL
      const alterQuery = `
        DO $$ 
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='agents' AND column_name='email') THEN
            ALTER TABLE agents ADD COLUMN email TEXT UNIQUE;
          END IF;
          
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='agents' AND column_name='auth_user_id') THEN
            ALTER TABLE agents ADD COLUMN auth_user_id UUID UNIQUE;
          END IF;
        END $$;
        
        CREATE INDEX IF NOT EXISTS idx_agents_email ON agents(email);
        CREATE INDEX IF NOT EXISTS idx_agents_auth_user_id ON agents(auth_user_id);
      `

      // Execute using direct SQL
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
        },
        body: JSON.stringify({ query: alterQuery }),
      })

      if (!response.ok) {
        throw new Error("Failed to execute migration")
      }
    }

    return NextResponse.json({ success: true, message: "Migration completed" })
  } catch (error: any) {
    console.error("Migration error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
