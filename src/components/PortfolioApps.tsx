"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { articles, experience, notesFiles, profile, projects } from "@/data/portfolio";
import { Icon, type IconName } from "@/components/Icon";

export type AppId =
  | "about" | "work" | "journal" | "experience" | "contact" | "terminal"
  | "settings" | "help" | "folder" | "note" | "project" | "article";

export type Preferences = {
  theme: "light" | "dark";
  accent: "orange" | "green" | "blue" | "purple";
  wallpaper: "sunset" | "grove" | "tide" | "paper";
  brightness: number;
};

export type WindowContentProps = {
  appId: AppId;
  payload?: string;
  preferences: Preferences;
  onPreferenceChange: (update: Partial<Preferences>) => void;
  onOpen: (appId: AppId, payload?: string) => void;
};

const appLabels: Record<string, string> = {
  about: "About", work: "Selected work", journal: "Journal", experience: "Experience",
  contact: "Contact", terminal: "Terminal", settings: "System settings", help: "Help"
};

function Eyebrow({ children, trailing }: { children: ReactNode; trailing?: ReactNode }) {
  return <div className="eyebrow"><span>{children}</span>{trailing ? <span className="eyebrow-trailing">{trailing}</span> : null}</div>;
}

function AppHeading({ label, title, intro, action }: { label: string; title: ReactNode; intro?: string; action?: ReactNode }) {
  return (
    <header className="app-heading">
      <Eyebrow>{label}</Eyebrow>
      <div className="app-heading-row">
        <div><h1 className="app-title">{title}</h1>{intro ? <p className="app-intro">{intro}</p> : null}</div>
        {action ? <div className="app-heading-action">{action}</div> : null}
      </div>
    </header>
  );
}

function QuietLink({ href, children, icon = "arrow" }: { href: string; children: ReactNode; icon?: IconName }) {
  return <a className="text-link" href={href}>{children}<Icon name={icon} size={14} /></a>;
}

