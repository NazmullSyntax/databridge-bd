"use client"

import { usePathname } from "next/navigation"
import Header from "./Header"
import Footer from "./Footer"

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // এই পেজগুলোতে হেডার ও ফুটার দেখাবে না
  const isAuthPage = pathname === "/login" || pathname === "/register"

  return (
    <div className="flex min-h-screen flex-col">
      {!isAuthPage && <Header />}
      <main className={`grow ${!isAuthPage ? "pt-20" : ""}`}>{children}</main>
      {!isAuthPage && <Footer />}
    </div>
  )
}
