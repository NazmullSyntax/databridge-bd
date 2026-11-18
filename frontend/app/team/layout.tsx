"use client"

import { useEffect, useState, type ReactNode } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

type TeamUser = {
  fullName: string
  email: string
  role: string
}

function isTeamUser(value: unknown): value is TeamUser {
  return (
    typeof value === "object" &&
    value !== null &&
    "fullName" in value &&
    typeof value.fullName === "string" &&
    "email" in value &&
    typeof value.email === "string" &&
    "role" in value &&
    typeof value.role === "string"
  )
}

export default function TeamLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<TeamUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userString = localStorage.getItem("user")
    if (!token || !userString) {
      router.push("/login")
      return
    }

    let storedUser: unknown
    try {
      storedUser = JSON.parse(userString)
    } catch {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      router.push("/login")
      return
    }

    if (!isTeamUser(storedUser)) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      router.push("/login")
      return
    }

    if (storedUser.role !== "TEAM" && storedUser.role !== "ADMIN") {
      router.push("/dashboard")
      return
    }

    setUser(storedUser)
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Checking access...
      </div>
    )
  }

  if (!user) return null

  const navItems = [
    { label: "Dashboard", href: "/team", icon: "🏠" },
    { label: "My Tasks", href: "/team/tasks", icon: "✅" },
    { label: "My Projects", href: "/team/projects", icon: "📁" },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="flex w-64 flex-col border-r border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-6">
          <Link
            href="/team"
            className="text-2xl font-bold tracking-tight text-slate-900"
          >
            DataBridge<span className="text-blue-600">BD</span>
            <span className="ml-2 text-sm font-medium text-slate-500">
              Team
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/team" && pathname.startsWith(`${item.href}/`))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="mb-3 rounded-lg bg-slate-50 p-3">
            <p className="truncate text-sm font-semibold text-slate-900">
              {user.fullName}
            </p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("token")
              localStorage.removeItem("user")
              router.push("/login")
            }}
            className="w-full rounded-lg px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white p-4">
          <div className="mx-auto max-w-5xl">
            <h1 className="text-xl font-bold text-slate-900">
              DataBridge BD - Team
            </h1>
          </div>
        </header>
        <div className="mx-auto max-w-5xl p-8">{children}</div>
      </main>
    </div>
  )
}