function AboutView({ onOpen }: Pick<WindowContentProps, "onOpen">) {
  return (
    <div className="app-page app-about">
      <div className="about-lead">
        <div className="about-copy">
          <Eyebrow trailing={<span className="availability"><i />{profile.availability}</span>}>PROFILE / 001</Eyebrow>
          <h1 className="about-title">Good work<br /><em>starts with</em><br />good questions.</h1>
          <p className="about-name-line">I’m <strong>{profile.name}</strong> — {profile.role.toLowerCase()} based in {profile.location}.</p>
          <p className="about-intro">{profile.intro}</p>
          <div className="button-row">
            <button className="ui-button ui-button--primary" onClick={() => onOpen("work")}><Icon name="work" size={16} /> Explore selected work</button>
            <button className="ui-button ui-button--plain" onClick={() => onOpen("contact")}>Say hello <Icon name="arrow" size={15} /></button>
          </div>
        </div>
        <figure className="profile-art-card">
          <div className="profile-art-frame"><img src={profile.avatar} alt="A small editorial illustration for Morgan Ellis’s portfolio." /></div>
          <figcaption><span>FIELD NOTES / TORONTO</span><span>43° 39′ N · 79° 23′ W</span></figcaption>
        </figure>
      </div>

      <div className="about-facts">
        <div><span className="fact-label">CURRENTLY</span><strong>Northline Studio</strong><small>Product engineer · 2024—now</small></div>
        <div><span className="fact-label">INTERESTED IN</span><strong>{profile.currentFocus}</strong><small>Good constraints, kind teams</small></div>
        <div><span className="fact-label">A LITTLE OFF-SCREEN</span><strong>Long walks, film photos</strong><small>And a very full bookshelf</small></div>
      </div>

      <section className="about-section">
        <div className="section-kicker"><span>01</span><span>THE SHORT VERSION</span></div>
        <div className="about-prose">{profile.biography.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      </section>

      <section className="about-section about-skills-section">
        <div className="section-kicker"><span>02</span><span>TOOLS I REACH FOR</span></div>
        <div className="about-skills">
          <p>Comfortable across the product surface—from a considered component to the data underneath it.</p>
          <div className="tag-list">{profile.skills.map((skill) => <span className="tag" key={skill}>{skill}</span>)}</div>
        </div>
      </section>

      <section className="about-bottom">
        <div><Eyebrow>ELSEWHERE</Eyebrow><h2>Good conversations<br />are always welcome.</h2></div>
        <div className="social-list">{profile.socials.map((social) => <a key={social.label} href={social.href} target="_blank" rel="noreferrer"><span>{social.label}<small>{social.note}</small></span><Icon name="external" size={15} /></a>)}</div>
      </section>
      <div className="app-footnote"><span>END OF PROFILE</span><span>LAST UPDATED · SPRING 2026</span></div>
    </div>
  );
}

const workFilters = ["All", "Product", "Commerce", "Editorial", "Open source"] as const;

function WorkView({ onOpen }: Pick<WindowContentProps, "onOpen">) {
  const [filter, setFilter] = useState<(typeof workFilters)[number]>("All");
  const filtered = filter === "All" ? projects : projects.filter((project) => project.category === filter);
  return (
    <div className="app-page app-work">
      <AppHeading label="WORK / 006 PROJECTS" title="Selected work" intro="A few things I’ve had the pleasure of making with thoughtful people." action={<span className="quiet-count">2023 — 2026</span>} />
      <div className="work-timeline" aria-label="Project timeline">
        <div className="timeline-head"><span>PROJECT</span><div><span>2023</span><span>2024</span><span>2025</span><span>2026</span></div></div>
        {projects.slice(0, 4).map((project, index) => <div className="timeline-row" key={project.id}>
          <span>{String(index + 1).padStart(2, "0")} <b>{project.name}</b></span>
          <div className="timeline-track"><i className={`timeline-bar timeline-bar-${index + 1}`} style={{ left: `${index === 0 ? 69 : index === 1 ? 48 : index === 2 ? 51 : 28}%`, width: `${index === 0 ? 25 : index === 1 ? 27 : index === 2 ? 20 : 28}%` }} /></div>
        </div>)}
        <div className="timeline-now"><span>NOW</span></div>
      </div>
      <div className="work-list-header"><div><Eyebrow>THE ARCHIVE</Eyebrow><h2>Built with intention.</h2></div><div className="filter-row" role="group" aria-label="Filter projects">{workFilters.map((item) => <button className={`filter-chip ${filter === item ? "is-selected" : ""}`} key={item} onClick={() => setFilter(item)} aria-pressed={filter === item}>{item}</button>)}</div></div>
      <div className="project-grid">
        {filtered.map((project, index) => <button className="project-card" key={project.id} onClick={() => onOpen("project", project.id)}>
          <div className="project-image"><img src={project.image} alt={project.imageAlt} loading="lazy" /><span className="project-index">{String(index + 1).padStart(2, "0")}</span><span className="project-open"><Icon name="arrow" size={17} /></span></div>
          <div className="project-meta"><span>{project.category.toUpperCase()}</span><span>{project.year}</span></div>
          <h3>{project.name}<Icon name="arrow" size={15} /></h3>
          <p>{project.descriptor}</p>
        </button>)}
      </div>
      <div className="work-footnote"><span>6 PROJECTS</span><span>CLICK ANY CARD TO OPEN THE CASE FILE</span></div>
    </div>
  );
}

function ProjectView({ id, onOpen }: { id?: string; onOpen: (appId: AppId, payload?: string) => void }) {
  const project = projects.find((item) => item.id === id) ?? projects[0];
  return (
    <article className="app-page app-project-detail">
      <div className="project-detail-hero">
        <div className="project-detail-title"><Eyebrow>{project.category.toUpperCase()} / {project.year}</Eyebrow><h1>{project.name}</h1><p>{project.descriptor}</p></div>
        <div className="project-detail-image"><img src={project.image} alt={project.imageAlt} /></div>
      </div>
      <div className="project-specs">
        <div><span>ROLE</span><strong>{project.role}</strong></div><div><span>CLIENT</span><strong>{project.client}</strong></div><div><span>WHEN</span><strong>{project.period}</strong></div>
      </div>
      <div className="project-detail-body">
        <div className="project-detail-intro"><span className="detail-index">01 / OVERVIEW</span><p className="project-summary">{project.summary}</p><div className="tag-list">{project.stack.map((item) => <span className="tag" key={item}>{item}</span>)}</div></div>
        <div className="project-story">
          <section><span className="detail-index">02 / THE QUESTION</span><h2>Where it began</h2><p>{project.problem}</p></section>
          <section><span className="detail-index">03 / THE WORK</span><h2>What I focused on</h2><p>{project.approach}</p><ul className="detail-list">{project.details.map((detail) => <li key={detail}>{detail}</li>)}</ul></section>
          <section className="project-outcome"><span className="detail-index">04 / WHAT SHIPPED</span><h2>A useful thing, in the world.</h2><p>{project.outcome}</p></section>
        </div>
      </div>
      <footer className="project-next"><span>THAT’S {project.name.toUpperCase()}</span><button className="ui-button ui-button--plain" onClick={() => onOpen("work")}>Back to all work <Icon name="arrow" size={14} /></button></footer>
    </article>
  );
}

function JournalView({ onOpen }: Pick<WindowContentProps, "onOpen">) {
  return (
    <div className="app-page app-journal">
      <AppHeading label="JOURNAL / 004 ENTRIES" title="Notes from the work." intro="Occasional writing on product decisions, frontend details, and making things easier to live with." />
      <div className="journal-intro-card"><span className="journal-glyph">“</span><p>Mostly notes to my future self. If one helps with your next project, it has done its job.</p><span>— MORGAN</span></div>
      <div className="article-list">
        {articles.map((article, index) => <button className="article-row" key={article.id} onClick={() => onOpen("article", article.id)}>
          <span className="article-number">{String(index + 1).padStart(2, "0")}</span>
          <span className="article-main"><span className="article-category">{article.category}</span><strong>{article.title}</strong><small>{article.excerpt}</small></span>
          <span className="article-end"><span>{article.date}</span><span>{article.readTime}<Icon name="arrow" size={15} /></span></span>
        </button>)}
      </div>
      <div className="app-footnote"><span>WRITING / 2025—2026</span><span>TAKE WHAT’S USEFUL, LEAVE THE REST</span></div>
    </div>
  );
}

function ArticleView({ id, onOpen }: { id?: string; onOpen: (appId: AppId, payload?: string) => void }) {
  const article = articles.find((item) => item.id === id) ?? articles[0];
  return (
    <article className="app-page app-article-detail">
      <div className="article-coverline"><Eyebrow>{article.category.toUpperCase()} / {article.date.toUpperCase()}</Eyebrow><span>{article.readTime}</span></div>
      <h1 className="article-title">{article.title}</h1>
      <p className="article-deck">{article.excerpt}</p>
      <div className="article-byline"><span className="byline-avatar">ME</span><span>Words by <strong>{profile.name}</strong><small>{profile.role}</small></span><span className="article-date">{article.date} · {article.readTime}</span></div>
      <div className="article-reading">
        {article.paragraphs.map((paragraph, index) => <p key={paragraph}>{index === 0 ? <><span className="article-dropcap" aria-hidden="true">{paragraph.slice(0, 1)}</span>{paragraph.slice(1)}</> : paragraph}</p>)}
        <blockquote>{article.takeaway}</blockquote>
        <div className="article-signoff"><span>END OF NOTE</span><button className="text-link" onClick={() => onOpen("journal")}>More notes <Icon name="arrow" size={14} /></button></div>
      </div>
    </article>
  );
}

function ExperienceView({ onOpen }: Pick<WindowContentProps, "onOpen">) {
  return (
    <div className="app-page app-experience">
      <AppHeading label="EXPERIENCE / A SHORT TIMELINE" title="The places in between." intro="A little context on the teams, clients, and questions that have shaped the work." />
      <div className="experience-note"><Icon name="spark" size={18} /><p>I like small teams that share context, write things down, and make time to ask whether a feature should exist.</p></div>
      <div className="experience-list">
        {experience.map((item, index) => <article className="experience-row" key={item.company}>
          <div className="experience-date"><span>{item.period}</span><i className={index === 0 ? "is-current" : ""} /></div>
          <div className="experience-copy"><span className="experience-type">{item.type}</span><h2>{item.role}</h2><h3>{item.company}</h3><p>{item.description}</p><div className="tag-list">{item.tags.map((tag) => <span className="tag tag--small" key={tag}>{tag}</span>)}</div></div>
        </article>)}
        <article className="experience-row education-row"><div className="experience-date"><span>2017 — 2020</span><i /></div><div className="experience-copy"><span className="experience-type">EDUCATION</span><h2>Digital Media & Web Development</h2><h3>Toronto Metropolitan University</h3><p>Focused on interaction design, web systems, and the craft of making useful things clear.</p></div></article>
      </div>
      <div className="experience-end"><span>THAT’S THE LONG VERSION</span><button className="ui-button ui-button--plain" onClick={() => onOpen("contact")}>Start a conversation <Icon name="arrow" size={14} /></button></div>
    </div>
  );
}

function ContactView() {
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    const subject = encodeURIComponent(`A note from ${name.trim()}`);
    const body = encodeURIComponent(`${message.trim()}\n\n— ${name.trim()} (${email.trim()})`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };
  return (
    <div className="app-page app-contact">
      <AppHeading label="CONTACT / THE EASY PART" title={<>Start with<br /><em>a hello.</em></>} intro="A project, a question, or a good book recommendation. My inbox is open." />
      <div className="contact-layout">
        <aside className="contact-aside">
          <div className="contact-address"><span className="fact-label">EMAIL</span><button className="email-copy" onClick={copyEmail}>{profile.email}<Icon name={copied ? "check" : "copy"} size={15} /></button><small>{copied ? "Copied to clipboard" : "Click to copy"}</small></div>
          <div className="contact-address"><span className="fact-label">BASED IN</span><strong>{profile.location}</strong><small>Usually online between 9–5 ET</small></div>
          <div className="contact-address"><span className="fact-label">AVAILABILITY</span><strong className="contact-status"><i /> {profile.availability}</strong><small>Best fit: thoughtful teams and clear problems.</small></div>
          <div className="contact-socials"><span className="fact-label">AROUND THE WEB</span>{profile.socials.map((social) => <a key={social.label} href={social.href} target="_blank" rel="noreferrer">{social.label}<Icon name="external" size={13} /></a>)}</div>
        </aside>
        <form className="contact-form" onSubmit={submit}>
          <div className="form-topline"><span>WRITE A NOTE</span><span>01 / 03</span></div>
          <label htmlFor="contact-name">Your name</label><input id="contact-name" name="name" autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} placeholder="What should I call you?" />
          <label htmlFor="contact-email">Email address</label><input id="contact-email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
          <label htmlFor="contact-message">What’s on your mind?</label><textarea id="contact-message" name="message" rows={5} required value={message} onChange={(event) => setMessage(event.target.value)} placeholder="A few lines is plenty." />
          <div className="form-submit-row"><span>No mailing list. Just a reply.</span><button className="ui-button ui-button--primary" type="submit"><Icon name="send" size={15} /> Send note</button></div>
          {sent ? <p className="form-feedback" role="status">Your email app should open with the note ready to send. Thanks for writing.</p> : null}
        </form>
      </div>
      <div className="contact-bottom"><span>GOOD THINGS TAKE A CONVERSATION.</span><span>TORONTO · {new Date().getFullYear()}</span></div>
    </div>
  );
}

