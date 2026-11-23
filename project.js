(function(){
  const projects=window.PROJECTS||[];
  const id=new URLSearchParams(window.location.search).get("project");
  const project=projects.find(item=>item.id===id)||projects[0];
  if(!project)return;
  const escape=value=>String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  document.title=project.title+" — Martin Wong";
  document.querySelector("[data-project-brand]").textContent=project.brand;
  document.querySelector("[data-project-title]").textContent=project.title;
  document.querySelector("[data-project-statement]").textContent=project.statement;
  document.querySelector("[data-project-description]").textContent=project.description;
  const normalise=value=>value.toLowerCase().replace(/[^a-z0-9]/g,"");
  if(!project.statement||normalise(project.statement)===normalise(project.title)){
    document.querySelector("[data-project-statement]").hidden=true;
    document.querySelector(".case-lead").classList.add("is-concise");
  }
  if(project.finalCopy)document.querySelector(".case-lead").classList.add("has-final-copy");
  const films=document.querySelector("[data-films]");
  const poster=index=>project.image?'<img src="'+escape(project.image)+'" srcset="'+escape(project.imageSrcset)+'" sizes="93vw" width="'+project.imageWidth+'" height="'+project.imageHeight+'" loading="'+(index===0?"eager":"lazy")+'" decoding="async" alt="">':"";
  const videoSources=project.vimeoVideos?project.vimeoVideos.map(video=>({src:"https://player.vimeo.com/video/"+video,url:"https://vimeo.com/"+video,provider:"Vimeo"})):project.videos?project.videos.map(video=>({src:"https://www.youtube-nocookie.com/embed/"+video+"?playsinline=1",url:"https://www.youtube.com/watch?v="+video,provider:"YouTube"})):project.filmUrl&&project.filmUrl.includes("vimeo.com/")?[{src:"https://player.vimeo.com/video/"+new URL(project.filmUrl).pathname.split("/").filter(Boolean).pop(),url:project.filmUrl,provider:"Vimeo"}]:null;
  if(project.executions){
    films.classList.add("executions");
    films.innerHTML=project.executions.map((execution,index)=>{
      const youtube=execution.provider==="YouTube";
      const src=youtube?"https://www.youtube-nocookie.com/embed/"+execution.video+"?playsinline=1":"https://player.vimeo.com/video/"+execution.video;
      const url=youtube?"https://www.youtube.com/watch?v="+execution.video:"https://vimeo.com/"+execution.video;
      const gallery=execution.gallery?'<div class="execution-gallery">'+execution.gallery.map(item=>item.motionSrc?'<video class="motion-clip" src="'+escape(item.motionSrc)+'" poster="'+escape(item.src)+'" width="'+item.width+'" height="'+item.height+'" muted loop playsinline controls preload="none" aria-label="'+escape(item.alt)+'">'+escape(item.alt)+'</video>':'<img src="'+escape(item.src)+'" srcset="'+escape(item.srcset)+'" sizes="(max-width:760px) 90vw, 44vw" width="'+item.width+'" height="'+item.height+'" alt="'+escape(item.alt)+'" loading="lazy" decoding="async">').join("")+'</div>':"";
      return '<section class="execution" aria-label="Campaign '+(index+1)+'"><p class="execution-copy">'+escape(execution.copy)+'</p><div class="film-frame"><iframe src="'+src+'" title="'+escape(project.title+" — film "+(index+1))+'" loading="eager" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div><div class="film-label"><a href="'+url+'" target="_blank" rel="noopener noreferrer">Watch on '+execution.provider+'</a></div>'+gallery+'</section>';
    }).join("");
  }else if(project.stillImage){
    films.innerHTML='<img class="case-still" src="'+escape(project.stillImage)+'" srcset="'+escape(project.stillSrcset)+'" sizes="93vw" width="1912" height="1068" alt="My Moni banking avatar in the Bank of New Zealand app" decoding="async">';
  }else if(videoSources){
    films.innerHTML=videoSources.map((video,index)=>{
      const title=escape(project.title+" — film "+(index+1));
      return '<div class="film-block"><div class="film-frame'+(project.videoAspects?.[index]==="portrait"?' is-portrait':'')+'"><iframe src="'+escape(video.src)+'" title="'+title+'" loading="eager" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div><div class="film-label"><a href="'+escape(video.url)+'" target="_blank" rel="noopener noreferrer">Watch on '+video.provider+'</a></div></div>';
    }).join("");
  }else{
    films.innerHTML=Array.from({length:project.films},(_,index)=>{
      const url=index===0&&(project.filmUrl||project.caseUrl);
      const tag=url?"a":"div";
      const attrs=url?' href="'+escape(url)+'" target="_blank" rel="noopener noreferrer"':"";
      const label=url?(project.filmUrl?"Watch film":"View case study"):"Film link to come";
      return '<div class="film-block"><'+tag+' class="film-frame palette-'+project.palette+'"'+attrs+'>'+poster(index)+'<div class="film-placeholder"><span>'+label+'</span></div></'+tag+'><div class="film-label"><span>'+(index===0?(project.caseUrl?"Case study":"Film"):"Another chapter")+'</span></div></div>';
    }).join("");
  }
  if(project.gallery){
    // Still galleries stay independent of the film players.
    const gallery=document.createElement("div");gallery.className="case-gallery"+(project.galleryLayout==="campaign"?" campaign-gallery":project.galleryLayout==="storybook"?" storybook-gallery":project.galleryLayout==="full"?" full-gallery":"");
    project.gallery.forEach(item=>{
      const figure=document.createElement("figure");
      if(item.narrow)figure.className="is-narrow";
      if(item.motionSrc){
        const clip=document.createElement("video");
        clip.className="motion-clip";clip.src=item.motionSrc;clip.poster=item.src;clip.width=item.width;clip.height=item.height;
        clip.muted=true;clip.loop=true;clip.playsInline=true;clip.preload="none";clip.setAttribute("aria-label",item.alt);
        figure.append(clip);gallery.append(figure);return;
      }
      const img=document.createElement("img");
      img.src=item.src;img.alt=item.alt;img.loading="lazy";img.decoding="async";
      if(item.srcset){img.srcset=item.srcset;img.sizes=project.galleryLayout==="campaign"?"(max-width:760px) 93vw, 90vw":"93vw";}
      if(item.width){img.width=item.width;img.height=item.height;}
      figure.append(img);gallery.append(figure);
    });
    films.append(gallery);
  }
  const clips=Array.from(films.querySelectorAll(".motion-clip"));
  if(clips.length){
    const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        const clip=entry.target;
        if(entry.isIntersecting&&!reducedMotion.matches){clip.muted=true;clip.play().catch(()=>{});}
        else clip.pause();
      });
    },{threshold:.25});
    clips.forEach(clip=>observer.observe(clip));
    reducedMotion.addEventListener("change",()=>{if(reducedMotion.matches)clips.forEach(clip=>clip.pause());});
  }
  const caseList=document.querySelector("[data-case-list]");
  projects.forEach(item=>{
    const li=document.createElement("li");const link=document.createElement("a");
    link.href="project.html?project="+item.id;link.textContent=item.brand+" — "+item.title;
    if(item.id===project.id)link.setAttribute("aria-current","page");
    li.append(link);caseList.append(li);
  });
})();
