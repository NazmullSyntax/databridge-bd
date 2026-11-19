import { FileText, Briefcase, MessageSquare, Clock } from "lucide-react";

export default function DashboardOverview() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#102A43]">Welcome back, Customer!</h1>
        <p className="text-[#64748B] text-sm mt-1">Here&apos;s what&apos;s happening with your account.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Requests", value: "3", icon: <FileText className="text-cyan-600" />, bg: "bg-cyan-50" },
          { label: "Active Projects", value: "2", icon: <Briefcase className="text-blue-600" />, bg: "bg-blue-50" },
          { label: "Unread Messages", value: "5", icon: <MessageSquare className="text-purple-600" />, bg: "bg-purple-50" },
          { label: "Pending Invoices", value: "1", icon: <Clock className="text-orange-600" />, bg: "bg-orange-50" },
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

      {/* Recent Projects */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm">
        <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center">
          <h2 className="text-lg font-bold text-[#102A43]">Recent Projects</h2>
          <button type="button" className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All</button>
        </div>
        <div className="divide-y divide-[#E2E8F0]">
          {[
            { title: "Market Research in Dhaka", status: "In Progress", date: "Due Apr 30, 2025", progress: 70 },
            { title: "NGO Survey Project", status: "In Progress", date: "Due May 5, 2025", progress: 40 },
            { title: "Business Data Analysis", status: "Completed", date: "Apr 10, 2025", progress: 100 },
          ].map((project, i) => (
            <div key={i} className="p-6 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors">
              <div>
                <h3 className="font-semibold text-[#102A43]">{project.title}</h3>
                <p className="text-sm text-[#64748B] mt-1">{project.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  project.status === "Completed" ? "bg-green-100 text-green-700" : "bg-cyan-100 text-cyan-700"
                }`}>
                  {project.status}
                </span>
                <div className="w-32">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${project.progress === 100 ? "bg-green-500" : "bg-cyan-500"}`} 
                      style={{ width: `${project.progress}%` }} 
                    />
                  </div>
                  <p className="text-xs text-[#64748B] mt-1 text-right">{project.progress}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
