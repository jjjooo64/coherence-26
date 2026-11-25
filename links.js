function createElementWithTag_Text_andAppendTo_(tag,text,parent)
{
    var e = document.createElement(tag);
   e.innerHTML = text;

   parent.appendChild(e);
   return e;
}

function createLinkWithURL_Tag_Parent_withText_(url,wrapperTag,parent,text)
{
          if(!text) text = url;
           var a = document.createElement("a");
           a.href = url;
           a.innerText = text;
          var wrapper;
          if (wrapperTag)
          {
              wrapper = document.createElement(wrapperTag);
              wrapper.appendChild(a);
           }
          else
               wrapper = a;
           parent.appendChild(wrapper);
           return wrapper;

}

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML =
`


.center {
  text-align: center;

}

body{
  background-color:black;
}

#greetings,#goodbye,#extrainfo{
  background-color: black;
  color: white;
  font-style: italic;
}

a {
    font-style: normal;
    color:black;
}

.metaurl{
  font-size:medium;
}


#youmayfind, #greetdiv, #fullnamediv, #theabove{
  font-size: 40px;
  font-weight: bold;
}

#concludediv{
  font-size: 35px;
  font-weight: bold;
}

#secretbox{
    text-align: center;
    font-weight: bold;
    font-size: 30px;
    border: white;
    border-style: ridge;
    background: black;
    margin: 35px auto;
    width: 70%;
    max-width: 100%;
    box-sizing: border-box;
    font-style: normal;
    padding: 10px;
    color: cyan;
    border-width: 10px;
    position: relative;
    overflow: hidden;
}

#secretbox {
  background: linear-gradient(
    115deg,
    #e8ffff 0%,
    #b8f0f0 20%,
    #f0e8ff 40%,
    #e0f8e8 60%,
    #fff8e0 80%,
    #e8ffff 100%
  );
  background-size: 200% 200%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: pearl 8s ease-in-out infinite;
}

@keyframes pearl {
  0%   { background-position: 0% 30%; }
  25%  { background-position: 40% 70%; }
  50%  { background-position: 80% 20%; }
  75%  { background-position: 30% 80%; }
  100% { background-position: 0% 30%; }
}


#mynameis, #includesextrainfo{
  font-size:30px;
}

#mynameis, #fullnamediv{
  display:none;
}



#resources {
  height: 50vh;
  overflow: hidden;
  position: relative;
  background: transparent;
  color: rgba(255,255,255,0.65);
  font-family: serif;
  font-style: normal;
  letter-spacing: 0.3em;
  text-transform: lowercase;
  text-shadow: 0 0 8px rgba(255,255,255,0.8),
               0 0 16px rgba(0,255,255,0.4);
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 18%,
    black 82%,
    transparent 100%
  );
  mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 18%,
    black 82%,
    transparent 100%
  );
}

#resources-inner {
  will-change: transform;
}

.resourcelisting0,
.resourcelisting1 {
  margin-top: 12vh;
  font-size: 2.4vh;
  border: none;
}

.resourcelisting0:last-child,
.resourcelisting1:last-child {
  margin-bottom: 12vh;
}

.metaurl {
  font-size: 0.75em;
  letter-spacing: 0.35em;
  opacity: 0.8;
  margin-bottom: 0.6em;
}

.resourcelinkwrapping {
  border: none;
  background: transparent;
  width: auto;
  max-width: 95%;
  margin: 0.8em auto;
  padding: 0;
  letter-spacing: 0.25em;
}

.resourcelinkwrapping a {
  color: rgba(255,255,255,0.7);
  text-shadow: 0 0 8px rgba(255,255,255,0.8),
               0 0 16px rgba(0,255,255,0.4);
}

.description {
  font-style: normal;
  letter-spacing: 0.2em;
  opacity: 0.7;
  font-size: 0.85em;
  margin-top: 0.6em;
}


.domainlinkwrapper{
  font-size:35px;
  padding:10px;
}
a:link{

  text-decoration: none;
}
a:visited{

  text-decoration: none;
}
a:hover{

  text-decoration: none;
}
a:active{
  text-decoration: none;
}

.domainlink:link{
  color:cyan;
}
.domainlink:visited{
  color:cyan;
}
.domainlink:hover{
  color:yellow;
}
.domainlink:active{
  color:magenta;
}
.namelisting{

  color:cyan;
  font-style: normal;
}

.resourcelisting0, .resourcelisting1{
  font-size: x-large;
}
`;
document.getElementsByTagName('head')[0].appendChild(style);

