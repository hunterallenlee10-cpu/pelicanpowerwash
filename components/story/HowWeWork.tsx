import { ArrowRight, Droplets, Gauge, Leaf, RotateCcw } from "lucide-react";
import { business, smsHref } from "@/data/site";

/** Every claim here is already on the site (services, FAQ, guarantees). */
const steps = [
  {
    icon: Droplets,
    title: "Pre-treat first",
    body: "Algae and mildew get killed by the cleaning solution before any rinse, so we lift growth instead of blasting it.",
  },
  {
    icon: Gauge,
    title: "The right pressure for the surface",
    body: "Siding, roofs and wood get a low-pressure soft wash. A surface cleaner and real pressure are kept for concrete.",
  },
  {
    icon: Leaf,
    title: "Plants and pets protected",
    body: "Plant and pet-safe solutions, and we rinse and protect your landscaping as we work.",
  },
  {
    icon: RotateCcw,
    title: "Free touch-ups",
    body: "Missed a spot? We come back and fix it free.",
  },
];

export function HowWeWork() {
  return (
    <section id="how-we-work" className="py-20 md:py-28">
      <div className="container-page">
        <p className="eyebrow">How we work</p>
        <h2 className="h-section mt-4 max-w-2xl">Clean without the damage.</h2>
        <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-ink-2">
          No stripped paint, no etched driveways, no surprises on the bill. Here is what every Pelican job
          gets.
        </p>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.title} className="rounded-2xl border border-line bg-surface p-6">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent-text">
                  <step.icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="label-mono text-ink-2" aria-hidden>
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-ink">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-2">{step.body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a href="#instant-price" className="btn btn-primary">
            Get my price
            <ArrowRight className="h-5 w-5" aria-hidden />
          </a>
          <a
            href={smsHref}
            className="inline-flex min-h-12 items-center px-2 font-semibold text-ink-2 underline underline-offset-4 hover:text-ink"
          >
            Or text {business.phone.display}
          </a>
        </div>
      </div>
    </section>
  );
}
