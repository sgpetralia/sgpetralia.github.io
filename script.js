/**
 * Sergio G. Petralia - Academic Website Logic
 * - Design Style Switcher (Editorial, Barron, LaTeX)
 * - Light / Dark Mode Toggle
 * - Publication Category Filter
 * - BibTeX Citation Database & Clipboard Copy
 */

// BibTeX Database
const BIBTEX_ENTRIES = {
  petralia2026science: `@article{petralia2026integration,
  title={The integration tax of artificial intelligence in science and technology},
  author={Petralia, Sergio Gabriel},
  journal={Manuscript under review at Science},
  year={2026}
}`,

  kemeny2026early: `@article{kemeny2026early,
  title={A new method for the early detection of important inventions},
  author={Kemeny, Tom and Petralia, Sergio and Storper, Michael},
  journal={Research Policy (Revise and Resubmit)},
  year={2026},
  doi={10.2139/ssrn.6315228}
}`,

  petralia2025disclosure: `@article{petralia2025actionable,
  title={Actionable Disclosure in Patents: How Open Code Reduces Spatial Barriers to Knowledge Diffusion},
  author={Petralia, Sergio and Boschma, Ron},
  journal={Under review at Research Policy},
  year={2025},
  doi={10.2139/ssrn.7090442}
}`,

  petralia2026clearpat: `@article{petralia2026clearpat,
  title={CLEARPAT: AI-curated full historical USPTO patent information for research, 1790--1975},
  author={Petralia, Sergio and Kemeny, Tom and Storper, Michael and Hellinga, Zenne and Vroom, Marte},
  journal={Nature Scientific Data (Revise and Resubmit)},
  year={2026}
}`,

  abbasiharofteh2026concordance: `@article{abbasiharofteh2026concordance,
  title={A concordance between patent and trademark classes to link technologies to markets},
  author={Abbasiharofteh, Milad and Castaldi, Carolina and Petralia, Sergio},
  journal={Nature Scientific Data},
  volume={13},
  pages={1190},
  year={2026},
  doi={10.1038/s41597-026-07422-w}
}`,

  petralia2025jebo: `@article{petralia2025open,
  title={Open source software as digital platforms to innovate},
  author={Petralia, Sergio},
  journal={Journal of Economic Behavior & Organization},
  volume={237},
  pages={107109},
  year={2025},
  doi={10.1016/j.jebo.2025.107109}
}`,

  castaldi2025green: `@article{castaldi2025green,
  title={European regions transitioning to green markets: The role of related capabilities and public procurement policies},
  author={Castaldi, Carolina and Abbasiharofteh, Milad and Petralia, Sergio},
  journal={Research Policy},
  volume={55},
  number={2},
  pages={105374},
  year={2026},
  doi={10.1016/j.respol.2025.105374}
}`,

  balland2020nature: `@article{balland2020complex,
  title={Complex economic activities concentrate in large cities},
  author={Balland, Pierre-Alexandre and Jara-Figueroa, Cristian and Petralia, Sergio Gabriel and Steijn, Mathijs P and Rigby, David L and Hidalgo, Cesar A},
  journal={Nature Human Behaviour},
  volume={4},
  number={3},
  pages={248--254},
  year={2020},
  doi={10.1038/s41562-019-0803-3}
}`,

  petralia2020rp: `@article{petralia2020mapping,
  title={Mapping general purpose technologies with patent data},
  author={Petralia, Sergio},
  journal={Research Policy},
  volume={49},
  number={7},
  pages={104013},
  year={2020},
  doi={10.1016/j.respol.2020.104013}
}`,

  petralia2021ereh: `@article{petralia2021gpts,
  title={GPTs and growth: evidence on the technological adoption of electrical and electronic technologies in the 1920s},
  author={Petralia, Sergio},
  journal={European Review of Economic History},
  volume={25},
  number={3},
  pages={571--608},
  year={2021},
  doi={10.1093/erehj/heaa022}
}`,

  kemeny2022disruptive: `@article{kemeny2022disruptive,
  title={Disruptive innovation and spatial inequality},
  author={Kemeny, Tom and Petralia, Sergio and Storper, Michael},
  journal={Regional Studies},
  volume={56},
  number={8},
  pages={1259--1273},
  year={2022},
  doi={10.1080/00343404.2022.2076824}
}`,

  bruno2021jibs: `@article{bruno2021multinationals,
  title={Multinationals, innovation, and institutional context: IPR protection and distance effects},
  author={Bruno, Randolph Luca and Crescenzi, Riccardo and Estrin, Saul and Petralia, Sergio},
  journal={Journal of International Business Studies},
  volume={52},
  number={8},
  pages={1478--1500},
  year={2021},
  doi={10.1057/s41267-021-00452-z}
}`,

  diodato2021migration: `@article{diodato2021migration,
  title={Migration and invention in the Age of Mass Migration},
  author={Diodato, Dario and Morrison, Andrea and Petralia, Sergio},
  journal={Journal of Economic Geography},
  volume={22},
  number={5},
  pages={1013--1041},
  year={2021},
  doi={10.1093/jeg/lbab032}
}`,

  petralia2017ladder: `@article{petralia2017climbing,
  title={Climbing the ladder of technological development},
  author={Petralia, Sergio and Balland, Pierre-Alexandre and Morrison, Andrea},
  journal={Research Policy},
  volume={46},
  number={5},
  pages={956--969},
  year={2017},
  doi={10.1016/j.respol.2017.03.012}
}`,

  petralia2016histpat: `@article{petralia2016unveiling,
  title={Unveiling the geography of historical patents in the United States from 1836 to 1975},
  author={Petralia, Sergio and Balland, Pierre-Alexandre and Rigby, David L},
  journal={Nature Scientific Data},
  volume={3},
  pages={160074},
  year={2016},
  doi={10.1038/sdata.2016.74}
}`,

  petralia2026chatgpt: `@article{petralia2026chatgpt,
  title={Artificial Intelligence and Developer Productivity: Evidence from ChatGPT Outages},
  author={Petralia, Sergio Gabriel and Salandra, Rosamaria and Zou, Ning},
  journal={Working Paper, Utrecht University & University of Bath},
  year={2026}
}`,

  kemeny2026coupling: `@article{kemeny2026coupling,
  title={The Great Coupling of Scientific Discovery and Invention},
  author={Kemeny, Tom and Petralia, Sergio and Storper, Michael},
  journal={Working Paper, University of Toronto / Utrecht / LSE},
  year={2026}
}`
};

// 1. Style Switcher
function switchStyle(styleName) {
  document.documentElement.setAttribute('data-style', styleName);
  localStorage.setItem('academic_style', styleName);
}

// 2. Theme Toggle (Light / Dark)
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('academic_theme', newTheme);
  updateThemeButton(newTheme);
}

