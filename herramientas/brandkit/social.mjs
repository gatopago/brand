/**
 * Social media proposals for GatoPago: posts (4:5, 1:1), stories (9:16) and banners, as SVG (text traced from the
 * local Recursive, no font lookup) and PNG, plus a review gallery and the caption of every piece.
 * Output: contenido/redes/2026-10. Usage: npm run brandkit:social
 * Content follows brandkit/01-manual/identidad-y-voz.md: no unverified promises, the alpha is stated, the cat has no public name.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import * as fontkit from 'fontkit';
import wawoff2 from 'wawoff2';
import { parse, svg as pixelSvg } from './pixmap.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const KIT = path.join(root, 'brandkit');
const OUT = path.join(root, 'contenido/redes/2026-10');
const ICONS = path.join(root, 'brandkit/11-iconos/svg');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ---------------------------------------------------------------------------------------------- brand resources
const { tokens } = JSON.parse(await fs.readFile(path.join(KIT, '05-colores/tokens.json'), 'utf8'));
const T = n => tokens['--meli-' + n].toUpperCase();
const C = { fire: T('cat-fire'), shadow: T('cat-shadow'), deep: T('cat-deep'), ink: T('ink'), milk: T('milk'), paper: T('paper'), oat: T('oat'), stone: T('stone') };
const THEMES = {
  milk: { bg: C.milk, fg: C.ink, sub: '#5F5650', kicker: C.deep, accent: C.fire, deco: [C.fire, C.shadow, C.deep], chip: false, card: C.paper, line: C.ink },
  oat: { bg: C.oat, fg: C.ink, sub: '#5F5650', kicker: C.deep, accent: C.fire, deco: [C.fire, C.shadow, C.deep], chip: false, card: C.paper, line: C.ink },
  ink: { bg: C.ink, fg: C.milk, sub: '#BDB4AA', kicker: C.fire, accent: C.fire, deco: [C.fire, C.shadow, C.deep], chip: true, card: '#1D1D24', line: C.milk },
  fire: { bg: C.fire, fg: C.ink, sub: '#3B1712', kicker: C.ink, accent: C.ink, deco: [C.ink, C.deep, C.shadow], chip: true, card: C.milk, line: C.ink },
};
const font = fontkit.create(Buffer.from(await wawoff2.decompress(await fs.readFile(path.join(KIT, '04-tipografia/recursive/files/recursive-latin-full-normal.woff2')))));
const FACES = {
  display: font.getVariation({ MONO: 0, CASL: 1, wght: 760, slnt: 0, CRSV: 0.5 }),
  body: font.getVariation({ MONO: 0, CASL: 0, wght: 460, slnt: 0, CRSV: 0.5 }),
  strong: font.getVariation({ MONO: 0, CASL: 0.4, wght: 680, slnt: 0, CRSV: 0.5 }),
  mono: font.getVariation({ MONO: 1, CASL: 0, wght: 620, slnt: 0, CRSV: 0.5 }),
};
const TRACK = { display: -0.045, body: -0.01, strong: -0.015, mono: 0.04 };
const symbolSvg = pixelSvg(parse(await fs.readFile(path.join(KIT, '02-logos/modelo/simbolo.txt'), 'utf8')), 'GatoPago');
const SYMBOL_BODY = symbolSvg.slice(symbolSvg.indexOf('>') + 1, symbolSvg.lastIndexOf('</svg>'));

// ---------------------------------------------------------------------------------------------- drawing helpers
function measure(str, size, face) {
  const f = FACES[face], run = f.layout(str), k = size / f.unitsPerEm;
  for (const g of run.glyphs) if (g.id === 0 && str.trim()) throw new Error(`Missing glyph in "${str}"`);
  return run.positions.reduce((n, p) => n + p.xAdvance * k, 0) + TRACK[face] * size * Math.max(0, run.glyphs.length - 1);
}
/** One line of traced text. anchor: start | middle | end. */
function text(str, x, y, size, fill, face = 'body', anchor = 'start') {
  const f = FACES[face], run = f.layout(str), k = size / f.unitsPerEm, w = measure(str, size, face);
  let cx = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
  const paths = run.glyphs.map((g, i) => { const p = run.positions[i]; const d = g.path.toSVG(); const m = d ? `<path d="${d}" transform="translate(${(cx + p.xOffset * k).toFixed(2)} ${(y - p.yOffset * k).toFixed(2)}) scale(${k.toFixed(5)} ${(-k).toFixed(5)})"/>` : ''; cx += p.xAdvance * k + TRACK[face] * size; return m; }).join('');
  return `<g fill="${fill}" aria-label="${esc(str)}">${paths}</g>`;
}
/** Lines that shrink together until the widest fits maxW. Returns markup and the y after the block. */
function block(lines, x, y, size, fill, { face = 'body', lh = 1.2, maxW = Infinity, anchor = 'start', min = 0.55, grow = 0 } = {}) {
  let s = size; const widest = () => Math.max(...lines.map(l => measure(l, s, face)));
  while (grow && s < grow && widest() < maxW * 0.97) s += 1;
  while (widest() > maxW && s > size * min) s -= 1;
  if (widest() > maxW) throw new Error(`Text does not fit: ${lines.join(' / ')}`);
  let markup = '', yy = y;
  lines.forEach((l, i) => { if (i) yy += s * lh; markup += text(l, x, yy, s, fill, face, anchor); });
  return { markup, bottom: yy, size: s, width: widest() };
}
const rect = (x, y, w, h, fill, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;
const symbol = (x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})" shape-rendering="crispEdges">${SYMBOL_BODY}</g>`;
/** Staircase of blocks rising to the right (the "camino"). */
function steps(x, y, unit, n, colors) {
  let m = '';
  for (let i = 0; i < n; i++) { const c = colors[i % colors.length]; m += rect(x + i * unit * 1.6, y - (i + 1) * unit * 0.62, unit * 1.6, (i + 1) * unit * 0.62, c); }
  return m;
}
/** Dashed rail with square nodes, the payment path motif. */
function rail(x1, y, x2, color, nodes = [], nodeColor = color, size = 16) {
  let m = '';
  for (let x = x1; x < x2; x += 14) m += rect(x, y - 2, Math.min(9, x2 - x), 4, color);
  for (const t of nodes) m += rect(Math.round(x1 + (x2 - x1) * t - size / 2), y - size / 2, size, size, nodeColor);
  return m;
}
function vrail(x, y1, y2, color) { let m = ''; for (let y = y1; y < y2; y += 14) m += rect(x - 2, y, 4, Math.min(9, y2 - y), color); return m; }
const iconCache = {};
async function icon(name, x, y, size, color) {
  const raw = iconCache[name] ??= await fs.readFile(path.join(ICONS, `${name}.svg`), 'utf8');
  const inner = raw.slice(raw.indexOf('>') + 1, raw.lastIndexOf('</svg>')).replace(/<title[^>]*>.*?<\/title>/s, '');
  return `<g transform="translate(${x} ${y}) scale(${size / 24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter">${inner}</g>`;
}
const catCache = {};
async function cat(id, x, y, h, anchor = 'bottom-right') {
  const c = catCache[id] ??= await (async () => { const file = path.join(KIT, '03-personaje/estaticos', `${id}.png`); const m = await sharp(file).metadata(); return { uri: 'data:image/png;base64,' + (await fs.readFile(file)).toString('base64'), w: m.width, h: m.height }; })();
  const w = Math.round(c.w * h / c.h), X = anchor.includes('right') ? x - w : anchor.includes('center') ? x - w / 2 : x, Y = anchor.includes('bottom') ? y - h : y;
  return { markup: `<image href="${c.uri}" x="${X.toFixed(1)}" y="${Y.toFixed(1)}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/>`, w, x: X, y: Y };
}
function kicker(str, x, y, th, size = 24) {
  return rect(x, y - size * 0.62, size * 0.5, size * 0.5, th.kicker) + text(str.toUpperCase(), x + size * 0.85, y, size, th.kicker, 'mono');
}
/** Signature: symbol (on a Milk chip over dark or Cat Fire backgrounds), name, domain. */
/** Bottom of the footer. Stories keep it above the reply bar that Instagram and TikTok draw over the last ~250 px. */
const FOOT = (W, H, M) => H / W > 1.6 ? H - 250 : H - M;
function footer(W, H, M, th, { domain = true, scale = 2 } = {}) {
  const sw = 30 * scale, sh = 23 * scale, y = FOOT(W, H, M) - sh;
  let m = '';
  if (th.chip) m += rect(M - 10, y - 10, sw + 20, sh + 20, C.milk);
  m += symbol(M, y, scale);
  m += text('GatoPago', M + sw + (th.chip ? 30 : 18), y + sh * 0.78, sh * 0.78, th.fg, 'display');
  if (domain) m += text('gatopago.com', W - M, y + sh * 0.7, 22, th.sub, 'mono', 'end');
  return m;
}
const tab = (W, M, th) => rect(W - M - 60, 0, 60, 12, th === THEMES.fire ? C.ink : C.fire) + rect(W - M - 78, 0, 18, 12, C.deep);
const note = (str, x, y, th, anchor = 'start') => text(str, x, y, 19, th.sub, 'mono', anchor);
const ALPHA = 'Alpha en testnet · fondos de prueba';

