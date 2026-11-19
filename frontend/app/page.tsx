import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-yellow-200">
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-2xl font-bold tracking-tighter">
            DataBridge<span className="font-light">BD</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-gray-700 lg:flex">
            <Link
              href="/services"
              className="transition-colors hover:text-black"
            >
              Expertise
            </Link>
            <Link
              href="/portfolio"
              className="transition-colors hover:text-black"
            >
              Work
            </Link>
            <Link
              href="/partners"
              className="transition-colors hover:text-black"
            >
              Partners
            </Link>
            <Link href="/blog" className="transition-colors hover:text-black">
              Ideas
            </Link>
            <Link href="/about" className="transition-colors hover:text-black">
              About
            </Link>
          </nav>

          <Link
            href="/contact"
            className="rounded-md bg-[#F5B041] px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-[#E59A2F]"
          >
            Get in Touch
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pt-24 pb-16">
        <div className="mb-16 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <h1 className="max-w-4xl text-5xl leading-[1.05] font-bold tracking-tight md:text-6xl lg:text-[5.5rem]">
            Transform your organization{" "}
            <br className="hidden md:block" />
            through the power of data
          </h1>

          <Link
            href="/services"
            className="group mb-4 flex items-center gap-2 text-sm font-bold tracking-wider uppercase transition-colors hover:text-gray-600 lg:mb-8"
          >
            HOW WE CAN HELP YOU
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        <div className="relative mx-auto w-full max-w-5xl">
          <div className="absolute -inset-4 rounded-sm border-[12px] border-[#1A1A1A]">
            <div className="absolute -top-6 left-0 flex w-full justify-between px-4">
              {Array.from({ length: 20 }, (_, index) => (
                <div
                  key={index}
                  className="h-1.5 w-1.5 rounded-full bg-[#F5B041]"
                />
              ))}
            </div>
          </div>

          <div className="relative grid grid-cols-2 gap-2 bg-[#1A1A1A] p-2 md:grid-cols-4">
            {[
              {
                src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
                alt: "Data Analytics",
              },
              {
                src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
                alt: "Team Meeting",
              },
              {
                src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2070&auto=format&fit=crop",
                alt: "Research",
              },
              {
                src: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2076&auto=format&fit=crop",
                alt: "Office",
              },
            ].map((image) => (
              <div
                key={image.src}
                className="relative aspect-square overflow-hidden md:h-64 md:aspect-auto"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      <section className="mt-24 border-t border-gray-100 bg-gray-50 py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 md:grid-cols-3">
          <div>
            <h2 className="mb-2 text-xl font-bold">Data Quality Assurance</h2>
            <p className="text-sm leading-relaxed text-gray-600">
              Rigorous verification processes ensure your datasets are accurate
              and reliable.
            </p>
          </div>
          <div>
            <h2 className="mb-2 text-xl font-bold">Secure Data Handling</h2>
            <p className="text-sm leading-relaxed text-gray-600">
              Your data is protected with enterprise-grade security and strict
              privacy policies.
            </p>
          </div>
          <div>
            <h2 className="mb-2 text-xl font-bold">
              Professional Research Team
            </h2>
            <p className="text-sm leading-relaxed text-gray-600">
              Access a dedicated team of field researchers and data analysts.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
