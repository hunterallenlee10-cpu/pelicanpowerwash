import { MapPin } from "lucide-react";
import { business, phoneHref, serviceTowns } from "@/data/site";
import { ServiceAreaMap } from "./ServiceAreaMap";

export function ServiceArea() {
  return (
    <section id="service-areas" className="py-20 md:py-28">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div className="order-2 lg:order-1">
          <h2 className="h-section">Based in {business.primaryArea}.</h2>
          <p className="lede mt-5">
            We work all over {business.primaryArea} and regularly head into
            Calvert and Charles counties.
          </p>

          <div className="mt-10 space-y-8">
            {serviceTowns.map((group) => (
              <div key={group.county}>
                <h3 className="flex items-center gap-2 font-bold text-ink">
                  <MapPin
                    className={`h-4 w-4 ${group.primary ? "text-accent-text" : "text-ink-2"}`}
                    aria-hidden
                  />
                  {group.county}
                  {group.primary && (
                    <span className="text-sm font-medium text-ink-2">Home base</span>
                  )}
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {group.towns.map((town) => (
                    <li
                      key={town}
                      className={`rounded-full px-3.5 py-1.5 text-sm font-medium ${
                        group.primary
                          ? "bg-accent-soft text-accent-text"
                          : "border border-line text-ink-2"
                      }`}
                    >
                      {town}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-10 text-ink-2">
            Not on the list?{" "}
            <a href={phoneHref} className="font-semibold text-accent-text underline underline-offset-4">
              Call or text {business.phone.display}
            </a>{" "}
            and ask. We can often make it work.
          </p>
        </div>

        <div className="order-1 rounded-2xl border border-line bg-surface p-4 sm:p-6 lg:order-2">
          <ServiceAreaMap />
        </div>
      </div>
    </section>
  );
}