function updateThemeButton(theme) {
  const icon = document.getElementById('theme-icon');
  const text = document.getElementById('theme-text');
  const btn = document.getElementById('theme-toggle');
  if (icon) {
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
  if (text) {
    text.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
  }
  if (btn) {
    btn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
  }
}

// 3. Publication Filtering
function filterPubs(category, btnElement) {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(b => b.classList.remove('active'));
  btnElement.classList.add('active');

  const pubItems = document.querySelectorAll('.pub-item');
  pubItems.forEach(item => {
    const cats = item.getAttribute('data-category').split(' ');
    if (category === 'all' || cats.includes(category)) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

// 4. BibTeX Modal and Copy
function showBibtex(key) {
  const bibtex = BIBTEX_ENTRIES[key] || '% BibTeX entry not found';
  document.getElementById('bibtex-code').textContent = bibtex;
  document.getElementById('modal-paper-title').textContent = `BibTeX: ${key}`;
  document.getElementById('copy-status').textContent = '';
  document.getElementById('bibtex-modal').classList.add('open');
}

function closeBibtex(event) {
  if (event && event.target !== event.currentTarget && !event.target.classList.contains('modal-close')) {
    return;
  }
  document.getElementById('bibtex-modal').classList.remove('open');
}

function copyBibtex() {
  const code = document.getElementById('bibtex-code').textContent;
  navigator.clipboard.writeText(code).then(() => {
    const status = document.getElementById('copy-status');
    status.textContent = 'Copied to clipboard!';
    setTimeout(() => {
      status.textContent = '';
    }, 2500);
  }).catch(err => {
    console.error('Failed to copy', err);
  });
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeBibtex();
  }
});

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
  // If running in standalone full-window page, initialize ClearPat immediately
  if (document.body && document.body.classList.contains('standalone-explorer-page')) {
    initClearpatExplorer();
  }
  // Restore Style
  const savedStyle = localStorage.getItem('academic_style') || 'editorial';
  document.documentElement.setAttribute('data-style', savedStyle);
  const select = document.getElementById('style-select');
  if (select) select.value = savedStyle;

  // Restore Theme
  const savedTheme = localStorage.getItem('academic_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeButton(savedTheme);

  // Set Year
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

/* ==========================================================================
   CLEARPAT INTERACTIVE MAP & CITATION FLOW CONTROLLER
   ========================================================================== */

const STATE_NAMES = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia',
  FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois',
  IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana',
  ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota',
  MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada',
  NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York',
  NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon',
  PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota',
  TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia',
  WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming'
};

const ERA_DESCRIPTIONS = {
  '1790s': 'Early Republic: Patent Act of 1790, Potash, Milling & Agriculture',
  '1800s': 'Early Industrialization: Watermills, Textiles & Steamboat Origins',
  '1810s': 'Domestic Manufacturing Expansion & War of 1812 Metallurgical Surge',
  '1820s': 'Canal Era & Transportation Boom: Erie Canal & Mechanical Engineering',
  '1830s': 'Patent Act of 1836: Modern Examination System & Steam Power Surge',
  '1840s': 'Early Industrial: Telegraph, Steam & Agricultural Implements',
  '1850s': 'Railroad Boom & Mechanical Inventions',
  '1860s': 'Civil War Era Metallurgy & Machinery Expansion',
  '1870s': 'Gilded Age: Telephone & Dynamo Breakthroughs',
  '1880s': 'Electric Lighting, Power & Chemical Innovations',
  '1890s': 'Internal Combustion & Early Automotive Wave',
  '1900s': 'Flight, Corporate R&D Laboratories & Telephony',
  '1910s': 'Industrial Assembly Lines & Mass Production',
  '1920s': 'General Purpose Electrification & Consumer Durables',
  '1930s': 'Materials Science, Radio & Synthetic Fibers',
  '1940s': 'WWII Technologies, Early Radar & Computing Foundations',
  '1950s': 'Post-War Boom, Transistors & Aerospace Innovation',
  '1960s': 'Integrated Circuits & Space Exploration Era',
  '1970s': 'Microprocessors & Early Computing Transition'
};

const ERA_INSIGHTS = {
  '1790s': 'The US patent system began on April 10, 1790 under George Washington, with early patents clustered in Pennsylvania, Massachusetts, and Connecticut.',
  '1800s': 'Early American manufacturing emerged along New England rivers, with pioneering patents in textile spinning, steam, and clockmaking.',
  '1810s': 'The War of 1812 stimulated domestic manufacturing and metallurgy, with New York emerging as the primary national patenting hub.',
  '1820s': 'The construction of the Erie Canal and regional waterways accelerated transportation and mechanical tool patenting across the Northeast.',
  '1830s': 'The landmark Patent Act of 1836 established modern patent numbering and professional examination, triggering sustained innovation growth.',
  '1840s': 'Invention was concentrated heavily in the Northeast (New York, Massachusetts, Pennsylvania), focusing on early textile, agricultural, and telegraph machinery.',
  '1850s': 'Western migration and railroad construction spurred patenting across Ohio and Illinois, expanding mechanical manufacturing beyond the Eastern seaboard.',
  '1860s': 'War-related logistics and metalworking accelerated standardization. New York alone represented over a third of all national patents.',
  '1870s': 'The emergence of early electrical and telecommunication patents marked the transition to modern technological systems.',
  '1880s': 'Edison and contemporaries established organized invention factories, triggering massive patent growth in electricity and lighting.',
  '1890s': 'The Midwest cemented its place as a mechanical hub, with Chicago and Cleveland emerging as national centers of patent production.',
  '1900s': 'Corporate research laboratories (GE, DuPont) began filing systematic patent portfolios across chemical and electrical domains.',
  '1910s': 'Automotive innovation concentrated intensely in Detroit (Wayne County, MI), reshaping Midwestern industrial geography.',
  '1920s': 'Electrification transformed factories nationwide. The 1920s experienced a massive innovation wave analyzed in Dr. Petralia’s EREH research.',
  '1930s': 'Despite economic depression, chemical and communications patenting remained resilient, preparing the postwar technology base.',
  '1940s': 'Federal wartime research contracts catalyzed synthetic chemistry, electronics, and aerospace across California and the East Coast.',
  '1950s': 'The rise of California as an innovation powerhouse began, challenging historical New York and Great Lakes dominance.',
  '1960s': 'Early semiconductor clusters in Santa Clara County (Silicon Valley) and Boston Route 128 initiated the modern digital era.',
  '1970s': 'Microprocessors and software began appearing in patent records, laying the groundwork for the modern digital knowledge economy.'
};

let isClearpatModalOpen = false;
let currentExplorerMode = 'intensity'; // 'intensity' | 'citations' | 'inventors'
let currentDecadeIndex = 13; // 1920s (index 13 of 19 decades from 1790s to 1970s)
let currentNetworkDecadeIndex = 9; // 1920s (index 9 of NETWORK_DECADES: Pre-1836, 1840s to 1970s)
const NETWORK_DECADES = ['Pre-1836', '1840s', '1850s', '1860s', '1870s', '1880s', '1890s', '1900s', '1910s', '1920s', '1930s', '1940s', '1950s', '1960s', '1970s'];
let isPlaying = false;
let playInterval = null;
let selectedCitationState = 'CA';
let citationDirection = 'outflow'; // 'outflow' | 'inflow'
let currentCitationEra = 'All';
let currentCitationSubtab = 'interstate';
let currentEntityCategory = 'inventors'; // 'inventors' | 'corporations'
let isMapInitialized = false;

// 1. Open / Close Modal
function openClearpatModal() {
  const modal = document.getElementById('clearpat-modal');
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  isClearpatModalOpen = true;

  if (!isMapInitialized) {
    initClearpatExplorer();
  } else {
    // Re-render current mode
    setExplorerMode(currentExplorerMode);
  }
}

function closeClearpatModal(event) {
  if (event && event.target !== event.currentTarget && !event.target.classList.contains('btn-close-modal') && !event.target.closest('.btn-close-modal')) {
    return;
  }
  const modal = document.getElementById('clearpat-modal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
  isClearpatModalOpen = false;

  if (isPlaying) togglePlayDecades();
  onStateLeave();
}

// Global Escape listener
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (isClearpatModalOpen) closeClearpatModal();
  }
});