// ---------------------------------------------------------------------------------------------- templates
const FORMATS = { '4x5': [1080, 1350], '1x1': [1080, 1080], '9x16': [1080, 1920] };
function frame(W, H, th, body, title) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)}">${rect(0, 0, W, H, th.bg)}${body}</svg>\n`;
}
/** Moves the content block down by a share of the free space, so posters breathe instead of leaving a hole. */
const bal = (markup, bottom, limit, f) => { const dy = Math.max(0, Math.round((limit - bottom) * f)); return dy ? `<g transform="translate(0 ${dy})">${markup}</g>` : markup; };
const TEMPLATES = {
  /** Big headline, optional sub, decoration: steps | rail | icon:<name>. */
  async titular(p, W, H, th) {
    const M = W * 0.0815, story = H / W > 1.6, top = story ? 300 : M + 70;
    let m = tab(W, M, th) + kicker(p.kicker || 'GatoPago', M, top, th); const k = m.length;
    const cap = story ? 176 : H > W ? 150 : 128;
    const head0 = block(p.head, M, 0, 60, th.fg, { face: 'display', lh: 1.0, maxW: W - 2 * M, grow: cap }), hs = head0.size;
    const head = block(p.head, M, top + hs * 1.15, hs, th.fg, { face: 'display', lh: 1.0, maxW: W - 2 * M });
    m += head.markup;
    if (p.accentLast) { /* underline block under the last line */ m += rect(M, head.bottom + hs * 0.18, hs * 1.6, hs * 0.12, th.accent); }
    let y = head.bottom + hs * (p.accentLast ? 0.75 : 0.62);
    if (p.sub) { const s = block(p.sub, M, y, story ? 52 : H > W ? 44 : 40, th.sub, { lh: 1.35, maxW: W - 2 * M - (p.deco === 'steps' ? 0 : 0) }); m += s.markup; y = s.bottom; }
    const fy = FOOT(W, H, M) - 46 - 40;
    const decoTop = p.deco === 'steps' ? fy - 270 : p.deco === 'rail' || p.deco === 'frontera' ? fy - 150 : p.deco?.startsWith('icon:') ? fy - 260 : fy - 40;
    m = m.slice(0, k) + bal(m.slice(k), y, decoTop - 60, 0.35);
    if (p.deco === 'steps') m += steps(W - M - 4 * 1.6 * 84, fy - 30, 84, 4, th.deco);
    if (p.deco === 'rail') m += rail(M, fy - 70, W - M, th.line, [0.18, 0.52, 0.86], th.accent, 20);
    if (p.deco === 'frontera') {
      const y = fy - 80, u = 36, bx = Math.round(M + (W - 2 * M) * 0.56);
      m += rail(M, y, bx - u - 30, th.line) + rect(M - 8, y - 8, 16, 16, th.line);
      m += rect(bx - u - 22, y - u / 2, u, u, th.accent);
      m += rect(bx, y - u * 1.5, u, u, th.deco[2]) + rect(bx, y - u / 2, u, u, th.deco[1]) + rect(bx, y + u / 2, u, u, th.deco[2]);
      m += `<g opacity="0.35">${rail(bx + u + 24, y, W - M, th.line)}</g>`;
    }
    if (p.deco?.startsWith('icon:')) m += await icon(p.deco.slice(5), W - M - 200, fy - 240, 200, th.accent);
    if (p.alpha) m += note(ALPHA, M, fy - (p.deco === 'rail' ? 110 : 20), th);
    return m + footer(W, H, M, th);
  },
  /** A numbered tip with an icon card. */
  async consejo(p, W, H, th) {
    const M = W * 0.0815, story = H / W > 1.6, top = story ? 300 : M + 70;
    let m = tab(W, M, th) + kicker(`${p.label || 'Consejo'} ${p.n}`, M, top, th); const k = m.length;
    const box = story ? 250 : H > W ? 216 : 176, by = top + 60;
    m += rect(M + 10, by + 10, box, box, th.deco[2]) + rect(M, by, box, box, th.accent === C.ink ? C.milk : th.accent);
    m += await icon(p.icon, M + box * 0.2, by + box * 0.2, box * 0.6, th === THEMES.fire ? C.ink : th.accent === C.fire ? C.ink : C.milk);
    const hs = block(p.head, M, 0, 60, th.fg, { face: 'display', maxW: W - 2 * M, grow: story ? 140 : H > W ? 124 : 104 }).size;
    const head = block(p.head, M, by + box + hs * 1.35, hs, th.fg, { face: 'display', lh: 1.02, maxW: W - 2 * M });
    m += head.markup;
    const s = block(p.body, M, head.bottom + hs * 0.75, story ? 48 : H > W ? 42 : 37, th.sub, { lh: 1.4, maxW: W - 2 * M });
    m += s.markup;
    m = m.slice(0, k) + bal(m.slice(k), s.bottom, FOOT(W, H, M) - 46 - 80, 0.4);
    return m + footer(W, H, M, th);
  },
  /** Glossary card: the term large, a definition, an example. */
  async glosario(p, W, H, th) {
    const M = W * 0.0815, story = H / W > 1.6, top = story ? 300 : M + 70;
    let m = tab(W, M, th) + kicker(`Glosario · ${p.n}`, M, top, th); const k = m.length; let bottom;
    const hs = block([p.term], M, 0, 60, th.fg, { face: 'display', maxW: W - 2 * M, grow: story ? 230 : H > W ? 210 : 170 }).size;
    const term = block([p.term], M, top + hs * 1.0, hs, th.fg, { face: 'display', maxW: W - 2 * M });
    m += term.markup + rect(M, term.bottom + 34, W - 2 * M, 4, th.line);
    const d = block(p.def, M, term.bottom + 34 + 84, story ? 58 : H > W ? 52 : 44, th.fg, { face: 'strong', lh: 1.3, maxW: W - 2 * M });
    m += d.markup; bottom = d.bottom;
    if (p.ex) {
      const ey = d.bottom + (story ? 120 : 90), lines = p.ex, cardH = 54 * lines.length + 60;
      m += rect(M + 8, ey + 8, W - 2 * M, cardH, th.deco[2]) + rect(M, ey, W - 2 * M, cardH, th.card) + rect(M, ey, 10, cardH, th.accent);
      lines.forEach((l, i) => { m += text(l, M + 38, ey + 70 + i * 54, 38, th === THEMES.ink ? C.milk : C.ink, 'body'); });
      bottom = ey + cardH;
    }
    m = m.slice(0, k) + bal(m.slice(k), bottom, FOOT(W, H, M) - 46 - 80, 0.4);
    return m + footer(W, H, M, th);
  },
  /** Numbered steps on a vertical rail. */
  async pasos(p, W, H, th) {
    const M = W * 0.0815, story = H / W > 1.6, top = story ? 280 : M + 70;
    let m = tab(W, M, th) + kicker(p.kicker || 'Cómo funciona', M, top, th); const k = m.length;
    const hs = story ? 136 : 116;
    const head = block(p.head, M, top + hs * 1.25, hs, th.fg, { face: 'display', lh: 1.0, maxW: W - 2 * M });
    m += head.markup;
    const node = 72, last = p.steps.at(-1).length, limit = FOOT(W, H, M) - 46 - (p.alpha ? 110 : 70);
    const y0 = head.bottom + (story ? 150 : 100), tail = node * 0.66 + (last - 1) * 60;
    // Default rhythm, tightened when the steps would run into the note or footer.
    const gap = Math.min(story ? 250 : H > W ? 190 : 150, Math.floor((limit - 30 - y0 - tail) / (p.steps.length - 1)));
    m += vrail(M + node / 2, y0 + node / 2, y0 + gap * (p.steps.length - 1) + node / 2, th.line);
    p.steps.forEach((s, i) => {
      const y = y0 + i * gap;
      m += rect(M + 6, y + 6, node, node, th.deco[2]) + rect(M, y, node, node, i === p.steps.length - 1 ? th.accent : th.card);
      m += text(String(i + 1), M + node / 2, y + node * 0.7, 36, i === p.steps.length - 1 ? (th.accent === C.ink ? C.milk : C.ink) : (th === THEMES.ink ? C.milk : C.ink), 'mono', 'middle');
      m += block(s, M + node + 36, y + node * 0.66, story ? 54 : 46, th.fg, { face: 'strong', lh: 1.25, maxW: W - 2 * M - node - 36 }).markup;
    });
    m = m.slice(0, k) + bal(m.slice(k), y0 + gap * (p.steps.length - 1) + tail, limit, 0.45);
    if (p.alpha) m += note(ALPHA, M, FOOT(W, H, M) - 46 - 40, th);
    return m + footer(W, H, M, th);
  },
  /** The cat as protagonist, on the staircase. */
  async personaje(p, W, H, th) {
    const M = W * 0.0815, story = H / W > 1.6, top = story ? 300 : M + 70;
    let m = tab(W, M, th) + kicker(p.kicker || 'GatoPago', M, top, th);
    const hs = block(p.head, M, 0, 60, th.fg, { face: 'display', maxW: W - 2 * M, grow: story ? 160 : H > W ? 136 : 116 }).size;
    const head = block(p.head, M, top + hs * 1.15, hs, th.fg, { face: 'display', lh: 1.0, maxW: W - 2 * M });
    m += head.markup;
    let textBottom = head.bottom;
    if (p.sub) { const sb = block(p.sub, M, head.bottom + hs * 0.62, story ? 50 : H > W ? 42 : 38, th.sub, { lh: 1.35, maxW: W - 2 * M }); m += sb.markup; textBottom = sb.bottom; }
    const fy = FOOT(W, H, M) - 46 - 48, unit = 64;
    const stairX = W - M - 3 * unit * 1.6;
    m += steps(stairX, fy, unit, 3, th.deco);
    const catBase = fy - 3 * unit * 0.62 + 8, room = catBase - textBottom - 50;
    const ch = Math.round(Math.min((story ? 0.40 : H > W ? 0.44 : 0.40) * H, room));
    const c = await cat(p.cat, W - M - unit * 0.6, catBase, ch, 'bottom-right');
    m += c.markup;
    if (p.alpha) m += note(ALPHA, M, fy, th);
    return m + footer(W, H, M, th);
  },
  /** Four actions with icons. */
  async iconos(p, W, H, th) {
    const M = W * 0.0815, story = H / W > 1.6, top = story ? 300 : M + 70;
    let m = tab(W, M, th) + kicker(p.kicker || 'Acciones', M, top, th); const k = m.length;
    const hs = story ? 130 : H > W ? 116 : 100;
    const head = block(p.head, M, top + hs * 1.25, hs, th.fg, { face: 'display', lh: 1.0, maxW: W - 2 * M });
    m += head.markup;
    const gw = (W - 2 * M - 30) / 2, gh = story ? 300 : H > W ? 250 : 196, y0 = head.bottom + (story ? 120 : 80);
    for (let i = 0; i < p.icons.length; i++) {
      const [name, label] = p.icons[i], x = M + (i % 2) * (gw + 30), y = y0 + Math.floor(i / 2) * (gh + 30);
      m += rect(x + 8, y + 8, gw, gh, th.deco[2]) + rect(x, y, gw, gh, th.card);
      const is = story ? 110 : H > W ? 96 : 76;
      m += await icon(name, x + 30, y + 30, is, th === THEMES.ink ? C.fire : C.ink);
      m += text(label, x + 30, y + gh - 34, story ? 54 : 46, th === THEMES.ink ? C.milk : C.ink, 'display');
    }
    m = m.slice(0, k) + bal(m.slice(k), y0 + 2 * gh + 38, FOOT(W, H, M) - 46 - (p.alpha ? 110 : 70), 0.45);
    if (p.alpha) m += note(ALPHA, M, FOOT(W, H, M) - 46 - 40, th);
    return m + footer(W, H, M, th);
  },
  /** Two concepts side by side. */
  async comparar(p, W, H, th) {
    const M = W * 0.0815, story = H / W > 1.6, top = story ? 300 : M + 70;
    let m = tab(W, M, th) + kicker(p.kicker || 'No es lo mismo', M, top, th); const k = m.length;
    const hs = story ? 120 : H > W ? 104 : 92;
    const head = block(p.head, M, top + hs * 1.25, hs, th.fg, { face: 'display', lh: 1.0, maxW: W - 2 * M });
    m += head.markup;
    const cw = (W - 2 * M - 28) / 2, bs = story ? 46 : H > W ? 40 : 35, rowsN = Math.max(...p.cols.map(c => c[1].length)), ch = (story ? 220 : 186) + rowsN * bs * 1.38 + 50, y = head.bottom + (story ? 120 : 84);
    p.cols.forEach(([title, lines], i) => {
      const x = M + i * (cw + 28), hot = i === 1;
      m += rect(x + 8, y + 8, cw, ch, th.deco[2]) + rect(x, y, cw, ch, hot ? th.accent : th.card);
      const fg = hot ? (th.accent === C.ink ? C.milk : C.ink) : (th === THEMES.ink ? C.milk : C.ink);
      m += block([title], x + 32, y + 92, story ? 76 : 64, fg, { face: 'display', maxW: cw - 64 }).markup;
      m += block(lines, x + 32, y + (story ? 220 : 186), bs, fg, { face: 'body', lh: 1.38, maxW: cw - 64 }).markup;
    });
    m = m.slice(0, k) + bal(m.slice(k), y + ch + 8, FOOT(W, H, M) - 46 - 70, 0.45);
    return m + footer(W, H, M, th);
  },
  /** A principle as a quote. */
  async cita(p, W, H, th) {
    const M = W * 0.0815, story = H / W > 1.6, top = story ? 340 : M + 110;
    let m = tab(W, M, th); const k = m.length;
    // Pixel quotation marks.
    for (const [dx, dy] of [[0, 0], [0, 28], [28, 0], [28, 28], [70, 0], [70, 28], [98, 0], [98, 28]]) if (dy === 0 || dx % 70 === 0) m += rect(M + dx, top - 90 + dy, 28, 28, th.accent);
    const hs = story ? 140 : H > W ? 118 : 104;
    const head = block(p.head, M, top + hs * 1.1, hs, th.fg, { face: 'display', lh: 1.02, maxW: W - 2 * M });
    m += head.markup + rect(M, head.bottom + 60, 64, 6, th.accent);
    m += text(p.by, M + 90, head.bottom + 70, 28, th.sub, 'mono');
    m = m.slice(0, k) + bal(m.slice(k), head.bottom + 70, FOOT(W, H, M) - 46 - 70, 0.42);
    return m + footer(W, H, M, th);
  },
  /** A list with rail nodes. */
  async lista(p, W, H, th) {
    const M = W * 0.0815, story = H / W > 1.6, top = story ? 300 : M + 70;
    let m = tab(W, M, th) + kicker(p.kicker, M, top, th); const k = m.length;
    const hs = story ? 130 : H > W ? 112 : 96;
    const head = block(p.head, M, top + hs * 1.25, hs, th.fg, { face: 'display', lh: 1.0, maxW: W - 2 * M });
    m += head.markup;
    const y0 = head.bottom + (story ? 140 : 110), lastD0 = p.items.at(-1)[1].length;
    const gap = Math.min(story ? 250 : H > W ? 200 : 150, Math.floor((FOOT(W, H, M) - 46 - 100 - y0 - 50 - lastD0 * 50) / Math.max(1, p.items.length - 1)));
    p.items.forEach(([t, d], i) => {
      const y = y0 + i * gap;
      m += rect(M, y - 30, 24, 24, i === 0 ? th.accent : th.deco[i % 3]);
      m += text(t, M + 52, y - 6, story ? 58 : 50, th.fg, 'display');
      m += block(d, M + 52, y + (story ? 58 : 50), story ? 42 : 36, th.sub, { lh: 1.35, maxW: W - 2 * M - 52 }).markup;
    });
    const lastD = p.items.at(-1)[1].length;
    m = m.slice(0, k) + bal(m.slice(k), y0 + gap * (p.items.length - 1) + 50 + lastD * 50, FOOT(W, H, M) - 46 - 70, 0.4);
    return m + footer(W, H, M, th);
  },
  /** Story with a two-option poll area (the sticker goes on top when publishing). */
  async encuesta(p, W, H, th) {
    const M = W * 0.0815, top = 300;
    let m = tab(W, M, th) + kicker(p.kicker || 'Pregunta', M, top, th);
    const head = block(p.head, M, top + 170, 132, th.fg, { face: 'display', lh: 1.02, maxW: W - 2 * M });
    m += head.markup;
    const y = head.bottom + 160, bw = W - 2 * M, bh = 150;
    p.options.forEach((o, i) => {
      const yy = y + i * (bh + 40);
      m += rect(M + 8, yy + 8, bw, bh, th.deco[2]) + rect(M, yy, bw, bh, i === 0 ? th.accent : th.card);
      m += text(o, M + 48, yy + bh * 0.64, 56, i === 0 ? (th.accent === C.ink ? C.milk : C.ink) : (th === THEMES.ink ? C.milk : C.ink), 'display');
    });
    m += note('Zona para el sticker de encuesta', M, y + 2 * (bh + 40) + 40, th);
    return m + footer(W, H, M, th);
  },
};

