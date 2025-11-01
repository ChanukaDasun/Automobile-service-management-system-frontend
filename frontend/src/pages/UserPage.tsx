// src/pages/UserPage.tsx
import { Button } from "@/components/ui/button";

export default function UserPage() {
  return (
    <>
      {/* Hero / Landing Section */}
      <section className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-12 px-6 pb-24 pt-16 md:flex-row md:justify-between md:gap-6">
        {/* Decorative Background */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -left-24 top-1/3 h-80 w-80 rotate-12 rounded-lg bg-gradient-to-br from-blue-600/10 to-cyan-400/10 blur-2xl" />
          <div className="absolute -right-16 bottom-10 h-64 w-64 -rotate-12 rounded-full bg-cyan-500/10 blur-2xl" />
        </div>

        {/* Text Content */}
        <div className="relative z-10 flex max-w-xl flex-col gap-7 text-center md:text-left">
          <div className="relative">
            <span className="absolute -left-2 -top-6 select-none text-7xl font-extrabold uppercase tracking-tighter text-slate-200/60 md:-left-6 md:-top-10 md:text-8xl lg:text-9xl">
              Car
            </span>
            <h1 className="relative text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              Modern{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Service
              </span>{" "}
              Management
            </h1>
          </div>
          <p className="mx-auto max-w-lg text-base leading-relaxed text-slate-600 md:mx-0 md:text-lg">
            Book appointments, monitor real-time progress, and empower your team
            with a streamlined workflow built for automotive excellence.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row md:items-start">
            <Button className="relative inline-flex overflow-hidden rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-8 py-5 text-sm font-semibold uppercase tracking-wider text-white shadow transition hover:from-blue-500 hover:via-blue-500 hover:to-cyan-400">
              Get Started
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-2 border-blue-600/60 bg-white px-8 py-5 text-sm font-semibold uppercase tracking-wider text-blue-600 transition hover:bg-blue-600 hover:text-white"
            >
              Learn More
            </Button>
          </div>

          {/* Stats Row */}
          <div className="mt-6 grid w-full max-w-xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { n: "01", label: "Guaranteed" },
              { n: "02", label: "Timely" },
              { n: "03", label: "Precise" },
              { n: "04", label: "Affordable" },
            ].map((item) => (
              <div
                key={item.n}
                className="group relative flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-white/70 px-3 py-4 text-center shadow-sm backdrop-blur transition hover:border-blue-500 hover:shadow-md"
              >
                <span className="text-xs font-semibold tracking-widest text-blue-600/80">
                  {item.n}
                </span>
                <span className="mt-1 text-[11px] font-bold uppercase tracking-wide text-slate-700 group-hover:text-blue-700">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Car Image */}
        <div className="relative flex w-full items-center justify-center md:w-2/5">
          <div className="relative aspect-[4/3] w-80 max-w-full md:w-96">
            <div className="absolute -left-6 -top-6 h-24 w-24 rounded-md bg-blue-600/70 mix-blend-multiply blur-sm md:-left-10 md:-top-10 md:h-32 md:w-32" />
            <div className="absolute -right-4 bottom-4 h-20 w-20 rounded-md bg-cyan-400/70 mix-blend-multiply blur-sm md:-right-8 md:bottom-6 md:h-28 md:w-28" />
            <img
              src="https://cdn-icons-png.flaticon.com/512/743/743007.png"
              alt="Car Service"
              className="relative z-10 h-full w-full object-contain drop-shadow-2xl"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="mx-auto w-full max-w-7xl px-6 pb-24">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Key Features
          </h2>
          <p className="mt-4 text-slate-600">
            Everything you need to run an effective automotive service workflow—with clarity and confidence.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Book Appointments",
              body:
                "Schedule services instantly with our intuitive booking experience—no phone calls required.",
            },
            {
              title: "Track Progress",
              body:
                "Stay informed in real-time as each maintenance stage is logged and verified.",
            },
            {
              title: "Employee Tools",
              body:
                "Equip staff to update statuses, manage workloads, and deliver faster turnarounds.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="group relative flex flex-col rounded-2xl border border-slate-200/80 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-blue-500/60 hover:shadow-lg"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-md ring-1 ring-blue-500/30">
                <span className="text-sm font-bold">★</span>
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {card.body}
              </p>
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-2 ring-blue-500/30 transition group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
