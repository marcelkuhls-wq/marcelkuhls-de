// Bewegungssystem des Prototyps.
// Grundsatz: Inhalte sind ohne JS vollständig sichtbar. Erst die Klasse
// `motion` auf <html> aktiviert die Startzustände der Animationen.
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------- Navigation (immer aktiv, auch bei reduzierter Bewegung) ---------- */
function initNav() {
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  if (!header) return;

  let last = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    // Beim Runterscrollen ausblenden, beim Hochscrollen zeigen
    if (!root.classList.contains('menu-open')) {
      header.classList.toggle('is-hidden', y > 400 && y > last + 4);
      if (y < last - 4) header.classList.remove('is-hidden');
    }
    last = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Header über dunklen Sektionen hell darstellen
  const darks = document.querySelectorAll('[data-theme-dark]');
  if (darks.length) {
    const io = new IntersectionObserver(() => {
      const probe = header.offsetHeight / 2;
      const over = [...darks].some((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= probe && r.bottom >= probe;
      });
      header.classList.toggle('on-dark', over);
    }, { threshold: [0, 0.01, 0.99, 1], rootMargin: '0px 0px -90% 0px' });
    darks.forEach((d) => io.observe(d));
    window.addEventListener('scroll', () => {
      const probe = header.offsetHeight / 2;
      header.classList.toggle('on-dark', [...darks].some((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= probe && r.bottom >= probe;
      }));
    }, { passive: true });
  }

  if (!toggle || !menu) return;
  const links = menu.querySelectorAll('a');
  const setOpen = (open) => {
    root.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    menu.toggleAttribute('inert', !open);
    if (open) {
      header.classList.remove('is-hidden');
      window.__lenis?.stop();
      links[0]?.focus({ preventScroll: true });
    } else {
      window.__lenis?.start();
    }
  };
  menu.setAttribute('inert', '');
  toggle.addEventListener('click', () => setOpen(!root.classList.contains('menu-open')));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && root.classList.contains('menu-open')) { setOpen(false); toggle.focus(); }
  });
  links.forEach((a) => a.addEventListener('click', () => setOpen(false)));
}

/* ---------- Diashow (immer aktiv) ---------- */
function initLightbox() {
  const links = [...document.querySelectorAll('a[data-lb]')];
  if (!links.length) return;
  const box = document.createElement('div');
  box.className = 'lb';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Diashow');
  box.hidden = true;
  box.innerHTML = `
    <div class="lb__top"><span class="lb__count" aria-live="polite"></span><button class="lb__close" type="button" aria-label="Diashow schließen">Schließen <span aria-hidden="true">✕</span></button></div>
    <div class="lb__stage"><img class="lb__img" alt="" /></div>
    <button class="lb__nav lb__nav--prev" type="button" aria-label="Vorheriges Bild">←</button>
    <button class="lb__nav lb__nav--next" type="button" aria-label="Nächstes Bild">→</button>
    <div class="lb__bar"><i></i></div>`;
  document.body.appendChild(box);
  const img = box.querySelector('.lb__img');
  const count = box.querySelector('.lb__count');
  const bar = box.querySelector('.lb__bar i');
  let idx = 0;
  let lastFocus = null;
  const preload = (i) => { const l = links[(i + links.length) % links.length]; if (l) { const p = new Image(); p.src = l.href; } };
  const show = (i, dir = 0) => {
    idx = (i + links.length) % links.length;
    const l = links[idx];
    img.classList.remove('is-in');
    img.style.setProperty('--dx', `${dir * 40}px`);
    const next = new Image();
    next.onload = () => { img.src = l.href; img.alt = l.dataset.lbAlt || ''; requestAnimationFrame(() => img.classList.add('is-in')); };
    next.src = l.href;
    count.textContent = `${idx + 1} / ${links.length}`;
    bar.style.transform = `scaleX(${(idx + 1) / links.length})`;
    preload(idx + 1); preload(idx - 1);
  };
  const open = (i) => {
    lastFocus = document.activeElement;
    box.hidden = false;
    document.documentElement.classList.add('lb-open');
    window.__lenis?.stop();
    requestAnimationFrame(() => box.classList.add('is-open'));
    show(i);
    box.querySelector('.lb__close').focus();
  };
  const close = () => {
    box.classList.remove('is-open');
    document.documentElement.classList.remove('lb-open');
    window.__lenis?.start();
    setTimeout(() => { box.hidden = true; img.removeAttribute('src'); }, 300);
    lastFocus?.focus?.();
  };
  links.forEach((l, i) => l.addEventListener('click', (e) => { e.preventDefault(); open(i); }));
  box.querySelector('.lb__close').addEventListener('click', close);
  box.querySelector('.lb__nav--prev').addEventListener('click', () => show(idx - 1, -1));
  box.querySelector('.lb__nav--next').addEventListener('click', () => show(idx + 1, 1));
  box.querySelector('.lb__stage').addEventListener('click', (e) => { if (e.target === e.currentTarget) close(); });
  document.addEventListener('keydown', (e) => {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(idx + 1, 1);
    if (e.key === 'ArrowLeft') show(idx - 1, -1);
    if (e.key === 'Tab') { // Fokus im Dialog halten
      const f = [...box.querySelectorAll('button')];
      const at = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(at + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });
  let x0 = null;
  box.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 45) show(idx + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    x0 = null;
  });
}