const accentOptions: Array<{ id: Preferences["accent"]; label: string; color: string }> = [
  { id: "orange", label: "Persimmon", color: "#ff631a" },
  { id: "green", label: "Fern", color: "#2f9b46" },
  { id: "blue", label: "Cobalt", color: "#2d7ff0" },
  { id: "purple", label: "Iris", color: "#8b58dd" }
];
const wallpaperOptions: Array<{ id: Preferences["wallpaper"]; label: string; swatch: string; mood: string }> = [
  { id: "sunset", label: "Clementine", swatch: "linear-gradient(135deg,#ff9c56,#df542c)", mood: "Warm field" },
  { id: "grove", label: "Canopy", swatch: "linear-gradient(135deg,#8bbb86,#315e4a)", mood: "Leaf shade" },
  { id: "tide", label: "Tidal pool", swatch: "linear-gradient(135deg,#91c9ce,#416a94)", mood: "Cool water" },
  { id: "paper", label: "Soft paper", swatch: "linear-gradient(135deg,#efe6d6,#c5b8a4)", mood: "Quiet neutral" }
];

function SettingsView({ preferences, onPreferenceChange }: Pick<WindowContentProps, "preferences" | "onPreferenceChange">) {
  return (
    <div className="app-page app-settings">
      <AppHeading label="SYSTEM / PREFERENCES" title="Make it yours." intro="A few small controls for the desktop. Your choices stay in this browser." />
      <div className="settings-groups">
        <section className="settings-section"><div className="settings-section-head"><span className="settings-icon"><Icon name="sun" size={17} /></span><div><h2>Appearance</h2><p>Light or dark, depending on the hour.</p></div></div><div className="segmented-control" role="group" aria-label="Appearance">
          {(["light", "dark"] as const).map((theme) => <button key={theme} className={preferences.theme === theme ? "is-active" : ""} aria-pressed={preferences.theme === theme} onClick={() => onPreferenceChange({ theme })}><Icon name={theme === "light" ? "sun" : "moon"} size={15} />{theme === "light" ? "Light" : "Dark"}</button>)}
        </div></section>
        <section className="settings-section"><div className="settings-section-head"><span className="settings-icon"><Icon name="spark" size={17} /></span><div><h2>Accent colour</h2><p>Choose the colour used for active states and details.</p></div></div><div className="accent-options" role="group" aria-label="Accent colour">
          {accentOptions.map((accent) => <button key={accent.id} className={`accent-option ${preferences.accent === accent.id ? "is-active" : ""}`} onClick={() => onPreferenceChange({ accent: accent.id })} aria-pressed={preferences.accent === accent.id}><i style={{ background: accent.color }} /><span>{accent.label}</span>{preferences.accent === accent.id ? <Icon name="check" size={14} /> : null}</button>)}
        </div></section>
        <section className="settings-section"><div className="settings-section-head"><span className="settings-icon"><Icon name="image" size={17} /></span><div><h2>Wallpaper</h2><p>A different bit of colour behind the windows.</p></div></div><div className="wallpaper-options" role="group" aria-label="Desktop wallpaper">
          {wallpaperOptions.map((wallpaper) => <button className={`wallpaper-option ${preferences.wallpaper === wallpaper.id ? "is-active" : ""}`} key={wallpaper.id} onClick={() => onPreferenceChange({ wallpaper: wallpaper.id })} aria-pressed={preferences.wallpaper === wallpaper.id}><span className="wallpaper-swatch" style={{ background: wallpaper.swatch }}><i /></span><span><strong>{wallpaper.label}</strong><small>{wallpaper.mood}</small></span>{preferences.wallpaper === wallpaper.id ? <Icon name="check" size={14} /> : null}</button>)}
        </div></section>
        <section className="settings-section settings-brightness"><div className="settings-section-head"><span className="settings-icon"><Icon name="sliders" size={17} /></span><div><h2>Display brightness</h2><p>For a softer desktop, not a brighter monitor.</p></div></div><div className="range-row"><Icon name="moon" size={15} /><input type="range" min="75" max="100" step="5" value={preferences.brightness} onChange={(event) => onPreferenceChange({ brightness: Number(event.target.value) })} aria-label="Interface brightness" /><Icon name="sun" size={16} /><output>{preferences.brightness}%</output></div></section>
      </div>
      <div className="settings-reset"><span>Changes are saved automatically in this browser.</span><button className="ui-button ui-button--plain" onClick={() => onPreferenceChange({ theme: "light", accent: "orange", wallpaper: "sunset", brightness: 100 })}>Reset preferences <Icon name="refresh" size={14} /></button></div>
    </div>
  );
}

