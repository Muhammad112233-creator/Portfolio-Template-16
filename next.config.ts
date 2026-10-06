import type { NextConfig } from "next";

/**
 * GitHub Pages serves project sites from /<repository-name>/.
 * GITHUB_REPOSITORY is set by Actions during the production build, so the
 * same source also works locally at http://localhost:3000 without a prefix.
 */
const repository = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isUserOrOrganizationSite = repository.endsWith(".github.io");
const basePath = process.env.GITHUB_ACTIONS === "true" && repository && !isUserOrOrganizationSite
  ? `/${repository}`
  : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: { unoptimized: true },
};

export default nextConfig;