/* ---------- Formular: live über Web3Forms, im Prototyp ohne Versand ---------- */
function initForms() {
  document.querySelectorAll('[data-demo-form]').forEach((form) => {
    // Stufen-Auswahl als Chips
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const name = String(data.get('name') || '').split(' ')[0];
      const done = form.parentElement.querySelector('[data-form-done]');
      // Live: an Web3Forms senden. Prototyp: kein data-endpoint, es wird nichts verschickt.
      if (form.dataset.endpoint) {
        const btn = form.querySelector('[type="submit"]');
        const err = form.querySelector('[data-form-error]');
        btn.disabled = true;
        if (err) err.hidden = true;
        try {
          const res = await fetch(form.dataset.endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
          const json = await res.json();
          if (!json.success) throw new Error(json.message);
          window.mkTrack?.('generate_lead', { form: 'kontakt', kind: String(data.get('kind') || ''), page: location.pathname });
        } catch {
          btn.disabled = false;
          if (err) err.hidden = false;
          return;
        }
      }
      if (done) {
        done.querySelector('[data-done-name]').textContent = name ? `, ${name}` : '';
        form.hidden = true;
        done.hidden = false;
        done.focus();
        window.scrollTo({ top: done.getBoundingClientRect().top + window.scrollY - 140, behavior: reduce ? 'auto' : 'smooth' });
      }
    });
    form.querySelectorAll('textarea').forEach((t) => {
      const counter = form.querySelector(`[data-count-for="${t.name}"]`);
      const upd = () => { if (counter) counter.textContent = `${t.value.length} Zeichen`; };
      t.addEventListener('input', upd); upd();
    });
  });
}

/* ---------- Zeilenweise Text-Reveals ---------- */
function splitWords(el) {
  if (el.dataset.splitDone) return;
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === 3) {
        const parts = child.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('span');
          w.className = 'w';
          const i = document.createElement('span');
          i.className = 'wi';
          i.textContent = p;
          w.appendChild(i);
          frag.appendChild(w);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === 1 && child.tagName !== 'BR') {
        walk(child);
      }
    });
  };
  walk(el);
  el.dataset.splitDone = '1';
}

