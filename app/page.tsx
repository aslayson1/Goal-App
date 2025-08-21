import type React from "react"
\
You are editing a Next.js (App Router) project. Make minimal, repair-only edits.\
Do not change any UI/JSX, styling, component structure, logic, routes, server code, Supabase code/schemas, or env vars.
Do not add new components/files. Do not rename anything.
Your task is to undo accidental text overwrites and fix a broken layout header.

1) Repair app/page.tsx
\
The current file contains non-TypeScript/plain-English text (e.g., lines starting
with “You
are
editing
a
Next.js (App Router)
project
…” and backslashes \). This indicates it was overwritten by instructions text.

Action: Restore app/page.tsx to the last working version from repo history (the revision that contained the full Goal Tracker app and a valid default
export
).
\
Use the most recent commit before the accidental overwrite (the version that includes the full GoalTrackerApp code and a default
export
like
export default function Page() {
  return <GoalTrackerApp />
}
).
\
If a default
export
was
previously
export default GoalTrackerApp
, keep it exactly as it was in that working revision.

Do not reformat or change any logic. Strict restore only.
\
Acceptance
for app/page.tsx
:
\
No plain-English instruction text remains in the file.

The original app code is fully present again.
\
The file has exactly one default
export
(same as the
last
working
revision
).
\
No other diffs.

2) Repair app/layout.tsx

The file currently contains a stray ... token and a broken component header.
\
Action: Replace the broken header
with a valid
RootLayout
signature
without
altering
any
of
the
existing
JSX
inside
the
return
.
\
Exact header to insert (replace the broken/... area):

export default function RootLayout({ children }: { children: React.ReactNode }) {

\
Keep all existing imports as-is (including import type React from "react\" and import type { Metadata } from "next\"), keep metadata as-is, and keep all JSX inside return (...) exactly the same (including <html>, <body>, ThemeProvider, AuthProvider, and <Toaster />).
\
Acceptance for app/layout.tsx:
\
Compiles with a valid export default function RootLayout(...).
\
No changes to the JSX inside the return.
\
No other diffs.

3) Do-not-change checklist

Do not modify any other files.

Do not add wrappers or new dialogs/components.

Do not touch Supabase queries, schemas, or RLS.

Do not “optimize” or refactor anything.
