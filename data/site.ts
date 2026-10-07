/**
 * Every piece of business content on the site lives in this file: contact
 * details, services, prices, photos, reviews, FAQ. Edit here, not in the
 * components.
 *
 * Photos: drop image files into `public/photos/` and put the path (for example
 * "/photos/driveway-before.jpg") in the matching `src` field below. Any photo
 * left as "" renders a placeholder frame sized for that spot.
 *
 * Fields marked TODO are slots for information the old site never had. Fill
 * them in or leave them empty; empty slots never show broken content.
 */

/**
 * While true, empty slots (photos, reviews, social links, credentials) render
 * a labelled placeholder saying what belongs there. Set to false to hide the
 * labels: empty photo frames then show the logo instead, and empty review and
 * social slots disappear.
 */
export const SHOW_CONTENT_SLOTS = true;

export const business = {
  name: "Pelican Power Wash",
  url: "https://pelicanpowerwash.vercel.app",
  phone: { display: "(240) 925-2609", e164: "+12409252609" },
  email: "ceo@leeenterprisesunlimited.com",
  parentCompany: "Lee Enterprises Unlimited",
  responseTime: "24 hours",
  /** Non-breaking space keeps "St. Mary's" together on one line. */
  primaryArea: "St.\u00a0Mary's County",
  region: "Southern Maryland",

  /** TODO: e.g. "Mon-Sat, 7am-7pm". Leave null to show "Call or text any time". */
  hours: null as string | null,
  /** TODO: owner's name, shown under the story and on the owner photo. */
  ownerName: null as string | null,
  /** TODO: e.g. 2021. Shown as "Serving Southern Maryland since ...". */
  foundedYear: null as number | null,
  /** TODO: only set true once a current liability policy is in place. */
  insured: null as boolean | null,
  /** TODO: Maryland business or contractor license number, if any. */
  licenseNumber: null as string | null,

  /** TODO: your Google Business Profile rating. Shown in the trust bar. */
  googleRating: null as { rating: number; count: number } | null,
  /** TODO: link where customers can read your Google reviews. */
  reviewsUrl: "",
  /** TODO: the "write a review" link from your Google Business Profile. */
  leaveReviewUrl: "",

  /** TODO: full profile URLs. Empty ones are hidden. */
  socials: {
    facebook: "",
    instagram: "",
    nextdoor: "",
    google: "",
  },
};

export const phoneHref = `tel:${business.phone.e164}`;
export const smsHref = `sms:${business.phone.e164}`;
export const emailHref = `mailto:${business.email}`;

/** Owner-supplied figures from the previous site. Confirm they still hold. */
export const stats = [
  { value: "10+", label: "years of combined experience" },
  { value: "500+", label: "properties cleaned" },
  { value: "24 hr", label: "reply to every request" },
];

export type Photo = { src: string; alt: string };

/**
 * The hero image. Shows `photo` until both halves of a before and after pair
 * are filled in below, then switches to the drag-to-compare slider.
 */
export const heroPhoto: Photo = {
  src: "/photos/hero-house.webp",
  alt: "A grey shingle home with a white wraparound porch and a clean front walk",
};

/** The before and after pair in the hero slider. Use your best job. */
export const heroPhotos = {
  before: {
    src: "",
    alt: "Vinyl siding covered in green algae before washing",
  },
  after: {
    src: "",
    alt: "The same siding clean and bright after a soft wash",
  },
  caption: "", // TODO: e.g. "Soft wash on vinyl siding in Leonardtown"
};

/**
 * The pelican is a stand-in. Swap in a photo of the owner or crew with the rig
 * (portrait orientation) when you have one; it builds more trust.
 */
export const aboutPhoto: Photo = {
  src: "/photos/about-pelican.webp",
  alt: "A brown pelican perched on a wooden dock piling",
};

export type ServiceItem = {
  name: string;
  description: string;
  method: string;
};

