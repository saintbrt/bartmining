/* insights.js — TOC generation, reading progress, client-side search */
(function(){
  /* ── Reading progress ── */
  var bar=document.getElementById('readBar');
  if(bar){
    window.addEventListener('scroll',function(){
      var art=document.querySelector('.art-content');
      if(!art) return;
      var r=art.getBoundingClientRect();
      var h=art.offsetHeight;
      var progress=Math.max(0,Math.min(1,(-r.top)/(h-window.innerHeight||h)));
      bar.style.width=(progress*100)+'%';
    });
  }

  /* ── Auto-generate TOC ── */
  var tocNav=document.getElementById('tocNav');
  var artBody=document.querySelector('.art-content');
  if(tocNav&&artBody){
    var headings=artBody.querySelectorAll('h2,h3');
    var items=[];
    headings.forEach(function(h,i){
      if(!h.id) h.id='sec-'+i;
      items.push({id:h.id,text:h.textContent,tag:h.tagName});
    });
    if(items.length){
      var ul=document.createElement('ul');
      ul.className='toc-list';
      items.forEach(function(item){
        var li=document.createElement('li');
        var a=document.createElement('a');
        a.href='#'+item.id;
        a.textContent=item.text;
        if(item.tag==='H3') a.classList.add('toc-h3');
        a.addEventListener('click',function(e){
          e.preventDefault();
          document.getElementById(item.id)?.scrollIntoView({behavior:'smooth',block:'start'});
        });
        li.appendChild(a);
        ul.appendChild(li);
      });
      tocNav.appendChild(ul);
    } else {
      tocNav.closest('.art-toc')&&(tocNav.closest('.art-toc').style.display='none');
    }

    /* Active TOC item on scroll */
    var allLinks=tocNav.querySelectorAll('a');
    var observer=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          allLinks.forEach(function(a){a.classList.remove('active')});
          var active=tocNav.querySelector('a[href="#'+e.target.id+'"]');
          if(active) active.classList.add('active');
        }
      });
    },{rootMargin:'-20% 0% -70% 0%'});
    headings.forEach(function(h){observer.observe(h)});
  }

  /* ── Hub search & filter ── */
  var searchInput=document.getElementById('hubSearch');
  var cards=document.querySelectorAll('.hub-card');
  var noRes=document.getElementById('noResults');
  var filterBtns=document.querySelectorAll('.hub-filter');
  var activeFilter='all';
  var searchTerm='';

  function applyFilters(){
    var visible=0;
    cards.forEach(function(c){
      var tags=(c.dataset.tags||'').toLowerCase();
      var text=(c.textContent||'').toLowerCase();
      var matchFilter=activeFilter==='all'||tags.indexOf(activeFilter)>-1;
      var matchSearch=!searchTerm||text.indexOf(searchTerm)>-1;
      var show=matchFilter&&matchSearch;
      c.classList.toggle('hidden',!show);
      if(show) visible++;
    });
    if(noRes){ noRes.classList.toggle('show',visible===0); }
  }

  if(searchInput){
    searchInput.addEventListener('input',function(){
      searchTerm=this.value.toLowerCase().trim();
      applyFilters();
    });
  }

  filterBtns.forEach(function(btn){
    btn.addEventListener('click',function(){
      filterBtns.forEach(function(b){b.classList.remove('active')});
      this.classList.add('active');
      activeFilter=this.dataset.filter||'all';
      applyFilters();
    });
  });
})();
