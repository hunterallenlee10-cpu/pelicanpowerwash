import { surfaces } from "@/data/surfaces";
import { MethodGaugeClient } from "./MethodGaugeClient";

/**
 * "The right method for every surface." Pick a surface, the gauge swings to
 * the pressure we use on it. Heading and copy are server-rendered; only the
 * chips, gauge and card are interactive.
 */
export function MethodGauge() {
  return (
    <section id="methods" className="py-20 md:py-28">
      <div className="container-page">
        <MethodGaugeClient
          surfaces={surfaces}
          intro={
            <>
              <p className="eyebrow">Pressure is a tool, not a setting</p>
              <h2 className="h-section mt-4 max-w-xl">The right method for every surface.</h2>
              <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-ink-2">
                Most "pressure washing" damage comes from one setting used on everything. Tap a
                surface to see what we use on it.
              </p>
            </>
          }
        />
      </div>
    </section>
  );
}
