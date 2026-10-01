/**
 * GitPat Interactive Explorer Engine
 * "Open Source Software as Digital Platforms to Innovate"
 * Dr. Sergio Gabriel Petralia (Journal of Economic Behavior & Organization)
 */

(function() {
  'use strict';

  // Global State
  const state = {
    mode: 'projects',
    selectedProject: null,
    selectedFirmId: null,
    selectedInventorId: null,
    projectCategory: 'All Infrastructure',
    inventorFirm: 'All Organizations',
    searchQuery: '',
    networkOrgId: 'redhat_com',
    networkConnMode: 'all', // 'all' | 'copat' | 'repos'
    networkRepoFilter: 'all',
    pinnedNodeId: null,
    hoveredNodeId: null,
    scatterFilter: 'dual'
  };

  const CATEGORY_COLORS = {
    'Compute Resources': '#10b981',        // Emerald
    'Data Management & Storage': '#06b6d4',// Cyan
    'Communication': '#8b5cf6',            // Purple
    'Integration': '#f59e0b',              // Amber
    'Orchestration': '#3b82f6',            // Blue
    'Monitoring & Observability': '#ec4899'// Pink
  };

  function init() {
    if (!window.GITPAT_DATA) {
      setTimeout(init, 100);
      return;
    }

    renderCurrentMode();
    setupEventListeners();
  }

  // Global modal open/close functions (matches ClearPat modal window behavior)
  function openGitpatModal() {
    const modal = document.getElementById('gitpat-modal');
    if (!modal) return;
    modal.classList.add('open');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Always activate projects tab by default on open
    const targetMode = state.mode || 'projects';
    setGitpatMode(targetMode);
  }
  window.openGitpatModal = openGitpatModal;

  function closeGitpatModal(event) {
    if (event && event.target !== event.currentTarget && !event.target.classList.contains('btn-close-modal') && !event.target.closest('.btn-close-modal')) {
      return;
    }
    const modal = document.getElementById('gitpat-modal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
  window.closeGitpatModal = closeGitpatModal;

  function setGitpatMode(newMode) {
    state.mode = newMode;
    
    // Update Tab UI
    document.querySelectorAll('.gitpat-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === newMode);
    });

    renderCurrentMode();
  }
  window.setGitpatMode = setGitpatMode;

  window.filterGitpatProjectCategory = function(cat) {
    state.projectCategory = cat;
    document.querySelectorAll('.gitpat-cat-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cat === cat);
    });
    renderProjectsView();
  };

  window.filterGitpatInventorFirm = function(firm) {
    state.inventorFirm = firm;
    document.querySelectorAll('.gitpat-inv-firm-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.firm === firm);
    });
    renderInventorsView();
  };

  window.toggleScatterFilter = function(filterMode) {
    state.scatterFilter = filterMode;
    const allFirms = window.GITPAT_DATA.firms || [];
    const activeFirm = allFirms.find(f => f.id === state.selectedFirmId) || allFirms[0];
    const scatterCol = document.getElementById('gitpat-scatter-container');
    if (scatterCol && activeFirm) {
      scatterCol.innerHTML = renderScatterplotDossier(activeFirm);
    }
  };

  function setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') window.closeGitpatModal();
    });
  }

  function renderCurrentMode() {
    const activeMode = state.mode || 'projects';
    state.mode = activeMode;
    if (activeMode === 'projects') {
      renderProjectsView();
    } else if (activeMode === 'firms') {
      renderFirmsView();
    } else if (activeMode === 'inventors') {
      renderInventorsView();
    }
  }

  // ==========================================
  // TAB 1: OPEN SOURCE IN PATENTS (Clean, Gentle Introduction)
  // ==========================================
  function renderProjectsView() {
    const stage = document.getElementById('gitpat-stage');
    if (!stage) return;

    stage.className = 'modal-exp-stage gitpat-stage mode-projects';

    const data = window.GITPAT_DATA;
    const allProjects = data.projects || [];
    
    // Filter projects by category
    const filteredProjects = allProjects.filter(p => {
      if (state.projectCategory !== 'All Infrastructure' && p.category !== state.projectCategory) return false;
      return true;
    });

    // Make sure a selected project exists
    let activeProj = allProjects.find(p => p.id === state.selectedProjectId) || filteredProjects[0] || allProjects[0];
    if (activeProj) state.selectedProjectId = activeProj.id;

    const maxPatents = Math.max(...allProjects.map(p => p.patentsCount), 1);

    // Build Left Column: Category Pills Bar + Projects List
    let leftHtml = `
      <div class="gitpat-main-col">
        <!-- Category Filter Pills Bar (No Search Bar, No Intro Banner) -->
        <div class="gitpat-controls-row" style="background: transparent; border: none; padding: 0.2rem 0; margin-bottom: 0.1rem;">
          <div class="gitpat-cat-pills">
            ${(data.categories || ['All Infrastructure']).map(cat => `
              <button class="gitpat-cat-pill ${state.projectCategory === cat ? 'active' : ''}" data-cat="${cat}" onclick="filterGitpatProjectCategory('${cat}')">
                ${cat}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Project Cards Grid -->
        <div class="gitpat-projects-list">
          ${filteredProjects.map((p, idx) => {
            const isSel = p.id === state.selectedProjectId;
            const catColor = CATEGORY_COLORS[p.category] || '#3b82f6';
            const pct = Math.max(4, Math.round((p.patentsCount / maxPatents) * 100));

            return `
              <div class="gitpat-project-row ${isSel ? 'active' : ''}" onclick="selectGitpatProject('${p.id}')">
                <div class="proj-row-rank">#${idx + 1}</div>
                <div class="proj-row-info">
                  <div class="proj-row-top">
                    <span class="proj-row-title" style="font-family: 'JetBrains Mono', monospace; font-size: 0.95rem; font-weight: 700;">${p.name}</span>
                    <span class="proj-row-cat" style="color: ${catColor}; border-color: ${catColor}33; background: ${catColor}15;">${p.category}</span>
                  </div>
                  <div class="proj-row-desc" style="font-size: 0.74rem; color: var(--text-muted); line-height: 1.35; margin: 0.1rem 0;">${p.desc}</div>
                  <div class="proj-row-bar-track">
                    <div class="proj-row-bar-fill" style="width: ${pct}%; background: ${catColor};"></div>
                  </div>
                  <div class="proj-row-meta">
                    <span><strong>${p.patentsCount.toLocaleString()}</strong> patents citing</span>
                    <span>&bull;</span>
                    <span><strong>${p.firmsCount.toLocaleString()}</strong> organizations citing</span>
                    <span>&bull;</span>
                    <span>${p.totalCommits.toLocaleString()} commits</span>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Right Column: Project Detail Dossier -->
      <div id="gitpat-sidebar" class="gitpat-sidebar">
        ${renderProjectDetailDossier(activeProj)}
      </div>
    `;

    stage.innerHTML = leftHtml;
  }

  window.selectGitpatProject = function(projectId) {
    state.selectedProjectId = projectId;
    const allProjects = window.GITPAT_DATA.projects || [];
    const proj = allProjects.find(p => p.id === projectId);
    if (!proj) return;

    // Update active row
    document.querySelectorAll('.gitpat-project-row').forEach(row => {
      row.classList.toggle('active', row.getAttribute('onclick').includes(proj.id));
    });

    // Update sidebar
    const sidebar = document.getElementById('gitpat-sidebar');
    if (sidebar) sidebar.innerHTML = renderProjectDetailDossier(proj);
  };

  function renderProjectDetailDossier(proj) {
    if (!proj) return '<div class="sidebar-exp-card"><p class="text-muted">Select an open source project to view details.</p></div>';

    const catColor = CATEGORY_COLORS[proj.category] || '#3b82f6';
    const maxCiting = (proj.topCitingFirms && proj.topCitingFirms.length > 0) ? proj.topCitingFirms[0].patents : 1;
    const maxContrib = (proj.topContributingFirms && proj.topContributingFirms.length > 0) ? proj.topContributingFirms[0].commits : 1;

    const citingHtml = (proj.topCitingFirms || []).map(f => {
      const pct = Math.max(5, Math.round((f.patents / maxCiting) * 100));
      return `
        <div class="gitpat-breakdown-row">
          <div class="breakdown-label">
            <span class="firm-name">${f.display || f.domain}</span>
            <span class="val-count">${f.patents.toLocaleString()} patents</span>
          </div>
          <div class="breakdown-track">
            <div class="breakdown-fill" style="width: ${pct}%; background: #f59e0b;"></div>
          </div>
        </div>
      `;
    }).join('') || '<p class="text-muted" style="font-size: 0.78rem;">No citations recorded.</p>';

    // Contributing entities display their domains directly
    const contribHtml = (proj.topContributingFirms || []).map(f => {
      const pct = Math.max(5, Math.round((f.commits / maxContrib) * 100));
      return `
        <div class="gitpat-breakdown-row">
          <div class="breakdown-label">
            <span class="firm-name" style="font-family: 'JetBrains Mono', monospace; font-size: 0.78rem;">${f.domain}</span>
            <span class="val-count">${f.commits.toLocaleString()} commits</span>
          </div>
          <div class="breakdown-track">
            <div class="breakdown-fill" style="width: ${pct}%; background: #3b82f6;"></div>
          </div>
        </div>
      `;
    }).join('') || '<p class="text-muted" style="font-size: 0.78rem;">No commits in top tier.</p>';

    return `
      <div class="sidebar-exp-card gitpat-dossier-card">
        <div class="dossier-header">
          <div class="dossier-titles">
            <h3 class="dossier-firm-name" style="font-family: 'JetBrains Mono', monospace; font-size: 1.35rem; font-weight: 800; color: var(--text-heading); letter-spacing: -0.02em;">${proj.name}</h3>
            <span class="dossier-domain">${proj.category} &bull; First commit ${proj.firstYear}</span>
          </div>
          <span class="dossier-badge" style="background: ${catColor}; color: #ffffff;">
            #${proj.id}
          </span>
        </div>

        <p class="dossier-narrative" style="font-size: 0.8rem; color: var(--text-main); line-height: 1.45; margin: 0.5rem 0 0.85rem 0;">${proj.desc}</p>

        <!-- KPI Grid -->
        <div class="gitpat-kpi-grid">
          <div class="kpi-box">
            <span class="kpi-label">USPTO Patents Citing</span>
            <span class="kpi-val" style="color: #f59e0b;">${proj.patentsCount.toLocaleString()}</span>
          </div>
          <div class="kpi-box">
            <span class="kpi-label">Organizations Citing</span>
            <span class="kpi-val" style="color: #10b981;">${proj.firmsCount.toLocaleString()}</span>
          </div>
          <div class="kpi-box">
            <span class="kpi-label">Total Code Commits</span>
            <span class="kpi-val" style="color: #3b82f6;">${proj.totalCommits.toLocaleString()}</span>
          </div>
          <div class="kpi-box">
            <span class="kpi-label">First Commit</span>
            <span class="kpi-val" style="color: #ec4899;">${proj.firstYear}</span>
          </div>
        </div>

        <!-- Section 1: Who Cites it in Patents -->
        <div class="dossier-section">
          <div class="dossier-section-title">
            <span class="title-dot" style="background: #f59e0b;"></span>
            <span>Top Organizations Citing ${proj.name} in Patents</span>
          </div>
          <div class="gitpat-breakdown-list">
            ${citingHtml}
          </div>
        </div>

        <!-- Section 2: Who Contributes Code to it (Domain names) -->
        <div class="dossier-section" style="margin-top: 1rem;">
          <div class="dossier-section-title">
            <span class="title-dot" style="background: #3b82f6;"></span>
            <span>Top Contributing Domains (Commits)</span>
          </div>
          <div class="gitpat-breakdown-list">
            ${contribHtml}
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // TAB 2: PATENTING & CONTRIBUTING (Scatterplot)
  // ==========================================
  function renderFirmsView() {
    const stage = document.getElementById('gitpat-stage');
    if (!stage) return;

    stage.className = 'modal-exp-stage gitpat-stage mode-firms';

    const allFirms = window.GITPAT_DATA.firms || [];
    const filteredFirms = allFirms.filter(f => {
      if (state.firmSearch && !f.name.toLowerCase().includes(state.firmSearch) && !f.domain.toLowerCase().includes(state.firmSearch)) {
        return false;
      }
      return true;
    });

    let activeFirm = allFirms.find(f => f.id === state.selectedFirmId) || filteredFirms[0] || allFirms[0];
    if (activeFirm) state.selectedFirmId = activeFirm.id;

    // Left Column: Narrower company/domain list (No search bar)
    let leftHtml = `
      <div class="gitpat-dual-col">
        <!-- Clean list of organizations / domains -->
        <div class="gitpat-dual-list">
          ${filteredFirms.map((f, idx) => {
            const isSel = f.id === state.selectedFirmId;
            return `
              <div class="gitpat-dual-row ${isSel ? 'active' : ''}" onclick="selectGitpatFirm('${f.id}')">
                <div class="dual-row-top">
                  <span class="dual-row-domain">${f.name !== f.domain ? f.name : f.domain}</span>
                  <span class="dual-row-badge">${f.dualReposCount} repos</span>
                </div>
                <div class="dual-row-sub">
                  <span style="font-family: 'JetBrains Mono', monospace; font-size: 0.71rem; color: var(--text-heading);">${f.domain}</span>
                  <span>&bull;</span>
                  <span>${f.ossPatents.toLocaleString()} pats</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Right Column: Interactive Scatterplot Canvas & Repositories Table -->
      <div id="gitpat-scatter-container" class="gitpat-scatter-col">
        ${renderScatterplotDossier(activeFirm)}
      </div>
    `;

    stage.innerHTML = leftHtml;


  }

  window.selectGitpatFirm = function(firmId) {
    state.selectedFirmId = firmId;
    const allFirms = window.GITPAT_DATA.firms || [];
    const firm = allFirms.find(f => f.id === firmId);
    if (!firm) return;

    // Update active row
    document.querySelectorAll('.gitpat-dual-row').forEach(row => {
      row.classList.toggle('active', row.getAttribute('onclick').includes(firm.id));
    });

    // Update scatterplot container
    const scatterContainer = document.getElementById('gitpat-scatter-container');
    if (scatterContainer) scatterContainer.innerHTML = renderScatterplotDossier(firm);
  };

  function renderScatterplotDossier(firm) {
    if (!firm) return '<div class="gitpat-scatter-card"><p class="text-muted">Select a domain on the left to view repository scatterplot.</p></div>';

    const allRepos = firm.repos || [];
    const dualRepos = allRepos.filter(r => r.isDual);
    const currentFilter = state.scatterFilter || 'dual';
    const reposToPlot = (currentFilter === 'dual') ? dualRepos : allRepos;

    // Scatterplot SVG Dimensions
    const svgWidth = 740;
    const svgHeight = 340;
    const margin = { top: 35, right: 35, bottom: 45, left: 65 };
    const plotW = svgWidth - margin.left - margin.right;
    const plotH = svgHeight - margin.top - margin.bottom;

    const maxCommits = Math.max(...reposToPlot.map(r => r.commits), 10);
    const maxPatents = Math.max(...reposToPlot.map(r => r.patents), 10);

    const logMaxC = Math.log10(maxCommits * 1.4);
    const logMaxP = Math.log10(maxPatents * 1.4);

    // Commits Ticks (X)
    const commitCandidateTicks = [1, 10, 100, 1000, 10000, 100000, 1000000];
    const commitTicks = commitCandidateTicks.filter(t => t <= maxCommits * 1.2);

    // Patents Ticks (Y)
    const patentCandidateTicks = [1, 5, 25, 100, 500, 2000];
    const patentTicks = patentCandidateTicks.filter(t => t <= maxPatents * 1.2);

    function getX(c) {
      if (c <= 0) return margin.left;
      return margin.left + 25 + (Math.log10(c) / logMaxC) * (plotW - 25);
    }

    function getY(p) {
      if (p <= 0) return margin.top + plotH;
      return margin.top + plotH - 25 - (Math.log10(p) / logMaxP) * (plotH - 25);
    }

    // Generate grid lines & ticks
    let gridLinesSvg = '';

    // Vertical grid lines (Commits)
    commitTicks.forEach(t => {
      const x = getX(t);
      const label = t >= 1000000 ? `${t/1000000}M` : (t >= 1000 ? `${t/1000}k` : `${t}`);
      gridLinesSvg += `
        <line x1="${x}" y1="${margin.top}" x2="${x}" y2="${margin.top + plotH}" stroke="currentColor" stroke-dasharray="3,3" opacity="0.12" />
        <text x="${x}" y="${margin.top + plotH + 18}" text-anchor="middle" font-size="10" font-family="'JetBrains Mono', monospace" fill="var(--text-muted)">${label}</text>
      `;
    });

    // Horizontal grid lines (Patents)
    patentTicks.forEach(t => {
      const y = getY(t);
      const label = t >= 1000 ? `${t/1000}k` : `${t}`;
      gridLinesSvg += `
        <line x1="${margin.left}" y1="${y}" x2="${margin.left + plotW}" y2="${y}" stroke="currentColor" stroke-dasharray="3,3" opacity="0.12" />
        <text x="${margin.left - 10}" y="${y + 3}" text-anchor="end" font-size="10" font-family="'JetBrains Mono', monospace" fill="var(--text-muted)">${label}</text>
      `;
    });

    // Clean plot background without watermark
    const dualZoneSvg = '';

    // Data points SVG
    let dotsSvg = '';
    reposToPlot.forEach(r => {
      const cx = getX(r.commits);
      const cy = getY(r.patents);
      const catColor = CATEGORY_COLORS[r.category] || '#10b981';

      if (r.isDual) {
        dotsSvg += `
          <g class="scatter-point-group" onmouseenter="showScatterTooltip(event, '${r.name}', '${r.category}', ${r.patents}, ${r.commits}, '${encodeURIComponent(r.desc)}')" onmouseleave="hideScatterTooltip()">
            <circle cx="${cx}" cy="${cy}" r="7.5" fill="${catColor}" stroke="#ffffff" stroke-width="2" class="scatter-dot" />
            <text x="${cx + 10}" y="${cy + 4}" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="700" fill="var(--text-heading)">${r.name}</text>
          </g>
        `;
      } else if (r.commits > 0) {
        dotsSvg += `
          <g class="scatter-point-group" onmouseenter="showScatterTooltip(event, '${r.name}', '${r.category}', ${r.patents}, ${r.commits}, '${encodeURIComponent(r.desc)}')" onmouseleave="hideScatterTooltip()">
            <circle cx="${cx}" cy="${cy}" r="5" fill="#3b82f6" opacity="0.8" class="scatter-dot" />
            <text x="${cx + 8}" y="${cy - 3}" font-family="'JetBrains Mono', monospace" font-size="9" fill="var(--text-muted)">${r.name}</text>
          </g>
        `;
      } else {
        dotsSvg += `
          <g class="scatter-point-group" onmouseenter="showScatterTooltip(event, '${r.name}', '${r.category}', ${r.patents}, ${r.commits}, '${encodeURIComponent(r.desc)}')" onmouseleave="hideScatterTooltip()">
            <circle cx="${cx}" cy="${cy}" r="5" fill="#f59e0b" opacity="0.8" class="scatter-dot" />
            <text x="${cx + 8}" y="${cy + 3}" font-family="'JetBrains Mono', monospace" font-size="9" fill="var(--text-muted)">${r.name}</text>
          </g>
        `;
      }
    });

    // Table rows for repositories
    const tableRowsHtml = reposToPlot.map((r, idx) => {
      const catColor = CATEGORY_COLORS[r.category] || '#10b981';
      return `
        <tr>
          <td style="font-weight: 700; color: var(--text-muted); width: 28px;">#${idx + 1}</td>
          <td style="font-family: 'JetBrains Mono', monospace; font-weight: 700; color: var(--text-heading); font-size: 0.85rem;">
            ${r.name}
          </td>
          <td>
            <span style="font-size: 0.68rem; font-weight: 600; padding: 0.15rem 0.45rem; border-radius: 9999px; color: ${catColor}; background: ${catColor}15; border: 1px solid ${catColor}33;">
              ${r.category}
            </span>
          </td>
          <td>
            <strong style="color: #f59e0b;">${r.patents.toLocaleString()}</strong> <span style="font-size: 0.7rem; color: var(--text-muted);">patents</span>
          </td>
          <td>
            <strong style="color: #3b82f6;">${r.commits.toLocaleString()}</strong> <span style="font-size: 0.7rem; color: var(--text-muted);">commits</span>
          </td>
          <td style="font-size: 0.72rem; color: var(--text-muted); max-width: 260px; line-height: 1.35;">
            ${r.desc}
          </td>
        </tr>
      `;
    }).join('') || '<tr><td colspan="6" class="text-muted" style="text-align: center; padding: 1.2rem;">No repositories found.</td></tr>';

    return `
      <!-- Header bar with Entity Metrics -->
      <div class="gitpat-scatter-header">
        <div class="scatter-domain-title">
          <span>${firm.name !== firm.domain ? firm.name + ' (' + firm.domain + ')' : firm.domain}</span>
        </div>
        <div class="scatter-kpi-badges">
          <span class="scatter-kpi-chip" style="border-color: #10b98155; color: #10b981;">
            📂 <strong>${firm.dualReposCount}</strong> Repositories
          </span>
          <span class="scatter-kpi-chip" style="border-color: #f59e0b55; color: #f59e0b;">
            📄 <strong>${firm.ossPatents.toLocaleString()}</strong> Patents Citing OSS
          </span>
          <span class="scatter-kpi-chip" style="border-color: #3b82f655; color: #3b82f6;">
            💻 <strong>${firm.ossCommits.toLocaleString()}</strong> Commits Contributed
          </span>
        </div>
      </div>

      <!-- Scatterplot Card -->
      <div class="gitpat-scatter-card">
        <div class="scatter-card-top" style="justify-content: flex-end;">
          <!-- Filter toggle buttons -->
          <div class="scatter-filter-pills">
            <button class="scatter-filter-btn ${currentFilter === 'dual' ? 'active' : ''}" onclick="toggleScatterFilter('dual')">
              Patents & Commits (${dualRepos.length})
            </button>
            <button class="scatter-filter-btn ${currentFilter === 'all' ? 'active' : ''}" onclick="toggleScatterFilter('all')">
              All Repositories (${allRepos.length})
            </button>
          </div>
        </div>

        <!-- SVG Scatterplot -->
        <div class="gitpat-svg-wrap">
          <svg viewBox="0 0 ${svgWidth} ${svgHeight}">
            <!-- Background Zone -->
            ${dualZoneSvg}

            <!-- Gridlines & Ticks -->
            ${gridLinesSvg}

            <!-- Main Axes Lines -->
            <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + plotH}" stroke="var(--text-muted)" stroke-width="1.5" />
            <line x1="${margin.left}" y1="${margin.top + plotH}" x2="${margin.left + plotW}" y2="${margin.top + plotH}" stroke="var(--text-muted)" stroke-width="1.5" />

            <!-- Axis Titles -->
            <text x="${margin.left + plotW / 2}" y="${margin.top + plotH + 36}" text-anchor="middle" font-size="11" font-weight="700" fill="var(--text-muted)">
              Code Commits Contributed to Repository (log scale) &rarr;
            </text>
            <text x="-${margin.top + plotH / 2}" y="${margin.left - 42}" transform="rotate(-90)" text-anchor="middle" font-size="11" font-weight="700" fill="var(--text-muted)">
              &uarr; USPTO Patents Mentioning Repository (log scale)
            </text>

            <!-- Plotted Data Points -->
            ${dotsSvg}
          </svg>

          <!-- Floating Tooltip Card -->
          <div id="gitpat-scatter-tooltip" class="scatter-tooltip"></div>
        </div>
      </div>

      <!-- Repositories Table -->
      <div class="gitpat-dual-table-card">
        <div class="dual-table-title">
          <span>Repositories (${reposToPlot.length})</span>
          <span style="font-size: 0.72rem; font-weight: 500; color: var(--text-muted);">
            ${currentFilter === 'dual' ? 'Repositories where ' + firm.domain + ' cites in patents and contributes code' : 'All open-source repositories associated with ' + firm.domain}
          </span>
        </div>
        <table class="gitpat-mini-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Repository</th>
              <th>Category</th>
              <th>Patents Mentioning</th>
              <th>Commits Contributed</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>
      </div>
    `;
  }

  // Global Tooltip Handlers
  window.showScatterTooltip = function(event, name, category, patents, commits, descEncoded) {
    const tip = document.getElementById('gitpat-scatter-tooltip');
    if (!tip) return;

    const desc = decodeURIComponent(descEncoded);
    tip.innerHTML = `
      <div style="font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 0.88rem; color: #10b981; margin-bottom: 0.2rem;">
        ${name}
      </div>
      <div style="font-size: 0.72rem; color: #94a3b8; margin-bottom: 0.35rem;">
        ${category}
      </div>
      <div style="font-size: 0.74rem; line-height: 1.4; color: #e2e8f0; margin-bottom: 0.4rem;">
        ${desc}
      </div>
      <div style="border-top: 1px solid rgba(255,255,255,0.15); padding-top: 0.35rem; display: flex; justify-content: space-between; gap: 0.6rem; font-size: 0.72rem;">
        <span>Patents: <strong style="color: #f59e0b;">${patents.toLocaleString()}</strong></span>
        <span>Commits: <strong style="color: #3b82f6;">${commits.toLocaleString()}</strong></span>
      </div>
    `;

    const svgWrap = tip.parentElement;
    if (svgWrap) {
      const rect = svgWrap.getBoundingClientRect();
      const left = event.clientX - rect.left + 14;
      const top = event.clientY - rect.top - 20;
      tip.style.left = `${Math.min(left, rect.width - 250)}px`;
      tip.style.top = `${Math.max(10, top)}px`;
    }
    tip.style.opacity = '1';
  };

  window.hideScatterTooltip = function() {
    const tip = document.getElementById('gitpat-scatter-tooltip');
    if (tip) tip.style.opacity = '0';
  };

  // ==========================================
  // TAB 3: INVENTORS
  // Interactive Network Visualization
  // ==========================================
  function renderInventorsView() {
    const stage = document.getElementById('gitpat-stage');
    if (!stage) return;

    stage.className = 'modal-exp-stage gitpat-stage mode-inventors';

    const networks = (window.GITPAT_DATA && window.GITPAT_DATA.networks) || [];
    if (!networks.length) {
      stage.innerHTML = '<p class="text-muted" style="padding: 2rem;">No network data available.</p>';
      return;
    }

    // Default to redhat_com (no synthetic top_20_all)
    if (!state.networkOrgId || state.networkOrgId === 'top_20_all' || !networks.some(n => n.id === state.networkOrgId)) {
      state.networkOrgId = networks.some(n => n.id === 'redhat_com') ? 'redhat_com' : networks[0].id;
    }

    const currentNet = networks.find(n => n.id === state.networkOrgId) || networks[0];

    // All active organizations with inventors networks sorted by prominence/size
    const allOrgs = networks
      .filter(n => n.id !== 'top_20_all' && n.id !== 'top_50_all' && n.nodes && n.nodes.length > 0)
      .sort((a, b) => (b.inventorsCount || b.nodes.length) - (a.inventorsCount || a.nodes.length));

    if (state.networkRepoFilter !== 'all' && !currentNet.topRepos.some(r => r.repo === state.networkRepoFilter)) {
      state.networkRepoFilter = 'all';
    }

    const html = `
      <div class="gitpat-net-wrapper">
        <!-- Row 1: Organizations Pills Slider (Full Width Across Page, Dropdown Dropped) -->
        <div class="gitpat-net-controls-row">
          <div class="gitpat-net-pills-scroll">
            ${allOrgs.map(org => `
              <button class="gitpat-net-org-pill ${state.networkOrgId === org.id ? 'active' : ''}" 
                      onclick="setGitpatNetworkOrg('${org.id}')" title="${org.firmDisp || org.name}">
                <span class="pill-dot" style="background: ${org.color};"></span>
                <span>${org.name}</span>
                <span class="pill-badge">${org.inventorsCount || org.nodes.length}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Row 2: Connections Mode & Repo Filters & Legend (Tightened spacing, status text dropped) -->
        <div class="gitpat-net-toolbar">
          <div class="gitpat-net-toolbar-left">
            <div class="gitpat-net-mode-toggles">
              <span class="toolbar-label">Connections:</span>
              <button class="gitpat-net-mode-pill ${state.networkConnMode === 'all' ? 'active' : ''}" onclick="setGitpatNetworkConnMode('all')">
                All Connections
              </button>
              <button class="gitpat-net-mode-pill ${state.networkConnMode === 'copat' ? 'active' : ''}" onclick="setGitpatNetworkConnMode('copat')">
                Co-Patenting (${currentNet.copatEdgesCount})
              </button>
              <button class="gitpat-net-mode-pill ${state.networkConnMode === 'repos' ? 'active' : ''}" onclick="setGitpatNetworkConnMode('repos')">
                Shared Repositories
              </button>
            </div>

            ${currentNet.topRepos && currentNet.topRepos.length > 0 ? `
              <div class="gitpat-net-repo-filters">
                <span class="toolbar-label">Repository:</span>
                <button class="gitpat-net-repo-pill ${state.networkRepoFilter === 'all' ? 'active' : ''}" onclick="setGitpatNetworkRepoFilter('all')">
                  All
                </button>
                ${currentNet.topRepos.slice(0, 5).map(r => `
                  <button class="gitpat-net-repo-pill ${state.networkRepoFilter === r.repo ? 'active' : ''}" onclick="setGitpatNetworkRepoFilter('${r.repo}')">
                    ${r.repo} <span class="repo-cnt">${r.count}</span>
                  </button>
                `).join('')}
              </div>
            ` : ''}
          </div>

          <div class="gitpat-net-legend">
            <div class="net-legend-item">
              <span class="net-legend-line copat"></span>
              <span>Co-patenting</span>
            </div>
            <div class="net-legend-item">
              <span class="net-legend-line repo"></span>
              <span>Shared repo</span>
            </div>
            <div class="net-legend-item">
              <span class="net-legend-line both"></span>
              <span>Both</span>
            </div>
            ${state.pinnedNodeId ? `
              <button class="btn-reset-pin" onclick="unpinGitpatNode()">✕ Reset Focus</button>
            ` : ''}
          </div>
        </div>

        <!-- Full-Width Network Canvas Stage (Right Pane Dropped!) -->
        <div id="gitpat-net-container" class="gitpat-net-container">
          <svg id="gitpat-net-svg" viewBox="0 0 960 500" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="net-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <g id="gitpat-net-edges-group"></g>
            <g id="gitpat-net-nodes-group"></g>
            <g id="gitpat-net-labels-group"></g>
          </svg>

          <!-- Interactive Floating Hover Card -->
          <div id="gitpat-net-hover-card" class="gitpat-net-hover-card" style="display: none;"></div>
        </div>
      </div>
    `;

    stage.innerHTML = html;

    renderNetworkGraph(currentNet);

    const container = document.getElementById('gitpat-net-container');
    if (container) {
      container.addEventListener('click', (e) => {
        if (e.target.tagName === 'svg' || e.target.id === 'gitpat-net-container') {
          unpinGitpatNode();
        }
      });
    }
  }

  function renderNetworkGraph(currentNet) {
    const edgesGroup = document.getElementById('gitpat-net-edges-group');
    const nodesGroup = document.getElementById('gitpat-net-nodes-group');
    const labelsGroup = document.getElementById('gitpat-net-labels-group');

    if (!edgesGroup || !nodesGroup || !labelsGroup || !currentNet) return;

    edgesGroup.innerHTML = '';
    nodesGroup.innerHTML = '';
    labelsGroup.innerHTML = '';

    const rawNodes = currentNet.nodes || currentNet.keyNodes || [];
    const copatEdges = currentNet.copatEdges || [];

    if (!rawNodes.length) return;

    // Eliminate excess top white space by shifting nodes up comfortably
    const minY = Math.min(...rawNodes.map(n => n.y));
    const yShift = minY > 42 ? minY - 42 : 0;

    const nodes = rawNodes.map(n => ({
      ...n,
      y: n.y - yShift
    }));

    const nodeMap = {};
    nodes.forEach(n => { nodeMap[n.id] = n; });

    // 1. Build Co-Patenting Lookup Map
    const copatMap = new Map();
    copatEdges.forEach(cp => {
      const k = cp.source < cp.target ? `${cp.source}||${cp.target}` : `${cp.target}||${cp.source}`;
      copatMap.set(k, cp.jointPatents);
    });

    // 2. Identify and Draw Edges
    const edgesToDraw = [];
    const drawnKeys = new Set();

    // A. Co-Patenting Edges
    if (state.networkConnMode === 'all' || state.networkConnMode === 'copat') {
      copatEdges.forEach(cp => {
        const u = nodeMap[cp.source];
        const v = nodeMap[cp.target];
        if (!u || !v) return;

        const k = cp.source < cp.target ? `${cp.source}||${cp.target}` : `${cp.target}||${cp.source}`;
        drawnKeys.add(k);

        const sharedRepos = u.repos.filter(r => v.repos.includes(r));
        const hasShared = sharedRepos.length > 0;
        
        // When a repository filter is selected, filter co-patenting pairs associated with that repository
        if (state.networkRepoFilter !== 'all') {
          const uHasRepo = u.repos.includes(state.networkRepoFilter);
          const vHasRepo = v.repos.includes(state.networkRepoFilter);
          if (!uHasRepo && !vHasRepo) return;
        }

        const matchesRepoFilter = state.networkRepoFilter === 'all' || sharedRepos.includes(state.networkRepoFilter);

        let type = 'copat';
        if (state.networkConnMode === 'all' && hasShared && matchesRepoFilter) {
          type = 'both';
        }

        edgesToDraw.push({
          u, v,
          type,
          jointPatents: cp.jointPatents,
          sharedRepos,
          key: k
        });
      });
    }

    // B. Shared Repository Edges (Consistent: 'All' is strictly superset of individual repos)
    if (state.networkConnMode === 'all' || state.networkConnMode === 'repos') {
      const n = nodes.length;

      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const u = nodes[i];
          const v = nodes[j];
          const k = u.id < v.id ? `${u.id}||${v.id}` : `${v.id}||${u.id}`;

          if (drawnKeys.has(k)) continue;

          const sharedRepos = u.repos.filter(r => v.repos.includes(r));
          if (!sharedRepos.length) continue;

          // Must match repository filter if one is selected
          if (state.networkRepoFilter !== 'all' && !sharedRepos.includes(state.networkRepoFilter)) {
            continue;
          }

          const hasCopat = copatMap.has(k);
          const jointPatents = copatMap.get(k) || 0;
          const type = (hasCopat && state.networkConnMode === 'all') ? 'both' : 'repo';

          edgesToDraw.push({
            u, v,
            type,
            jointPatents,
            sharedRepos,
            key: k
          });
          drawnKeys.add(k);
        }
      }
    }

    // Draw SVG Lines
    edgesToDraw.forEach((edge, idx) => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', edge.u.x);
      line.setAttribute('y1', edge.u.y);
      line.setAttribute('x2', edge.v.x);
      line.setAttribute('y2', edge.v.y);
      line.setAttribute('id', `net-edge-${idx}`);
      line.setAttribute('class', `net-edge edge-${edge.type}`);
      line.setAttribute('data-source', edge.u.id);
      line.setAttribute('data-target', edge.v.id);
      line.setAttribute('data-type', edge.type);

      let strokeWidth = 2.4;
      if (edge.type === 'both') {
        strokeWidth = Math.max(2.8, Math.min(6.5, 2.2 + Math.log10(edge.jointPatents + edge.sharedRepos.length) * 3));
      } else if (edge.type === 'copat') {
        strokeWidth = Math.max(2.2, Math.min(5.8, 1.8 + Math.log10(edge.jointPatents) * 2.8));
      } else {
        strokeWidth = Math.max(1.4, Math.min(4.5, 1.1 + Math.log10(edge.sharedRepos.length) * 2.2));
      }
      line.setAttribute('stroke-width', strokeWidth);

      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      let titleText = `${edge.u.name} & ${edge.v.name}\n`;
      if (edge.jointPatents > 0) titleText += `• Co-patenting: ${edge.jointPatents} joint USPTO patents\n`;
      if (edge.sharedRepos.length > 0) titleText += `• Shared Repositories: ${edge.sharedRepos.join(', ')}`;
      title.textContent = titleText;
      line.appendChild(title);

      edgesGroup.appendChild(line);
    });

    // 3. Draw Nodes & Labels with Generous Sizing
    nodes.forEach(node => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'net-node');
      g.setAttribute('id', `net-node-${node.id}`);
      g.setAttribute('data-id', node.id);

      // Generous radius: 15px to 24px (never small dots!)
      const r = Math.max(15, Math.min(24, 13 + Math.log10(node.patents + 1) * 8.0));

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', node.x);
      circle.setAttribute('cy', node.y);
      circle.setAttribute('r', r);
      circle.setAttribute('fill', node.color || currentNet.color || '#3b82f6');
      circle.setAttribute('stroke', '#ffffff');
      circle.setAttribute('stroke-width', 2.8);
      g.appendChild(circle);

      // Text Label underneath with clear typography
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', node.x);
      text.setAttribute('y', node.y + r + 14);
      text.setAttribute('class', 'net-label');
      text.setAttribute('id', `net-label-${node.id}`);
      text.setAttribute('text-anchor', 'middle');

      const nameSpan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      nameSpan.setAttribute('x', node.x);
      nameSpan.setAttribute('dy', '0');
      nameSpan.setAttribute('style', 'font-size: 11.5px; font-weight: 700;');
      nameSpan.textContent = node.name.length > 18 ? node.name.slice(0, 16) + '...' : node.name;
      text.appendChild(nameSpan);

      const subSpan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      subSpan.setAttribute('x', node.x);
      subSpan.setAttribute('dy', '12');
      subSpan.setAttribute('class', 'net-sublabel');
      subSpan.setAttribute('style', 'font-size: 9.8px; font-weight: 600; opacity: 0.8;');
      const repoSnippet = node.repos.slice(0, 2).join(', ');
      subSpan.textContent = `${node.patents} pats • ${repoSnippet}`;
      text.appendChild(subSpan);

      labelsGroup.appendChild(text);

      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = `${node.name}\n${node.firm}\nPatents: ${node.patents}\nCommits: ${node.commits}\nRepos: ${node.repos.join(', ')}`;
      g.appendChild(title);

      g.addEventListener('mouseenter', (e) => highlightInventorNode(node.id, e));
      g.addEventListener('mousemove', (e) => updateHoverCardPosition(e, node));
      g.addEventListener('mouseleave', () => unhighlightInventorNode(node.id));
      g.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePinInventorNode(node.id, e);
      });

      nodesGroup.appendChild(g);
    });

    if (state.pinnedNodeId) {
      highlightInventorNode(state.pinnedNodeId);
    }
  }

  function highlightInventorNode(nodeId, evt) {
    state.hoveredNodeId = nodeId;

    const networks = window.GITPAT_DATA.networks || [];
    const currentNet = networks.find(n => n.id === state.networkOrgId) || networks[0];
    if (!currentNet) return;

    const nodes = currentNet.nodes || currentNet.keyNodes || [];
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    // Find all neighbors (co-inventors + repo co-contributors)
    const coInventors = (currentNet.copatEdges || []).filter(e => e.source === nodeId || e.target === nodeId);
    const coInvIds = new Set(coInventors.map(e => e.source === nodeId ? e.target : e.source));

    const repoCollabs = nodes.filter(n => n.id !== nodeId && n.repos.some(r => node.repos.includes(r)));
    const repoCollabIds = new Set(repoCollabs.map(n => n.id));

    const allNeighborIds = new Set([...coInvIds, ...repoCollabIds, nodeId]);

    // Highlight / Dim Nodes
    document.querySelectorAll('.net-node').forEach(el => {
      const id = el.getAttribute('data-id');
      const isNeighbor = allNeighborIds.has(id);
      el.classList.toggle('dimmed', !isNeighbor);
      el.classList.toggle('active', id === nodeId);
    });

    // Highlight / Dim Labels
    document.querySelectorAll('.net-label').forEach(el => {
      const id = el.getAttribute('id')?.replace('net-label-', '');
      el.classList.toggle('dimmed', !allNeighborIds.has(id));
    });

    // Highlight / Dim Edges
    document.querySelectorAll('.net-edge').forEach(line => {
      const s = line.getAttribute('data-source');
      const t = line.getAttribute('data-target');
      const isConnected = (s === nodeId || t === nodeId);
      line.classList.toggle('active', isConnected);
      line.classList.toggle('dimmed', !isConnected);
    });

    // Populate and show hover card
    renderHoverCardContent(node, coInventors, repoCollabs, currentNet);
    if (evt) updateHoverCardPosition(evt, node);
  }

  function unhighlightInventorNode(nodeId) {
    if (state.pinnedNodeId) return;

    state.hoveredNodeId = null;
    document.querySelectorAll('.net-node').forEach(el => el.classList.remove('dimmed', 'active'));
    document.querySelectorAll('.net-label').forEach(el => el.classList.remove('dimmed'));
    document.querySelectorAll('.net-edge').forEach(line => line.classList.remove('dimmed', 'active'));

    const card = document.getElementById('gitpat-net-hover-card');
    if (card) {
      card.style.opacity = '0';
      card.style.display = 'none';
    }
  }

  function renderHoverCardContent(node, coInventors, repoCollabs, currentNet) {
    const card = document.getElementById('gitpat-net-hover-card');
    if (!card) return;

    const nodes = currentNet.nodes || currentNet.keyNodes || [];
    const coInvNames = coInventors.map(e => {
      const otherId = e.source === node.id ? e.target : e.source;
      const otherNode = nodes.find(n => n.id === otherId);
      return otherNode ? `${otherNode.name} (${e.jointPatents} joint pat${e.jointPatents === 1 ? '' : 's'})` : otherId;
    });

    card.innerHTML = `
      <div class="hover-card-header">
        <div class="hover-card-avatar" style="background: ${node.color}25; color: ${node.color};">
          ${node.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div class="hover-card-titles">
          <div class="hover-card-name">${node.name}</div>
          <div class="hover-card-firm">${node.firm} (${node.domain})</div>
        </div>
      </div>

      <div class="hover-card-kpis">
        <div class="hover-kpi">
          <span class="hover-kpi-num" style="color: #f59e0b;">${node.patents}</span>
          <span class="hover-kpi-lbl">Patents</span>
        </div>
        <div class="hover-kpi">
          <span class="hover-kpi-num" style="color: #3b82f6;">${node.commits.toLocaleString()}</span>
          <span class="hover-kpi-lbl">Commits</span>
        </div>
        <div class="hover-kpi">
          <span class="hover-kpi-num" style="color: #10b981;">${node.repos.length}</span>
          <span class="hover-kpi-lbl">Repos</span>
        </div>
      </div>

      <div class="hover-card-section">
        <div class="hover-sec-label">Open-Source Repositories:</div>
        <div class="hover-card-repos">
          ${node.repos.map(r => `<span class="inv-repo-pill" style="font-family: 'JetBrains Mono', monospace;">${r}</span>`).join('')}
        </div>
      </div>

      <div class="hover-card-collaborators">
        <div class="collab-item">
          <span class="collab-dot" style="background: #f59e0b;"></span>
          <span><strong>${coInventors.length} Co-inventor${coInventors.length === 1 ? '' : 's'}:</strong> ${coInvNames.join(', ') || 'Solo inventor on OSS patents'}</span>
        </div>
        <div class="collab-item">
          <span class="collab-dot" style="background: #3b82f6;"></span>
          <span><strong>${repoCollabs.length} Repository co-contributors</strong> in ${node.repos.slice(0, 3).join(', ')}${node.repos.length > 3 ? '...' : ''}</span>
        </div>
      </div>
    `;

    card.classList.toggle('pinned', state.pinnedNodeId === node.id);
    card.style.display = 'flex';
    card.style.opacity = '1';
    card.style.transform = 'translateY(0) scale(1)';
  }

  function updateHoverCardPosition(evt, node) {
    const card = document.getElementById('gitpat-net-hover-card');
    const container = document.getElementById('gitpat-net-container');
    if (!card || !container) return;

    const rect = container.getBoundingClientRect();
    
    let clientX, clientY;
    if (evt && evt.clientX) {
      clientX = evt.clientX;
      clientY = evt.clientY;
    } else if (node) {
      const svg = document.getElementById('gitpat-net-svg');
      if (svg) {
        const svgRect = svg.getBoundingClientRect();
        clientX = svgRect.left + (node.x / 960) * svgRect.width;
        clientY = svgRect.top + (node.y / 500) * svgRect.height;
      }
    }

    if (clientX === undefined) return;

    const cardWidth = 320;
    const cardHeight = card.offsetHeight || 260;

    let left = clientX - rect.left + 20;
    let top = clientY - rect.top - 40;

    if (left + cardWidth > rect.width - 15) {
      left = clientX - rect.left - cardWidth - 20;
    }
    if (top + cardHeight > rect.height - 15) {
      top = rect.height - cardHeight - 15;
    }
    if (top < 15) top = 15;
    if (left < 15) left = 15;

    card.style.left = `${left}px`;
    card.style.top = `${top}px`;
  }

  function togglePinInventorNode(nodeId, evt) {
    if (state.pinnedNodeId === nodeId) {
      unpinGitpatNode();
    } else {
      state.pinnedNodeId = nodeId;
      highlightInventorNode(nodeId, evt);
    }
  }

  window.unpinGitpatNode = function() {
    state.pinnedNodeId = null;
    const card = document.getElementById('gitpat-net-hover-card');
    if (card) {
      card.classList.remove('pinned');
    }
    unhighlightInventorNode(state.hoveredNodeId);
  };

  window.setGitpatNetworkOrg = function(orgId) {
    state.networkOrgId = orgId;
    state.pinnedNodeId = null;
    state.networkRepoFilter = 'all';
    renderInventorsView();
    setTimeout(() => {
      const activePill = document.querySelector('.gitpat-net-org-pill.active');
      if (activePill) {
        activePill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }, 50);
  };

  window.setGitpatNetworkConnMode = function(mode) {
    state.networkConnMode = mode;
    state.pinnedNodeId = null;
    renderInventorsView();
  };

  window.setGitpatNetworkRepoFilter = function(repo) {
    state.networkRepoFilter = repo;
    state.pinnedNodeId = null;
    renderInventorsView();
  };

  // Bootstrap when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
