import { BeforeAfter } from "@/components/ui/BeforeAfter";
import { SHOW_CONTENT_SLOTS, business, gallery } from "@/data/site";

export function Work() {
  const instagram = business.socials.instagram || business.socials.facebook;

  return (
    <section id="work" className="bg-surface py-20 md:py-28">
      <div className="container-page">
        <h2 className="h-section max-w-3xl">Drag the slider. See the difference.</h2>
        <p className="lede mt-5">
          Real jobs from around {business.primaryArea}, photographed before we
          start and after we pack up.
        </p>

        <ul className="mt-12 grid gap-x-6 gap-y-10 md:grid-cols-2">
          {gallery.map((item) => (
            <li key={item.title}>
              <BeforeAfter
                before={item.before}
                after={item.after}
                hint={item.title.toLowerCase()}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="aspect-[3/2] rounded-2xl"
              />
              <p className="mt-4 font-semibold text-ink">
                {item.title}
                {item.location && (
                  <span className="font-normal text-ink-2"> in {item.location}</span>
                )}
              </p>
            </li>
          ))}
        </ul>

        {instagram ? (
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary mt-12"
          >
            See more jobs on social media
          </a>
        ) : (
          SHOW_CONTENT_SLOTS && (
            <p className="mt-12 inline-block rounded-2xl border border-dashed border-line px-4 py-3 text-sm text-ink-2">
              Link to your Instagram or Facebook photos goes here once added in
              data/site.ts.
            </p>
          )
        )}
      </div>
    </section>
  );
}
