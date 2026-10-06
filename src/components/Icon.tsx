import type { ReactNode } from "react";

export type IconName =
  | "logo" | "about" | "work" | "journal" | "experience" | "contact"
  | "terminal" | "settings" | "help" | "search" | "folder" | "file"
  | "image" | "close" | "minimize" | "maximize" | "restore" | "arrow"
  | "external" | "mail" | "copy" | "sun" | "moon" | "wifi" | "battery"
  | "chevron" | "check" | "spark" | "globe" | "clock" | "grid" | "link"
  | "download" | "sliders" | "refresh" | "plus" | "send" | "book";

const glyphs: Record<IconName, ReactNode> = {
  logo: <><path d="M4 18V6l4 6 4-6v12" /><path d="M14 15.5c.8 1.6 2.1 2.5 3.8 2.5 1.4 0 2.2-.7 2.2-1.7 0-1.1-.8-1.6-2.4-2-1.8-.5-3.1-1.3-3.1-3.1 0-2 1.6-3.4 3.8-3.4 1.3 0 2.4.4 3.3 1.2" /></>,
  about: <><circle cx="12" cy="8" r="3.2" /><path d="M5.2 20c.5-3.3 2.8-5.4 6.8-5.4s6.3 2.1 6.8 5.4" /></>,
  work: <><rect x="3.5" y="6" width="17" height="14" rx="1" /><path d="M8.5 6V4.5h7V6M3.5 11h17M10 11v2h4v-2" /></>,
  journal: <><path d="M5 3.5h11.5a2.5 2.5 0 0 1 2.5 2.5v14H7.5A2.5 2.5 0 0 1 5 17.5z" /><path d="M5 17.5A2.5 2.5 0 0 1 7.5 15H19M9 7h6M9 10h6" /></>,
  experience: <><rect x="4" y="4.5" width="16" height="16" rx="1" /><path d="M8 2.5v4M16 2.5v4M4 9h16M8 13h3M8 16h6" /></>,
  contact: <><rect x="3.5" y="5.5" width="17" height="13" rx="1" /><path d="m4 7 8 6 8-6" /></>,
  terminal: <><rect x="3" y="4" width="18" height="16" rx="1" /><path d="m7 9 3 3-3 3M13 15h4" /></>,
  settings: <><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" /><path d="m19.2 13.2 1.1.9-1.5 2.7-1.4-.4a7.7 7.7 0 0 1-1.4.8l-.3 1.5h-3.1l-.3-1.5a7.7 7.7 0 0 1-1.4-.8l-1.4.4-1.5-2.7 1.1-.9a7.7 7.7 0 0 1 0-1.6l-1.1-.9 1.5-2.7 1.4.4a7.7 7.7 0 0 1 1.4-.8l.3-1.5h3.1l.3 1.5a7.7 7.7 0 0 1 1.4.8l1.4-.4 1.5 2.7-1.1.9a7.7 7.7 0 0 1 0 1.6Z" /></>,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9.6 9a2.5 2.5 0 1 1 4.7 1.2c-.7 1.2-2.4 1.4-2.4 3.3M12 17.2v.1" /></>,
  search: <><circle cx="10.8" cy="10.8" r="6.3" /><path d="m15.5 15.5 4.2 4.2" /></>,
  folder: <><path d="M3 6.3c0-.7.6-1.3 1.3-1.3h5l1.7 2h8.7c.7 0 1.3.6 1.3 1.3v9.4c0 .7-.6 1.3-1.3 1.3H4.3c-.7 0-1.3-.6-1.3-1.3z" /><path d="M3 9h18" /></>,
  file: <><path d="M6 3.5h8l4 4V20H6z" /><path d="M14 3.5v4h4M9 12h6M9 15h6" /></>,
  image: <><rect x="3.5" y="4.5" width="17" height="15" rx="1" /><circle cx="9" cy="9.5" r="1.5" /><path d="m4 17 5.2-4.8 3.2 2.7 2.6-2.3 5 4.4" /></>,
  close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  minimize: <path d="M5 12h14" />,
  maximize: <><rect x="5" y="5" width="14" height="14" rx=".5" /></>,
  restore: <><path d="M8 5h11v11" /><path d="M5 8h11v11H5z" /></>,
  arrow: <><path d="M4 12h15M13 6l6 6-6 6" /></>,
  external: <><path d="M13 5h6v6M19 5l-9 9" /><path d="M17 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h5" /></>,
  mail: <><rect x="3.5" y="5.5" width="17" height="13" rx="1" /><path d="m4 7 8 6 8-6" /></>,
  copy: <><rect x="8" y="8" width="11" height="12" rx="1" /><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h3" /></>,
  sun: <><circle cx="12" cy="12" r="3.5" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  moon: <path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.6 8.6 0 1 0 20.5 14Z" />,
  wifi: <><path d="M3 9.5a14 14 0 0 1 18 0M6.5 13a8.8 8.8 0 0 1 11 0M10 16.5a3.5 3.5 0 0 1 4 0M12 20h.01" /></>,
  battery: <><rect x="3" y="7" width="17" height="10" rx="1" /><path d="M22 10v4M6 10h8v4H6z" /></>,
  chevron: <path d="m7 10 5 5 5-5" />,
  check: <path d="m5 12.5 4.2 4 9.3-9" />,
  spark: <><path d="m12 2 1.8 7.2L21 12l-7.2 2.8L12 22l-1.8-7.2L3 12l7.2-2.8z" /><path d="m19 2 .8 2.2L22 5l-2.2.8L19 8l-.8-2.2L16 5l2.2-.8z" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.4 2.5 3.4 5.5 3.4 9s-1 6.5-3.4 9c-2.4-2.5-3.4-5.5-3.4-9S9.6 5.5 12 3Z" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>,
  grid: <><rect x="3.5" y="3.5" width="7" height="7" rx=".5" /><rect x="13.5" y="3.5" width="7" height="7" rx=".5" /><rect x="3.5" y="13.5" width="7" height="7" rx=".5" /><rect x="13.5" y="13.5" width="7" height="7" rx=".5" /></>,
  link: <><path d="M10 13a5 5 0 0 0 7.1 0l2-2A5 5 0 0 0 12 3.9l-1.2 1.2" /><path d="M14 11a5 5 0 0 0-7.1 0l-2 2A5 5 0 0 0 12 20.1l1.2-1.2" /></>,
  download: <><path d="M12 3v11m-4-4 4 4 4-4" /><path d="M5 17v3h14v-3" /></>,
  sliders: <><path d="M4 6h16M4 12h16M4 18h16" /><circle cx="9" cy="6" r="2" /><circle cx="15" cy="12" r="2" /><circle cx="8" cy="18" r="2" /></>,
  refresh: <><path d="M20 7v5h-5" /><path d="M19 12a7 7 0 1 1-1.8-4.7L20 12" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  send: <><path d="m21 3-7.2 18-3.9-7.9L2 9.2z" /><path d="M21 3 10 13.1" /></>,
  book: <><path d="M4 5.5h6a2.5 2.5 0 0 1 2 1 2.5 2.5 0 0 1 2-1h6v14h-6a2.5 2.5 0 0 0-2 1 2.5 2.5 0 0 0-2-1H4z" /><path d="M12 7v13" /></>
};

export function Icon({
  name,
  size = 18,
  strokeWidth = 1.65,
  className,
  decorative = true
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
  decorative?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={decorative ? true : undefined}
      focusable="false"
      className={className}
    >
      {glyphs[name]}
    </svg>
  );
}