export type ServiceCategory = {
  id: string;
  name: string;
  summary: string;
  photo: Photo;
  services: ServiceItem[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: "residential",
    name: "Residential",
    summary:
      "Siding, concrete, decks and fences for homes across St. Mary's County.",
    photo: {
      src: "/photos/service-residential.webp",
      alt: "Pressure washing the grey siding of a two-story home",
    },
    services: [
      {
        name: "House wash",
        description:
          "Low-pressure soft wash that lifts dirt, algae and mildew off siding without damaging it.",
        method: "Soft wash with pretreatment",
      },
      {
        name: "Driveway cleaning",
        description:
          "Oil spots, tire marks and years of grime lifted out of concrete driveways.",
        method: "Surface cleaner and pressure wash",
      },
      {
        name: "Concrete, sidewalks and walkways",
        description:
          "Even, streak-free cleaning for walks and slabs, including slippery algae growth.",
        method: "Surface cleaner and pressure wash",
      },
      {
        name: "Patios and pavers",
        description:
          "Stains and weathering removed from pavers, stone and concrete patios.",
        method: "Surface cleaner with paver-safe pressure",
      },
      {
        name: "Deck cleaning",
        description:
          "Dirt, algae and failing finish removed while keeping the wood intact.",
        method: "Soft wash with wood-safe cleaners",
      },
      {
        name: "Fence cleaning",
        description: "Vinyl, wood and metal fences brought back to their color.",
        method: "Soft wash",
      },
      {
        name: "Whole exterior package",
        description:
          "House wash, driveway and patio in one visit for a complete refresh.",
        method: "Soft wash and pressure wash",
      },
      {
        name: "Trash can cleaning",
        description: "Cans washed and deodorized so they stop drawing pests.",
        method: "Pressure wash and sanitizer",
      },
    ],
  },
  {
    id: "commercial",
    name: "Commercial",
    summary:
      "Storefronts, lots and fleets kept presentable for customers and inspectors.",
    photo: {
      src: "/photos/service-commercial.webp",
      alt: "Pressure washing the stone steps outside a public building",
    },
    services: [
      {
        name: "Storefronts and entrances",
        description:
          "Walls, windows and entryways cleaned so the first impression is a good one.",
        method: "Pressure wash with window-safe technique",
      },
      {
        name: "Parking lots",
        description: "Oil, dirt and debris removed from asphalt and concrete lots.",
        method: "Surface cleaner and pressure wash",
      },
      {
        name: "Dumpster pads",
        description:
          "Waste areas cleaned and sanitized to keep odors and pests down.",
        method: "Pressure wash and sanitizer",
      },
      {
        name: "Fleet washing",
        description: "Trucks, vans and work vehicles washed on site.",
        method: "Fleet wash system",
      },
      {
        name: "Post-construction cleanup",
        description:
          "Dust, mud and construction residue cleared before handover.",
        method: "Pressure wash",
      },
    ],
  },
  {
    id: "specialty",
    name: "Specialty",
    summary:
      "Roofs, gutters, stains and delicate surfaces that need the right method.",
    photo: {
      src: "/photos/service-specialty.webp",
      alt: "Flushing out a gutter along an asphalt shingle roof",
    },
    services: [
      {
        name: "Roof cleaning",
        description: "Algae streaks and moss removed with a roof-safe soft wash.",
        method: "Soft wash",
      },
      {
        name: "Gutter cleaning",
        description:
          "Gutters cleared and faces brightened so water drains where it should.",
        method: "Hand cleaning and wash",
      },
      {
        name: "Pool decks",
        description: "Pool surrounds cleaned without harming equipment or finishes.",
        method: "Surface cleaner, pool-safe cleaners",
      },
      {
        name: "Paver cleaning and sealing",
        description: "Deep clean with optional sealing to protect against stains.",
        method: "Surface clean and sealant",
      },
      {
        name: "Brick and stone",
        description: "Masonry cleaned with controlled pressure to protect mortar.",
        method: "Soft wash, adjusted pressure",
      },
      {
        name: "Stucco and painted surfaces",
        description: "Dirt removed without lifting paint or scarring stucco.",
        method: "Soft wash",
      },
      {
        name: "Rust and oil stains",
        description: "Targeted treatment for stains a plain wash leaves behind.",
        method: "Stain-specific treatment",
      },
      {
        name: "Graffiti removal",
        description: "Paint removed from walls and fences while protecting the surface.",
        method: "Graffiti remover, controlled pressure",
      },
      {
        name: "Equipment and machinery",
        description: "Grease and buildup washed off working equipment.",
        method: "Degreaser and pressure wash",
      },
    ],
  },
];

/** The checkboxes on the quote form. */
export const quoteServiceOptions = [
  "House wash",
  "Driveway & concrete",
  "Patio, deck or fence",
  "Roof cleaning",
  "Gutter cleaning",
  "Trash can cleaning",
  "Commercial property",
  "Something else",
];

export type GalleryItem = {
  title: string;
  location: string;
  before: Photo;
  after: Photo;
};

/**
 * Before and after pairs for "Our work". Same framing in both shots works best.
 *
 * These are Creative Commons photos from other pressure washing crews, used as
 * stand-ins until you have your own. Sources are in public/photos/README.md.
 */
export const gallery: GalleryItem[] = [
  {
    title: "Vinyl siding house wash",
    location: "",
    before: {
      src: "/photos/gallery-siding-before.webp",
      alt: "Grey vinyl siding streaked with green algae and mildew",
    },
    after: {
      src: "/photos/gallery-siding-after.webp",
      alt: "The same vinyl siding clean and even after a low pressure wash",
    },
  },
  {
    title: "Concrete walkway",
    location: "",
    before: {
      src: "/photos/gallery-walkway-before.webp",
      alt: "A concrete walkway darkened with dirt and blotchy stains",
    },
    after: {
      src: "/photos/gallery-walkway-after.webp",
      alt: "The same walkway bright and uniform after pressure washing",
    },
  },
  {
    title: "Wood deck",
    location: "",
    before: {
      src: "/photos/gallery-deck-before.webp",
      alt: "A weathered grey wooden deck and railing",
    },
    after: {
      src: "/photos/gallery-deck-after.webp",
      alt: "The same deck with its warm wood color restored after washing",
    },
  },
  {
    title: "Vinyl privacy fence",
    location: "",
    before: {
      src: "/photos/gallery-fence-before.webp",
      alt: "A white vinyl privacy fence stained with grime and mildew",
    },
    after: {
      src: "/photos/gallery-fence-after.webp",
      alt: "The same fence bright white after a wash",
    },
  },
];

