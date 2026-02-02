'use client'

import React from "react"

import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset } from '@/components/ui/sidebar'

export default function FitnessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-1 overflow-hidden">
      <AppSidebar />
      <SidebarInset className="flex-1 min-w-0">
        {children}
      </SidebarInset>
    </div>
  )
}