function HelpView({ onOpen }: Pick<WindowContentProps, "onOpen">) {
  const shortcuts = [
    ["⌘ / Ctrl + K", "Open quick search"],
    ["⌘ / Ctrl + 1", "Open the profile"],
    ["⌘ / Ctrl + 2", "Open selected work"],
    ["⌘ / Ctrl + 3", "Open the journal"],
    ["⌘ / Ctrl + 4", "Open experience"],
    ["Esc", "Close a menu or search"]
  ];
  return (
    <div className="app-page app-help">
      <AppHeading label="HELP / A FEW POINTERS" title="A desktop with a small map." intro="This portfolio behaves a little like a computer. Here’s the quick way around." />
      <div className="help-layout">
        <section className="help-card help-how"><span className="help-card-index">01 / GETTING AROUND</span><h2>Start wherever you like.</h2><p>Use the row of apps at the bottom to open a window. Windows can be moved, resized, minimized, or brought forward. On a phone, the windows become full-width panels.</p><div className="help-action-list"><button onClick={() => onOpen("work")}><span className="help-action-icon"><Icon name="work" size={17} /></span><span>Browse selected work<small>Projects, notes, and case files</small></span><Icon name="arrow" size={14} /></button><button onClick={() => onOpen("contact")}><span className="help-action-icon"><Icon name="contact" size={17} /></span><span>Write a note<small>Open the contact window</small></span><Icon name="arrow" size={14} /></button><button onClick={() => onOpen("settings")}><span className="help-action-icon"><Icon name="settings" size={17} /></span><span>Adjust the desktop<small>Theme, accent, wallpaper</small></span><Icon name="arrow" size={14} /></button></div></section>
        <section className="help-card help-shortcuts"><span className="help-card-index">02 / KEYBOARD</span><h2>A few shortcuts.</h2><div className="shortcut-list">{shortcuts.map(([key, label]) => <div key={key}><kbd>{key}</kbd><span>{label}</span></div>)}</div></section>
        <section className="help-card help-terminal"><span className="help-card-index">03 / IF YOU LIKE A PROMPT</span><h2>Try the terminal.</h2><p>Open Terminal from the dock and try <code>help</code>, <code>ls</code>, or <code>open work</code>. It’s a small, local command prompt—no server calls, no surprises.</p><button className="ui-button ui-button--dark" onClick={() => onOpen("terminal")}><Icon name="terminal" size={15} /> Open Terminal</button></section>
      </div>
      <p className="help-note"><Icon name="spark" size={15} /> The desktop is the navigation. Every app is also reachable from the menu bar and from search.</p>
    </div>
  );
}