// 2. Initialize SVG Map
function initClearpatExplorer() {
  if (typeof CLEARPAT_DATA === 'undefined') {
    console.warn('CLEARPAT_DATA is not available.');
    return;
  }

  const statesGroup = document.getElementById('states-group');
  if (!statesGroup) return;

  statesGroup.innerHTML = '';

  // Render 50 SVG state paths
  for (const [code, d] of Object.entries(CLEARPAT_DATA.svg_paths)) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('id', `state-${code}`);
    path.setAttribute('data-code', code);
    path.setAttribute('class', 'state-path');
    path.setAttribute('d', d);

    path.addEventListener('mouseenter', (e) => onStateHover(code, e));
    path.addEventListener('mousemove', (e) => onStateMove(e));
    path.addEventListener('mouseleave', () => onStateLeave());
    path.addEventListener('click', () => onStateClick(code));

    statesGroup.appendChild(path);
  }

  // Populate focus state dropdown
  const select = document.getElementById('flow-state-select');
  if (select) {
    select.innerHTML = '';
    const sortedStates = Object.keys(STATE_NAMES).sort((a, b) => STATE_NAMES[a].localeCompare(STATE_NAMES[b]));
    sortedStates.forEach(code => {
      const opt = document.createElement('option');
      opt.value = code;
      opt.textContent = `${STATE_NAMES[code]} (${code})`;
      if (code === selectedCitationState) opt.selected = true;
      select.appendChild(opt);
    });
  }

  isMapInitialized = true;
  setExplorerMode('intensity');
}

// 3. Mode Switching: 'intensity' | 'citations' | 'networks'
function setExplorerMode(mode) {
  currentExplorerMode = mode;

  const tabIntensity = document.getElementById('tab-intensity');
  const tabCitations = document.getElementById('tab-citations');
  const tabNetworks = document.getElementById('tab-networks');

  const intensityControls = document.getElementById('intensity-controls');
  const citationsControls = document.getElementById('citations-controls');
  const networksControls = document.getElementById('networks-controls');

  const stage = document.getElementById('modal-stage');
  const sidebar = document.getElementById('explorer-sidebar');
  const sidebarIntensity = document.getElementById('sidebar-intensity-view');
  const sidebarNetwork = document.getElementById('sidebar-network-view');
  const sidebarCitation = document.getElementById('sidebar-citation-view');

  const usMap = document.getElementById('us-patent-map');
  const netSvg = document.getElementById('network-graph-svg');
  const mapLegend = document.querySelector('.map-legend');
  const citationBottomStrip = document.getElementById('citation-bottom-strip');

  // Reset tab active states
  [tabIntensity, tabCitations, tabNetworks].forEach(t => t && t.classList.remove('active'));
  [intensityControls, citationsControls, networksControls].forEach(c => c && (c.style.display = 'none'));
  [sidebarIntensity, sidebarNetwork, sidebarCitation].forEach(s => s && (s.style.display = 'none'));

  if (mode === 'intensity') {
    tabIntensity.classList.add('active');
    intensityControls.style.display = 'flex';
    sidebarIntensity.style.display = 'block';
    if (sidebar) sidebar.style.display = 'flex';
    if (mapLegend) mapLegend.style.display = 'flex';
    if (citationBottomStrip) citationBottomStrip.style.display = 'none';

    if (usMap) usMap.style.display = 'block';
    if (netSvg) netSvg.style.display = 'none';

    stage.className = 'modal-exp-stage mode-intensity';
    clearFlowArcs();
    renderCurrentDecade();
  } 
  else if (mode === 'citations') {
    tabCitations.classList.add('active');
    citationsControls.style.display = 'block';
    if (sidebar) sidebar.style.display = 'flex';
    if (sidebarCitation) sidebarCitation.style.display = 'block';
    if (mapLegend) mapLegend.style.display = 'none';
    if (citationBottomStrip) citationBottomStrip.style.display = 'block';

    if (usMap) usMap.style.display = 'block';
    if (netSvg) netSvg.style.display = 'none';

    stage.className = 'modal-exp-stage mode-citations';

    if (isPlaying) togglePlayDecades();
    renderCitationFlows();
  } 
  else if (mode === 'networks') {
    tabNetworks.classList.add('active');
    networksControls.style.display = 'flex';
    sidebarNetwork.style.display = 'block';
    if (sidebar) sidebar.style.display = 'flex';
    if (mapLegend) mapLegend.style.display = 'none';
    if (citationBottomStrip) citationBottomStrip.style.display = 'none';

    

    if (usMap) usMap.style.display = 'none';
    if (netSvg) netSvg.style.display = 'block';

    stage.className = 'modal-exp-stage mode-inventors';

    if (isPlaying) togglePlayDecades();
    clearFlowArcs();
    renderFirmTiles();
    renderNetworkGraph();
  }
}

// 4. Patent Intensity Mode Logic
function renderCurrentDecade() {
  if (!CLEARPAT_DATA) return;
  const decade = CLEARPAT_DATA.decades[currentDecadeIndex];
  const patentCounts = CLEARPAT_DATA.patents_by_decade[decade] || {};
  const totalInDecade = CLEARPAT_DATA.decades_totals[decade] || 0;
  const topInfo = CLEARPAT_DATA.decades_top_state[decade] || {};

  // Labels
  const dl = document.getElementById('decade-label');
  if (dl) dl.textContent = decade;
  const ed = document.getElementById('era-description');
  if (ed) ed.textContent = ERA_DESCRIPTIONS[decade] || '';
  document.getElementById('kpi-total').textContent = totalInDecade.toLocaleString();
  document.getElementById('sidebar-decade').textContent = decade;
  
  const topEl = document.getElementById('kpi-top-state');
  const shareEl = document.getElementById('kpi-top-share');
  if (topEl) {
    const topStateName = STATE_NAMES[topInfo.state] || topInfo.state;
    topEl.textContent = topStateName;
  }
  if (shareEl) {
    const share = totalInDecade > 0 ? ((topInfo.count / totalInDecade) * 100).toFixed(1) : 0;
    shareEl.textContent = `${topInfo.count.toLocaleString()} (${share}%)`;
  }

  // Color scaling
  let maxCount = 1;
  for (const c of Object.values(patentCounts)) {
    if (c > maxCount) maxCount = c;
  }

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.querySelectorAll('.state-path').forEach(path => {
    const code = path.getAttribute('data-code');
    const count = patentCounts[code] || 0;
    path.classList.remove('state-selected', 'state-partner');

    if (count === 0) {
      path.style.fill = isDark ? '#1e293b' : '#f1f5f9';
    } else {
      const ratio = Math.pow(count / maxCount, 0.45);
      if (isDark) {
        path.style.fill = `rgba(59, 130, 246, ${Math.max(0.18, ratio)})`;
      } else {
        path.style.fill = interpolateColor('#bfdbfe', '#1e3a8a', ratio);
      }
    }
  });

  renderDecadeLeaderboard(patentCounts, totalInDecade);
}

function interpolateColor(color1, color2, factor) {
  const c1 = [191, 219, 254]; // #bfdbfe
  const c2 = [30, 58, 138];   // #1e3a8a
  const r = Math.round(c1[0] + factor * (c2[0] - c1[0]));
  const g = Math.round(c1[1] + factor * (c2[1] - c1[1]));
  const b = Math.round(c1[2] + factor * (c2[2] - c1[2]));
  return `rgb(${r}, ${g}, ${b})`;
}

function renderDecadeLeaderboard(counts, total) {
  const listEl = document.getElementById('top-states-list');
  if (!listEl) return;

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  listEl.innerHTML = '';

  sorted.forEach(([code, cnt], idx) => {
    const share = total > 0 ? ((cnt / total) * 100).toFixed(1) : 0;
    const row = document.createElement('div');
    row.className = 'rank-row';
    row.onclick = () => {
      // Highlight state on intensity map
      document.querySelectorAll('.state-path').forEach(p => p.classList.remove('state-selected'));
      const el = document.getElementById(`state-${code}`);
      if (el) el.classList.add('state-selected');
    };
    row.innerHTML = `
      <div class="rank-left">
        <span class="rank-num">#${idx + 1}</span>
        <span class="rank-name">${STATE_NAMES[code] || code}</span>
      </div>
      <div class="rank-val">${cnt.toLocaleString()} <span style="font-size:0.72rem;color:var(--text-muted);font-weight:normal;">(${share}%)</span></div>
    `;
    listEl.appendChild(row);
  });
}

