// Prototyp: alles gesperrt. Live: alles erlaubt plus Sitemap.
export function GET() {
  const live = import.meta.env.PUBLIC_MODE === 'live';
  const body = live
    ? 'User-agent: *\nAllow: /\n\nSitemap: https://marcelkuhls.de/sitemap-index.xml\nSitemap: https://marcelkuhls.de/sitemap-images.xml\n'
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
