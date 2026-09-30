/** La Barbe à Papa — navigation, accessible galleries and motion preferences. */
(() => {
  'use strict';
  const root=document.documentElement;
  const motionButton=document.getElementById('motion-control');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const preferenceKey='lbap-atelier-chrome-motion';
  let saved=null;
  try { const value=localStorage.getItem(preferenceKey);if(value==='on'||value==='off')saved=value; } catch { /* Storage can be restricted on file:// or in private browsing. */ }
  let motion=saved?saved==='on':!reduced.matches;
  let scene=null;
  function applyMotion() {
    root.dataset.motion=motion?'on':'off';motionButton.setAttribute('aria-pressed',String(motion));
    motionButton.setAttribute('aria-label',motion?'Désactiver les animations':'Activer les animations');
    motionButton.querySelector('.motion-symbol').textContent=motion?'Ⅱ':'▷';
    scene?.setMotion(motion);
  }
  applyMotion();
  motionButton.addEventListener('click',()=>{motion=!motion;saved=motion?'on':'off';try{localStorage.setItem(preferenceKey,saved);}catch{}applyMotion();});
  reduced.addEventListener('change',()=>{if(!saved){motion=!reduced.matches;applyMotion();}});
  const visibilityObserver=new IntersectionObserver(entries=>entries.forEach(e=>e.target.dataset.inview=String(e.isIntersecting)),{threshold:0.01});
  document.querySelectorAll('.hero,.marquee,.contact').forEach(el=>visibilityObserver.observe(el));
  document.addEventListener('visibilitychange',()=>root.classList.toggle('page-paused',document.hidden));
  const canvas=document.getElementById('pole-canvas'),container=document.getElementById('hero-scene');
  // Let the first readable frame paint before initializing decorative GPU work.
  requestAnimationFrame(()=>{if(window.AtelierScene){scene=new window.AtelierScene(canvas,container);window.atelierScene=scene;scene.setMotion(motion);}});

  const menuButton=document.getElementById('menu-toggle'),menu=document.getElementById('mobile-menu');
  const focusable='a[href],button:not([disabled]),[tabindex="0"]';
  let menuOpen=false;
  function setMenu(open,{restore=true}={}) {
    menuOpen=open;menu.hidden=!open;menu.inert=!open;
    menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');
    document.body.classList.toggle('locked',open);
    document.getElementById('main').inert=open;document.querySelector('.site-footer').inert=open;
    motionButton.inert=open;document.querySelector('.mobile-visit').inert=open;
    if(open){menu.querySelector('a').focus();}else if(restore){menuButton.focus();}
  }
  menuButton.addEventListener('click',()=>setMenu(!menuOpen));
  menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
    setMenu(false,{restore:false});
    // Move keyboard focus out of the hidden menu into the chosen section.
    const section=document.querySelector(link.getAttribute('href'));
    if(section){section.setAttribute('tabindex','-1');requestAnimationFrame(()=>section.focus({preventScroll:true}));}
  }));
  document.addEventListener('keydown',(e)=>{
    if(!menuOpen)return;
    if(e.key==='Escape'){e.preventDefault();setMenu(false);}
    if(e.key==='Tab') {
      const items=[menuButton,...menu.querySelectorAll(focusable)],first=items[0],last=items.at(-1);
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change',e=>{if(e.matches&&menuOpen)setMenu(false,{restore:false});});

  // Real source photographs. The designed fallback stays visible if the origin is offline.
  const sourcePhotos=[...document.querySelectorAll('.source-photo')];
  function photoLoaded(img){if(img.naturalWidth>0)img.closest('.media-shell').classList.add('loaded');}
  function photoFailed(img){img.closest('.media-shell').classList.remove('loaded');if(img.closest('.gallery'))document.getElementById('gallery-offline-note').hidden=false;}
  sourcePhotos.forEach(img=>{img.addEventListener('load',()=>photoLoaded(img));img.addEventListener('error',()=>photoFailed(img));if(img.complete){if(img.naturalWidth)photoLoaded(img);else photoFailed(img);}});
  const galleryTrack=document.getElementById('gallery-track'),prev=document.getElementById('gallery-prev'),next=document.getElementById('gallery-next');
  function updateArrows(){prev.disabled=galleryTrack.scrollLeft<3;next.disabled=galleryTrack.scrollLeft+galleryTrack.clientWidth>=galleryTrack.scrollWidth-3;}
  function moveGallery(direction){const card=galleryTrack.querySelector('.gallery-card');galleryTrack.scrollBy({left:direction*(card.getBoundingClientRect().width+parseFloat(getComputedStyle(galleryTrack).gap)),behavior:motion?'smooth':'instant'});}
  prev.addEventListener('click',()=>moveGallery(-1));next.addEventListener('click',()=>moveGallery(1));
  galleryTrack.addEventListener('scroll',updateArrows,{passive:true});new ResizeObserver(updateArrows).observe(galleryTrack);updateArrows();
  galleryTrack.addEventListener('keydown',e=>{if(e.target===galleryTrack&&(e.key==='ArrowRight'||e.key==='ArrowLeft')){e.preventDefault();moveGallery(e.key==='ArrowRight'?1:-1);}});

  const lightbox=document.getElementById('lightbox'),lightboxImg=document.getElementById('lightbox-image'),lightboxError=document.getElementById('lightbox-error');
  const photos=[...document.querySelectorAll('.gallery-card img')];let activePhoto=0,lastTrigger=null;
  function showPhoto(index){activePhoto=(index+photos.length)%photos.length;const img=photos[activePhoto];lightboxError.hidden=true;lightboxImg.hidden=false;lightboxImg.alt=img.alt;document.getElementById('lightbox-title').textContent=`LA BARBE À PAPA / RÉALISATION ${String(activePhoto+1).padStart(2,'0')}`;document.getElementById('lightbox-counter').textContent=`${String(activePhoto+1).padStart(2,'0')} / ${String(photos.length).padStart(2,'0')}`;lightboxImg.src=img.currentSrc||img.src;}
  lightboxImg.addEventListener('error',()=>{lightboxError.hidden=false;lightboxImg.hidden=true;});
  lightboxImg.addEventListener('load',()=>{lightboxError.hidden=true;lightboxImg.hidden=false;});
  document.querySelectorAll('.gallery-card').forEach(btn=>btn.addEventListener('click',()=>{lastTrigger=btn;showPhoto(Number(btn.dataset.image));lightbox.showModal();document.body.classList.add('locked');document.getElementById('lightbox-close').focus();}));
  function closeLightbox(){lightbox.close();}
  document.getElementById('lightbox-close').addEventListener('click',closeLightbox);
  lightbox.addEventListener('close',()=>{document.body.classList.remove('locked');lastTrigger?.focus();});
  document.getElementById('lightbox-prev').addEventListener('click',()=>showPhoto(activePhoto-1));document.getElementById('lightbox-next').addEventListener('click',()=>showPhoto(activePhoto+1));
  lightbox.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();showPhoto(activePhoto+(e.key==='ArrowRight'?1:-1));}});
  lightbox.addEventListener('click',e=>{if(e.target===lightbox){const r=lightbox.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeLightbox();}});
  const about=document.getElementById('about-dialog'),aboutBtn=document.getElementById('about-preview');
  aboutBtn.addEventListener('click',()=>{about.showModal();document.body.classList.add('locked');document.getElementById('about-close').focus();});
  document.getElementById('about-close').addEventListener('click',()=>about.close());
  about.addEventListener('close',()=>{document.body.classList.remove('locked');aboutBtn.focus();});
  about.addEventListener('click',e=>{if(e.target===about){const r=about.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)about.close();}});
  // Native <dialog> traps focus; Escape closes and restores focus via close handlers.
  window.addEventListener('pagehide',()=>scene?.destroy());
  // A back/forward-cache restore does not re-run scripts: rebuild the GPU state.
  window.addEventListener('pageshow',e=>{
    if(e.persisted&&window.AtelierScene){
      root.classList.toggle('page-paused',document.hidden);
      scene=new window.AtelierScene(canvas,container);window.atelierScene=scene;scene.setMotion(motion);
    }
  });
})();

