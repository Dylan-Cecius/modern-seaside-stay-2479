/** La Barbe à Papa — navigation, accessible galleries and motion preferences. */
(() => {
  'use strict';
  window.atelierSiteDestroy?.();
  const root=document.documentElement;
  const cleanups=[];
  const listen=(target,type,handler,options)=>{target.addEventListener(type,handler,options);cleanups.push(()=>target.removeEventListener(type,handler,options));};
  const observe=(observer,target)=>{observer.observe(target);cleanups.push(()=>observer.disconnect());};
  let destroyed=false,scene=null,sceneFrame=0,anchorFocusFrame=0;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let motion=!reduced.matches;
  function applyMotion() {
    root.dataset.motion=motion?'on':'off';scene?.setMotion(motion);
  }
  applyMotion();
  listen(reduced,'change',()=>{motion=!reduced.matches;applyMotion();});
  const visibilityObserver=new IntersectionObserver(entries=>entries.forEach(e=>e.target.dataset.inview=String(e.isIntersecting)),{threshold:0.01});
  document.querySelectorAll('.hero,.marquee,.contact').forEach(el=>visibilityObserver.observe(el));cleanups.push(()=>visibilityObserver.disconnect());
  const onVisibility=()=>root.classList.toggle('page-paused',document.hidden);listen(document,'visibilitychange',onVisibility);
  const canvas=document.getElementById('pole-canvas'),container=document.getElementById('hero-scene');
  sceneFrame=requestAnimationFrame(()=>{sceneFrame=0;if(!destroyed&&window.AtelierScene){scene=new window.AtelierScene(canvas,container);window.atelierScene=scene;scene.setMotion(motion);}});

  const menuButton=document.getElementById('menu-toggle'),menu=document.getElementById('mobile-menu');
  const focusable='a[href],button:not([disabled]),[tabindex="0"]';let menuOpen=false;
  function setMenu(open,{restore=true}={}) {
    menuOpen=open;menu.hidden=!open;menu.inert=!open;menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');
    document.body.classList.toggle('locked',open);document.getElementById('main').inert=open;document.querySelector('.site-footer').inert=open;document.querySelector('.mobile-visit').inert=open;
    if(open)menu.querySelector('a').focus();else if(restore)menuButton.focus();
  }
  listen(menuButton,'click',()=>setMenu(!menuOpen));
  menu.querySelectorAll('a').forEach(link=>listen(link,'click',()=>{setMenu(false,{restore:false});const section=document.querySelector(link.getAttribute('href'));if(section){section.setAttribute('tabindex','-1');anchorFocusFrame=requestAnimationFrame(()=>section.focus({preventScroll:true}));}}));
  const onMenuKeydown=e=>{if(!menuOpen)return;if(e.key==='Escape'){e.preventDefault();setMenu(false);}if(e.key==='Tab'){const items=[menuButton,...menu.querySelectorAll(focusable)],first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}};
  listen(document,'keydown',onMenuKeydown);
  const desktop=window.matchMedia('(min-width: 761px)');listen(desktop,'change',e=>{if(e.matches&&menuOpen)setMenu(false,{restore:false});});

  const sourcePhotos=[...document.querySelectorAll('.source-photo')];
  function photoLoaded(img){if(img.naturalWidth>0)img.closest('.media-shell').classList.add('loaded');}
  function photoFailed(img){img.closest('.media-shell').classList.remove('loaded');if(img.closest('.gallery'))document.getElementById('gallery-offline-note').hidden=false;}
  sourcePhotos.forEach(img=>{const loaded=()=>photoLoaded(img),failed=()=>photoFailed(img);listen(img,'load',loaded);listen(img,'error',failed);if(img.complete){if(img.naturalWidth)loaded();else failed();}});
  const galleryTrack=document.getElementById('gallery-track'),prev=document.getElementById('gallery-prev'),next=document.getElementById('gallery-next');
  function updateArrows(){prev.disabled=galleryTrack.scrollLeft<3;next.disabled=galleryTrack.scrollLeft+galleryTrack.clientWidth>=galleryTrack.scrollWidth-3;}
  function moveGallery(direction){const card=galleryTrack.querySelector('.gallery-card');galleryTrack.scrollBy({left:direction*(card.getBoundingClientRect().width+parseFloat(getComputedStyle(galleryTrack).gap)),behavior:motion?'smooth':'instant'});}
  listen(prev,'click',()=>moveGallery(-1));listen(next,'click',()=>moveGallery(1));listen(galleryTrack,'scroll',updateArrows,{passive:true});
  const galleryResizeObserver=new ResizeObserver(updateArrows);observe(galleryResizeObserver,galleryTrack);updateArrows();
  listen(galleryTrack,'keydown',e=>{if(e.target===galleryTrack&&(e.key==='ArrowRight'||e.key==='ArrowLeft')){e.preventDefault();moveGallery(e.key==='ArrowRight'?1:-1);}});

  const lightbox=document.getElementById('lightbox'),lightboxImg=document.getElementById('lightbox-image'),lightboxError=document.getElementById('lightbox-error');
  const photos=[...document.querySelectorAll('.gallery-card img')];let activePhoto=0,lastTrigger=null;
  function showPhoto(index){activePhoto=(index+photos.length)%photos.length;const img=photos[activePhoto];lightboxError.hidden=true;lightboxImg.hidden=false;lightboxImg.alt=img.alt;document.getElementById('lightbox-title').textContent=`LA BARBE À PAPA / RÉALISATION ${String(activePhoto+1).padStart(2,'0')}`;document.getElementById('lightbox-counter').textContent=`${String(activePhoto+1).padStart(2,'0')} / ${String(photos.length).padStart(2,'0')}`;lightboxImg.src=img.currentSrc||img.src;}
  listen(lightboxImg,'error',()=>{lightboxError.hidden=false;lightboxImg.hidden=true;});listen(lightboxImg,'load',()=>{lightboxError.hidden=true;lightboxImg.hidden=false;});
  document.querySelectorAll('.gallery-card').forEach(btn=>listen(btn,'click',()=>{lastTrigger=btn;showPhoto(Number(btn.dataset.image));lightbox.showModal();document.body.classList.add('locked');document.getElementById('lightbox-close').focus();}));
  const closeLightbox=()=>lightbox.close();listen(document.getElementById('lightbox-close'),'click',closeLightbox);
  listen(lightbox,'close',()=>{document.body.classList.remove('locked');lastTrigger?.focus();});listen(document.getElementById('lightbox-prev'),'click',()=>showPhoto(activePhoto-1));listen(document.getElementById('lightbox-next'),'click',()=>showPhoto(activePhoto+1));
  listen(lightbox,'keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();showPhoto(activePhoto+(e.key==='ArrowRight'?1:-1));}});listen(lightbox,'click',e=>{if(e.target===lightbox){const r=lightbox.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeLightbox();}});
  const about=document.getElementById('about-dialog'),aboutBtn=document.getElementById('about-preview');
  listen(aboutBtn,'click',()=>{about.showModal();document.body.classList.add('locked');document.getElementById('about-close').focus();});listen(document.getElementById('about-close'),'click',()=>about.close());listen(about,'close',()=>{document.body.classList.remove('locked');aboutBtn.focus();});listen(about,'click',e=>{if(e.target===about){const r=about.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)about.close();}});
  const onPageHide=()=>scene?.destroy();const onPageShow=e=>{if(e.persisted&&!destroyed&&window.AtelierScene){root.classList.toggle('page-paused',document.hidden);scene=new window.AtelierScene(canvas,container);window.atelierScene=scene;scene.setMotion(motion);}};
  listen(window,'pagehide',onPageHide);listen(window,'pageshow',onPageShow);

  window.atelierSiteDestroy=()=>{
    if(destroyed)return;destroyed=true;if(sceneFrame)cancelAnimationFrame(sceneFrame);if(anchorFocusFrame)cancelAnimationFrame(anchorFocusFrame);
    cleanups.splice(0).reverse().forEach(cleanup=>cleanup());scene?.destroy();scene=null;window.atelierScene=undefined;
    if(lightbox.open)lightbox.close();if(about.open)about.close();document.body.classList.remove('locked');root.classList.remove('page-paused');delete root.dataset.motion;
  };
})();