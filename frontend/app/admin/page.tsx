import { Users, FileText, Briefcase, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#102A43]">Dashboard Overview</h1>
        <p className="text-[#64748B] text-sm mt-1">Welcome to your admin panel.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Customers", value: "245", icon: <Users className="text-cyan-600" />, bg: "bg-cyan-50" },
          { label: "New Requests", value: "28", icon: <FileText className="text-blue-600" />, bg: "bg-blue-50" },
          { label: "Active Projects", value: "32", icon: <Briefcase className="text-purple-600" />, bg: "bg-purple-50" },
          { label: "Revenue", value: "৳125K", icon: <DollarSign className="text-green-600" />, bg: "bg-green-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center`}>
                {stat.icon}
              </div>
              <span className="text-sm font-medium text-[#64748B]">{stat.label}</span>
            </div>
            <p className="text-3xl font-bold text-[#102A43]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts & Tables (Placeholder) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm h-80 flex flex-col items-center justify-center">
          <p className="text-[#64748B] font-medium">Requests Overview Chart</p>
          <p className="text-xs text-gray-400 mt-2">(Chart Component Here)</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm h-80 flex flex-col items-center justify-center">
          <p className="text-[#64748B] font-medium">Projects by Status</p>
          <p className="text-xs text-gray-400 mt-2">(Pie Chart Component Here)</p>
        </div>
      </div>
    </div>
  );
}
