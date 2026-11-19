import Link from "next/link"
import {
  ArrowRight,
  Building2,
  HeartHandshake,
  GraduationCap,
  Rocket,
} from "lucide-react"

export default function SolutionsPage() {
  const solutions = [
    {
      icon: <Building2 size={32} className="text-blue-600" />,
      title: "Businesses",
      desc: "Make better business decisions with reliable market and customer data.",
      link: "/solutions/business",
      color: "bg-blue-50",
    },
    {
      icon: <HeartHandshake size={32} className="text-teal-600" />,
      title: "NGOs & Organizations",
      desc: "Strengthen your projects with trusted field research and M&E data.",
      link: "/solutions/ngo",
      color: "bg-teal-50",
    },
    {
      icon: <GraduationCap size={32} className="text-purple-600" />,
      title: "Researchers & Students",
      desc: "Get practical research data support for your academic projects.",
      link: "/solutions/researchers",
      color: "bg-purple-50",
    },
    {
      icon: <Rocket size={32} className="text-orange-600" />,
      title: "Startups & Entrepreneurs",
      desc: "Understand your market before investing in your next big idea.",
      link: "/solutions/startups",
      color: "bg-orange-50",
    },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <section className="relative overflow-hidden bg-[#061A35] pt-20 pb-20">
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            Tailored Solutions for{" "}
            <span className="text-gradient">Every Customer</span>
          </h1>
          <p className="text-lg text-gray-400">
            Choose your audience and find the right research solutions.
          </p>
        </div>
      </section>

      <section className="relative z-20 mx-auto -mt-10 max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {solutions.map((item, i) => (
            <div
              key={i}
              className="group rounded-xl border border-[#E2E8F0] bg-white p-10 transition-all hover:shadow-xl"
            >
              <div
                className={`h-16 w-16 ${item.color} mb-6 flex items-center justify-center rounded-2xl`}
              >
                {item.icon}
              </div>
              <h2 className="mb-4 text-2xl font-bold text-[#102A43]">
                {item.title}
              </h2>
              <p className="mb-8 leading-relaxed text-[#64748B]">{item.desc}</p>
              <Link
                href={item.link}
                className="inline-flex items-center gap-2 font-semibold text-[#102A43] transition-colors group-hover:text-blue-600"
              >
                Explore Solutions{" "}
                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
