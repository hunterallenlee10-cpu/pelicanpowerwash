import { ShieldCheck } from "lucide-react";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { SHOW_CONTENT_SLOTS, aboutPhoto, business, stats } from "@/data/site";

export function About() {
  const credentials = [
    business.insured && "Fully insured",
    business.licenseNumber && `Licensed, #${business.licenseNumber}`,
    business.foundedYear && `Serving ${business.region} since ${business.foundedYear}`,
  ].filter(Boolean) as string[];

  return (
    <section id="about" className="py-20 md:py-28">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <figure>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <PhotoSlot
              photo={aboutPhoto}
              hint="You or your crew with the rig. Portrait, faces visible."
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
          {business.ownerName && (
            <figcaption className="mt-3 text-sm text-ink-2">
              {business.ownerName}, owner
            </figcaption>
          )}
        </figure>

        <div>
          <h2 className="h-section">Born and raised in Southern Maryland.</h2>
          <div className="mt-6 max-w-[60ch] space-y-4 text-lg leading-relaxed text-ink-2">
            <p>
              A pelican swoops in when it is needed. That is the idea behind the
              name, and it is how we run the business: show up on time, do the
              job right and treat every property like our own.
            </p>
            <p>
              We are a local crew serving {business.primaryArea} and the
              surrounding counties. Hiring us means your money stays with
              neighbors who care how the community looks.
            </p>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-line pt-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="font-display block text-3xl text-ink sm:text-4xl">
                    {stat.value}
                  </span>
                  <span className="mt-1 block text-sm leading-snug text-ink-2">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          {credentials.length > 0 ? (
            <ul className="mt-8 flex flex-wrap gap-3">
              {credentials.map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-4 py-2 text-sm font-semibold text-accent-text"
                >
                  <ShieldCheck className="h-4 w-4" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            SHOW_CONTENT_SLOTS && (
              <p className="mt-8 rounded-2xl border border-dashed border-line px-4 py-3 text-sm text-ink-2">
                Credential badges go here: insured, license number, year
                founded, owner name. Fill them in under business in data/site.ts.
              </p>
            )
          )}
        </div>
      </div>
    </section>
  );
}
