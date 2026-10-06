"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from "react";
import { Icon, type IconName } from "@/components/Icon";
import { WindowContent, getWindowTitle, regularApps, type AppId, type Preferences } from "@/components/PortfolioApps";
import { articles, notesFiles, profile, projects } from "@/data/portfolio";

type Rect = { x: number; y: number; width: number; height: number };
type DesktopWindow = {
  id: string;
  appId: AppId;
  payload?: string;
  title: string;
  rect: Rect;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  restoreRect?: Rect;
};
type MenuKey = "portfolio" | "file" | "view" | "go";
type DesktopFile = { id: string; name: string; kind: "folder" | "note"; payload: string; icon: IconName; detail: string };
type SearchTarget = { title: string; detail: string; icon: IconName; appId: AppId; payload?: string };

const PREFS_KEY = "morgan-os:display-preferences:v1";
const WINDOWS_KEY = "morgan-os:windows:v1";
const defaultPreferences: Preferences = { theme: "light", accent: "orange", wallpaper: "sunset", brightness: 100 };

const initialWindows: DesktopWindow[] = [
  { id: "app:about", appId: "about", title: "About", rect: { x: 242, y: 34, width: 920, height: 640 }, zIndex: 20, minimized: false, maximized: false }
];

const desktopFiles: DesktopFile[] = [
  { id: "work-folder", name: "Selected work", kind: "folder", payload: "projects", icon: "folder", detail: "6 case files" },
  { id: "notes-folder", name: "Studio notes", kind: "folder", payload: "notes", icon: "folder", detail: "3 text files" },
  { id: "readme-file", name: "readme.txt", kind: "note", payload: "readme", icon: "file", detail: "A note from Morgan" },
  { id: "field-notes-file", name: "field-notes.md", kind: "note", payload: "field-notes", icon: "file", detail: "Things worth keeping" }
];

const dockItems: Array<{ id: AppId | "search"; name: string; icon: IconName; divider?: boolean }> = [
  { id: "about", name: "About", icon: "about" },
  { id: "work", name: "Work", icon: "work" },
  { id: "journal", name: "Journal", icon: "journal" },
  { id: "experience", name: "Experience", icon: "experience" },
  { id: "contact", name: "Contact", icon: "contact", divider: true },
  { id: "search", name: "Search", icon: "search" },
  { id: "terminal", name: "Terminal", icon: "terminal", divider: true },
  { id: "settings", name: "Settings", icon: "settings" },
  { id: "help", name: "Help", icon: "help" }
];

function isAppId(value: unknown): value is AppId {
  return typeof value === "string" && ["about", "work", "journal", "experience", "contact", "terminal", "settings", "help", "folder", "note", "project", "article"].includes(value);
}

function sanitizePreferences(value: unknown): Preferences {
  if (!value || typeof value !== "object") return defaultPreferences;
  const raw = value as Partial<Preferences>;
  return {
    theme: raw.theme === "dark" ? "dark" : "light",
    accent: raw.accent === "green" || raw.accent === "blue" || raw.accent === "purple" ? raw.accent : "orange",
    wallpaper: raw.wallpaper === "grove" || raw.wallpaper === "tide" || raw.wallpaper === "paper" ? raw.wallpaper : "sunset",
    brightness: typeof raw.brightness === "number" ? Math.min(100, Math.max(75, raw.brightness)) : 100
  };
}

function sanitizeWindows(value: unknown): DesktopWindow[] | null {
  if (!Array.isArray(value)) return null;
  const parsed: DesktopWindow[] = [];
  for (const candidate of value) {
    if (!candidate || typeof candidate !== "object") continue;
    const item = candidate as Partial<DesktopWindow>;
    if (!isAppId(item.appId) || !item.rect || typeof item.rect !== "object") continue;
    const payload = typeof item.payload === "string" ? item.payload : undefined;
    const id = typeof item.id === "string" ? item.id : "";
    const title = getWindowTitle(item.appId, payload);
    const rect = item.rect as Rect;
    if (!id || ![rect.x, rect.y, rect.width, rect.height].every((n) => typeof n === "number" && Number.isFinite(n))) continue;
    parsed.push({
      id, appId: item.appId, payload, title,
      rect: { x: rect.x, y: rect.y, width: Math.max(300, rect.width), height: Math.max(240, rect.height) },
      zIndex: typeof item.zIndex === "number" ? item.zIndex : 20 + parsed.length,
      minimized: Boolean(item.minimized), maximized: Boolean(item.maximized),
      restoreRect: item.restoreRect && typeof item.restoreRect === "object" ? item.restoreRect : undefined
    });
  }
  return parsed;
}

