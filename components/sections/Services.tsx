"use client";

import { useRef, useState } from "react";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { serviceCategories } from "@/data/site";

export function Services() {
  const [active, setActive] = useState(serviceCategories[0].id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onTabKey = (event: React.KeyboardEvent, index: number) => {
    const last = serviceCategories.length - 1;
    const next =
      event.key === "ArrowRight"
        ? index === last ? 0 : index + 1
        : event.key === "ArrowLeft"
          ? index === 0 ? last : index - 1
          : null;
    if (next === null) return;
    event.preventDefault();
    setActive(serviceCategories[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="services" className="py-20 md:py-28">
      <div className="container-page">
        <h2 className="h-section max-w-3xl">
          The right method for every surface.
        </h2>
        <p className="lede mt-5">
          Soft wash for siding, roofs and wood. Pressure for concrete. You get a
          clean result without stripped paint or etched driveways.
        </p>

        <div
          role="tablist"
          aria-label="Service categories"
          className="mt-10 flex gap-2 overflow-x-auto pb-1"
        >
          {serviceCategories.map((category, index) => {
            const selected = category.id === active;
            return (
              <button
                key={category.id}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                role="tab"
                id={`tab-${category.id}`}
                aria-selected={selected}
                aria-controls={`panel-${category.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(category.id)}
                onKeyDown={(event) => onTabKey(event, index)}
                className={`shrink-0 rounded-full px-5 py-2.5 text-[0.95rem] font-semibold transition-colors ${
                  selected
                    ? "bg-ink text-canvas"
                    : "border border-line bg-surface text-ink-2 hover:text-ink"
                }`}
              >
                {category.name}
                <span className={`ml-2 text-sm ${selected ? "opacity-70" : "opacity-60"}`}>
                  {category.services.length}
                </span>
              </button>
            );
          })}
        </div>

        {serviceCategories.map((category) => (
          <div
            key={category.id}
            role="tabpanel"
            id={`panel-${category.id}`}
            aria-labelledby={`tab-${category.id}`}
            hidden={category.id !== active}
            className="mt-8 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14"
          >
            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-[4/5]">
                <PhotoSlot
                  photo={category.photo}
                  hint={`${category.name} job photo`}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
              </div>
              <p className="mt-4 text-ink-2">{category.summary}</p>
            </div>

            <ul className="grid gap-x-10 sm:grid-cols-2">
              {category.services.map((service) => (
                <li key={service.name} className="border-t border-line py-6">
                  <h3 className="text-lg font-bold text-ink">{service.name}</h3>
                  <p className="mt-2 leading-relaxed text-ink-2">
                    {service.description}
                  </p>
                  <p className="mt-3 text-sm font-medium text-accent-text">
                    {service.method}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <p className="mt-10 text-ink-2">
          Need something not listed?{" "}
          <a href="#quote-form" className="font-semibold text-accent-text underline underline-offset-4">
            Describe it in a quote request
          </a>{" "}
          and we will tell you if we can do it.
        </p>
      </div>
    </section>
  );
}
