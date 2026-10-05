import { CalendarCheck, ClipboardList, FileText, MessageSquare } from "lucide-react";
import { business } from "@/data/site";

const steps = [
  {
    icon: ClipboardList,
    title: "Send us the details",
    body: "Use the form, call or text. A couple of photos help us quote faster.",
  },
  {
    icon: MessageSquare,
    title: `Hear back within ${business.responseTime}`,
    body: "We confirm what you need and answer questions the way you prefer to be contacted.",
  },
  {
    icon: FileText,
    title: "Get a written quote",
    body: "Larger or unusual jobs get a quick on-site look first so the price is right.",
  },
  {
    icon: CalendarCheck,
    title: "We clean, you check",
    body: "Usually within 12 to 48 hours of approval. Missed a spot? We come back and fix it free.",
  },
];

export function Process() {
  return (
    <section id="process" className="border-y border-line bg-surface-2/60 py-20 md:py-24">
      <div className="container-page">
        <h2 className="h-section max-w-2xl">From first text to clean driveway.</h2>

        <ol className="relative mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Connecting line behind the icons on wide screens */}
          <span
            aria-hidden
            className="absolute top-6 right-[calc((100%-6rem)/4-24px)] left-6 hidden h-px bg-line lg:block"
          />
          {steps.map((step) => (
            <li key={step.title} className="relative">
              <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-line bg-surface text-accent-text">
                <step.icon className="h-5 w-5" strokeWidth={2} aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-bold text-ink">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-2">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
