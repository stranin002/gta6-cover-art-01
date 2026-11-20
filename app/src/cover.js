// Draws a multi-panel GTA-style cover: photos in 1-3 panels, a sunset/neon/noir
// colour grade, and bold outlined caption lettering. All art is original.

function drawPhoto(ctx, photo, x, y, w, h, zoom, panX, panY) {
  if (!photo) {
    ctx.fillStyle = '#2b1838';
    ctx.fillRect(x, y, w, h);
    return;
  }
  const base = Math.max(w / photo.naturalWidth, h / photo.naturalHeight) * zoom;
  const pw = photo.naturalWidth * base;
  const ph = photo.naturalHeight * base;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.drawImage(photo, x + (w - pw) / 2 + panX * w, y + (h - ph) / 2 + panY * h, pw, ph);
  ctx.restore();
}

function grade(ctx, w, h, kind) {
  let g;
  if (kind === 'neon') {
    g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, 'rgba(0,255,255,0.18)');
    g.addColorStop(1, 'rgba(255,0,180,0.38)');
  } else if (kind === 'noir') {
    g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(0,0,0,0.72)');
  } else {
    g = ctx.createLinearGradient(0, h * 0.3, 0, h);
    g.addColorStop(0, 'rgba(255,120,80,0)');
    g.addColorStop(0.6, 'rgba(255,90,60,0.28)');
    g.addColorStop(1, 'rgba(190,30,110,0.62)');
  }
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function captionText(ctx, w, h, caption, subtitle) {
  const text = (caption || '').trim().toUpperCase();
  if (text) {
    let size = Math.min(h * 0.08, w * 0.11);
    ctx.font = `900 ${size}px Arial, sans-serif`;
    while (ctx.measureText(text).width > w * 0.92 && size > 14) {
      size -= 2;
      ctx.font = `900 ${size}px Arial, sans-serif`;
    }
    ctx.textAlign = 'center';
    ctx.lineJoin = 'round';
    ctx.lineWidth = size * 0.16;
    ctx.strokeStyle = 'rgba(0,0,0,0.85)';
    ctx.fillStyle = '#ffffff';
    ctx.strokeText(text, w / 2, h - h * 0.09);
    ctx.fillText(text, w / 2, h - h * 0.09);
  }
  if (subtitle && subtitle.trim()) {
    ctx.font = `700 ${Math.max(16, h * 0.028)}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffd166';
    ctx.fillText(subtitle.trim().toUpperCase(), w / 2, h - h * 0.03);
  }
  ctx.font = `700 ${Math.max(14, h * 0.02)}px Arial, sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.fillText('VICE COVER  •  2026', w * 0.03, h * 0.045);
}

/** Draw photos (array, or null) with opts {layout, grade, caption, subtitle, zoom, panX, panY}. */
export function drawCover(canvas, photos, opts = {}) {
  const ctx = canvas.getContext('2d');
  const { width: w, height: h } = canvas;
  const layout = opts.layout || 'split';
  const list = Array.isArray(photos) ? photos : [photos];
  const zoom = opts.zoom || 1;
  const panX = opts.panX || 0;
  const panY = opts.panY || 0;
  ctx.fillStyle = '#12081f';
  ctx.fillRect(0, 0, w, h);
  const gap = Math.round(w * 0.012);
  if (layout === 'hero') {
    drawPhoto(ctx, list[0], 0, 0, w, h, zoom, panX, panY);
  } else if (layout === 'triptych') {
    const pw = (w - gap * 2) / 3;
    for (let i = 0; i < 3; i++) drawPhoto(ctx, list[i] || list[0], i * (pw + gap), 0, pw, h, zoom, panX, panY);
  } else {
    const topH = Math.round(h * 0.62);
    drawPhoto(ctx, list[0], 0, 0, w, topH, zoom, panX, panY);
    const bw = (w - gap) / 2;
    const by = topH + gap;
    drawPhoto(ctx, list[1] || list[0], 0, by, bw, h - by, zoom, panX, panY);
    drawPhoto(ctx, list[2] || list[1] || list[0], bw + gap, by, bw, h - by, zoom, panX, panY);
  }
  ctx.strokeStyle = 'rgba(0,0,0,0.9)';
  ctx.lineWidth = gap;
  ctx.strokeRect(0, 0, w, h);
  grade(ctx, w, h, opts.grade || 'sunset');
  captionText(ctx, w, h, opts.caption || '', opts.subtitle || '');
}