function initMotion() {
  const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95, smoothWheel: true });
  window.__lenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  // Anker-Links sanft scrollen
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -90 });
    });
  });

  // Headlines: Wörter steigen aus einer Maske auf
  document.querySelectorAll('[data-split]').forEach((el) => {
    splitWords(el);
    const words = el.querySelectorAll('.wi');
    const immediate = el.hasAttribute('data-split-now');
    gsap.fromTo(words, { y: 0, yPercent: 115, rotate: 4 }, {
      y: 0, yPercent: 0, rotate: 0, duration: 1.15, ease: 'expo.out', stagger: 0.045,
      delay: immediate ? 0.25 : 0,
      scrollTrigger: immediate ? undefined : { trigger: el, start: 'top 88%' },
      onComplete: () => el.classList.add('is-in'),
    });
  });

  // Fließtext und kleine Elemente: weiches Einblenden
  gsap.utils.toArray('[data-fade]').forEach((el) => {
    gsap.fromTo(el, { y: 28, autoAlpha: 0 }, {
      y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out',
      delay: parseFloat(el.dataset.fade) || 0,
      scrollTrigger: { trigger: el, start: 'top 92%' },
    });
  });

  // Bilder: Vorhang öffnet sich, Bild zoomt leicht zurück
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    const img = el.querySelector('img');
    const dir = el.dataset.reveal || 'up';
    const from = { up: 'inset(100% 0% 0% 0%)', left: 'inset(0% 100% 0% 0%)', right: 'inset(0% 0% 0% 100%)', center: 'inset(18% 18% 18% 18%)' }[dir] || 'inset(100% 0% 0% 0%)';
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 90%' } });
    tl.fromTo(el, { clipPath: from }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' });
    if (img) tl.fromTo(img, { scale: 1.22 }, { scale: 1, duration: 1.8, ease: 'expo.out' }, 0.1);
  });

  // Parallax innerhalb des Bildrahmens (Rahmen bleibt stehen)
  gsap.utils.toArray('[data-parallax]').forEach((el) => {
    const inner = el.querySelector('img, [data-parallax-inner]');
    if (!inner) return;
    const amt = parseFloat(el.dataset.parallax) || 10;
    gsap.set(inner, { scale: 1 + amt / 50 });
    gsap.fromTo(inner, { yPercent: -amt }, {
      yPercent: amt, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  // Elemente, die sich gegeneinander verschieben (versetzte Bildpaare)
  gsap.utils.toArray('[data-drift]').forEach((el) => {
    const amt = parseFloat(el.dataset.drift) || 60;
    gsap.fromTo(el, { y: amt }, {
      y: -amt, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  // Hero: Bild wird beim Scrollen kleiner, Typo wandert
  const hero = document.querySelector('[data-hero]');
  if (hero) {
    const media = hero.querySelector('[data-hero-media]');
    const tl = gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    if (media) tl.to(media, { scale: 0.86, borderRadius: '6px', ease: 'none' }, 0);
    hero.querySelectorAll('[data-hero-shift]').forEach((t) => {
      tl.to(t, { xPercent: parseFloat(t.dataset.heroShift), ease: 'none' }, 0);
    });
    gsap.fromTo(hero.querySelector('[data-hero-img]'), { scale: 1.18 }, { scale: 1, duration: 2.4, ease: 'expo.out' });
  }

  // Wort für Wort aufhellender Absatz (Statement)
  document.querySelectorAll('[data-scrub-text]').forEach((el) => {
    splitWords(el);
    gsap.fromTo(el.querySelectorAll('.wi'), { opacity: 0.16 }, {
      opacity: 1, stagger: 0.08, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
    });
  });

  // Horizontale Bildsequenz: ab Tablet gepinnt, mobil natives Wischen
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', () => {
    document.querySelectorAll('[data-hscroll]').forEach((wrap) => {
      const track = wrap.querySelector('[data-hscroll-track]');
      const bar = wrap.querySelector('[data-hscroll-bar]');
      const dist = () => track.scrollWidth - window.innerWidth;
      const st = gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: {
          trigger: wrap, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true,
          onUpdate: (s) => { if (bar) bar.style.transform = `scaleX(${s.progress})`; },
        },
      });
      return () => st.kill();
    });
  });

  // Zahlen/Kapitelmarken: Linie wächst mit
  gsap.utils.toArray('[data-line]').forEach((el) => {
    gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%' } });
  });

  // Cursor-Label über Reportage-Karten (nur Maus)
  if (finePointer) {
    const dot = document.createElement('div');
    dot.className = 'cursor-label';
    dot.setAttribute('aria-hidden', 'true');
    dot.textContent = 'Ansehen';
    document.body.appendChild(dot);
    const xTo = gsap.quickTo(dot, 'x', { duration: 0.45, ease: 'power3' });
    const yTo = gsap.quickTo(dot, 'y', { duration: 0.45, ease: 'power3' });
    window.addEventListener('pointermove', (e) => { xTo(e.clientX); yTo(e.clientY); }, { passive: true });
    document.querySelectorAll('[data-cursor]').forEach((el) => {
      el.addEventListener('pointerenter', () => { dot.textContent = el.dataset.cursor || 'Ansehen'; dot.classList.add('is-on'); });
      el.addEventListener('pointerleave', () => dot.classList.remove('is-on'));
    });
  }

  // Nach dem Laden aller Bilder neu messen
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

initNav();
initForms();
initLightbox();
if (!reduce) {
  root.classList.add('motion');
  initMotion();
  root.classList.add('motion-ready');
} else {
  root.classList.remove('motion');
  root.classList.add('reduced');
}
