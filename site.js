(function(){
  const projects=window.PROJECTS||[];
  const total=String(projects.length).padStart(2,"0");
  const grid=document.querySelector("[data-project-grid]");
  function card(project,index){
    const visual=project.image?`<img src="${project.image}" srcset="${project.imageSrcset}" sizes="(max-width:760px) 94vw, 46vw" width="${project.imageWidth}" height="${project.imageHeight}" alt="Campaign artwork for ${project.brand} ${project.title}" loading="${index<2?"eager":"lazy"}" decoding="async" ${index===0?'fetchpriority="high"':""}>`:`<div class="project-letter palette-${project.palette}">${project.placeholder?project.number:project.title}<span class="project-index">${project.number} / ${total}</span></div>`;
    return `<a class="project-card ${project.size||"standard"}" href="project.html?project=${project.id}" aria-label="View ${project.brand}: ${project.title}"><div class="project-visual palette-${project.palette}${project.imageFit==="contain"?" artwork-contained":""}">${visual}</div><div class="project-meta"><h2>${project.title}</h2><p>${project.brand}</p></div></a>`;
  }
  if(grid)grid.innerHTML=projects.map(card).join("");
  const footer=document.querySelector(".site-footer");
  const pig=document.querySelector(".pig-button");
  if(footer){
    const footerObserver=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting)){
        footer.classList.add("is-visible");
        footerObserver.disconnect();
      }
    },{threshold:.25});
    footerObserver.observe(footer);
  }
  if(pig){
    const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)");
    const note=document.querySelector(".pig-note");
    let busy=false;
    let resetTimer;
    const settle=()=>{pig.classList.remove("is-hopping");busy=false};
    const showNote=()=>{footer.classList.add("is-visible");note.textContent="oink."};
    const hideNote=()=>{if(!pig.matches(":hover")&&document.activeElement!==pig)note.textContent=""};
    pig.addEventListener("pointerenter",showNote);
    pig.addEventListener("pointerleave",hideNote);
    pig.addEventListener("focus",showNote);
    pig.addEventListener("blur",hideNote);
    pig.addEventListener("click",()=>{
      if(busy)return;
      clearTimeout(resetTimer);
      note.textContent="oink.";
      if(!reducedMotion.matches){busy=true;pig.classList.add("is-hopping")}
      resetTimer=setTimeout(()=>{settle();hideNote()},1200);
    });
    pig.addEventListener("animationend",event=>{if(event.animationName==="pig-hop")settle()});
    reducedMotion.addEventListener("change",()=>{if(reducedMotion.matches)settle()});
  }
})();