function windowIdentity(appId: AppId, payload?: string) {
  if (appId === "project" || appId === "article" || appId === "note" || appId === "folder") return `${appId}:${payload ?? "default"}`;
  return `app:${appId}`;
}

function initialRect(appId: AppId, count: number): Rect {
  if (typeof window === "undefined") return { x: 242, y: 34, width: 920, height: 640 };
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const mobile = viewportWidth < 760;
  const sizes: Partial<Record<AppId, [number, number]>> = {
    about: [920, 640], work: [980, 670], project: [860, 660], journal: [820, 630], article: [800, 650],
    experience: [820, 620], contact: [830, 600], terminal: [740, 470], settings: [760, 620], help: [780, 610], folder: [560, 470], note: [620, 500]
  };
  const [wantedWidth, wantedHeight] = sizes[appId] ?? [820, 610];
  const width = mobile ? Math.max(300, viewportWidth - 16) : Math.min(wantedWidth, viewportWidth - 32);
  const height = mobile ? Math.max(300, viewportHeight - 142) : Math.min(wantedHeight, viewportHeight - 146);
  const horizontalOffset = mobile ? 0 : Math.min(count * 26, 104);
  const verticalOffset = mobile ? 8 : Math.min(count * 22, 88);
  const x = mobile ? 8 : Math.max(8, Math.round((viewportWidth - width) / 2 - 55 + horizontalOffset));
  const y = mobile ? 8 : Math.max(10, Math.round((viewportHeight - height) / 2 - 15 + verticalOffset));
  return { x, y, width, height };
}

function maxRect(): Rect {
  if (typeof window === "undefined") return { x: 8, y: 8, width: 1000, height: 600 };
  return { x: 8, y: 8, width: Math.max(280, window.innerWidth - 16), height: Math.max(260, window.innerHeight - 128) };
}

function useDisplayPreferences() {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [restored, setRestored] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PREFS_KEY);
      if (saved) setPreferences(sanitizePreferences(JSON.parse(saved)));
    } catch { /* Storage may be disabled; the defaults still work. */ }
    setRestored(true);
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = preferences.theme;
    root.dataset.accent = preferences.accent;
    root.dataset.wallpaper = preferences.wallpaper;
    root.style.setProperty("--display-brightness", String(preferences.brightness / 100));
    if (restored) {
      try { localStorage.setItem(PREFS_KEY, JSON.stringify(preferences)); } catch { /* private browsing */ }
    }
  }, [preferences, restored]);
  const update = useCallback((patch: Partial<Preferences>) => setPreferences((current) => ({ ...current, ...patch })), []);
  return { preferences, update };
}

function DesktopArtwork() {
  return (
    <svg className="wallpaper-art" viewBox="0 0 520 520" aria-hidden="true">
      <circle className="wallpaper-halo" cx="260" cy="260" r="205" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle className="wallpaper-orb-shadow" cx="266" cy="278" r="128" fill="currentColor" opacity=".16" />
      <circle className="wallpaper-orb" cx="260" cy="260" r="120" fill="currentColor" />
      <path d="M160 267c35-48 71-47 104 0s68 50 98 0" fill="none" stroke="var(--desktop-orbit-line)" strokeWidth="2" />
      <path d="M172 286c30-28 59-28 88 0s57 29 88 0" fill="none" stroke="var(--desktop-orbit-line)" strokeWidth="1.4" opacity=".7" />
      <path d="M235 127c0 0 2-16 18-16M286 395c0 0 2 16 18 16M121 265c0 0-16 2-16 18M398 236c0 0 16 2 16 18" fill="none" stroke="var(--desktop-orbit-line)" strokeWidth="2" strokeLinecap="round" />
      <path d="m335 139 8 18 18 8-18 8-8 18-8-18-18-8 18-8zM151 356l5 11 11 5-11 5-5 11-5-11-11-5 11-5z" fill="var(--desktop-orbit-line)" opacity=".88" />
      <circle cx="379" cy="329" r="4" fill="var(--desktop-orbit-line)" /><circle cx="146" cy="179" r="3" fill="var(--desktop-orbit-line)" />
      <text x="260" y="268" textAnchor="middle" dominantBaseline="middle" className="wallpaper-monogram">M</text>
    </svg>
  );
}

