export function createShareSlug(seed: string) {
  const cleanSeed = seed
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 42);

  return `${cleanSeed || "chisme"}-${Date.now().toString(36)}`;
}

export function getBaseUrl() {
  return process.env.NEXTAUTH_URL || "http://localhost:3000";
}

export function createShareUrl(slug: string) {
  return `${getBaseUrl()}/share/${slug}`;
}
