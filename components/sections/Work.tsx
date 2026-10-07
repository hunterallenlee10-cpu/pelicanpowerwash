import { BeforeAfter } from "@/components/ui/BeforeAfter";
import { business, gallery } from "@/data/site";

export function Work() {
  const instagram = business.socials.instagram || business.socials.facebook;

  return (
    <section id="work" className="bg-surface py-20 md:py-28">
      <div className="container-page">
        <h2 className="h-section max-w-3xl">Drag the slider. See the difference.</h2>
        <p className="lede mt-5">
          What a proper wash does for siding, concrete, decks and fences. These
          sample jobs come from other pressure washing crews.
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

        {instagram && (
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary mt-12"
          >
            See more jobs on social media
          </a>
        )}
      </div>
    </section>
  );
}
