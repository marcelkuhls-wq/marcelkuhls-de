// Live-Build: interne Prüfnotizen (class="todo") aus dem HTML entfernen, statt sie nur per CSS zu verstecken.
// Im Prototyp (lokal) bleiben sie sichtbar. Liste aller Notizen: npm run todos
import { defineMiddleware } from 'astro:middleware';

const LIVE = import.meta.env.PUBLIC_MODE === 'live';
const TODO = /<(p|span|div)\b[^>]*\bclass="todo"[^>]*>[\s\S]*?<\/\1>/g;

export const onRequest = defineMiddleware(async (_ctx, next) => {
  const res = await next();
  if (!LIVE || !(res.headers.get('content-type') ?? '').includes('text/html')) return res;
  const html = (await res.text()).replace(TODO, '');
  return new Response(html, { status: res.status, headers: res.headers });
});