function onDecadeSlider(val) {
  currentDecadeIndex = parseInt(val, 10);
  renderCurrentDecade();
}

function togglePlayDecades() {
  const icon = document.getElementById('play-icon');
  const text = document.getElementById('play-text');

  if (isPlaying) {
    clearInterval(playInterval);
    isPlaying = false;
    if (icon) icon.textContent = '▶';
    if (text) text.textContent = 'Play Timeline';
  } else {
    isPlaying = true;
    if (icon) icon.textContent = '⏸';
    if (text) text.textContent = 'Pause';

    playInterval = setInterval(() => {
      currentDecadeIndex = (currentDecadeIndex + 1) % CLEARPAT_DATA.decades.length;
      const slider = document.getElementById('decade-slider');
      if (slider) slider.value = currentDecadeIndex;
      renderCurrentDecade();
    }, 1400);
  }
}

// Country flag mapping for foreign citations
const COUNTRY_FLAGS = {
  'Great Britain': '🇬🇧', 'United Kingdom': '🇬🇧', 'UK': '🇬🇧', 'England': '🇬🇧', 'English': '🇬🇧', 'GB': '🇬🇧', 'Brit.': '🇬🇧', 'Br.': '🇬🇧', 'Br': '🇬🇧', 'Britain': '🇬🇧', 'British Letters Patent': '🇬🇧', 'British Pat.': '🇬🇧', 'British Patent': '🇬🇧', 'British Patent No.': '🇬🇧', 'British Patent Office': '🇬🇧', 'British Patent-Office Reports': '🇬🇧', 'Great Britain and Ireland': '🇬🇧', 'United Kingdom of Great Britain and Ireland': '🇬🇧', "Brown's English patent": '🇬🇧', 'English Patent': '🇬🇧', 'English Patent No.': '🇬🇧', 'English Patents': '🇬🇧', 'English patent of John Bethel': '🇬🇧', 'English patent of T. A. Kinder': '🇬🇧', 'English patent of William Clark': '🇬🇧', 'English patent to Keighley and Netherwood': '🇬🇧', 'English patent to Wilson & Son': '🇬🇧', 'Gauntlet English Patent': '🇬🇧',
  'Germany': '🇩🇪', 'Ger.': '🇩🇪', 'German Patent': '🇩🇪', 'D. R. P.': '🇩🇪', 'Berlin': '🇩🇪', 'Bavaria': '🇩🇪',
  'France': '🇫🇷', 'French Patent': '🇫🇷', 'FR': '🇫🇷', 'Lyon': '🇫🇷',
  'Canada': '🇨🇦', 'Can.': '🇨🇦', 'CA': '🇨🇦',
  'Switzerland': '🇨🇭',
  'Italy': '🇮🇹',
  'Japan': '🇯🇵', 'Empire of Japan': '🇯🇵',
  'Sweden': '🇸🇪',
  'Belgium': '🇧🇪',
  'Australia': '🇦🇺', 'Commonwealth of Australia': '🇦🇺', 'Australia (1931)': '🇦🇺', 'New South Wales': '🇦🇺', 'Victoria': '🇦🇺',
  'Austria': '🇦🇹', 'Austria-Hungary': '🇦🇹',
  'Netherlands': '🇳🇱', 'Holland': '🇳🇱', 'The Netherlands': '🇳🇱',
  'Denmark': '🇩🇰',
  'Norway': '🇳🇴',
  'Russia': '🇷🇺',
  'Spain': '🇪🇸',
  'Mexico': '🇲🇽',
  'New Zealand': '🇳🇿',
  'South Africa': '🇿🇦', 'Natal': '🇿🇦', 'Cape Colony': '🇿🇦',
  'Hungary': '🇭🇺',
  'India': '🇮🇳',
  'Brazil': '🇧🇷',
  'Luxembourg': '🇱🇺',
  'Turkey': '🇹🇷',
  'Venezuela': '🇻🇪',
  'Hawaii': '🇺🇸'
};

function getCountryDisplay(rawCountry) {
  if (!rawCountry) return { flag: '🌐', name: 'Unknown' };
  const c = rawCountry.trim();
  const flag = COUNTRY_FLAGS[c] || '🌐';
  let name = c;
  if (['British Letters Patent', 'British Pat.', 'British Patent', 'British Patent No.', 'British Patent Office', 'British Patent-Office Reports', 'Brit.', 'Br.', 'Br', 'Britain', 'English', 'English Patent', 'English Patent No.', 'English Patents', 'GB', 'Great Britain and Ireland', 'United Kingdom of Great Britain and Ireland'].includes(c) || c.startsWith('English patent') || c.startsWith('British patent') || c.includes('English patent')) {
    name = 'Great Britain';
  } else if (['German Patent', 'Ger.', 'D. R. P.', 'Berlin', 'Bavaria'].includes(c)) {
    name = 'Germany';
  } else if (['French Patent', 'FR', 'Lyon'].includes(c)) {
    name = 'France';
  } else if (['Can.', 'CA'].includes(c)) {
    name = 'Canada';
  } else if (['Holland', 'The Netherlands'].includes(c)) {
    name = 'Netherlands';
  } else if (['Commonwealth of Australia', 'Australia (1931)', 'New South Wales', 'Victoria'].includes(c)) {
    name = 'Australia';
  } else if (['Austria-Hungary'].includes(c)) {
    name = 'Austria-Hungary';
  } else if (['Empire of Japan'].includes(c)) {
    name = 'Japan';
  } else if (['Cape Colony', 'Natal'].includes(c)) {
    name = 'South Africa';
  }
  return { flag, name };
}

