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
  height: 45vh;
  overflow-y: scroll;
  overflow-x: hidden;
  background: transparent;
  color: rgba(255,255,255,0.65);
  font-family: serif;
  font-style: normal;
  letter-spacing: 0.3em;
  text-transform: lowercase;
  text-shadow: 0 0 8px rgba(255,255,255,0.8),
               0 0 16px rgba(0,255,255,0.4);
  -ms-overflow-style: none;
  scrollbar-width: none;
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 12%,
    black 88%,
    transparent 100%
  );
  mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 12%,
    black 88%,
    transparent 100%
  );
}

#resources::-webkit-scrollbar {
  display: none;
}

.resourcelisting0,
.resourcelisting1 {
  margin: 3.5em 0;
  font-size: 2.4vh;
  border: none;
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
  margin-bottom: 8vh;
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
