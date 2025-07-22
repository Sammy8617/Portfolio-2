import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { PerformanceToggle } from "@/components/performance-toggle"

export const metadata: Metadata = {
  title: "Aryan Garv - Portfolio",
  description: "Data Science & Engineering Student Portfolio",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <PerformanceToggle />
      </body>
    </html>
  )
}