function br (s,n){return s?(s+("<br>".repeat(n))):"";}

function createNameListingFromProtocol_Domain_andAppendTo_(protocol, domain,parent)
{
   var div = createElementWithTag_Text_andAppendTo_("div", domain.replaceAll(".","dot").toUpperCase() ,parent);
  var a = createLinkWithURL_Tag_Parent_withText_
  (  protocol + "://" + domain
    ,""
    ,div
    , " " + domain
  );
  a.className = "domainlink";

  div.className = "namelisting";
}

function replaceClusters(str, alphabet, replacer) {
  if (!alphabet) return str;
  const escaped = alphabet.replace(/[-\\\]^]/g, '\\$&');
  const regex = new RegExp(`[${escaped}]+`, 'g');
  return str.replace(regex, () => replacer);
}

function parseMetaurl(metaurl)
{
    var lower = metaurl.toLowerCase(); 
    lower = replaceClusters(lower, "/#", "/");
    lower = lower.at(-1)=="/" ? lower.slice(0,-1) : lower;
    var splitAt = lower.lastIndexOf("/");
    if (splitAt >= 0) {
        return [lower.slice(0, splitAt), lower.slice(splitAt + 1)];
    }
    else{
        return [lower, ""];
    }
}

function addressBar()
{
    return parseMetaurl(location.href.slice(location.protocol.length + 2));
}

