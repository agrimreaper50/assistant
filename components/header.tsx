"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex">
          <a href="/" className="flex items-center space-x-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-indigo-600 to-purple-600">
              <div className="absolute inset-0 flex items-center justify-center font-bold text-white">SA</div>
            </div>
            <span className="hidden font-bold sm:inline-block">Smart Assistant</span>
          </a>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {session ? (
            <button
            onClick={async () => {
              try {
                await fetch("/api/flush-cache", { method: "POST" })
              } catch (e) {
                console.error("Failed to flush cache:", e)
              } finally {
                signOut()
              }
            }}
            className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:from-indigo-700 hover:to-purple-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Sign out
          </button>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:from-indigo-700 hover:to-purple-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
