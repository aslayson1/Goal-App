// Test script to verify authentication persistence behavior
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

async function testAuthPersistence() {
  console.log("🔐 Testing Authentication Persistence...")
  console.log("=".repeat(50))

  try {
    // Test 1: Check current auth state
    console.log("\n1. Checking current authentication state...")
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      console.error("❌ Error getting user:", userError.message)
      return false
    }

    if (!user) {
      console.log("ℹ️  No authenticated user found")
      console.log("   Please sign in through the web interface first")
      return true
    }

    console.log("✅ User authenticated:", {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || "No name set",
    })

    // Test 2: Check session validity
    console.log("\n2. Checking session validity...")
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("❌ Error getting session:", sessionError.message)
      return false
    }

    if (!session) {
      console.log("❌ No active session found")
      return false
    }

    console.log("✅ Active session found")
    console.log("   Access token expires:", new Date(session.expires_at * 1000).toLocaleString())

    // Test 3: Test token refresh
    console.log("\n3. Testing token refresh capability...")
    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()

    if (refreshError) {
      console.error("❌ Error refreshing session:", refreshError.message)
      return false
    }

    console.log("✅ Session refresh successful")

    // Test 4: Test database access with current session
    console.log("\n4. Testing database access with current session...")
    const { data: tasks, error: tasksError } = await supabase.from("tasks").select("id, title").limit(1)

    if (tasksError) {
      console.error("❌ Error accessing database:", tasksError.message)
      return false
    }

    console.log("✅ Database access successful")
    console.log(`   Found ${tasks?.length || 0} tasks`)

    // Test 5: Verify RLS is working
    console.log("\n5. Testing Row Level Security...")
    const { data: allTasks, error: rlsError } = await supabase.from("tasks").select("id, user_id").limit(5)

    if (rlsError) {
      console.error("❌ RLS test failed:", rlsError.message)
      return false
    }

    // Check that all returned tasks belong to the current user
    const userTasks = allTasks?.filter((task) => task.user_id === user.id) || []
    const otherUserTasks = allTasks?.filter((task) => task.user_id !== user.id) || []

    if (otherUserTasks.length > 0) {
      console.error("❌ RLS not working - can see other users' tasks")
      return false
    }

    console.log("✅ Row Level Security working correctly")
    console.log(`   Can only see own tasks (${userTasks.length} tasks)`)

    console.log("\n" + "=".repeat(50))
    console.log("🎉 All authentication persistence tests passed!")
    console.log("\nManual testing checklist:")
    console.log("□ Hard refresh (⌘R/F5) on protected pages stays authenticated")
    console.log("□ Direct navigation to protected URLs works when signed in")
    console.log("□ Unauthenticated users are redirected to login")
    console.log("□ Login redirects to original destination")
    console.log("□ No demo credentials appear anywhere")

    return true
  } catch (error) {
    console.error("❌ Test failed with error:", error)
    return false
  }
}

// Run the test
testAuthPersistence()
  .then((success) => {
    process.exit(success ? 0 : 1)
  })
  .catch((error) => {
    console.error("Test execution failed:", error)
    process.exit(1)
  })
