import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export default function PortfolioPage() {
  const projects = [
    {
      title: "Market Demand Research",
      category: "Market Research",
      desc: "A comprehensive study on the demand for electric vehicles in Dhaka city.",
      image:
        "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=2072&auto=format&fit=crop",
      tags: ["Survey", "Data Analysis", "Power BI"],
    },
    {
      title: "NGO Beneficiary Assessment",
      category: "Field Data Collection",
      desc: "Baseline survey for a rural development project in Sylhet division.",
      image:
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop",
      tags: ["Field Survey", "Data Cleaning"],
    },
    {
      title: "Startup Customer Discovery",
      category: "Business Research",
      desc: "Customer interviews and feedback collection for a new SaaS platform.",
      image:
        "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2070&auto=format&fit=crop",
      tags: ["Interviews", "Product Research"],
    },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#061A35] pt-32 pb-20 text-center">
        <div className="pointer-events-none absolute top-0 left-1/2 h-100 w-200 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            Our <span className="text-gradient">Portfolio</span>
          </h1>
          <p className="text-lg text-gray-400">
            Explore our recent research projects and data collection case
            studies.
          </p>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="relative z-20 mx-auto -mt-10 max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <div
              key={i}
              className="group overflow-hidden rounded-xl border border-[#E2E8F0] bg-white transition-all hover:shadow-xl"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#102A43] backdrop-blur-sm">
                  {project.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-[#102A43]">
                  {project.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-[#64748B]">
                  {project.desc}
                </p>
                <div className="mb-6 flex flex-wrap gap-2">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href="#"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-all group-hover:gap-3"
                >
                  View Case Study <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#E2E8F0] bg-white py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-[#102A43]">
            Want to see your project here?
          </h2>
          <p className="mb-8 text-[#64748B]">
            Let us help you gather the insights you need to grow.
          </p>
          <Link
            href="/request"
            className="inline-block rounded-md bg-[#102A43] px-8 py-3 font-semibold text-white transition-all hover:bg-[#1a3c5c]"
          >
            Start a Project
          </Link>
        </div>
      </section>
    </div>
  )
}
