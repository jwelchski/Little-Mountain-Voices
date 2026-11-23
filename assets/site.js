/* Little Mountain Voices site script: page routing, age trail, map, form checks. Loaded with defer. */
(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  function still(){return reduce.matches;}
  document.documentElement.classList.add('js-motion');

  /* ---------- router with view transitions ---------- */
  var views=[].slice.call(document.querySelectorAll('[data-view]')),
      links=[].slice.call(document.querySelectorAll('nav.main a, .pill')),
      cta=document.getElementById('cta-band'),current=null;
  function nameFromHash(){
    var n=(location.hash||'').slice(1);
    return views.some(function(v){return v.getAttribute('data-view')===n;})?n:null;
  }
  function apply(name){
    views.forEach(function(v){v.hidden=v.getAttribute('data-view')!==name;});
    links.forEach(function(a){if(a.getAttribute('href')==='#'+name)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    cta.classList.toggle('bare',name==='interest-list');
    current=name;
  }
  function show(){
    var target=nameFromHash();
    if(target===null){
      /* a plain in-page anchor such as #main: leave the current page alone */
      if(current!==null&&location.hash&&document.getElementById(location.hash.slice(1)))return;
      target='home';
    }
    closeMenu();
    if(current===null){apply(target);return;}
    if(target===current){window.scrollTo(0,0);return;}
    var focusH1=function(){var h=document.querySelector('[data-view="'+target+'"] h1');if(h)h.focus({preventScroll:true});};
    var update=function(){apply(target);window.scrollTo(0,0);};
    if(document.startViewTransition&&!still()){
      var t=document.startViewTransition(update);
      t.finished.then(focusH1,focusH1);
    }else{
      update();
      if(!still()){var v=document.querySelector('[data-view="'+target+'"]');v.classList.remove('enter');void v.offsetWidth;v.classList.add('enter');}
      focusH1();
    }
  }
  window.addEventListener('hashchange',show);

  /* ---------- mobile menu ---------- */
  var menuBtn=document.querySelector('.menu-btn'),nav=document.getElementById('mainnav');
  function closeMenu(){nav.classList.remove('open');menuBtn.setAttribute('aria-expanded','false');}
  menuBtn.addEventListener('click',function(){
    var open=!nav.classList.contains('open');
    nav.classList.toggle('open',open);menuBtn.setAttribute('aria-expanded',String(open));
    if(open){var a=nav.querySelector('a');if(a)a.focus();}
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();menuBtn.focus();}});
  document.addEventListener('click',function(e){if(nav.classList.contains('open')&&!nav.contains(e.target)&&!menuBtn.contains(e.target))closeMenu();});

  /* ---------- scroll: header, progress, parallax ---------- */
  var header=document.getElementById('top'),bar=document.getElementById('progress'),
      ridgeGs=[].slice.call(document.querySelectorAll('#heroRidge g[data-f]')),ticking=false;
  function onScroll(){
    ticking=false;
    var y=window.scrollY||0,max=document.documentElement.scrollHeight-window.innerHeight;
    header.classList.toggle('scrolled',y>8);
    bar.style.setProperty('--p',max>0?Math.min(1,y/max).toFixed(4):0);
    if(!still()&&current==='home'&&y<900){ridgeGs.forEach(function(g){g.style.transform='translateY('+(y*parseFloat(g.getAttribute('data-f'))).toFixed(1)+'px)';});}
  }
  window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll);}},{passive:true});

  /* ---------- hero: pointer parallax on word bubbles, countdown ---------- */
  var art=document.getElementById('heroArt');
  if(art&&window.matchMedia('(hover:hover)').matches){
    document.querySelector('.hero').addEventListener('pointermove',function(e){
      if(still())return;
      var r=art.getBoundingClientRect();
      art.style.setProperty('--mx',((e.clientX-(r.left+r.width/2))/r.width).toFixed(3));
      art.style.setProperty('--my',((e.clientY-(r.top+r.height/2))/r.height).toFixed(3));
    });
  }
  var cd=document.getElementById('countdown'),open=new Date(2027,7,1),days=Math.round((open-new Date())/864e5);
  if(days>45){var m=Math.round(days/30.44);cd.textContent='About '+m+' months to go';cd.hidden=false;}
  else if(days>0){cd.textContent=days+(days===1?' day':' days')+' to go';cd.hidden=false;}

  /* ---------- card spotlight ---------- */
  document.querySelectorAll('.card').forEach(function(c){
    c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect();c.style.setProperty('--x',(e.clientX-r.left)+'px');c.style.setProperty('--y',(e.clientY-r.top)+'px');});
  });

  /* ---------- wabbit / rabbit swaps ---------- */
  var swaps=[].slice.call(document.querySelectorAll('[data-swap]'));
  if(swaps.length&&!still())setInterval(function(){swaps.forEach(function(s){if(s.offsetParent)s.classList.toggle('flip');});},2200);
  else swaps.forEach(function(s){s.classList.add('flip');});

  /* ---------- age trail ---------- */
  var trail=document.getElementById('trail');
  if(trail){
    var stops=[].slice.call(trail.querySelectorAll('.stop')),pans=[].slice.call(trail.querySelectorAll('.agepanel')),
        hiker=document.getElementById('hiker'),hsvg=hiker.querySelector('svg'),prev=document.getElementById('age-prev'),next=document.getElementById('age-next'),
        meter=[].slice.call(trail.querySelectorAll('.agemeter i')),path=document.getElementById('trailPath'),mpath=document.getElementById('trailMaskPath'),
        burst=document.getElementById('burst'),cur=0,anim=null,
        pts=[[115,515],[330,455],[165,395],[320,335],[190,275],[300,210],[250,135]],
        total=path.getTotalLength(),stopLen=[],posLen=0;
    /* find the distance along the trail of each stop (segment end points of the path) */
    (function(){var N=1400,samples=[];for(var s=0;s<=N;s++){var L=total*s/N,p=path.getPointAtLength(L);samples.push([L,p.x,p.y]);}
      pts.forEach(function(pt,k){var best=0,bd=1e9;samples.forEach(function(sm){var d=(sm[1]-pt[0])*(sm[1]-pt[0])+(sm[2]-pt[1])*(sm[2]-pt[1]);if(d<bd){bd=d;best=sm[0];}});stopLen[k]=k===0?0:(k===pts.length-1?total:best);});})();
    function placeAt(L){
      var p=path.getPointAtLength(L),f=L/total;
      hiker.style.left=(p.x/480*100)+'%';hiker.style.top=((p.y-30)/580*100)+'%';
      hiker.style.setProperty('--grow',(0.7+f*0.48).toFixed(3));
      mpath.style.strokeDasharray=L.toFixed(1)+' '+(total+10).toFixed(1);
      posLen=L;
    }
    function ease(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;}
    function walkTo(L){
      if(anim)cancelAnimationFrame(anim);
      if(still()){placeAt(L);return;}
      var from=posLen,dist=Math.abs(L-from),dur=Math.min(1600,300+dist*1.6),t0=null;
      hsvg.classList.add('walk');
      function step(ts){if(t0===null)t0=ts;var t=Math.min(1,(ts-t0)/dur);placeAt(from+(L-from)*ease(t));
        if(t<1)anim=requestAnimationFrame(step);else{anim=null;hsvg.classList.remove('walk');if(cur===pts.length-1)celebrate();}}
      anim=requestAnimationFrame(step);
    }
    function celebrate(){
      if(still())return;
      var cols=['#8CC2A0','#2E6F9E','#BCDCEC','#1F5D4C','#74B28D'];burst.innerHTML='';
      for(var i=0;i<14;i++){var d=document.createElement('i'),a=i/14*Math.PI*2,r=40+Math.random()*40;d.style.background=cols[i%cols.length];d.style.setProperty('--bx',(Math.cos(a)*r).toFixed(0)+'px');d.style.setProperty('--by',(Math.sin(a)*r).toFixed(0)+'px');d.style.animationDelay=(Math.random()*.12).toFixed(2)+'s';burst.appendChild(d);}
      burst.classList.remove('go');void burst.offsetWidth;burst.classList.add('go');
    }
    function pick(i,focus){
      var nextI=Math.max(0,Math.min(stops.length-1,i)),dir=nextI>=cur?1:-1;
      var changed=nextI!==cur;cur=nextI;
      stops.forEach(function(t,k){t.setAttribute('aria-selected',k===cur?'true':'false');t.tabIndex=k===cur?0:-1;t.classList.toggle('passed',k<cur);});
      pans.forEach(function(p,k){var on=k===cur;p.classList.toggle('off',!on);p.inert=!on;
        if(on&&changed&&!still()&&p.animate)p.animate([{opacity:0,transform:'translateX('+(24*dir)+'px)'},{opacity:1,transform:'none'}],{duration:420,easing:'cubic-bezier(.2,.8,.2,1)'});});
      meter.forEach(function(m,k){m.classList.toggle('on',k<=cur);});
      prev.disabled=cur===0;next.disabled=cur===stops.length-1;
      walkTo(stopLen[cur]);
      if(focus)stops[cur].focus();
    }
    trail.classList.add('js');
    stops.forEach(function(t,k){
      t.addEventListener('click',function(){pick(k);});
      t.addEventListener('keydown',function(e){
        if(e.key==='ArrowRight'||e.key==='ArrowUp'){e.preventDefault();pick(cur+1,true);}
        else if(e.key==='ArrowLeft'||e.key==='ArrowDown'){e.preventDefault();pick(cur-1,true);}
        else if(e.key==='Home'){e.preventDefault();pick(0,true);}
        else if(e.key==='End'){e.preventDefault();pick(stops.length-1,true);}
      });
    });
    prev.addEventListener('click',function(){pick(cur-1);});
    next.addEventListener('click',function(){pick(cur+1);});
    /* swipe on the card */
    var card=document.getElementById('agecard'),sx=null,sy=null;
    card.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;sy=e.touches[0].clientY;},{passive:true});
    card.addEventListener('touchend',function(e){if(sx===null)return;var dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;sx=null;
      if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.4)pick(cur+(dx<0?1:-1));},{passive:true});
    placeAt(0);pick(0);
  }

  /* ---------- service map ---------- */
  var map=document.getElementById('map');
  if(map){
    var hot=function(town,on){document.querySelectorAll('[data-town]').forEach(function(el){if(el.getAttribute('data-town')===town)el.classList.toggle('hot',on);});};
    document.querySelectorAll('.towns button,.map .lbl').forEach(function(b){
      var t=b.getAttribute('data-town');
      ['pointerenter','focus'].forEach(function(ev){b.addEventListener(ev,function(){hot(t,true);});});
      ['pointerleave','blur'].forEach(function(ev){b.addEventListener(ev,function(){hot(t,false);});});
    });
    if(!still()&&'IntersectionObserver' in window){
      map.classList.add('armed');
      new IntersectionObserver(function(es,o){es.forEach(function(e){if(e.isIntersecting){map.classList.add('play');o.disconnect();}});},{threshold:.35}).observe(map);
    }
  }

  /* ---------- interest form ---------- */
  var form=document.getElementById('interest-form'),note=document.getElementById('form-note'),done=document.getElementById('done'),
      meterEl=document.getElementById('meter'),meterLbl=document.getElementById('meterlbl');
  var emailRe=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var checks={
    'parent-name':function(el){return el.value.trim()?'':'Please add your name.';},
    'parent-email':function(el){var v=el.value.trim();if(!v)return 'Please add your email.';return emailRe.test(v)?'':'This email looks incomplete. Check for an @ and a domain, like name@example.com.';},
    'parent-phone':function(el){var v=el.value.trim();if(!v)return '';var d=v.replace(/\D/g,'');return d.length===10||(d.length===11&&d[0]==='1')?'':'Please use a 10-digit phone number, or leave it blank.';},
    'town':function(el){return el.value.trim()?'':'Please add your town.';},
    'child-age':function(el){return el.querySelector('input:checked')?'':'Please choose an age.';},
    'concern':function(el){return el.querySelector('input:checked')?'':'Please choose the closest match.';},
    'consent':function(el){return el.checked?'':'Please tick this box so we can contact you.';}
  };
  var required=['parent-name','parent-email','town','child-age','concern','consent'];
  function setErr(id,msg){
    var el=document.getElementById(id),err=document.getElementById(id+'-err');
    err.textContent=msg;
    if(el.tagName==='FIELDSET'){el.querySelector('.chips').classList.toggle('bad',!!msg);}
    else el.setAttribute('aria-invalid',msg?'true':'false');
  }
  function validate(id){var msg=checks[id](document.getElementById(id));setErr(id,msg);return msg;}
  function progress(){
    var n=required.filter(function(id){return !checks[id](document.getElementById(id));}).length;
    meterEl.style.setProperty('--f',(n/required.length).toFixed(3));
    meterLbl.textContent=n===required.length?'All set. Ready to join the list.':n+' of '+required.length+' needed answers';
  }
  Object.keys(checks).forEach(function(id){
    var el=document.getElementById(id);
    if(el.tagName==='FIELDSET'){el.addEventListener('change',function(){validate(id);progress();});}
    else{
      el.addEventListener('blur',function(){if(el.value.trim()||el.type==='checkbox'||document.getElementById(id+'-err').textContent)validate(id);});
      el.addEventListener('input',function(){if(document.getElementById(id+'-err').textContent)validate(id);progress();});
      el.addEventListener('change',function(){if(el.type==='checkbox')validate(id);progress();});
    }
  });
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var bad=Object.keys(checks).filter(function(id){return validate(id);});
    progress();
    if(bad.length){
      note.hidden=false;note.textContent=bad.length===1?'One answer needs a fix before you can join.':bad.length+' answers need a fix before you can join.';
      var first=document.getElementById(bad[0]);(first.tagName==='FIELDSET'?first.querySelector('input'):first).focus();
      return;
    }
    note.hidden=true;
    document.getElementById('done-name').textContent=document.getElementById('parent-name').value.trim().split(/\s+/)[0]||'friend';
    form.hidden=true;done.hidden=false;done.focus();
  });
  document.getElementById('done-back').addEventListener('click',function(){done.hidden=true;form.hidden=false;document.getElementById('parent-name').focus();});
  progress();

  show();onScroll();
})();