// Banners: wide compositions with their own safe areas.
async function banner(b) {
  const [W, H] = b.size, th = THEMES[b.theme], safe = b.safe || [0, 0, W, H];
  const [sx, sy, sw, sh] = safe, M = Math.round(sh * 0.14);
  let m = '';
  const hs = Math.round(sh * (b.headScale || 0.25));
  const head = block(b.head, sx + M, sy + M + hs * 1.0, hs, th.fg, { face: 'display', lh: 1.0, maxW: sw * 0.56 });
  m += head.markup;
  const sub = b.sub && block([b.sub], sx + M, head.bottom + hs * 0.6, Math.round(hs * 0.3), th.sub, { maxW: sw * 0.56 });
  if (sub) m += sub.markup;
  const textRight = sx + M + Math.max(head.width, sub?.width || 0);
  // Stairs scale with the short side, but stay narrow on wide-but-short banners.
  const unit = Math.round(Math.min(sh * 0.16, sw * 0.065)), baseY = sy + sh - M * 0.6, stairsX = sx + sw - M - 4 * unit * 1.6;
  m += steps(stairsX, baseY, unit, 4, th.deco);
  if (b.cat) {
    // The cat sits on the top step: never cropped by the top edge, never over the headline.
    const top = baseY - 4 * unit * 0.62 + 6, right = sx + sw - M - unit * 0.6, ratio = (await cat(b.cat, 0, 0, 100)).w / 100;
    const h = Math.round(Math.min(sh * 0.62, top - sy - M * 0.5, (right - textRight - 40) / ratio));
    m += (await cat(b.cat, right, top, h, 'bottom-right')).markup;
  } else m += rail(sx + M, baseY - unit * 0.2, Math.min(sx + sw * 0.5, stairsX - 48), th.line, [0.15, 0.55, 0.95], th.accent, Math.round(unit * 0.25));
  if (b.domain !== false) m += text('gatopago.com', sx + M, baseY - (b.cat ? 0 : unit * 0.7), Math.round(hs * 0.22), th.sub, 'mono');
  return frame(W, H, th, m, b.head.join(' '));
}

