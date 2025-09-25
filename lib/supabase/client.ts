import { createBrowserClient } from "@supabase/ssr"

export const supabase = (() => {
  // Check if we're in browser environment and have required env vars
  if (typeof window !== "undefined") {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseAnonKey) {
      try {
        return createBrowserClient(supabaseUrl, supabaseAnonKey)
      } catch (error) {
        console.error("Failed to create Supabase client:", error)
      }
    } else {
      console.warn("Supabase environment variables not found - using dummy client")
    }
  }

  // Fallback dummy client with proper query builder interface
  console.warn("Using Supabase dummy client - check environment variables")

  const dummyQueryBuilder = {
    select: () => dummyQueryBuilder,
    insert: () => dummyQueryBuilder,
    update: () => dummyQueryBuilder,
    delete: () => dummyQueryBuilder,
    eq: () => dummyQueryBuilder,
    neq: () => dummyQueryBuilder,
    gt: () => dummyQueryBuilder,
    gte: () => dummyQueryBuilder,
    lt: () => dummyQueryBuilder,
    lte: () => dummyQueryBuilder,
    like: () => dummyQueryBuilder,
    ilike: () => dummyQueryBuilder,
    is: () => dummyQueryBuilder,
    in: () => dummyQueryBuilder,
    contains: () => dummyQueryBuilder,
    containedBy: () => dummyQueryBuilder,
    rangeGt: () => dummyQueryBuilder,
    rangeGte: () => dummyQueryBuilder,
    rangeLt: () => dummyQueryBuilder,
    rangeLte: () => dummyQueryBuilder,
    rangeAdjacent: () => dummyQueryBuilder,
    overlaps: () => dummyQueryBuilder,
    textSearch: () => dummyQueryBuilder,
    match: () => dummyQueryBuilder,
    not: () => dummyQueryBuilder,
    or: () => dummyQueryBuilder,
    filter: () => dummyQueryBuilder,
    order: () => dummyQueryBuilder,
    limit: () => dummyQueryBuilder,
    range: () => dummyQueryBuilder,
    single: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
    maybeSingle: () => Promise.resolve({ data: null, error: null }),
    then: (resolve: any) => resolve({ data: [], error: null }),
  }

  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () =>
        Promise.resolve({ data: { user: null }, error: { message: "Supabase not configured" } }),
      signUp: () => Promise.resolve({ data: { user: null }, error: { message: "Supabase not configured" } }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => dummyQueryBuilder,
  }
})()

export const isSupabaseConfigured = (() => {
  if (typeof window === "undefined") return false
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return !!(supabaseUrl && supabaseAnonKey)
})()

export const getSupabaseClient = () => supabase
