// Wires the page: up to 3 photos, layout + grade + caption, export at 3 sizes.
// A `?shot=` query sets up a fixed scene for a screenshot instead (./shots.js).
import { drawCover } from './cover.js';
import { runShot } from './shots.js';

const canvas = document.getElementById('cover');
const caption = document.getElementById('caption');
const subtitle = document.getElementById('subtitle');
const layout = document.getElementById('layout');
const grade = document.getElementById('grade');
const zoom = document.getElementById('zoom');
const sizeSel = document.getElementById('size');
const status = document.getElementById('status');
let photos = [null, null, null];

function opts() {
  return { layout: layout.value, grade: grade.value, caption: caption.value, subtitle: subtitle.value, zoom: parseFloat(zoom.value) || 1 };
}
function redraw() { drawCover(canvas, photos, opts()); }

export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

async function pick(i, file) {
  if (!file) return;
  photos[i] = await loadImage(URL.createObjectURL(file));
  redraw();
}
document.getElementById('photo1').addEventListener('change', (e) => pick(0, e.target.files[0]));
document.getElementById('photo2').addEventListener('change', (e) => pick(1, e.target.files[0]));
document.getElementById('photo3').addEventListener('change', (e) => pick(2, e.target.files[0]));
document.getElementById('samples').addEventListener('click', async () => {
  photos[0] = await loadImage('samples/pier.jpg');
  photos[1] = await loadImage('samples/boulevard.jpg');
  photos[2] = await loadImage('samples/pier.jpg');
  redraw();
});
for (const el of [caption, subtitle, layout, grade, zoom]) el.addEventListener('input', redraw);
document.getElementById('export').addEventListener('click', () => {
  const [w, h] = sizeSel.value.split('x').map(Number);
  const off = document.createElement('canvas');
  off.width = w; off.height = h;
  drawCover(off, photos, opts());
  off.toBlob((blob) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `cover-${w}x${h}.png`;
    a.click();
    status.textContent = `Saved cover-${w}x${h}.png`;
  }, 'image/png');
});

const shot = new URLSearchParams(location.search).get('shot');
if (shot) {
  runShot(shot, new URLSearchParams(location.search), async (samples, text) => {
    for (let i = 0; i < samples.length; i++) photos[i] = await loadImage(samples[i]);
    caption.value = text;
    redraw();
  });
} else {
  // Default preview uses the bundled samples so the app reads at first open.
  loadImage('samples/pier.jpg').then((img) => { photos[0] = img; redraw(); });
  loadImage('samples/boulevard.jpg').then((img) => { photos[1] = img; redraw(); });
}
