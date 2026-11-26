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
  background-image: linear-gradient(
    115deg,
    #e8ffff 0%,
    #b8f0f0 20%,
    #f0e8ff 40%,
    #e0f8e8 60%,
    #fff8e0 80%,
    #e8ffff 100%
  );
  background-size: 200% 200%;
  background-position: var(--pearl-x) var(--pearl-y);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

@property --pearl-x { syntax: "<percentage>"; inherits: true; initial-value: 0%; }
@property --pearl-y { syntax: "<percentage>"; inherits: true; initial-value: 30%; }

html {
  animation: pearl 8s ease-in-out infinite;
}

@keyframes pearl {
  0%   { --pearl-x: 0%;  --pearl-y: 30%; }
  25%  { --pearl-x: 40%; --pearl-y: 70%; }
  50%  { --pearl-x: 80%; --pearl-y: 20%; }
  75%  { --pearl-x: 30%; --pearl-y: 80%; }
  100% { --pearl-x: 0%;  --pearl-y: 30%; }
}


#mynameis, #includesextrainfo{
  font-size:30px;
}

#mynameis, #fullnamediv{
  display:none;
}



.resourcelinkwrapping{
    border-style: outset;
    border-width: thick;
    padding: 4px;
    width:fit-content;
    max-width: 90%;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    overflow-wrap: break-word;
    font-size: 30px;
    font-weight: bold;
    font-style: normal;
    font-family: Palatino, "Palatino Linotype", Georgia, serif;
    letter-spacing: 0.06em;
}

.description{
  font-style: normal;
  font-weight: bold;
}

#list-block {
  position: relative;
  width: 88%;
  margin: auto;
}

#resources {
  height: 30vh;
  overflow: scroll;
  background: transparent;
  font-style: normal;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

#resources::-webkit-scrollbar {
  display: none;
}

.edge {
  position: absolute;
  left: 0;
  right: 0;
  height: 18%;
  pointer-events: none;
  z-index: 1;
}

.edge-top {
  top: 0;
  background: linear-gradient(to bottom, #000 0%, rgba(0,0,0,0) 100%);
}

.edge-bottom {
  bottom: 0;
  background: linear-gradient(to top, #000 0%, rgba(0,0,0,0) 100%);
}

.resourcelisting0, .resourcelisting1{
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 12vh;
  margin-bottom: 0;
  font-size: x-large;
  font-family: Palatino, "Palatino Linotype", Georgia, serif;
  font-weight: bold;
  font-style: normal;
  letter-spacing: 0.04em;
}

.resourcelisting0 > *,
.resourcelisting1 > * {
  display: block;
  width: fit-content;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  white-space: normal;
}

#resources .pearltext {
  display: block;
  width: fit-content;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  background-image: linear-gradient(
    115deg,
    #e8ffff 0%,
    #b8f0f0 20%,
    #f0e8ff 40%,
    #e0f8e8 60%,
    #fff8e0 80%,
    #e8ffff 100%
  );
  background-size: 200% 200%;
  background-position: var(--pearl-x) var(--pearl-y);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  font-family: Palatino, "Palatino Linotype", Georgia, serif;
  font-weight: bold;
  font-style: normal;
}

#resources > :last-child {
  margin-bottom: 12vh;
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
    
  var extrainfodiv = document.createElement("div");
  center.appendChild(extrainfodiv);
  extrainfodiv.className = "extrainfo";
  extrainfodiv.id = "extrainfo";


    var listBlock = document.createElement("div");
listBlock.id = "list-block";
center.appendChild(listBlock);

var resourcesdiv = document.createElement("div");
resourcesdiv.className = "resources";
resourcesdiv.id = "resources";
listBlock.appendChild(resourcesdiv);

var edgeTop = document.createElement("div");
edgeTop.className = "edge edge-top";
listBlock.appendChild(edgeTop);

var edgeBottom = document.createElement("div");
edgeBottom.className = "edge edge-bottom";
listBlock.appendChild(edgeBottom);

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
        createElementWithTag_Text_andAppendTo_("p",metaurl,div).className="metaurl pearltext";
        var rlw = document.createElement("div");
        rlw.className = "resourcelinkwrapping";
        if (resource.nonclickable)
        {
          rlw.textContent = url;
          rlw.classList.add("pearltext");
        }
        else
        {
          var a = document.createElement("a");
          a.href = url;
          a.innerText = url;
          a.className = "resourcelink pearltext";
          rlw.appendChild(a);
        }
        div.appendChild(rlw);
        div.className = Object.keys(this.rendered).length%2?"resourcelisting1":"resourcelisting0";
        if(highlight)
          div.classList.add("my-class");
        createElementWithTag_Text_andAppendTo_("p",resource.description||"",div).className="description pearltext";
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