// 5. Citation Flows Mode Logic (Wide Map, Interactive Arcs, Foreign & Science Subtabs)
function setCitationEra(era, btn) {
  currentCitationEra = (era === 'All' || era === 'All Eras') ? 'All' : era;
  const label = document.getElementById('cit-era-label');
  if (label) label.textContent = currentCitationEra;
  document.querySelectorAll('.era-chip').forEach(c => c.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderCitationFlows();
}

function setCitationDirection(dir) {
  citationDirection = dir;
  const bOut = document.getElementById('btn-dir-out');
  const bIn = document.getElementById('btn-dir-in');
  if (bOut) bOut.classList.toggle('active', dir === 'outflow');
  if (bIn) bIn.classList.toggle('active', dir === 'inflow');
  renderCitationFlows();
}

function onStateSelectChange(code) {
  selectedCitationState = code;
  renderCitationFlows();
}

function clearFlowArcs() {
  const flowsGroup = document.getElementById('flows-group');
  const nodesGroup = document.getElementById('nodes-group');
  if (flowsGroup) flowsGroup.innerHTML = '';
  if (nodesGroup) nodesGroup.innerHTML = '';
}

function switchCitationSubtab(tab) {
  currentCitationSubtab = tab;
  ['interstate', 'foreign'].forEach(t => {
    const btn = document.getElementById(`cit-subtab-${t}`);
    const panel = document.getElementById(`cit-panel-${t}`);
    if (btn) btn.classList.toggle('active', t === tab);
    if (panel) panel.style.display = (t === tab) ? 'block' : 'none';
  });
  renderCitationSidebar();
}

function renderCitationFlows() {
  clearFlowArcs();
  const flowsGroup = document.getElementById('flows-group');
  const nodesGroup = document.getElementById('nodes-group');
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  const baseState = selectedCitationState || 'CA';
  const baseName = STATE_NAMES[baseState] || baseState;
  const isOut = citationDirection === 'outflow';

  // Synchronize dropdown
  const select = document.getElementById('flow-state-select');
  if (select && select.value !== baseState) select.value = baseState;

  // Header in bottom strip - clean bullet symbol instead of literal entity
  const stripTitle = document.getElementById('citation-strip-title');
  if (stripTitle) {
    stripTitle.textContent = `${baseName} (${baseState}) • ${currentCitationEra}:`;
  }
  const stripSub = document.getElementById('citation-strip-sub');
  if (stripSub) {
    stripSub.textContent = isOut
      ? `Top states from which ${baseName} inventors borrowed citations:`
      : `Top states citing ${baseName} historical patents:`;
  }

  // Get data for this era
  const eraData = (CLEARPAT_DATA.citation_flows_by_era && (CLEARPAT_DATA.citation_flows_by_era[currentCitationEra] || CLEARPAT_DATA.citation_flows_by_era['All Eras'] || CLEARPAT_DATA.citation_flows_by_era['All']))
    || (CLEARPAT_DATA.citation_flows_by_era && CLEARPAT_DATA.citation_flows_by_era['All Eras'])
    || (CLEARPAT_DATA.citation_flows_by_era && CLEARPAT_DATA.citation_flows_by_era['All Time'])
    || {};

  const stateFlows = eraData[baseState] || { outflow: [], inflow: [], outflows: [], inflows: [] };
  const partners = isOut 
    ? (stateFlows.outflows || stateFlows.outflow || [])
    : (stateFlows.inflows || stateFlows.inflow || []);

  // Reset state colors with high-contrast visible map outline
  document.querySelectorAll('.state-path').forEach(p => {
    p.classList.remove('state-selected', 'state-partner');
    p.style.fill = isDark ? '#1e293b' : '#e2e8f0';
    p.style.stroke = isDark ? '#334155' : '#cbd5e1';
    p.style.strokeWidth = '1.1';
  });

  const baseEl = document.getElementById(`state-${baseState}`);
  if (baseEl) {
    baseEl.classList.add('state-selected');
    baseEl.style.fill = '#f59e0b';
    baseEl.style.stroke = '#d97706';
    baseEl.style.strokeWidth = '2.5';
  }

  const pCodes = partners.map(p => p.target || (isOut ? p.target : p.source));
  pCodes.forEach(code => {
    const el = document.getElementById(`state-${code}`);
    if (el) {
      el.classList.add('state-partner');
      el.style.fill = isDark ? 'rgba(59, 130, 246, 0.55)' : '#93c5fd';
      el.style.stroke = '#2563eb';
      el.style.strokeWidth = '2';
    }
  });

  // Central Node
  const baseCoord = CLEARPAT_DATA.centroids[baseState];
  if (baseCoord) {
    const cCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    cCircle.setAttribute('cx', baseCoord[0]);
    cCircle.setAttribute('cy', baseCoord[1]);
    cCircle.setAttribute('r', '7');
    cCircle.setAttribute('class', 'flow-node-center');
    nodesGroup.appendChild(cCircle);
  }

  // Draw curved Arcs
  partners.forEach(item => {
    const otherCode = item.target || (isOut ? item.target : item.source);
    const otherCoord = CLEARPAT_DATA.centroids[otherCode];
    if (!baseCoord || !otherCoord) return;

    const x1 = baseCoord[0];
    const y1 = baseCoord[1];
    const x2 = otherCoord[0];
    const y2 = otherCoord[1];

    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2 - Math.min(65, dist * 0.22);

    const pathD = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;

    const arc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    arc.setAttribute('d', pathD);
    arc.setAttribute('class', 'citation-arc');
    arc.setAttribute('stroke', isOut ? 'url(#flow-grad)' : '#3b82f6');
    arc.setAttribute('stroke-width', Math.min(5, Math.max(1.8, Math.log10(item.count || 1) * 1.2)));
    flowsGroup.appendChild(arc);

    const tCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    tCircle.setAttribute('cx', x2);
    tCircle.setAttribute('cy', y2);
    tCircle.setAttribute('r', '4.5');
    tCircle.setAttribute('class', 'flow-node-target');
    nodesGroup.appendChild(tCircle);
  });

  // Render the Right Sidebar Card
  renderCitationSidebar();
}

function renderCitationSidebar() {
  const baseState = selectedCitationState || 'CA';
  const baseName = STATE_NAMES[baseState] || baseState;
  const isOut = citationDirection === 'outflow';

  const titleEl = document.getElementById('citation-sidebar-title');
  const badgeEl = document.getElementById('citation-sidebar-badge');
  if (titleEl) titleEl.textContent = `${baseName} (${baseState})`;
  if (badgeEl) badgeEl.textContent = currentCitationEra;

  // 1. Interstate Citations (Citing / Cited By)
  const eraData = (CLEARPAT_DATA.citation_flows_by_era && (CLEARPAT_DATA.citation_flows_by_era[currentCitationEra] || CLEARPAT_DATA.citation_flows_by_era['All'] || CLEARPAT_DATA.citation_flows_by_era['All Eras']))
    || {};

  const stateFlows = eraData[baseState] || { outflow: [], inflow: [], outflows: [], inflows: [] };
  const partners = isOut 
    ? (stateFlows.outflows || stateFlows.outflow || [])
    : (stateFlows.inflows || stateFlows.inflow || []);

  const listInter = document.getElementById('cit-interstate-list');
  if (listInter) {
    listInter.innerHTML = '';
    if (partners.length === 0) {
      listInter.innerHTML = `<div style="font-size:0.82rem;color:var(--text-muted);padding:1rem 0.5rem;text-align:center;">No interstate citations recorded for ${baseName} in ${currentCitationEra === 'All' ? '1836–1975' : currentCitationEra}.</div>`;
    } else {
      partners.forEach(item => {
        const otherCode = item.target || item.source;
        const row = document.createElement('div');
        row.className = 'rank-row';
        row.onclick = () => {
          selectedCitationState = otherCode;
          renderCitationFlows();
        };
        row.innerHTML = `<span class="rank-name">${item.name || STATE_NAMES[otherCode] || otherCode}</span><span class="rank-val">${(item.count || 0).toLocaleString()}</span>`;
        listInter.appendChild(row);
      });
    }
  }

  // 2. Foreign Citations (Per-State only; no misleading fallback to National)
  const eraForeign = (CLEARPAT_DATA.foreign_citations_by_era && (CLEARPAT_DATA.foreign_citations_by_era[currentCitationEra] || CLEARPAT_DATA.foreign_citations_by_era['All'] || CLEARPAT_DATA.foreign_citations_by_era['All Eras']))
    || {};
  const foreignList = eraForeign[baseState] || [];

  const listFor = document.getElementById('cit-foreign-list');
  if (listFor) {
    listFor.innerHTML = '';
    if (foreignList.length === 0) {
      listFor.innerHTML = `<div style="font-size:0.82rem;color:var(--text-muted);padding:1rem 0.5rem;text-align:center;">No foreign citations recorded for ${baseName} in ${currentCitationEra === 'All' ? '1836–1975' : currentCitationEra}.</div>`;
    } else {
      foreignList.forEach(item => {
        const row = document.createElement('div');
        row.className = 'rank-row';
        const display = getCountryDisplay(item.country);
        row.innerHTML = `<span class="rank-name"><span style="font-size:1.1rem;margin-right:0.45rem;vertical-align:middle;">${display.flag}</span>${display.name}</span><span class="rank-val">${(item.count || 0).toLocaleString()}</span>`;
        listFor.appendChild(row);
      });
    }
  }
}

// 6. Top Inventors & Corporations Mode Logic
function setEntityCategory(cat) {
  currentEntityCategory = cat;
  document.getElementById('btn-ent-inv').classList.toggle('active', cat === 'inventors');
  document.getElementById('btn-ent-corp').classList.toggle('active', cat === 'corporations');
  renderEntitiesView();
}

function renderEntitiesView() {
  const isInv = currentEntityCategory === 'inventors';
  document.getElementById('entity-sidebar-title').textContent = isInv
    ? 'Top 20 Historical Inventors'
    : 'Top 20 Corporate Laboratories & Assignees';

  document.getElementById('entity-sidebar-sub').textContent = isInv
    ? 'Cleaned names from patent records (1836–1975):'
    : 'Leading corporate assignees ranked by historical patent volume:';

  const items = isInv ? CLEARPAT_DATA.top_inventors_overall : CLEARPAT_DATA.top_corporations_overall;
  const listEl = document.getElementById('entity-list');
  listEl.innerHTML = '';

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  // Clear map state selections
  document.querySelectorAll('.state-path').forEach(p => {
    p.classList.remove('state-selected', 'state-partner');
    p.style.fill = isDark ? '#1e293b' : '#f1f5f9';
  });

  items.forEach((item, idx) => {
    const row = document.createElement('div');
    row.className = 'rank-row';
    const stName = STATE_NAMES[item.state] || item.state || 'US';

    row.innerHTML = `
      <div class="rank-left">
        <span class="rank-num">#${idx + 1}</span>
        <div>
          <div class="rank-name">${item.name}</div>
          <div style="font-size:0.72rem;color:var(--text-muted);">${stName} &bull; ${item.years}</div>
        </div>
      </div>
      <div class="rank-val">${item.count.toLocaleString()}</div>
    `;

    // Clicking an inventor highlights their state and shows info WITHOUT switching tabs!
    row.onclick = () => {
      document.querySelectorAll('.rank-row').forEach(r => r.classList.remove('active'));
      row.classList.add('active');

      if (item.state) {
        document.querySelectorAll('.state-path').forEach(p => p.classList.remove('state-selected'));
        const el = document.getElementById(`state-${item.state}`);
        if (el) {
          el.classList.add('state-selected');
          el.style.fill = '#f59e0b';
        }
      }

      // Show info card
      const card = document.getElementById('selected-entity-card');
      if (card) {
        card.style.display = 'block';
        document.getElementById('card-ent-name').textContent = item.name;
        document.getElementById('card-ent-desc').textContent = `${item.count.toLocaleString()} total historical utility patents granted between ${item.years}. Primary recorded location: ${stName}.`;
      }
    };

    listEl.appendChild(row);
  });
}

// 7. State Click Handler on Map
function onStateClick(code) {
  if (currentExplorerMode === 'intensity') {
    // Highlight state on intensity map
    document.querySelectorAll('.state-path').forEach(p => p.classList.remove('state-selected'));
    const el = document.getElementById(`state-${code}`);
    if (el) el.classList.add('state-selected');
  } 
  else if (currentExplorerMode === 'citations') {
    selectedCitationState = code;
    renderCitationFlows();
  } 
  else if (currentExplorerMode === 'inventors') {
    // In inventors view, clicking state shows top inventors in that state
    document.querySelectorAll('.state-path').forEach(p => p.classList.remove('state-selected'));
    const el = document.getElementById(`state-${code}`);
    if (el) el.classList.add('state-selected');

    const invs = CLEARPAT_DATA.state_inventors[code] || [];
    const corps = CLEARPAT_DATA.state_corporations[code] || [];
    const stName = STATE_NAMES[code] || code;

    const card = document.getElementById('selected-entity-card');
    if (card) {
      card.style.display = 'block';
      document.getElementById('card-ent-name').textContent = `${stName} (${code}) Pioneers`;
      let desc = '';
      if (invs.length > 0) desc += `Top Inventors: ${invs.map(i => `${i.name} (${i.count})`).join(', ')}. `;
      if (corps.length > 0) desc += `Top Corporations: ${corps.map(c => `${c.name} (${c.count})`).join(', ')}.`;
      if (!desc) desc = 'Historical patent registry entries recorded for this state.';
      document.getElementById('card-ent-desc').textContent = desc;
    }
  }
}

// 8. Tooltip Handler
function onStateHover(code, e) {
  const tooltip = document.getElementById('map-tooltip');
  if (!tooltip) return;

  const stateName = STATE_NAMES[code] || code;
  document.getElementById('tooltip-state').textContent = `${stateName} (${code})`;

  if (currentExplorerMode === 'intensity') {
    const decade = CLEARPAT_DATA.decades[currentDecadeIndex];
    const count = (CLEARPAT_DATA.patents_by_decade[decade] || {})[code] || 0;
    const total = CLEARPAT_DATA.decades_totals[decade] || 1;
    const share = ((count / total) * 100).toFixed(1);
    document.getElementById('tooltip-patents').textContent = count > 0
      ? `${count.toLocaleString()} patents in ${decade} (${share}%)`
      : `0 patents recorded in ${decade}`;
  } else if (currentExplorerMode === 'citations') {
    // Clean tooltip in citations mode: only state name
    document.getElementById('tooltip-patents').textContent = '';
  } else {
    document.getElementById('tooltip-patents').textContent = `Click to inspect state innovation leaders`;
  }

  // Top inventors & corps snippet in tooltip (dynamically updated per decade in intensity mode)
  const entitiesEl = document.getElementById('tooltip-entities');
  if (entitiesEl) {
    if (currentExplorerMode === 'citations') {
      entitiesEl.innerHTML = '';
    } else if (currentExplorerMode === 'intensity') {
      const decade = CLEARPAT_DATA.decades[currentDecadeIndex];
      const count = (CLEARPAT_DATA.patents_by_decade[decade] || {})[code] || 0;

      if (count === 0) {
        // Zero patents: strictly no inventors or assignees
        entitiesEl.innerHTML = '';
      } else {
        const invs = (CLEARPAT_DATA.state_inventors_by_decade && CLEARPAT_DATA.state_inventors_by_decade[decade])
          ? (CLEARPAT_DATA.state_inventors_by_decade[decade][code] || [])
          : [];
        const corps = (CLEARPAT_DATA.state_corporations_by_decade && CLEARPAT_DATA.state_corporations_by_decade[decade])
          ? (CLEARPAT_DATA.state_corporations_by_decade[decade][code] || [])
          : [];

        let html = '';
        if (invs.length > 0) {
          html += `<div><strong>Key Inventors:</strong> ${invs.slice(0, 2).map(i => i.name).join(', ')}</div>`;
        }
        if (corps.length > 0) {
          const yr = parseInt(decade);
          const corpLabel = yr < 1880 ? 'Top Assignees' : 'Top Organizations';
          html += `<div><strong>${corpLabel}:</strong> ${corps.slice(0, 2).map(c => c.name).join(', ')}</div>`;
        }
        entitiesEl.innerHTML = html;
      }
    } else {
      entitiesEl.innerHTML = '';
    }
  }

  tooltip.style.display = 'block';
  onStateMove(e);
}

function onStateMove(e) {
  const tooltip = document.getElementById('map-tooltip');
  if (!tooltip || tooltip.style.display === 'none') return;

  const container = document.querySelector('.map-container-wrap').getBoundingClientRect();
  const left = e.clientX - container.left + 15;
  const top = e.clientY - container.top - 35;

  tooltip.style.left = `${Math.min(container.width - 200, Math.max(10, left))}px`;
  tooltip.style.top = `${Math.max(10, top)}px`;
}

function onStateLeave() {
  const tooltip = document.getElementById('map-tooltip');
  if (tooltip) tooltip.style.display = 'none';
}



/* ==========================================================================
   NETWORK VISUALIZATION ENGINE (OPTIONS 1 & 3)
   ========================================================================== */

// ==========================================
// 8. Innovation Networks: Corporate Labs & Intra-Firm Co-Inventorship
// ==========================================
let selectedFirmIndex = 0; // Default to first firm (e.g. General Electric)
let activeNetworkNodeId = null;

function onNetDecadeSlider(val) {
  currentNetworkDecadeIndex = parseInt(val, 10);
  const decade = NETWORK_DECADES[currentNetworkDecadeIndex] || '1920s';
  const lbl = document.getElementById('net-decade-label');
  if (lbl) lbl.textContent = decade;

  const ticks = document.querySelectorAll('.net-decade-ticks span');
  ticks.forEach((t, i) => {
    t.classList.toggle('active-tick', i === currentNetworkDecadeIndex);
  });

  selectedFirmIndex = 0;
  activeNetworkNodeId = null;
  renderFirmTiles();
  renderNetworkGraph();
}

function getDecadeFirms() {
  if (!CLEARPAT_DATA || !CLEARPAT_DATA.firm_networks) return [];
  const decade = NETWORK_DECADES[currentNetworkDecadeIndex] || '1920s';
  return CLEARPAT_DATA.firm_networks[decade] || [];
}

function getCurrentFirm() {
  const firms = getDecadeFirms();
  if (firms.length === 0) return null;
  if (selectedFirmIndex >= firms.length) selectedFirmIndex = 0;
  return firms[selectedFirmIndex];
}

function renderFirmTiles() {
  const container = document.getElementById('firm-tiles-container');
  if (!container) return;

  const firms = getDecadeFirms();
  container.innerHTML = '';

  firms.forEach((firm, idx) => {
    const tile = document.createElement('div');
    tile.className = `firm-tile ${idx === selectedFirmIndex ? 'active' : ''}`;
    if (tile.style && tile.style.setProperty) {
      tile.style.setProperty('--tile-color', firm.color);
    } else if (tile.style) {
      tile.style['--tile-color'] = firm.color;
    }
    tile.onclick = () => selectFirm(idx);

    tile.innerHTML = `
      <div class="firm-tile-header">
        <div class="firm-tile-name" title="${firm.name}">${firm.name}</div>
        <span class="firm-tile-patents">${firm.total_patents.toLocaleString()} pat</span>
      </div>
      <div class="firm-tile-meta">
        <span>📍 ${firm.short_geo || firm.full_geo || "United States"}</span> &bull; <strong>${firm.inventor_count || (firm.nodes ? firm.nodes.length : 0)}</strong> Inventors
      </div>
    `;

    container.appendChild(tile);
  });
}

function selectFirm(idx) {
  selectedFirmIndex = idx;
  activeNetworkNodeId = null;

  document.querySelectorAll('.firm-tile').forEach((t, i) => {
    t.classList.toggle('active', i === idx);
  });

  renderNetworkGraph();
}

function renderNetworkGraph() {
  const firm = getCurrentFirm();
  if (!firm) return;

  const decade = NETWORK_DECADES[currentNetworkDecadeIndex] || '1920s';

  

  const edgesGroup = document.getElementById('net-edges-group');
  const nodesGroup = document.getElementById('net-nodes-group');
  const labelsGroup = document.getElementById('net-labels-group');

  if (!edgesGroup || !nodesGroup || !labelsGroup) return;

  edgesGroup.innerHTML = '';
  nodesGroup.innerHTML = '';
  labelsGroup.innerHTML = '';

  const nodes = firm.nodes || [];
  const edges = firm.edges || [];

  const nodeMap = {};
  nodes.forEach(n => { nodeMap[n.id] = n; });

  // 1. Draw Co-Inventorship Edges
  edges.forEach((edge, idx) => {
    const s = nodeMap[edge.source];
    const t = nodeMap[edge.target];
    if (!s || !t) return;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', s.x);
    line.setAttribute('y1', s.y);
    line.setAttribute('x2', t.x);
    line.setAttribute('y2', t.y);
    line.setAttribute('id', `net-edge-${idx}`);
    line.setAttribute('class', 'net-edge');
    line.setAttribute('data-source', edge.source);
    line.setAttribute('data-target', edge.target);

    // Thickness proportional to joint patent count
    const weight = edge.joint_patents || 1;
    const strokeWidth = Math.max(2, Math.min(6.5, Math.log10(weight + 1) * 3.6));
    line.setAttribute('stroke-width', strokeWidth);
    line.setAttribute('stroke', firm.color);

    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = `${s.name} & ${t.name}: ${weight} co-authored patents at ${firm.name}`;
    line.appendChild(title);

    edgesGroup.appendChild(line);
  });

  // 2. Draw Inventor Nodes & Labels
  nodes.forEach(node => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'net-node');
    g.setAttribute('id', `net-node-${node.id}`);
    g.setAttribute('data-id', node.id);

    // Node radius scaled by patent count
    const r = Math.max(11, Math.min(23, 10 + Math.log10(node.patents + 1) * 6.5));

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', node.x);
    circle.setAttribute('cy', node.y);
    circle.setAttribute('r', r);
    circle.setAttribute('fill', firm.color);
    circle.setAttribute('stroke', '#ffffff');
    circle.setAttribute('stroke-width', 2.5);
    g.appendChild(circle);

    // Label with Name & Geo underneath
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', node.x);
    text.setAttribute('y', node.y + r + 13);
    text.setAttribute('class', 'net-label');
    text.setAttribute('id', `net-label-${node.id}`);
    text.setAttribute('style', 'text-anchor: middle;');

    // Line 1: Inventor Name
    const nameSpan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    nameSpan.setAttribute('x', node.x);
    nameSpan.setAttribute('dy', '0');
    nameSpan.setAttribute('style', 'font-size: 11px; font-weight: 700;');
    nameSpan.textContent = node.name.length > 18 ? node.name.slice(0, 16) + '...' : node.name;
    text.appendChild(nameSpan);

    // Line 2: Short Geo
    const geoSpan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    geoSpan.setAttribute('x', node.x);
    geoSpan.setAttribute('dy', '11');
    geoSpan.setAttribute('class', 'net-sublabel');
    geoSpan.textContent = node.short_geo || node.state_abbr || 'US';
    text.appendChild(geoSpan);

    labelsGroup.appendChild(text);

    // Tooltip
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = `${node.name}
📍 Entire Geo: ${node.full_geo || node.short_geo || "United States"}
Patents for ${firm.name}: ${node.patents}`;
    g.appendChild(title);

    // Hover & Click events
    g.addEventListener('mouseenter', () => highlightNetworkNode(node.id));
    g.addEventListener('mouseleave', () => resetNetworkHighlight());
    g.addEventListener('click', (e) => {
      e.stopPropagation();
      selectNetworkNode(node.id);
    });

    nodesGroup.appendChild(g);
  });

  // Display initial firm overview in sidebar
  if (!activeNetworkNodeId) {
    displayFirmOverview(firm);
  }
}

