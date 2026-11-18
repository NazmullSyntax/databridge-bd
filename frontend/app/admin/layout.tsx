"use client"

import { useEffect, useState, type ReactNode } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import NotificationBell from "@/components/NotificationBell"
import GlobalSearch from "@/components/GlobalSearch"

type AdminUser = {
  fullName: string
  email: string
  role: string
}

function isAdminUser(value: unknown): value is AdminUser {
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

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const isMainAdmin = pathname === "/admin"
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userStr = localStorage.getItem("user")
    if (!token || !userStr) {
      router.push("/login")
      return
    }

    let storedUser: unknown
    try {
      storedUser = JSON.parse(userStr)
    } catch {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      router.push("/login")
      return
    }

    if (!isAdminUser(storedUser)) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      router.push("/login")
      return
    }

    if (storedUser.role !== "ADMIN") {
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
    { label: "Overview", href: "/admin", icon: "📊" },
    { label: "Requests", href: "/admin/requests-list", icon: "📝" },
    { label: "Projects", href: "/admin/projects", icon: "📁" },
    { label: "Team Members", href: "/admin/team", icon: "👥" },
    { label: "Teams", href: "/admin/teams", icon: "🏢" },
    { label: "Tasks", href: "/admin/tasks/new", icon: "✅" },
    { label: "Submissions", href: "/admin/submissions", icon: "📤" },
    { label: "Audit Logs", href: "/admin/audit", icon: "📜" },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="flex w-64 flex-col border-r border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-6">
          <Link
            href="/admin"
            className="text-2xl font-bold tracking-tight text-slate-900"
          >
            DataBridge<span className="text-blue-600">BD</span>
            <span className="ml-2 text-sm font-medium text-slate-500">
              Admin
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(`${item.href}/`))

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
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white p-4">
          <div className="mx-auto flex max-w-5xl items-center gap-4">
            {!isMainAdmin && (
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                ← Back
              </button>
            )}
            <h1 className="text-xl font-bold text-slate-900">
              DataBridge BD - Admin
            </h1>
            <div className="ml-auto flex items-center gap-4">
              <GlobalSearch />
              <NotificationBell />
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem("token")
                  localStorage.removeItem("user")
                  router.push("/login")
                }}
                className="rounded-lg px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-5xl p-8">{children}</div>
      </main>
    </div>
  )
}
