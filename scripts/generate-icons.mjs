/*
  Genera los iconos PNG de la PWA a partir de la misma geometria que favicon.svg.
  Sin dependencias: dibuja por supermuestreo y escribe el PNG con zlib.
  Uso: node scripts/generate-icons.mjs
*/
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Paleta tomada de src/styles/tokens.css (--accent, --accent-fg, --star).
const DARK = [24, 24, 27, 255];
const LIGHT = [250, 250, 250, 255];
const GOLD = [224, 160, 32, 255];
const NONE = [0, 0, 0, 0];

// --- Formas en un lienzo virtual de 100x100 -------------------------------
const inCircle = (x, y, cx, cy, r) => (x - cx) ** 2 + (y - cy) ** 2 <= r * r;

function inRoundRect(x, y, x0, y0, x1, y1, rtl, rtr, rbr, rbl) {
  if (x < x0 || x > x1 || y < y0 || y > y1) return false;
  if (x < x0 + rtl && y < y0 + rtl) return inCircle(x, y, x0 + rtl, y0 + rtl, rtl);
  if (x > x1 - rtr && y < y0 + rtr) return inCircle(x, y, x1 - rtr, y0 + rtr, rtr);
  if (x > x1 - rbr && y > y1 - rbr) return inCircle(x, y, x1 - rbr, y1 - rbr, rbr);
  if (x < x0 + rbl && y > y1 - rbl) return inCircle(x, y, x0 + rbl, y1 - rbl, rbl);
  return true;
}

const BADGE_X = 70;
const BADGE_Y = 70;

// Silueta de persona: cabeza + hombros.
const inHead = (x, y) => inCircle(x, y, 48, 34, 12.5);
const inTorso = (x, y) => inRoundRect(x, y, 26, 50, 70, 80, 22, 22, 4, 4);
// Aro del mismo color que el fondo: separa la insignia de la silueta.
const inRing = (x, y) => inCircle(x, y, BADGE_X, BADGE_Y, 16);
const inBadge = (x, y) => inCircle(x, y, BADGE_X, BADGE_Y, 12.5);
const inPlus = (x, y) =>
  inRoundRect(x, y, BADGE_X - 6.5, BADGE_Y - 1.8, BADGE_X + 6.5, BADGE_Y + 1.8, 1.8, 1.8, 1.8, 1.8) ||
  inRoundRect(x, y, BADGE_X - 1.8, BADGE_Y - 6.5, BADGE_X + 1.8, BADGE_Y + 6.5, 1.8, 1.8, 1.8, 1.8);

function colorAt(x, y, { scale, bleed, radius }) {
  // Coordenadas del dibujo, escalado alrededor del centro.
  const u = (x - 50) / scale + 50;
  const v = (y - 50) / scale + 52; // +2: centra opticamente el dibujo
  if (inPlus(u, v)) return DARK;
  if (inBadge(u, v)) return GOLD;
  if (inRing(u, v)) return DARK;
  if (inHead(u, v) || inTorso(u, v)) return LIGHT;
  if (bleed || inRoundRect(x, y, 0, 0, 100, 100, radius, radius, radius, radius)) return DARK;
  return NONE;
}

// --- PNG -------------------------------------------------------------------
const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodePng(size, pixels) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bits por canal
  ihdr[9] = 6; // RGBA
  // Cada fila lleva delante su byte de filtro (0 = sin filtro).
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y += 1) {
    raw[y * (size * 4 + 1)] = 0;
    pixels.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// --- Render ----------------------------------------------------------------
const SAMPLES = 4; // 4x4 submuestras por pixel para suavizar los bordes

function render(size, opts) {
  const pixels = Buffer.alloc(size * size * 4);
  for (let py = 0; py < size; py += 1) {
    for (let px = 0; px < size; px += 1) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      for (let sy = 0; sy < SAMPLES; sy += 1) {
        for (let sx = 0; sx < SAMPLES; sx += 1) {
          const x = ((px + (sx + 0.5) / SAMPLES) / size) * 100;
          const y = ((py + (sy + 0.5) / SAMPLES) / size) * 100;
          const c = colorAt(x, y, opts);
          // Premultiplicado para que los bordes transparentes no tiren a negro.
          const w = c[3] / 255;
          r += c[0] * w;
          g += c[1] * w;
          b += c[2] * w;
          a += c[3];
        }
      }
      const n = SAMPLES * SAMPLES;
      const alpha = a / n;
      const i = (py * size + px) * 4;
      if (alpha > 0) {
        const k = n * (alpha / 255);
        pixels[i] = Math.round(r / k);
        pixels[i + 1] = Math.round(g / k);
        pixels[i + 2] = Math.round(b / k);
      }
      pixels[i + 3] = Math.round(alpha);
    }
  }
  return encodePng(size, pixels);
}

// scale: margen del dibujo. Los maskable dejan mas aire porque Android
// recorta hasta un 20% del borde (safe zone circular central).
const OUTPUTS = [
  ["public/icons/icon-192.png", 192, { scale: 0.92, bleed: false, radius: 22 }],
  ["public/icons/icon-512.png", 512, { scale: 0.92, bleed: false, radius: 22 }],
  ["public/icons/icon-maskable-192.png", 192, { scale: 0.8, bleed: true }],
  ["public/icons/icon-maskable-512.png", 512, { scale: 0.8, bleed: true }],
  ["public/apple-touch-icon.png", 180, { scale: 0.92, bleed: true }],
  ["public/favicon-32.png", 32, { scale: 0.92, bleed: false, radius: 22 }],
];

for (const [file, size, opts] of OUTPUTS) {
  const out = resolve(ROOT, file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, render(size, opts));
  console.log(`${file} (${size}x${size})`);
}