function highlightNetworkNode(nodeId) {
  const firm = getCurrentFirm();
  if (!firm) return;

  const neighbors = new Set([nodeId]);
  const activeEdgeIndices = new Set();

  (firm.edges || []).forEach((edge, idx) => {
    if (edge.source === nodeId) {
      neighbors.add(edge.target);
      activeEdgeIndices.add(idx);
    } else if (edge.target === nodeId) {
      neighbors.add(edge.source);
      activeEdgeIndices.add(idx);
    }
  });

  document.querySelectorAll('.net-node').forEach(n => {
    const id = n.getAttribute('data-id');
    const isConnected = neighbors.has(id);
    n.classList.toggle('dimmed', !isConnected);
    n.classList.toggle('active', id === nodeId);
  });

  document.querySelectorAll('.net-label').forEach(lbl => {
    const id = lbl.getAttribute('id')?.replace('net-label-', '');
    if (id) {
      lbl.classList.toggle('dimmed', !neighbors.has(id));
    }
  });

  document.querySelectorAll('.net-edge').forEach((line, idx) => {
    const isActive = activeEdgeIndices.has(idx);
    line.classList.toggle('active', isActive);
    line.classList.toggle('dimmed', !isActive);
  });
}

function resetNetworkHighlight() {
  if (activeNetworkNodeId) {
    highlightNetworkNode(activeNetworkNodeId);
    return;
  }
  document.querySelectorAll('.net-node').forEach(n => n.classList.remove('dimmed', 'active'));
  document.querySelectorAll('.net-label').forEach(l => l.classList.remove('dimmed'));
  document.querySelectorAll('.net-edge').forEach(e => e.classList.remove('dimmed', 'active'));
}

