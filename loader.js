const BASE = "https://jjjooo64.github.io/coherence-26";
const scripts = ["renderParameters.js", "links.js"]; // first must finish before second starts
const v = Date.now();

function loadSequential(list, index = 0) {
  if (index >= list.length) return;
  const s = document.createElement("script");
  s.src = `${BASE}/${list[index]}?v=${v}`;
  s.onload = () => loadSequential(list, index + 1);
  s.onerror = () => console.error("Failed to load", list[index]);
  document.head.appendChild(s);
}

loadSequential(scripts);