type TerminalEntry = { prompt?: string; lines: string[]; tone?: "muted" | "success" | "error" };
const initialTerminal: TerminalEntry[] = [{ lines: ["MORGAN OS 1.0.4  ·  LOCAL SESSION", "Type ‘help’ to see the small list of commands."], tone: "muted" }];

function TerminalView({ onOpen, preferences, onPreferenceChange }: Pick<WindowContentProps, "onOpen" | "preferences" | "onPreferenceChange">) {
  const [entries, setEntries] = useState<TerminalEntry[]>(initialTerminal);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ block: "end", behavior: "smooth" }); }, [entries]);

  const runCommand = (raw: string) => {
    const command = raw.trim();
    if (!command) return;
    const [verb, ...rest] = command.toLowerCase().split(/\s+/);
    const arg = rest.join(" ");
    const result: TerminalEntry = { prompt: command, lines: [] };
    if (verb === "help") {
      result.lines = ["help                 show this list", "ls                   list desktop apps", "whoami               show the current profile", "open <app>           open an app or project", "theme <light|dark>   change appearance", "clear                clear the screen", "date                 show the local date"];
    } else if (verb === "ls") {
      result.lines = ["about/   work/   journal/   experience/   contact/   settings/   help/", "projects: daymark, tideline, still-house, commonfield, handoff, margin-notes"];
    } else if (verb === "whoami") {
      result.lines = [`${profile.name.toLowerCase().replaceAll(" ", "-")} — ${profile.role}`, `${profile.location} · ${profile.email}`];
    } else if (verb === "date") {
      result.lines = [new Intl.DateTimeFormat("en-CA", { dateStyle: "full", timeStyle: "short", timeZone: profile.timezone }).format(new Date())];
    } else if (verb === "clear") {
      setEntries([]);
      return;
    } else if (verb === "open") {
      const match = projects.find((project) => project.id === arg || project.name.toLowerCase() === arg);
      const appMap: Record<string, AppId> = { about: "about", profile: "about", work: "work", works: "work", projects: "work", journal: "journal", blog: "journal", experience: "experience", contact: "contact", settings: "settings", help: "help", terminal: "terminal" };
      if (match) {
        onOpen("project", match.id);
        result.lines = [`Opening ${match.name}…`]; result.tone = "success";
      } else if (appMap[arg]) {
        onOpen(appMap[arg]);
        result.lines = [`Opening ${appLabels[appMap[arg]]}…`]; result.tone = "success";
      } else {
        result.lines = [`No app called “${arg || "(nothing)"}”. Try ‘ls’ to see what’s here.`]; result.tone = "error";
      }
    } else if (verb === "theme" && (arg === "light" || arg === "dark")) {
      onPreferenceChange({ theme: arg });
      result.lines = [`Appearance set to ${arg}.`]; result.tone = "success";
    } else if (verb === "contact") {
      onOpen("contact"); result.lines = ["Opening Contact…"]; result.tone = "success";
    } else {
      result.lines = [`Command not found: ${verb}. Type ‘help’ for the short list.`]; result.tone = "error";
    }
    setEntries((previous) => [...previous, result]);
    setHistory((previous) => [...previous, command]);
    setHistoryIndex(-1);
    setValue("");
  };

  return (
    <div className="terminal-app" onClick={() => inputRef.current?.focus()}>
      <div className="terminal-toolbar"><span><i /> <i /> <i /></span><span>morgan@studio — zsh</span><span>UTF-8</span></div>
      <div className="terminal-output" aria-live="polite">
        {entries.map((entry, index) => <div className={`terminal-entry ${entry.tone ? `terminal-entry--${entry.tone}` : ""}`} key={`${index}-${entry.prompt ?? "welcome"}`}>
          {entry.prompt ? <div className="terminal-command"><span>morgan@studio</span><b>~</b><i>$</i> {entry.prompt}</div> : null}
          {entry.lines.map((line) => <div className="terminal-line" key={line}>{line}</div>)}
        </div>)}
        <form className="terminal-prompt" onSubmit={(event) => { event.preventDefault(); runCommand(value); }}>
          <span>morgan@studio</span><b>~</b><i>$</i><input ref={inputRef} value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={(event) => { if (event.key === "ArrowUp") { event.preventDefault(); const next = historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1); if (history[next]) { setHistoryIndex(next); setValue(history[next]); } } if (event.key === "ArrowDown" && historyIndex >= 0) { event.preventDefault(); const next = historyIndex + 1; setHistoryIndex(next >= history.length ? -1 : next); setValue(next >= history.length ? "" : history[next]); } }} aria-label="Terminal command" autoComplete="off" spellCheck={false} /></form>
        <div ref={bottomRef} />
      </div>
      <div className="terminal-status"><span>LOCAL MODE</span><span>THEME: {preferences.theme.toUpperCase()}</span><span>NO NETWORK REQUESTS</span></div>
    </div>
  );
}