// ---------------------------------------------------------------------------------------------- the pieces
const P = [
  // Manifiesto
  { id: 'manifiesto-01', serie: 'Manifiesto', f: '4x5', t: 'titular', th: 'milk', head: ['Dinero', 'sin fronteras.', 'Siempre tuyo.'], sub: ['Cobra, guarda y mueve tu dinero', 'entre países.'], deco: 'steps', accentLast: true,
    copy: 'Dinero sin fronteras. Siempre tuyo. Cobra, guarda y mueve tu dinero entre países.' },
  { id: 'manifiesto-08', serie: 'Manifiesto', f: '4x5', t: 'titular', th: 'ink', kicker: 'El problema', head: ['Tu dinero', 'no debería', 'detenerse', 'en la frontera.'], sub: ['Un mensaje cruza en segundos.', 'El dinero tarda días.'], deco: 'frontera',
    copy: 'Tu dinero no debería detenerse en la frontera. Hoy un mensaje cruza en segundos; el dinero tarda días y pierde una parte por el camino.' },
  { id: 'manifiesto-09', serie: 'Manifiesto', f: '1x1', t: 'titular', th: 'milk', kicker: 'El problema', head: ['Un mensaje cruza', 'en segundos.', 'El dinero, en días.'], sub: ['Eso es lo que venimos a cambiar.'], deco: 'frontera',
    copy: 'Un mensaje cruza una frontera en segundos. El dinero, en días. Eso es lo que venimos a cambiar.' },
  { id: 'manifiesto-10', serie: 'Manifiesto', f: '4x5', t: 'titular', th: 'fire', kicker: 'La promesa', head: ['Sin fronteras.', 'Sin encierro.', 'Siempre tuyo.'], sub: ['Una cuenta para cobrar, guardar', 'y mover dinero entre países.'], deco: 'rail',
    copy: 'Sin fronteras, sin encierro, siempre tuyo: una cuenta para cobrar, guardar y mover dinero entre países.' },
  { id: 'manifiesto-02', serie: 'Manifiesto', f: '4x5', t: 'titular', th: 'ink', head: ['Tu dinero', 'sigue siendo', 'tuyo.'], sub: ['Nosotros nos ocupamos del camino.'], deco: 'rail',
    copy: 'Tu dinero sigue siendo tuyo. Nosotros nos ocupamos del camino.' },
  { id: 'manifiesto-03', serie: 'Manifiesto', f: '1x1', t: 'titular', th: 'fire', head: ['Una tarea.', 'Una frase.'], sub: ['Enviar, cobrar, cambiar. Sin vueltas.'], deco: 'steps',
    copy: 'Una tarea, una frase. Enviar, cobrar y cambiar dicho claro.' },
  { id: 'manifiesto-04', serie: 'Manifiesto', f: '4x5', t: 'titular', th: 'milk', head: ['Antes de', 'confirmar,', 'todo a la vista.'], sub: ['Destino, importe y costes,', 'antes de autorizar.'], deco: 'icon:verificar',
    copy: 'Antes de confirmar, todo a la vista: destino, importe y costes.' },
  { id: 'manifiesto-05', serie: 'Manifiesto', f: '1x1', t: 'titular', th: 'ink', head: ['Tu dinero.', 'Tu decisión.'], sub: ['Nada se mueve sin tu autorización.'], deco: 'steps',
    copy: 'Tu dinero, tu decisión. Nada se mueve sin tu autorización.' },
  { id: 'manifiesto-06', serie: 'Manifiesto', f: '4x5', t: 'titular', th: 'oat', head: ['Mover dinero', 'debería ser', 'fácil de entender.'], sub: ['Elegir, revisar, autorizar', 'y seguir el resultado.'], deco: 'rail',
    copy: 'Mover dinero debería ser fácil de entender: elegir, revisar, autorizar y seguir el resultado.' },
  { id: 'manifiesto-07', serie: 'Manifiesto', f: '4x5', t: 'titular', th: 'fire', head: ['Menos', 'pantallas.', 'Más claridad.'], sub: ['Cada paso dice qué pasa', 'y qué sigue.'], deco: 'steps',
    copy: 'Menos ruido, más claridad: cada paso dice qué pasa y qué sigue.' },
  // Cómo funciona
  { id: 'pasos-01', serie: 'Cómo funciona', f: '4x5', t: 'pasos', th: 'milk', head: ['Así se mueve', 'tu dinero'], alpha: true,
    steps: [['Elige qué hacer'], ['Revisa destino, importe', 'y costes'], ['Autoriza tú'], ['Sigue el estado', 'hasta el final']],
    copy: 'Así se mueve tu dinero en GatoPago: eliges, revisas, autorizas y sigues el estado. (Alpha en testnet, con fondos de prueba.)' },
  { id: 'pasos-02', serie: 'Cómo funciona', f: '4x5', t: 'pasos', th: 'ink', kicker: 'Cobrar', head: ['Cobra en', 'cuatro pasos'], alpha: true,
    steps: [['Crea tu enlace o QR'], ['Compártelo con', 'quien te paga'], ['Revisa el importe', 'y el estado'], ['Tu comprobante,', 'en Actividad']],
    copy: 'Cobrar en cuatro pasos: enlace o QR, compartir, revisar y comprobante. (Alpha en testnet.)' },
  { id: 'pasos-03', serie: 'Cómo funciona', f: '1x1', t: 'pasos', th: 'oat', kicker: 'Antes de enviar', head: ['Tres preguntas'],
    steps: [['¿A quién envío?'], ['¿Cuánto y en qué activo?'], ['¿Qué cuesta la red?']],
    copy: 'Antes de enviar, tres preguntas: a quién, cuánto y en qué activo, y qué cuesta la red.' },
  // Seguridad
  { id: 'consejo-01', serie: 'Seguridad', f: '4x5', t: 'consejo', th: 'milk', n: '01', icon: 'verificar', head: ['Revisa el destino', 'antes de enviar.'], body: ['Un carácter distinto lleva el dinero', 'a otra cuenta. Compáralo con calma.'],
    copy: 'Consejo 01: revisa el destino antes de enviar. Un carácter distinto lleva el dinero a otra cuenta.' },
  { id: 'consejo-02', serie: 'Seguridad', f: '4x5', t: 'consejo', th: 'ink', n: '02', icon: 'seguridad', head: ['Tus accesos', 'son solo tuyos.'], body: ['No compartas tus códigos de acceso.', 'Desconfía de quien te los pida,', 'aunque diga ser soporte.'],
    copy: 'Consejo 02: tus accesos son solo tuyos. No compartas tus códigos de acceso con nadie.' },
  { id: 'consejo-03', serie: 'Seguridad', f: '4x5', t: 'consejo', th: 'oat', n: '03', icon: 'alerta', head: ['USD no es USDC.'], body: ['Mira siempre qué activo y qué red', 'usas antes de mover dinero.'],
    copy: 'Consejo 03: USD no es USDC. Mira qué activo y qué red usas antes de mover dinero.' },
  { id: 'consejo-04', serie: 'Seguridad', f: '1x1', t: 'consejo', th: 'fire', n: '04', icon: 'escanear', head: ['Escanea', 'con atención.'], body: ['Confirma que el nombre y el importe', 'son los que esperas.'],
    copy: 'Consejo 04: antes de pagar con QR, confirma el nombre y el importe.' },
  { id: 'consejo-05', serie: 'Seguridad', f: '4x5', t: 'consejo', th: 'milk', n: '05', icon: 'pendiente', head: ['¿Se envió', 'o no?'], body: ['Si no estás seguro, revisa la actividad', 'antes de intentarlo otra vez.'],
    copy: 'Consejo 05: si no sabes si un envío salió, revisa la actividad antes de repetirlo.' },
  { id: 'consejo-06', serie: 'Seguridad', f: '1x1', t: 'consejo', th: 'ink', n: '06', icon: 'bloquear', head: ['Si algo no cuadra,', 'detente.'], body: ['Ninguna urgencia justifica', 'saltarse la revisión.'],
    copy: 'Consejo 06: si algo no cuadra, detente. Ninguna urgencia justifica saltarse la revisión.' },
  { id: 'consejo-07', serie: 'Seguridad', f: '4x5', t: 'consejo', th: 'oat', n: '07', icon: 'dispositivo', head: ['Tu teléfono', 'es tu llave.'], body: ['Mantén el bloqueo de pantalla activo', 'y el sistema actualizado.'],
    copy: 'Consejo 07: tu teléfono es tu llave. Bloqueo de pantalla activo y sistema al día.' },
  { id: 'consejo-08', serie: 'Seguridad', f: '4x5', t: 'consejo', th: 'fire', n: '08', icon: 'correo', head: ['Ojo con', 'los enlaces.'], body: ['Entra escribiendo gatopago.com.', 'Desconfía de mensajes que piden', 'actuar ya.'],
    copy: 'Consejo 08: ojo con los enlaces. Escribe gatopago.com y desconfía de las prisas.' },
  // Glosario
  { id: 'glosario-01', serie: 'Glosario', f: '4x5', t: 'glosario', th: 'milk', n: '01', term: 'Stablecoin', def: ['Moneda digital diseñada para', 'mantener un valor estable, atado', 'normalmente al dólar.'], ex: ['USDC es una stablecoin.'],
    copy: 'Glosario 01 · Stablecoin: moneda digital pensada para mantener un valor estable, normalmente atado al dólar.' },
  { id: 'glosario-02', serie: 'Glosario', f: '4x5', t: 'glosario', th: 'ink', n: '02', term: 'USDC', def: ['Stablecoin emitida por Circle', 'que busca mantener el valor', 'de un dólar estadounidense.'], ex: ['1 USDC busca valer 1 USD.'],
    copy: 'Glosario 02 · USDC: stablecoin emitida por Circle que busca valer un dólar estadounidense.' },
  { id: 'glosario-03', serie: 'Glosario', f: '4x5', t: 'glosario', th: 'oat', n: '03', term: 'Red', def: ['El sistema donde se registra', 'una transferencia. El mismo activo', 'puede existir en varias redes.'], ex: ['Enviar por la red equivocada', 'puede hacer que no llegue.'],
    copy: 'Glosario 03 · Red: donde se registra una transferencia. Un mismo activo puede vivir en varias.' },
  { id: 'glosario-04', serie: 'Glosario', f: '1x1', t: 'glosario', th: 'fire', n: '04', term: 'Comisión', def: ['Lo que cuesta procesar una', 'operación. Debe verse antes', 'de autorizar.'],
    copy: 'Glosario 04 · Comisión: lo que cuesta procesar una operación. Siempre visible antes de autorizar.' },
  { id: 'glosario-05', serie: 'Glosario', f: '4x5', t: 'glosario', th: 'milk', n: '05', term: 'Autocustodia', def: ['Tú controlas tus fondos.', 'Ninguna empresa los guarda', 'por ti.'], ex: ['Tu dinero sigue siendo tuyo.'],
    copy: 'Glosario 05 · Autocustodia: tú controlas tus fondos; ninguna empresa los guarda por ti.' },
  { id: 'glosario-06', serie: 'Glosario', f: '4x5', t: 'glosario', th: 'ink', n: '06', term: 'Dirección', def: ['El identificador de una cuenta', 'en una red. Si se escribe mal,', 'el dinero va a otro lugar.'], ex: ['Cópiala y revisa el inicio', 'y el final antes de enviar.'],
    copy: 'Glosario 06 · Dirección: el identificador de una cuenta en una red. Revísala antes de enviar.' },
  { id: 'glosario-07', serie: 'Glosario', f: '1x1', t: 'glosario', th: 'oat', n: '07', term: 'Comprobante', def: ['El registro de una operación:', 'quién, cuánto, cuándo y su estado.'],
    copy: 'Glosario 07 · Comprobante: quién, cuánto, cuándo y en qué estado quedó una operación.' },
  { id: 'glosario-08', serie: 'Glosario', f: '4x5', t: 'glosario', th: 'fire', n: '08', term: 'Testnet', def: ['Una red de pruebas. Lo que se', 'mueve ahí no tiene valor real.'], ex: ['Sirve para probar sin riesgo.'],
    copy: 'Glosario 08 · Testnet: red de pruebas. Lo que se mueve ahí no tiene valor real.' },
  // El gato
  { id: 'gato-01', serie: 'El gato', f: '4x5', t: 'personaje', th: 'milk', cat: 'pose-sentado', head: ['Hola.', 'Te esperábamos.'], sub: ['El gato acompaña. Tú decides.'],
    copy: 'Hola, te esperábamos. El gato acompaña; tú decides.' },
  { id: 'gato-02', serie: 'El gato', f: '1x1', t: 'personaje', th: 'oat', cat: 'expresion-curioso', head: ['¿Primera vez', 'por aquí?'], sub: ['Empieza por lo básico:', 'qué es una stablecoin.'],
    copy: '¿Primera vez por aquí? Empieza por lo básico: qué es una stablecoin.' },
  { id: 'gato-03', serie: 'El gato', f: '4x5', t: 'personaje', th: 'ink', cat: 'pose-mensajero', head: ['Tu envío', 'va en camino.'], sub: ['Míralo en Actividad hasta', 'que se confirme.'],
    copy: 'Tu envío va en camino. Síguelo en Actividad hasta que se confirme.' },
  { id: 'gato-04', serie: 'El gato', f: '4x5', t: 'personaje', th: 'milk', cat: 'pose-durmiendo', head: ['Domingo', 'de siesta.'], sub: ['Tu dinero sigue siendo tuyo,', 'también cuando descansas.'],
    copy: 'Domingo de siesta. Tu dinero sigue siendo tuyo, también cuando descansas.' },
  { id: 'gato-05', serie: 'El gato', f: '1x1', t: 'personaje', th: 'ink', cat: 'expresion-contento', head: ['Listo.'], sub: ['Confirmado y con comprobante.'],
    copy: 'Listo: confirmado y con comprobante.' },
  { id: 'gato-06', serie: 'El gato', f: '4x5', t: 'personaje', th: 'oat', cat: 'pose-carrito', head: ['Preparando', 'tu pago.'], sub: ['Primero revisamos.', 'Después se mueve.'],
    copy: 'Preparando tu pago: primero revisamos, después se mueve.' },
  { id: 'gato-07', serie: 'El gato', f: '4x5', t: 'personaje', th: 'milk', cat: 'expresion-atento', head: ['Atento', 'a los detalles.'], sub: ['Importe, destino, red y costes.'],
    copy: 'Atento a los detalles: importe, destino, red y costes.' },
  { id: 'gato-08', serie: 'El gato', f: '1x1', t: 'personaje', th: 'milk', cat: 'expresion-asomado', head: ['Algo nuevo', 'se asoma.'], sub: ['Pronto te contamos más.'],
    copy: 'Algo nuevo se asoma. Pronto te contamos más.' },
  { id: 'gato-09', serie: 'El gato', f: '4x5', t: 'personaje', th: 'ink', cat: 'expresion-somnoliento', head: ['Lunes.'], sub: ['El gato también.'],
    copy: 'Lunes. El gato también.' },
  { id: 'gato-10', serie: 'El gato', f: '4x5', t: 'personaje', th: 'milk', cat: 'pose-qr', head: ['Cobrar', 'sin complicarte.'], sub: ['Un enlace o un QR', 'para que te paguen.'], alpha: true,
    copy: 'Cobrar sin complicarte: un enlace o un QR para que te paguen. (Alpha en testnet.)' },
  { id: 'gato-11', serie: 'El gato', f: '1x1', t: 'personaje', th: 'oat', cat: 'expresion-emocionado', head: ['¡Primer pago!'], sub: ['Celebramos cuando está', 'confirmado. No antes.'],
    copy: '¡Primer pago! Celebramos cuando está confirmado. No antes.' },
  { id: 'gato-12', serie: 'El gato', f: '4x5', t: 'personaje', th: 'milk', cat: 'expresion-cauto', head: ['Mejor revisar', 'dos veces.'], sub: ['Un minuto de revisión vale más', 'que un envío equivocado.'],
    copy: 'Mejor revisar dos veces: un minuto de revisión vale más que un envío equivocado.' },
  { id: 'gato-13', serie: 'El gato', f: '4x5', t: 'personaje', th: 'oat', cat: 'pose-tarjeta', head: ['Hola desde', 'el otro lado.'], sub: ['Ilustración: no anuncia', 'ninguna tarjeta.'],
    copy: 'Hola desde el otro lado. (Ilustración del gato; no anuncia una tarjeta.)' },
  { id: 'gato-14', serie: 'El gato', f: '1x1', t: 'personaje', th: 'ink', cat: 'expresion-neutral', head: ['Sin prisa,', 'sin pausa.'], sub: ['Cada paso, a su tiempo.'],
    copy: 'Sin prisa, sin pausa: cada paso a su tiempo.' },
  // Acciones
  { id: 'acciones-01', serie: 'Acciones', f: '4x5', t: 'iconos', th: 'milk', head: ['Cuatro verbos.', 'Un solo lugar.'], icons: [['enviar', 'Enviar'], ['cobrar', 'Cobrar'], ['cambiar', 'Cambiar'], ['actividad', 'Actividad']], alpha: true,
    copy: 'Cuatro verbos, un solo lugar: enviar, cobrar, cambiar y ver tu actividad.' },
  { id: 'acciones-02', serie: 'Acciones', f: '1x1', t: 'iconos', th: 'ink', head: ['Lo que haces', 'cada día'], icons: [['enviar', 'Enviar'], ['escanear', 'Escanear'], ['comprobante', 'Comprobante'], ['contactos', 'Contactos']],
    copy: 'Lo que haces cada día, con nombres claros.' },
  { id: 'acciones-03', serie: 'Acciones', f: '4x5', t: 'iconos', th: 'oat', kicker: 'Seguridad', head: ['Protección', 'en capas'], icons: [['passkey', 'Tu acceso'], ['verificar', 'Revisión'], ['bloquear', 'Bloqueo'], ['seguridad', 'Cuenta']], alpha: true,
    copy: 'Protección en capas: tu acceso, revisión antes de autorizar y control de tu cuenta.' },
  // Comparativas
  { id: 'comparar-01', serie: 'Comparativas', f: '4x5', t: 'comparar', th: 'milk', head: ['Enviado', 'no es confirmado.'], cols: [['Enviado', ['La operación salió.', 'Aún falta el registro', 'final de la red.']], ['Confirmado', ['La red la registró.', 'Ya tiene', 'comprobante.']]],
    copy: 'Enviado no es confirmado: celebramos cuando la red lo registra.' },
  { id: 'comparar-02', serie: 'Comparativas', f: '4x5', t: 'comparar', th: 'ink', head: ['USD y USDC'], cols: [['USD', ['El dólar', 'estadounidense.']], ['USDC', ['Una stablecoin', 'que busca valer', 'un dólar.']]],
    copy: 'USD y USDC no son lo mismo: uno es el dólar; el otro, una stablecoin que busca valer un dólar.' },
  { id: 'comparar-03', serie: 'Comparativas', f: '1x1', t: 'comparar', th: 'oat', head: ['Testnet y mainnet'], cols: [['Testnet', ['Red de pruebas.', 'Sin valor real.']], ['Mainnet', ['Red principal.', 'Dinero real.']]],
    copy: 'Testnet y mainnet: la primera es para probar; la segunda mueve dinero real. Hoy GatoPago es una alpha en testnet.' },
  // Principios
  { id: 'principio-01', serie: 'Principios', f: '4x5', t: 'cita', th: 'ink', head: ['Celebramos', 'cuando está', 'confirmado.', 'No antes.'], by: 'Cómo hablamos',
    copy: 'Celebramos cuando está confirmado. No antes.' },
  { id: 'principio-02', serie: 'Principios', f: '4x5', t: 'cita', th: 'milk', head: ['Primero', 'la acción.', 'Después,', 'la explicación.'], by: 'Cómo diseñamos',
    copy: 'Primero la acción; después, la explicación necesaria.' },
  { id: 'principio-03', serie: 'Principios', f: '1x1', t: 'cita', th: 'fire', head: ['Costes a la vista,', 'antes de', 'autorizar.'], by: 'Cómo trabajamos',
    copy: 'Costes a la vista, antes de autorizar.' },
  { id: 'principio-04', serie: 'Principios', f: '4x5', t: 'cita', th: 'oat', head: ['Una idea', 'por frase.'], by: 'Cómo escribimos',
    copy: 'Una idea por frase. Así escribimos en GatoPago.' },
  // Transparencia y públicos
  { id: 'estado-01', serie: 'Transparencia', f: '4x5', t: 'titular', th: 'milk', kicker: 'Estado del producto', head: ['Estamos', 'en alpha.'], sub: ['Probamos en testnet, con fondos', 'de prueba. Te contaremos', 'cuando haya novedades.'], deco: 'icon:ruta',
    copy: 'Estamos en alpha: probamos en testnet con fondos de prueba. Te contaremos las novedades.' },
  { id: 'publicos-01', serie: 'Transparencia', f: '4x5', t: 'lista', th: 'oat', kicker: 'Para quién', head: ['Una promesa.', 'Tres caminos.'],
    items: [['Personas', ['Entiende y controla', 'tus movimientos.']], ['Negocios', ['Cobra dentro de', 'tu propia experiencia.']], ['Integradores', ['Conecta con estados', 'claros y verificables.']]],
    copy: 'Una promesa, tres caminos: personas, negocios e integradores.' },
  // Historias
  { id: 'historia-01', serie: 'Historias', f: '9x16', t: 'titular', th: 'milk', head: ['Dinero', 'sin fronteras.', 'Siempre tuyo.'], sub: ['Tu dinero sigue siendo tuyo.', 'GatoPago se ocupa del camino.'], deco: 'steps', accentLast: true,
    copy: 'Historia · promesa.' },
  { id: 'historia-09', serie: 'Historias', f: '9x16', t: 'titular', th: 'ink', kicker: 'El problema', head: ['Tu dinero', 'no debería', 'detenerse', 'en la frontera.'], sub: ['Un mensaje cruza en segundos.', 'El dinero tarda días.'], deco: 'frontera',
    copy: 'Historia · el problema.' },
  { id: 'historia-02', serie: 'Historias', f: '9x16', t: 'personaje', th: 'oat', cat: 'pose-sentado', head: ['Hola.', 'Te esperábamos.'], sub: ['El gato acompaña. Tú decides.'],
    copy: 'Historia · bienvenida.' },
  { id: 'historia-03', serie: 'Historias', f: '9x16', t: 'consejo', th: 'ink', n: '01', icon: 'verificar', head: ['Revisa el', 'destino antes', 'de enviar.'], body: ['Un carácter distinto lleva', 'el dinero a otra cuenta.'],
    copy: 'Historia · consejo de seguridad.' },
  { id: 'historia-04', serie: 'Historias', f: '9x16', t: 'glosario', th: 'fire', n: '01', term: 'Stablecoin', def: ['Moneda digital diseñada', 'para mantener un valor', 'estable.'], ex: ['USDC es una stablecoin.'],
    copy: 'Historia · glosario.' },
  { id: 'historia-05', serie: 'Historias', f: '9x16', t: 'pasos', th: 'milk', head: ['Así se mueve', 'tu dinero'], alpha: true, steps: [['Elige qué hacer'], ['Revisa destino', 'y costes'], ['Autoriza'], ['Sigue el estado']],
    copy: 'Historia · cómo funciona.' },
  { id: 'historia-06', serie: 'Historias', f: '9x16', t: 'encuesta', th: 'oat', head: ['¿Sabes la', 'diferencia entre', 'USD y USDC?'], options: ['Sí, la conozco', 'Aún no'],
    copy: 'Historia · encuesta (añadir el sticker de encuesta de la red social).' },
  { id: 'historia-07', serie: 'Historias', f: '9x16', t: 'titular', th: 'ink', head: ['Tu dinero.', 'Tu decisión.'], sub: ['Nada se mueve sin', 'tu autorización.'], deco: 'rail',
    copy: 'Historia · principio.' },
  { id: 'historia-08', serie: 'Historias', f: '9x16', t: 'personaje', th: 'ink', cat: 'expresion-emocionado', head: ['¡Primer', 'pago!'], sub: ['Celebramos cuando está', 'confirmado.'],
    copy: 'Historia · celebración.' },
  // Pilares: la tesis en cuatro palabras
  { id: 'pilares-01', serie: 'Pilares', f: '4x5', t: 'lista', th: 'milk', kicker: 'Una cuenta', head: ['Una cuenta.', 'Cuatro promesas.'], prove: true,
    items: [['Tuya', ['Nadie guarda tus fondos por ti.']], ['Simple', ['Cripto sin la parte difícil.']], ['Programable', ['Tu cuenta puede trabajar por ti.']], ['Abierta', ['Entra y sal cuando quieras.']]],
    copy: 'Una cuenta, cuatro promesas: tuya, simple, programable y abierta.' },
  { id: 'pilares-02', serie: 'Pilares', f: '4x5', t: 'titular', th: 'oat', kicker: 'Tuya', head: ['Tus fondos', 'son realmente', 'tuyos.'], sub: ['GatoPago no guarda tu dinero.', 'Tú tienes el control.'], deco: 'icon:seguridad', accentLast: true, prove: true,
    copy: 'Tus fondos son realmente tuyos: GatoPago no guarda tu dinero; tú tienes el control.' },
  { id: 'pilares-03', serie: 'Pilares', f: '4x5', t: 'titular', th: 'milk', kicker: 'Simple', head: ['Cripto,', 'sin la parte', 'difícil.'], sub: ['Sin redes, gas ni direcciones', 'a la vista.'], deco: 'steps',
    copy: 'Cripto sin la parte difícil: sin redes, gas ni direcciones a la vista.' },
  { id: 'pilares-04', serie: 'Pilares', f: '4x5', t: 'titular', th: 'ink', kicker: 'Programable', head: ['Tu cuenta', 'trabaja', 'por ti.'], sub: ['Hoy: rendimiento con DeFi.', 'Pronto: reglas que tú defines.'], deco: 'icon:crecer', alpha: true,
    copy: 'Tu cuenta trabaja por ti. Hoy, rendimiento con DeFi; pronto, reglas que tú defines. El rendimiento varía y no está garantizado. (Alpha en testnet.)' },
  { id: 'pilares-05', serie: 'Pilares', f: '4x5', t: 'titular', th: 'fire', kicker: 'Abierta', head: ['Entra y sal', 'cuando', 'quieras.'], sub: ['Tu dinero puede ir a otra', 'wallet o exchange. Sin encierro.'], deco: 'rail',
    copy: 'Entra y sal cuando quieras: tu dinero puede ir a otra wallet o exchange. Sin encierro.' },
  { id: 'pilares-06', serie: 'Pilares', f: '1x1', t: 'titular', th: 'ink', kicker: 'GatoPago', head: ['Fácil como una app.', 'Tuya como una wallet.'], sub: ['Las dos cosas, en una cuenta.'], deco: 'steps', prove: true,
    copy: 'Fácil como una app. Tuya como una wallet. Las dos cosas, en una cuenta.' },
  { id: 'pilares-07', serie: 'Pilares', f: '4x5', t: 'comparar', th: 'oat', kicker: 'La diferencia', head: ['O es fácil, o es tuyo.', 'Hasta ahora.'], prove: true,
    cols: [['Apps custodiales', ['Fáciles, pero', 'tu dinero lo guarda', 'otra empresa.']], ['GatoPago', ['Fácil y tuyo:', 'tú tienes el control', 'de tus fondos.']]],
    copy: 'O es fácil, o es tuyo. Hasta ahora: GatoPago es fácil y tus fondos son tuyos.' },
  // Entre países: cobrar y recibir
  { id: 'entre-paises-01', serie: 'Entre países', f: '4x5', t: 'titular', th: 'milk', kicker: 'Cobrar de fuera', head: ['Cobra desde', 'cualquier', 'país.'], sub: ['Un enlace o un QR, y el pago', 'llega en dólares digitales.'], deco: 'rail', alpha: true, accentLast: true,
    copy: 'Cobra desde cualquier país: un enlace o un QR, y el pago llega en dólares digitales. (Alpha en testnet.)' },
  { id: 'entre-paises-02', serie: 'Entre países', f: '4x5', t: 'pasos', th: 'ink', kicker: 'Cobrar de fuera', head: ['Así cobras', 'desde otro país'], alpha: true,
    steps: [['Tu cliente paga', 'con tu enlace'], ['Recibes dólares digitales'], ['Los guardas, los usas', 'o los mueves'], ['Pronto: retíralos', 'en bolivianos']],
    copy: 'Así cobras desde otro país: tu cliente paga con tu enlace, recibes dólares digitales y decides qué hacer. Pronto, retiro en bolivianos. (Alpha en testnet.)' },
  { id: 'entre-paises-03', serie: 'Entre países', f: '1x1', t: 'comparar', th: 'oat', kicker: 'Cobrar de fuera', head: ['Cobrar de fuera'],
    cols: [['Transferencia', ['Varios intermediarios.', 'Costes que no', 'siempre ves.']], ['GatoPago', ['Llega en dólares', 'digitales. Costes', 'a la vista.']]],
    copy: 'Cobrar de fuera: menos intermediarios y costes a la vista, en dólares digitales.' },
  { id: 'entre-paises-04', serie: 'Entre países', f: '4x5', t: 'titular', th: 'fire', kicker: 'En desarrollo', head: ['De dólares', 'digitales', 'a bolivianos.'], sub: ['Estamos trabajando en la salida', 'a tu banco en Bolivia.'], deco: 'steps',
    copy: 'De dólares digitales a bolivianos: estamos trabajando en la salida a tu banco en Bolivia. Aún no está disponible.' },
  { id: 'entre-paises-05', serie: 'Entre países', f: '4x5', t: 'personaje', th: 'oat', cat: 'pose-mensajero', head: ['Tu cliente', 'está lejos.'], sub: ['Tu cobro, no tanto.'], alpha: true,
    copy: 'Tu cliente está lejos; tu cobro, no tanto. (Alpha en testnet.)' },
  { id: 'entre-paises-06', serie: 'Entre países', f: '9x16', t: 'titular', th: 'milk', kicker: 'Cobrar de fuera', head: ['Cobra desde', 'cualquier', 'país.'], sub: ['Un enlace o un QR.', 'Llega en dólares digitales.'], deco: 'rail', alpha: true, accentLast: true,
    copy: 'Historia · cobrar desde otro país.' },
  // DeFi sin jerga
  { id: 'defi-01', serie: 'DeFi sin jerga', f: '4x5', t: 'titular', th: 'ink', kicker: 'DeFi sin jerga', head: ['Finanzas', 'abiertas,', 'sin jerga.'], sub: ['Ahorra y genera rendimiento', 'desde tu cuenta, sin aprender', 'a usar diez apps.'], deco: 'icon:crecer', alpha: true,
    copy: 'Finanzas abiertas, sin jerga: ahorra y genera rendimiento desde tu cuenta. El rendimiento varía y no está garantizado. (Alpha en testnet.)' },
  { id: 'defi-02', serie: 'DeFi sin jerga', f: '4x5', t: 'cita', th: 'milk', head: ['El rendimiento', 'varía.', 'Te lo decimos', 'antes.'], by: 'Cómo hablamos de DeFi',
    copy: 'El rendimiento varía y no está garantizado. Te lo decimos antes, no después.' },
  // English
  { id: 'en-01', serie: 'English', f: '4x5', t: 'titular', th: 'milk', kicker: 'GatoPago', head: ['Money', 'without borders.', 'Always yours.'], sub: ['Get paid, save and move money', 'across countries.'], deco: 'steps', accentLast: true,
    copy: 'Money without borders. Always yours.' },
  { id: 'en-02', serie: 'English', f: '1x1', t: 'titular', th: 'ink', kicker: 'GatoPago', head: ['Your money.', 'Your call.'], sub: ['Nothing moves without', 'your approval.'], deco: 'rail',
    copy: 'Your money, your call. Nothing moves without your approval.' },
  { id: 'en-03', serie: 'English', f: '4x5', t: 'consejo', th: 'oat', n: '01', icon: 'verificar', head: ['Check the address', 'before you send.'], body: ['One different character sends', 'the money somewhere else.'],
    copy: 'Tip 01: check the address before you send.' },
  { id: 'en-04', serie: 'English', f: '4x5', t: 'personaje', th: 'milk', kicker: 'GatoPago', cat: 'pose-sentado', head: ['Hi.', 'We were', 'expecting you.'], sub: ['The cat keeps you company.', 'You decide.'],
    copy: 'Hi, we were expecting you.' },
];
for (const p of P) if (p.serie === 'English' && p.t === 'consejo') p.label = 'Tip';

