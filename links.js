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
}

.metaurl{
  font-size:small;
}

 #resources{
    background-color: white;
    color: black;
    font-style: normal;
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

.resources{
    overflow: hidden;
}

.resourcelinkwrapping{
    border-style: outset;
    border-width: thick;
    padding: 4px;
    width: fit-content;
    max-width: 80%;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    overflow-wrap: break-word;
}

.description{
  font-style: italic;
}


.resources{
  height: 21vh;
}

 #expander{
  height: 9vh;
}


#expander > button {
     
    font-size: 2.4vh;
   color: rgba(255,255,255,0.65);
    letter-spacing: 0.3em;
    text-transform: lowercase;
    background: transparent;
    font-family: serif;
    
    position: relative;
    overflow: hidden;
    border: none;
    width: 50%;
    height: 100%;
    text-shadow: 0 0 8px rgba(255,255,255,0.8),
               0 0 16px rgba(0,255,255,0.4);
}

#expander > button .ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  border: 0px solid rgba(0, 180, 200, 1);
  transform: translate(-50%, -50%);
  animation: ripple 12s ease-out infinite;
  filter: blur(1px);
  pointer-events: none;
}

#expander > button .ring:nth-child(1) { animation-delay: 0s; }
#expander > button .ring:nth-child(2) { animation-delay: 2s; }
#expander > button .ring:nth-child(3) { animation-delay: 4s; }
#expander > button .ring:nth-child(4) { animation-delay: 6s; }
#expander > button .ring:nth-child(5) { animation-delay: 8s; }
#expander > button .ring:nth-child(6) { animation-delay: 10s; }

@keyframes ripple {
  0% {
    width: 0;
    height: 0;
    opacity: 0.5;
    border-width: 1px;
  }

  30% {

    opacity: 0.5;
    border-width: 6px;
  }
  70% {
    opacity: 0.2;
  }
  100% {
    width: 100%;
    height: 100%;
    opacity: 0;
    border-width: 1px;
  }
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

text-decoration: underline;
}
a:active{
text-decoration: underline;
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
  border-style: none none solid none;
  border-color: #bbbbbb;
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
  for (var item of renderParameters.resourceLocations)
  {
      var parsed = parseMetaurl(item.metaURL);
      var entry = { metaurl: item.metaURL, resource: item, parsed: parsed };
      if (parsed[0] === here[0] && parsed[1] === here[1])
          matches.push(entry);
      else if (parsed[0] === here[0])
          sameDomain.push(entry);
      else
          otherDomain.push(entry);
  }

  var extrainfodiv = document.createElement("div");
  center.appendChild(extrainfodiv);
  extrainfodiv.className = "extrainfo";
  extrainfodiv.id = "extrainfo";
  var resourcesdiv = document.createElement("div");
  center.appendChild(resourcesdiv);
  resourcesdiv.className = "resources";
  resourcesdiv.id = "resources";

  var expander = document.createElement("div");
  expander.id="expander";
  expander.addEventListener
  (
    "click"
    , (e) =>
      {
        resourcesdiv.className = "resourcesexpanded";
        expander.hidden = true;
      }
  );

  //createElementWithTag_Text_andAppendTo_("div","...",expander);
  var expandBtn  = createElementWithTag_Text_andAppendTo_("button","expand list",expander);

for (var i = 0; i < 6; i++) {
  var ring = document.createElement("span");
  ring.className = "ring";
  expandBtn.appendChild(ring);
}
  center.appendChild(expander);

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
        resourcesdiv.appendChild(div);
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
}

main();
