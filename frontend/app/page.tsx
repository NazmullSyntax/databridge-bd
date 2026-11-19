import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, ShieldCheck, Map, Database } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-cyan-200">
      
      {/* 1. Navbar (ডার্ক নেভি) */}
      <header className="absolute top-0 w-full z-50 text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            DataBridge<span className="text-cyan-400">BD</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-300">
            <Link href="/" className="text-white">Home</Link>
            <Link href="/services" className="hover:text-white transition">Services</Link>
            <Link href="/solutions" className="hover:text-white transition">Solutions</Link>
            <Link href="/how-it-works" className="hover:text-white transition">How It Works</Link>
            <Link href="/portfolio" className="hover:text-white transition">Portfolio</Link>
            <Link href="/about" className="hover:text-white transition">About</Link>
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-white transition">Login</Link>
            <Link href="/request" className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm px-5 py-2.5 rounded-md transition-all glow-effect">
              Tell Us What You Need
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section (গ্লোয়িং ম্যাপ ও গ্লাস কার্ড) */}
      <section className="relative bg-[#061A35] pt-32 pb-24 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        
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
                  <div className="hidden lg:block absolute top-10 left-[60%] w-full h-[2px] bg-[#E2E8F0]">
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

      {/* 7. Footer */}
      <footer className="bg-[#0B2548] text-white py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <Link href="/" className="text-2xl font-bold mb-4 block">
              DataBridge<span className="text-cyan-400">BD</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Managed data collection, research, and analytics services for a data-driven Bangladesh.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/services/field" className="hover:text-cyan-400">Field Data Collection</Link></li>
              <li><Link href="/services/market" className="hover:text-cyan-400">Market Research</Link></li>
              <li><Link href="/services/survey" className="hover:text-cyan-400">Survey & Questionnaire</Link></li>
              <li><Link href="/services/data" className="hover:text-cyan-400">Data Analysis</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-cyan-400">About Us</Link></li>
              <li><Link href="/how-it-works" className="hover:text-cyan-400">How It Works</Link></li>
              <li><Link href="/portfolio" className="hover:text-cyan-400">Portfolio</Link></li>
              <li><Link href="/contact" className="hover:text-cyan-400">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/privacy" className="hover:text-cyan-400">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-cyan-400">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/10 text-center text-sm text-gray-500">
          © 2026 DataBridge BD. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