function DesktopIcon({ file, selected, onSelect, onOpen }: { file: DesktopFile; selected: boolean; onSelect: () => void; onOpen: () => void }) {
  const clickTimer = useRef<number | null>(null);
  const handleClick = () => {
    onSelect();
    if (window.matchMedia("(pointer: coarse)").matches) onOpen();
    if (clickTimer.current) window.clearTimeout(clickTimer.current);
    clickTimer.current = window.setTimeout(() => { clickTimer.current = null; }, 220);
  };
  return (
    <button className={`desktop-file ${selected ? "is-selected" : ""}`} onClick={handleClick} onDoubleClick={onOpen} onContextMenu={(event) => { event.preventDefault(); onSelect(); }} aria-label={`${file.name}, ${file.detail}`} title={`${file.name} · ${file.detail}`}>
      <span className={`desktop-file-icon ${file.kind === "folder" ? "desktop-file-icon--folder" : ""}`}><Icon name={file.icon} size={30} strokeWidth={1.45} /></span>
      <span className="desktop-file-label">{file.name}</span>
    </button>
  );
}

function WindowFrame({
  item, active, preferences, onFocus, onClose, onMinimize, onToggleMaximize, onDragStart, onResizeStart, onOpen, onPreferenceChange
}: {
  item: DesktopWindow;
  active: boolean;
  preferences: Preferences;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onDragStart: (event: ReactPointerEvent<HTMLElement>) => void;
  onResizeStart: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onOpen: (appId: AppId, payload?: string) => void;
  onPreferenceChange: (update: Partial<Preferences>) => void;
}) {
  const appIcon = item.appId === "project" ? "image" : item.appId === "article" ? "journal" : item.appId === "note" ? "file" : item.appId === "folder" ? "folder" : regularApps.find((app) => app.id === item.appId)?.icon ?? "file";
  const rect = item.maximized ? maxRect() : item.rect;
  return (
    <article
      className={`os-window ${active ? "is-active" : ""} ${item.maximized ? "is-maximized" : ""}`}
      style={{ left: rect.x, top: rect.y, width: rect.width, height: rect.height, zIndex: item.zIndex }}
      aria-label={`${item.title} window`}
      onPointerDown={onFocus}
    >
      <header className="window-titlebar" onPointerDown={onDragStart} onDoubleClick={(event) => { if (!(event.target as HTMLElement).closest("button")) onToggleMaximize(); }}>
        <span className="window-app-icon"><Icon name={appIcon} size={15} /></span>
        <span className="window-title">{item.title}</span>
        <span className="window-title-context">MORGAN OS</span>
        <div className="window-controls">
          <button className="window-control" type="button" aria-label={`Minimize ${item.title}`} title="Minimize" onClick={(event) => { event.stopPropagation(); onMinimize(); }}><Icon name="minimize" size={12} /></button>
          <button className="window-control" type="button" aria-label={item.maximized ? `Restore ${item.title}` : `Maximize ${item.title}`} title={item.maximized ? "Restore" : "Maximize"} onClick={(event) => { event.stopPropagation(); onToggleMaximize(); }}><Icon name={item.maximized ? "restore" : "maximize"} size={12} /></button>
          <button className="window-control window-control--close" type="button" aria-label={`Close ${item.title}`} title="Close" onClick={(event) => { event.stopPropagation(); onClose(); }}><Icon name="close" size={13} /></button>
        </div>
      </header>
      <div className="window-content"><WindowContent appId={item.appId} payload={item.payload} preferences={preferences} onPreferenceChange={onPreferenceChange} onOpen={onOpen} /></div>
      {!item.maximized ? <button className="window-resize-handle" type="button" aria-label={`Resize ${item.title}`} onPointerDown={onResizeStart}><span /><span /><span /></button> : null}
    </article>
  );
}

