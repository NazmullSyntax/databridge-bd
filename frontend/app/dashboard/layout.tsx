"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Briefcase, MessageSquare, FileCheck, User, Settings, LogOut } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "My Requests", href: "/dashboard/requests", icon: <FileText size={20} /> },
    { label: "My Projects", href: "/dashboard/projects", icon: <Briefcase size={20} /> },
    { label: "Messages", href: "/dashboard/messages", icon: <MessageSquare size={20} /> },
    { label: "Invoices", href: "/dashboard/invoices", icon: <FileCheck size={20} /> },
    { label: "Profile", href: "/dashboard/profile", icon: <User size={20} /> },
    { label: "Settings", href: "/dashboard/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Sidebar (ডার্ক নেভি) */}
      <aside className="w-64 bg-[#061A35] text-white hidden md:flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <Link href="/" className="text-xl font-bold">
            DataBridge<span className="text-cyan-400">BD</span>
          </Link>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-400" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-8">
          <h1 className="text-lg font-semibold text-[#102A43]">Customer Portal</h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-700 font-bold">
              C
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
