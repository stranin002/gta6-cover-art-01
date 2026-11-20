// Fixed scenes for screenshots: ?shot=editor shows the page with sample photos;
// ?shot=cover shows the cover alone. window.__shotReady is set once painted.
export async function runShot(shot, query, load) {
  if (shot === 'cover') document.body.classList.add('shot-cover');
  const caption = query.get('caption') ?? 'Sunset Heist';
  await load(['samples/pier.jpg', 'samples/boulevard.jpg', 'samples/pier.jpg'], caption);
  requestAnimationFrame(() => requestAnimationFrame(() => { window.__shotReady = true; }));
}
