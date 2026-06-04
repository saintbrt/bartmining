/* =========================================================
   Bart Mining - shared site engine
   Nav/footer injection, data-driven sections, SEO (JSON-LD),
   coverage/regions, robust scroll reveals, animations.
   ========================================================= */
(function () {
  "use strict";

  var EMAIL = "hello@bartmining.com";
  var SITE = "https://www.bartmining.com";
  var HOME = "index.html";

  function ico(d) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + d + "</svg>";
  }
  var ICONS = {
    survey: '<path d="M12 2v4M12 18v4M2 12h4M18 12h4"/><circle cx="12" cy="12" r="5"/><path d="M12 9v3l2 1"/>',
    explore: '<path d="m13 2-3 9h5l-3 9"/><path d="M5 14l-2 6 6-2"/>',
    plan: '<path d="M3 3h18v18H3z"/><path d="M3 9h18M9 3v18"/><path d="m13 13 4 4"/>',
    machine: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
    safety: '<path d="M12 2 4 6v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V6l-8-4z"/><path d="m9 12 2 2 4-4"/>',
    centrifuge: '<circle cx="12" cy="12" r="9"/><path d="M12 12 7 5M12 12l8 2M12 12l-3 8"/>',
    elution: '<path d="M5 3v6l-2 9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2l-2-9V3"/><path d="M5 9h14"/>',
    cil: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    modular: '<path d="M3 9 12 4l9 5-9 5-9-5z"/><path d="m3 14 9 5 9-5"/>',
    hpgr: '<circle cx="8" cy="12" r="4"/><circle cx="16" cy="12" r="4"/>',
    thickener: '<path d="M4 4h16l-2 8a6 6 0 0 1-12 0L4 4z"/><path d="M9 18v3M15 18v3"/>',
    dewater: '<path d="M12 2s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z"/>',
    land: '<path d="m2 20 6-8 4 4 4-6 6 10z"/><circle cx="17" cy="6" r="2"/>',
    school: '<path d="m3 9 9-5 9 5-9 5-9-5z"/><path d="M21 9v6M7 11v5c0 1 2.2 2 5 2s5-1 5-2v-5"/>',
    hire: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 4a3 3 0 0 1 0 6M21 20c0-2.4-1.4-4.5-3.5-5.5"/>',
    consent: '<path d="M12 21s-7-4.4-9-9a5 5 0 0 1 9-2 5 5 0 0 1 9 2c-2 4.6-9 9-9 9z"/>',
    pin: '<path d="M12 21s-7-5.2-7-11a7 7 0 0 1 14 0c0 5.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>'
  };

  /* ---------- DATA ---------- */
  var SERVICES = [
    { n: "01", ic: "survey", t: "Geological Survey", d: "Site assessment and geological evaluation - from first mapping to a defensible resource estimate.",
      long: "We characterise the ground before anyone commits capital: structured mapping, disciplined sampling and resource estimation that survives third-party due diligence.",
      includes: ["Geological mapping", "Core sampling", "Resource estimation", "JORC-compliant reporting"], tags: ["Mapping", "Sampling", "JORC Reporting"] },
    { n: "02", ic: "explore", t: "Exploration", d: "Mineral discovery and resource-development programs: prospecting, targeting, drilling, definition.",
      long: "Operator-led exploration that moves from a hunch to a defined resource - designing the right program, drilling it efficiently, and modelling what the data actually says.",
      includes: ["Prospecting programs", "Target identification", "Drilling campaigns", "Resource definition"], tags: ["Prospecting", "Drilling", "Modelling"] },
    { n: "03", ic: "plan", t: "Mine Planning & Design", d: "Feasibility, open-pit and underground design, development roadmaps and closure planning.",
      long: "Strategic planning and engineering support that treats closure as a day-one decision, not an afterthought - so the plan is fundable and the mine is buildable.",
      includes: ["Feasibility studies", "Open-pit design", "Underground mine design", "Development roadmaps", "Closure planning"], tags: ["Feasibility", "Scheduling", "Closure"] },
    { n: "04", ic: "machine", t: "Mining Machinery & Processing Plants", d: "From exploration support equipment to complete gold-recovery systems - sourced, supplied and commissioned to your site conditions and production targets.",
      long: "We specify, procure and commission specialised mineral-processing machinery - matching equipment to ore characteristics, throughput and remoteness, then standing it up on site.",
      includes: ["Specification & sizing", "Procurement & logistics", "Installation & commissioning", "Operator handover"], tags: ["Gold Recovery", "Processing Plants", "Commissioning"] },
    { n: "05", ic: "safety", t: "Safety Equipment & Gear", d: "PPE, gas detection, self-rescuers, fall-arrest systems and underground refuge chambers.",
      long: "Mining safety systems and protective equipment - supplied, installed and audited. Safety corners cut: zero, always.",
      includes: ["Personal protective equipment", "Gas detection systems", "Self-rescuers", "Fall arrest systems", "Underground refuge chambers"], tags: ["PPE", "Gas Detection", "Rescue"] }
  ];

  var EQUIP = [
    { ic: "centrifuge", t: "Centrifugal Gold Concentrators", d: "Gravity recovery of fine gold without chemicals - Knelson / Falcon class.", apps: ["Alluvial gold", "Hard-rock gold", "Tailings recovery"] },
    { ic: "elution", t: "Elution & Electrowinning Plants", d: "Advanced recovery that extracts gold from loaded activated carbon.", apps: ["CIL plants", "CIP plants", "Gold refining circuits"] },
    { ic: "cil", t: "Carbon-in-Leach (CIL) Systems", d: "Continuous leach-and-adsorb circuits engineered for high gold recovery.", apps: ["Gold processing", "High-throughput plants", "Refractory pre-treatment"] },
    { ic: "cil", t: "Carbon-in-Pulp (CIP) Systems", d: "Robust adsorption circuits for clarified, pre-leached slurries.", apps: ["Gold processing", "Clarified feeds", "Modular circuits"] },
    { ic: "modular", t: "Modular Gold Processing Plants", d: "Containerised, skid-mounted systems for rapid remote deployment.", apps: ["Remote projects", "Pilot plants", "Small-to-medium ops"] },
    { ic: "hpgr", t: "High-Pressure Grinding Rolls", d: "Energy-efficient comminution ahead of the recovery circuit.", apps: ["Hard-rock comminution", "Energy reduction", "Pre-concentration"] },
    { ic: "thickener", t: "Thickener & Clarifier Systems", d: "Separate solids from liquids and recover precious process water.", apps: ["Water recycling", "Tailings management", "Concentrate handling"] },
    { ic: "dewater", t: "Tailings Dewatering Filters", d: "Filter-press dewatering for safer, drier tailings management.", apps: ["Dry-stack tailings", "Water recovery", "Closure-ready storage"] }
  ];

  var PHASES = [
    { k: "PHASE 01", t: "Discover", items: ["Geological & geochemical surveys", "Geophysical sampling", "Structural mapping", "Resource estimation"], deliver: "Geological model · JORC report" },
    { k: "PHASE 02", t: "Define", items: ["Pre-feasibility & feasibility", "Mine design", "Environmental baseline", "Social baseline studies"], deliver: "Financial model · ESIA · baselines" },
    { k: "PHASE 03", t: "Build", items: ["Equipment procurement", "Safety system rollout", "Workforce recruitment & training", "Community programs"], deliver: "Commissioned plant · trained crew" },
    { k: "PHASE 04", t: "Operate & Close", items: ["Production advisory", "Safety audits", "Environmental monitoring", "Rehabilitation & post-closure"], deliver: "Rehab · water monitoring · transition" }
  ];

  var PILLARS = [
    { ic: "land", t: "Land & Water Stewardship", d: "Progressive rehabilitation, acid-drainage and water-balance modelling, tailings design.", std: "INTL. ENV. STANDARDS" },
    { ic: "school", t: "Supporting Local Schools", d: "Classroom construction, teacher support, scholarships, STEM and vocational training.", std: "EDUCATION PROGRAMS" },
    { ic: "hire", t: "Local Hiring & Procurement", d: "Workforce and regional-supplier development, local procurement, economic participation.", std: "LOCAL ECONOMY" },
    { ic: "consent", t: "Free, Prior & Informed Consent", d: "No project without genuine community consent. We run and support the consultation.", std: "ICMM PE-09" }
  ];

  var TESTI = [
    { q: "Bart walked the ground with our team before he ever opened a laptop. The resource model held up through due diligence - and so did his closure plan.", who: "Resource Investment Partner", role: "Private mining fund · Investor" },
    { q: "Principal-led meant the person who advised us was the person on site. The processing plant was commissioned on schedule and to spec.", who: "Operations Director", role: "Mid-tier gold producer · Mining company" },
    { q: "The FPIC and community work wasn't a checkbox. Our regional engagement is genuinely stronger because of how the consultation was run.", who: "Permitting & Resources Advisor", role: "National minerals authority · Government" }
  ];

  /* ---------- SEO: coverage + exploration services ---------- */
  var EAST_AFRICA = [
    { c: "Tanzania", cities: ["Dar es Salaam", "Mwanza", "Geita", "Dodoma", "Arusha", "Shinyanga", "Mbeya", "Tabora"] },
    { c: "Kenya", cities: ["Nairobi", "Mombasa", "Kakamega", "Migori"] },
    { c: "Uganda", cities: ["Kampala", "Mubende", "Karamoja"] },
    { c: "Rwanda", cities: ["Kigali"] },
    { c: "Burundi", cities: ["Bujumbura"] },
    { c: "Ethiopia", cities: ["Addis Ababa", "Adola"] },
    { c: "DR Congo", cities: ["Lubumbashi", "Kolwezi"] }
  ];
  var SOUTHERN_AFRICA = [
    { c: "Zambia", cities: ["Lusaka", "Kitwe", "Ndola", "Solwezi"] },
    { c: "Zimbabwe", cities: ["Harare", "Bulawayo", "Kwekwe"] },
    { c: "South Africa", cities: ["Johannesburg", "Rustenburg", "Welkom"] },
    { c: "Mozambique", cities: ["Maputo", "Tete", "Nampula"] },
    { c: "Botswana", cities: ["Gaborone", "Francistown"] },
    { c: "Namibia", cities: ["Windhoek", "Tsumeb"] },
    { c: "Angola", cities: ["Luanda", "Saurimo"] },
    { c: "Malawi", cities: ["Lilongwe", "Blantyre"] },
    { c: "Madagascar", cities: ["Antananarivo"] },
    { c: "Eswatini", cities: ["Mbabane"] },
    { c: "Lesotho", cities: ["Maseru"] }
  ];
  var EXPLORATION_SERVICES = [
    "Geological Mapping", "Geochemical Soil Sampling", "Geophysical Surveys", "Magnetic & IP Surveys",
    "Diamond & RC Drilling", "Core Logging & Database", "Target Generation", "Structural Mapping",
    "Trenching & Pitting", "Resource Estimation", "JORC Resource Reporting", "Remote Sensing & GIS", "Technical Due Diligence"
  ];

  function el(html) { var t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstChild; }
  function arrow() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'; }

  /* ===================================================
     SHARED CHROME (nav + footer) - no "Consultancy" sub
     =================================================== */
  var PAGES = [
    { label: "Services", href: "services.html" },
    { label: "Products", href: "products.html" },
    { label: "Insights", href: "insights/" },
    { label: "About", href: "about.html" },
    { label: "Sustainability", href: "sustainability.html" },
    { label: "Contact", href: "contact.html" }
  ];
  var here = decodeURIComponent((location.pathname.split("/").pop() || "").toLowerCase());
  function isActive(href) { return decodeURIComponent(href.toLowerCase()) === here; }

  function brandLockup() {
    return '<a href="' + HOME + '" class="brand"><span class="brand-mark"></span>' +
      '<span class="brand-name">Bart Mining</span></a>';
  }

  function buildNav() {
    var links = PAGES.map(function (p) {
      return '<a href="' + p.href + '"' + (isActive(p.href) ? ' class="active"' : "") + ">" + p.label + "</a>";
    }).join("");
    var nav = el(
      '<header class="nav" id="nav"><div class="wrap nav-inner">' + brandLockup() +
        '<nav class="nav-links" id="navLinks">' + links + "</nav>" +
        '<div class="nav-cta">' +
          '<a href="contact.html" class="btn btn-ghost">Talk to us</a>' +
          '<a href="contact.html" class="btn btn-gold">Start a project ' + arrow() + "</a>" +
          '<button class="nav-toggle" id="navToggle" aria-label="Menu"><span></span><span></span><span></span></button>' +
        "</div></div></header>"
    );
    document.body.insertBefore(nav, document.body.firstChild);
  }

  function buildFooter() {
    var regionLinks = ["Tanzania", "Kenya", "Zambia", "Zimbabwe", "South Africa", "Mozambique", "DR Congo"]
      .map(function (c) { return '<li><a href="contact.html">Mining services in ' + c + "</a></li>"; }).join("");
    var f = el(
      '<footer class="footer"><div class="wrap"><div class="footer-grid">' +
        "<div>" + brandLockup() +
          '<p class="footer-blurb">Resource development done responsibly. Bart Mining advises mining companies, governments and investors across the full mine lifecycle - exploration, mine planning, processing plants and safety, throughout East & Southern Africa.</p></div>' +
        '<div><h5>Services</h5><ul>' +
          '<li><a href="services.html">Geological Survey</a></li>' +
          '<li><a href="services.html">Mineral Exploration</a></li>' +
          '<li><a href="services.html">Mine Planning &amp; Design</a></li>' +
          '<li><a href="products.html">Machinery &amp; Plants</a></li>' +
          '<li><a href="services.html">Safety Equipment</a></li></ul></div>' +
        '<div><h5>Knowledge Center</h5><ul>' +
          '<li><a href="insights/">All Articles</a></li>' +
          '<li><a href="insights/gold-exploration-tanzania.html">Gold Exploration Tanzania</a></li>' +
          '<li><a href="insights/future-mining-east-africa.html">Future of Mining 2025–2030</a></li>' +
          '<li><a href="insights/tags/east-africa.html">East Africa Hub</a></li>' +
        '</ul></div>' +
        '<div><h5>Regions</h5><ul>' + regionLinks + "</ul></div>" +
        '<div><h5>Headquarters</h5><address class="addr">Dar es Salaam<br/>Tanzania<br/><br/>' +
          '<a href="mailto:' + EMAIL + '">' + EMAIL + "</a></address>" +
          '<p style="margin-top:14px"><a href="about.html" style="color:var(--ink-2);font-size:14px">About &amp; Founder</a> · <a href="sustainability.html" style="color:var(--ink-2);font-size:14px">Sustainability</a></p></div>' +
      '</div><div class="footer-bottom">' +
        '<p>© <span id="year"></span> Bart Mining. Resource development done responsibly.</p>' +
        '<p class="mono">Dar es Salaam · 6° 47′ S</p>' +
      "</div></div></footer>"
    );
    document.body.appendChild(f);
    f.querySelector("#year").textContent = new Date().getFullYear();
  }

  buildNav();
  buildFooter();

  /* ===================================================
     SEO: JSON-LD structured data graph
     =================================================== */
  function injectJsonLd() {
    var areaServed = EAST_AFRICA.concat(SOUTHERN_AFRICA).map(function (r) {
      return { "@type": "Country", "name": r.c };
    });
    var allServices = SERVICES.map(function (s) { return s.t; })
      .concat(EXPLORATION_SERVICES)
      .concat(EQUIP.map(function (e) { return e.t; }));
    var graph = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": ["Organization", "ProfessionalService", "LocalBusiness"],
          "@id": SITE + "/#org",
          "name": "Bart Mining",
          "alternateName": "Bart Mining Consultancy",
          "url": SITE + "/",
          "email": EMAIL,
          "slogan": "Resource development done responsibly.",
          "description": "Mining consultancy and equipment supply across East & Southern Africa - mineral exploration, geological survey, mine planning, gold processing plants and safety equipment. Principal-led by Bartholomew Ambrose.",
          "founder": { "@type": "Person", "name": "Bartholomew Ambrose", "jobTitle": "Founder, Exploration Manager & Mining Operator" },
          "address": { "@type": "PostalAddress", "addressLocality": "Dar es Salaam", "addressCountry": "Tanzania" },
          "areaServed": areaServed,
          "knowsAbout": allServices,
          "makesOffer": SERVICES.map(function (s) {
            return { "@type": "Offer", "itemOffered": { "@type": "Service", "name": s.t, "description": s.d, "areaServed": areaServed } };
          })
        },
        {
          "@type": "WebSite",
          "@id": SITE + "/#website",
          "url": SITE + "/",
          "name": "Bart Mining",
          "publisher": { "@id": SITE + "/#org" }
        }
      ]
    };
    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(graph);
    document.head.appendChild(s);
  }
  injectJsonLd();

  /* ===================================================
     COVERAGE / REGIONS section (mount: #regionsMount)
     =================================================== */
  function regionCard(r) {
    return '<div class="region-card"><div class="rc-country">' + r.c + "</div>" +
      '<div class="rc-cities">' + r.cities.join(" · ") + "</div></div>";
  }
  var regionsMount = document.getElementById("regionsMount");
  if (regionsMount) {
    var east = EAST_AFRICA.map(regionCard).join("");
    var south = SOUTHERN_AFRICA.map(regionCard).join("");
    var chips = EXPLORATION_SERVICES.map(function (x) { return '<span class="tag">' + x + "</span>"; }).join("");
    regionsMount.innerHTML =
      '<div class="wrap">' +
        '<div class="sec-head reveal"><span class="eyebrow">Coverage</span>' +
          "<h2>Mining services across East &amp; Southern Africa.</h2>" +
          '<p>Bart Mining delivers mineral exploration, mine planning, gold processing plants and safety equipment in Tanzania, Kenya, Zambia, Zimbabwe, South Africa, Mozambique and across the region - including Dar es Salaam, Nairobi, Lusaka, Harare and Johannesburg.</p></div>' +
        '<div class="region-group reveal"><h3 class="region-title">East Africa</h3><div class="region-grid">' + east + "</div></div>" +
        '<div class="region-group reveal" data-delay="1"><h3 class="region-title">Southern Africa</h3><div class="region-grid">' + south + "</div></div>" +
        '<div class="region-explore reveal"><span class="sd-label">Mining &amp; exploration services delivered region-wide</span><div class="tags">' + chips + "</div></div>" +
      "</div>";
  }

  /* ===================================================
     PAGE CONTENT INJECTION (guarded)
     =================================================== */
  var svcGrid = document.getElementById("svcGrid");
  if (svcGrid) {
    SERVICES.forEach(function (s, i) {
      var tags = s.tags.map(function (x) { return '<span class="tag">' + x + "</span>"; }).join("");
      var wide = i === 3, node;
      if (wide) {
        node = el('<article class="svc wide reveal" data-tilt>' +
          '<div class="svc-body"><div class="svc-num">' + s.n + '</div>' +
          '<div class="svc-ico">' + ico(ICONS[s.ic]) + '</div><h3>' + s.t + '</h3><p>' + s.d + '</p>' +
          '<div class="tags">' + tags + '</div></div>' +
          '<div style="border-radius:18px;overflow:hidden;min-height:230px;box-shadow:var(--shadow-md);transform:translateZ(20px)">' +
          '<img src="https://images.pexels.com/photos/2101137/pexels-photo-2101137.jpeg?auto=compress&cs=tinysrgb&w=900" alt="Mining machinery and processing plant" style="width:100%;height:100%;object-fit:cover;min-height:230px"/></div></article>');
      } else {
        node = el('<article class="svc reveal" data-tilt data-delay="' + (i % 3) + '">' +
          '<div class="svc-num">' + s.n + '</div><div class="svc-ico">' + ico(ICONS[s.ic]) + '</div>' +
          '<h3>' + s.t + '</h3><p>' + s.d + '</p><div class="tags">' + tags + '</div></article>');
      }
      svcGrid.appendChild(node);
    });
  }

  var equipGrid = document.getElementById("equipGrid");
  if (equipGrid) {
    EQUIP.forEach(function (e, i) {
      equipGrid.appendChild(el('<article class="eq reveal" data-delay="' + (i % 4) + '">' +
        '<div class="eq-glow"></div><div class="eq-ico">' + ico(ICONS[e.ic]) + '</div>' +
        '<h4>' + e.t + '</h4><p>' + e.d + '</p></article>'));
    });
  }

  var phasesEl = document.getElementById("phases");
  if (phasesEl) {
    PHASES.forEach(function (p, i) {
      var items = p.items.map(function (x) { return "<li>" + x + "</li>"; }).join("");
      phasesEl.appendChild(el('<div class="phase reveal" data-delay="' + i + '">' +
        '<div class="phase-line"></div><div class="phase-k">' + p.k + '</div><h3>' + p.t + '</h3>' +
        '<ul>' + items + '</ul><div class="deliver">Delivers&nbsp; <b>' + p.deliver + '</b></div></div>'));
    });
  }

  var pillarsEl = document.getElementById("pillars");
  if (pillarsEl) {
    PILLARS.forEach(function (p, i) {
      pillarsEl.appendChild(el('<article class="pillar reveal" data-delay="' + (i % 4) + '">' +
        '<div class="pillar-ico">' + ico(ICONS[p.ic]) + '</div>' +
        '<h4>' + p.t + '</h4><p>' + p.d + '</p><div class="std">' + p.std + '</div></article>'));
    });
  }

  var serviceList = document.getElementById("serviceList");
  if (serviceList) {
    SERVICES.forEach(function (s) {
      var incl = s.includes.map(function (x) { return "<li>" + x + "</li>"; }).join("");
      var tags = s.tags.map(function (x) { return '<span class="tag">' + x + "</span>"; }).join("");
      serviceList.appendChild(el('<article class="svc-detail reveal" id="svc-' + s.n + '">' +
        '<div class="sd-aside"><div class="svc-num">' + s.n + ' / 05</div>' +
        '<div class="sd-ico">' + ico(ICONS[s.ic]) + '</div><div class="tags">' + tags + '</div></div>' +
        '<div class="sd-main"><h3>' + s.t + '</h3><p class="sd-lead">' + s.long + '</p>' +
        '<div class="sd-incl"><span class="sd-label">What it includes</span><ul>' + incl + '</ul></div></div></article>'));
    });
  }

  var productList = document.getElementById("productList");
  if (productList) {
    EQUIP.forEach(function (e, i) {
      var apps = e.apps.map(function (x) { return "<li>" + x + "</li>"; }).join("");
      productList.appendChild(el('<article class="product-card reveal" data-delay="' + (i % 3) + '">' +
        '<div class="pc-top"><div class="pc-ico">' + ico(ICONS[e.ic]) + '</div>' +
        '<span class="pc-tag">Supply · Commission</span></div>' +
        '<h3>' + e.t + '</h3><p>' + e.d + '</p>' +
        '<div class="pc-apps"><span class="sd-label">Applications</span><ul>' + apps + '</ul></div>' +
        '<a href="contact.html" class="pc-link">Enquire about this ' + arrow() + '</a></article>'));
    });
  }

  var tCards = document.getElementById("testiCards");
  if (tCards) {
    var tNav = document.getElementById("testiNav");
    var star = '<svg viewBox="0 0 24 24"><path d="m12 2 3 6.9 7.6.6-5.8 4.9 1.8 7.4L12 18l-6.4 3.8 1.8-7.4L1.6 9.5 9.2 8.9 12 2z"/></svg>';
    var stars = star + star + star + star + star;
    TESTI.forEach(function (t, i) {
      tCards.appendChild(el('<div class="testi-card' + (i === 0 ? " active" : "") + '">' +
        '<p class="testi-q">' + t.q + '</p><div class="stars">' + stars + '</div>' +
        '<div class="testi-who">' + t.who + '</div><div class="testi-role">' + t.role + '</div></div>'));
      var b = el('<button class="testi-dot' + (i === 0 ? " active" : "") + '" aria-label="Testimonial ' + (i + 1) + '"></button>');
      b.addEventListener("click", function () { goTesti(i); });
      tNav.appendChild(b);
    });
    var tIdx = 0, tTimer;
    window.goTesti = function (i) {
      var cards = tCards.querySelectorAll(".testi-card");
      var dots = tNav.querySelectorAll(".testi-dot");
      cards[tIdx].classList.remove("active"); dots[tIdx].classList.remove("active");
      tIdx = (i + cards.length) % cards.length;
      cards[tIdx].classList.add("active"); dots[tIdx].classList.add("active");
      clearInterval(tTimer); tTimer = setInterval(function () { window.goTesti(tIdx + 1); }, 6000);
    };
    tTimer = setInterval(function () { window.goTesti(tIdx + 1); }, 6000);
  }

  /* ===================================================
     SHARED BEHAVIOURS
     =================================================== */
  var nav = document.getElementById("nav");
  function onScroll() { nav.classList.toggle("scrolled", window.scrollY > 24); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  navToggle.addEventListener("click", function () { navLinks.classList.toggle("open"); });
  navLinks.addEventListener("click", function (e) { if (e.target.tagName === "A") navLinks.classList.remove("open"); });

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- robust reveal: rect-based, works in any render context ---- */
  function showReveals() {
    var vh = window.innerHeight || document.documentElement.clientHeight || 9999;
    document.querySelectorAll(".reveal:not(.in)").forEach(function (r) {
      if (r.getBoundingClientRect().top < vh * 0.92) r.classList.add("in");
    });
  }
  var rRaf = null;
  function queueReveal() { if (rRaf) return; rRaf = requestAnimationFrame(function () { showReveals(); rRaf = null; }); }
  window.addEventListener("scroll", queueReveal, { passive: true });
  window.addEventListener("resize", queueReveal);
  window.addEventListener("load", showReveals);
  showReveals();
  setTimeout(showReveals, 200);
  setTimeout(showReveals, 700);
  setTimeout(function () { document.querySelectorAll(".reveal:not(.in)").forEach(function (r) { r.classList.add("in"); }); }, 1100);

  /* ---- counters: rect-based trigger ---- */
  var counters = [].slice.call(document.querySelectorAll("[data-count]"));
  function animCount(node) {
    var target = parseFloat(node.getAttribute("data-count"));
    var suffix = node.getAttribute("data-suffix") || "";
    var dur = 1500, start = performance.now();
    function step(now) {
      var p = Math.min((now - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      node.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function checkCounters() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    counters = counters.filter(function (n) {
      if (n.getBoundingClientRect().top < vh * 0.85) { animCount(n); return false; }
      return true;
    });
  }
  window.addEventListener("scroll", checkCounters, { passive: true });
  window.addEventListener("load", checkCounters);
  checkCounters();
  setTimeout(checkCounters, 400);

  /* ---- 3D tilt ---- */
  if (!reduce && window.matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      var raf = null;
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        if (card.classList.contains("svc")) { card.style.setProperty("--mx", px * 100 + "%"); card.style.setProperty("--my", py * 100 + "%"); }
        if (raf) return;
        raf = requestAnimationFrame(function () {
          card.style.transform = "perspective(900px) rotateX(" + (py - 0.5) * -8 + "deg) rotateY(" + (px - 0.5) * 10 + "deg) translateY(-4px)";
          raf = null;
        });
      });
      card.addEventListener("mouseleave", function () { card.style.transform = ""; });
    });
  }

  /* ---- parallax ---- */
  if (!reduce) {
    var orbs = document.querySelectorAll(".hero .orb");
    var heroImg = document.querySelector(".hero-frame img");
    var pRaf = null;
    window.addEventListener("scroll", function () {
      if (pRaf) return;
      pRaf = requestAnimationFrame(function () {
        var y = window.scrollY;
        orbs[0] && (orbs[0].style.transform = "translateY(" + y * 0.12 + "px)");
        orbs[1] && (orbs[1].style.transform = "translateY(" + y * -0.08 + "px)");
        if (heroImg && y < 900) heroImg.style.transform = "scale(1.08) translateY(" + y * 0.04 + "px)";
        pRaf = null;
      });
    }, { passive: true });
  }

  /* ---- contact form ---- */
  var cform = document.getElementById("contactForm");
  if (cform) {
    cform.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      cform.querySelectorAll("[required]").forEach(function (f) {
        var bad = !f.value.trim() || (f.type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value));
        f.classList.toggle("invalid", bad);
        if (bad) ok = false;
      });
      var note = document.getElementById("formNote");
      if (!ok) { note.textContent = "Please complete the highlighted fields."; note.className = "form-note err"; return; }
      cform.style.display = "none";
      document.getElementById("formSuccess").classList.add("show");
    });
    cform.querySelectorAll("input,textarea,select").forEach(function (f) {
      f.addEventListener("input", function () { f.classList.remove("invalid"); });
    });
  }
})();
