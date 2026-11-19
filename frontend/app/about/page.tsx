import { Target, Eye, Shield, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-[#061A35] pt-32 pb-20">
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            About DataBridge BD
          </h1>
          <p className="mb-6 text-xl font-medium text-cyan-400">
            Your Trusted Research & Data Partner in Bangladesh.
          </p>
          <p className="text-lg text-gray-400">
            We bridge the gap between your data needs and actionable insights
            through professional research, fieldwork, and analytics.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-8">
            <Target className="mb-4 text-blue-600" size={40} />
            <h2 className="mb-4 text-2xl font-bold text-[#102A43]">
              Our Mission
            </h2>
            <p className="leading-relaxed text-[#64748B]">
              To empower businesses, organizations, and researchers with
              reliable, verified, and actionable data that drives better
              decisions and meaningful impact.
            </p>
          </div>
          <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-8">
            <Eye className="mb-4 text-cyan-500" size={40} />
            <h2 className="mb-4 text-2xl font-bold text-[#102A43]">
              Our Vision
            </h2>
            <p className="leading-relaxed text-[#64748B]">
              To become the most trusted data collection and research partner in
              Bangladesh, setting the standard for quality and ethical research
              practices.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-[#E2E8F0] bg-[#F8FAFC] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-12 text-center text-3xl font-bold text-[#102A43]">
            Our Values
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: <Shield size={28} />,
                title: "Customer Focus",
                desc: "We tailor every research project to your unique needs.",
              },
              {
                icon: <Users size={28} />,
                title: "Quality First",
                desc: "Rigorous verification and ethical standards in every project.",
              },
              {
                icon: <Target size={28} />,
                title: "Transparency",
                desc: "Clear communication and honest reporting at every step.",
              },
            ].map((value, i) => (
              <div key={i} className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
                  {value.icon}
                </div>
                <h3 className="mb-2 text-xl font-bold text-[#102A43]">
                  {value.title}
                </h3>
                <p className="text-[#64748B]">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
