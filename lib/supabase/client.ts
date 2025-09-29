export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.error("[v0] Supabase client: Missing environment variables")
    throw new Error("Supabase configuration is missing")
  }

  // Basic Supabase client implementation
  return {
    auth: {
      getUser: async () => {
        try {
          const response = await fetch(`${url}/auth/v1/user`, {
            headers: {
              Authorization: `Bearer ${key}`,
              apikey: key,
            },
          })

          if (!response.ok) {
            return { data: { user: null }, error: null }
          }

          const user = await response.json()
          return { data: { user }, error: null }
        } catch (error) {
          return { data: { user: null }, error }
        }
      },
      signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
        try {
          const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: key,
            },
            body: JSON.stringify({ email, password }),
          })

          if (!response.ok) {
            const error = await response.json()
            return { data: null, error }
          }

          const data = await response.json()
          return { data, error: null }
        } catch (error) {
          return { data: null, error }
        }
      },
      signUp: async ({ email, password, options }: { email: string; password: string; options?: any }) => {
        try {
          const response = await fetch(`${url}/auth/v1/signup`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: key,
            },
            body: JSON.stringify({
              email,
              password,
              data: options?.data || {},
            }),
          })

          if (!response.ok) {
            const error = await response.json()
            return { data: null, error }
          }

          const data = await response.json()
          return { data, error: null }
        } catch (error) {
          return { data: null, error }
        }
      },
      signOut: async () => {
        try {
          const response = await fetch(`${url}/auth/v1/logout`, {
            method: "POST",
            headers: {
              apikey: key,
            },
          })

          return { error: response.ok ? null : await response.json() }
        } catch (error) {
          return { error }
        }
      },
      onAuthStateChange: (callback: (event: string, session: any) => void) => {
        // Basic implementation - in a real app you'd use WebSocket or polling
        return {
          data: {
            subscription: {
              unsubscribe: () => {},
            },
          },
        }
      },
    },
  }
}

export const isSupabaseConfigured = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export const supabase = isSupabaseConfigured ? createClient() : null