function selectNetworkNode(nodeId) {
  activeNetworkNodeId = nodeId;
  highlightNetworkNode(nodeId);

  const firm = getCurrentFirm();
  if (!firm) return;

  const node = (firm.nodes || []).find(n => n.id === nodeId);
  if (!node) return;

  const card = document.getElementById('network-active-card');
  if (!card) return;

  const decade = NETWORK_DECADES[currentNetworkDecadeIndex] || '1920s';

  const titleHeading = document.getElementById('network-sidebar-title');
  const resetBtn = document.getElementById('btn-reset-focus');
  const badgeEl = document.getElementById('net-card-type');
  const titleEl = document.getElementById('net-card-title');
  const subEl = document.getElementById('net-card-subtitle');
  const metricsEl = document.getElementById('net-card-metrics');
  const connHeaderEl = document.getElementById('net-conn-header');
  const pillsEl = document.getElementById('net-conn-list');

  if (titleHeading) titleHeading.textContent = 'Inventor';
  if (resetBtn) resetBtn.style.display = 'inline-block';

  pillsEl.innerHTML = '';

  if (badgeEl) {
    badgeEl.textContent = 'Inventor';
    badgeEl.style.display = 'inline-block';
  }
  if (titleEl) {
    titleEl.textContent = node.name;
    titleEl.style.display = 'block';
  }
  if (subEl) {
    subEl.textContent = `${firm.name} • ${node.short_geo || node.state_abbr || "US"}`;
    subEl.style.display = 'block';
  }

  // Find co-inventors connected via edges
  const connectedEdges = (firm.edges || []).filter(e => e.source === node.id || e.target === node.id);

  if (metricsEl) {
    metricsEl.style.display = 'block';
    metricsEl.innerHTML = `
      <div class="geo-info-row">
        <span style="font-size: 1rem;">📍</span>
        <div>${node.full_geo || node.short_geo || "United States"}</div>
      </div>
      <div><strong>Patents with ${firm.name}:</strong> ${node.patents.toLocaleString()} utility patents (${decade})</div>
      <div><strong>Co-Inventors:</strong> ${connectedEdges.length} collaborative partners</div>
    `;
  }

  if (connHeaderEl) {
    connHeaderEl.textContent = 'Co-Inventors:';
    connHeaderEl.style.display = 'block';
  }

  if (connectedEdges.length === 0) {
    const notice = document.createElement('div');
    notice.style.fontSize = '0.78rem';
    notice.style.color = 'var(--text-muted)';
    notice.style.fontStyle = 'italic';
    notice.textContent = `Solo inventor at ${firm.name} (no shared patents with other top cluster inventors in ${decade}).`;
    pillsEl.appendChild(notice);
  } else {
    connectedEdges.forEach(e => {
      const partnerId = e.source === node.id ? e.target : e.source;
      const partnerNode = firm.nodes.find(n => n.id === partnerId);
      if (partnerNode) {
        const pill = document.createElement('div');
        pill.className = 'net-pill';
        pill.onclick = (ev) => {
          ev.stopPropagation();
          selectNetworkNode(partnerNode.id);
        };
        pill.innerHTML = `<strong>${partnerNode.name}</strong> <span>(${e.joint_patents} joint)</span> &bull; <small>${partnerNode.short_geo || partnerNode.state_abbr || "US"}</small>`;
        pillsEl.appendChild(pill);
      }
    });
  }
}