function FolderView({ payload, onOpen }: Pick<WindowContentProps, "payload" | "onOpen">) {
  const isProjects = payload === "projects";
  const items = isProjects ? projects.map((project) => ({ id: project.id, name: `${project.id}.case`, label: project.name, icon: "image" as IconName, action: () => onOpen("project", project.id) })) : notesFiles.map((file) => ({ id: file.id, name: file.name, label: file.name, icon: "file" as IconName, action: () => onOpen("note", file.id) }));
  return (
    <div className="app-page app-folder">
      <div className="folder-toolbar"><span className="folder-path"><Icon name="folder" size={16} /> {isProjects ? "Work / Projects" : "Studio / Notes"}</span><span>{items.length} items</span></div>
      <div className="folder-list">{items.map((item) => <button className="folder-item" key={item.id} onDoubleClick={item.action} onClick={(event) => { if (window.matchMedia("(pointer: coarse)").matches) item.action(); else (event.currentTarget as HTMLButtonElement).focus(); }}><Icon name={item.icon} size={22} /><span><strong>{item.name}</strong><small>{item.label}</small></span><Icon name="chevron" size={14} /></button>)}</div>
      <div className="folder-hint">Double-click an item to open it.</div>
    </div>
  );
}

function NoteView({ payload }: Pick<WindowContentProps, "payload">) {
  const file = notesFiles.find((item) => item.id === payload) ?? notesFiles[0];
  return <div className="note-app"><div className="note-toolbar"><span><Icon name="file" size={14} /> {file.name}</span><span>PLAIN TEXT · LOCAL FILE</span></div><pre>{file.content}</pre><div className="note-status"><span>UTF-8</span><span>{file.content.split("\n").length} lines</span></div></div>;
}