function MenuPopover({ menu, onAction, onDismiss }: { menu: MenuKey; onAction: (action: string) => void; onDismiss: () => void }) {
  const definitions: Record<MenuKey, Array<{ label: string; action?: string; shortcut?: string; separator?: boolean; disabled?: boolean; icon?: IconName }>> = {
    portfolio: [
      { label: `About ${profile.name}`, action: "about", icon: "about" },
      { label: "Contact", action: "contact", shortcut: "⌘5", icon: "contact" },
      { separator: true, label: "" },
      { label: "System settings…", action: "settings", icon: "settings" },
      { label: "Help & shortcuts", action: "help", icon: "help" },
      { separator: true, label: "" },
      { label: "Reset desktop", action: "reset", icon: "refresh" }
    ],
    file: [
      { label: "Open selected work", action: "work", shortcut: "⌘2", icon: "work" },
      { label: "Open studio notes", action: "notes", icon: "folder" },
      { label: "Open readme.txt", action: "readme", icon: "file" },
      { separator: true, label: "" },
      { label: "Save", disabled: true, shortcut: "⌘S" },
      { label: "Close active window", action: "close", shortcut: "⌘W", icon: "close" }
    ],
    view: [
      { label: "Quick search…", action: "search", shortcut: "⌘K", icon: "search" },
      { label: "Center active window", action: "center", shortcut: "⌘⇧C", icon: "maximize" },
      { label: "Minimize active window", action: "minimize", shortcut: "⌘M", icon: "minimize" },
      { label: "Display settings…", action: "settings", icon: "sliders" },
      { separator: true, label: "" },
      { label: "Enter full screen", action: "fullscreen", shortcut: "F11", icon: "maximize" }
    ],
    go: [
      { label: "Profile", action: "about", shortcut: "⌘1", icon: "about" },
      { label: "Selected work", action: "work", shortcut: "⌘2", icon: "work" },
      { label: "Journal", action: "journal", shortcut: "⌘3", icon: "journal" },
      { label: "Experience", action: "experience", shortcut: "⌘4", icon: "experience" },
      { label: "Contact", action: "contact", shortcut: "⌘5", icon: "contact" }
    ]
  };
  const titles: Record<MenuKey, string> = { portfolio: "Portfolio", file: "File", view: "View", go: "Go" };
  return (
    <div className="menu-popover" role="menu" aria-label={`${titles[menu]} menu`}>
      <div className="menu-popover-heading">{titles[menu].toUpperCase()}</div>
      {definitions[menu].map((item, index) => item.separator ? <div className="menu-separator" key={`sep-${index}`} /> : <button role="menuitem" key={item.label} disabled={item.disabled} onClick={() => { if (item.action) onAction(item.action); onDismiss(); }}>
        <span className="menu-item-icon">{item.icon ? <Icon name={item.icon} size={15} /> : null}</span><span>{item.label}</span>{item.shortcut ? <kbd>{item.shortcut}</kbd> : null}
      </button>)}
    </div>
  );
}

function SearchOverlay({ onClose, onOpen }: { onClose: () => void; onOpen: (appId: AppId, payload?: string) => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { inputRef.current?.focus(); }, []);
  const allTargets: SearchTarget[] = useMemo(() => [
    { title: "About Morgan", detail: "Profile, background, and tools", icon: "about", appId: "about" },
    { title: "Selected work", detail: "Six projects and case files", icon: "work", appId: "work" },
    { title: "Journal", detail: "Notes on product and frontend work", icon: "journal", appId: "journal" },
    { title: "Experience", detail: "A short work history", icon: "experience", appId: "experience" },
    { title: "Contact", detail: "Send a note", icon: "contact", appId: "contact" },
    { title: "Terminal", detail: "A small local command prompt", icon: "terminal", appId: "terminal" },
    ...projects.map((project) => ({ title: project.name, detail: `Project · ${project.descriptor}`, icon: "image" as IconName, appId: "project" as AppId, payload: project.id })),
    ...articles.map((article) => ({ title: article.title, detail: `Journal · ${article.readTime}`, icon: "journal" as IconName, appId: "article" as AppId, payload: article.id })),
    ...notesFiles.map((file) => ({ title: file.name, detail: "Studio notes · text file", icon: "file" as IconName, appId: "note" as AppId, payload: file.id }))
  ], []);
  const results = query.trim() ? allTargets.filter((target) => `${target.title} ${target.detail}`.toLowerCase().includes(query.toLowerCase())).slice(0, 8) : allTargets.slice(0, 6);
  return (
    <div className="search-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="search-dialog" role="dialog" aria-modal="true" aria-label="Search portfolio">
        <div className="search-dialog-heading"><span className="search-dialog-logo"><Icon name="search" size={17} /></span><div><strong>Find something.</strong><small>Search apps, projects, notes, and writing.</small></div><button type="button" className="search-close" onClick={onClose} aria-label="Close search"><Icon name="close" size={15} /></button></div>
        <div className="search-input-wrap"><Icon name="search" size={18} /><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try “map”, “contact”, or “dashboard”…" onKeyDown={(event) => { if (event.key === "Escape") onClose(); if (event.key === "Enter" && results[0]) { onOpen(results[0].appId, results[0].payload); onClose(); } }} /><kbd>↵</kbd></div>
        <div className="search-results"><div className="search-results-label">{query ? `${results.length} MATCH${results.length === 1 ? "" : "ES"}` : "QUICK ACCESS"}</div>
          {results.length ? results.map((result) => <button className="search-result" key={`${result.appId}:${result.payload ?? result.title}`} onClick={() => { onOpen(result.appId, result.payload); onClose(); }}><span className="search-result-icon"><Icon name={result.icon} size={17} /></span><span><strong>{result.title}</strong><small>{result.detail}</small></span><Icon className="search-result-arrow" name="arrow" size={14} /></button>) : <div className="search-empty">Nothing found. Try a project name or a shorter phrase.</div>}
        </div>
        <div className="search-dialog-footer"><span>LOCAL SEARCH · NO DATA LEAVES THIS DEVICE</span><span><kbd>ESC</kbd> CLOSE</span></div>
      </section>
    </div>
  );
}

