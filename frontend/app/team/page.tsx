import { Briefcase, CheckSquare, Clock, FileText } from "lucide-react";

export default function TeamDashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#102A43]">Welcome back, Team!</h1>
        <p className="text-[#64748B] text-sm mt-1">Here is an overview of your assigned work.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Assigned Projects", value: "3", icon: <Briefcase className="text-cyan-600" />, bg: "bg-cyan-50" },
          { label: "Pending Tasks", value: "5", icon: <CheckSquare className="text-orange-600" />, bg: "bg-orange-50" },
          { label: "In Progress", value: "2", icon: <Clock className="text-blue-600" />, bg: "bg-blue-50" },
          { label: "Submitted Work", value: "1", icon: <FileText className="text-green-600" />, bg: "bg-green-50" },
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
      
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6">
        <h2 className="text-lg font-bold text-[#102A43] mb-4">Recent Tasks</h2>
        <p className="text-sm text-[#64748B]">Task list will be displayed here...</p>
      </div>
    </div>
  );
}