export function WindowContent({ appId, payload, preferences, onPreferenceChange, onOpen }: WindowContentProps) {
  switch (appId) {
    case "about": return <AboutView onOpen={onOpen} />;
    case "work": return <WorkView onOpen={onOpen} />;
    case "project": return <ProjectView id={payload} onOpen={onOpen} />;
    case "journal": return <JournalView onOpen={onOpen} />;
    case "article": return <ArticleView id={payload} onOpen={onOpen} />;
    case "experience": return <ExperienceView onOpen={onOpen} />;
    case "contact": return <ContactView />;
    case "settings": return <SettingsView preferences={preferences} onPreferenceChange={onPreferenceChange} />;
    case "terminal": return <TerminalView onOpen={onOpen} preferences={preferences} onPreferenceChange={onPreferenceChange} />;
    case "help": return <HelpView onOpen={onOpen} />;
    case "folder": return <FolderView payload={payload} onOpen={onOpen} />;
    case "note": return <NoteView payload={payload} />;
    default: return <div className="app-page"><p>That window is not available.</p></div>;
  }
}

export const appIconNames: Record<string, IconName> = {
  about: "about", work: "work", journal: "journal", experience: "experience",
  contact: "contact", terminal: "terminal", settings: "settings", help: "help"
};

export function getWindowTitle(appId: AppId, payload?: string): string {
  if (appId === "project") return `${projects.find((project) => project.id === payload)?.name ?? "Project"} — Case file`;
  if (appId === "article") return `${articles.find((article) => article.id === payload)?.title ?? "Journal"} — Note`;
  if (appId === "folder") return payload === "projects" ? "Work / Projects" : "Studio / Notes";
  if (appId === "note") return notesFiles.find((file) => file.id === payload)?.name ?? "Note";
  return appLabels[appId] ?? "Portfolio";
}

export const regularApps: Array<{ id: AppId; name: string; icon: IconName; shortcut?: string }> = [
  { id: "about", name: "About", icon: "about", shortcut: "1" },
  { id: "work", name: "Work", icon: "work", shortcut: "2" },
  { id: "journal", name: "Journal", icon: "journal", shortcut: "3" },
  { id: "experience", name: "Experience", icon: "experience", shortcut: "4" },
  { id: "contact", name: "Contact", icon: "contact", shortcut: "5" },
  { id: "terminal", name: "Terminal", icon: "terminal" },
  { id: "settings", name: "Settings", icon: "settings" },
  { id: "help", name: "Help", icon: "help" }
];