function ClockLabel() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);
  const formatted = now ? new Intl.DateTimeFormat("en-CA", { weekday: "short", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false, timeZone: profile.timezone }).format(now) : "--- -- --:--";
  return <time className="menu-clock" dateTime={now?.toISOString()} aria-label={`Local time in ${profile.location}`}>{formatted}<span>ET</span></time>;
}

export default function PortfolioDesktop() {
  const { preferences, update: onPreferenceChange } = useDisplayPreferences();
  const [windows, setWindows] = useState<DesktopWindow[]>(initialWindows);
  const [activeId, setActiveId] = useState<string>(initialWindows[0].id);
  const [windowStateRestored, setWindowStateRestored] = useState(false);
  const [booting, setBooting] = useState(true);
  const [menu, setMenu] = useState<MenuKey | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [contextPoint, setContextPoint] = useState<{ x: number; y: number } | null>(null);
  const [showDock, setShowDock] = useState(true);
  const dragRef = useRef<{ id: string; pointerX: number; pointerY: number; startX: number; startY: number } | null>(null);
  const resizeRef = useRef<{ id: string; pointerX: number; pointerY: number; width: number; height: number } | null>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setBooting(false), 560);
    try {
      const saved = localStorage.getItem(WINDOWS_KEY);
      if (saved) {
        const restoredWindows = sanitizeWindows(JSON.parse(saved));
        if (restoredWindows) {
          setWindows(restoredWindows);
          const front = restoredWindows.filter((item) => !item.minimized).sort((a, b) => b.zIndex - a.zIndex)[0];
          if (front) setActiveId(front.id);
        }
      }
    } catch { /* Start with the sample profile window. */ }
    setWindowStateRestored(true);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!windowStateRestored) return;
    try { localStorage.setItem(WINDOWS_KEY, JSON.stringify(windows)); } catch { /* private browsing */ }
  }, [windows, windowStateRestored]);

  useEffect(() => {
    const fit = () => {
      const usableWidth = window.innerWidth;
      const usableHeight = window.innerHeight - 36;
      setWindows((current) => current.map((item) => {
        if (item.maximized) return { ...item, rect: maxRect() };
        const width = Math.min(item.rect.width, Math.max(280, usableWidth - 16));
        const height = Math.min(item.rect.height, Math.max(250, usableHeight - 76));
        return { ...item, rect: { ...item.rect, x: Math.min(Math.max(8, item.rect.x), Math.max(8, usableWidth - width - 8)), y: Math.min(Math.max(8, item.rect.y), Math.max(8, usableHeight - height - 8)), width, height } };
      }));
    };
    window.addEventListener("resize", fit);
    fit();
    return () => window.removeEventListener("resize", fit);
  }, []);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      if (dragRef.current) {
        const drag = dragRef.current;
        const deltaX = event.clientX - drag.pointerX;
        const deltaY = event.clientY - drag.pointerY;
        setWindows((current) => current.map((item) => item.id === drag.id ? {
          ...item,
          rect: {
            ...item.rect,
            x: Math.min(Math.max(0, drag.startX + deltaX), Math.max(0, window.innerWidth - Math.min(item.rect.width, 220))),
            y: Math.min(Math.max(0, drag.startY + deltaY), Math.max(0, window.innerHeight - 120))
          }
        } : item));
      } else if (resizeRef.current) {
        const resize = resizeRef.current;
        setWindows((current) => current.map((item) => item.id === resize.id ? {
          ...item,
          rect: {
            ...item.rect,
            width: Math.max(320, Math.min(window.innerWidth - item.rect.x - 8, resize.width + event.clientX - resize.pointerX)),
            height: Math.max(260, Math.min(window.innerHeight - item.rect.y - 100, resize.height + event.clientY - resize.pointerY))
          }
        } : item));
      }
    };
    const onPointerUp = () => { dragRef.current = null; resizeRef.current = null; document.body.classList.remove("is-window-moving"); };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  useEffect(() => {
    const dismiss = (event: MouseEvent) => {
      if (menu && menuBarRef.current && !menuBarRef.current.contains(event.target as Node)) setMenu(null);
      if (contextPoint) setContextPoint(null);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMenu(null); setContextPoint(null); if (searchOpen) setSearchOpen(false); }
    };
    document.addEventListener("mousedown", dismiss);
    window.addEventListener("keydown", escape);
    return () => { document.removeEventListener("mousedown", dismiss); window.removeEventListener("keydown", escape); };
  }, [menu, contextPoint, searchOpen]);

  const visibleWindows = useMemo(() => windows.filter((item) => !item.minimized), [windows]);
  const activeWindow = windows.find((item) => item.id === activeId && !item.minimized);
  const nextZ = useCallback((items: DesktopWindow[]) => Math.max(20, ...items.map((item) => item.zIndex)) + 1, []);

  const focusWindow = useCallback((id: string) => {
    setActiveId(id);
    setWindows((current) => current.map((item) => item.id === id ? { ...item, minimized: false, zIndex: nextZ(current) } : item));
  }, [nextZ]);

  const openApp = useCallback((appId: AppId, payload?: string) => {
    const id = windowIdentity(appId, payload);
    setWindows((current) => {
      const top = nextZ(current);
      const existing = current.find((item) => item.id === id);
      if (existing) return current.map((item) => item.id === id ? { ...item, minimized: false, zIndex: top } : item);
      const rect = initialRect(appId, current.length);
      const title = getWindowTitle(appId, payload);
      return [...current, { id, appId, payload, title, rect, zIndex: top, minimized: false, maximized: false }];
    });
    setActiveId(id);
    setMenu(null);
    setContextPoint(null);
    setSearchOpen(false);
  }, [nextZ]);

  const closeWindow = useCallback((id: string) => {
    setWindows((current) => {
      const remaining = current.filter((item) => item.id !== id);
      if (activeId === id) {
        const next = remaining.filter((item) => !item.minimized).sort((a, b) => b.zIndex - a.zIndex)[0];
        setActiveId(next?.id ?? "");
      }
      return remaining;
    });
  }, [activeId]);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((current) => {
      const updated = current.map((item) => item.id === id ? { ...item, minimized: true } : item);
      if (activeId === id) {
        const next = updated.filter((item) => !item.minimized).sort((a, b) => b.zIndex - a.zIndex)[0];
        setActiveId(next?.id ?? "");
      }
      return updated;
    });
  }, [activeId]);

  const toggleMaximize = useCallback((id: string) => {
    setWindows((current) => current.map((item) => {
      if (item.id !== id) return item;
      if (item.maximized) return { ...item, maximized: false, rect: item.restoreRect ?? item.rect, restoreRect: undefined };
      return { ...item, maximized: true, restoreRect: item.rect, rect: maxRect() };
    }));
  }, []);

  const centerActive = useCallback(() => {
    if (!activeWindow) return;
    const rect = activeWindow.maximized ? maxRect() : activeWindow.rect;
    setWindows((current) => current.map((item) => item.id === activeWindow.id ? { ...item, minimized: false, rect: { ...rect, x: Math.max(8, Math.round((window.innerWidth - rect.width) / 2)), y: Math.max(8, Math.round((window.innerHeight - 36 - rect.height) / 2)) } } : item));
    focusWindow(activeWindow.id);
  }, [activeWindow, focusWindow]);

  const resetSystem = useCallback(() => {
    onPreferenceChange(defaultPreferences);
    const homeWindow = { ...initialWindows[0], rect: initialRect("about", 0) };
    setWindows([homeWindow]);
    setActiveId(homeWindow.id);
    setSelectedFile(null);
    try { localStorage.removeItem(WINDOWS_KEY); } catch { /* private browsing */ }
  }, [onPreferenceChange]);

  const runMenuAction = (action: string) => {
    if (isAppId(action)) { openApp(action); return; }
    switch (action) {
      case "search": setSearchOpen(true); break;
      case "notes": openApp("folder", "notes"); break;
      case "readme": openApp("note", "readme"); break;
      case "close": if (activeWindow) closeWindow(activeWindow.id); break;
      case "minimize": if (activeWindow) minimizeWindow(activeWindow.id); break;
      case "center": centerActive(); break;
      case "fullscreen":
        if (document.fullscreenElement) void document.exitFullscreen();
        else void document.documentElement.requestFullscreen?.();
        break;
      case "reset": resetSystem(); break;
    }
  };

  useEffect(() => {
    const shortcuts = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = Boolean(target?.closest("input, textarea, select, [contenteditable='true']"));
      const mod = event.metaKey || event.ctrlKey;
      if (mod && event.key.toLowerCase() === "k") { event.preventDefault(); setSearchOpen(true); setMenu(null); return; }
      if (mod && !event.altKey && !event.shiftKey && ["1", "2", "3", "4", "5"].includes(event.key)) {
        const targetId: Record<string, AppId> = { "1": "about", "2": "work", "3": "journal", "4": "experience", "5": "contact" };
        event.preventDefault(); openApp(targetId[event.key]); return;
      }
      if (mod && event.altKey && event.key.toLowerCase() === "t") { event.preventDefault(); openApp("terminal"); return; }
      if (event.key === "Escape") return;
      if (!isTyping && (event.key === "F1" || (mod && event.key === "/"))) { event.preventDefault(); openApp("help"); }
    };
    window.addEventListener("keydown", shortcuts);
    return () => window.removeEventListener("keydown", shortcuts);
  }, [openApp]);

  const handleDragStart = (item: DesktopWindow, event: ReactPointerEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("button") || item.maximized || window.innerWidth < 760) return;
    event.preventDefault();
    focusWindow(item.id);
    dragRef.current = { id: item.id, pointerX: event.clientX, pointerY: event.clientY, startX: item.rect.x, startY: item.rect.y };
    document.body.classList.add("is-window-moving");
  };

  const handleResizeStart = (item: DesktopWindow, event: ReactPointerEvent<HTMLButtonElement>) => {
    if (item.maximized || window.innerWidth < 760) return;
    event.preventDefault();
    event.stopPropagation();
    focusWindow(item.id);
    resizeRef.current = { id: item.id, pointerX: event.clientX, pointerY: event.clientY, width: item.rect.width, height: item.rect.height };
    document.body.classList.add("is-window-moving");
  };

  const clickDock = (id: AppId | "search") => {
    if (id === "search") { setSearchOpen(true); return; }
    const running = windows.find((item) => item.appId === id && !item.payload);
    if (running?.id === activeId && !running.minimized) { minimizeWindow(running.id); return; }
    openApp(id);
  };

  const openDesktopFile = (file: DesktopFile) => openApp(file.kind === "folder" ? "folder" : "note", file.payload);

  const handleContextMenu = (event: ReactMouseEvent<HTMLElement>) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    setContextPoint({ x: Math.max(8, Math.min(event.clientX - rect.left, rect.width - 198)), y: Math.max(8, Math.min(event.clientY - rect.top, rect.height - 180)) });
    setMenu(null);
  };

  const menuTitles: Record<MenuKey, string> = { portfolio: profile.name, file: "File", view: "View", go: "Go" };
  const isRunning = (appId: AppId) => windows.some((item) => item.appId === appId);

  return (
    <div className="desktop-root">
      <div className={`desktop-wallpaper-layer wallpaper-${preferences.wallpaper}`} aria-hidden="true">
        <div className="wallpaper-grain" />
        <DesktopArtwork />
        <div className="wallpaper-caption"><span>STUDIO DESKTOP</span><span>MADE WITH CARE · EST. 2026</span></div>
      </div>

      <div className="desktop-ui-layer">
        <header className="menu-bar" ref={menuBarRef}>
          <div className="menu-left">
            <button className="menu-logo" aria-label="Open portfolio menu" title="Portfolio menu" onClick={() => setMenu((current) => current === "portfolio" ? null : "portfolio")}><Icon name="logo" size={18} strokeWidth={1.8} /></button>
            <div className="menu-brand-wrap">
              <button className={`menu-brand menu-trigger ${menu === "portfolio" ? "is-open" : ""}`} onClick={() => setMenu((current) => current === "portfolio" ? null : "portfolio")} aria-haspopup="menu" aria-expanded={menu === "portfolio"}>{profile.name}</button>
              {menu === "portfolio" ? <MenuPopover menu="portfolio" onAction={runMenuAction} onDismiss={() => setMenu(null)} /> : null}
            </div>
            {(["file", "view", "go"] as MenuKey[]).map((key) => <div className={`menu-item-wrap menu-item-wrap--${key}`} key={key}>
              <button className={`menu-trigger ${menu === key ? "is-open" : ""}`} onClick={() => setMenu((current) => current === key ? null : key)} aria-haspopup="menu" aria-expanded={menu === key}>{menuTitles[key]}</button>
              {menu === key ? <MenuPopover menu={key} onAction={runMenuAction} onDismiss={() => setMenu(null)} /> : null}
            </div>)}
          </div>
          <div className="menu-right">
            <button className="tray-button tray-search" onClick={() => setSearchOpen(true)} aria-label="Search portfolio" title="Search · Ctrl/⌘ K"><Icon name="search" size={15} /><kbd>⌘K</kbd></button>
            <button className="tray-button tray-status" onClick={() => openApp("settings")} aria-label="Open system settings" title="Display settings"><Icon name="wifi" size={15} /><Icon name="battery" size={16} /></button>
            <button className="tray-button tray-theme" onClick={() => onPreferenceChange({ theme: preferences.theme === "light" ? "dark" : "light" })} aria-label={`Switch to ${preferences.theme === "light" ? "dark" : "light"} appearance`} title="Toggle appearance"><Icon name={preferences.theme === "light" ? "moon" : "sun"} size={15} /></button>
            <ClockLabel />
          </div>
        </header>

        <main className="workspace" id="app-content" aria-label="Portfolio desktop workspace" onContextMenu={handleContextMenu} onClick={(event) => { if (event.target === event.currentTarget) { setSelectedFile(null); setContextPoint(null); } }}>
          <nav className="desktop-icons" aria-label="Desktop files">
            {desktopFiles.map((file) => <DesktopIcon key={file.id} file={file} selected={selectedFile === file.id} onSelect={() => setSelectedFile(file.id)} onOpen={() => openDesktopFile(file)} />)}
          </nav>
          <div className="desktop-hint"><span className="hint-dot" /> DOUBLE-CLICK TO OPEN <span className="hint-separator">·</span> DRAG WINDOWS TO MOVE</div>

          {visibleWindows.map((item) => <WindowFrame
            key={item.id}
            item={item}
            active={item.id === activeId}
            preferences={preferences}
            onFocus={() => focusWindow(item.id)}
            onClose={() => closeWindow(item.id)}
            onMinimize={() => minimizeWindow(item.id)}
            onToggleMaximize={() => toggleMaximize(item.id)}
            onDragStart={(event) => handleDragStart(item, event)}
            onResizeStart={(event) => handleResizeStart(item, event)}
            onOpen={openApp}
            onPreferenceChange={onPreferenceChange}
          />)}

          {showDock ? <nav className="app-dock" aria-label="Desktop apps">
            <div className="dock-apps">{dockItems.map((item) => {
              const running = item.id !== "search" && isRunning(item.id);
              const active = item.id !== "search" && windows.some((win) => win.appId === item.id && win.id === activeId && !win.minimized);
              return <div className="dock-item-wrap" key={item.id}>
                {item.divider ? <span className="dock-divider" /> : null}
                <button className={`dock-item ${active ? "is-active" : ""} ${running ? "is-running" : ""}`} title={item.name} aria-label={`${item.name}${running ? ", open" : ""}`} onClick={() => clickDock(item.id)}>
                  <Icon name={item.icon} size={21} strokeWidth={1.6} />
                  {running ? <i className="dock-running-dot" /> : null}
                </button>
                <span className="dock-tooltip">{item.name}</span>
              </div>;
            })}</div>
            <div className="dock-caption"><span>WORKSPACE</span><span>{String(windows.filter((item) => !item.minimized).length).padStart(2, "0")} OPEN</span></div>
          </nav> : <button className="dock-reveal" onClick={() => setShowDock(true)} aria-label="Show app dock"><Icon name="grid" size={18} /></button>}

          {contextPoint ? <div className="desktop-context-menu" role="menu" style={{ left: contextPoint.x, top: contextPoint.y }} onClick={(event) => event.stopPropagation()}>
            <div className="context-menu-heading">DESKTOP</div>
            <button role="menuitem" onClick={() => openApp("work")}><Icon name="work" size={15} /> Open selected work</button>
            <button role="menuitem" onClick={() => openApp("note", "readme")}><Icon name="file" size={15} /> Open readme.txt</button>
            <div className="menu-separator" />
            <button role="menuitem" onClick={() => openApp("settings")}><Icon name="settings" size={15} /> Change wallpaper…</button>
            <button role="menuitem" onClick={() => setShowDock((value) => !value)}><Icon name="grid" size={15} /> {showDock ? "Hide dock" : "Show dock"}</button>
          </div> : null}
        </main>

        <div className="workspace-status"><span>LOCAL SESSION</span><span>ALL SYSTEMS QUIET <i /></span></div>
      </div>

      {searchOpen ? <SearchOverlay onClose={() => setSearchOpen(false)} onOpen={openApp} /> : null}
      {booting ? <div className="boot-overlay" role="status" aria-live="polite"><div className="boot-card"><div className="boot-mark"><Icon name="logo" size={24} /></div><span className="boot-kicker">MORGAN OS · PORTFOLIO EDITION</span><strong>Setting up the desk</strong><span className="boot-loader"><i /></span><small>One moment, please.</small></div></div> : null}
    </div>
  );
}
