# Reference study & recreation notes

Reference studied: [wesdieleman.com](https://www.wesdieleman.com/)

## What the reference is doing

This is not a conventional long-scrolling portfolio with a desktop-themed hero. The desktop metaphor is the navigation model: the viewport is a workspace, apps open into movable windows, and the dock and top menu bar are the primary routes into the content.

The public shell and route content show a persistent menubar, wallpaper layer, left-side desktop items, bottom app launcher, and app windows for About, Works, Blog, Contact, Terminal, Experience, Help, Search, and Settings. The windows can be moved, resized, minimized, maximized, focused, and restored. Project case files and blog entries can open in their own windows; keyboard shortcuts and search provide alternate paths through the same content.

The visual language is deliberately restrained: squared window chrome, thin borders, compact utility labels, warm paper-like content panels, a bright accent desktop, a small set of colour themes, a dark appearance, and an Amsterdam-local clock. The site’s public metadata and bundled stylesheet identify the stack as Next.js 16, React 19, and Tailwind CSS 4.

## What this template carries forward

- Full-screen desktop workspace with a compact system menubar and an app dock.
- Desktop files and folders, a contextual desktop menu, and window controls.
- Draggable/resizable windows on desktop and a fitted panel layout on narrow screens.
- About, projects and case studies, journal posts, experience, contact, settings, help, notes, search, and a small terminal.
- Light/dark themes, four accent palettes, four local wallpapers, brightness control, and browser-persisted display preferences.
- Search and keyboard navigation alongside visible buttons, with no remote service required for the demo.
- Next.js App Router, React, TypeScript, Tailwind CSS 4, and a static export ready for GitHub Pages.

## What is intentionally different

The name, copy, projects, dates, artwork, profile illustration, desktop mark, and portfolio details are original sample content for this template. The illustrations are hand-authored local SVGs rather than the reference portfolio’s photos, project media, or dog artwork. The interface is implemented from scratch; no reference site source code or private media is included.

The demo profile is fictional. Update `src/data/portfolio.ts`, the assets in `public/art/`, and the page metadata before presenting the site as your own work. The contact form uses `mailto:` until you connect a form endpoint.
