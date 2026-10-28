

const BASE = "https://jjjooo64.github.io/coherence-26";
const scripts = [ "renderParameters.js", "links.js"];

// Unique every page load → browsers always re-fetch these two
const v = Date.now();

scripts.forEach(src => {
  const s = document.createElement("script");
  s.src = `${BASE}/${src}?v=${v}`;
  document.head.appendChild(s);
});