function displayFirmOverview(firm) {
  const card = document.getElementById('network-active-card');
  if (!card) return;

  const titleHeading = document.getElementById('network-sidebar-title');
  const resetBtn = document.getElementById('btn-reset-focus');
  const badgeEl = document.getElementById('net-card-type');
  const titleEl = document.getElementById('net-card-title');
  const subEl = document.getElementById('net-card-subtitle');
  const metricsEl = document.getElementById('net-card-metrics');
  const connHeaderEl = document.getElementById('net-conn-header');
  const pillsEl = document.getElementById('net-conn-list');

  if (titleHeading) titleHeading.textContent = 'Top Inventors';
  if (resetBtn) resetBtn.style.display = 'none';

  if (badgeEl) badgeEl.style.display = 'none';
  if (titleEl) titleEl.style.display = 'none';
  if (subEl) subEl.style.display = 'none';
  if (metricsEl) metricsEl.style.display = 'none';
  if (connHeaderEl) connHeaderEl.style.display = 'none';

  pillsEl.innerHTML = '';

  const allNodes = firm.nodes || [];
  // Show top 8 most prolific inventors in right panel to maintain clean single-page fit
  const displayNodes = allNodes.slice(0, 8);

  displayNodes.forEach(n => {
    const pill = document.createElement('div');
    pill.className = 'net-pill';
    pill.onclick = (ev) => {
      ev.stopPropagation();
      selectNetworkNode(n.id);
    };
    pill.innerHTML = `<strong>${n.name}</strong> <span>(${n.patents} pat)</span> • <small>${n.short_geo || n.state_abbr || "US"}</small>`;
    pillsEl.appendChild(pill);
  });

  if (allNodes.length > 8) {
    const moreNotice = document.createElement('div');
    moreNotice.style.fontSize = '0.74rem';
    moreNotice.style.color = 'var(--text-muted)';
    moreNotice.style.fontStyle = 'italic';
    moreNotice.style.marginTop = '0.4rem';
    moreNotice.style.width = '100%';
    moreNotice.textContent = `+ ${allNodes.length - 8} more co-inventors in network (click node to inspect)`;
    pillsEl.appendChild(moreNotice);
  }
}

function resetToFirmOverview() {
  activeNetworkNodeId = null;
  resetNetworkHighlight();
  const firm = getCurrentFirm();
  if (firm) displayFirmOverview(firm);
}

// Expand / Collapse all WIP Abstracts
function toggleAllAbstracts(open) {
  document.querySelectorAll('.wip-abstract-details').forEach(d => {
    d.open = open;
  });
}

// Toggle individual WIP card abstract
function toggleAbstract(btn) {
  const card = btn.closest('.wip-card');
  if (!card) return;
  const abstract = card.querySelector('.wip-abstract-text');
  if (!abstract) return;
  const chevron = btn.querySelector('.chevron');
  if (abstract.style.display === 'none' || !abstract.style.display) {
    abstract.style.display = 'block';
    if (chevron) chevron.textContent = '▴';
    btn.classList.add('active');
  } else {
    abstract.style.display = 'none';
    if (chevron) chevron.textContent = '▾';
    btn.classList.remove('active');
  }
}
