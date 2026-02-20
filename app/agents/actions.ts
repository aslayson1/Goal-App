"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

async function ensureAgentAuthColumns() {
  const supabase = await createClient()

  // Check if email column exists by trying to select it
  const { error } = await supabase.from("agents").select("email").limit(1)

  // If column doesn't exist, we need to add it
  if (error && error.message.includes("column")) {
    // Use raw SQL to add columns
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
      console.error("Error adding columns:", alterError)
      throw new Error("Failed to add required columns to agents table")
    }
  }
}

export async function updateAgentCredentials(agentId: string, email: string, password?: string) {
  try {
    // Ensure columns exist
    await ensureAgentAuthColumns()

    const supabase = await createClient()
    const adminClient = createAdminClient()

    // Get the agent's current auth_user_id
    const { data: agent, error: fetchError } = await supabase
      .from("agents")
      .select("auth_user_id, email")
      .eq("id", agentId)
      .single()

    if (fetchError) throw fetchError

    // If agent has an auth user, update it
    if (agent.auth_user_id) {
      const updateData: { email: string; password?: string } = { email }
      if (password) {
        updateData.password = password
      }

      const { error: authError } = await adminClient.auth.admin.updateUserById(agent.auth_user_id, updateData)

      if (authError) throw authError
    } else {
      // Create new auth user if doesn't exist
      const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
        email,
        password: password || "ChangeMe123!",
        email_confirm: true,
      })

      if (authError) throw authError

      // Update agent with auth_user_id
      const { error: updateError } = await supabase
        .from("agents")
        .update({ auth_user_id: authData.user.id, email })
        .eq("id", agentId)

      if (updateError) throw updateError

      return { success: true }
    }

    // Update email in agents table
    const { error: updateError } = await supabase.from("agents").update({ email }).eq("id", agentId)

    if (updateError) throw updateError

    return { success: true }
  } catch (error: any) {
    console.error("Error updating agent credentials:", error)
    return { success: false, error: error.message }
  }
}

export async function createAgentWithCredentials(
  name: string,
  role: string,
  description: string,
  email: string,
  password: string,
) {
  try {
    // Ensure columns exist
    await ensureAgentAuthColumns()

    const supabase = await createClient()
    const adminClient = createAdminClient()

    // Create auth user
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError) throw authError

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Not authenticated")

    // Create agent record
    const { data: agent, error: agentError } = await supabase
      .from("agents")
      .insert({
        user_id: user.id,
        name,
        role,
        description,
        email,
        auth_user_id: authData.user.id,
      })
      .select()
      .single()

    if (agentError) throw agentError

    return { success: true, agent }
  } catch (error: any) {
    console.error("Error creating agent:", error)
    return { success: false, error: error.message }
  }
}

export async function updateAgentAuthUser(
  agentId: string,
  agentName: string,
  authUserId: string | null,
  email: string,
  password?: string,
) {
  try {
    const adminClient = createAdminClient()

    if (authUserId) {
      const updateData: { email: string; password?: string; user_metadata: { name: string } } = {
        email,
        user_metadata: { name: agentName },
      }
      if (password) {
        updateData.password = password
      }

      const { error: authError } = await adminClient.auth.admin.updateUserById(authUserId, updateData)
      if (authError) throw authError

      console.log("[v0] Updated auth user with name in metadata")
      return { success: true, authUserId }
    } else {
      const { data: existingUsers, error: listError } = await adminClient.auth.admin.listUsers()

      if (listError) throw listError

      const existingUser = existingUsers.users.find((u) => u.email === email)

      if (existingUser) {
        const updateData: { password?: string; user_metadata: { name: string } } = {
          user_metadata: { name: agentName },
        }
        if (password) {
          updateData.password = password
        }

        const { error: updateError } = await adminClient.auth.admin.updateUserById(existingUser.id, updateData)
        if (updateError) throw updateError

        console.log("[v0] Found existing auth user, updated password and name")
        return { success: true, authUserId: existingUser.id }
      } else {
        const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
          email,
          password: password || "ChangeMe123!",
          email_confirm: true,
          user_metadata: { name: agentName },
        })

        if (authError) throw authError

        console.log("[v0] Created new auth user with name")
        return { success: true, authUserId: authData.user.id }
      }
    }
  } catch (error: any) {
    console.error("[v0] Error in updateAgentAuthUser:", error)
    return { success: false, error: error.message }
  }
}

export async function createAgentWithAuth(
  userId: string,
  name: string,
  role: string,
  description: string,
  email: string,
  password: string,
) {
  try {
    console.log("[v0] Creating agent:", { name, email })
    const adminClient = createAdminClient()

    // Create agent without trying to create auth user
    // Auth users can be created separately or invited via email
    console.log("[v0] Inserting agent record without auth user")
    const { data: agent, error: agentError } = await adminClient
      .from("agents")
      .insert({
        user_id: userId,
        name,
        role,
        description,
        email,
        auth_user_id: null, // Will be linked later when user signs up
      })
      .select()
      .single()

    if (agentError) {
      console.error("[v0] Agent insert error:", agentError)
      throw agentError
    }

    console.log("[v0] Successfully created agent")
    return { success: true, agent }
  } catch (error: any) {
    console.error("[v0] Error creating agent:", error)
    return { success: false, error: error.message || JSON.stringify(error) }
  }
}

export async function syncAgentName(authUserId: string, agentName: string) {
  try {
    const adminClient = createAdminClient()

    const { error } = await adminClient.auth.admin.updateUserById(authUserId, {
      user_metadata: { name: agentName },
    })

    if (error) throw error

    console.log("[v0] Successfully synced agent name to auth metadata")
    return { success: true }
  } catch (error: any) {
    console.error("[v0] Error syncing agent name:", error)
    return { success: false, error: error.message }
  }
}
