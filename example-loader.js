const scripts = ['renderParameters.js','links.js'];
const v = Date.now();
scripts.forEach(src => {
  const s = document.createElement('script');
  s.src = `https://cdn.jsdelivr.net/gh/jjjooo64/coherence-26@main/${src}?v=${v}`;
  document.head.appendChild(s);
});