const BANNERS = [
  { id: 'banner-x-01', name: 'Portada de X', size: [1500, 500], theme: 'milk', head: ['Dinero sin fronteras.', 'Siempre tuyo.'], sub: 'Cobra, guarda y mueve tu dinero entre países.', cat: 'pose-sentado', headScale: 0.2 },
  { id: 'banner-x-02', name: 'Portada de X (oscura)', size: [1500, 500], theme: 'ink', head: ['Tu dinero.', 'Tu camino.'], sub: 'GatoPago se ocupa del camino.', headScale: 0.22 },
  { id: 'banner-linkedin-01', name: 'Portada de LinkedIn', size: [1584, 396], theme: 'oat', head: ['Mover dinero,', 'fácil de entender.'], sub: 'Personas, negocios e integradores.', cat: 'pose-mensajero', headScale: 0.2 },
  { id: 'banner-youtube-01', name: 'Banner de YouTube (zona segura centrada)', size: [2560, 1440], safe: [507, 508, 1546, 423], theme: 'milk', head: ['Dinero sin fronteras.', 'Siempre tuyo.'], sub: 'gatopago.com', cat: 'pose-sentado', headScale: 0.2, domain: false },
  { id: 'banner-facebook-01', name: 'Portada de Facebook', size: [1640, 624], theme: 'oat', head: ['Tu dinero sigue', 'siendo tuyo.'], sub: 'GatoPago se ocupa del camino.', cat: 'expresion-contento', headScale: 0.17 },
  { id: 'banner-compartir-01', name: 'Imagen para compartir enlaces (1200 × 630)', size: [1200, 630], theme: 'ink', head: ['Dinero sin fronteras.', 'Siempre tuyo.'], sub: 'gatopago.com', headScale: 0.2, domain: false },
  { id: 'banner-linkedin-post-01', name: 'Post horizontal de LinkedIn', size: [1200, 627], theme: 'milk', head: ['Antes de confirmar,', 'todo a la vista.'], sub: 'Destino, importe y costes.', cat: 'expresion-atento', headScale: 0.16 },
  // Horizontal posts for X and LinkedIn (16:9).
  { id: 'horizontal-01', serie: 'Horizontales', name: 'Post 16:9', size: [1200, 675], theme: 'ink', head: ['Enviado', 'no es confirmado.'], sub: 'Celebramos cuando la red lo registra.', headScale: 0.17 },
  { id: 'horizontal-02', serie: 'Horizontales', name: 'Post 16:9', size: [1200, 675], theme: 'oat', head: ['Revisa el destino', 'antes de enviar.'], sub: 'Un carácter distinto lleva el dinero a otra cuenta.', cat: 'expresion-atento', headScale: 0.15 },
  { id: 'horizontal-03', serie: 'Horizontales', name: 'Post 16:9', size: [1200, 675], theme: 'milk', head: ['Tu dinero.', 'Tu decisión.'], sub: 'Nada se mueve sin tu autorización.', cat: 'pose-sentado', headScale: 0.18 },
  { id: 'horizontal-05', serie: 'Horizontales', name: 'Post 16:9', size: [1200, 675], theme: 'milk', head: ['Tu dinero no debería', 'detenerse en la frontera.'], sub: 'Un mensaje cruza en segundos. El dinero tarda días.', headScale: 0.14 },
  // Gallery images for the HackQuest project page (1280 × 720), in English like the submission.
  { id: 'hackquest-01', serie: 'HackQuest', name: 'Imagen de proyecto 1280 × 720', size: [1280, 720], theme: 'milk', head: ['Money without borders.', 'Always yours.'], sub: 'Self-custodial payments on Arbitrum.', cat: 'pose-sentado', headScale: 0.13 },
  { id: 'hackquest-02', serie: 'HackQuest', name: 'Imagen de proyecto 1280 × 720', size: [1280, 720], theme: 'ink', head: ['A message crosses', 'a border in seconds.', 'Money takes days.'], sub: 'GatoPago moves it like a message, and you keep the keys.', headScale: 0.12 },
  { id: 'hackquest-03', serie: 'HackQuest', name: 'Imagen de proyecto 1280 × 720', size: [1280, 720], theme: 'oat', head: ['Get paid with a link.', 'Send to a username.'], sub: 'A passkey instead of a seed phrase. Gas covered.', cat: 'pose-qr', headScale: 0.12 },
  { id: 'hackquest-04', serie: 'HackQuest', name: 'Imagen de proyecto 1280 × 720', size: [1280, 720], theme: 'fire', head: ['ERC-4337 accounts', 'signed with passkeys.'], sub: 'Sponsored gas · guardian recovery · Arbitrum Sepolia', headScale: 0.11 },
  { id: 'horizontal-04', serie: 'Horizontales', name: 'Post 16:9', size: [1200, 675], theme: 'ink', head: ['Estamos', 'en alpha.'], sub: 'Testnet y fondos de prueba, por ahora.', headScale: 0.18 },
];

