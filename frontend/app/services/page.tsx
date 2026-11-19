import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"

export default function ServicesPage() {
  const services = [
    {
      icon: "🏢",
      title: "Field Data Collection",
      desc: "Household surveys, face-to-face interviews, and community research.",
      features: [
        "Geotagged Data",
        "Verified Respondents",
        "Real-time Tracking",
      ],
    },
    {
      icon: "📊",
      title: "Market & Business Research",
      desc: "Competitor analysis, customer research, and market assessment.",
      features: ["Competitor Insights", "Market Demand", "Pricing Strategy"],
    },
    {
      icon: "📝",
      title: "Survey & Questionnaire",
      desc: "Design and execution of structured data collection.",
      features: ["Custom Forms", "Logical Flow", "Multi-language"],
    },
    {
      icon: "🧹",
      title: "Data Cleaning & Verification",
      desc: "Identify missing values, duplicates, and ensure data quality.",
      features: ["Error Detection", "Format Validation", "Quality Report"],
    },
    {
      icon: "📈",
      title: "Data Analysis & Visualization",
      desc: "Statistical analysis, charts, and actionable business insights.",
      features: ["Statistical Models", "Power BI Dashboards", "PDF Reports"],
    },
    {
      icon: "🎓",
      title: "Academic & Custom Research",
      desc: "Primary data collection and methodology support for research.",
      features: ["Thesis Support", "Custom Sampling", "Ethical Standards"],
    },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#061A35] pt-20 pb-20 text-center">
        {/* Tailwind Class Suggestion ঠিক করা হয়েছে: w-200, h-100 */}
        <div className="pointer-events-none absolute top-0 left-1/2 h-100 w-200 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            Our <span className="text-gradient">Services</span>
          </h1>
          <p className="mb-8 text-lg text-gray-400">
            Comprehensive research and data solutions tailored to your needs.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="relative z-20 mx-auto -mt-10 max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <div
              key={i}
              className="group rounded-xl border border-[#E2E8F0] bg-white p-8 transition-all hover:border-cyan-400/50 hover:shadow-xl"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-cyan-50 text-3xl transition-all group-hover:scale-110 group-hover:bg-cyan-100">
                {service.icon}
              </div>
              <h3 className="mb-3 text-xl font-bold text-[#102A43]">
                {service.title}
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-[#64748B]">
                {service.desc}
              </p>

              <ul className="mb-8 space-y-2">
                {service.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-sm text-[#102A43]"
                  >
                    <CheckCircle2 size={16} className="text-cyan-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={`/request?service=${service.title}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-all group-hover:gap-3"
              >
                Request Service <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-[#E2E8F0] bg-white py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-[#102A43]">
            Need a Custom Service?
          </h2>
          {/* Unescaped Entity ঠিক করা হয়েছে: we&apos;ll */}
          <p className="mb-8 text-[#64748B]">
            Tell us your requirement and we&apos;ll design the right research
            solution for you.
          </p>
          <Link
            href="/request"
            className="inline-block rounded-md bg-[#102A43] px-8 py-3 font-semibold text-white transition-all hover:bg-[#1a3c5c]"
          >
            Request a Custom Solution
          </Link>
        </div>
      </section>
    </div>
  )
}
