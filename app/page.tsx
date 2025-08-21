import type React from "react"
\
You are editing a Next.js (App Router) project. Make minimal repair-only edits.\
Do not change any UI/JSX, styling, component structure, imports, logic, routes, server code, database code/schemas, or environment variables.
Do not add new components/files. Do not rename anything.

1) Repair app/page.tsx
\
The current file was accidentally replaced
with placeholders (e.g., // Existing code here, // JSX structure here).
\
Action: Restore app/page.tsx to the last working version from the repository history before those placeholders were introduced (the version that contained the complete Goal Tracker app and exported the page).
\
If repository history is available: restore app/page.tsx to the last good revision (e.g., checkout or revert that single file).

If repository history is not available, STOP and make no changes to app/page.tsx (to avoid losing the original content). Do not leave placeholders.
\
Acceptance
for page.tsx
:

The file contains the original, full app code again (no placeholder comments).
\
The page has a valid default
export
(either
export default function Page() {
  return <GoalTrackerApp />
}
or
export default GoalTrackerApp
), exactly as it was in the last working version.

No other diffs in UI/logic/DB.

2) Repair app/layout.tsx
\
The file contains a literal ... where the RootLayout
function header
should
be, breaking
the
module.
\
Action: Replace the broken header line
with a valid
RootLayout
signature, without
changing
any
of
the
existing
JSX
under
it.The
body
and
providers
must
remain
exactly as-is.
\
Exact replacement
for the broken line (insert this line right before the existing return (...) block and remove the stray .../broken tokens):
\
export default function RootLayout({ children }: { children: React.ReactNode }) {

\
Keep the rest of the file intact, including:
\
export const metadata: Metadata = { ... } (leave the object as-is)

The <html>...</html> markup, ThemeProvider, AuthProvider, and Toaster.
\
Acceptance for layout.tsx:
\
Compiles with a valid export default function RootLayout(...).
\
No JSX inside the return is changed.
\
No additional changes anywhere else.

3) Do-not-change checklist

Do not modify any other files.

Do not introduce new dialogs/components.

Do not touch Supabase code or schemas.
\
Do not auto-“format” large diffs; only the surgical fixes above.\