async function main() {
  const data = await renderParameters.load();
  renderParameters.domains = data.domains;
  renderParameters.resourceLocations = data.resourceLocations;
  renderParameters.verificationText = data.verificationText;

  if (renderParameters.title)
    document.title = renderParameters.title;

  var center = document.createElement("div");
  center.className = 'center';
  document.body.appendChild(center);
  var greetingsdiv = createElementWithTag_Text_andAppendTo_("div", br(renderParameters.title,2), center);
  greetingsdiv.id = "greetings"
  var secretBox = document.createElement("div");
  secretBox.id = "secretbox";
  greetingsdiv.appendChild(secretBox);
  secretBox.innerText = renderParameters.verificationText || renderParameters.boxFiller;

  // Secret tap sequence to open admin: 
  // 1 (start) -> 2 (0.7-1.2s) -> 3 (0-300ms) -> 4 (0.7-1.2s) -> 5 (0.7-1.2s) -> 6 (0-300ms)
  (function () {
    const steps = [
      { min: 700, max: 1200 }, // after 1
      { min: 0,   max: 300  }, // after 2
      { min: 700, max: 1200 }, // after 3
      { min: 700, max: 1200 }, // after 4
      { min: 0,   max: 300  }  // after 5
    ];
    let step = 0;
    let last = 0;
    let timer = null;

    function reset() {
      step = 0;
      last = 0;
      if (timer) clearTimeout(timer);
      timer = null;
    }

    secretBox.addEventListener("click", () => {
      const now = Date.now();
      if (step === 0) {
        step = 1;
        last = now;
        timer = setTimeout(reset, 1500);
        return;
      }
      const dt = now - last;
      const expected = steps[step - 1];
      if (dt >= expected.min && dt <= expected.max) {
        step++;
        last = now;
        if (timer) clearTimeout(timer);
        if (step === 6) {
          reset();
          const base = (renderParameters.endpoint || "").replace(/\/$/, "");
          if (base) location.href = base + "/admin";
          return;
        }
        timer = setTimeout(reset, 1500);
      } else {
        reset();
      }
    });
  })();

  var greetdiv = createElementWithTag_Text_andAppendTo_("div",   br(renderParameters.greeting,2)   ,greetingsdiv);
  greetdiv.id = "greetdiv";

  var concludediv = createElementWithTag_Text_andAppendTo_("div",    br(renderParameters.conclusion,1) ,greetingsdiv);
  concludediv.id = "concludediv";

  var here = addressBar();
  var matches = [];
  var sameDomain = [];
  var otherDomain = [];
  for (var item of renderParameters.resourceLocations){
      var parsed = parseMetaurl(item.metaURL);
      var entry = { metaurl: item.metaURL, resource: item, parsed: parsed };
      if (parsed[0] === here[0] && parsed[1] === here[1])
          matches.push(entry);
      else if (parsed[0] === here[0])
          sameDomain.push(entry);
      else
          otherDomain.push(entry);
  }
    
class expanderInstaller {
    /*
    static #expanders = [];
    static #expandListener(e) {
        resourcesdiv.className = "resourcesexpanded";
        for (const exp of this.#expanders) exp.hidden = true;
        // hide the shared rings too
        // document.querySelectorAll('#list-block > .ring').forEach(r => r.remove());
    }
    */
    //dont want interactive expanders as of right now
    static install(id, parent) {
        var expander = document.createElement("div");
        expander.className = "expander";
        expander.id = id;
        parent.appendChild(expander);

        return; 
        /*
        var expandBtn = createElementWithTag_Text_andAppendTo_("button", "expand list", expander);
        expander.addEventListener("click", (e) => this.#expandListener(e));
        
        this.#expanders.push(expander);
        return expander;
        */
    }
} 
    

    
  var extrainfodiv = document.createElement("div");
  center.appendChild(extrainfodiv);
  extrainfodiv.className = "extrainfo";
  extrainfodiv.id = "extrainfo";




var resourcesdiv = document.createElement("div");
resourcesdiv.className = "resources";
resourcesdiv.id = "resources";
center.appendChild(resourcesdiv);

var resourcesInner = document.createElement("div");
resourcesInner.id = "resources-inner";
resourcesdiv.appendChild(resourcesInner);


// rings removed


    

    


  var goodbye = document.createElement("div");
  goodbye.className = "goodbye";
  goodbye.id = "goodbye";
  center.appendChild(goodbye);

  const resourceRenderer
  =
  {
     rendered : {}
    ,render(metaurl,resource,highlight)
    {
      var url = resource.url
      if (!this.rendered[url] || !url)
      {
        this.rendered[url]=true;
        var div = document.createElement("div");
        resourcesInner.appendChild(div);
        createElementWithTag_Text_andAppendTo_("p",metaurl,div).className="metaurl";
        var rlw = document.createElement("div");
        rlw.className = "resourcelinkwrapping";
        if (resource.nonclickable)
        {
          rlw.textContent = url;
        }
        else
        {
          var a = document.createElement("a");
          a.href = url;
          a.innerText = url;
          a.className = "resourcelink";
          rlw.appendChild(a);
        }
        div.appendChild(rlw);
        div.className = Object.keys(this.rendered).length%2?"resourcelisting1":"resourcelisting0";
        if(highlight)
          div.classList.add("my-class");
        createElementWithTag_Text_andAppendTo_("p",resource.description||"",div).className="description";
      }
    }
  };

  var matchCount = matches.length;
  if(matchCount>0)
  {
     createElementWithTag_Text_andAppendTo_
     (
         "div"
         ,  renderParameters.tagFoundSmallText
        ,extrainfodiv
    ).id = "includesextrainfo";

    createElementWithTag_Text_andAppendTo_
    (
         "div"
        , renderParameters.tagFoundBigText(matchCount)
        , extrainfodiv
    ).id = "youmayfind";

    for (var match of matches)
    {
      resourceRenderer.render(match.metaurl , match.resource, true);
    }
  }

    const urlParams = new URLSearchParams(window.location.search);
    const hideExtras = urlParams.get('hideExtras') !== null ;
    if (!hideExtras)
    {
        for (var entry of sameDomain.concat(otherDomain))
        {
            resourceRenderer.render(entry.metaurl , entry.resource);
        }
    }
     createElementWithTag_Text_andAppendTo_("div", renderParameters.goodbye, goodbye).id="theabove";
   var allDomains = renderParameters.maindomains.concat(renderParameters.domains);
   var currentDomains = allDomains.filter(e=>e[1].toLowerCase()===here[0]);
   var unMatchedDomains = allDomains.filter(e=>e[1].toLowerCase()!==here[0]);
    for (d of hideExtras ? (matchCount ? currentDomains : []) : currentDomains.concat(unMatchedDomains))
    {
      var div
      = createLinkWithURL_Tag_Parent_withText_
      (  d[0] + "://" + d[1]
        ,"div"
        ,goodbye
        ,  d[1]
      )
      ;
      div.className = "domainlinkwrapper";
      div.getElementsByTagName("a")[0].className = "domainlink";
    }

  // precompute letter states once
  const letterStates = new Map();
  const STEPS = 20;

  function buildStates() {
    const container = document.getElementById('resources');
    if (!container) return;
    const letters = container.querySelectorAll('.vapor-letter');
    letterStates.clear();

    letters.forEach((letter, i) => {
      const seed = Math.random() * 1000;
      const states = [];
      for (let s = 0; s <= STEPS; s++) {
        const dist = s / STEPS;
        if (dist < 0.01) {
          states.push(null);
          continue;
        }
        const wave = Math.sin(seed + dist * 4) * dist;
        const wave2 = Math.cos(seed * 1.3 + dist * 3) * dist;
        const blur = dist * 5;
        const scaleX = 1 + dist * 0.5 + wave * 0.2;
        const scaleY = 1 + dist * 0.3 + wave2 * 0.15;
        const skew = wave * 12;
        const dx = wave2 * 8 * dist;
        const dy = wave * 6 * dist;
        const opacity = 1 - dist * 0.9;
        states.push({
          filter: `blur(${blur.toFixed(2)}px)`,
          transform: `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px) scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)}) skewX(${skew.toFixed(2)}deg)`,
          opacity: opacity.toFixed(3)
        });
      }
      letterStates.set(letter, states);
    });
  }

  // letter offsets relative to resourcesInner (precomputed)
  const letterOffsets = new Map();

  function buildOffsets() {
    letterOffsets.clear();
    const base = resourcesInner.getBoundingClientRect().top;
    const letters = resourcesInner.querySelectorAll('.vapor-letter');
    letters.forEach(letter => {
      const r = letter.getBoundingClientRect();
      letterOffsets.set(letter, (r.top - base) + r.height / 2);
    });
  }

  function vaporize() {
    const viewH = resourcesdiv.clientHeight;
    const fadeZone = viewH * 0.28;
    const scroll = currentY;

    letterOffsets.forEach((offset, letter) => {
      const states = letterStates.get(letter);
      if (!states) return;
      const posInView = offset - scroll;
      let dist = 0;
      if (posInView < fadeZone) {
        dist = (fadeZone - posInView) / fadeZone;
      } else if (posInView > viewH - fadeZone) {
        dist = (posInView - (viewH - fadeZone)) / fadeZone;
      }
      dist = Math.min(Math.max(dist, 0), 1);
      const idx = Math.round(dist * STEPS);
      const state = states[idx];

      if (!state) {
        if (letter._lastIdx !== -1 && letter._lastIdx !== undefined) {
          letter.style.transform = '';
          letter.style.filter = '';
          letter.style.opacity = '';
          letter._lastIdx = -1;
        }
        return;
      }
      if (letter._lastIdx === idx) return;
      letter._lastIdx = idx;
      letter.style.filter = state.filter;
      letter.style.transform = state.transform;
      letter.style.opacity = state.opacity;
      letter.style.display = 'inline-block';
    });
  }

  // multiplicative accel scroll
  let currentY = 0;
  let velocity = 0;
  let accel = 1;          // multiplier applied to velocity each frame
  let targetY = 0;
  window.MAX_ACCEL = 1.08;       // max |accel| as multiplier (e.g. 1.08 or 0.92)
  window.MAX_ACCEL_CHANGE = 0.02; // max change in accel multiplier per frame
  window.MAX_VEL = 12;
  window.STOP_TIME_OK = 300;     // ms; allow reverse only if we can stop faster than this
  let lastVaporTime = 0;
  const VAPOR_INTERVAL = 50;

  function maxScroll() {
    return Math.max(0, resourcesInner.scrollHeight - resourcesdiv.clientHeight);
  }

  // closest point we can stop at given current vel and accel limits
  function closestStopPoint() {
    if (Math.abs(velocity) < 0.2) return currentY;
    const minDecel = 1 / window.MAX_ACCEL; // strongest slowdown multiplier
    let v = velocity;
    let y = currentY;
    let a = accel;
    for (let i = 0; i < 600; i++) {
      // move accel toward minDecel, limited by MAX_ACCEL_CHANGE
      const desired = v > 0 ? minDecel : (1 / minDecel);
      let da = desired - a;
      da = Math.max(-window.MAX_ACCEL_CHANGE, Math.min(window.MAX_ACCEL_CHANGE, da));
      a += da;
      a = Math.max(minDecel, Math.min(window.MAX_ACCEL, a));
      v *= a;
      if (Math.abs(v) > window.MAX_VEL) v = Math.sign(v) * window.MAX_VEL;
      y += v;
      if (Math.abs(v) < 0.2) break;
    }
    return y;
  }

  function timeToStop() {
    if (Math.abs(velocity) < 0.2) return 0;
    const minDecel = 1 / window.MAX_ACCEL;
    let v = velocity;
    let a = accel;
    let frames = 0;
    for (let i = 0; i < 600; i++) {
      const desired = v > 0 ? minDecel : (1 / minDecel);
      let da = desired - a;
      da = Math.max(-window.MAX_ACCEL_CHANGE, Math.min(window.MAX_ACCEL_CHANGE, da));
      a += da;
      a = Math.max(minDecel, Math.min(window.MAX_ACCEL, a));
      v *= a;
      frames++;
      if (Math.abs(v) < 0.2) break;
    }
    return frames * 16.67;
  }

  function clampTarget(proposed) {
    const max = maxScroll();
    proposed = Math.max(0, Math.min(proposed, max));
    const stopAt = closestStopPoint();
    const canReverse = timeToStop() < window.STOP_TIME_OK;

    if (velocity > 0.2) {
      // moving down; cannot target above stop point unless reverse allowed
      if (proposed < stopAt && !canReverse) proposed = stopAt;
    } else if (velocity < -0.2) {
      if (proposed > stopAt && !canReverse) proposed = stopAt;
    }
    return proposed;
  }

  resourcesdiv.addEventListener('wheel', e => {
    e.preventDefault();
    targetY = clampTarget(targetY + e.deltaY * 0.6);
  }, { passive: false });

  let touchStartY = 0;
  resourcesdiv.addEventListener('touchstart', e => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  resourcesdiv.addEventListener('touchmove', e => {
    e.preventDefault();
    const dy = touchStartY - e.touches[0].clientY;
    targetY = clampTarget(targetY + dy * 0.7);
    touchStartY = e.touches[0].clientY;
  }, { passive: false });

  function scrollLoop() {
    const dist = targetY - currentY;
    const absDist = Math.abs(dist);
    const maxA = window.MAX_ACCEL || 1.08;
    const maxAC = window.MAX_ACCEL_CHANGE || 0.02;
    const maxV = window.MAX_VEL || 12;
    const minA = 1 / maxA;

    if (absDist > 0.5 || Math.abs(velocity) > 0.2) {
      // desired accel multiplier: >1 to speed up in direction of target, <1 to slow
      const wantSpeed = Math.sign(dist) * Math.min(maxV, absDist * 0.15);
      let desiredAccel = 1;
      if (Math.abs(velocity) > 0.2) {
        if (Math.sign(wantSpeed) === Math.sign(velocity) && Math.abs(wantSpeed) > Math.abs(velocity)) {
          desiredAccel = maxA;
        } else {
          desiredAccel = minA;
        }
      } else {
        desiredAccel = maxA;
        if (Math.abs(velocity) < 0.2 && Math.abs(dist) > 0.5) {
          velocity = Math.sign(dist) * 0.3;
        }
      }

      let da = desiredAccel - accel;
      da = Math.max(-maxAC, Math.min(maxAC, da));
      accel += da;
      accel = Math.max(minA, Math.min(maxA, accel));

      velocity *= accel;
      if (Math.abs(velocity) > maxV) velocity = Math.sign(velocity) * maxV;

      currentY += velocity;
      const max = maxScroll();
      currentY = Math.max(0, Math.min(currentY, max));
      resourcesInner.style.transform = `translateY(${-currentY}px)`;

      const now = performance.now();
      if (now - lastVaporTime > VAPOR_INTERVAL) {
        vaporize();
        lastVaporTime = now;
      }
    } else {
      velocity = 0;
      accel = 1;
      currentY = targetY;
      resourcesInner.style.transform = `translateY(${-currentY}px)`;
    }
    requestAnimationFrame(scrollLoop);
  }
  scrollLoop();

  window.addEventListener('resize', () => { buildStates(); buildOffsets(); vaporize(); });

  // wrap every letter so vaporize can target them individually
  // preserve word boundaries so wrapping stays natural
  function wrapLetters(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    const texts = [];
    let node;
    while (node = walker.nextNode()) texts.push(node);
    texts.forEach(textNode => {
      if (!textNode.textContent.trim()) return;
      const frag = document.createDocumentFragment();
      const parts = textNode.textContent.split(/(\s+)/);
      parts.forEach(part => {
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
        } else {
          const word = document.createElement('span');
          word.style.whiteSpace = 'nowrap';
          for (const ch of part) {
            const span = document.createElement('span');
            span.className = 'vapor-letter';
            span.textContent = ch;
            word.appendChild(span);
          }
          frag.appendChild(word);
        }
      });
      textNode.parentNode.replaceChild(frag, textNode);
    });
  }
  wrapLetters(resourcesInner);
  buildStates();
  buildOffsets();
  vaporize();
}

main();
