// Bandcamp's embeddable player needs the numeric album id, which isn't in the
// public album URL — it's in the page's "bc-page-properties" meta tag.
export async function getBandcampAlbumId(url: string): Promise<string | null> {
  try {
    const href = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    if (!/(^|\.)bandcamp\.com$/i.test(new URL(href).hostname)) return null;

    const res = await fetch(href, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const html = await res.text();
    return html.match(/item_id(?:&quot;|")\s*:\s*(\d+)/)?.[1] ?? null;
  } catch {
    return null;
  }
}
