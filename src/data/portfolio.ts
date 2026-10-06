const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

export type Project = {
  id: string;
  name: string;
  descriptor: string;
  category: "Product" | "Commerce" | "Open source" | "Editorial";
  year: string;
  period: string;
  client: string;
  role: string;
  image: string;
  imageAlt: string;
  summary: string;
  problem: string;
  approach: string;
  outcome: string;
  details: string[];
  stack: string[];
};

export type Article = {
  id: string;
  title: string;
  date: string;
  readTime: string;
  category: string;
  excerpt: string;
  paragraphs: string[];
  takeaway: string;
};

export const profile = {
  name: "Morgan Ellis",
  initials: "ME",
  role: "Product engineer & creative developer",
  location: "Toronto, Canada",
  timezone: "America/Toronto",
  email: "hello@example.com",
  avatar: asset("/art/profile-illustration.svg"),
  website: "morganellis.dev",
  availability: "Open to a small number of projects",
  intro:
    "I build useful software with a little extra care for the details. I like clear interfaces, dependable systems, and the quiet moment when a product finally feels obvious.",
  biography: [
    "I’m Morgan, a product engineer who likes to stay close to the whole problem: the first sketch, the data model, the shipping checklist, and the tiny interaction that makes a screen easier to use.",
    "Over the last few years I’ve worked with small product teams, independent shops, and people trying to make complicated services feel more human. I tend to reach for React and TypeScript, but the best tool is usually the one the next person can understand.",
    "Away from a laptop, I’m usually walking by the lake with a camera, cooking something slowly, or collecting paper ephemera from bookshops."
  ],
  currentFocus: "Small, sturdy products for people doing real work",
  socials: [
    { label: "GitHub", href: "https://github.com/your-handle", note: "Code & small experiments" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/your-handle", note: "Work history" },
    { label: "Are.na", href: "https://www.are.na/your-handle", note: "Things worth keeping" }
  ],
  skills: [
    "React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "CSS",
    "Accessibility", "Design systems", "Performance", "Shopify", "Cloudflare", "Figma"
  ]
};

export const projects: Project[] = [
  {
    id: "daymark",
    name: "Daymark",
    descriptor: "A weekly planning tool that leaves room to think.",
    category: "Product",
    year: "2026",
    period: "Jan — Apr 2026",
    client: "Independent",
    role: "Product engineering · solo",
    image: asset("/art/project-daymark.svg"),
    imageAlt: "A warm, paper-toned weekly planner with a compact calendar and quiet green chart accents.",
    summary: "A small planning space for people whose work changes shape every week.",
    problem: "Most planning tools either demand a process or turn a calendar into a second inbox. I wanted to make a place where a person could see the week, make a few promises, and get back to the work.",
    approach: "The interface starts with one week and a short list. I kept the keyboard flow predictable, made unfinished work easy to move, and treated the empty state as part of the product rather than a setup problem.",
    outcome: "A responsive web app with a local-first feel, a deliberately small feature set, and no pressure to keep every hour accounted for.",
    details: [
      "Designed the data model around a week, not a task hierarchy.",
      "Built accessible drag-and-drop and keyboard alternatives for moving plans.",
      "Kept reminders optional and the default screen calm at a glance."
    ],
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS"]
  },
  {
    id: "tideline",
    name: "Tideline",
    descriptor: "A public map for finding a kinder way to the water.",
    category: "Product",
    year: "2025",
    period: "Aug — Dec 2025",
    client: "Civic Field Lab",
    role: "Frontend engineering · mapping",
    image: asset("/art/project-tideline.svg"),
    imageAlt: "A soft blue-green map illustration with a winding shoreline and a marked walking route.",
    summary: "A map-led guide to public shoreline access, built with a local environmental group.",
    problem: "The information existed in PDFs, park pages, and old community posts. None of it answered a simple question: can I get to the water from here, and what should I know before I go?",
    approach: "I brought the location details into one searchable map and gave each place a practical page: access notes, transit, seasonal closures, and community-submitted corrections.",
    outcome: "A lightweight guide that works well on a phone, remains useful with a weak signal, and gives the local team a straightforward way to update information.",
    details: [
      "Grouped map data by the questions people actually ask.",
      "Added a list view so the experience does not depend on a map gesture.",
      "Made update dates and source notes visible instead of hiding provenance."
    ],
    stack: ["React", "TypeScript", "MapLibre", "PostGIS"]
  },
  {
    id: "still-house",
    name: "Still House",
    descriptor: "A portfolio for photographs that need a little quiet.",
    category: "Editorial",
    year: "2025",
    period: "May — Jul 2025",
    client: "Nina Clarke, photographer",
    role: "Design & development",
    image: asset("/art/project-stillhouse.svg"),
    imageAlt: "An editorial photography portfolio with oversized image blocks, ink-black type, and a soft ivory background.",
    summary: "A flexible portfolio and archive for an independent documentary photographer.",
    problem: "The old site made every project look like the same grid. Nina needed room for long-form stories, small image sets, and the occasional photograph that deserved the whole page.",
    approach: "I built a small publishing system around project-specific layouts. Image sizes follow the photographs; type and navigation stay intentionally restrained.",
    outcome: "A fast, low-maintenance portfolio that makes the work—not the interface—the first thing a visitor remembers.",
    details: [
      "Created three reusable story layouts instead of one rigid gallery template.",
      "Added responsive image sizing and keyboard-friendly lightbox controls.",
      "Kept the content model simple enough for the photographer to edit herself."
    ],
    stack: ["Next.js", "Sanity", "TypeScript", "CSS"]
  },
  {
    id: "commonfield",
    name: "Common Field",
    descriptor: "An online home for useful things, made slowly.",
    category: "Commerce",
    year: "2024",
    period: "Sep — Dec 2024",
    client: "Common Field Studio",
    role: "Shopify theme development",
    image: asset("/art/project-commonfield.svg"),
    imageAlt: "A muted green homewares storefront showing a handmade ceramic vessel and a simple product grid.",
    summary: "A warm, practical storefront for a tiny homewares label with a growing catalogue.",
    problem: "The shop had a strong point of view in person, but the online store felt generic and made the small details—materials, care, and maker notes—hard to find.",
    approach: "I rebuilt the theme around editorial product stories, useful filters, and a cart that stays out of the way until it is needed.",
    outcome: "A maintainable Shopify storefront with an easy-to-edit component library and a clearer path from discovery to checkout.",
    details: [
      "Built flexible collection sections that the studio can rearrange without code.",
      "Added material and care details to product cards and product pages.",
      "Reduced layout shift on collection pages with reserved image ratios."
    ],
    stack: ["Shopify", "Liquid", "JavaScript", "CSS"]
  },
  {
    id: "handoff",
    name: "Handoff",
    descriptor: "A shared shift notebook for community spaces.",
    category: "Open source",
    year: "2024",
    period: "Mar — Jun 2024",
    client: "Open source",
    role: "Product design · full stack",
    image: asset("/art/project-handoff.svg"),
    imageAlt: "A deep navy shift handover board with neatly stacked cream notes and a small amber status indicator.",
    summary: "A simple handover log for teams whose work happens in rooms, not in project-management software.",
    problem: "A few community-run spaces were passing shift notes around in group chats. Useful context disappeared under photos, schedule changes, and friendly noise.",
    approach: "Handoff gives each location a shared board with a short list of current notes, a visible owner, and an expiry date so old information does not become permanent by accident.",
    outcome: "A small, self-hostable tool designed to be easy to learn on a busy shift and easy to leave behind when it is no longer useful.",
    details: [
      "Made the default view readable from a shared tablet.",
      "Added automatic expiry for time-sensitive notes.",
      "Published a plain-language setup guide for volunteer maintainers."
    ],
    stack: ["React", "Node.js", "SQLite", "PWA"]
  },
  {
    id: "margin-notes",
    name: "Margin Notes",
    descriptor: "A tiny, private reading log for the things you keep.",
    category: "Open source",
    year: "2023",
    period: "Oct 2023 — Feb 2024",
    client: "Personal project",
    role: "Design & development",
    image: asset("/art/project-margins.svg"),
    imageAlt: "A reading journal made of small cream paper cards, book spines, and a red pencil mark.",
    summary: "A local-first reading journal that makes space for half-formed thoughts as well as finished books.",
    problem: "Reading trackers tend to turn a private habit into a scoreboard. I wanted somewhere to keep a quote, a page number, or a note to my future self without ranking the month.",
    approach: "The app stores everything in the browser by default, offers a simple export, and uses the smallest possible set of fields: title, author, status, and notes.",
    outcome: "An intentionally small open-source project used as a place to test offline storage, keyboard navigation, and sensible data export.",
    details: [
      "Made export a first-class feature rather than an account setting.",
      "Designed the empty state to invite a single note, not a reading challenge.",
      "Kept the core app usable without creating an account."
    ],
    stack: ["TypeScript", "IndexedDB", "Vite", "CSS"]
  }
];

export const articles: Article[] = [
  {
    id: "calm-dashboard",
    title: "Making a dashboard feel like a place to work",
    date: "18 Feb 2026",
    readTime: "6 min read",
    category: "Interface notes",
    excerpt: "A few choices that helped a planning tool stay useful without turning into another inbox.",
    paragraphs: [
      "A dashboard is a promise about attention. It says: open this page and I will help you decide what matters. That promise is easy to break with one more badge, one more chart, one more row that is technically useful but never changes anyone’s next step.",
      "When I started Daymark, I wrote down the three questions the first screen needed to answer: what is already committed, what still needs a decision, and where is there room? If a component could not help with one of those questions, it did not make the first view.",
      "The most useful change was not a new feature. It was changing the unit of the interface from task to week. Tasks can be copied, repeated, and rescheduled, but a week gives them context. A plan that no longer fits can be moved without feeling like a failure.",
      "I also resisted making the empty state a funnel. It gives a small example, explains where the data lives, and lets a person leave. That feels like a modest choice, but it sets the tone for the rest of the product.",
      "The result is not a universal productivity system. It is a quieter surface for a particular kind of work. That constraint made the code and the interface easier to reason about—and left room for the product to grow where real use asks it to."
    ],
    takeaway: "A calm interface is not an empty interface. It is a clear answer to the question someone came in with."
  },
  {
    id: "maps-that-load",
    title: "The map is not the whole map experience",
    date: "07 Nov 2025",
    readTime: "8 min read",
    category: "Frontend engineering",
    excerpt: "On the list view, update dates, and other details that make an interactive map useful in the real world.",
    paragraphs: [
      "It is tempting to start a map project by choosing a map library. I have learned to start with the sentence a person is trying to finish: is this entrance open, can I get there by transit, and what happens when the map is slow?",
      "For Tideline, the map is only one way into the information. Every location has a list entry with the same name, access notes, and route details. It is easier to use with a screen reader, easier to scan on a small phone, and still works if tiles take a moment to arrive.",
      "The other important part is trust. A map pin can look precise even when its data is old. Showing where a note came from and when it was checked gives the interface a little humility—and gives the local team a concrete thing to maintain.",
      "On the technical side, I kept the first render small. The place list can load before the map engine, and the map is imported only when someone asks for it. For a public guide, that trade-off matters more than adding a clever animation to the marker.",
      "The broader lesson is that an interactive visualization should have a useful non-visual route through the same information. That is not a fallback. It is part of the map."
    ],
    takeaway: "Treat the map as one view of the data, not as the only doorway into it."
  },
  {
    id: "small-shopfront",
    title: "A small shop deserves a maintainable theme",
    date: "21 Jun 2025",
    readTime: "5 min read",
    category: "Commerce",
    excerpt: "What I changed when a good-looking storefront became difficult for its owners to update.",
    paragraphs: [
      "A small shop does not need a theme with a hundred knobs. It needs the few right knobs, labelled in a way the people running the shop can understand.",
      "For Common Field, the first pass was mostly listening. Which product details did the owner explain in person? Which collections changed every month? What was the one thing they wished customers knew before checkout? Those answers shaped the sections and the product template.",
      "I kept the store on Shopify and spent time on the edges: image ratios that do not jump during loading, filters that are usable without a mouse, and product details that are easy to find on a phone.",
      "The code was simpler after we removed options. A flexible section still needs boundaries; otherwise every page becomes its own special case. The theme now has a short set of blocks that can be rearranged, but not accidentally turned into a different design system.",
      "A maintainable storefront is part of the product. It is the thing that lets a small team change a price, add a maker note, or launch a new collection without filing a support ticket."
    ],
    takeaway: "Good flexibility gives the owner a safe choice—not an empty canvas."
  },
  {
    id: "plain-contact-form",
    title: "The humble contact form still matters",
    date: "14 Mar 2025",
    readTime: "4 min read",
    category: "Web craft",
    excerpt: "A short case for clear labels, honest feedback, and not making people solve a puzzle to say hello.",
    paragraphs: [
      "A portfolio contact form is one of the smallest parts of a site and one of the easiest to make needlessly awkward. Placeholder-only labels, hidden validation, and a submit button that gives no feedback all add up to a strange first conversation.",
      "I prefer explicit labels, a useful example in the supporting text, and a confirmation state that says what happened next. If a site cannot send messages without a server, a mail link is more honest than pretending that it can.",
      "It is also worth asking whether every field is needed. Name, email, and a short note are enough to begin. Budget ranges and long qualification forms can wait until the conversation has started.",
      "The goal is not to collect the most information. It is to make it easy for a real person to begin a real exchange."
    ],
    takeaway: "Make the first step clear, keep it short, and tell people what happened after they pressed send."
  }
];

export const experience = [
  {
    period: "2024 — now",
    role: "Product engineer",
    company: "Northline Studio",
    type: "Small product team",
    description: "Designing and building interfaces for early-stage products, from first clickable prototype to the first year of steady use.",
    tags: ["React", "TypeScript", "Product thinking"]
  },
  {
    period: "2022 — 2024",
    role: "Frontend developer",
    company: "Good Work Cooperative",
    type: "Digital studio",
    description: "Worked alongside designers and strategists on accessible sites and commerce experiences for independent businesses and cultural groups.",
    tags: ["Shopify", "Design systems", "Accessibility"]
  },
  {
    period: "2020 — 2022",
    role: "Web developer",
    company: "Fieldnotes Projects",
    type: "Independent practice",
    description: "Built a mix of small editorial sites, internal tools, and experiments with a focus on clear handover and easy maintenance.",
    tags: ["JavaScript", "CSS", "Content design"]
  }
];

export const notesFiles = [
  {
    id: "readme",
    name: "readme.txt",
    content: `Hello, and thanks for stopping by.\n\nThis is a small desktop-style portfolio. Open a folder or use the dock at the bottom to find work, writing, and contact details.\n\nThe work is a mix of product engineering, small storefronts, and experiments. If something here feels relevant to a project you are working on, the Contact window is the easiest way to reach me.\n\n— Morgan`
  },
  {
    id: "field-notes",
    name: "field-notes.md",
    content: `# Notes from the desk\n\n- Make the first screen answer a real question.\n- Keep the keyboard path as considered as the pointer path.\n- Delete options before adding a settings panel.\n- Leave a useful note for the next person.\n\nCurrent reading: a collection of short essays on maps, memory, and public space.`
  },
  {
    id: "stack",
    name: "stack.json",
    content: `{
  "interface": ["React", "TypeScript", "CSS"],
  "product": ["discovery", "prototyping", "iteration"],
  "care": ["accessibility", "performance", "documentation"]
}`
  }
];
