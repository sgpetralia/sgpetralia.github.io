/**
 * PAT2TM Interactive Concordance Explorer Engine
 * "A concordance between patent and trademark classes to link technologies to markets"
 * Abbasiharofteh, Castaldi, Petralia (Nature Scientific Data 2026)
 */

(function() {
  'use strict';

  // Global State
  const state = {
    mode: 'tech', // 'tech' | 'market' | 'network'
    selectedSection: 'All',
    selectedCpc: 'G06F',
    selectedMarketFilter: 'all', // 'all' | 'goods' | 'services'
    selectedNice: 9,
    // Tab 3 Network State
    netSection: 'All',
    netThreshold: 12.4, // 95th percentile from paper (Zij >= 12.35)
    netMarketType: 'all', // 'all' | 'goods' | 'services'
    netSelectedNode: 'G06F', // default active node in inspector
    netHoverNode: null
  };

  const SHORT_NICE_TITLES = {
    1: 'Chemicals',
    2: 'Paints & Colorants',
    3: 'Cosmetics & Cleaning',
    4: 'Industrial Oils & Fuels',
    5: 'Pharmaceuticals',
    6: 'Metals & Hardware',
    7: 'Machinery & Tools',
    8: 'Hand Tools',
    9: 'Computing & Software',
    10: 'Medical Devices',
    11: 'Environmental Control',
    12: 'Vehicles & Transport',
    13: 'Firearms & Explosives',
    14: 'Jewelry & Watches',
    15: 'Musical Instruments',
    16: 'Paper & Stationery',
    17: 'Plastics & Rubber',
    18: 'Leather & Luggage',
    19: 'Building Materials',
    20: 'Furniture & Household',
    21: 'Kitchen Utensils',
    22: 'Ropes & Sacks',
    23: 'Yarns & Threads',
    24: 'Textiles & Fabrics',
    25: 'Clothing & Footwear',
    26: 'Haberdashery & Ribbons',
    27: 'Floor Coverings',
    28: 'Games & Sporting Goods',
    29: 'Dairy & Processed Foods',
    30: 'Staple Foods & Coffee',
    31: 'Agriculture & Forestry',
    32: 'Beers & Beverages',
    33: 'Alcoholic Beverages',
    34: 'Tobacco & Smokers',
    35: 'Business & Advertising',
    36: 'Financial & Insurance',
    37: 'Construction & Repair',
    38: 'Telecommunications',
    39: 'Transport & Logistics',
    40: 'Material Treatment',
    41: 'Education & Training',
    42: 'Scientific & IT Services',
    43: 'Hospitality & Food',
    44: 'Medical & Healthcare',
    45: 'Legal & Security'
  };

  function getCleanCpcTitle(raw) {
    if (!raw) return '';
    let clean = raw.split(';')[0].split(',')[0].trim();
    if (clean.length > 22) clean = clean.slice(0, 20) + '...';
    return clean;
  }

  const SECTION_COLORS = {
    'A': '#10b981', // Emerald - Human Necessities
    'B': '#3b82f6', // Blue - Performing Operations; Transporting
    'C': '#06b6d4', // Cyan - Chemistry; Metallurgy
    'D': '#8b5cf6', // Purple - Textiles; Paper
    'E': '#f59e0b', // Amber - Fixed Constructions
    'F': '#ec4899', // Pink - Mechanical Engineering
    'G': '#6366f1', // Indigo - Physics
    'H': '#0ea5e9', // Sky - Electricity
    'Y': '#14b8a6'  // Teal - Emerging Technologies
  };

  function init() {
    if (!window.PAT2TM_DATA) {
      setTimeout(init, 100);
      return;
    }

    // Default selection fallback
    const allTechs = window.PAT2TM_DATA.technologies || [];
    if (allTechs.length && !allTechs.some(t => t.c === state.selectedCpc)) {
      state.selectedCpc = allTechs[0].c;
    }

    const allMarkets = window.PAT2TM_DATA.markets || [];
    if (allMarkets.length && !allMarkets.some(m => m.n === state.selectedNice)) {
      state.selectedNice = allMarkets[0].n;
    }

    renderCurrentMode();
    setupEventListeners();
  }

  // Global modal open/close functions
  function openPat2tmModal() {
    const modal = document.getElementById('pat2tm-modal');
    if (!modal) return;
    modal.classList.add('open');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    const targetMode = state.mode || 'tech';
    setPat2tmMode(targetMode);
  }
  window.openPat2tmModal = openPat2tmModal;

  function closePat2tmModal(event) {
    if (event && event.target !== event.currentTarget && !event.target.classList.contains('btn-close-modal') && !event.target.closest('.btn-close-modal')) {
      return;
    }
    const modal = document.getElementById('pat2tm-modal');
    if (!modal || !modal.classList.contains('open')) return;
    modal.classList.remove('open');
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
  window.closePat2tmModal = closePat2tmModal;

  function setPat2tmMode(newMode) {
    state.mode = newMode;

    document.querySelectorAll('.pat2tm-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === newMode);
    });

    renderCurrentMode();
  }
  window.setPat2tmMode = setPat2tmMode;

  function setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closePat2tmModal();
    });
  }

  function renderCurrentMode() {
    const activeMode = state.mode || 'tech';
    state.mode = activeMode;
    if (activeMode === 'tech') {
      renderTechToMarketView();
    } else if (activeMode === 'market') {
      renderMarketToTechView();
    } else if (activeMode === 'network') {
      renderNetworkView();
    }
  }

  // =========================================================================
  // TAB 1: TECHNOLOGIES TO MARKETS (TECHNOLOGY -> MARKET CONCORDANCE)
  // =========================================================================
  function renderTechToMarketView() {
    const stage = document.getElementById('pat2tm-stage');
    if (!stage) return;

    stage.className = 'modal-exp-stage pat2tm-stage mode-tech';

    const data = window.PAT2TM_DATA;
    const allTechs = data.technologies || [];
    const sections = ['All', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'Y'];

    // Filter technologies by CPC section
    const filteredTechs = allTechs.filter(t => {
      if (state.selectedSection !== 'All' && t.s !== state.selectedSection) return false;
      return true;
    });

    // Make sure an active tech exists
    let activeTech = filteredTechs.find(t => t.c === state.selectedCpc) || filteredTechs[0] || allTechs[0];
    if (activeTech) state.selectedCpc = activeTech.c;

    const leftHtml = `
      <div class="pat2tm-left-col">
        <!-- CPC Section Filter Pills -->
        <div class="pat2tm-pills-row">
          <div class="pat2tm-pills-scroll">
            ${sections.map(sec => {
              const secInfo = data.cpcSections[sec] || { name: 'All Technologies' };
              const color = SECTION_COLORS[sec] || 'var(--color-primary)';
              const isSel = state.selectedSection === sec;
              return `
                <button class="pat2tm-pill ${isSel ? 'active' : ''}" onclick="filterPat2tmSection('${sec}')" title="Section ${sec}: ${secInfo.name}">
                  ${sec !== 'All' ? `<span class="pill-dot" style="background: ${color};"></span>` : ''}
                  <span>${sec === 'All' ? 'All CPC Sections (656)' : `Section ${sec}`}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- CPC Technologies List -->
        <div class="pat2tm-list">
          ${filteredTechs.map((t) => {
            const isSel = t.c === state.selectedCpc;
            const secColor = SECTION_COLORS[t.s] || '#3b82f6';
            return `
              <div class="pat2tm-row ${isSel ? 'active' : ''}" data-cpc="${t.c}" onclick="selectPat2tmTech('${t.c}')">
                <div class="pat2tm-row-top">
                  <div class="pat2tm-row-badge-wrap">
                    <span class="pat2tm-cpc-chip" style="color: ${secColor}; background: ${secColor}15; border-color: ${secColor}33;">
                      CPC ${t.c}
                    </span>
                    <span class="pat2tm-sec-tag">Section ${t.s}</span>
                  </div>
                  <span class="pat2tm-z-badge" title="Peak Concordance Score (Zij > 0)">
                    Peak Z<sub>ij</sub> = ${t.mz.toFixed(1)}
                  </span>
                </div>
                <div class="pat2tm-row-title">${t.l}</div>
                <div class="pat2tm-row-meta">
                  <span>📂 <strong>${t.n}</strong> Nice subclasses</span>
                  <span>&bull;</span>
                  <span><strong>${t.gp}%</strong> Goods / <strong>${100 - t.gp}%</strong> Services</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Right Dossier Column -->
      <div id="pat2tm-dossier" class="pat2tm-dossier-col">
        ${renderTechDossier(activeTech)}
      </div>
    `;

    stage.innerHTML = leftHtml;
  }

  function renderTechDossier(tech) {
    if (!tech) return '<div class="pat2tm-card"><p class="text-muted">Select a CPC technology class on the left to view commercial Nice subclass translations.</p></div>';

    const data = window.PAT2TM_DATA;
    const secColor = SECTION_COLORS[tech.s] || '#3b82f6';
    const secInfo = data.cpcSections[tech.s] || { name: 'Technology Field', sub: '' };
    const subclasses = data.subclasses || {};
    const niceTitles = data.niceTitles || {};

    const maxZ = Math.max(...(tech.top || []).map(l => l[1]), 10);

    const linksHtml = (tech.top || []).map(([subId, zScore], idx) => {
      const sub = subclasses[subId] || {};
      const niceNum = sub.n || parseInt(subId.split('_')[0], 10) || 1;
      const niceTitle = niceTitles[niceNum] || `Class ${niceNum}`;
      const isGoods = (sub.t === 1);
      const typeColor = isGoods ? '#10b981' : '#8b5cf6';
      const pct = Math.max(5, Math.min(100, Math.round((zScore / maxZ) * 100)));
      const termsSnippet = (sub.terms || []).slice(0, 3).join(' • ');

      return `
        <div class="pat2tm-link-card">
          <div class="link-card-top">
            <div class="link-card-badges">
              <span class="link-rank-chip">#${idx + 1}</span>
              <span class="nice-class-chip" style="color: ${typeColor}; background: ${typeColor}15; border-color: ${typeColor}33;">
                ${isGoods ? '📦 Goods Class' : '💼 Services Class'} • Nice Class ${niceNum}: ${niceTitle}
              </span>
              <span class="subclass-code-tag">Nice Subclass: ${subId}</span>
            </div>
            <div class="link-z-score">
              <span class="z-label">Concordance Score</span>
              <span class="z-val" style="color: ${typeColor};">Z<sub>ij</sub> = ${zScore.toFixed(1)}</span>
            </div>
          </div>

          <div class="link-bar-track">
            <div class="link-bar-fill" style="width: ${pct}%; background: ${typeColor};"></div>
          </div>

          <div class="link-sub-desc">
            ${sub.l || 'Commercial goods and services in this Nice subclass.'}
          </div>

          ${sub.kw ? `
            <div class="link-terms-row">
              <span class="terms-label">Nice Subclass Keywords:</span>
              <span class="terms-content">${sub.kw}</span>
            </div>
          ` : ''}

          ${termsSnippet ? `
            <div class="link-terms-row">
              <span class="terms-label">Harmonised Database (HDB) Terms:</span>
              <span class="terms-content">${termsSnippet}</span>
            </div>
          ` : ''}
        </div>
      `;
    }).join('') || '<div class="text-muted" style="text-align: center; padding: 2rem;">No positive concordance links found.</div>';

    return `
      <!-- CPC Technology Class Header Card -->
      <div class="pat2tm-header-card">
        <div class="tech-header-top">
          <div class="tech-header-left">
            <span class="tech-badge" style="color: ${secColor}; background: ${secColor}15; border-color: ${secColor}33;">
              CPC ${tech.c}
            </span>
            <span class="tech-sec-badge" style="color: ${secColor};">
              CPC Section ${tech.s}: ${secInfo.name}
            </span>
          </div>
          <span class="tech-sub-note">${secInfo.sub}</span>
        </div>
        <h3 class="tech-header-title">${tech.l}</h3>
      </div>

      <!-- KPI Metrics Strip -->
      <div class="pat2tm-kpi-row">
        <div class="pat2tm-kpi-card">
          <div class="kpi-num" style="color: ${secColor};">${tech.n}</div>
          <div class="kpi-lbl">Linked Nice Subclasses</div>
        </div>
        <div class="pat2tm-kpi-card">
          <div class="kpi-num" style="color: #f59e0b;">Z<sub>ij</sub> = ${tech.mz.toFixed(1)}</div>
          <div class="kpi-lbl">Peak Concordance Score</div>
        </div>
        <div class="pat2tm-kpi-card">
          <div class="kpi-num" style="color: #10b981;">${tech.gp}% / ${100 - tech.gp}%</div>
          <div class="kpi-lbl">Goods vs. Services Share</div>
        </div>
      </div>

      <!-- Linked Nice Trademark Subclasses List -->
      <div class="pat2tm-translations-wrap">
        <div class="translations-heading">
          <span>Linked Nice Trademark Subclasses (Ranked by Concordance Z<sub>ij</sub>)</span>
          <span class="heading-sub">Probabilistic content-based concordance linking CPC technology classes and Nice trademark subclasses (Z<sub>ij</sub> > 0)</span>
        </div>
        <div class="pat2tm-links-list">
          ${linksHtml}
        </div>
      </div>
    `;
  }

  window.filterPat2tmSection = function(sec) {
    state.selectedSection = sec;
    renderTechToMarketView();
    const list = document.querySelector('.pat2tm-list');
    if (list) list.scrollTop = 0;
  };

  window.selectPat2tmTech = function(cpc) {
    state.selectedCpc = cpc;
    const allTechs = window.PAT2TM_DATA.technologies || [];
    const tech = allTechs.find(t => t.c === cpc);
    if (!tech) return;

    document.querySelectorAll('.pat2tm-row[data-cpc]').forEach(row => {
      row.classList.toggle('active', row.dataset.cpc === cpc);
    });

    const dossier = document.getElementById('pat2tm-dossier');
    if (dossier) {
      dossier.innerHTML = renderTechDossier(tech);
      dossier.scrollTop = 0;
    }
  };

  // =========================================================================
  // TAB 2: MARKETS TO TECHNOLOGIES (MARKET -> TECHNOLOGY CONCORDANCE)
  // =========================================================================
  function renderMarketToTechView() {
    const stage = document.getElementById('pat2tm-stage');
    if (!stage) return;

    stage.className = 'modal-exp-stage pat2tm-stage mode-market';

    const data = window.PAT2TM_DATA;
    const allMarkets = data.markets || [];

    // Filter Nice classes by type (Goods vs Services)
    const filteredMarkets = allMarkets.filter(m => {
      if (state.selectedMarketFilter === 'goods' && m.t !== 1) return false;
      if (state.selectedMarketFilter === 'services' && m.t !== 2) return false;
      return true;
    });

    let activeMarket = filteredMarkets.find(m => m.n === state.selectedNice) || filteredMarkets[0] || allMarkets[0];
    if (activeMarket) state.selectedNice = activeMarket.n;

    const leftHtml = `
      <div class="pat2tm-left-col">
        <!-- Nice Market Filter Pills -->
        <div class="pat2tm-pills-row">
          <div class="pat2tm-pills-scroll">
            <button class="pat2tm-pill ${state.selectedMarketFilter === 'all' ? 'active' : ''}" onclick="filterPat2tmMarketType('all')">
              All Nice Classes (45)
            </button>
            <button class="pat2tm-pill ${state.selectedMarketFilter === 'goods' ? 'active' : ''}" onclick="filterPat2tmMarketType('goods')">
              📦 Goods Classes (1–34)
            </button>
            <button class="pat2tm-pill ${state.selectedMarketFilter === 'services' ? 'active' : ''}" onclick="filterPat2tmMarketType('services')">
              💼 Services Classes (35–45)
            </button>
          </div>
        </div>

        <!-- Nice Classes List -->
        <div class="pat2tm-list">
          ${filteredMarkets.map((m) => {
            const isSel = m.n === state.selectedNice;
            const isGoods = (m.t === 1);
            const typeColor = isGoods ? '#10b981' : '#8b5cf6';
            return `
              <div class="pat2tm-row ${isSel ? 'active' : ''}" data-nice="${m.n}" onclick="selectPat2tmMarket(${m.n})">
                <div class="pat2tm-row-top">
                  <div class="pat2tm-row-badge-wrap">
                    <span class="pat2tm-cpc-chip" style="color: ${typeColor}; background: ${typeColor}15; border-color: ${typeColor}33;">
                      Class ${m.n}
                    </span>
                    <span class="pat2tm-sec-tag">${isGoods ? 'Goods' : 'Services'}</span>
                  </div>
                  <span class="pat2tm-z-badge" title="Peak Concordance Score (Zij > 0)">
                    Peak Z<sub>ij</sub> = ${m.mz.toFixed(1)}
                  </span>
                </div>
                <div class="pat2tm-row-title">${m.title}</div>
                <div class="pat2tm-row-meta">
                  <span>🔬 <strong>${m.total}</strong> CPC technology classes</span>
                  <span>&bull;</span>
                  <span>Peak Z<sub>ij</sub>: <strong>${m.mz.toFixed(1)}</strong></span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Right Dossier Column -->
      <div id="pat2tm-dossier" class="pat2tm-dossier-col">
        ${renderMarketDossier(activeMarket)}
      </div>
    `;

    stage.innerHTML = leftHtml;
  }

  function renderMarketDossier(market) {
    if (!market) return '<div class="pat2tm-card"><p class="text-muted">Select a Nice trademark class on the left to view underlying CPC technology classes.</p></div>';

    const data = window.PAT2TM_DATA;
    const isGoods = (market.t === 1);
    const typeColor = isGoods ? '#10b981' : '#8b5cf6';
    const subclasses = data.subclasses || {};

    const maxZ = Math.max(...(market.top || []).map(t => t.z), 10);

    const techsHtml = (market.top || []).map((t, idx) => {
      const secColor = SECTION_COLORS[t.c[0]] || '#3b82f6';
      const pct = Math.max(5, Math.min(100, Math.round((t.z / maxZ) * 100)));
      const sub = subclasses[t.sub] || {};
      const secInfo = data.cpcSections[t.c[0]] || { name: 'Technology' };
      const termsSnippet = (sub.terms || []).slice(0, 3).join(' • ');

      return `
        <div class="pat2tm-link-card">
          <div class="link-card-top">
            <div class="link-card-badges">
              <span class="link-rank-chip">#${idx + 1}</span>
              <span class="nice-class-chip" style="color: ${secColor}; background: ${secColor}15; border-color: ${secColor}33;">
                CPC ${t.c} &bull; Section ${t.c[0]}: ${secInfo.name}
              </span>
              <span class="subclass-code-tag">Via Nice Subclass: ${t.sub}</span>
            </div>
            <div class="link-z-score">
              <span class="z-label">Concordance Score</span>
              <span class="z-val" style="color: ${secColor};">Z<sub>ij</sub> = ${t.z.toFixed(1)}</span>
            </div>
          </div>

          <div class="link-bar-track">
            <div class="link-bar-fill" style="width: ${pct}%; background: ${secColor};"></div>
          </div>

          <div class="link-sub-desc" style="font-weight: 700; color: var(--text-heading); font-size: 0.85rem;">
            ${t.l || 'CPC technology class'}
          </div>

          ${sub.l ? `
            <div class="link-terms-row">
              <span class="terms-label">Connecting Market Subclass:</span>
              <span class="terms-content">${sub.l}</span>
            </div>
          ` : ''}

          ${termsSnippet ? `
            <div class="link-terms-row">
              <span class="terms-label">Matched Harmonised Database (HDB) Terms:</span>
              <span class="terms-content">${termsSnippet}</span>
            </div>
          ` : ''}
        </div>
      `;
    }).join('') || '<div class="text-muted" style="text-align: center; padding: 2rem;">No CPC technology classes linked.</div>';

    return `
      <!-- Nice Class Header Card -->
      <div class="pat2tm-header-card">
        <div class="tech-header-top">
          <div class="tech-header-left">
            <span class="tech-badge" style="color: ${typeColor}; background: ${typeColor}15; border-color: ${typeColor}33;">
              Nice Class ${market.n}
            </span>
            <span class="tech-sec-badge" style="color: ${typeColor};">
              ${isGoods ? 'Goods Class (Nice Classes 1–34)' : 'Services Class (Nice Classes 35–45)'}
            </span>
          </div>
        </div>
        <h3 class="tech-header-title">${market.title}</h3>
      </div>

      <!-- KPI Metrics Strip -->
      <div class="pat2tm-kpi-row">
        <div class="pat2tm-kpi-card">
          <div class="kpi-num" style="color: ${typeColor};">${market.total}</div>
          <div class="kpi-lbl">Linked CPC Technologies</div>
        </div>
        <div class="pat2tm-kpi-card">
          <div class="kpi-num" style="color: #f59e0b;">Z<sub>ij</sub> = ${market.mz.toFixed(1)}</div>
          <div class="kpi-lbl">Strongest Concordance (Z<sub>ij</sub>)</div>
        </div>
        <div class="pat2tm-kpi-card">
          <div class="kpi-num" style="color: #3b82f6;">${isGoods ? 'Goods Class' : 'Services Class'}</div>
          <div class="kpi-lbl">Classification Type</div>
        </div>
      </div>

      <!-- Associated CPC Technology Classes List -->
      <div class="pat2tm-translations-wrap">
        <div class="translations-heading">
          <span>Associated CPC Technology Classes (Ranked by Concordance Z<sub>ij</sub>)</span>
          <span class="heading-sub">Probabilistic content-based concordance linking CPC technology classes and Nice trademark subclasses (Z<sub>ij</sub> > 0)</span>
        </div>
        <div class="pat2tm-links-list">
          ${techsHtml}
        </div>
      </div>
    `;
  }

  window.filterPat2tmMarketType = function(type) {
    state.selectedMarketFilter = type;
    renderMarketToTechView();
    const list = document.querySelector('.pat2tm-list');
    if (list) list.scrollTop = 0;
  };

  window.selectPat2tmMarket = function(niceNum) {
    state.selectedNice = niceNum;
    const allMarkets = window.PAT2TM_DATA.markets || [];
    const market = allMarkets.find(m => m.n === niceNum);
    if (!market) return;

    document.querySelectorAll('.pat2tm-row[data-nice]').forEach(row => {
      row.classList.toggle('active', row.dataset.nice === String(niceNum));
    });

    const dossier = document.getElementById('pat2tm-dossier');
    if (dossier) {
      dossier.innerHTML = renderMarketDossier(market);
      dossier.scrollTop = 0;
    }
  };

  // =========================================================================
  // TAB 3: CONCORDANCE NETWORK (BIPARTITE GRAPH & EGO-NETWORK ZOOM)
  // Replicating Figure 3 from Abbasiharofteh, Castaldi, Petralia (2026)
  // =========================================================================
  function renderNetworkView() {
    const stage = document.getElementById('pat2tm-stage');
    if (!stage) return;

    stage.className = 'modal-exp-stage pat2tm-stage mode-network';

    const data = window.PAT2TM_DATA;
    const sections = ['All', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'Y'];
    const allLinks = data.networkLinks || [];

    // Filter links by threshold, CPC Section, and Market type
    const thresh = state.netThreshold || 12.4;
    const filteredLinks = allLinks.filter(l => {
      // l: [cpc, nice_num, sub_id, z]
      if (l[3] < thresh) return false;
      if (state.netSection !== 'All' && l[0][0] !== state.netSection) return false;
      if (state.netMarketType === 'goods' && l[1] > 34) return false;
      if (state.netMarketType === 'services' && l[1] <= 34) return false;
      return true;
    });

    // Determine active visible nodes
    // Map to find highest Z for each (CPC, Nice)
    const pairMap = new Map();
    const cpcDegrees = new Map();
    const niceDegrees = new Map();

    filteredLinks.forEach(l => {
      const [cpc, niceNum, subId, z] = l;
      const k = `${cpc}__${niceNum}`;
      if (!pairMap.has(k) || pairMap.get(k).z < z) {
        pairMap.set(k, { cpc, niceNum, subId, z });
      }
      cpcDegrees.set(cpc, (cpcDegrees.get(cpc) || 0) + 1);
      niceDegrees.set(niceNum, (niceDegrees.get(niceNum) || 0) + 1);
    });

    // Select top CPC classes (up to 20)
    const sortedCpcs = Array.from(cpcDegrees.keys()).sort((a, b) => {
      return (cpcDegrees.get(b) || 0) - (cpcDegrees.get(a) || 0);
    });
    const maxNodes = 14;
    const visibleCpcs = sortedCpcs.slice(0, maxNodes);
    const visibleCpcSet = new Set(visibleCpcs);

    // Select connected Nice classes (up to 18)
    const sortedNices = Array.from(niceDegrees.keys())
      .filter(n => {
        return visibleCpcs.some(c => pairMap.has(`${c}__${n}`));
      })
      .sort((a, b) => (niceDegrees.get(b) || 0) - (niceDegrees.get(a) || 0));
    
    const visibleNices = sortedNices.slice(0, 18);
    const visibleNiceSet = new Set(visibleNices);

    // Filter final pairs between visible nodes
    const visibleLinks = [];
    pairMap.forEach(item => {
      if (visibleCpcSet.has(item.cpc) && visibleNiceSet.has(item.niceNum)) {
        visibleLinks.push(item);
      }
    });

    // Fallback if current inspector node is not in visible set
    if (!state.netSelectedNode || (!visibleCpcSet.has(state.netSelectedNode) && !visibleNiceSet.has(Number(state.netSelectedNode)))) {
      state.netSelectedNode = visibleCpcs[0] || (visibleNices[0] ? String(visibleNices[0]) : null);
    }

    const html = `
      <!-- Network Top Controls -->
      <div class="pat2tm-net-top-bar" style="display: flex; flex-direction: column; gap: 0.5rem; flex-shrink: 0;">
        <!-- CPC Section Pills -->
        <div class="pat2tm-pills-row">
          <div class="pat2tm-pills-scroll">
            ${sections.map(sec => {
              const secInfo = data.cpcSections[sec] || { name: 'All Technologies' };
              const color = SECTION_COLORS[sec] || 'var(--color-primary)';
              const isSel = state.netSection === sec;
              return `
                <button class="pat2tm-pill ${isSel ? 'active' : ''}" onclick="setPat2tmNetSection('${sec}')" title="Section ${sec}: ${secInfo.name}">
                  ${sec !== 'All' ? `<span class="pill-dot" style="background: ${color};"></span>` : ''}
                  <span>${sec === 'All' ? 'All CPC Sections (656)' : `Section ${sec}`}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Controls Strip: Threshold Slider & Market Filter -->
        <div class="pat2tm-net-controls-strip">
          <!-- Threshold Slider -->
          <div class="pat2tm-slider-wrap">
            <span class="pat2tm-slider-label">
              <span>Threshold:</span>
              <span class="pat2tm-threshold-val">Z<sub>ij</sub> &ge; ${Number(state.netThreshold).toFixed(1)}</span>
            </span>
            <input type="range" class="pat2tm-range-input" min="8.0" max="30.0" step="0.5" value="${state.netThreshold}" oninput="setPat2tmNetThreshold(this.value)">
            <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">(95th Pct: 12.4)</span>
          </div>

          <!-- Market Filter -->
          <div class="pat2tm-net-filter-pills">
            <button class="pat2tm-pill ${state.netMarketType === 'all' ? 'active' : ''}" onclick="setPat2tmNetMarketType('all')">
              All Markets
            </button>
            <button class="pat2tm-pill ${state.netMarketType === 'goods' ? 'active' : ''}" onclick="setPat2tmNetMarketType('goods')">
              📦 Goods
            </button>
            <button class="pat2tm-pill ${state.netMarketType === 'services' ? 'active' : ''}" onclick="setPat2tmNetMarketType('services')">
              💼 Services
            </button>
          </div>
        </div>
      </div>

      <!-- Network Main Grid: Canvas & Inspector -->
      <div class="pat2tm-net-main-grid">
        <!-- SVG Canvas Card -->
        <div class="pat2tm-net-canvas-card">
          <div class="pat2tm-net-canvas-header">
            <span>Bipartite Concordance Network (CPC ↔ Nice)</span>
            <span class="net-meta-note">
              ${visibleCpcs.length} Technologies &bull; ${visibleNices.length} Market Classes &bull; ${visibleLinks.length} Concordance Links
            </span>
          </div>
          <div class="pat2tm-svg-wrap">
            ${renderBipartiteSvg(visibleCpcs, visibleNices, visibleLinks)}
            <div id="pat2tm-net-tooltip" class="pat2tm-net-tooltip"></div>
          </div>
        </div>

        <!-- Inspector Column -->
        <div id="pat2tm-net-inspector" class="pat2tm-net-inspector-col">
          ${renderNetworkInspector(visibleLinks)}
        </div>
      </div>
    `;

    stage.innerHTML = html;
  }

  function renderBipartiteSvg(cpcs, nices, links) {
    if (!cpcs.length || !nices.length) {
      return '<div class="text-muted" style="text-align: center; padding: 3rem;">No concordance links found at this threshold. Try lowering the Z<sub>ij</sub> slider.</div>';
    }

    const data = window.PAT2TM_DATA;
    const cpcDict = {};
    (data.technologies || []).forEach(t => { cpcDict[t.c] = t; });
    const niceTitles = data.niceTitles || {};

    const svgWidth = 860;
    const svgHeight = 480;

    const leftX = 235;
    const rightX = 605;

    // Calculate Y coordinates
    const topY = 48;
    const bottomY = 455;

    const cpcYMap = {};
    const cpcStep = cpcs.length > 1 ? (bottomY - topY) / (cpcs.length - 1) : 0;
    cpcs.forEach((c, idx) => {
      cpcYMap[c] = cpcs.length > 1 ? topY + idx * cpcStep : (topY + bottomY) / 2;
    });

    const niceYMap = {};
    const niceStep = nices.length > 1 ? (bottomY - topY) / (nices.length - 1) : 0;
    nices.forEach((n, idx) => {
      niceYMap[n] = nices.length > 1 ? topY + idx * niceStep : (topY + bottomY) / 2;
    });

    const activeNode = state.netHoverNode || state.netSelectedNode;

    // Build SVG Links
    const maxZ = Math.max(...links.map(l => l.z), 15);
    const linksSvg = links.map(l => {
      const y1 = cpcYMap[l.cpc];
      const y2 = niceYMap[l.niceNum];
      if (y1 === undefined || y2 === undefined) return '';

      const isConnected = activeNode ? (activeNode === l.cpc || activeNode === String(l.niceNum)) : false;
      const secColor = SECTION_COLORS[l.cpc[0]] || '#3b82f6';

      // Width proportional to Z-score
      const sw = Math.max(1.4, Math.min(6.5, (l.z / maxZ) * 6.5));
      const opacity = activeNode ? (isConnected ? 0.92 : 0.05) : Math.max(0.25, Math.min(0.75, (l.z / maxZ) * 0.75));

      // Cubic bezier control points
      const cp1X = leftX + 160;
      const cp2X = rightX - 160;
      const d = `M ${leftX} ${y1} C ${cp1X} ${y1}, ${cp2X} ${y2}, ${rightX} ${y2}`;

      return `
        <path class="pat2tm-net-link" d="${d}" 
          stroke="${secColor}" 
          stroke-width="${sw}" 
          stroke-opacity="${opacity}"
          data-cpc="${l.cpc}"
          data-nice="${l.niceNum}"
          data-z="${l.z}"
          data-sub="${l.subId}"
          onmouseenter="handleNetLinkHover(event, '${l.cpc}', ${l.niceNum}, '${l.subId}', ${l.z})"
          onmouseleave="handleNetLinkLeave()"
        />
      `;
    }).join('');

    // Build CPC Nodes (Left Pillar)
    const cpcNodesSvg = cpcs.map(c => {
      const y = cpcYMap[c];
      const secColor = SECTION_COLORS[c[0]] || '#3b82f6';
      const isSelected = activeNode === c;
      const tech = cpcDict[c] || { l: c };
      const shortTitle = getCleanCpcTitle(tech.l);

      return `
        <g class="pat2tm-net-node cpc-node ${isSelected ? 'active' : ''}" 
           transform="translate(${leftX}, ${y})"
           onclick="selectNetNode('${c}')"
           onmouseenter="hoverNetNode('${c}')"
           onmouseleave="hoverNetNode(null)"
        >
          <circle cx="0" cy="0" r="${isSelected ? 8.5 : 6}" fill="${secColor}" />
          <text x="-16" y="5" text-anchor="end">
            <tspan fill="var(--text-heading)" font-size="13" font-weight="600">${shortTitle}</tspan>
            <tspan dx="10" fill="${secColor}" font-size="14.5" font-weight="800" font-family="'JetBrains Mono', monospace">${c}</tspan>
          </text>
        </g>
      `;
    }).join('');

    // Build Nice Nodes (Right Pillar)
    const niceNodesSvg = nices.map(n => {
      const y = niceYMap[n];
      const isGoods = n <= 34;
      const typeColor = isGoods ? '#10b981' : '#8b5cf6';
      const isSelected = activeNode === String(n);
      const shortTitle = SHORT_NICE_TITLES[n] || niceTitles[n] || `Class ${n}`;

      return `
        <g class="pat2tm-net-node nice-node ${isSelected ? 'active' : ''}" 
           transform="translate(${rightX}, ${y})"
           onclick="selectNetNode('${n}')"
           onmouseenter="hoverNetNode('${n}')"
           onmouseleave="hoverNetNode(null)"
        >
          <circle cx="0" cy="0" r="${isSelected ? 8.5 : 6}" fill="${typeColor}" />
          <text x="16" y="5" text-anchor="start">
            <tspan fill="${typeColor}" font-size="14.5" font-weight="800" font-family="'JetBrains Mono', monospace">Class ${n}</tspan>
            <tspan dx="10" fill="var(--text-heading)" font-size="13" font-weight="600">${shortTitle}</tspan>
          </text>
        </g>
      `;
    }).join('');

    return `
      <svg id="pat2tm-net-svg" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; display: block;">
        <!-- Header Column Labels -->
        <text x="235" y="24" fill="var(--text-muted)" font-size="13" font-weight="800" text-anchor="end" letter-spacing="0.05em">
          CPC TECHNOLOGY CLASSES
        </text>
        <text x="605" y="24" fill="var(--text-muted)" font-size="13" font-weight="800" text-anchor="start" letter-spacing="0.05em">
          NICE TRADEMARK CLASSES
        </text>

        <!-- Edges Layer -->
        <g id="pat2tm-net-links-layer">
          ${linksSvg}
        </g>

        <!-- Nodes Layer -->
        <g id="pat2tm-net-nodes-layer">
          ${cpcNodesSvg}
          ${niceNodesSvg}
        </g>
      </svg>
    `;
  }

  function renderNetworkInspector(visibleLinks) {
    const data = window.PAT2TM_DATA;
    const activeNode = state.netSelectedNode || (visibleLinks[0] ? visibleLinks[0].cpc : null);

    if (!activeNode) {
      return `
        <div class="inspector-guide-card">
          <div class="inspector-guide-title">Concordance Network Explorer</div>
          <div class="inspector-guide-desc">
            Bipartite concordance mapping between CPC patent technology classes and Nice trademark classes (Abbasiharofteh, Castaldi, Petralia 2026).
          </div>
          <div class="inspector-guide-desc" style="color: var(--color-primary); font-weight: 600;">
            Hover or click any node to isolate its ego-network and inspect its concordance ties.
          </div>
        </div>
      `;
    }

    const isCpc = isNaN(activeNode);
    const subclasses = data.subclasses || {};
    const niceTitles = data.niceTitles || {};

    if (isCpc) {
      // Inspector for CPC Technology Class
      const tech = (data.technologies || []).find(t => t.c === activeNode) || { c: activeNode, l: activeNode, s: activeNode[0] };
      const secColor = SECTION_COLORS[tech.s] || '#3b82f6';
      const secInfo = data.cpcSections[tech.s] || { name: 'Technology Field' };

      // Connected links
      const cpcConns = visibleLinks.filter(l => l.cpc === activeNode).sort((a, b) => b.z - a.z);

      return `
        <div class="pat2tm-header-card" style="padding: 0.75rem 0.95rem;">
          <div class="tech-header-top">
            <span class="tech-badge" style="color: ${secColor}; background: ${secColor}15; border-color: ${secColor}33; font-size: 0.8rem;">
              CPC ${tech.c}
            </span>
            <span class="tech-sec-badge" style="color: ${secColor}; font-size: 0.7rem;">
              Section ${tech.s}: ${secInfo.name}
            </span>
          </div>
          <h4 style="margin: 0.35rem 0 0 0; font-size: 1.02rem; font-weight: 800; color: var(--text-heading); line-height: 1.3;">
            ${tech.l}
          </h4>
          <button class="inspector-action-btn" onclick="jumpToTab1('${tech.c}')">
            View in Techs to Markets &rarr;
          </button>
        </div>

        <div class="pat2tm-translations-wrap" style="padding: 0.75rem 0.85rem;">
          <div class="translations-heading" style="font-size: 0.9rem;">
            <span>Connected Trademark Markets (${cpcConns.length})</span>
            <span class="heading-sub">Nice market classes linked with Z<sub>ij</sub> &ge; ${state.netThreshold}</span>
          </div>

          <div class="pat2tm-links-list" style="gap: 0.45rem; max-height: 280px; overflow-y: auto;">
            ${cpcConns.map((l, idx) => {
              const isGoods = l.niceNum <= 34;
              const typeColor = isGoods ? '#10b981' : '#8b5cf6';
              const title = niceTitles[l.niceNum] || `Class ${l.niceNum}`;
              const sub = subclasses[l.subId] || {};

              return `
                <div class="pat2tm-link-card" style="padding: 0.55rem 0.75rem; gap: 0.3rem;">
                  <div class="link-card-top">
                    <span class="nice-class-chip" style="color: ${typeColor}; background: ${typeColor}15; border-color: ${typeColor}33; font-size: 0.7rem;">
                      ${isGoods ? 'Goods' : 'Services'} &bull; Class ${l.niceNum}
                    </span>
                    <span class="z-val" style="color: ${typeColor}; font-size: 0.8rem; font-weight: 800; font-family: 'JetBrains Mono', monospace;">
                      Z<sub>ij</sub> = ${l.z.toFixed(1)}
                    </span>
                  </div>
                  <div style="font-size: 0.88rem; font-weight: 700; color: var(--text-heading);">
                    ${title}
                  </div>
                  ${sub.l ? `
                    <div style="font-size: 0.8rem; color: var(--text-muted); font-style: italic;">
                      Via Subclass ${l.subId}: ${sub.l}
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('') || '<div class="text-muted" style="padding: 1rem; font-size: 0.72rem;">No links at this threshold.</div>'}
          </div>
        </div>
      `;
    } else {
      // Inspector for Nice Trademark Class
      const niceNum = Number(activeNode);
      const isGoods = niceNum <= 34;
      const typeColor = isGoods ? '#10b981' : '#8b5cf6';
      const title = niceTitles[niceNum] || `Class ${niceNum}`;

      // Connected links
      const niceConns = visibleLinks.filter(l => l.niceNum === niceNum).sort((a, b) => b.z - a.z);

      return `
        <div class="pat2tm-header-card" style="padding: 0.75rem 0.95rem;">
          <div class="tech-header-top">
            <span class="tech-badge" style="color: ${typeColor}; background: ${typeColor}15; border-color: ${typeColor}33; font-size: 0.8rem;">
              Nice Class ${niceNum}
            </span>
            <span class="tech-sec-badge" style="color: ${typeColor}; font-size: 0.7rem;">
              ${isGoods ? 'Goods Sector (1–34)' : 'Services Sector (35–45)'}
            </span>
          </div>
          <h4 style="margin: 0.35rem 0 0 0; font-size: 1.02rem; font-weight: 800; color: var(--text-heading); line-height: 1.3;">
            ${title}
          </h4>
          <button class="inspector-action-btn" onclick="jumpToTab2(${niceNum})">
            View in Markets to Techs &rarr;
          </button>
        </div>

        <div class="pat2tm-translations-wrap" style="padding: 0.75rem 0.85rem;">
          <div class="translations-heading" style="font-size: 0.9rem;">
            <span>Underlying Patent Technologies (${niceConns.length})</span>
            <span class="heading-sub">CPC technology classes linked with Z<sub>ij</sub> &ge; ${state.netThreshold}</span>
          </div>

          <div class="pat2tm-links-list" style="gap: 0.45rem; max-height: 280px; overflow-y: auto;">
            ${niceConns.map((l, idx) => {
              const secColor = SECTION_COLORS[l.cpc[0]] || '#3b82f6';
              const tech = (data.technologies || []).find(t => t.c === l.cpc) || { l: l.cpc };

              return `
                <div class="pat2tm-link-card" style="padding: 0.55rem 0.75rem; gap: 0.3rem;">
                  <div class="link-card-top">
                    <span class="nice-class-chip" style="color: ${secColor}; background: ${secColor}15; border-color: ${secColor}33; font-size: 0.7rem;">
                      CPC ${l.cpc} &bull; Section ${l.cpc[0]}
                    </span>
                    <span class="z-val" style="color: ${secColor}; font-size: 0.8rem; font-weight: 800; font-family: 'JetBrains Mono', monospace;">
                      Z<sub>ij</sub> = ${l.z.toFixed(1)}
                    </span>
                  </div>
                  <div style="font-size: 0.88rem; font-weight: 700; color: var(--text-heading);">
                    ${tech.l}
                  </div>
                  <div style="font-size: 0.8rem; color: var(--text-muted); font-style: italic;">
                    Via Subclass ${l.subId}
                  </div>
                </div>
              `;
            }).join('') || '<div class="text-muted" style="padding: 1rem; font-size: 0.72rem;">No links at this threshold.</div>'}
          </div>
        </div>
      `;
    }
  }

  // Network Interaction Functions
  window.setPat2tmNetSection = function(sec) {
    state.netSection = sec;
    renderNetworkView();
  };

  window.setPat2tmNetThreshold = function(val) {
    state.netThreshold = parseFloat(val);
    renderNetworkView();
  };

  window.setPat2tmNetMarketType = function(type) {
    state.netMarketType = type;
    renderNetworkView();
  };

  window.selectNetNode = function(nodeId) {
    if (state.netSelectedNode === nodeId) {
      state.netSelectedNode = null;
    } else {
      state.netSelectedNode = nodeId;
    }
    renderNetworkView();
  };

  window.hoverNetNode = function(nodeId) {
    state.netHoverNode = nodeId;
    updateNetHighlights();
  };

  function updateNetHighlights() {
    const activeNode = state.netHoverNode || state.netSelectedNode;
    const links = document.querySelectorAll('.pat2tm-net-link');
    const nodes = document.querySelectorAll('.pat2tm-net-node');

    if (!activeNode) {
      links.forEach(l => {
        const z = parseFloat(l.dataset.z || '10');
        l.setAttribute('stroke-opacity', Math.max(0.25, Math.min(0.75, (z / 25) * 0.75)));
      });
      nodes.forEach(n => n.classList.remove('active'));
      return;
    }

    links.forEach(l => {
      const isConn = (l.dataset.cpc === activeNode || l.dataset.nice === activeNode);
      l.setAttribute('stroke-opacity', isConn ? '0.92' : '0.05');
    });

    nodes.forEach(n => {
      const isSelf = n.getAttribute('onclick') && n.getAttribute('onclick').includes(activeNode);
      n.classList.toggle('active', !!isSelf);
    });
  }

  window.handleNetLinkHover = function(e, cpc, niceNum, subId, z) {
    const tooltip = document.getElementById('pat2tm-net-tooltip');
    if (!tooltip) return;

    const data = window.PAT2TM_DATA;
    const niceTitle = (data.niceTitles || {})[niceNum] || `Class ${niceNum}`;
    const sub = (data.subclasses || {})[subId] || {};

    tooltip.innerHTML = `
      <div style="font-weight: 800; color: #f59e0b; margin-bottom: 2px;">
        Concordance Score: Z<sub>ij</sub> = ${z.toFixed(1)}
      </div>
      <div style="font-weight: 700; color: #ffffff;">
        CPC ${cpc} &harr; Nice Class ${niceNum} (${niceTitle})
      </div>
      <div style="color: #94a3b8; font-size: 0.68rem; margin-top: 2px;">
        Via Nice Subclass ${subId}: ${sub.l || ''}
      </div>
    `;

    const svgWrap = document.querySelector('.pat2tm-svg-wrap');
    if (svgWrap) {
      const rect = svgWrap.getBoundingClientRect();
      const x = e.clientX - rect.left + 15;
      const y = e.clientY - rect.top - 20;
      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y}px`;
      tooltip.style.opacity = '1';
    }
  };

  window.handleNetLinkLeave = function() {
    const tooltip = document.getElementById('pat2tm-net-tooltip');
    if (tooltip) tooltip.style.opacity = '0';
  };

  window.jumpToTab1 = function(cpc) {
    state.selectedCpc = cpc;
    state.selectedSection = 'All';
    setPat2tmMode('tech');
  };

  window.jumpToTab2 = function(niceNum) {
    state.selectedNice = niceNum;
    state.selectedMarketFilter = 'all';
    setPat2tmMode('market');
  };

  // Bootstrap when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
