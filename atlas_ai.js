/**
 * ATLAS AI: The Task Atlas of Artificial Intelligence in Science & Technology
 * Two-panel Side-by-Side Layout
 * - Left Panel: Filters, Sector Selection, and Rank Controls (RCA, Exposure, Volume)
 * - Right Panel: Rich, Streamlined Task Stream with Both Original Human Document & Closest AI Exposer
 * - Patents: 10,000 clusters (USPTO)
 * - Science: 50,000 clusters (OpenAlex)
 * Developed by Dr. Sergio Gabriel Petralia (Utrecht University)
 */

(function() {
  'use strict';

  // Global State
  const state = {
    domain: 'tech', // 'tech' | 'science'
    selectedField: 'All',
    searchQuery: '',
    exposureFilter: 'all', // 'all' | 'ai_only' | 'human_only'
    sortBy: 'rca', // 'rca' | 'exposure' | 'volume' | 'alpha'
    currentPage: 1,
    pageSize: 20
  };

  function getData() {
    return window.ATLAS_AI_DATA || null;
  }

  function getDomainData() {
    const data = getData();
    if (!data) return null;
    return state.domain === 'science' ? data.science : data.tech;
  }

  function getFields() {
    const dom = getDomainData();
    return dom ? dom.fields : [];
  }

  function getClusters() {
    const dom = getDomainData();
    return dom ? dom.clusters : [];
  }

  function formatNumber(num) {
    if (num === null || num === undefined) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toLocaleString();
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Filter & Rank Logic
  function getFilteredAndRankedClusters() {
    const clusters = getClusters();
    if (!clusters || clusters.length === 0) return [];

    let list = clusters;

    // 1. Sector / Field Filter
    if (state.selectedField && state.selectedField !== 'All') {
      list = list.filter(c => c.f === state.selectedField);
    }

    // 2. Exposure Filter
    if (state.exposureFilter === 'ai_only') {
      list = list.filter(c => c.na > 0 && c.sim > 0);
    } else if (state.exposureFilter === 'human_only') {
      list = list.filter(c => c.na === 0 || !c.closest);
    }

    // 3. Search Filter
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase().trim();
      list = list.filter(c => 
        (c.l && c.l.toLowerCase().includes(q)) ||
        (c.c && c.c.toLowerCase().includes(q)) ||
        (c.orig && c.orig.task && c.orig.task.toLowerCase().includes(q)) ||
        (c.orig && c.orig.doc_id && c.orig.doc_id.toLowerCase().includes(q)) ||
        (c.closest && c.closest.task && c.closest.task.toLowerCase().includes(q)) ||
        (c.closest && c.closest.doc_id && c.closest.doc_id.toLowerCase().includes(q)) ||
        (c.f && c.f.toLowerCase().includes(q))
      );
    }

    // 4. Sorting / Ranking
    list.sort((a, b) => {
      if (state.sortBy === 'rca') {
        if (b.rca !== a.rca) return b.rca - a.rca;
        return b.nh - a.nh;
      }
      if (state.sortBy === 'exposure') {
        if (b.sim !== a.sim) return b.sim - a.sim;
        return b.na - a.na;
      }
      if (state.sortBy === 'volume') {
        return b.nh - a.nh;
      }
      if (state.sortBy === 'alpha') {
        return a.c.localeCompare(b.c);
      }
      return 0;
    });

    return list;
  }

  // -------------------------------------------------------------
  // RENDER TWO-PANEL STAGE
  // -------------------------------------------------------------
  function renderAtlasStage() {
    const stage = document.getElementById('atlas-stage');
    if (!stage) return;

    const data = getData();
    if (!data) {
      stage.innerHTML = `
        <div class="atlas-loading-state">
          <div class="atlas-spinner"></div>
          <p>Loading ATLAS AI dataset...</p>
        </div>
      `;
      return;
    }

    const domData = getDomainData();
    const isTech = state.domain === 'tech';
    const fields = getFields();
    const allClusters = getClusters();
    const filtered = getFilteredAndRankedClusters();

    // Update dynamic subtitle in header
    updateHeaderSubtitle(domData ? domData.subtitle : '');

    // Top RCA & Top Exposure in current selection for Sidebar Highlights
    const currentScopeClusters = state.selectedField === 'All' 
      ? allClusters 
      : allClusters.filter(c => c.f === state.selectedField);
    
    const topRcaCluster = [...currentScopeClusters].sort((a, b) => b.rca - a.rca)[0];
    const topExposedCluster = [...currentScopeClusters]
      .filter(c => c.sim > 0)
      .sort((a, b) => b.sim - a.sim)[0];

    // Pagination
    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / state.pageSize) || 1;
    if (state.currentPage > totalPages) state.currentPage = 1;
    const startIndex = (state.currentPage - 1) * state.pageSize;
    const pageItems = filtered.slice(startIndex, startIndex + state.pageSize);

    let html = `
      <div class="atlas-split-layout">
        
        <!-- ========================================================
             LEFT PANEL: FILTERS, RANKING CONTROLS, & SECTORS
             ======================================================== -->
        <aside class="atlas-sidebar">
          
          <!-- SEARCH BOX -->
          <div class="atlas-sidebar-group">
            <label class="atlas-group-label">Search Tasks</label>
            <div class="atlas-side-search">
              <svg class="atlas-side-search-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                class="atlas-side-input" 
                placeholder="Action, keyword, or document #..." 
                value="${escapeHtml(state.searchQuery)}"
                oninput="handleAtlasSearch(this.value)"
              />
              ${state.searchQuery ? `<button class="atlas-side-clear" onclick="clearAtlasSearch()">&times;</button>` : ''}
            </div>
          </div>

          <!-- RANKING / SORT BUTTONS (RCA, EXPOSURE, VOLUME) -->
          <div class="atlas-sidebar-group">
            <label class="atlas-group-label">Rank & Sort Tasks By</label>
            <div class="atlas-rank-buttons">
              <button 
                class="atlas-rank-btn ${state.sortBy === 'rca' ? 'active' : ''}" 
                onclick="setAtlasSort('rca')"
                title="Rank by Revealed Comparative Advantage (Specialization)"
              >
                <span class="atlas-rank-icon">⭐</span>
                <span class="atlas-rank-text">
                  <strong>Highest RCA</strong>
                  <small>Sector Specialization</small>
                </span>
              </button>

              <button 
                class="atlas-rank-btn ${state.sortBy === 'exposure' ? 'active' : ''}" 
                onclick="setAtlasSort('exposure')"
                title="Rank by AI Match Similarity"
              >
                <span class="atlas-rank-icon">🤖</span>
                <span class="atlas-rank-text">
                  <strong>Most AI Exposed</strong>
                  <small>Highest Similarity Match</small>
                </span>
              </button>

              <button 
                class="atlas-rank-btn ${state.sortBy === 'volume' ? 'active' : ''}" 
                onclick="setAtlasSort('volume')"
                title="Rank by Total Document Mentions"
              >
                <span class="atlas-rank-icon">📈</span>
                <span class="atlas-rank-text">
                  <strong>Most Used</strong>
                  <small>Total Mentions Volume</small>
                </span>
              </button>

              <button 
                class="atlas-rank-btn ${state.sortBy === 'alpha' ? 'active' : ''}" 
                onclick="setAtlasSort('alpha')"
                title="Alphabetical Order"
              >
                <span class="atlas-rank-icon">🔤</span>
                <span class="atlas-rank-text">
                  <strong>Alphabetical</strong>
                  <small>A to Z</small>
                </span>
              </button>
            </div>
          </div>

          <!-- AI EXPOSURE FILTER -->
          <div class="atlas-sidebar-group">
            <label class="atlas-group-label">Exposure Filter</label>
            <div class="atlas-filter-chips">
              <button 
                class="atlas-filter-chip ${state.exposureFilter === 'all' ? 'active' : ''}" 
                onclick="setAtlasExposure('all')"
              >
                All Tasks
              </button>
              <button 
                class="atlas-filter-chip ${state.exposureFilter === 'ai_only' ? 'active' : ''}" 
                onclick="setAtlasExposure('ai_only')"
              >
                AI-Exposed
              </button>
              <button 
                class="atlas-filter-chip ${state.exposureFilter === 'human_only' ? 'active' : ''}" 
                onclick="setAtlasExposure('human_only')"
              >
                Human Only
              </button>
            </div>
          </div>

          <!-- SECTOR / FIELD SELECTION (VERTICAL LIST) -->
          <div class="atlas-sidebar-group atlas-grow">
            <div class="atlas-sector-header-row">
              <label class="atlas-group-label">${isTech ? 'CPC Technology Class' : 'Scientific Field'}</label>
              <span class="atlas-field-count-badge">${fields.length} Sectors</span>
            </div>
            
            <div class="atlas-sectors-list">
              <button 
                class="atlas-sector-item ${state.selectedField === 'All' ? 'active' : ''}" 
                onclick="setAtlasField('All')"
              >
                <span class="atlas-sector-name">All ${isTech ? 'CPC Sections' : 'Fields'}</span>
                <span class="atlas-sector-badge">${formatNumber(allClusters.length)}</span>
              </button>
              ${fields.map(f => `
                <button 
                  class="atlas-sector-item ${state.selectedField === f.name ? 'active' : ''}" 
                  onclick="setAtlasField('${escapeHtml(f.name)}')"
                >
                  <span class="atlas-sector-dot" style="background: ${f.color}"></span>
                  <span class="atlas-sector-name">${escapeHtml(f.name)}</span>
                  <span class="atlas-sector-badge">${formatNumber(f.n_clusters)}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- SIDEBAR QUICK HIGHLIGHTS -->
          ${topRcaCluster || topExposedCluster ? `
            <div class="atlas-sidebar-highlights">
              <span class="atlas-highlights-title">
                ${state.selectedField === 'All' ? 'Scope Highlights' : escapeHtml(state.selectedField)}
              </span>
              
              ${topRcaCluster ? `
                <div class="atlas-mini-stat" onclick="jumpToTaskDirect(${topRcaCluster.id})">
                  <span class="mini-label">Highest RCA Task:</span>
                  <span class="mini-name">&ldquo;${escapeHtml(topRcaCluster.c.slice(0, 55))}...&rdquo;</span>
                  <span class="mini-tag rca">RCA ${topRcaCluster.rca}x</span>
                </div>
              ` : ''}

              ${topExposedCluster && topExposedCluster.closest ? `
                <div class="atlas-mini-stat" onclick="jumpToTaskDirect(${topExposedCluster.id})">
                  <span class="mini-label">Most Exposed AI Task:</span>
                  <span class="mini-name">&ldquo;${escapeHtml(topExposedCluster.c.slice(0, 55))}...&rdquo;</span>
                  <span class="mini-tag ai">Sim ${topExposedCluster.sim.toFixed(2)}</span>
                </div>
              ` : ''}
            </div>
          ` : ''}

        </aside>

        <!-- ========================================================
             RIGHT PANEL: DENSE, STREAMLINED TASK STREAM
             ======================================================== -->
        <main class="atlas-main-content">
          
          <!-- TASK ROWS STREAM (MAXIMIZED VERTICAL VIEW) -->
          <div class="atlas-stream-body">
            ${renderTaskRows(pageItems, startIndex, isTech)}
          </div>

          <!-- PAGINATION FOOTER -->
          <div class="atlas-content-footer">
            <span class="atlas-page-status">
              Showing ${totalCount > 0 ? (startIndex + 1) : 0}–${Math.min(startIndex + state.pageSize, totalCount)} of ${formatNumber(totalCount)} tasks
            </span>
            <div class="atlas-page-controls">
              <button 
                class="atlas-nav-button" 
                ${state.currentPage <= 1 ? 'disabled' : ''} 
                onclick="setAtlasPage(${state.currentPage - 1})"
              >
                &larr; Prev
              </button>
              <span class="atlas-current-page">Page ${state.currentPage} of ${totalPages}</span>
              <button 
                class="atlas-nav-button" 
                ${state.currentPage >= totalPages ? 'disabled' : ''} 
                onclick="setAtlasPage(${state.currentPage + 1})"
              >
                Next &rarr;
              </button>
            </div>
          </div>

        </main>

      </div>
    `;

    stage.innerHTML = html;
  }

  function updateHeaderSubtitle(subtitle) {
    const atlasModal = document.getElementById('atlas-ai-modal');
    if (atlasModal) {
      const el = atlasModal.querySelector('.exp-modal-sub');
      if (el) el.textContent = subtitle;
    } else {
      const standaloneEl = document.querySelector('.standalone-window .exp-modal-sub');
      if (standaloneEl) standaloneEl.textContent = subtitle;
    }
  }

  // -------------------------------------------------------------
  // TASK ROWS RENDERER (COMPACT, DUAL DOCUMENTS: ORIGINAL & AI)
  // -------------------------------------------------------------
  function renderTaskRows(items, startIndex, isTech) {
    if (items.length === 0) {
      return `
        <div class="atlas-empty-notice">
          <div class="atlas-empty-icon">&#128269;</div>
          <h3>No tasks matched your search</h3>
          <p>Try clearing your keyword or switching sectors.</p>
          <button class="atlas-reset-btn" onclick="resetAtlasFilters()">Reset All Filters</button>
        </div>
      `;
    }

    return `
      <div class="atlas-task-stream">
        ${items.map((item, idx) => {
          const rank = startIndex + idx + 1;
          const hasAi = item.na > 0 && item.closest;
          const isHighRca = item.rca >= 1.0;

          return `
            <article class="atlas-row-card" id="task-${item.id}">
              
              <!-- TOPLINE METRICS ROW -->
              <div class="atlas-row-topline">
                <span class="atlas-rank">#${rank}</span>
                <span class="atlas-field-tag">${escapeHtml(item.f)}</span>
                
                <span class="atlas-pill ${isHighRca ? 'pill-rca-high' : 'pill-rca'}" title="Revealed Comparative Advantage: ${item.rca}x concentration relative to all sectors">
                  RCA <strong>${item.rca}x</strong>
                </span>

                <span class="atlas-pill pill-vol" title="Total document mentions">
                  <strong>${formatNumber(item.nh)}</strong> mentions
                </span>

                <span class="atlas-pill ${hasAi ? 'pill-ai-active' : 'pill-human'}">
                  ${hasAi ? `AI Match: <strong>${item.sim.toFixed(2)}</strong> (${formatNumber(item.na)} tasks)` : 'Human Frontier (0 AI)'}
                </span>
              </div>

              <!-- CANONICAL TASK STATEMENT -->
              <div class="atlas-statement-wrap">
                <h4 class="atlas-task-text">
                  &ldquo;${escapeHtml(item.c)}&rdquo;
                </h4>
              </div>

              <!-- DUAL DOCUMENT CARDS: ORIGINAL HUMAN DOCUMENT & CLOSEST AI EXPOSER -->
              <div class="atlas-dual-docs-wrap">
                
                <!-- 1. ORIGINAL HUMAN DOCUMENT -->
                <div class="atlas-doc-box orig-doc">
                  <div class="atlas-doc-top">
                    <span class="atlas-doc-badge orig">Original Document</span>
                    ${item.orig ? `
                      <a 
                        href="${isTech ? `https://patents.google.com/patent/US${item.orig.doc_id}/en` : `https://openalex.org/${item.orig.doc_id}`}" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        class="atlas-doc-link orig"
                        title="View original document"
                      >
                        ${isTech ? `US Patent #${item.orig.doc_id}` : `OpenAlex #${item.orig.doc_id}`} (${item.orig.year})
                        <span class="ext-arrow">&nearr;</span>
                      </a>
                      <span class="atlas-doc-class">${escapeHtml(item.orig.class)}</span>
                    ` : '<span class="atlas-doc-na">Exemplar in corpus</span>'}
                  </div>

                  ${item.orig && item.orig.task ? `
                    <p class="atlas-doc-text">
                      ↳ &ldquo;${escapeHtml(item.orig.task)}&rdquo;
                    </p>
                  ` : ''}
                </div>

                <!-- 2. CLOSEST AI EXPOSER DOCUMENT -->
                <div class="atlas-doc-box ai-doc ${hasAi ? 'active' : 'human'}">
                  <div class="atlas-doc-top">
                    <span class="atlas-doc-badge ${hasAi ? 'ai' : 'human'}">
                      ${hasAi ? `Closest Exposing ${isTech ? 'AI Patent' : 'AI Paper'}` : 'Human Frontier'}
                    </span>
                    ${hasAi ? `
                      <a 
                        href="${isTech ? `https://patents.google.com/patent/US${item.closest.doc_id}/en` : `https://openalex.org/${item.closest.doc_id}`}" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        class="atlas-doc-link ai"
                        title="View AI exposing document"
                      >
                        ${isTech ? `US Patent #${item.closest.doc_id}` : `OpenAlex #${item.closest.doc_id}`} (${item.closest.year})
                        <span class="ext-arrow">&nearr;</span>
                      </a>
                      <span class="atlas-doc-sim">Similarity: <strong>${item.closest.sim.toFixed(2)}</strong></span>
                    ` : '<span class="atlas-doc-na">0 AI Exposure</span>'}
                  </div>

                  ${hasAi ? `
                    <p class="atlas-doc-text">
                      ↳ &ldquo;${escapeHtml(item.closest.task)}&rdquo;
                    </p>
                  ` : `
                    <p class="atlas-doc-text human-desc">
                      No functional AI systems in the corpus codify this task. Exclusively executed by human researchers and inventors.
                    </p>
                  `}
                </div>

              </div>

            </article>
          `;
        }).join('')}
      </div>
    `;
  }

  // -------------------------------------------------------------
  // GLOBAL WINDOW ACTIONS
  // -------------------------------------------------------------
  window.openAtlasAiModal = function() {
    const modal = document.getElementById('atlas-ai-modal');
    if (!modal) return;
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    renderAtlasStage();
  };

  window.closeAtlasAiModal = function(e) {
    if (e && e.target !== e.currentTarget && !e.target.classList.contains('btn-close-modal')) return;
    const modal = document.getElementById('atlas-ai-modal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
  };

  window.setAtlasDomain = function(domain) {
    state.domain = domain;
    state.selectedField = 'All';
    state.searchQuery = '';
    state.currentPage = 1;

    document.querySelectorAll('.atlas-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-domain') === domain);
    });

    renderAtlasStage();
  };

  window.setAtlasField = function(fieldName) {
    state.selectedField = fieldName;
    state.currentPage = 1;
    renderAtlasStage();
  };

  window.setAtlasSort = function(sortKey) {
    state.sortBy = sortKey;
    state.currentPage = 1;
    renderAtlasStage();
  };

  window.setAtlasExposure = function(exposure) {
    state.exposureFilter = exposure;
    state.currentPage = 1;
    renderAtlasStage();
  };

  window.setAtlasPage = function(page) {
    state.currentPage = page;
    renderAtlasStage();
    const stream = document.querySelector('.atlas-stream-body');
    if (stream) stream.scrollTop = 0;
  };

  let searchTimer = null;
  window.handleAtlasSearch = function(query) {
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      state.searchQuery = query;
      state.currentPage = 1;
      renderAtlasStage();
    }, 120);
  };

  window.clearAtlasSearch = function() {
    state.searchQuery = '';
    state.currentPage = 1;
    renderAtlasStage();
  };

  window.resetAtlasFilters = function() {
    state.selectedField = 'All';
    state.searchQuery = '';
    state.exposureFilter = 'all';
    state.sortBy = 'rca';
    state.currentPage = 1;
    renderAtlasStage();
  };

  window.jumpToTaskDirect = function(taskId) {
    state.searchQuery = '';
    state.exposureFilter = 'all';
    const all = getClusters();
    const match = all.find(c => c.id === taskId);
    if (match) {
      state.selectedField = match.f;
      state.currentPage = 1;
      renderAtlasStage();
      setTimeout(() => {
        const el = document.getElementById(`task-${taskId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('highlight-glow');
          setTimeout(() => el.classList.remove('highlight-glow'), 2000);
        }
      }, 100);
    }
  };

  // Auto-init on page load
  document.addEventListener('DOMContentLoaded', () => {
    if (document.body.classList.contains('standalone-atlas-page') || document.getElementById('atlas-stage')) {
      renderAtlasStage();
    }
  });

  // ESC key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('atlas-ai-modal');
      if (modal && modal.classList.contains('active')) {
        window.closeAtlasAiModal();
      }
    }
  });

})();
