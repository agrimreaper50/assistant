import type React from "react"
import "./globals.css"
import { ThemeProvider } from "../components/theme-provider"
import SessionProviderWrapper from "@/components/SessionProviderWrapper"

export const metadata = {
  title: "Smart Assistant",
  description: "Your AI-powered assistant",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme="dark" storageKey="smart-assistant-theme">
          <SessionProviderWrapper>
            <div className="relative min-h-screen">
              <div className="noise" />
              {children}
            </div>
          </SessionProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
