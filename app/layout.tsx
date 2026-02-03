import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth/auth-provider"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Goal Tracker",
  description: "Track and achieve your goals with our modern goal tracking application",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <SidebarProvider>
              <div className="flex flex-col h-screen overflow-hidden">
                <AppHeader />
                <div className="flex flex-1 overflow-hidden">
                  <AppSidebar />
                  <SidebarInset className="flex-1 min-w-0">
                    <main className="h-full overflow-auto bg-slate-50">
                      {children}
                    </main>
                  </SidebarInset>
                </div>
              </div>
            </SidebarProvider>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