export type PriceItem = {
  name: string;
  detail: string;
  price: string;
  /** Second price line, e.g. multiple trash cans. */
  options?: { label: string; price: string }[];
  popular?: boolean;
};

export const pricing: PriceItem[] = [
  {
    name: "Total front of house",
    detail: "House wash, front concrete and patio",
    price: "$349",
    popular: true,
  },
  {
    name: "House concrete",
    detail: "Front, back and stairs",
    price: "$275",
  },
  {
    name: "Front concrete only",
    detail: "Driveway and front patio",
    price: "$149",
  },
  {
    name: "Basement walkout stairs",
    detail: "Add-on to any other service",
    price: "$149",
  },
  {
    name: "Trash can cleaning",
    detail: "Washed and deodorized",
    price: "$20",
    options: [
      { label: "1 can", price: "$20" },
      { label: "2 cans", price: "$30" },
    ],
  },
  {
    name: "Full exterior",
    detail: "Whole home, every surface",
    price: "Free quote",
  },
  {
    name: "Commercial",
    detail: "Storefronts, lots, fleets and more",
    price: "Free quote",
  },
];

export const paymentMethods = [
  "Cash",
  "Check",
  "Venmo",
  "Zelle",
  "Cash App",
  "Apple Pay",
  "Card (Stripe)",
  "Crypto",
];

export const discounts = [
  { label: "Military", value: "10% off" },
  { label: "Seniors 65+", value: "10% off" },
];

export const pricingPolicies = [
  "Taxes are included in every price.",
  "Quotes never expire.",
  "Payment is due at booking.",
];

export const guarantees = [
  "Free written quotes",
  `Reply within ${business.responseTime}`,
  "Locally owned",
  "Free touch-ups if we miss a spot",
];

export type Review = {
  quote: string;
  /** First name and last initial, e.g. "Dana R." */
  name: string;
  town: string;
  service: string;
};

/**
 * TODO: paste real reviews here, word for word, with the customer's OK.
 * Google reviews are the easiest source. Keep each under about 40 words.
 *
 * Example:
 * { quote: "They showed up the next morning ...", name: "Dana R.",
 *   town: "Leonardtown", service: "House wash" },
 */
export const reviews: Review[] = [];

export const serviceTowns = [
  {
    county: "St. Mary's County",
    primary: true,
    towns: [
      "Leonardtown",
      "Lexington Park",
      "California",
      "Great Mills",
      "Hollywood",
      "Mechanicsville",
      "Charlotte Hall",
      "Piney Point",
      "Ridge",
      "St. Inigoes",
      "Valley Lee",
      "Chaptico",
    ],
  },
  {
    county: "Calvert County",
    primary: false,
    towns: ["Solomons", "Lusby", "Prince Frederick", "St. Leonard", "Huntingtown"],
  },
  {
    county: "Charles County",
    primary: false,
    towns: ["Hughesville", "La Plata", "Waldorf", "Bryans Road"],
  },
];

export const faqs = [
  {
    q: "Do I need to be home?",
    a: "No. As long as we can reach the areas being cleaned and an outdoor faucet, you can be at work. Just leave any gates unlocked.",
  },
  {
    q: "Do you bring your own water?",
    a: "We hook up to your outdoor spigot. A standard exterior faucet is all we need.",
  },
  {
    q: "Is pressure washing safe for my siding?",
    a: "Yes. Siding, roofs and wood get a low-pressure soft wash. High pressure is kept for concrete and other hard surfaces that can take it.",
  },
  {
    q: "Will the cleaners hurt my plants or pets?",
    a: "No. We use plant and pet-safe solutions and rinse and protect landscaping as we work.",
  },
  {
    q: "How long does a job take?",
    a: "Most homes take one to three hours depending on size and what is being cleaned.",
  },
  {
    q: "How soon can you come out?",
    a: "We reply within 24 hours and usually schedule within 12 to 48 hours of your approval.",
  },
  {
    q: "Can you remove oil and rust stains?",
    a: "Most of them. It depends on the stain and the surface, so send a photo and we will tell you honestly what to expect.",
  },
  {
    q: "Do I need to move outdoor furniture?",
    a: "No. We move furniture as needed and put it back.",
  },
  {
    q: "What if it rains?",
    a: "We reschedule with no penalty.",
  },
  {
    q: "Do you work in winter?",
    a: "Yes, on days above 40°F so nothing freezes.",
  },
  {
    q: "How often should my house be washed?",
    a: "Most homes look their best with a wash about once a year. Shaded sides and homes near the water can need it sooner.",
  },
  {
    q: "Are quotes really free?",
    a: "Yes. Every quote is free, written and comes with no obligation.",
  },
];

/** The reviews section (and its nav link) only appears when it has something to show. */
export const showReviewsSection =
  reviews.length > 0 || Boolean(business.reviewsUrl) || SHOW_CONTENT_SLOTS;
