"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileText, Briefcase, FileCheck, CheckSquare, Settings, LogOut, PieChart } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: "Overview", href: "/admin", icon: <LayoutDashboard size={20} /> },
    { label: "Requests", href: "/admin/requests", icon: <FileText size={20} /> },
    { label: "Projects", href: "/admin/projects", icon: <Briefcase size={20} /> },
    { label: "Team Members", href: "/admin/team", icon: <Users size={20} /> },
    { label: "Submissions", href: "/admin/submissions", icon: <CheckSquare size={20} /> },
    { label: "Invoices", href: "/admin/invoices", icon: <FileCheck size={20} /> },
    { label: "Analytics", href: "/admin/analytics", icon: <PieChart size={20} /> },
    { label: "Settings", href: "/admin/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Sidebar */}
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
        <header className="h-20 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-8">
          <h1 className="text-lg font-semibold text-[#102A43]">Admin Portal</h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-700 font-bold">
              A
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
