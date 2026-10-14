import { STORAGE, PANEL, BORDER, WHITE } from './config.js';

const N = 3;
const formulas = [
  { title: 'Shape Progression', hint: 'Look across each row.', level: 1, calc: (r, c) => ({ shape: c, count: 1, angle: 0, fill: 0 }) },
  { title: 'Quantity Progression', hint: 'Look at the number of symbols.', level: 1, calc: (r, c) => ({ shape: 0, count: c + 1, angle: 0, fill: 0 }) },
  { title: 'Row / Column', hint: 'Rows and columns each change one property.', level: 1, calc: (r, c) => ({ shape: r, count: c + 1, angle: 0, fill: 0 }) },
  { title: 'Rotation', hint: 'Look for rotation.', level: 2, calc: (r, c) => ({ shape: 3, count: 1, angle: (r + c) % 4, fill: 0 }) },
  { title: 'Alternating Fill', hint: 'Notice the solid and hollow shapes.', level: 2, calc: (r, c) => ({ shape: (r + c) % 3, count: 1, angle: 0, fill: (r + c) % 2 }) },
  { title: 'Diagonal Count', hint: 'Both row and column matter.', level: 2, calc: (r, c) => ({ shape: 1, count: ((r + c) % 3) + 1, angle: 0, fill: 0 }) },
  { title: 'Combined Pattern', hint: 'Track shape, count and fill separately.', level: 3, calc: (r, c) => ({ shape: (r + c) % 3, count: c + 1, angle: 0, fill: r % 2 }) },
  { title: 'Rotating & Counting', hint: 'Two properties follow different rules.', level: 3, calc: (r, c) => ({ shape: 3, count: r + 1, angle: c % 4, fill: 0 }) },
  { title: 'Cyclic Shift', hint: 'Track each property independently.', level: 3, calc: (r, c) => ({ shape: (2 * r + c) % 3, count: ((r + 2 * c) % 3) + 1, angle: 0, fill: (r + c) % 2 }) },
  { title: 'Three Features', hint: 'Watch shape, fill and orientation.', level: 4, calc: (r, c) => ({ shape: (r + c) % 3, count: r + 1, angle: ((r + 2 * c) % 4), fill: c % 2 }) },
  { title: 'Crossed Rules', hint: 'The row and column rules interact.', level: 4, calc: (r, c) => ({ shape: (r + 2 * c) % 3, count: ((r + c) % 3) + 1, angle: (r + c) % 4, fill: r % 2 }) },
  { title: 'Final Matrix', hint: 'Each visual feature has its own progression.', level: 5, calc: (r, c) => ({ shape: (2 * r + c) % 3, count: ((2 * r + c) % 3) + 1, angle: (r + 2 * c) % 4, fill: (r + c) % 2 }) },
];
const eq = (a, b) => ['shape', 'count', 'angle', 'fill'].every(k => a[k] === b[k]);
const key = p => [p.shape, p.count, p.angle, p.fill].join('-');
function rand(n) { return Math.floor(Math.random() * n) }
function shuffle(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = rand(i + 1);[arr[i], arr[j]] = [arr[j], arr[i]] } return arr }
function readHistory() { try { const x = JSON.parse(localStorage.getItem(STORAGE) || '[]'); return Array.isArray(x) ? x : [] } catch { return [] } }
function saveHistory(entry) { const all = readHistory(); all.unshift(entry); try { localStorage.setItem(STORAGE, JSON.stringify(all.slice(0, 100))) } catch (e) { console.warn('Cannot store locally', e) } return all }
function txt(scene, x, y, s, size = 22, color = WHITE) { return scene.add.text(x, y, s, { fontFamily: 'Arial, sans-serif', fontSize: size, color }).setOrigin(.5) }
function rect(scene, x, y, w, h, color = PANEL, r = 12, stroke = BORDER) { let g = scene.add.graphics(); g.fillStyle(color); g.fillRoundedRect(x, y, w, h, r); if (stroke !== null) { g.lineStyle(1.5, stroke); g.strokeRoundedRect(x, y, w, h, r) } return g }
function button(scene, x, y, w, h, label, fn, size = 20) { const bg = rect(scene, x, y, w, h, 0x304765, 12, 0x667f9f); const t = txt(scene, x + w / 2, y + h / 2, label, size); let area = scene.add.zone(x + w / 2, y + h / 2, w, h).setInteractive({ useHandCursor: true }); area.on('pointerover', () => bg.setAlpha(.78)); area.on('pointerout', () => bg.setAlpha(1)); area.on('pointerdown', fn); return { bg, t, area } }
// Each symbol is constructed using Phaser graphics, not external test artwork.
function glyph(s, x, y, config, scale = 1) {
  const g = s.add.graphics(); const { shape, count, angle, fill } = config; const spacing = 24 * scale; let offsets = count === 1 ? [0] : count === 2 ? [-spacing / 2, spacing / 2] : [-spacing, 0, spacing];
  offsets.forEach(dx => {
    const px = x + dx, py = y; const R = 10.5 * scale;
    g.lineStyle(Math.max(1.4, 2.2 * scale), 0xdbe7fa); g.fillStyle(0x84b6ff);
    if (shape === 0) { if (fill) g.fillCircle(px, py, R); else g.strokeCircle(px, py, R) }
    else if (shape === 1) { if (fill) g.fillRect(px - R, py - R, R * 2, R * 2); else g.strokeRect(px - R, py - R, R * 2, R * 2) }
    else if (shape === 2) { const pts = []; for (let a = 0; a < 3; a++) { const rad = (-Math.PI / 2 + 2 * Math.PI * a / 3) + angle * Math.PI / 2; pts.push(new Phaser.Math.Vector2(px + Math.cos(rad) * R * 1.3, py + Math.sin(rad) * R * 1.3)) } if (fill) g.fillPoints(pts, true); else g.strokePoints(pts, true, true) }
    else { let a = angle * Math.PI / 2; let x1 = px - Math.cos(a) * R, y1 = py - Math.sin(a) * R, x2 = px + Math.cos(a) * R, y2 = py + Math.sin(a) * R; g.lineBetween(x1, y1, x2, y2); const h = 6 * scale, theta = a + Math.PI; g.lineBetween(x2, y2, x2 + h * Math.cos(theta + .6), y2 + h * Math.sin(theta + .6)); g.lineBetween(x2, y2, x2 + h * Math.cos(theta - .6), y2 + h * Math.sin(theta - .6)); if (fill) g.fillCircle(px, py, 3.5 * scale) }
  }); return g;
}
function buildQuestion(f) {
  let answer = f.calc(2, 2), opts = [{ ...answer }]; const seen = new Set([key(answer)]); let guard = 0;
  while (opts.length < 6 && guard++ < 200) { let p = { ...answer }; const property = ['shape', 'count', 'angle', 'fill'][rand(4)]; if (property === 'shape') p.shape = rand(4); if (property === 'count') p.count = 1 + rand(3); if (property === 'angle') p.angle = rand(4); if (property === 'fill') p.fill = rand(2); if (!seen.has(key(p))) { seen.add(key(p)); opts.push(p) } }
  // Fall back to mixed-feature distractors when the answer has few legal variants.
  while (opts.length < 6) { const p = { shape: rand(4), count: rand(3) + 1, angle: rand(4), fill: rand(2) }; if (!seen.has(key(p))) { seen.add(key(p)); opts.push(p) } }
  shuffle(opts); return { formula: f, answer, options: opts, correct: opts.findIndex(o => eq(o, answer)) };
}
let session = null;

function startSession() { session = { startedAt: new Date().toISOString(), startMs: Date.now(), answers: [], questions: formulas.map(buildQuestion) } }

export { N, rand, readHistory, saveHistory, txt, rect, button, glyph, session, startSession };
