# Goal Tracker

A modern goal tracking application built with Next.js, React, and TypeScript.

## Features

- User authentication and profiles
- Goal creation and management
- Progress tracking with visual indicators
- Drag and drop goal organization
- Dark/light theme support
- Responsive design

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Radix UI components
- React Hook Form
- Zod validation

## Deployment

This project is configured for deployment on Vercel with automatic builds on every commit.

## Auth Persistence & Refresh Behavior

This application implements robust authentication persistence using Supabase Auth with proper server-side session handling.

### Key Features

- **Server-side session hydration**: User authentication state is available immediately on page load
- **Persistent sessions**: Hard browser refreshes (⌘R/F5) preserve authentication state
- **Route protection**: Middleware automatically redirects unauthenticated users to login
- **Seamless redirects**: After login, users are redirected to their original destination
- **No demo credentials**: All hardcoded demo authentication has been removed

### Testing Authentication Persistence

Run the auth persistence test script:

\`\`\`bash
node scripts/test-auth-persistence.js
\`\`\`

### Manual Testing Checklist

1. **Refresh Persistence**: Sign in and refresh any protected page - you should stay authenticated
2. **Deep Link Access**: While signed in, directly navigate to protected URLs in a new tab - should work immediately
3. **Redirect Flow**: Access protected pages while signed out - should redirect to login, then back to original page
4. **No Demo State**: Verify no demo credentials appear anywhere in the application

### Authentication Flow

1. **Server-side**: Middleware checks authentication and refreshes tokens
2. **Client-side**: AuthProvider hydrates with server-provided user data
3. **Route Protection**: Unauthenticated users are redirected to `/login?redirectTo=<original-url>`
4. **Post-login**: Users are automatically redirected to their intended destination

### Troubleshooting

If authentication isn't persisting:

1. Check that Supabase environment variables are properly set
2. Verify cookies are being set correctly (check browser dev tools)
3. Run the test script to diagnose specific issues
4. Check browser console for authentication errors