// ---------------------------------------------------------------------------------------------- extra families
/** Pixel arrow pointing right, drawn with blocks (Recursive's arrow glyph is not used). */
function arrow(x, y, u, color) {
  let m = rect(x, y - u / 2, u * 5, u, color);
  for (let i = 1; i <= 2; i++) m += rect(x + u * (4 - i), y - u / 2 - u * i, u, u, color) + rect(x + u * (4 - i), y + u / 2 + u * (i - 1), u, u, color);
  return m;
}
/** Dashes on a grid shared by all slides of a carousel, so the rail continues across the seam when swiping. */
function seamRail(x1, x2, y, color, offset) {
  let m = '';
  for (let x = x1 - ((offset + x1) % 14); x < x2; x += 14) { const a = Math.max(x, x1), b = Math.min(x + 9, x2); if (b > a) m += rect(a, y - 2, b - a, 4, color); }
  return m;
}
const pad2 = n => String(n).padStart(2, '0');

/** One slide of a carousel. The rail runs edge to edge and a packet travels along it from slide to slide. */
async function carouselSlide(c, i, W, H, th) {
  const n = c.slides.length, s = c.slides[i], M = W * 0.0815, top = M + 70;
  let m = tab(W, M, th) + kicker(c.kicker, M, top, th) + text(`${pad2(i + 1)}/${pad2(n)}`, W - M, top, 24, th.sub, 'mono', 'end');
  const k = m.length, railY = FOOT(W, H, M) - 46 - 76, limit = railY - 90;
  let bottom;
  if (s.kind === 'cover') {
    const hs = block(s.head, M, 0, 60, th.fg, { face: 'display', maxW: W - 2 * M, grow: 158 }).size;
    const head = block(s.head, M, top + hs * 1.2, hs, th.fg, { face: 'display', lh: 1.0, maxW: W - 2 * M });
    m += head.markup + rect(M, head.bottom + hs * 0.2, hs * 1.6, hs * 0.12, th.accent);
    const sb = block(s.sub, M, head.bottom + hs * 0.85, 44, th.sub, { lh: 1.35, maxW: W - 2 * M });
    m += sb.markup; bottom = sb.bottom;
  } else if (s.kind === 'term') {
    const hs = block([s.term], M, 0, 60, th.fg, { face: 'display', maxW: W - 2 * M, grow: 190 }).size;
    const term = block([s.term], M, top + 120 + hs * 0.9, hs, th.fg, { face: 'display', maxW: W - 2 * M });
    m += term.markup + rect(M, term.bottom + 34, W - 2 * M, 4, th.line);
    const d = block(s.def, M, term.bottom + 120, 48, th.fg, { face: 'strong', lh: 1.3, maxW: W - 2 * M });
    m += d.markup; bottom = d.bottom;
    if (s.ex) { const e = block(s.ex, M + 34, d.bottom + 96, 38, th.sub, { lh: 1.35, maxW: W - 2 * M - 34 }); m += rect(M, d.bottom + 60, 8, e.bottom - d.bottom - 30, th.accent) + e.markup; bottom = e.bottom; }
  } else if (s.kind === 'point') {
    const ny = top + 240;
    m += text(pad2(s.n), M, ny, 230, th.accent, 'display');
    if (s.icon) { const box = 150, bx = W - M - box, by = ny - 160; m += rect(bx + 8, by + 8, box, box, th.deco[2]) + rect(bx, by, box, box, th.card) + await icon(s.icon, bx + 33, by + 33, 84, th === THEMES.ink ? C.fire : C.ink); }
    const hs = block(s.head, M, 0, 60, th.fg, { face: 'display', maxW: W - 2 * M, grow: 124 }).size;
    const head = block(s.head, M, ny + 70 + hs, hs, th.fg, { face: 'display', lh: 1.02, maxW: W - 2 * M });
    const b = block(s.body, M, head.bottom + hs * 0.8, 46, th.sub, { lh: 1.4, maxW: W - 2 * M });
    m += head.markup + b.markup; bottom = b.bottom;
  } else {
    const hs = block(s.head, M, 0, 60, th.fg, { face: 'display', maxW: W - 2 * M, grow: 136 }).size;
    const head = block(s.head, M, top + hs * 1.2, hs, th.fg, { face: 'display', lh: 1.0, maxW: W - 2 * M });
    const sb = block(s.sub, M, head.bottom + hs * 0.65, 42, th.sub, { lh: 1.35, maxW: W - 2 * M });
    m += head.markup + sb.markup; bottom = sb.bottom;
  }
  m = m.slice(0, k) + bal(m.slice(k), bottom, limit - (s.kind === 'close' && c.cat ? 420 : 0), 0.4);
  // Rail and packet.
  const x1 = i === 0 ? M : 0, x2 = i === n - 1 ? W - M : W;
  m += seamRail(x1, x2, railY, th.line, i * W);
  if (i === 0) m += rect(M - 8, railY - 8, 16, 16, th.line);
  if (s.kind === 'close' && c.cat) {
    m += (await cat(c.cat, W - M, railY - 6, Math.min(400, Math.round(railY - 6 - bottom - 120)), 'bottom-right')).markup;
  } else {
    const px = Math.round(M + (W - 2 * M) * (i / (n - 1)));
    m += rect(px - 16 + 6, railY - 16 + 6, 32, 32, th.deco[2]) + rect(px - 16, railY - 16, 32, 32, th.accent);
  }
  if (s.kind === 'cover') m += text('DESLIZA', W - M - 84, railY - 52, 22, th.sub, 'mono', 'end') + arrow(W - M - 60, railY - 60, 12, th.accent);
  if (s.kind === 'close' && c.alpha) m += note(ALPHA, M, railY - 40, th);
  return m + footer(W, H, M, th);
}
const CAROUSELS = [
  { id: 'carrusel-cobrar', serie: 'Carrusel · Cobrar con un enlace', th: 'milk', kicker: 'Cobrar', cat: 'pose-qr', alpha: true,
    copy: 'Cobrar con un enlace, paso a paso. (Alpha en testnet, con fondos de prueba.)',
    slides: [
      { kind: 'cover', head: ['Cobra con', 'un enlace.'], sub: ['Cuatro pasos, de principio a fin.'] },
      { kind: 'point', n: 1, icon: 'cobrar', head: ['Crea el enlace.'], body: ['Elige el importe que quieres recibir.'] },
      { kind: 'point', n: 2, icon: 'compartir', head: ['Compártelo.'], body: ['Por chat, por correo o como QR.'] },
      { kind: 'point', n: 3, icon: 'pendiente', head: ['Sigue el estado.'], body: ['Verás cuándo se envía', 'y cuándo se confirma.'] },
      { kind: 'point', n: 4, icon: 'comprobante', head: ['Guarda', 'el comprobante.'], body: ['Queda en Actividad con fecha,', 'importe y estado.'] },
      { kind: 'close', head: ['Así de simple.'], sub: ['Guárdalo para tu próximo cobro.'] },
    ] },
  { id: 'carrusel-revisar', serie: 'Carrusel · Antes de enviar', th: 'oat', kicker: 'Antes de enviar', cat: 'expresion-atento',
    copy: 'Antes de enviar, revisa tres cosas: el destino, el activo y la red, y el coste.',
    slides: [
      { kind: 'cover', head: ['Antes de enviar,', 'revisa tres cosas.'], sub: ['Un minuto que evita sustos.'] },
      { kind: 'point', n: 1, icon: 'verificar', head: ['El destino.'], body: ['Compara el inicio y el final', 'de la dirección.'] },
      { kind: 'point', n: 2, icon: 'alerta', head: ['El activo y la red.'], body: ['Si no coinciden con los del destino,', 'el envío puede no llegar.'] },
      { kind: 'point', n: 3, icon: 'comprobante', head: ['El coste.'], body: ['Mira la comisión', 'antes de autorizar.'] },
      { kind: 'close', head: ['Revisar', 'es parte del camino.'], sub: ['Compártelo con quien', 'envía por primera vez.'] },
    ] },
  { id: 'carrusel-palabras', serie: 'Carrusel · Cinco palabras', th: 'ink', kicker: 'Glosario', cat: 'expresion-curioso',
    copy: 'Cinco palabras para empezar: stablecoin, USDC, autocustodia, DeFi y comprobante.',
    slides: [
      { kind: 'cover', head: ['Cinco palabras', 'para empezar.'], sub: ['Lo básico, sin tecnicismos.'] },
      { kind: 'term', term: 'Stablecoin', def: ['Moneda digital diseñada para', 'mantener un valor estable.'], ex: ['Normalmente, atada al dólar.'] },
      { kind: 'term', term: 'USDC', def: ['Stablecoin emitida por Circle', 'que busca valer un dólar.'], ex: ['1 USDC busca valer 1 USD.'] },
      { kind: 'term', term: 'Autocustodia', def: ['Tú controlas tus fondos.', 'Ninguna empresa los guarda por ti.'], ex: ['Tu dinero sigue siendo tuyo.'] },
      { kind: 'term', term: 'DeFi', def: ['Servicios financieros abiertos', 'que funcionan con reglas públicas.'], ex: ['Ahorrar, cambiar o generar', 'rendimiento, sin intermediarios.'] },
      { kind: 'term', term: 'Comprobante', def: ['El registro de una operación.'], ex: ['Quién, cuánto, cuándo', 'y en qué estado quedó.'] },
      { kind: 'close', head: ['Ya hablas', 'el idioma.'], sub: ['Guárdalo y vuelve cuando', 'lo necesites.'] },
    ] },
  { id: 'carrusel-estafas', serie: 'Carrusel · Señales de alerta', th: 'milk', kicker: 'Seguridad', cat: 'expresion-cauto',
    copy: 'Cuatro señales de alerta: prisa, que te pidan códigos, enlaces raros y ganancias seguras.',
    slides: [
      { kind: 'cover', head: ['Cuatro señales', 'de alerta.'], sub: ['Si ves una, detente.'] },
      { kind: 'point', n: 1, icon: 'pendiente', head: ['Te meten prisa.'], body: ['Ninguna urgencia justifica', 'saltarse la revisión.'] },
      { kind: 'point', n: 2, icon: 'passkey', head: ['Te piden códigos.'], body: ['No compartas tus códigos de acceso,', 'aunque digan ser soporte.'] },
      { kind: 'point', n: 3, icon: 'correo', head: ['El enlace no cuadra.'], body: ['Escribe gatopago.com tú mismo', 'en lugar de tocar el enlace.'] },
      { kind: 'point', n: 4, icon: 'alerta', head: ['Prometen ganancias', 'seguras.'], body: ['Nadie puede garantizar', 'ganancias. Desconfía.'] },
      { kind: 'close', head: ['Ante la duda,', 'para.'], sub: ['Compártelo con alguien', 'que lo necesite.'] },
    ] },

  { id: 'carrusel-defi', serie: 'Carrusel · DeFi sin jerga', th: 'oat', kicker: 'DeFi sin jerga', cat: 'pose-sentado', alpha: true,
    copy: 'DeFi explicado sin jerga: qué es, qué puedes hacer, qué riesgos tiene y dónde entra GatoPago. (Alpha en testnet.)',
    slides: [
      { kind: 'cover', head: ['DeFi,', 'explicado sin jerga.'], sub: ['Cuatro preguntas, cuatro respuestas.'] },
      { kind: 'point', n: 1, icon: 'crecer', head: ['¿Qué es?'], body: ['Servicios financieros abiertos', 'que funcionan con reglas públicas.'] },
      { kind: 'point', n: 2, icon: 'cambiar', head: ['¿Qué puedo hacer?'], body: ['Ahorrar, cambiar entre activos', 'y generar rendimiento.'] },
      { kind: 'point', n: 3, icon: 'alerta', head: ['¿Qué riesgos tiene?'], body: ['El rendimiento varía y no está', 'garantizado. Infórmate antes.'] },
      { kind: 'point', n: 4, icon: 'ruta', head: ['¿Dónde entra', 'GatoPago?'], body: ['Lo conecta a tu cuenta,', 'sin que tengas que salir de ella.'] },
      { kind: 'close', head: ['Tu dinero,', 'tus reglas.'], sub: ['Guárdalo para cuando', 'quieras empezar.'] },
    ] },
];

