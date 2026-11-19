import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Map, Database } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-cyan-200">
      
      {/* 
        এখানে আগের Header টি মুছে ফেলা হয়েছে, 
        কারণ এটি এখন layout.tsx থেকে গ্লোবালি আসছে।
      */}

      {/* 1. Hero Section (গ্লোয়িং ম্যাপ ও গ্লাস কার্ড) */}
      <section className="relative bg-[#061A35] pt-20 pb-24 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-6">
              Need Data? <br />
              <span className="text-gradient">We'll Help You Get It.</span>
            </h1>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl leading-relaxed">
              From field data collection to market research and data analytics, DataBridge BD helps businesses, organizations, and researchers get the information they need to make better decisions.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/request" className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-8 py-3.5 rounded-md transition-all flex items-center gap-2">
                Tell Us What You Need <ArrowRight size={18} />
              </Link>
              <Link href="/contact" className="glass-card hover:bg-white/10 text-white font-medium px-8 py-3.5 rounded-md transition-all">
                Book a Consultation
              </Link>
            </div>
          </div>

          {/* 3. Customer Category Cards (গ্লাস কার্ড) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-20">
            {[
              { icon: "💼", title: "Businesses", desc: "Make better decisions with reliable data." },
              { icon: "🤝", title: "NGOs & Organizations", desc: "Strengthen your projects with trusted research." },
              { icon: "🎓", title: "Researchers & Students", desc: "Get research data support." },
              { icon: "🚀", title: "Startups & Entrepreneurs", desc: "Understand your market." },
            ].map((item, i) => (
              <div key={i} className="glass-card p-6 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Our Services (লাইট সেকশন) */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#102A43] mb-4">Our Services</h2>
            <p className="text-[#64748B] max-w-2xl mx-auto">
              Comprehensive research and data solutions tailored to your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🏢", title: "Field Data Collection", desc: "Household surveys, face-to-face interviews, and community research." },
              { icon: "📊", title: "Market & Business Research", desc: "Competitor analysis, customer research, and market assessment." },
              { icon: "📝", title: "Survey & Questionnaire", desc: "Design and execution of structured data collection." },
              { icon: "🧹", title: "Data Cleaning & Verification", desc: "Identify missing values, duplicates, and ensure data quality." },
              { icon: "📈", title: "Data Analysis & Visualization", desc: "Statistical analysis, charts, and actionable business insights." },
              { icon: "🎓", title: "Academic & Custom Research", desc: "Primary data collection and methodology support for research." },
            ].map((service, i) => (
              <div key={i} className="bg-white p-8 rounded-xl border border-[#E2E8F0] hover:shadow-lg hover:border-cyan-400/50 transition-all group">
                <div className="w-12 h-12 bg-cyan-50 rounded-lg flex items-center justify-center text-2xl mb-6 group-hover:bg-cyan-100 transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold text-[#102A43] mb-2">{service.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed mb-4">{service.desc}</p>
                <Link href={`/services`} className="text-sm font-semibold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn more <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. How It Works */}
      <section className="py-24 bg-white border-y border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#102A43] mb-4">How It Works</h2>
            <p className="text-[#64748B]">A simple process to get the data you need.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              "Tell Us What You Need",
              "Discuss Your Requirements",
              "Get a Proposal",
              "We Collect Data",
              "We Verify & Analyze",
              "Receive Results"
            ].map((step, i) => (
              <div key={i} className="relative text-center p-4">
                <div className="w-12 h-12 bg-[#102A43] text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  {i + 1}
                </div>
                <p className="text-sm font-semibold text-[#102A43]">{step}</p>
                {i < 5 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-full h-0.5 bg-[#E2E8F0]">
                    <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 text-[#E2E8F0]" size={16} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Trust & CTA Section */}
      <section className="py-24 bg-[#061A35] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop')] opacity-5 bg-cover bg-center" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Your Trusted Research Partner in Bangladesh</h2>
              <p className="text-gray-400 mb-8 text-lg">
                We combine local expertise with rigorous data collection methodologies to deliver insights you can rely on.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Data Quality Assurance",
                  "Secure Data Handling",
                  "Professional Research Team",
                  "Transparent Project Tracking"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white">
                    <CheckCircle2 className="text-cyan-400" size={20} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="inline-block bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-8 py-3 rounded-md transition-all">
                Have a Data Requirement?
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-6 rounded-xl">
                <ShieldCheck className="text-cyan-400 mb-4" size={32} />
                <h4 className="text-white font-semibold mb-2">100% Secure</h4>
                <p className="text-sm text-gray-400">Your data and privacy are our top priority.</p>
              </div>
              <div className="glass-card p-6 rounded-xl mt-8">
                <Map className="text-cyan-400 mb-4" size={32} />
                <h4 className="text-white font-semibold mb-2">Nationwide Coverage</h4>
                <p className="text-sm text-gray-400">Custom field research across Bangladesh.</p>
              </div>
              <div className="glass-card p-6 rounded-xl">
                <Database className="text-cyan-400 mb-4" size={32} />
                <h4 className="text-white font-semibold mb-2">Verified Data</h4>
                <p className="text-sm text-gray-400">Every data point is thoroughly checked.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}