/** Instagram highlight cover: 1080 × 1920, only the centre circle is shown. */
async function highlight(h) {
  const W = 1080, H = 1920, th = THEMES[h.th], fg = h.th === 'fire' ? C.ink : C.fire;
  let m = '';
  if (h.cat) m += (await cat(h.cat, W / 2, H / 2 + 190, 380, 'bottom-center')).markup;
  else m += await icon(h.icon, W / 2 - 170, H / 2 - 170, 340, fg);
  return m;
}
const HIGHLIGHTS = [['empieza', 'Empieza', 'ruta'], ['cobrar', 'Cobrar', 'cobrar'], ['enviar', 'Enviar', 'enviar'], ['seguridad', 'Seguridad', 'seguridad'], ['glosario', 'Glosario', 'buscar'], ['novedades', 'Novedades', 'notificaciones'], ['ayuda', 'Ayuda', 'ayuda'], ['gato', 'El gato', null]];

/** Story backgrounds: signature and motif, the rest free for native text and stickers. */
async function storyBackground(b) {
  const W = 1080, H = 1920, th = THEMES[b.th], M = W * 0.0815, fy = FOOT(W, H, M) - 46;
  let m = tab(W, M, th);
  if (b.motif === 'steps') m += steps(W - M - 4 * 1.6 * 96, fy - 60, 96, 4, th.deco);
  if (b.motif === 'rail') m += rail(0, fy - 90, W, th.line, [0.2, 0.5, 0.8], th.accent, 26);
  if (b.motif === 'peek') m += (await cat('expresion-asomado', 0, fy - 120, 520, 'bottom-left')).markup;
  if (b.motif === 'nap') { m += steps(W - M - 3 * 1.6 * 80, fy - 60, 80, 3, th.deco); m += (await cat('pose-durmiendo', W - M - 30, fy - 60 - 3 * 80 * 0.62 + 10, 230, 'bottom-right')).markup; }
  if (b.motif === 'frame') { const t = 14; m += rect(M, 220, W - 2 * M, t, th.accent) + rect(M, fy - 120, W - 2 * M, t, th.accent); }
  return m + footer(W, H, M, th);
}
const BACKGROUNDS = [
  { id: 'fondo-historia-01', th: 'milk', motif: 'steps' }, { id: 'fondo-historia-02', th: 'ink', motif: 'rail' },
  { id: 'fondo-historia-03', th: 'oat', motif: 'peek' }, { id: 'fondo-historia-04', th: 'fire', motif: 'steps' },
  { id: 'fondo-historia-05', th: 'milk', motif: 'nap' }, { id: 'fondo-historia-06', th: 'ink', motif: 'frame' },
];

/** Label sticker: card with offset shadow, icon and word. Transparent background. */
async function labelSticker(l) {
  const th = THEMES[l.th], size = 60, tw = measure(l.text, size, 'display'), is = 64, P = 34, h = 132, w = Math.round(P + is + 24 + tw + P), sh = 10, b = 6;
  const W = w + sh, H = h + sh, fg = l.th === 'ink' ? C.milk : C.ink;
  let m = rect(sh, sh, w, h, C.deep) + rect(0, 0, w, h, C.ink) + rect(b, b, w - 2 * b, h - 2 * b, th.bg);
  m += await icon(l.icon, P, (h - is) / 2, is, l.th === 'fire' ? C.ink : l.th === 'ink' ? C.fire : C.fire);
  m += text(l.text, P + is + 24, h / 2 + size * 0.36, size, fg, 'display');
  return { W, H, m };
}
const LABELS = [
  { id: 'sticker-confirmado', text: 'Confirmado', icon: 'verificar', th: 'fire' }, { id: 'sticker-en-camino', text: 'En camino', icon: 'enviar', th: 'milk' },
  { id: 'sticker-pendiente', text: 'Pendiente', icon: 'pendiente', th: 'oat' }, { id: 'sticker-revisa', text: 'Revisa antes', icon: 'alerta', th: 'milk' },
  { id: 'sticker-nuevo', text: 'Nuevo', icon: 'notificaciones', th: 'fire' }, { id: 'sticker-alpha', text: 'Alpha en testnet', icon: 'ruta', th: 'ink' },
];
/** Die-cut cat sticker: the original pixels scaled by an integer, a Milk ring and an Ink edge, both square-dilated. */
async function catSticker(id) {
  const file = path.join(KIT, '03-personaje/estaticos', `${id}.png`);
  const trimmed = await sharp(await sharp(file).ensureAlpha().trim({ threshold: 1 }).toBuffer()).raw().toBuffer({ resolveWithObject: true });
  const k = Math.max(1, Math.floor(800 / Math.max(trimmed.info.width, trimmed.info.height)));
  // Closing (dilate R, erode R - ring) merges loose particles into one die-cut silhouette with a ring of ~ring px.
  const ring = 18, edge = 6, R = 44, pad = R + edge + 4;
  const { data, info } = await sharp(trimmed.data, { raw: trimmed.info }).resize(trimmed.info.width * k, trimmed.info.height * k, { kernel: 'nearest' }).extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } }).raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height, a = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) a[i] = data[i * 4 + 3] > 0 ? 1 : 0;
  /** Square dilation with running counts, O(w·h) per pass. */
  const dilate = (src, r) => { const t = new Uint8Array(w * h), o = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) { let c = 0; for (let x = -r; x < w; x++) { const add = x + r, del = x - r - 1; if (add < w && src[y * w + add]) c++; if (del >= 0 && src[y * w + del]) c--; if (x >= 0) t[y * w + x] = c > 0 ? 1 : 0; } }
    for (let x = 0; x < w; x++) { let c = 0; for (let y = -r; y < h; y++) { const add = y + r, del = y - r - 1; if (add < h && t[add * w + x]) c++; if (del >= 0 && t[del * w + x]) c--; if (y >= 0) o[y * w + x] = c > 0 ? 1 : 0; } }
    return o; };
  const erode = (src, r) => dilate(src.map(v => 1 - v), r).map(v => 1 - v);
  const inner = erode(dilate(a, R), R - ring), outer = dilate(inner, edge), out = Buffer.alloc(w * h * 4), hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const [mr, mg, mb] = hex(C.milk), [ir, ig, ib] = hex(C.ink);
  for (let i = 0; i < w * h; i++) {
    if (data[i * 4 + 3] > 0) { out[i * 4] = data[i * 4]; out[i * 4 + 1] = data[i * 4 + 1]; out[i * 4 + 2] = data[i * 4 + 2]; out[i * 4 + 3] = 255; }
    else if (inner[i]) { out[i * 4] = mr; out[i * 4 + 1] = mg; out[i * 4 + 2] = mb; out[i * 4 + 3] = 255; }
    else if (outer[i]) { out[i * 4] = ir; out[i * 4 + 1] = ig; out[i * 4 + 2] = ib; out[i * 4 + 3] = 255; }
  }
  return sharp(out, { raw: { width: w, height: h, channels: 4 } }).png({ compressionLevel: 9 });
}
// Poses with loose particles (mensajero, carrito) are left out: a die-cut would leave islands around them.
const CAT_STICKERS = ['pose-sentado', 'expresion-contento', 'expresion-emocionado', 'expresion-atento', 'expresion-curioso', 'pose-durmiendo', 'expresion-cauto', 'expresion-somnoliento'];

/** Wallpapers: no text, the camino and the cat. Phone safe areas keep the clock (top) and buttons (bottom) clear. */
async function wallpaper(w) {
  const [W, H] = w.size, th = THEMES[w.th];
  let m = '';
  if (w.kind === 'phone') {
    const unit = 120, base = H - 420, x = W - 140 - 4 * unit * 1.6;
    m += steps(x, base, unit, 4, th.deco) + rect(0, base, W, H - base, th.deco[2] === C.deep ? th.bg : th.bg);
    m += (await cat(w.cat, W - 140 - unit * 0.5, base - 4 * unit * 0.62 + 8, w.cat === 'pose-durmiendo' ? 300 : 420, 'bottom-right')).markup;
    m += rail(0, base + 120, W, th.line, [0.15], th.accent, 26);
  } else {
    const unit = 150, base = H - 230, x = W - 240 - 4 * unit * 1.6;
    m += steps(x, base, unit, 4, th.deco);
    m += (await cat(w.cat, W - 240 - unit * 0.5, base - 4 * unit * 0.62 + 8, 420, 'bottom-right')).markup;
    m += symbol(160, base - 69, 3);
  }
  return m;
}
const WALLPAPERS = [
  { id: 'fondo-pantalla-movil-01', kind: 'phone', size: [1179, 2556], th: 'ink', cat: 'pose-durmiendo' },
  { id: 'fondo-pantalla-movil-02', kind: 'phone', size: [1179, 2556], th: 'milk', cat: 'pose-sentado' },
  { id: 'fondo-pantalla-escritorio-01', kind: 'desktop', size: [2560, 1440], th: 'oat', cat: 'pose-mensajero' },
];

/** Open Graph image (1200 × 630): what a link to gatopago.com shows when shared. Symbol, promise, the camino and the cat. */
async function ogImage(o) {
  const W = 1200, H = 630, th = THEMES[o.th], M = 72, sw = 60, sh = 46;
  let m = rect(W - M - 60, 0, 60, 10, C.fire) + rect(W - M - 78, 0, 18, 10, C.deep);
  if (th.chip) m += rect(M - 10, M - 10, sw + 20, sh + 20, C.milk);
  m += symbol(M, M, 2) + text('GatoPago', M + sw + (th.chip ? 30 : 18), M + sh * 0.78, 36, th.fg, 'display');
  const head = block(['Dinero sin', 'fronteras.'], M, 262, 84, th.fg, { face: 'display', lh: 1.0, maxW: 680 });
  m += head.markup + text('Siempre tuyo.', M, head.bottom + head.size * 1.02, head.size, C.fire, 'display');
  m += text('gatopago.com', M, H - M + 6, 26, th.sub, 'mono');
  const unit = 56, base = H - M + 10;
  m += steps(W - M - 4 * unit * 1.6, base, unit, 4, th.deco);
  m += (await cat('pose-sentado', W - M - unit * 0.5, base - 4 * unit * 0.62 + 6, 200, 'bottom-right')).markup;
  return frame(W, H, th, m, 'GatoPago: Dinero sin fronteras. Siempre tuyo.');
}
const OG = [{ id: 'og-gatopago', th: 'ink', name: 'oscura' }, { id: 'og-gatopago-claro', th: 'milk', name: 'clara' }];

/** Product-news template with a phone placeholder for a real app screenshot. */
async function screenshotTemplate(t) {
  const [W, H] = FORMATS[t.f], th = THEMES[t.th], M = W * 0.0815, story = H / W > 1.6, top = story ? 300 : M + 70;
  let m = tab(W, M, th) + kicker('Novedad', M, top, th);
  const fy = FOOT(W, H, M) - 46;
  const phone = (x, y, w, h) => { const b = 14; let p = rect(x + 10, y + 10, w, h, th.deco[2]) + rect(x, y, w, h, C.ink) + rect(x + b, y + b, w - 2 * b, h - 2 * b, th === THEMES.oat ? C.paper : C.oat);
    p += rect(x + w / 2 - 50, y + b + 16, 100, 12, C.ink);
    p += text('CAPTURA DE LA APP', x + w / 2, y + h / 2 - 10, 24, '#5F5650', 'mono', 'middle') + text('1080 × 2340', x + w / 2, y + h / 2 + 30, 22, '#5F5650', 'mono', 'middle'); return p; };
  if (!story) {
    const pw = 400, ph = 820, px = W - M - pw, py = top + 40;
    m += phone(px, py, pw, ph);
    const colW = px - M - 48;
    const head = block(['Nuevo', 'en la alpha.'], M, top + 190, 96, th.fg, { face: 'display', lh: 1.0, maxW: colW });
    m += head.markup + block(['Una línea que explica', 'qué cambia y para qué.'], M, head.bottom + 80, 36, th.sub, { lh: 1.4, maxW: colW }).markup;
    m += note(ALPHA, M, py + ph - 10, th);
  } else {
    const head = block(['Nuevo en la alpha.'], M, top + 140, 110, th.fg, { face: 'display', maxW: W - 2 * M });
    m += head.markup + block(['Una línea que explica qué cambia.'], M, head.bottom + 80, 42, th.sub, { maxW: W - 2 * M }).markup;
    const pw = 560, ph = fy - 110 - (head.bottom + 180), px = (W - pw) / 2;
    m += phone(px, head.bottom + 170, pw, ph) + note(ALPHA, M, fy - 50, th);
  }
  return m + footer(W, H, M, th);
}
const SCREEN_TEMPLATES = [{ id: 'plantilla-captura-4x5', f: '4x5', th: 'milk' }, { id: 'plantilla-captura-9x16', f: '9x16', th: 'oat' }];

// ---------------------------------------------------------------------------------------------- render
await fs.rm(OUT, { recursive: true, force: true });
await fs.mkdir(path.join(OUT, 'svg'), { recursive: true });
await fs.mkdir(path.join(OUT, 'png'), { recursive: true });
const rows = [];
for (const p of P) {
  const [W, H] = FORMATS[p.f], th = THEMES[p.th];
  const body = await TEMPLATES[p.t](p, W, H, th);
  const svgText = frame(W, H, th, body, (p.head || [p.term]).join(' '));
  await fs.writeFile(path.join(OUT, 'svg', `${p.id}.svg`), svgText);
  await sharp(Buffer.from(svgText)).png({ compressionLevel: 9 }).toFile(path.join(OUT, 'png', `${p.id}.png`));
  rows.push({ id: p.id, serie: p.serie, formato: p.f, size: `${W}×${H}`, copy: p.prove ? `${p.copy} [Publicar cuando la autocustodia y la salida a otra wallet estén demostradas.]` : p.copy, ...(p.prove && { revisar: 'autocustodia' }) });
}
for (const b of BANNERS) {
  const svgText = await banner(b);
  await fs.writeFile(path.join(OUT, 'svg', `${b.id}.svg`), svgText);
  await sharp(Buffer.from(svgText)).png({ compressionLevel: 9 }).toFile(path.join(OUT, 'png', `${b.id}.png`));
  rows.push({ id: b.id, serie: b.serie || 'Banners', formato: b.name, size: `${b.size[0]}×${b.size[1]}`, copy: b.head.join(' ') });
}
const out = async (id, svgText) => { await fs.writeFile(path.join(OUT, 'svg', `${id}.svg`), svgText); await sharp(Buffer.from(svgText)).png({ compressionLevel: 9 }).toFile(path.join(OUT, 'png', `${id}.png`)); };
for (const c of CAROUSELS) {
  const [W, H] = FORMATS['4x5'], th = THEMES[c.th];
  for (let i = 0; i < c.slides.length; i++) {
    const id = `${c.id}-${pad2(i + 1)}`, s = c.slides[i];
    await out(id, frame(W, H, th, await carouselSlide(c, i, W, H, th), (s.head || [s.term]).join(' ')));
    rows.push({ id, serie: c.serie, formato: '4x5', size: `${W}×${H}`, copy: i === 0 ? c.copy : `Diapositiva ${i + 1} de ${c.slides.length}.` });
  }
}
for (const t of ['fire', 'ink']) for (const [id, name, ic] of HIGHLIGHTS) {
  const h = { th: t, icon: ic, cat: ic ? null : 'expresion-contento' }, pid = `destacada-${t === 'fire' ? 'roja' : 'oscura'}-${id}`;
  await out(pid, frame(1080, 1920, THEMES[t], await highlight(h), name));
  rows.push({ id: pid, serie: 'Portadas de destacadas', formato: '9x16', size: '1080×1920', copy: `Portada de destacada «${name}». Instagram muestra solo el círculo central.` });
}
for (const b of BACKGROUNDS) {
  await out(b.id, frame(1080, 1920, THEMES[b.th], await storyBackground(b), 'Fondo para historia'));
  rows.push({ id: b.id, serie: 'Fondos para historias', formato: '9x16', size: '1080×1920', copy: 'Fondo libre para escribir con el texto nativo de la red.' });
}
for (const l of LABELS) {
  const { W, H, m } = await labelSticker(l);
  await out(l.id, `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(l.text)}">${m}</svg>\n`);
  rows.push({ id: l.id, serie: 'Stickers', formato: 'sticker', size: `${W}×${H}`, copy: `Sticker «${l.text}», fondo transparente.` });
}
for (const id of CAT_STICKERS) {
  const pid = `sticker-gato-${id.replace(/^(pose|expresion)-/, '')}`, img = await catSticker(id);
  await img.toFile(path.join(OUT, 'png', `${pid}.png`));
  const m = await sharp(path.join(OUT, 'png', `${pid}.png`)).metadata();
  rows.push({ id: pid, serie: 'Stickers', formato: 'sticker', size: `${m.width}×${m.height}`, copy: 'Sticker troquelado del gato, fondo transparente. Solo PNG.', png: true });
}
for (const w of WALLPAPERS) {
  await out(w.id, frame(w.size[0], w.size[1], THEMES[w.th], await wallpaper(w), 'Fondo de pantalla de GatoPago'));
  rows.push({ id: w.id, serie: 'Fondos de pantalla', formato: w.kind === 'phone' ? '9x19.5' : '16x9', size: `${w.size[0]}×${w.size[1]}`, copy: w.kind === 'phone' ? 'Fondo de pantalla para móvil; deja libres el reloj y los botones.' : 'Fondo de pantalla para escritorio.' });
}
for (const o of OG) {
  await out(o.id, await ogImage(o));
  rows.push({ id: o.id, serie: 'Imagen para compartir (OG)', formato: '1200x630', size: '1200×630', copy: `Imagen Open Graph (${o.name}) para gatopago.com: se muestra al compartir el enlace en redes y mensajería. Se instala en el repositorio de la app.` });
}
for (const t of SCREEN_TEMPLATES) {
  const [W, H] = FORMATS[t.f];
  await out(t.id, frame(W, H, THEMES[t.th], await screenshotTemplate(t), 'Plantilla de novedad con captura'));
  rows.push({ id: t.id, serie: 'Plantillas con captura', formato: t.f, size: `${W}×${H}`, copy: 'Plantilla: sustituir la captura por una real de la app y el titular por la novedad. Mantener la nota de alpha.' });
}
await fs.writeFile(path.join(OUT, 'manifest.json'), JSON.stringify({ schemaVersion: 1, status: 'propuesta', generator: 'herramientas/brandkit/social.mjs', pieces: rows }, null, 2) + '\n');

// Gallery and README.
const series = [...new Set(rows.map(r => r.serie))];
const shape = r => { const [w, h] = r.size.split('×').map(Number); return r.formato === 'sticker' ? 'sticker' : h / w > 1.6 ? 'tall' : w / h > 2.2 ? 'wide' : ''; };
const card = r => `<figure class="${shape(r)}"><a href="png/${r.id}.png"><img src="png/${r.id}.png" alt="${esc(r.copy)}" loading="lazy"></a><figcaption><b>${r.id}</b> · ${esc(r.size)}<br>${esc(r.copy)}<br>${r.png ? '' : `<a href="svg/${r.id}.svg">SVG</a> · `}<a href="png/${r.id}.png" download>PNG</a></figcaption></figure>`;
const grid = s => `<div class="grid${s.startsWith('Carrusel') ? ' strip' : ''}">${rows.filter(r => r.serie === s).map(card).join('')}</div>`;
await fs.writeFile(path.join(OUT, 'index.html'), `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Redes de GatoPago</title>
<link rel="stylesheet" href="../../../brandkit/04-tipografia/uso.css">
<style>body{margin:0;background:#fff8f0;color:#0b0b0f;font:15px/1.5 'Recursive Variable',system-ui,sans-serif}main{max-width:1400px;margin:0 auto;padding:36px 20px 80px}h1{font-size:2.6rem;margin:0;font-variation-settings:'CASL' 1;letter-spacing:-.035em}h2{margin:48px 0 10px;font-size:1.5rem;font-variation-settings:'CASL' 1}p.lead{color:#5f5650;max-width:75ch}nav{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0}nav a{border:2px solid #0b0b0f;padding:5px 12px;color:#0b0b0f;text-decoration:none;font-weight:700;background:#fffdf9;box-shadow:3px 3px 0 #9f292e}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(300px,100%),1fr));gap:20px;align-items:start}figure{margin:0;background:#fffdf9;border:2px solid #0b0b0f;padding:10px;box-shadow:5px 5px 0 #eee4d8}figure.wide{grid-column:1/-1}figure img{width:100%;display:block;border:1px solid #eee4d8}figure.tall img{max-height:620px;object-fit:contain}.strip{display:flex;overflow-x:auto;gap:0;padding-bottom:12px}.strip figure{flex:0 0 min(300px,80vw);box-shadow:none;border-right-width:0}.strip figure:last-child{border-right-width:2px}figure.sticker img{background:repeating-conic-gradient(#eee4d8 0 25%,#fffdf9 0 50%) 0 0/24px 24px;max-height:300px;object-fit:contain}figcaption{font-size:.8rem;color:#5f5650;margin-top:8px}figcaption b{color:#0b0b0f;font-family:ui-monospace,monospace}</style></head><body><main>
<h1>Redes de GatoPago</h1><p class="lead">${rows.length} propuestas para redes: posts, carruseles, historias, banners, portadas de destacadas, fondos, stickers y plantillas. Texto trazado desde Recursive; SVG editables y PNG listos. Cada pieza incluye su texto sugerido. Propuesta pendiente de aprobación: revisar antes de publicar.</p>
<nav>${series.map(s => `<a href="#${encodeURIComponent(s)}">${esc(s)} (${rows.filter(r => r.serie === s).length})</a>`).join('')}</nav>
${series.map(s => `<h2 id="${encodeURIComponent(s)}">${esc(s)}</h2>${grid(s)}`).join('\n')}
</main></body></html>
`);
await fs.writeFile(path.join(OUT, 'README.md'), `# Redes sociales · octubre de 2026

**Estado: propuesta.** ${rows.length} piezas generadas con \`npm run brandkit:social\` (fuente: \`herramientas/brandkit/social.mjs\`). Abrir [index.html](./index.html) para revisarlas.

- \`png/\`: listas para publicar. \`svg/\`: editables; el texto está trazado (no depende de fuentes instaladas).
- Formatos: posts 1080 × 1350 (4:5) y 1080 × 1080 (1:1), carruseles 4:5, historias 1080 × 1920, posts horizontales 1200 × 675, banners de X, LinkedIn, YouTube, Facebook y enlace compartido, portadas de destacadas, fondos, stickers y plantillas.
- Paleta y tipografía del kit; firma con el símbolo (sobre contenedor Milk en fondos oscuros y Cat Fire).
- El gato usa las ilustraciones de \`brandkit/03-personaje\`, que siguen pendientes de aprobación artística.
- Texto según la guía de voz: sin promesas no verificadas; las piezas de producto indican «Alpha en testnet · fondos de prueba».
- En historias de encuesta, añadir el sticker nativo de la red sobre la zona indicada.
- Historias: el contenido queda entre 250 px arriba y 250 px abajo, fuera de la barra de perfil y de la de respuesta.
- Banner de YouTube: todo el texto está dentro de la zona segura central de 1546 × 423; el resto del lienzo es fondo.
- Banners con gato: el gato nunca se recorta ni tapa el titular; se reduce si hace falta.
- Piezas marcadas «Publicar cuando la autocustodia…» (series Pilares): prometen que los fondos son del usuario y que puede salir cuando quiera. Publicarlas solo cuando eso esté demostrado en la app.
- Las salidas a moneda local (bolivianos, PIX) y la tarjeta aparecen siempre como «en desarrollo» o «pronto».
- DeFi: nunca prometer rendimiento; las piezas recuerdan que varía y no está garantizado.
- Carruseles: publicar las diapositivas en orden. El raíl continúa de una a otra y el bloque rojo avanza, así que se lee como un solo camino al deslizar.
- Portadas de destacadas: Instagram muestra solo el círculo central; el icono está centrado dentro de él.
- Fondos para historias: dejan libre el centro para escribir con el texto nativo de la red y añadir stickers.
- Stickers: PNG con fondo transparente. Los del gato usan los píxeles originales ampliados por un factor entero, con un borde Milk y un filo Ink; no redibujan la ilustración.
- Fondos de pantalla: sin texto; en el móvil dejan libres el reloj y los botones inferiores.
- Imagen para compartir (OG): \`og-gatopago.png\` es la versión principal; se instala como \`og:image\` en la web, que vive en el repositorio de la app.
- Plantillas con captura: sustituir el marcador por una captura real de la app y conservar la nota de alpha.

## Textos sugeridos

| Pieza | Serie | Formato | Texto |
|---|---|---|---|
${rows.map(r => `| \`${r.id}\` | ${r.serie} | ${r.size} | ${r.copy.replace(/\|/g, '/')} |`).join('\n')}
`);
console.log(JSON.stringify({ pieces: rows.length, posts: P.length, banners: BANNERS.length }));
