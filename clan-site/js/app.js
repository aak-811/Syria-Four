let adminPassword = 'syria2026';
let adminPassword2 = 'aak1qusai7';
let chiefPassword = 'Za3im1syria';

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function $(id) { return document.getElementById(id); }

function loadingState(text) {
  return `<div class="loading-state"><i class="fas fa-spinner"></i><p>${text}</p></div>`;
}

function emptyState(text, icon = 'fa-inbox') {
  return `<div class="empty-state"><i class="fas ${icon}"></i><p>${text}</p></div>`;
}

function errorState(text) {
  return `<div class="error-state"><i class="fas fa-exclamation-triangle"></i><p>${text}</p></div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  if ($('loadingScreen')) initLoadingScreen();
  if ($('navbar')) initNavbar();
  if ($('particlesCanvas')) initParticles();
  if (document.querySelector('.stat-number')) initCounters();
  if (document.querySelector('.scroll-indicator')) initScrollIndicator();
  if ($('videoGrid')) loadVideos();
  if ($('galleryGrid')) loadGallery();
  if ($('leadersGrid')) loadLeaders();
  if ($('membersGrid')) loadMembers();
  if ($('memberDetail')) loadMemberDetail();
  if ($('leaderDetail')) loadLeaderDetail();
  if ($('tournamentContent')) loadTournaments();
  if ($('tournamentDetail')) loadTournamentDetail();
  if ($('eventsGrid')) loadEvents();
  if ($('leaderboardBody')) loadLeaderboard();
  if ($('shopGrid')) loadShop();
  if ($('instagramGrid')) loadInstagram();
  if ($('supportTeam')) loadSupportTeam();
  if ($('siteBanner')) loadBanner();
  if ($('shopForm')) initShopForm();
  if ($('supportForm')) initSupportForm();
  if ($('lightbox')) initLightbox();
  if ($('footerSocial')) loadFooterSocial();
  if ($('memberSearch')) initMemberSearch();
  initScrollReveal();
  finishLoading();
});

window.submitAdminLogin = async function(e) {
  e.preventDefault();
  const pwd = $('adminPassword').value;
  try {
    const res = await fetch('/api/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pwd })
    });
    const data = await res.json();
    if (res.ok && data.redirect) {
      window.location.href = data.redirect;
    } else {
      showToast(data.error || 'كلمة المرور خاطئة', 'error');
    }
  } catch(err) {
    // Fallback to client-side check if server is down
    if (pwd === adminPassword || pwd === adminPassword2 || pwd === chiefPassword) {
      window.location.href = '/';
    } else {
      showToast('كلمة المرور خاطئة', 'error');
    }
  }
  return false;
};

window.checkAdmin = function() {
  submitAdminLogin(new Event('submit'));
};

window.checkChiefAdmin = function() {
  submitAdminLogin(new Event('submit'));
};

function initScrollReveal() {
  const cards = document.querySelectorAll('.member-card, .leader-card, .player-card, .video-card, .gallery-card, .tournament-card, .shop-card, .earnings-card, .rule-card, .support-member, .instagram-card');
  if (cards.length === 0) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
  });
}

function initMemberSearch() {
  const input = $('memberSearch');
  const clear = $('searchClear');
  const suggestions = $('searchSuggestions');
  let debounce;
  input.addEventListener('input', function() {
    clear.style.display = this.value ? 'block' : 'none';
    clearDebounce(debounce);
    debounce = setTimeout(() => {
      const q = this.value.trim().toLowerCase();
      if (!q) { suggestions.innerHTML = ''; suggestions.style.display = 'none'; filterMembers(''); return; }
      const matches = (window.allMembers || []).filter(m =>
        (m.name && m.name.toLowerCase().includes(q)) ||
        (m.gameId && m.gameId.toLowerCase().includes(q))
      ).slice(0, 6);
      if (matches.length === 0) { suggestions.innerHTML = ''; suggestions.style.display = 'none'; filterMembers(q); return; }
      suggestions.style.display = 'block';
      suggestions.innerHTML = matches.map(m => `
        <div class="suggestion-item" onclick="selectSuggestion('${escHtml(m.name)}')">
          <img src="${m.image || '/images/favicon.png'}" alt="${escHtml(m.name)}">
          <div>
            <strong>${escHtml(m.name)}</strong>
            <small>${m.gameId ? 'ID: ' + escHtml(m.gameId) : ''}</small>
          </div>
        </div>
      `).join('');
      filterMembers(q);
    }, 250);
  });
  clear.addEventListener('click', () => {
    input.value = '';
    clear.style.display = 'none';
    suggestions.innerHTML = '';
    suggestions.style.display = 'none';
    filterMembers('');
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) { suggestions.style.display = 'none'; }
  });
}

function selectSuggestion(name) {
  $('memberSearch').value = name;
  $('searchSuggestions').innerHTML = '';
  $('searchSuggestions').style.display = 'none';
  filterMembers(name);
}

function clearDebounce(timer) {
  if (timer) clearTimeout(timer);
}

function skeletonGrid() {
  return Array(6).fill(`
    <div class="skeleton-card">
      <div class="skeleton-img"></div>
      <div class="skeleton-body">
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
      </div>
    </div>
  `).join('');
}

async function loadMembers() {
  const grid = $('membersGrid');
  if (!grid) return;
  grid.innerHTML = skeletonGrid();
  try {
    const members = await DB.getMembers();
    if (!members || members.length === 0) {
      grid.innerHTML = emptyState('لا يوجد أعضاء', 'fa-users');
      window.allMembers = [];
      return;
    }
    window.allMembers = members;
    renderMemberGrid(members);
    setupMemberFilters();
  } catch (err) {
    grid.innerHTML = errorState('فشل تحميل الأعضاء');
  }
}

function renderMemberGrid(members) {
  const grid = $('membersGrid');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
  grid.style.gap = '20px';
  if (!members || members.length === 0) {
    grid.innerHTML = emptyState('لا توجد نتائج للبحث', 'fa-search');
    return;
  }
  grid.innerHTML = members.map(m => `
    <div class="member-enh-card" onclick="window.location.href='/member-detail?id=${m.id}'">
      <div class="enh-avatar-wrap">
        <div class="enh-avatar-sm">
          <img src="${m.image || '/images/favicon.png'}" alt="${escHtml(m.name)}" loading="lazy">
        </div>
      </div>
      <div class="enh-body-sm">
        <h3>${escHtml(m.name)}</h3>
      </div>
    </div>
  `).join('');
}

function roleName(r) {
  const names = { leader: 'قائد', vice: 'شريك قائد', chief: 'زعيم' };
  return names[r] || 'عضو';
}

function filterMembers(query) {
  if (!window.allMembers) return;
  const q = query.trim().toLowerCase();
  const rank = $('filterRank')?.value || '';
  const country = $('filterCountry')?.value || '';
  const sort = $('filterSort')?.value || 'name';
  let filtered = window.allMembers;
  if (q) {
    filtered = filtered.filter(m =>
      (m.name && m.name.toLowerCase().includes(q)) ||
      (m.gameId && m.gameId.toLowerCase().includes(q))
    );
  }
  if (rank) filtered = filtered.filter(m => m.rank === rank);
  if (country) filtered = filtered.filter(m => m.country === country);
  if (sort === 'level') filtered.sort((a, b) => (parseInt(b.level) || 0) - (parseInt(a.level) || 0));
  else if (sort === 'date') filtered.sort((a, b) => (b.joinDate || '').localeCompare(a.joinDate || ''));
  else filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  renderMemberGrid(filtered);
}

function setupMemberFilters() {
  ['filterRank', 'filterCountry', 'filterSort'].forEach(id => {
    const el = $(id);
    if (el) el.addEventListener('change', () => filterMembers($('memberSearch')?.value || ''));
  });
}

async function loadMemberDetail() {
  const container = $('memberDetail');
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) { container.innerHTML = errorState('لم يتم تحديد عضو'); return; }
  try {
    container.innerHTML = loadingState('جاري تحميل ملف العضو...');
    const members = await DB.getMembers();
    const m = members.find(x => x.id === id);
    if (!m) { container.innerHTML = errorState('العضو غير موجود'); return; }
    const role = m.role || '';
    const roleNames = { leader: 'قائد', vice: 'شريك قائد', chief: 'زعيم' };
    const roleIcons = { leader: 'fa-crown', vice: 'fa-star', chief: 'fa-shield-halved' };
    const roleName = roleNames[role] || '';
    const roleIcon = roleIcons[role] || '';
    const winsVal = parseInt(m.wins) || 0;
    // Build 2-column info items
    const infoItems = [];
    if (m.gameId) infoItems.push({ label: 'أيدي اللاعب', icon: 'fa-id-card', val: escHtml(m.gameId) });
    if (m.level) infoItems.push({ label: 'المستوى', icon: 'fa-level-up-alt', val: escHtml(m.level) });
    if (m.country) infoItems.push({ label: 'الدولة', icon: 'fa-map-marker-alt', val: escHtml(m.country) });
    if (m.age) infoItems.push({ label: 'العمر', icon: 'fa-birthday-cake', val: escHtml(m.age) });
    if (m.prime) infoItems.push({ label: 'برايم', icon: 'fa-star', val: '★'.repeat(parseInt(m.prime)) });
    if (m.joinDate) infoItems.push({ label: 'تاريخ الانضمام', icon: 'fa-calendar-plus', val: escHtml(m.joinDate) });
    if (m.weapon) infoItems.push({ label: 'السلاح المفضل', icon: 'fa-crosshairs', val: escHtml(m.weapon) });
    if (winsVal > 0) infoItems.push({ label: 'الانتصارات', icon: 'fa-trophy', val: winsVal });
    if (m.rank) infoItems.push({ label: 'الرتبة', icon: 'fa-shield-alt', val: escHtml(m.rank) });
    if (m.instagram) infoItems.push({ label: 'Instagram', icon: 'fab fa-instagram', val: '@' + escHtml(m.instagram) });
    const gridHtml = infoItems.map(item => `
      <div class="member-detail-info-item">
        <span class="label">${item.label}</span>
        <span class="value"><i class="fas ${item.icon}"></i> ${item.val}</span>
      </div>`).join('');
    container.innerHTML = `
      <div class="member-detail-card">
        <div class="member-detail-avatar">
          <img src="${m.image || '/images/favicon.png'}" alt="${escHtml(m.name)}" loading="lazy">
        </div>
        <h1 class="member-detail-name">${escHtml(m.name)}</h1>
        ${roleName ? `<p class="member-detail-role"><i class="fas ${roleIcon}"></i> ${roleName}</p>` : ''}
        <div class="member-detail-info-grid">
          ${gridHtml}
        </div>
        ${m.bio ? `<div class="member-detail-bio"><i class="fas fa-quote-right"></i> ${escHtml(m.bio)}</div>` : ''}
        ${m.images && m.images.length > 0 ? `
        <div class="member-detail-gallery">
          <h3><i class="fas fa-images"></i> صور العضو</h3>
          <div class="member-gallery-grid">
            ${m.images.map(url => `
              <div class="member-gallery-item" onclick="openMemberImage('${escHtml(url)}')">
                <img src="${url}" alt="صورة العضو" loading="lazy">
              </div>`).join('')}
          </div>
        </div>` : ''}
        <div style="display:flex;justify-content:center;flex-wrap:wrap;gap:10px;margin-top:25px">
          <a href="/members" class="btn btn-secondary member-detail-btn"><i class="fas fa-arrow-right"></i> العودة للأعضاء</a>
        </div>
      </div>`;
    if ($('profileTitle')) $('profileTitle').textContent = escHtml(m.name);
    document.title = `SYRIA FOUR | ${escHtml(m.name)}`;
  } catch (err) {
    container.innerHTML = errorState('فشل تحميل ملف العضو');
  }
}

window.openMemberImage = function(url) {
  const overlay = document.createElement('div');
  overlay.className = 'image-lightbox';
  overlay.innerHTML = `<div class="lightbox-content" onclick="event.stopPropagation()"><img src="${url}"><button class="lightbox-close" onclick="this.closest('.image-lightbox').remove()"><i class="fas fa-times"></i></button></div>`;
  overlay.addEventListener('click', () => overlay.remove());
  document.body.appendChild(overlay);
  document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', esc); } });
};

async function loadLeaderDetail() {
  const container = $('leaderDetail');
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) { container.innerHTML = errorState('لم يتم تحديد قائد'); return; }
  try {
    container.innerHTML = loadingState('جاري تحميل القائد...');
    const members = await DB.getMembers();
    const m = members.find(x => x.id === id);
    if (!m) { container.innerHTML = errorState('القائد غير موجود'); return; }
    const role = m.role || 'leader';
    const roleNames = { leader: 'قائد', vice: 'شريك قائد', chief: 'زعيم' };
    const roleIcons = { leader: 'fa-crown', vice: 'fa-star', chief: 'fa-shield-halved' };
    const roleName = roleNames[role] || 'قائد';
    const roleIcon = roleIcons[role] || 'fa-crown';
    const isFullAdmin = role === 'leader' || role === 'vice';
    const adminPanelLink = isFullAdmin ? '/admin' : '/admin-chief';
    const adminBtnText = isFullAdmin ? 'لوحة الإدارة الكاملة' : 'لوحة إدارة الزعيم';
    const adminBtnColor = isFullAdmin ? 'btn-primary' : 'btn-secondary';
    const winsVal = parseInt(m.wins) || 0;
    // Build 2-column info items
    const infoItems = [];
    infoItems.push({ label: 'الصلاحية', icon: roleIcon, val: roleName });
    if (m.gameId) infoItems.push({ label: 'أيدي اللاعب', icon: 'fa-id-card', val: escHtml(m.gameId) });
    if (m.level) infoItems.push({ label: 'المستوى', icon: 'fa-level-up-alt', val: escHtml(m.level) });
    if (m.country) infoItems.push({ label: 'الدولة', icon: 'fa-map-marker-alt', val: escHtml(m.country) });
    if (m.age) infoItems.push({ label: 'العمر', icon: 'fa-birthday-cake', val: escHtml(m.age) });
    if (m.prime) infoItems.push({ label: 'برايم', icon: 'fa-star', val: '★'.repeat(parseInt(m.prime)) });
    if (m.joinDate) infoItems.push({ label: 'تاريخ الانضمام', icon: 'fa-calendar-plus', val: escHtml(m.joinDate) });
    if (m.weapon) infoItems.push({ label: 'السلاح المفضل', icon: 'fa-crosshairs', val: escHtml(m.weapon) });
    if (winsVal > 0) infoItems.push({ label: 'الانتصارات', icon: 'fa-trophy', val: winsVal });
    if (m.rank) infoItems.push({ label: 'الرتبة', icon: 'fa-shield-alt', val: escHtml(m.rank) });
    if (m.instagram) infoItems.push({ label: 'Instagram', icon: 'fab fa-instagram', val: '@' + escHtml(m.instagram) });
    const gridHtml = infoItems.map(item => `
      <div class="member-detail-info-item">
        <span class="label">${item.label}</span>
        <span class="value"><i class="fas ${item.icon}"></i> ${item.val}</span>
      </div>`).join('');
    container.innerHTML = `
      <div class="member-detail-card leader-detail-card">
        <div class="member-detail-avatar">
          <img src="${m.image || '/images/favicon.png'}" alt="${escHtml(m.name)}">
        </div>
        <h1 class="member-detail-name">${escHtml(m.name)}</h1>
        <div class="member-detail-info-grid">
          ${gridHtml}
        </div>
        ${m.bio ? `<div class="member-detail-bio"><i class="fas fa-quote-right"></i> ${escHtml(m.bio)}</div>` : ''}
        ${m.images && m.images.length > 0 ? `
        <div class="member-detail-gallery">
          <h3><i class="fas fa-images"></i> صور العضو</h3>
          <div class="member-gallery-grid">
            ${m.images.map(url => `
              <div class="member-gallery-item" onclick="openMemberImage('${escHtml(url)}')">
                <img src="${url}" alt="صورة العضو" loading="lazy">
              </div>`).join('')}
          </div>
        </div>` : ''}
        <div style="display:flex;justify-content:center;flex-wrap:wrap;gap:10px;margin-top:25px">
          ${m.instagram ? `<a href="https://instagram.com/${m.instagram}" target="_blank" class="btn btn-accent member-detail-btn"><i class="fab fa-instagram"></i> @${escHtml(m.instagram)}</a>` : ''}
          <a href="${adminPanelLink}" class="btn ${adminBtnColor} member-detail-btn"><i class="fas fa-cog"></i> ${adminBtnText}</a>
          <a href="/leaders" class="btn btn-secondary member-detail-btn"><i class="fas fa-arrow-right"></i> العودة للقيادات</a>
        </div>
      </div>`;
    document.title = `SYRIA FOUR | ${roleName} ${escHtml(m.name)}`;
  } catch (err) {
    container.innerHTML = errorState('فشل تحميل القائد');
  }
}

let loadingScreenShown = false;
let loadingScreenTimer = null;

function initLoadingScreen() {
  const screen = $('loadingScreen');
  const progress = $('loaderProgress');
  if (!screen) return;

  // Don't show if page loads quickly (under 300ms)
  loadingScreenTimer = setTimeout(() => {
    loadingScreenShown = true;
    screen.style.opacity = '1';
    screen.style.display = 'flex';
    // Animate progress bar
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) { p = 100; clearInterval(interval); }
      progress.style.width = p + '%';
    }, 200);
    // Store cleanup on window for ready callback
    window.__hideLoading = function() {
      progress.style.width = '100%';
      clearInterval(interval);
      setTimeout(() => {
        screen.classList.add('hidden');
        setTimeout(() => {
          screen.remove();
          window.__hideLoading = null;
        }, 300);
      }, 300);
    };
  }, 300);

  // If page loads before 300ms, cancel and remove immediately
  requestAnimationFrame(() => {
    setTimeout(() => {
      if (!loadingScreenShown) {
        clearTimeout(loadingScreenTimer);
        screen.remove();
      }
    }, 0);
  });
}

// Call this when page is fully ready
function finishLoading() {
  if (window.__hideLoading) window.__hideLoading();
  else {
    const screen = $('loadingScreen');
    if (screen) screen.remove();
  }
}

function initNavbar() {
  const navbar = $('navbar');
  const toggle = $('navToggle');
  const menu = $('navMenu');
  toggle.addEventListener('click', () => menu.classList.toggle('open'));
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => menu.classList.remove('open'));
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === window.location.pathname);
  });
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

function initParticles() {
  const canvas = $('particlesCanvas');
  for (let i = 0; i < 80; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    particle.style.animationDelay = (Math.random() * 10) + 's';
    particle.style.width = particle.style.height = (Math.random() * 4 + 2) + 'px';
    const colors = ['var(--primary)', 'var(--secondary)', 'var(--accent)'];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    canvas.appendChild(particle);
  }
}

const pendingUploads = { images: [], videos: [] };
let uploadIdCounter = 0;

function dropZoneHTML(id, accept, hint, multiple) {
  return `<div class="drop-zone" id="${id}" style="margin-bottom:20px">
    <i class="fas fa-cloud-upload-alt"></i>
    <p>اسحب الملف إلى هنا</p>
    <p class="drop-hint">${hint}</p>
    <input type="file" accept="${accept}" style="display:none" ${multiple ? 'multiple' : ''}>
  </div>
  <div id="${id}Status" style="text-align:center;margin-bottom:20px"></div>`;
}

function initAdminDropZone(zoneId, accept, multiple, callback) {
  const zone = document.getElementById(zoneId);
  if (!zone) return;
  const input = zone.querySelector('input[type="file"]');
  zone.addEventListener('click', () => input.click());
  zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    const files = multiple ? Array.from(e.dataTransfer.files) : [e.dataTransfer.files[0]];
    files.forEach(f => {
      if (f && f.type.startsWith(accept.split('/')[0] + '/')) callback(f);
      else showToast('نوع الملف غير مدعوم', 'error');
    });
  });
  input.addEventListener('change', () => {
    const files = multiple ? Array.from(input.files) : [input.files[0]];
    files.forEach(f => { if (f) callback(f); });
    input.value = '';
  });
}

function addPendingFile(file, type) {
  const id = ++uploadIdCounter;
  const title = file.name.replace(/\.[^/.]+$/, '');
  const reader = new FileReader();
  reader.onload = function(e) {
    const preview = e.target.result;
    const item = { id, title, file, preview, replace: false };
    if (type === 'image') pendingUploads.images.push(item);
    else pendingUploads.videos.push({ ...item, thumbnail: '', thumbPreview: '' });
    renderPendingItems(type);
  };
  reader.readAsDataURL(file);
}

function renderPendingItems(type) {
  const list = type === 'image' ? pendingUploads.images : pendingUploads.videos;
  const container = document.getElementById(type === 'image' ? 'pendingImages' : 'pendingVideos');
  if (!container) return;
  if (list.length === 0) { container.innerHTML = ''; return; }
  container.innerHTML = list.map(item => `
    <div class="pending-item" data-id="${item.id}">
      <div class="pending-preview">
        ${item.replace ? '<i class="fas fa-sync-alt"></i>' :
          type === 'image'
            ? `<img src="${item.preview}" alt="${item.title}">`
            : `<video src="${item.preview}" muted></video>`}
      </div>
      <div class="pending-info">
        <input type="text" class="pending-name" value="${item.title}" data-id="${item.id}" dir="auto">
        ${type === 'video' ? `
        <div class="pending-thumb-zone" data-id="${item.id}" id="thumbZone${item.id}">
          ${item.thumbPreview ? `
            <img src="${item.thumbPreview}" class="thumb-preview" data-id="${item.id}">
            <button class="pending-btn pending-remove-thumb" onclick="removePendingThumb(${item.id})" title="إزالة الصورة"><i class="fas fa-times"></i></button>
          ` : `
            <i class="fas fa-image"></i>
            <span>صورة مصغرة</span>
            <input type="file" accept="image/*" style="display:none">
          `}
        </div>` : ''}
      </div>
      <div class="pending-actions">
        <button class="pending-btn pending-replace" onclick="replacePendingFile(${item.id}, '${type}')" title="استبدال الملف"><i class="fas fa-exchange-alt"></i></button>
        <button class="pending-btn pending-remove" onclick="removePendingItem(${item.id}, '${type}')" title="إزالة"><i class="fas fa-times"></i></button>
      </div>
    </div>
  `).join('');
  container.querySelectorAll('.pending-name').forEach(inp => {
    inp.addEventListener('change', function() {
      const idx = list.findIndex(i => i.id === parseInt(this.dataset.id));
      if (idx > -1) list[idx].title = this.value;
    });
  });
  if (type === 'video') {
    container.querySelectorAll('.pending-thumb-zone').forEach(zone => {
      const id = parseInt(zone.dataset.id);
      const input = zone.querySelector('input[type="file"]');
      if (!input) return;
      zone.addEventListener('click', () => input.click());
      zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('drag-over'); });
      zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) uploadPendingThumbnail(id, file);
        else showToast('يرجى اختيار صورة', 'error');
      });
      input.addEventListener('change', () => {
        if (input.files[0]) uploadPendingThumbnail(id, input.files[0]);
        input.value = '';
      });
    });
  }
}

window.replacePendingFile = function(id, type) {
  const list = type === 'image' ? pendingUploads.images : pendingUploads.videos;
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = type === 'image' ? 'image/*' : 'video/*';
  input.click();
  input.addEventListener('change', function() {
    const file = this.files[0];
    if (!file) return;
    const idx = list.findIndex(i => i.id === id);
    if (idx === -1) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      list[idx].file = file;
      list[idx].preview = e.target.result;
      list[idx].replace = true;
      renderPendingItems(type);
    };
    reader.readAsDataURL(file);
  });
};

window.removePendingItem = function(id, type) {
  const list = type === 'image' ? pendingUploads.images : pendingUploads.videos;
  const idx = list.findIndex(i => i.id === id);
  if (idx > -1) list.splice(idx, 1);
  renderPendingItems(type);
};

async function uploadPendingThumbnail(id, file) {
  const list = pendingUploads.videos;
  const idx = list.findIndex(i => i.id === id);
  if (idx === -1) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    list[idx].thumbPreview = e.target.result;
    renderPendingItems('video');
  };
  reader.readAsDataURL(file);
  try {
    const result = await DB.uploadFile(file);
    list[idx].thumbnail = result.url;
    const zone = document.getElementById('thumbZone' + id);
    if (zone) {
      zone.style.borderColor = '#4caf50';
      const span = zone.querySelector('span');
      if (span) span.textContent = 'تم الرفع';
    }
    showToast('تم رفع الصورة المصغرة', 'success');
    renderPendingItems('video');
  } catch (err) {
    showToast('فشل رفع الصورة', 'error');
  }
}

window.removePendingThumb = function(id) {
  const list = pendingUploads.videos;
  const idx = list.findIndex(i => i.id === id);
  if (idx === -1) return;
  delete list[idx].thumbnail;
  delete list[idx].thumbPreview;
  renderPendingItems('video');
};

async function savePendingUploads(type) {
  const list = type === 'image' ? pendingUploads.images : pendingUploads.videos;
  if (list.length === 0) { showToast('لا يوجد ملفات للحفظ', 'info'); return; }
  if (!confirm(`تأكيد حفظ ${list.length} ملف؟`)) return;
  const status = document.getElementById(type === 'image' ? 'galleryDropZoneStatus' : 'videoDropZoneStatus');
  status.innerHTML = '<div class="loading-state"><i class="fas fa-spinner"></i><p>جاري الحفظ...</p></div>';
  let success = 0, fail = 0;
  for (const item of list) {
    try {
      const result = await DB.uploadFile(item.file);
      if (type === 'image') {
        await DB.addGalleryImage({ label: item.title, src: result.url });
      } else {
        await DB.addVideo({ title: item.title, url: result.url, thumbnail: item.thumbnail || '' });
      }
      success++;
    } catch (err) {
      fail++;
    }
  }
  if (type === 'image') pendingUploads.images = []; else pendingUploads.videos = [];
  status.innerHTML = `<div style="color:#4caf50"><i class="fas fa-check-circle"></i> تم حفظ ${success} ملف${fail ? '، فشل ' + fail : ''}</div>`;
  showToast(`تم حفظ ${success} ملف بنجاح`, 'success');
  if (type === 'image') renderAdminGallery(); else renderAdminVideos();
}

async function initCounters() {
  const statMembers = $('statMembers');
  const statTournaments = $('statTournaments');
  const statWins = $('statWins');
  if (!statMembers && !statTournaments && !statWins) return;

  async function fetchStats() {
    try {
      const [members, tournaments] = await Promise.all([
        DB.getMembers().catch(() => []),
        DB.getTournaments().catch(() => [])
      ]);
      return {
        members: members.length || 0,
        tournaments: tournaments.length || 0,
        wins: members.reduce((sum, m) => sum + (parseInt(m.wins) || 0), 0) || 0
      };
    } catch {
      return null;
    }
  }

  const stats = await fetchStats();
  const targets = {
    members: stats?.members ?? 0,
    tournaments: stats?.tournaments ?? 0,
    wins: stats?.wins ?? 0
  };

  function animateCounter(el, target) {
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const skeleton = el.querySelector('.skeleton-stat');
        if (skeleton) skeleton.remove();
        if (target === 0) {
          el.textContent = '0';
          observer.unobserve(el);
          return;
        }
        let current = 0;
        const duration = 1200;
        const stepMs = 20;
        const totalSteps = duration / stepMs;
        const increment = target / totalSteps;
        const interval = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(interval);
          }
          el.textContent = Math.floor(current);
        }, stepMs);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });
    observer.observe(el);
  }

  animateCounter(statMembers, targets.members);
  animateCounter(statTournaments, targets.tournaments);
  animateCounter(statWins, targets.wins);
}

function initScrollIndicator() {
  const indicator = document.querySelector('.scroll-indicator');
  if (indicator) {
    indicator.addEventListener('click', () => {
      document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
    });
  }
}

async function loadVideos() {
  const grid = $('videoGrid');
  try {
    grid.innerHTML = loadingState('جاري تحميل الفيديوهات...');
    const videos = await DB.getVideos();
    if (!videos || videos.length === 0) {
      grid.innerHTML = emptyState('لا توجد فيديوهات بعد', 'fa-video');
      return;
    }
    grid.innerHTML = videos.map(v => `
      <div class="video-card" onclick="openVideo('${v.url || ''}')">
        <div class="video-thumb" ${v.thumbnail ? `style="background-image:url('${v.thumbnail}');background-size:cover;background-position:center"` : ''}>
          <i class="fas fa-play-circle"></i>
        </div>
        <div class="video-info">
          <h4>${v.title || 'فيديو'}</h4>
        </div>
      </div>
    `).join('');
  } catch (err) {
    grid.innerHTML = errorState('فشل تحميل الفيديوهات');
  }
}

async function loadGallery() {
  const grid = $('galleryGrid');
  try {
    grid.innerHTML = loadingState('جاري تحميل الصور...');
    const images = await DB.getGalleryImages();
    if (!images || images.length === 0) {
      grid.innerHTML = emptyState('لا توجد صور بعد', 'fa-image');
      return;
    }
    grid.innerHTML = images.map(img => `
      <div class="gallery-card" onclick="openLightbox('${img.src || ''}', '${img.label || ''}', 'image')">
        ${img.src ? `<img src="${img.src}" alt="${img.label || ''}">` :
        `<div class="gallery-placeholder"><i class="fas fa-image"></i><span>${img.label || 'صورة'}</span></div>`}
      </div>
    `).join('');
  } catch (err) {
    grid.innerHTML = errorState('فشل تحميل الصور');
  }
}

let lightboxZoom = 1;

function openLightbox(src, caption, type) {
  const lb = $('lightbox');
  const img = $('lightboxImage');
  const video = $('lightboxVideo');
  const cap = $('lightboxCaption');
  const wrap = lb.querySelector('.lightbox-media-wrap');
  img.style.display = 'none';
  video.style.display = 'none';
  lightboxZoom = 1;
  if (wrap) wrap.style.transform = 'scale(1)';
  if (type === 'image' && src) {
    img.src = src;
    img.style.display = 'block';
  } else if (type === 'video' && src) {
    video.src = src;
    video.style.display = 'block';
    video.play().catch(() => {});
  }
  cap.textContent = caption || '';
  lb.style.display = 'flex';
  lb.classList.add('lightbox-active');
  setTimeout(() => lb.classList.add('lightbox-visible'), 50);
}

function initLightbox() {
  $('lightboxClose').addEventListener('click', closeLightbox);
  $('lightbox').addEventListener('click', (e) => {
    if (e.target === $('lightbox')) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
  const zoomIn = $('lightboxZoomIn');
  const zoomOut = $('lightboxZoomOut');
  if (zoomIn) zoomIn.addEventListener('click', () => zoomLightbox(0.25));
  if (zoomOut) zoomOut.addEventListener('click', () => zoomLightbox(-0.25));
}

function closeLightbox() {
  const lb = $('lightbox');
  lb.classList.remove('lightbox-visible');
  setTimeout(() => {
    lb.style.display = 'none';
    const v = $('lightboxVideo');
    if (v) v.pause();
  }, 300);
}

function zoomLightbox(delta) {
  lightboxZoom = Math.max(0.5, Math.min(3, lightboxZoom + delta));
  const wrap = $('lightbox').querySelector('.lightbox-media-wrap');
  if (wrap) wrap.style.transform = `scale(${lightboxZoom})`;
}

function openVideo(url) {
  if (url) openLightbox(url, '', 'video');
  else showToast('لا يوجد رابط فيديو', 'error');
}

async function loadLeaders() {
  const grid = $('leadersGrid');
  try {
    grid.innerHTML = loadingState('جاري تحميل القيادات...');
    const members = await DB.getMembers();
    const roleNames = { leader: 'قائد', vice: 'شريك قائد', chief: 'زعيم' };
    const roleIcons = { leader: 'fa-crown', vice: 'fa-star', chief: 'fa-shield-halved' };
    const roleColors = { leader: 'var(--accent)', vice: 'var(--secondary)', chief: 'var(--primary-light)' };
    const leaders = members.filter(m => m.role && (m.role === 'leader' || m.role === 'vice' || m.role === 'chief'));
    if (leaders.length === 0) {
      grid.innerHTML = emptyState('لا توجد قيادات بعد', 'fa-crown');
      return;
    }
    const grouped = { leader: [], vice: [], chief: [] };
    leaders.forEach(l => { if (grouped[l.role]) grouped[l.role].push(l); });
    let html = '';
    const sections = [
      { key: 'leader', title: 'القادة', icon: 'fa-crown', desc: 'قادة SYRIA FOUR الذين يقودون المسيرة' },
      { key: 'vice', title: 'شركاء القادة', icon: 'fa-star', desc: 'شركاء القادة في SYRIA FOUR' },
      { key: 'chief', title: 'الزعماء', icon: 'fa-shield-halved', desc: 'زعماء SYRIA FOUR' }
    ];
    sections.forEach(sec => {
      const items = grouped[sec.key];
      if (!items || items.length === 0) return;
      html += '<div class="leaders-grid">';
      items.forEach(l => {
        const rn = roleNames[l.role] || 'قائد';
        html += `
          <div class="leader-card" onclick="window.location.href='/leader-detail?id=${l.id}'">
            <div class="leader-avatar">
              <img src="${l.image || '/images/favicon.png'}" alt="${l.name}">
            </div>
            <h3>${l.name}</h3>
            <p class="leader-role"><i class="fas ${roleIcons[l.role] || 'fa-crown'}" style="color:${roleColors[l.role] || 'var(--accent)'}"></i> ${rn}</p>
            ${l.instagram ? `<a href="https://instagram.com/${l.instagram}" target="_blank" class="leader-instagram" onclick="event.stopPropagation()"><i class="fab fa-instagram"></i> @${l.instagram}</a>` : ''}
          </div>`;
      });
      html += '</div>';
    });
    grid.innerHTML = html;
  } catch (err) {
    grid.innerHTML = errorState('فشل تحميل القيادات');
  }
}

async function loadAllPlayers(filter = 'all') {
  const grid = $('allPlayersGrid');
  try {
    grid.innerHTML = loadingState('جاري تحميل اللاعبين...');
    const players = await DB.getPlayers();
    if (!players || players.length === 0) {
      grid.innerHTML = emptyState('لا يوجد لاعبين', 'fa-users');
      return;
    }
    const leaders = ['ᴛʜᴇ ᴋɪɴɢ', '𝕷𝖊𝖌𝖊𝖓𝖉'];
    let filtered = players;
    if (filter === 'leader') filtered = players.filter(p => leaders.includes(p.name));
    else if (filter === 'member') filtered = players.filter(p => !leaders.includes(p.name));
    grid.innerHTML = filtered.map(p => `
      <div class="player-card" onclick="openPlayerModal('${p.slug}')">
        <div class="player-avatar">
          <img src="${p.profileImage || '/images/favicon.png'}" alt="${p.name}">
        </div>
        <h3>${p.name}</h3>
        <p class="player-rank">${p.rank || '—'}</p>
        <p class="player-level">المستوى ${p.level || '—'} • ${p.likes ? (p.likes / 1000).toFixed(1) + 'K' : '—'} لايك</p>
      </div>
    `).join('');
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        loadAllPlayers(btn.dataset.filter);
      });
    });
  } catch (err) {
    grid.innerHTML = errorState('فشل تحميل اللاعبين');
  }
}

function openPlayerModal(slug) {
  const modal = $('playerModal');
  const content = $('playerModalContent');
  modal.style.display = 'flex';
  content.innerHTML = loadingState('جاري تحميل البيانات...');
  DB.getPlayerBySlug(slug).then(p => {
    if (!p) { content.innerHTML = errorState('اللاعب غير موجود'); return; }
    content.innerHTML = `
      <div style="text-align:center">
        <div style="width:100px;height:100px;border-radius:50%;margin:0 auto 15px;background:var(--bg-dark);border:3px solid var(--primary);display:flex;align-items:center;justify-content:center;font-size:2.5rem;overflow:hidden;">
          <img src="${p.profileImage || '/images/favicon.png'}" style="width:100%;height:100%;object-fit:cover">
        </div>
        <h2 style="margin-bottom:5px">${p.name}</h2>
        <p style="color:var(--accent);margin-bottom:5px">${p.rank || '—'}</p>
        <p style="color:var(--text-dim);font-size:0.9rem">المستوى ${p.level || '—'} • ${p.uid || '—'}</p>
        <hr style="border-color:var(--border);margin:20px 0">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;text-align:right">
          <div><small style="color:var(--text-muted)">الدولة</small><p>${p.country || '—'}</p></div>
          <div><small style="color:var(--text-muted)">اللغة</small><p>${p.language || '—'}</p></div>
          <div><small style="color:var(--text-muted)">الكلان</small><p>${p.clan || '—'}</p></div>
          <div><small style="color:var(--text-muted)">الموسم</small><p>${p.season || '—'}</p></div>
          <div><small style="color:var(--text-muted)">RP</small><p>${p.rankPoints || '—'}</p></div>
          <div><small style="color:var(--text-muted)">الشارات</small><p>${p.badges || '—'}</p></div>
        </div>
        ${p.bio ? `<hr style="border-color:var(--border);margin:20px 0"><p style="color:var(--text-dim)">${p.bio}</p>` : ''}
        <button class="btn btn-secondary" style="margin-top:20px;width:100%" onclick="closePlayerModal()">إغلاق</button>
      </div>
    `;
  }).catch(() => {
    content.innerHTML = errorState('فشل تحميل البيانات');
  });
}

function closePlayerModal() {
  $('playerModal').style.display = 'none';
}


async function loadTournaments(type = 'all') {
  const content = $('tournamentContent');
  try {
    content.innerHTML = loadingState('جاري تحميل البطولات...');
    const tournaments = await DB.getTournaments();
    if (!tournaments || tournaments.length === 0) {
      content.innerHTML = emptyState('لا توجد بطولات', 'fa-trophy');
      return;
    }
    const filtered = type === 'all' ? tournaments : tournaments.filter(t => t.type === type);
    if (filtered.length === 0) {
      content.innerHTML = emptyState(`لا توجد بطولات ${type === 'previous' ? 'سابقة' : type === 'current' ? 'حالية' : 'قادمة'}`, 'fa-trophy');
      return;
    }
    content.innerHTML = filtered.map(t => `
      <div class="tournament-card clickable" onclick="location.href='/tournament-detail?id=${t.id}'">
        <h3><i class="fas fa-trophy" style="color:var(--accent)"></i> ${t.name}</h3>
        <p>${t.description || ''}</p>
        <div class="tournament-date"><i class="far fa-calendar"></i> ${t.date || '—'}</div>
        ${t.gold ? `<div style="margin-top:10px;color:var(--accent)"><i class="fas fa-medal"></i> الذهب: ${t.gold}</div>` : ''}
        ${t.silver ? `<div style="color:var(--text-dim)"><i class="fas fa-medal"></i> الفضة: ${t.silver}</div>` : ''}
        ${t.type ? `<div style="margin-top:8px"><span class="tournament-type-badge type-${t.type}">${t.type === 'previous' ? 'سابقة' : t.type === 'current' ? 'حالية' : 'قادمة'}</span></div>` : ''}
      </div>
    `).join('');
  } catch (err) {
    content.innerHTML = errorState('فشل تحميل البطولات');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.tournament-tabs')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadTournaments(btn.dataset.tab);
  });
});

async function loadTournamentDetail() {
  const container = $('tournamentDetail');
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) {
    container.innerHTML = errorState('معرف البطولة غير موجود');
    return;
  }
  try {
    container.innerHTML = loadingState('جاري تحميل تفاصيل البطولة...');
    const tournaments = await DB.getTournaments();
    const t = tournaments.find(t => t.id === id);
    if (!t) {
      container.innerHTML = errorState('البطولة غير موجودة');
      return;
    }
    document.title = `SYRIA FOUR | ${t.name}`;
    if ($('detailTitle')) $('detailTitle').textContent = t.name;
    if ($('detailSubtitle')) $('detailSubtitle').textContent = t.description || 'معلومات البطولة';

    const modeText = t.mode === 'br' ? 'بربرة' : t.mode === 'headshot' ? 'هيد شوت' : t.mode || '—';
    const mapTypeText = t.mapType === 'snow' ? 'ثلج' : t.mapType === 'normal' ? 'عادية' : t.mapType || '—';
    const persistentText = t.persistent === 'permanent' ? 'دائم' : t.persistent === 'temporary' ? 'غير دائم' : t.persistent || '—';
    const mapDesignText = t.mapDesign === 'ranked' ? 'رانكد' : t.mapDesign === 'clash' ? 'كلاش' : t.mapDesign === 'custom' ? 'خريطة مصممة' : t.mapDesign || '—';
    const prizeTypeText = t.prizeType === 'diamonds' ? 'جواهر' : t.prizeType === 'account' ? 'حساب' : t.prizeType === 'prime' ? 'هدية برايم' : t.prizeType === 'cash' ? 'نقد' : t.prizeType || '—';

    const participants = Array.isArray(t.participants) ? t.participants : [];

    container.innerHTML = `
      <div class="detail-card">
        <div class="detail-header">
          <span class="tournament-type-badge type-${t.type}">${t.type === 'previous' ? 'سابقة' : t.type === 'current' ? 'حالية' : 'قادمة'}</span>
          <h2>${escHtml(t.name)}</h2>
        </div>
        <div class="detail-info-grid">
          <div class="detail-info-item">
            <span class="detail-label"><i class="far fa-calendar-alt"></i> تاريخ البداية</span>
            <span class="detail-value">${t.startDate || '—'}</span>
          </div>
          <div class="detail-info-item">
            <span class="detail-label"><i class="far fa-calendar-check"></i> تاريخ النهاية</span>
            <span class="detail-value">${t.endDate || '—'}</span>
          </div>
          <div class="detail-info-item">
            <span class="detail-label"><i class="fas fa-users"></i> عدد اللاعبين</span>
            <span class="detail-value">${t.maxPlayers || '—'}</span>
          </div>
          <div class="detail-info-item">
            <span class="detail-label"><i class="fas fa-crosshairs"></i> طريقة اللعب</span>
            <span class="detail-value">${modeText}</span>
          </div>
          <div class="detail-info-item">
            <span class="detail-label"><i class="fas fa-map"></i> نوع الخريطة</span>
            <span class="detail-value">${mapTypeText}</span>
          </div>
          <div class="detail-info-item">
            <span class="detail-label"><i class="fas fa-clock"></i> النوع</span>
            <span class="detail-value">${persistentText}</span>
          </div>
          <div class="detail-info-item">
            <span class="detail-label"><i class="fas fa-layer-group"></i> نوع التصميم</span>
            <span class="detail-value">${mapDesignText}</span>
          </div>
          <div class="detail-info-item">
            <span class="detail-label"><i class="fas fa-crown"></i> عدد الفائزين</span>
            <span class="detail-value">${t.winners || '—'}</span>
          </div>
          <div class="detail-info-item">
            <span class="detail-label"><i class="fas fa-gift"></i> الجائزة</span>
            <span class="detail-value">${prizeTypeText}${t.prizeValue ? ' - ' + t.prizeValue : ''}</span>
          </div>
          ${t.gold ? `<div class="detail-info-item"><span class="detail-label"><i class="fas fa-medal" style="color:var(--accent)"></i> الذهب</span><span class="detail-value">${escHtml(t.gold)}</span></div>` : ''}
          ${t.silver ? `<div class="detail-info-item"><span class="detail-label"><i class="fas fa-medal" style="color:silver"></i> الفضة</span><span class="detail-value">${escHtml(t.silver)}</span></div>` : ''}
        </div>
        ${t.description ? `<div class="detail-bio"><h3>الوصف</h3><p>${escHtml(t.description)}</p></div>` : ''}
        <div class="detail-participants">
          <h3><i class="fas fa-users"></i> اللاعبين المسجلين (${participants.length})</h3>
          ${participants.length > 0 ? `
          <div class="approved-players-grid">
            ${participants.map(p => {
              const name = typeof p === 'string' ? p : (p.name || '');
              const gameId = typeof p === 'string' ? '' : (p.gameId || '');
              return `<div class="approved-player-card"><div class="approved-player-avatar"><i class="fas fa-user"></i></div><span>${escHtml(name)}</span>${gameId ? `<small>${escHtml(gameId)}</small>` : ''}</div>`;
            }).join('')}
          </div>` : `<p class="text-muted">لا يوجد لاعبين مسجلين بعد</p>`}
        </div>
        ${t.type === 'upcoming' ? `
        <div style="text-align:center;margin-top:25px">
          <button class="btn btn-accent" onclick="showJoinRequestForm('${t.id}','${escHtml(t.name)}')"><i class="fas fa-hand-paper"></i> طلب انضمام للبطولة</button>
        </div>` : ''}
        <div style="text-align:center;margin-top:15px">
          <a href="/tournaments" class="btn btn-secondary"><i class="fas fa-arrow-right"></i> عودة إلى البطولات</a>
        </div>
      </div>`;
  } catch (err) {
    container.innerHTML = errorState('فشل تحميل تفاصيل البطولة');
  }
}

window.showJoinRequestForm = function(tournamentId, tournamentName) {
  const overlay = document.createElement('div');
  overlay.className = 'join-request-modal';
  overlay.innerHTML = `
    <div class="join-request-content">
      <h3><i class="fas fa-hand-paper"></i> طلب انضمام للبطولة</h3>
      <p style="color:var(--accent);margin-bottom:15px">${escHtml(tournamentName)}</p>
      <form onsubmit="submitJoinRequest(event,'${tournamentId}')">
        <div class="form-group"><label>الاسم في اللعبة *</label><input type="text" id="reqPlayerName" required></div>
        <div class="form-group"><label>الأيدي (Game ID) *</label><input type="text" id="reqPlayerGameId" required></div>
        <div class="form-group"><label>سبب الانضمام *</label><textarea id="reqReason" rows="3" required></textarea></div>
        <div style="display:flex;gap:10px">
          <button type="submit" class="btn btn-primary" style="flex:1"><i class="fas fa-paper-plane"></i> إرسال</button>
          <button type="button" class="btn btn-secondary" style="flex:1" onclick="this.closest('.join-request-modal').remove()">إلغاء</button>
        </div>
      </form>
    </div>`;
  document.body.appendChild(overlay);
};

window.submitJoinRequest = async function(e, tournamentId) {
  e.preventDefault();
  const data = {
    tournamentId,
    playerName: $('reqPlayerName').value,
    playerGameId: $('reqPlayerGameId').value,
    reason: $('reqReason').value,
    status: 'pending',
  };
  try {
    await DB.addRequest(data);
    document.querySelector('.join-request-modal')?.remove();
    showToast('تم إرسال طلب الانضمام بنجاح، ينتظر الموافقة', 'success');
  } catch (err) {
    showToast('فشل إرسال الطلب', 'error');
  }
};

async function loadEvents() {
  const grid = $('eventsGrid');
  try {
    grid.innerHTML = loadingState('جاري تحميل الفعاليات...');
    const events = await DB.getEvents();
    if (!events || events.length === 0) {
      grid.innerHTML = emptyState('لا توجد فعاليات', 'fa-calendar');
      return;
    }
    grid.innerHTML = events.map(e => {
      let icon = 'fa-clock';
      if (e.icon === 'fire') icon = 'fa-fire';
      else if (e.icon === 'war') icon = 'fa-crosshairs';
      return `
        <div class="earnings-card">
          <i class="fas ${icon}"></i>
          <h3>${e.title}</h3>
          <p>${e.description || ''}</p>
        </div>
      `;
    }).join('');
  } catch (err) {
    grid.innerHTML = errorState('فشل تحميل الفعاليات');
  }
}

async function loadLeaderboard() {
  const body = $('leaderboardBody');
  try {
    const entries = await DB.getLeaderboard();
    if (!entries || entries.length === 0) {
      body.innerHTML = '<tr><td colspan="4" style="color:var(--text-muted);padding:30px">لا توجد بيانات</td></tr>';
      return;
    }
    body.innerHTML = entries.map((e, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${e.name}</td>
        <td>${e.glory || 0}</td>
        <td>${e.wars || 0}</td>
      </tr>
    `).join('');
  } catch (err) {
    body.innerHTML = '<tr><td colspan="4" style="color:var(--primary-light)">فشل التحميل</td></tr>';
  }
}

const shopPackages = [
  { gems: 70, label: '70 جوهرة' },
  { gems: 140, label: '140 جوهرة' },
  { gems: 355, label: '355 جوهرة', badge: 'الأكثر مبيعاً', bonus: '+10 هدية' },
  { gems: 720, label: '720 جوهرة', bonus: '+25 هدية' },
  { gems: 1450, label: '1450 جوهرة', bonus: '+70 هدية' },
  { gems: 2900, label: '2900 جوهرة', bonus: '+150 هدية' },
  { gems: 4350, label: '4350 جوهرة', bonus: '+250 هدية' },
  { gems: 7200, label: '7200 جوهرة', bonus: '+500 هدية' },
];

function loadShop() {
  const grid = $('shopGrid');
  grid.innerHTML = shopPackages.map((p, i) => `
    <div class="shop-card" onclick="selectShopPackage(${i})">
      ${p.badge ? `<span class="shop-badge">${p.badge}</span>` : ''}
      <div class="shop-gems">💎 ${p.gems}</div>
      <div class="shop-desc">${p.label} ${p.bonus ? '<br><span style="color:var(--accent)">🎁 ' + p.bonus + '</span>' : ''}</div>
    </div>
  `).join('');
}

window.selectShopPackage = function(index) {
  const pkg = shopPackages[index];
  const select = $('item');
  if (select) {
    select.value = pkg.gems + '_diamonds';
    select.scrollIntoView({ behavior: 'smooth', block: 'center' });
    select.style.borderColor = 'var(--accent)';
    select.style.boxShadow = '0 0 20px var(--glow-gold)';
    setTimeout(() => {
      select.style.borderColor = '';
      select.style.boxShadow = '';
    }, 2000);
  }
};

function initShopForm() {
  $('shopForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      playerName: form.playerName.value,
      playerId: form.playerId.value,
      item: form.item.value,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };
    try {
      await DB.addOrder(data);
      showToast('تم إرسال طلب الشحن بنجاح', 'success');
      form.reset();
    } catch (err) {
      showToast('فشل إرسال الطلب', 'error');
    }
  });
}

function initSupportForm() {
  $('supportForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      playerName: form.playerName.value,
      type: form.type.value,
      message: form.message.value,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };
    try {
      await DB.addSupportRequest(data);
      showToast('تم إرسال طلب الدعم بنجاح', 'success');
      form.reset();
    } catch (err) {
      showToast('فشل إرسال الطلب', 'error');
    }
  });
}

async function loadInstagram() {
  const grid = $('instagramGrid');
  try {
    const accounts = await DB.getInstagramAccounts();
    if (!accounts || accounts.length === 0) {
      grid.innerHTML = emptyState('لا توجد حسابات', 'fa-instagram');
      return;
    }
    grid.innerHTML = accounts.map(a => `
      <div class="instagram-card">
        <i class="fas ${a.icon === 'crown' ? 'fa-crown' : 'fa-knight'}" style="color:var(--accent)"></i>
        <h4>${a.name}</h4>
        <a href="https://instagram.com/${a.username}" target="_blank"><i class="fab fa-instagram"></i> @${a.username}</a>
      </div>
    `).join('');
  } catch (err) {
    grid.innerHTML = errorState('فشل تحميل الحسابات');
  }
}

async function loadSupportTeam() {
  const container = $('supportTeam');
  try {
    const members = await DB.getMembers();
    const support = members.filter(m => m.name === 'أبو أمير' || m.name === 'قصي | QUSAI');
    container.innerHTML = support.map(m => `
      <div class="support-member">
        <i class="fas ${m.name === 'أبو أمير' ? 'fa-crown' : 'fa-knight'}" style="color:var(--accent)"></i>
        <h4>${m.name}</h4>
        <p>${m.name === 'أبو أمير' ? 'مؤسس الكلان' : 'قائد الكلان'}</p>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = '<p style="color:var(--text-dim)">فشل تحميل فريق الدعم</p>';
  }
}

async function loadFooterSocial() {
  const container = $('footerSocial');
  try {
    const accounts = await DB.getInstagramAccounts();
    if (accounts && accounts.length > 0) {
      container.innerHTML = accounts.map(a =>
        `<a href="https://instagram.com/${a.username}" target="_blank" title="${a.name}"><i class="fab fa-instagram"></i></a>`
      ).join('');
    }
  } catch (err) {}
}

async function loadBanner() {
  const banner = $('siteBanner');
  try {
    const notifications = await DB.getNotifications();
    const active = notifications.find(n => n.active === true);
    if (active) {
      banner.textContent = active.message;
      banner.style.display = 'block';
    } else {
      banner.style.display = 'none';
    }
  } catch (err) {
    banner.style.display = 'none';
  }
}

document.querySelectorAll('.admin-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    showAdminTab(tab.dataset.admin);
  });
});

async function renderAdminDashboard() {
  try {
    const [members, tournaments, orders, support] = await Promise.all([
      DB.getMembers().catch(() => []),
      DB.getTournaments().catch(() => []),
      DB.getOrders().catch(() => []),
      DB.getSupportRequests().catch(() => [])
    ]);
    const statsHtml = `
    <div class="admin-stats">
      <div class="admin-stat-card"><i class="fas fa-users"></i><span class="stat-num">${members.length}</span><span class="stat-label">إجمالي الأعضاء</span></div>
      <div class="admin-stat-card"><i class="fas fa-trophy"></i><span class="stat-num">${tournaments.length}</span><span class="stat-label">البطولات</span></div>
      <div class="admin-stat-card"><i class="fas fa-shopping-cart"></i><span class="stat-num">${orders.length}</span><span class="stat-label">طلبات الشحن</span></div>
      <div class="admin-stat-card"><i class="fas fa-headset"></i><span class="stat-num">${support.length}</span><span class="stat-label">رسائل الدعم</span></div>
    </div>`;
    const existing = document.querySelector('.admin-stats');
    if (existing) existing.outerHTML = statsHtml;
    else $('adminContent').insertAdjacentHTML('beforebegin', statsHtml);
  } catch(e) {}
}

async function updateAdminTabCounts() {}

function showAdminTab(tab) {
  switch (tab) {
    case 'members': renderAdminMembers(); break;
    case 'leaders': renderAdminLeaders(); break;
    case 'tournaments': renderAdminTournaments(); break;
    case 'events': renderAdminEvents(); break;
    case 'leaderboard': renderAdminLeaderboard(); break;
    case 'orders': renderAdminOrders(); break;
    case 'support': renderAdminSupport(); break;
    case 'instagram': renderAdminInstagram(); break;
    case 'gallery': renderAdminGallery(); break;
    case 'videos': renderAdminVideos(); break;
    case 'notifications': renderAdminNotifications(); break;
    case 'roles': renderAdminRoles(); break;
    case 'requests': renderAdminRequests(); break;
    case 'users': renderAdminUsers(); break;
    case 'audit': renderAdminAuditLogs(); break;

  }
}

async function renderAdminMembers() {
  const container = $('adminContent');
  try {
    const members = await DB.getMembers();
    let html = `<button class="admin-btn-add" onclick="showAddMemberForm()"><i class="fas fa-plus"></i> إضافة عضو</button>
      <div class="admin-bulk-bar" id="bulkBar"><span>تم تحديد <strong id="bulkCount">0</strong> عضو</span>
      <button class="admin-btn admin-btn-delete" onclick="bulkDeleteMembers()"><i class="fas fa-trash"></i> حذف المحدد</button>
      <button class="admin-btn admin-btn-edit" onclick="clearBulkSelection()" style="background:rgba(255,170,0,0.15);color:var(--accent);border:1px solid rgba(255,170,0,0.2)">إلغاء التحديد</button></div>
      <div class="admin-table-toolbar">
        <div class="admin-search-box"><i class="fas fa-search"></i><input type="text" id="adminMemberSearch" placeholder="ابحث عن عضو..." oninput="filterAdminMembers(this.value)"></div>
      </div>
      <div class="admin-table-wrapper"><table class="admin-table">
      <thead><tr><th style="width:40px"><input type="checkbox" class="admin-checkbox" id="selectAllMembers" onchange="toggleAllMembers(this.checked)"></th><th>الصورة</th><th>الاسم</th><th>أيدي</th><th>المستوى</th><th>برايم</th><th>الصلاحية</th><th>الدولة</th><th>Instagram</th><th>الإجراءات</th></tr></thead><tbody id="adminMembersBody">`;
    const roleNames = { leader: 'قائد', vice: 'شريك قائد', chief: 'زعيم' };
    members.forEach(m => {
      const primeHtml = m.prime ? `<span class="prime-star-badge">${'★'.repeat(parseInt(m.prime))}</span>` : '—';
      const roleHtml = m.role ? roleNames[m.role] || m.role : '—';
      html += `<tr data-id="${m.id}">
        <td><input type="checkbox" class="admin-checkbox member-check" value="${m.id}" onchange="updateBulkBar()"></td>
        <td><img src="${m.image || '/images/favicon.png'}" style="width:35px;height:35px;border-radius:50%;object-fit:cover;border:2px solid var(--accent)"></td>
        <td>${escHtml(m.name)}</td><td>${m.gameId || '—'}</td><td>${m.level || '—'}</td>
        <td>${primeHtml}</td><td>${roleHtml}</td><td>${m.country || '—'}</td>
        <td>${m.instagram ? '<i class="fab fa-instagram"></i> @' + escHtml(m.instagram) : '—'}</td>
        <td class="admin-actions">
          <button class="admin-btn admin-btn-edit" onclick="showAddMemberForm('${m.id}')"><i class="fas fa-edit"></i></button>
          <button class="admin-btn admin-btn-delete" onclick="deleteMember('${m.id}')"><i class="fas fa-trash"></i></button>
        </td></tr>`;
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
    window.membersData = members;
    window._filteredMembers = members;
  } catch (err) {
    container.innerHTML = errorState('فشل تحميل الأعضاء');
  }
}

window.filterAdminMembers = function(query) {
  const q = query.trim().toLowerCase();
  const body = $('adminMembersBody');
  if (!body || !window.membersData) return;
  const rows = body.querySelectorAll('tr');
  let visible = 0;
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    const match = !q || text.includes(q);
    row.style.display = match ? '' : 'none';
    if (match) visible++;
  });
};

window.toggleAllMembers = function(checked) {
  document.querySelectorAll('.member-check').forEach(cb => cb.checked = checked);
  updateBulkBar();
};

window.updateBulkBar = function() {
  const checked = document.querySelectorAll('.member-check:checked').length;
  const bar = $('bulkBar');
  const count = $('bulkCount');
  if (count) count.textContent = checked;
  if (bar) bar.classList.toggle('show', checked > 0);
};

window.clearBulkSelection = function() {
  document.querySelectorAll('.member-check').forEach(cb => cb.checked = false);
  updateBulkBar();
};

window.bulkDeleteMembers = async function() {
  const checked = document.querySelectorAll('.member-check:checked');
  if (checked.length === 0) return;
  if (!confirm(`تأكيد حذف ${checked.length} عضو؟`)) return;
  const ids = Array.from(checked).map(cb => cb.value);
  try {
    await Promise.all(ids.map(id => DB.deleteMember(id)));
    showToast(`تم حذف ${ids.length} عضو`, 'success');
    renderAdminMembers();
  } catch (err) {
    showToast('فشل الحذف', 'error');
  }
};

window.showAddMemberForm = async function(editId) {
  const members = window.membersData || [];
  const edit = editId ? members.find(m => m.id === editId) : null;
  let galleryImages = [];
  try { galleryImages = await DB.getGalleryImages(); } catch(e) {}
  const currentImage = edit ? (edit.image || '/images/clan-logo.png') : '/images/clan-logo.png';
  const rankOptions = ['', 'Rookie','Bronze','Silver','Gold','Platinum','Diamond','Master','Grandmaster','Heroic'];
  const countryOptions = ['', 'سوريا','العراق','مصر','السعودية','الأردن','لبنان','فلسطين','اليمن','ليبيا','تونس','الجزائر','المغرب','السودان','الكويت','قطر','الإمارات','عمان','البحرين'];
  let html = `
    <div style="max-width:700px;margin:0 auto">
      <h3 style="margin-bottom:20px;color:var(--accent);text-align:center">${edit ? 'تعديل عضو' : 'إضافة عضو'}</h3>
      <form onsubmit="saveMember('${editId || ''}');return false">
        <div class="member-avatar-picker">
          <img src="${currentImage}" alt="الصورة" id="memberAvatarPreview" class="member-preview-img">
          <input type="hidden" id="memberImage" value="${currentImage}">
          <div class="member-drop-zone" id="memberDropZone">
            <i class="fas fa-cloud-upload-alt"></i>
            <p>اسحب الصورة إلى هنا</p>
            <p class="drop-hint">أو اضغط لاختيار ملف</p>
            <input type="file" accept="image/*" style="display:none">
          </div>
          <button type="button" class="btn btn-secondary" onclick="openGalleryPicker()" style="margin-top:5px;width:100%"><i class="fas fa-images"></i> اختيار صورة من المعرض</button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px">
          <div class="form-group"><label>الاسم</label><input type="text" id="memberName" value="${edit ? escHtml(edit.name) : ''}" required></div>
          <div class="form-group"><label>أيدي اللاعب (Game ID)</label><input type="text" id="memberGameId" value="${edit ? escHtml(edit.gameId || '') : ''}"></div>
          <div class="form-group"><label>المستوى (Level)</label><input type="number" id="memberLevel" value="${edit ? edit.level || '' : ''}"></div>
          <div class="form-group"><label>الرتبة (Rank)</label><select id="memberRank">${rankOptions.map(r => `<option value="${r}" ${edit && edit.rank === r ? 'selected' : ''}>${r || '— اختر —'}</option>`).join('')}</select></div>
          <div class="form-group"><label>الدولة</label><select id="memberCountry">${countryOptions.map(c => `<option value="${c}" ${edit && edit.country === c ? 'selected' : ''}>${c || '— اختر —'}</option>`).join('')}</select></div>
          <div class="form-group"><label>العمر</label><input type="number" id="memberAge" value="${edit ? edit.age || '' : ''}"></div>
          <div class="form-group"><label>السلاح المفضل</label><input type="text" id="memberWeapon" value="${edit ? escHtml(edit.weapon || '') : ''}"></div>
          <div class="form-group"><label>الانتصارات</label><input type="number" id="memberWins" value="${edit ? edit.wins || '' : ''}"></div>
          <div class="form-group"><label>تاريخ الانضمام</label><input type="date" id="memberJoinDate" value="${edit ? edit.joinDate || '' : ''}"></div>
          <div class="form-group"><label>حساب Instagram</label><input type="text" id="memberInstagram" value="${edit ? escHtml(edit.instagram || '') : ''}"></div>
        </div>
        <div class="form-group"><label>النبذة (Bio)</label><textarea id="memberBio" rows="2">${edit ? escHtml(edit.bio || '') : ''}</textarea></div>
        <div class="form-group"><label>علامة برايم (1-8)</label>
          <div class="prime-badges" id="primeBadgePicker">
            ${[1,2,3,4,5,6,7,8].map(n => `
              <span class="prime-option${edit && edit.prime == n ? ' selected' : ''}" data-prime="${n}" onclick="selectPrime(${n})">
                <span class="prime-star">★</span>${'★'.repeat(n-1)}
              </span>
            `).join('')}
          </div>
          <input type="hidden" id="memberPrime" value="${edit ? edit.prime || '' : ''}">
        </div>
        <div class="form-group" style="margin-top:20px;padding-top:20px;border-top:1px solid var(--border)">
          <label><i class="fas fa-images"></i> صور العضو</label>
          <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:10px">قم برفع صور للعضو (إنجازاته، سكريين شوت، إلخ)</p>
          <div id="memberImagesZone" class="member-images-drop-zone">
            <i class="fas fa-cloud-upload-alt"></i>
            <p>اسحب الصور هنا أو اضغط لاختيارها</p>
            <input type="file" accept="image/*" multiple style="display:none">
          </div>
          <div id="memberImagesPreview" class="member-images-preview">${edit && edit.images && edit.images.length ? edit.images.map(url => `<div class="preview-image-item"><img src="${url}"><span class="remove-image-btn" onclick="removeMemberImage(this,'${url}')"><i class="fas fa-times"></i></span></div>`).join('') : ''}</div>
          <input type="hidden" id="memberImages" value='${edit && edit.images ? JSON.stringify(edit.images) : '[]'}'>
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%"><i class="fas fa-save"></i> حفظ</button>
        <button type="button" class="btn btn-secondary" style="width:100%;margin-top:10px" onclick="renderAdminMembers()">إلغاء</button>
      </form>
    </div>`;
  $('adminContent').innerHTML = html;
  setTimeout(() => {
    const zone = $('memberDropZone');
    if (!zone) return;
    const input = zone.querySelector('input[type="file"]');
    zone.addEventListener('click', () => input.click());
    zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) handleMemberImageUpload(file);
      else showToast('يرجى اختيار صورة', 'error');
    });
    input.addEventListener('change', () => {
      if (input.files[0]) handleMemberImageUpload(input.files[0]);
      input.value = '';
    });
  }, 100);
  // Init member images upload
  setTimeout(() => {
    const imagesZone = $('memberImagesZone');
    if (!imagesZone) return;
    const imagesInput = imagesZone.querySelector('input[type="file"]');
    imagesZone.addEventListener('click', () => imagesInput.click());
    imagesZone.addEventListener('dragover', (e) => { e.preventDefault(); imagesZone.classList.add('drag-over'); });
    imagesZone.addEventListener('dragleave', () => imagesZone.classList.remove('drag-over'));
    imagesZone.addEventListener('drop', (e) => {
      e.preventDefault();
      imagesZone.classList.remove('drag-over');
      const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
      if (files.length > 0) uploadMemberImages(files);
      else showToast('يرجى اختيار صور', 'error');
    });
    imagesInput.addEventListener('change', () => {
      const files = Array.from(imagesInput.files);
      if (files.length > 0) uploadMemberImages(files);
      imagesInput.value = '';
    });
  }, 100);
  window.galleryImagesForPicker = galleryImages;
};

async function uploadMemberImages(files) {
  const preview = $('memberImagesPreview');
  const hidden = $('memberImages');
  const urls = hidden.value ? JSON.parse(hidden.value) : [];
  for (const file of files) {
    // show local preview immediately
    const reader = new FileReader();
    const readerPromise = new Promise(resolve => { reader.onload = e => resolve(e.target.result); });
    reader.readAsDataURL(file);
    const dataUrl = await readerPromise;
    const div = document.createElement('div');
    div.className = 'preview-image-item';
    div.innerHTML = `<img src="${dataUrl}"><span class="loading-spin"></span>`;
    preview.appendChild(div);
    try {
      const result = await DB.uploadFile(file);
      urls.push(result.url);
      div.querySelector('.loading-spin')?.remove();
      const removeBtn = document.createElement('span');
      removeBtn.className = 'remove-image-btn';
      removeBtn.innerHTML = '<i class="fas fa-times"></i>';
      removeBtn.onclick = function() { removeMemberImage(this, result.url); };
      div.appendChild(removeBtn);
      div.querySelector('img').src = result.url;
    } catch (err) {
      div.remove();
      showToast('فشل رفع الصورة', 'error');
    }
  }
  hidden.value = JSON.stringify(urls);
}

window.removeMemberImage = function(el, url) {
  const preview = $('memberImagesPreview');
  const hidden = $('memberImages');
  const urls = hidden.value ? JSON.parse(hidden.value) : [];
  const index = urls.indexOf(url);
  if (index > -1) urls.splice(index, 1);
  hidden.value = JSON.stringify(urls);
  el.closest('.preview-image-item').remove();
};

async function handleMemberImageUpload(file) {
  const preview = $('memberAvatarPreview');
  const hidden = $('memberImage');
  const zone = $('memberDropZone');
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    if (preview) preview.src = e.target.result;
  };
  reader.readAsDataURL(file);
  try {
    const result = await DB.uploadFile(file);
    if (hidden) hidden.value = result.url;
    if (zone) {
      zone.style.borderColor = '#4caf50';
      zone.querySelector('p').textContent = 'تم اختيار الصورة';
      const oldHint = zone.querySelector('.drop-hint');
      if (oldHint) oldHint.textContent = 'اضغط لتغيير الصورة';
    }
    showToast('تم رفع الصورة', 'success');
  } catch (err) {
    showToast('فشل رفع الصورة', 'error');
  }
}

window.selectPrime = function(n) {
  document.querySelectorAll('.prime-option').forEach(el => el.classList.remove('selected'));
  document.querySelector(`.prime-option[data-prime="${n}"]`).classList.add('selected');
  $('memberPrime').value = n;
};

window.openGalleryPicker = function() {
  const images = window.galleryImagesForPicker || [];
  const overlay = document.createElement('div');
  overlay.className = 'image-picker-modal';
  overlay.innerHTML = `
    <div class="image-picker-content">
      <h3 style="margin-bottom:15px;color:var(--accent)">اختر صورة من المعرض</h3>
      <div class="image-picker-grid">
        ${images.length === 0 ? '<p style="color:var(--text-muted)">لا توجد صور في المعرض</p>' :
          images.map(img => `
            <div class="picker-image" onclick="pickGalleryImage('${img.src}')">
              <img src="${img.src}" alt="${img.label || ''}">
              <span>${img.label || ''}</span>
            </div>
          `).join('')}
      </div>
      <button class="btn btn-secondary" onclick="this.closest('.image-picker-modal').remove()" style="width:100%;margin-top:15px">إلغاء</button>
    </div>`;
  document.body.appendChild(overlay);
};

window.pickGalleryImage = function(src) {
  const preview = $('memberAvatarPreview');
  if (preview) preview.src = src;
  const hidden = $('memberImage');
  if (hidden) hidden.value = src;
  document.querySelector('.image-picker-modal')?.remove();
};

function escHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

window.saveMember = async function(id) {
  const data = {
    name: $('memberName').value,
    gameId: $('memberGameId').value,
    level: $('memberLevel').value,
    rank: $('memberRank').value,
    country: $('memberCountry').value,
    age: $('memberAge').value,
    weapon: $('memberWeapon').value,
    wins: $('memberWins').value,
    joinDate: $('memberJoinDate').value,
    instagram: $('memberInstagram').value,
    bio: $('memberBio').value,
    image: $('memberImage').value || '/images/favicon.png',
    prime: $('memberPrime').value || '',
    images: (() => { try { return JSON.parse($('memberImages').value || '[]'); } catch(e) { return []; } })(),
  };
  try {
    if (id) await DB.updateMember(id, data);
    else await DB.addMember(data);
    showToast('تم الحفظ بنجاح', 'success');
    renderAdminMembers();
  } catch (err) {
    showToast('فشل الحفظ', 'error');
  }
};

window.editMember = function(id) { showAddMemberForm(id); };

async function renderAdminLeaders() {
  const container = $('adminContent');
  try {
    const members = await DB.getMembers();
    const leaders = members.filter(m => m.role === 'leader' || m.role === 'vice' || m.role === 'chief');
    const roleNames = { leader: 'قائد', vice: 'شريك قائد', chief: 'زعيم' };
    const roleIcons = { leader: 'fa-crown', vice: 'fa-star', chief: 'fa-shield-halved' };
    let html = `<div class="admin-table-wrapper"><table class="admin-table">
      <thead><tr><th>الصورة</th><th>الاسم</th><th>الصلاحية</th><th>Instagram</th><th>الإجراءات</th></tr></thead><tbody>`;
    if (leaders.length === 0) {
      html += '<tr><td colspan="5" style="color:var(--text-muted)">لا يوجد قادة بعد. عيّن صلاحية عضو من قسم الأعضاء</td></tr>';
    } else {
      leaders.forEach(m => {
        html += `<tr>
          <td><img src="${m.image || '/images/favicon.png'}" style="width:35px;height:35px;border-radius:50%;object-fit:cover;border:2px solid var(--accent)"></td>
          <td>${escHtml(m.name)}</td>
          <td><i class="fas ${roleIcons[m.role] || 'fa-crown'}" style="color:var(--accent)"></i> ${roleNames[m.role] || m.role}</td>
          <td>${m.instagram ? '<i class="fab fa-instagram"></i> @' + escHtml(m.instagram) : '—'}</td>
          <td class="admin-actions">
            <button class="admin-btn admin-btn-edit" onclick="showAddMemberForm('${m.id}')"><i class="fas fa-edit"></i> تعديل</button>
          </td></tr>`;
      });
    }
    html += '</tbody></table></div>';
    container.innerHTML = html;
  } catch (err) {
    container.innerHTML = errorState('فشل تحميل القيادات');
  }
}

async function renderAdminRoles() {
  const container = $('adminContent');
  try {
    const members = await DB.getMembers();
    const roleNames = { leader: 'قائد', vice: 'شريك قائد', chief: 'زعيم' };
    let html = '<div style="margin-bottom:20px"><h3 style="color:var(--accent);margin-bottom:5px"><i class="fas fa-shield-halved"></i> إدارة الصلاحيات</h3><p style="color:var(--text-dim);font-size:0.9rem">يمكن للقادة فقط تعيين صلاحية لأي عضو</p></div>';
    html += '<div class="admin-table-wrapper"><table class="admin-table"><thead><tr><th>الصورة</th><th>الاسم</th><th>الصلاحية الحالية</th><th>تغيير الصلاحية</th><th>حفظ</th></tr></thead><tbody>';
    members.forEach(m => {
      const currentRole = m.role || '';
      const currentRoleName = currentRole ? roleNames[currentRole] : 'عضو عادي';
      html += `<tr>
        <td><img src="${m.image || '/images/favicon.png'}" style="width:35px;height:35px;border-radius:50%;object-fit:cover;border:2px solid var(--accent)"></td>
        <td>${escHtml(m.name)}</td>
        <td><span style="color:${currentRole === 'leader' ? 'var(--accent)' : currentRole === 'vice' ? 'var(--secondary)' : currentRole === 'chief' ? 'var(--primary-light)' : 'var(--text-muted)'}">${currentRole ? '<i class="fas ' + (currentRole === 'leader' ? 'fa-crown' : currentRole === 'vice' ? 'fa-star' : 'fa-shield-halved') + '"></i> ' : ''}${currentRoleName}</span></td>
        <td>
          <select class="role-select" data-member-id="${m.id}" style="padding:6px 10px;border-radius:8px;background:var(--bg-dark);border:1px solid var(--border);color:var(--text);font-family:inherit">
            <option value="">عضو عادي</option>
            <option value="leader" ${currentRole === 'leader' ? 'selected' : ''}>قائد</option>
            <option value="vice" ${currentRole === 'vice' ? 'selected' : ''}>شريك قائد</option>
            <option value="chief" ${currentRole === 'chief' ? 'selected' : ''}>زعيم</option>
          </select>
        </td>
        <td><button class="admin-btn admin-btn-edit" onclick="saveRole('${m.id}')"><i class="fas fa-save"></i> حفظ</button></td>
      </tr>`;
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
  } catch (err) {
    container.innerHTML = errorState('فشل تحميل البيانات');
  }
}

window.saveRole = async function(memberId) {
  const select = document.querySelector(`.role-select[data-member-id="${memberId}"]`);
  if (!select) return;
  const role = select.value;
  try {
    await DB.updateMember(memberId, { role });
    showToast('تم حفظ الصلاحية بنجاح', 'success');
    renderAdminRoles();
  } catch (err) {
    showToast('فشل حفظ الصلاحية', 'error');
  }
};

async function renderAdminRequests() {
  const container = $('adminContent');
  try {
    const [requests, tournaments] = await Promise.all([DB.getRequests(), DB.getTournaments()]);
    const pending = requests.filter(r => r.status === 'pending');
    const history = requests.filter(r => r.status !== 'pending');
    let html = `<h3 style="color:var(--accent);margin-bottom:15px"><i class="fas fa-hand-paper"></i> طلبات الانضمام للبطولات</h3>`;
    if (pending.length === 0) {
      html += `<p style="color:var(--text-muted);margin-bottom:20px">لا توجد طلبات معلقة</p>`;
    } else {
      html += `<p style="color:var(--text-dim);margin-bottom:15px">طلبات معلقة (${pending.length})</p>`;
      html += `<div class="admin-table-wrapper"><table class="admin-table"><thead><tr><th>البطولة</th><th>الاسم</th><th>الأيدي</th><th>السبب</th><th>الإجراءات</th></tr></thead><tbody>`;
      pending.forEach(r => {
        const tn = tournaments.find(t => t.id === r.tournamentId);
        html += `<tr>
          <td>${tn ? escHtml(tn.name) : '—'}</td>
          <td>${escHtml(r.playerName)}</td>
          <td>${escHtml(r.playerGameId)}</td>
          <td style="max-width:200px;font-size:0.85rem;color:var(--text-dim)">${escHtml(r.reason)}</td>
          <td class="admin-actions">
            <button class="admin-btn admin-btn-edit" onclick="approveRequest('${r.id}','${r.tournamentId}','${escHtml(r.playerName)}','${escHtml(r.playerGameId)}')"><i class="fas fa-check"></i></button>
            <button class="admin-btn admin-btn-delete" onclick="rejectRequest('${r.id}')"><i class="fas fa-times"></i></button>
          </td>
        </tr>`;
      });
      html += '</tbody></table></div>';
    }
    if (history.length > 0) {
      html += `<h4 style="color:var(--text-muted);margin:25px 0 10px">السجل</h4>`;
      html += `<div class="admin-table-wrapper"><table class="admin-table"><thead><tr><th>البطولة</th><th>الاسم</th><th>الأيدي</th><th>الحالة</th></tr></thead><tbody>`;
      history.forEach(r => {
        const tn = tournaments.find(t => t.id === r.tournamentId);
        html += `<tr>
          <td>${tn ? escHtml(tn.name) : '—'}</td>
          <td>${escHtml(r.playerName)}</td>
          <td>${escHtml(r.playerGameId)}</td>
          <td>${r.status === 'approved' ? '<span style="color:#4caf50">✔ تمت الموافقة</span>' : '<span style="color:var(--text-muted)">✘ مرفوض</span>'}</td>
        </tr>`;
      });
      html += '</tbody></table></div>';
    }
    container.innerHTML = html;
  } catch (err) {
    container.innerHTML = errorState('فشل تحميل الطلبات');
  }
}

window.approveRequest = async function(requestId, tournamentId, playerName, playerGameId) {
  try {
    const tournaments = await DB.getTournaments();
    const t = tournaments.find(x => x.id === tournamentId);
    if (!t) { showToast('البطولة غير موجودة', 'error'); return; }
    const participants = Array.isArray(t.participants) ? t.participants : [];
    participants.push({ name: playerName, gameId: playerGameId });
    await DB.updateTournament(tournamentId, { participants });
    await DB.updateRequest(requestId, { status: 'approved' });
    showToast('تمت الموافقة على الطلب', 'success');
    renderAdminRequests();
  } catch (err) {
    showToast('فشل الموافقة', 'error');
  }
};

window.rejectRequest = async function(requestId) {
  try {
    await DB.updateRequest(requestId, { status: 'rejected' });
    showToast('تم رفض الطلب', 'info');
    renderAdminRequests();
  } catch (err) {
    showToast('فشل الرفض', 'error');
  }
};

async function renderAdminUsers() {
  const container = $('adminContent');
  try {
    const token = Auth ? Auth.getToken() : localStorage.getItem('syria4_token');
    if (!token) { container.innerHTML = '<p style="color:var(--text-muted)">يرجى تسجيل الدخول أولاً</p>'; return; }
    const res = await fetch('/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } });
    if (!res.ok) { container.innerHTML = '<p style="color:var(--text-muted)">غير مصرح لك</p>'; return; }
    const data = await res.json();
    const users = data.users || [];
    const roleNames = { owner: 'مالك', admin: 'مدير', moderator: 'مشرف', leader: 'قائد', vice: 'شريك قائد', chief: 'زعيم', elite: 'نخبة', member: 'عضو', guest: 'زائر' };
    let html = `<h3 style="color:var(--accent);margin-bottom:15px"><i class="fas fa-user-cog"></i> إدارة المستخدمين (${users.length})</h3>`;
    html += '<div class="admin-table-wrapper"><table class="admin-table"><thead><tr><th>الصورة</th><th>الاسم</th><th>اسم المستخدم</th><th>البريد</th><th>الرتبة</th><th>الحالة</th><th>توثيق</th><th>الإجراءات</th></tr></thead><tbody>';
    users.forEach(u => {
      const statusColor = u.status === 'disabled' ? 'var(--primary)' : '#4caf50';
      const statusText = u.status === 'disabled' ? 'معطل' : u.status === 'pending' ? 'معلق' : 'نشط';
      html += `<tr>
        <td><img src="${u.avatar || '/images/favicon.png'}" style="width:35px;height:35px;border-radius:50%;object-fit:cover;border:2px solid var(--accent)"></td>
        <td>${escHtml(u.name)}</td>
        <td>@${escHtml(u.username)}</td>
        <td style="direction:ltr">${u.email}</td>
        <td>
          <select class="admin-role-select" data-user="${u.id}" onchange="adminUpdateUser('${u.id}','role',this.value)">
            ${Object.entries(roleNames).map(([k,v]) => `<option value="${k}" ${u.role === k ? 'selected' : ''}>${v}</option>`).join('')}
          </select>
        </td>
        <td>
          <select class="admin-status-select" data-user="${u.id}" onchange="adminUpdateUser('${u.id}','status',this.value)">
            <option value="active" ${u.status === 'active' ? 'selected' : ''}>نشط</option>
            <option value="pending" ${u.status === 'pending' ? 'selected' : ''}>معلق</option>
            <option value="disabled" ${u.status === 'disabled' ? 'selected' : ''}>معطل</option>
          </select>
        </td>
        <td><input type="checkbox" ${u.verified ? 'checked' : ''} onchange="adminUpdateUser('${u.id}','verified',this.checked)"></td>
        <td class="admin-actions">
          <button class="admin-btn admin-btn-edit" onclick="adminResetPassword('${u.id}')" title="إعادة تعيين كلمة المرور"><i class="fas fa-key"></i></button>
          <button class="admin-btn admin-btn-delete" onclick="adminDeleteUser('${u.id}')" title="حذف المستخدم"><i class="fas fa-trash"></i></button>
        </td>
      </tr>`;
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
  } catch (err) {
    container.innerHTML = errorState('فشل تحميل المستخدمين');
  }
}

window.adminUpdateUser = async function(userId, field, value) {
  const token = Auth ? Auth.getToken() : localStorage.getItem('syria4_token');
  if (field === 'verified') value = value === true || value === 'true';
  try {
    await fetch(`/api/admin/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ [field]: value }),
    });
    showToast('تم التحديث', 'success');
  } catch (err) {
    showToast('فشل التحديث', 'error');
  }
};

window.adminResetPassword = async function(userId) {
  const newPass = prompt('أدخل كلمة المرور الجديدة (6 أحرف على الأقل):');
  if (!newPass || newPass.length < 6) { showToast('كلمة المرور قصيرة جداً', 'error'); return; }
  const token = Auth ? Auth.getToken() : localStorage.getItem('syria4_token');
  try {
    await fetch(`/api/admin/users/${userId}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ newPassword: newPass }),
    });
    showToast('تم إعادة تعيين كلمة المرور', 'success');
  } catch (err) {
    showToast('فشل إعادة التعيين', 'error');
  }
};

window.adminDeleteUser = async function(userId) {
  if (!confirm('تأكيد حذف هذا المستخدم؟')) return;
  const token = Auth ? Auth.getToken() : localStorage.getItem('syria4_token');
  try {
    await fetch(`/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    showToast('تم الحذف', 'success');
    renderAdminUsers();
  } catch (err) {
    showToast('فشل الحذف', 'error');
  }
};

async function renderAdminAuditLogs() {
  const container = $('adminContent');
  try {
    const token = Auth ? Auth.getToken() : localStorage.getItem('syria4_token');
    if (!token) { container.innerHTML = '<p style="color:var(--text-muted)">يرجى تسجيل الدخول</p>'; return; }
    const res = await fetch('/api/admin/audit-logs', { headers: { 'Authorization': `Bearer ${token}` } });
    if (!res.ok) { container.innerHTML = '<p style="color:var(--text-muted)">غير مصرح</p>'; return; }
    const data = await res.json();
    const logs = data.logs || [];
    let html = `<h3 style="color:var(--accent);margin-bottom:15px"><i class="fas fa-history"></i> سجل النشاط (${logs.length})</h3>`;
    if (logs.length === 0) {
      html += '<p style="color:var(--text-muted)">لا توجد نشاطات</p>';
    } else {
      html += '<div class="admin-table-wrapper"><table class="admin-table"><thead><tr><th>التاريخ</th><th>المستخدم</th><th>الإجراء</th><th>التفاصيل</th><th>IP</th></tr></thead><tbody>';
      logs.slice(0, 200).forEach(l => {
        html += `<tr>
          <td style="font-size:0.85rem">${l.createdAt ? new Date(l.createdAt).toLocaleDateString('ar') : '—'}</td>
          <td>${l.userId ? l.userId.substring(0,8) + '…' : '—'}</td>
          <td>${l.action || '—'}</td>
          <td style="font-size:0.85rem;color:var(--text-dim);max-width:250px">${escHtml(l.details || '')}</td>
          <td style="direction:ltr;font-size:0.85rem">${l.ip || '—'}</td>
        </tr>`;
      });
      html += '</tbody></table></div>';
    }
    container.innerHTML = html;
  } catch (err) {
    container.innerHTML = errorState('فشل تحميل سجل النشاط');
  }
}

window.deleteMember = async function(id) {
  if (!confirm('تأكيد الحذف؟')) return;
  try {
    await DB.deleteMember(id);
    showToast('تم الحذف', 'success');
    renderAdminMembers();
  } catch (err) {
    showToast('فشل الحذف', 'error');
  }
};

async function renderAdminTournaments() {
  const container = $('adminContent');
  try {
    const tournaments = await DB.getTournaments();
    let html = `<button class="admin-btn-add" onclick="showAddTournamentForm()"><i class="fas fa-plus"></i> إضافة بطولة</button>
      <div class="admin-table-wrapper"><table class="admin-table">
      <thead><tr><th>الاسم</th><th>النوع</th><th>التاريخ</th><th>الإجراءات</th></tr></thead><tbody>`;
    tournaments.forEach(t => {
      html += `<tr>
        <td>${t.name}</td><td>${t.type || '—'}</td><td>${t.date || '—'}</td>
        <td class="admin-actions">
          <button class="admin-btn admin-btn-delete" onclick="deleteTournament('${t.id}')"><i class="fas fa-trash"></i></button>
        </td></tr>`;
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
    window.tournamentsData = tournaments;
  } catch (err) {
    container.innerHTML = errorState('فشل تحميل البطولات');
  }
}

window.showAddTournamentForm = function() {
  const html = `
    <div style="max-width:600px;margin:0 auto">
      <h3 style="margin-bottom:20px;color:var(--accent);text-align:center">إضافة بطولة</h3>
      <form onsubmit="saveTournament();return false">
        <div class="form-row-2">
          <div class="form-group"><label>الاسم *</label><input type="text" id="tournamentName" required></div>
          <div class="form-group"><label>النوع</label>
            <select id="tournamentType">
              <option value="previous">سابقة</option>
              <option value="current">حالية</option>
              <option value="upcoming">قادمة</option>
            </select>
          </div>
        </div>
        <div class="form-group"><label>الوصف</label><textarea id="tournamentDesc" rows="3"></textarea></div>
        <div class="form-row-2">
          <div class="form-group"><label>تاريخ البداية</label><input type="date" id="tournamentStartDate"></div>
          <div class="form-group"><label>تاريخ النهاية</label><input type="date" id="tournamentEndDate"></div>
        </div>
        <div class="form-row-2">
          <div class="form-group"><label>عدد اللاعبين</label><input type="number" id="tournamentMaxPlayers" min="1"></div>
          <div class="form-group"><label>طريقة اللعب</label>
            <select id="tournamentMode">
              <option value="">اختر</option>
              <option value="br">بربرة</option>
              <option value="headshot">هيد شوت</option>
            </select>
          </div>
        </div>
        <div class="form-row-2">
          <div class="form-group"><label>نوع الخريطة</label>
            <select id="tournamentMapType">
              <option value="">اختر</option>
              <option value="snow">ثلج</option>
              <option value="normal">عادية</option>
            </select>
          </div>
          <div class="form-group"><label>دائم/غير دائم</label>
            <select id="tournamentPersistent">
              <option value="">اختر</option>
              <option value="permanent">دائم</option>
              <option value="temporary">غير دائم</option>
            </select>
          </div>
        </div>
        <div class="form-row-2">
          <div class="form-group"><label>نوع الخريطة (رانكد/كلاش)</label>
            <select id="tournamentMapDesign">
              <option value="">اختر</option>
              <option value="ranked">رانكد</option>
              <option value="clash">كلاش</option>
              <option value="custom">خريطة مصممة</option>
            </select>
          </div>
          <div class="form-group"><label>عدد الفائزين</label><input type="number" id="tournamentWinners" min="1" max="8"></div>
        </div>
        <div class="form-row-2">
          <div class="form-group"><label>نوع الجائزة</label>
            <select id="tournamentPrizeType">
              <option value="">اختر</option>
              <option value="diamonds">جواهر</option>
              <option value="account">حساب</option>
              <option value="prime">هدية برايم</option>
              <option value="cash">نقد</option>
            </select>
          </div>
          <div class="form-group"><label>قيمة الجائزة</label><input type="text" id="tournamentPrizeValue"></div>
        </div>
        <div class="form-row-2">
          <div class="form-group"><label>الذهب</label><input type="text" id="tournamentGold"></div>
          <div class="form-group"><label>الفضة</label><input type="text" id="tournamentSilver"></div>
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%"><i class="fas fa-save"></i> حفظ</button>
        <button type="button" class="btn btn-secondary" style="width:100%;margin-top:10px" onclick="renderAdminTournaments()">إلغاء</button>
      </form>
    </div>`;
  $('adminContent').innerHTML = html;
};

window.saveTournament = async function() {
  const data = {
    name: $('tournamentName').value,
    type: $('tournamentType').value,
    description: $('tournamentDesc').value,
    date: $('tournamentStartDate').value || '',
    startDate: $('tournamentStartDate').value || '',
    endDate: $('tournamentEndDate').value || '',
    maxPlayers: $('tournamentMaxPlayers').value || '',
    mode: $('tournamentMode').value || '',
    mapType: $('tournamentMapType').value || '',
    persistent: $('tournamentPersistent').value || '',
    mapDesign: $('tournamentMapDesign').value || '',
    winners: $('tournamentWinners').value || '',
    prizeType: $('tournamentPrizeType').value || '',
    prizeValue: $('tournamentPrizeValue').value || '',
    gold: $('tournamentGold').value || '',
    silver: $('tournamentSilver').value || '',
    participants: [],
  };
  try {
    await DB.addTournament(data);
    showToast('تمت الإضافة', 'success');
    renderAdminTournaments();
  } catch (err) {
    showToast('فشل الحفظ', 'error');
  }
};

window.deleteTournament = async function(id) {
  if (!confirm('تأكيد الحذف؟')) return;
  try {
    await DB.deleteTournament(id);
    showToast('تم الحذف', 'success');
    renderAdminTournaments();
  } catch (err) {
    showToast('فشل الحذف', 'error');
  }
};

async function renderAdminEvents() {
  const container = $('adminContent');
  try {
    const events = await DB.getEvents();
    let html = `<button class="admin-btn-add" onclick="showAddEventForm()"><i class="fas fa-plus"></i> إضافة فعالية</button>
      <div class="admin-table-wrapper"><table class="admin-table">
      <thead><tr><th>العنوان</th><th>الوصف</th><th>الإجراءات</th></tr></thead><tbody>`;
    events.forEach(e => {
      html += `<tr>
        <td>${e.title}</td><td style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${e.description || ''}</td>
        <td class="admin-actions">
          <button class="admin-btn admin-btn-delete" onclick="deleteEvent('${e.id}')"><i class="fas fa-trash"></i></button>
        </td></tr>`;
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
  } catch (err) {
    container.innerHTML = errorState('فشل تحميل الفعاليات');
  }
}

window.showAddEventForm = function() {
  const html = `
    <div style="max-width:500px;margin:0 auto">
      <h3 style="margin-bottom:20px;color:var(--accent);text-align:center">إضافة فعالية</h3>
      <form onsubmit="saveEvent();return false">
        <div class="form-group"><label>العنوان</label><input type="text" id="eventTitle" required></div>
        <div class="form-group"><label>الوصف</label><textarea id="eventDesc" rows="3"></textarea></div>
        <div class="form-group"><label>الأيقونة</label>
          <select id="eventIcon">
            <option value="clock">ساعة</option>
            <option value="fire">نار</option>
            <option value="war">حرب</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%"><i class="fas fa-save"></i> حفظ</button>
        <button type="button" class="btn btn-secondary" style="width:100%;margin-top:10px" onclick="renderAdminEvents()">إلغاء</button>
      </form>
    </div>`;
  $('adminContent').innerHTML = html;
};

window.saveEvent = async function() {
  const data = {
    title: $('eventTitle').value,
    description: $('eventDesc').value,
    icon: $('eventIcon').value,
  };
  try {
    await DB.addEvent(data);
    showToast('تمت الإضافة', 'success');
    renderAdminEvents();
  } catch (err) {
    showToast('فشل الحفظ', 'error');
  }
};

window.deleteEvent = async function(id) {
  if (!confirm('تأكيد الحذف؟')) return;
  try {
    await DB.deleteEvent(id);
    showToast('تم الحذف', 'success');
    renderAdminEvents();
  } catch (err) {
    showToast('فشل الحذف', 'error');
  }
};

async function renderAdminLeaderboard() {
  const container = $('adminContent');
  try {
    const entries = await DB.getLeaderboard();
    let html = `<button class="admin-btn-add" onclick="showAddLeaderboardForm()"><i class="fas fa-plus"></i> إضافة ترتيب</button>
      <div class="admin-table-wrapper"><table class="admin-table">
      <thead><tr><th>الاسم</th><th>Glory</th><th>الحروب</th><th>الإجراءات</th></tr></thead><tbody>`;
    entries.forEach(e => {
      html += `<tr>
        <td>${e.name}</td><td>${e.glory || 0}</td><td>${e.wars || 0}</td>
        <td class="admin-actions">
          <button class="admin-btn admin-btn-delete" onclick="deleteLeaderboardEntry('${e.id}')"><i class="fas fa-trash"></i></button>
        </td></tr>`;
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
  } catch (err) {
    container.innerHTML = errorState('فشل تحميل الترتيب');
  }
}

window.showAddLeaderboardForm = function() {
  const html = `
    <div style="max-width:500px;margin:0 auto">
      <h3 style="margin-bottom:20px;color:var(--accent);text-align:center">إضافة ترتيب</h3>
      <form onsubmit="saveLeaderboardEntry();return false">
        <div class="form-group"><label>الاسم</label><input type="text" id="lbName" required></div>
        <div class="form-group"><label>Glory</label><input type="number" id="lbGlory" value="0"></div>
        <div class="form-group"><label>الحروب</label><input type="number" id="lbWars" value="0"></div>
        <button type="submit" class="btn btn-primary" style="width:100%"><i class="fas fa-save"></i> حفظ</button>
        <button type="button" class="btn btn-secondary" style="width:100%;margin-top:10px" onclick="renderAdminLeaderboard()">إلغاء</button>
      </form>
    </div>`;
  $('adminContent').innerHTML = html;
};

window.saveLeaderboardEntry = async function() {
  const data = {
    name: $('lbName').value,
    glory: parseInt($('lbGlory').value) || 0,
    wars: parseInt($('lbWars').value) || 0,
  };
  try {
    await DB.addLeaderboardEntry(data);
    showToast('تمت الإضافة', 'success');
    renderAdminLeaderboard();
  } catch (err) {
    showToast('فشل الحفظ', 'error');
  }
};

window.deleteLeaderboardEntry = async function(id) {
  if (!confirm('تأكيد الحذف؟')) return;
  try {
    await DB.deleteLeaderboardEntry(id);
    showToast('تم الحذف', 'success');
    renderAdminLeaderboard();
  } catch (err) {
    showToast('فشل الحذف', 'error');
  }
};

async function renderAdminOrders() {
  const container = $('adminContent');
  try {
    const orders = await DB.getOrders();
    let html = `<div class="admin-table-wrapper"><table class="admin-table">
      <thead><tr><th>اللاعب</th><th>الباقة</th><th>الحالة</th><th>التاريخ</th><th>الإجراءات</th></tr></thead><tbody>`;
    if (orders.length === 0) html += `<tr><td colspan="5" style="color:var(--text-muted);padding:30px">لا توجد طلبات</td></tr>`;
    orders.forEach(o => {
      html += `<tr>
        <td>${o.playerName || '—'}</td><td>${o.item || '—'}</td>
        <td>${o.status === 'done' ? '<span style="color:#4caf50">تم</span>' : '<span style="color:var(--accent)">قيد الانتظار</span>'}</td>
        <td>${o.date || '—'}</td>
        <td class="admin-actions">
          ${o.status !== 'done' ? `<button class="admin-btn admin-btn-done" onclick="markOrderDone('${o.id}')"><i class="fas fa-check"></i></button>` : ''}
          <button class="admin-btn admin-btn-delete" onclick="deleteOrder('${o.id}')"><i class="fas fa-trash"></i></button>
        </td></tr>`;
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
  } catch (err) {
    container.innerHTML = errorState('فشل تحميل الطلبات');
  }
}

window.markOrderDone = async function(id) {
  try {
    await DB.updateOrderStatus(id);
    showToast('تم تأكيد الطلب', 'success');
    renderAdminOrders();
  } catch (err) {
    showToast('فشل التحديث', 'error');
  }
};

window.deleteOrder = async function(id) {
  if (!confirm('تأكيد الحذف؟')) return;
  try {
    await DB.deleteOrder(id);
    showToast('تم الحذف', 'success');
    renderAdminOrders();
  } catch (err) {
    showToast('فشل الحذف', 'error');
  }
};

async function renderAdminSupport() {
  const container = $('adminContent');
  try {
    const requests = await DB.getSupportRequests();
    let html = `<div class="admin-table-wrapper"><table class="admin-table">
      <thead><tr><th>الاسم</th><th>النوع</th><th>الرسالة</th><th>الحالة</th><th>الإجراءات</th></tr></thead><tbody>`;
    if (requests.length === 0) html += `<tr><td colspan="5" style="color:var(--text-muted);padding:30px">لا توجد طلبات دعم</td></tr>`;
    requests.forEach(r => {
      html += `<tr>
        <td>${r.playerName || '—'}</td><td>${r.type || '—'}</td>
        <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.message || ''}</td>
        <td>${r.status === 'read' ? '<span style="color:var(--text-dim)">مقروء</span>' : '<span style="color:var(--accent)">جديد</span>'}</td>
        <td class="admin-actions">
          ${r.status !== 'read' ? `<button class="admin-btn admin-btn-edit" onclick="viewSupportRequest('${r.id}')"><i class="fas fa-eye"></i></button>` : ''}
          <button class="admin-btn admin-btn-delete" onclick="deleteSupport('${r.id}')"><i class="fas fa-trash"></i></button>
        </td></tr>`;
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
  } catch (err) {
    container.innerHTML = errorState('فشل تحميل طلبات الدعم');
  }
}

window.viewSupportRequest = async function(id) {
  try {
    await DB.markSupportRead(id);
    showToast('تم تحديث الحالة', 'success');
    renderAdminSupport();
  } catch (err) {
    showToast('فشل التحديث', 'error');
  }
};

window.deleteSupport = async function(id) {
  if (!confirm('تأكيد الحذف؟')) return;
  try {
    await DB.deleteSupportRequest(id);
    showToast('تم الحذف', 'success');
    renderAdminSupport();
  } catch (err) {
    showToast('فشل الحذف', 'error');
  }
};

async function renderAdminInstagram() {
  const container = $('adminContent');
  try {
    const accounts = await DB.getInstagramAccounts();
    let html = `<button class="admin-btn-add" onclick="showAddInstagramForm()"><i class="fas fa-plus"></i> إضافة حساب</button>
      <div class="admin-table-wrapper"><table class="admin-table">
      <thead><tr><th>الاسم</th><th>اليوزر</th><th>الإجراءات</th></tr></thead><tbody>`;
    accounts.forEach(a => {
      html += `<tr>
        <td>${a.name}</td><td>@${a.username}</td>
        <td class="admin-actions">
          <button class="admin-btn admin-btn-edit" onclick="editInstagramAccount('${a.id}')"><i class="fas fa-edit"></i></button>
          <button class="admin-btn admin-btn-delete" onclick="deleteInstagramAccount('${a.id}')"><i class="fas fa-trash"></i></button>
        </td></tr>`;
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
    window.instagramData = accounts;
  } catch (err) {
    container.innerHTML = errorState('فشل تحميل الحسابات');
  }
}

window.showAddInstagramForm = function(editId) {
  const accounts = window.instagramData || [];
  const edit = editId ? accounts.find(a => a.id === editId) : null;
  const html = `
    <div style="max-width:500px;margin:0 auto">
      <h3 style="margin-bottom:20px;color:var(--accent);text-align:center">${edit ? 'تعديل حساب' : 'إضافة حساب'}</h3>
      <form onsubmit="saveInstagramAccount('${editId || ''}');return false">
        <div class="form-group"><label>الاسم</label><input type="text" id="instaName" value="${edit ? edit.name : ''}" required></div>
        <div class="form-group"><label>اليوزر (بدون @)</label><input type="text" id="instaUsername" value="${edit ? edit.username : ''}" required></div>
        <div class="form-group"><label>الأيقونة</label>
          <select id="instaIcon">
            <option value="crown" ${edit && edit.icon === 'crown' ? 'selected' : ''}>تاج</option>
            <option value="knight" ${edit && edit.icon === 'knight' ? 'selected' : ''}>فارس</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%"><i class="fas fa-save"></i> حفظ</button>
        <button type="button" class="btn btn-secondary" style="width:100%;margin-top:10px" onclick="renderAdminInstagram()">إلغاء</button>
      </form>
    </div>`;
  $('adminContent').innerHTML = html;
};

window.saveInstagramAccount = async function(id) {
  const data = {
    name: $('instaName').value,
    username: $('instaUsername').value,
    icon: $('instaIcon').value,
  };
  try {
    if (id) await DB.updateInstagramAccount(id, data);
    else await DB.addInstagramAccount(data);
    showToast('تم الحفظ', 'success');
    renderAdminInstagram();
  } catch (err) {
    showToast('فشل الحفظ', 'error');
  }
};

window.editInstagramAccount = function(id) { showAddInstagramForm(id); };

window.deleteInstagramAccount = async function(id) {
  if (!confirm('تأكيد الحذف؟')) return;
  try {
    await DB.deleteInstagramAccount(id);
    showToast('تم الحذف', 'success');
    renderAdminInstagram();
  } catch (err) {
    showToast('فشل الحذف', 'error');
  }
};

async function renderAdminGallery() {
  const container = $('adminContent');
  try {
    const images = await DB.getGalleryImages();
    let html = '<h3 style="margin-bottom:15px;color:var(--accent)"><i class="fas fa-images"></i> إضافة صور جديدة</h3>';
    html += dropZoneHTML('galleryDropZone', 'image/*', 'jpg, png, gif - اسحب الصور أو اضغط للاختيار (متعدد)', true);
    html += '<div id="pendingImages" class="pending-list"></div>';
    html += `<button class="btn btn-primary" onclick="savePendingUploads('image')" style="width:100%;margin-bottom:10px;display:none" id="saveGalleryBtn"><i class="fas fa-save"></i> حفظ الكل ونشرها</button>`;
    html += '<hr style="border-color:var(--border);margin:20px 0"><h3 style="margin-bottom:15px;color:var(--text-dim)">الصور المنشورة</h3>';
    html += `<div class="admin-table-wrapper"><table class="admin-table">
      <thead><tr><th>التسمية</th><th>الصورة</th><th>الإجراءات</th></tr></thead><tbody>`;
    images.forEach(img => {
      html += `<tr>
        <td>${img.label || '—'}</td>
        <td>${img.src ? '<i class="fas fa-check" style="color:#4caf50"></i>' : '<i class="fas fa-times" style="color:var(--primary)"></i>'}</td>
        <td class="admin-actions">
          <button class="admin-btn admin-btn-delete" onclick="deleteGalleryItem('${img.id}', 'gallery')"><i class="fas fa-trash"></i></button>
        </td></tr>`;
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
    pendingUploads.images = [];
    setTimeout(() => {
      initAdminDropZone('galleryDropZone', 'image/*', true, (f) => addPendingFile(f, 'image'));
      const origRender = renderPendingItems;
      const observer = new MutationObserver(() => {
        const saveBtn = $('saveGalleryBtn');
        if (saveBtn) saveBtn.style.display = pendingUploads.images.length > 0 ? 'block' : 'none';
      });
      observer.observe($('pendingImages') || document.body, { childList: true, subtree: true });
    }, 100);
  } catch (err) {
    container.innerHTML = errorState('فشل تحميل الصور');
  }
}

window.deleteGalleryItem = async function(id) {
  if (!confirm('تأكيد الحذف؟')) return;
  try {
    await DB.deleteGalleryImage(id);
    showToast('تم الحذف', 'success');
    renderAdminGallery();
  } catch (err) {
    showToast('فشل الحذف', 'error');
  }
};

async function renderAdminVideos() {
  const container = $('adminContent');
  try {
    const videos = await DB.getVideos();
    let html = '<h3 style="margin-bottom:15px;color:var(--accent)"><i class="fas fa-video"></i> إضافة فيديوهات جديدة</h3>';
    html += dropZoneHTML('videoDropZone', 'video/*', 'mp4, webm, avi - اسحب الفيديو أو اضغط للاختيار (متعدد)', true);
    html += '<div id="pendingVideos" class="pending-list"></div>';
    html += `<button class="btn btn-primary" onclick="savePendingUploads('video')" style="width:100%;margin-bottom:10px;display:none" id="saveVideoBtn"><i class="fas fa-save"></i> حفظ الكل ونشرها</button>`;
    html += '<hr style="border-color:var(--border);margin:20px 0"><h3 style="margin-bottom:15px;color:var(--text-dim)">الفيديوهات المنشورة</h3>';
    html += `<div class="admin-table-wrapper"><table class="admin-table">
      <thead><tr><th>العنوان</th><th>الرابط</th><th>صورة مصغرة</th><th>الإجراءات</th></tr></thead><tbody>`;
    videos.forEach(v => {
      html += `<tr>
        <td>${v.title || '—'}</td>
        <td>${v.url ? '<i class="fas fa-check" style="color:#4caf50"></i>' : '<span style="color:var(--text-muted)">—</span>'}</td>
        <td>${v.thumbnail ? '<i class="fas fa-image" style="color:#4caf50"></i>' : '<span style="color:var(--text-muted)">—</span>'}</td>
        <td class="admin-actions">
          <button class="admin-btn admin-btn-delete" onclick="deleteVideo('${v.id}')"><i class="fas fa-trash"></i></button>
        </td></tr>`;
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
    pendingUploads.videos = [];
    setTimeout(() => {
      initAdminDropZone('videoDropZone', 'video/*', true, (f) => addPendingFile(f, 'video'));
      const obs = new MutationObserver(() => {
        const btn = $('saveVideoBtn');
        if (btn) btn.style.display = pendingUploads.videos.length > 0 ? 'block' : 'none';
      });
      obs.observe($('pendingVideos') || document.body, { childList: true, subtree: true });
    }, 100);
  } catch (err) {
    container.innerHTML = errorState('فشل تحميل الفيديوهات');
  }
}

window.deleteVideo = async function(id) {
  if (!confirm('تأكيد الحذف؟')) return;
  try {
    await DB.deleteVideo(id);
    showToast('تم الحذف', 'success');
    renderAdminVideos();
  } catch (err) {
    showToast('فشل الحذف', 'error');
  }
};

async function renderAdminNotifications() {
  const container = $('adminContent');
  try {
    const notifications = await DB.getNotifications();
    let html = `<button class="admin-btn-add" onclick="showAddNotificationForm()"><i class="fas fa-plus"></i> إضافة إشعار</button>
      <div class="admin-table-wrapper"><table class="admin-table">
      <thead><tr><th>الرسالة</th><th>الحالة</th><th>التاريخ</th><th>الإجراءات</th></tr></thead><tbody>`;
    if (notifications.length === 0) html += `<tr><td colspan="4" style="color:var(--text-muted);padding:30px">لا توجد إشعارات</td></tr>`;
    notifications.forEach(n => {
      html += `<tr>
        <td>${n.message || ''}</td>
        <td>${n.active ? '<span style="color:#4caf50">نشط</span>' : '<span style="color:var(--text-dim)">غير نشط</span>'}</td>
        <td>${n.date || '—'}</td>
        <td class="admin-actions">
          ${!n.active ? `<button class="admin-btn admin-btn-edit" onclick="activateNotification('${n.id}')"><i class="fas fa-eye"></i></button>` : ''}
          <button class="admin-btn admin-btn-delete" onclick="deleteNotification('${n.id}')"><i class="fas fa-trash"></i></button>
        </td></tr>`;
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
  } catch (err) {
    container.innerHTML = errorState('فشل تحميل الإشعارات');
  }
}

window.showAddNotificationForm = function() {
  const html = `
    <div style="max-width:500px;margin:0 auto">
      <h3 style="margin-bottom:20px;color:var(--accent);text-align:center">إضافة إشعار</h3>
      <form onsubmit="saveNotification();return false">
        <div class="form-group"><label>الرسالة</label><textarea id="notifMessage" rows="3" required></textarea></div>
        <button type="submit" class="btn btn-primary" style="width:100%"><i class="fas fa-save"></i> حفظ</button>
        <button type="button" class="btn btn-secondary" style="width:100%;margin-top:10px" onclick="renderAdminNotifications()">إلغاء</button>
      </form>
    </div>`;
  $('adminContent').innerHTML = html;
};

window.saveNotification = async function() {
  const data = {
    message: $('notifMessage').value,
    type: 'info',
    active: false,
    date: new Date().toISOString().split('T')[0],
  };
  try {
    await DB.addNotification(data);
    showToast('تمت الإضافة', 'success');
    renderAdminNotifications();
  } catch (err) {
    showToast('فشل الحفظ', 'error');
  }
};

window.activateNotification = async function(id) {
  try {
    const all = await DB.getNotifications();
    for (const n of all) {
      await DB.updateNotification(n.id, { active: n.id === id });
    }
    showToast('تم التفعيل', 'success');
    renderAdminNotifications();
  } catch (err) {
    showToast('فشل التفعيل', 'error');
  }
};

window.deleteNotification = async function(id) {
  if (!confirm('تأكيد الحذف؟')) return;
  try {
    await DB.deleteNotification(id);
    showToast('تم الحذف', 'success');
    renderAdminNotifications();
  } catch (err) {
    showToast('فشل الحذف', 'error');
  }
};

async function renderAdminPlayers() {
  const container = $('adminContent');
  try {
    const players = await DB.getPlayers();
    let html = `<button class="admin-btn-add" onclick="showAddPlayerForm()"><i class="fas fa-plus"></i> إضافة لاعب</button>
      <div class="admin-table-wrapper"><table class="admin-table">
      <thead><tr><th>الاسم</th><th>الرتبة</th><th>المستوى</th><th>الإجراءات</th></tr></thead><tbody>`;
    players.forEach(p => {
      html += `<tr>
        <td>${p.name}</td><td>${p.rank || '—'}</td><td>${p.level || '—'}</td>
        <td class="admin-actions">
          <button class="admin-btn admin-btn-edit" onclick="editPlayer('${p.slug}')"><i class="fas fa-edit"></i></button>
          <button class="admin-btn admin-btn-delete" onclick="deletePlayer('${p.slug}')"><i class="fas fa-trash"></i></button>
        </td></tr>`;
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
    window.playersData = players;
  } catch (err) {
    container.innerHTML = errorState('فشل تحميل اللاعبين');
  }
}

window.showAddPlayerForm = function(editData) {
  const edit = editData || null;
  const html = `
    <div style="max-width:600px;margin:0 auto">
      <h3 style="margin-bottom:20px;color:var(--accent);text-align:center">${edit ? 'تعديل لاعب' : 'إضافة لاعب'}</h3>
      <form onsubmit="savePlayer('${edit ? edit.slug : ''}');return false">
        <div class="form-group"><label>الاسم</label><input type="text" id="playerName" value="${edit ? edit.name : ''}" required></div>
        <div class="form-group"><label>UID</label><input type="text" id="playerUid" value="${edit ? edit.uid || '' : ''}"></div>
        <div class="form-group"><label>المستوى</label><input type="number" id="playerLevel" value="${edit ? edit.level || '' : ''}"></div>
        <div class="form-group"><label>الرتبة</label>
          <select id="playerRank">
            <option value="Rookie" ${edit && edit.rank === 'Rookie' ? 'selected' : ''}>Rookie</option>
            <option value="Bronze" ${edit && edit.rank === 'Bronze' ? 'selected' : ''}>Bronze</option>
            <option value="Silver" ${edit && edit.rank === 'Silver' ? 'selected' : ''}>Silver</option>
            <option value="Gold" ${edit && edit.rank === 'Gold' ? 'selected' : ''}>Gold</option>
            <option value="Platinum" ${edit && edit.rank === 'Platinum' ? 'selected' : ''}>Platinum</option>
            <option value="Diamond" ${edit && edit.rank === 'Diamond' ? 'selected' : ''}>Diamond</option>
            <option value="Master" ${edit && edit.rank === 'Master' ? 'selected' : ''}>Master</option>
            <option value="Grandmaster" ${edit && edit.rank === 'Grandmaster' ? 'selected' : ''}>Grandmaster</option>
            <option value="Heroic" ${edit && edit.rank === 'Heroic' ? 'selected' : ''}>Heroic</option>
          </select>
        </div>
        <div class="form-group"><label>RP</label><input type="number" id="playerRP" value="${edit ? edit.rankPoints || '' : ''}"></div>
        <div class="form-group"><label>الدولة</label><input type="text" id="playerCountry" value="${edit ? edit.country || '' : ''}"></div>
        <div class="form-group"><label>الموسم</label><input type="text" id="playerSeason" value="${edit ? edit.season || '' : ''}"></div>
        <div class="form-group"><label>الشارات</label><input type="text" id="playerBadges" value="${edit ? edit.badges || '' : ''}"></div>
        <div class="form-group"><label>اللايكات</label><input type="number" id="playerLikes" value="${edit ? edit.likes || '' : ''}"></div>
        <div class="form-group"><label>النبذة</label><textarea id="playerBio" rows="3">${edit ? edit.bio || '' : ''}</textarea></div>
        <button type="submit" class="btn btn-primary" style="width:100%"><i class="fas fa-save"></i> حفظ</button>
        <button type="button" class="btn btn-secondary" style="width:100%;margin-top:10px" onclick="renderAdminPlayers()">إلغاء</button>
      </form>
    </div>`;
  $('adminContent').innerHTML = html;
};

window.savePlayer = async function(slug) {
  const data = {
    name: $('playerName').value,
    uid: $('playerUid').value,
    level: parseInt($('playerLevel').value) || 0,
    rank: $('playerRank').value,
    rankPoints: parseInt($('playerRP').value) || 0,
    country: $('playerCountry').value,
    season: $('playerSeason').value,
    badges: $('playerBadges').value,
    likes: parseInt($('playerLikes').value) || 0,
    bio: $('playerBio').value,
  };
  try {
    if (slug) await DB.updatePlayer(slug, data);
    else await DB.addPlayer(data);
    showToast('تم الحفظ', 'success');
    renderAdminPlayers();
  } catch (err) {
    showToast('فشل الحفظ', 'error');
  }
};

window.editPlayer = async function(slug) {
  try {
    const player = await DB.getPlayerBySlug(slug);
    if (player) showAddPlayerForm(player);
  } catch (err) {
    showToast('فشل تحميل البيانات', 'error');
  }
};

window.deletePlayer = async function(slug) {
  if (!confirm('تأكيد الحذف؟')) return;
  try {
    await DB.deletePlayer(slug);
    showToast('تم الحذف', 'success');
    renderAdminPlayers();
  } catch (err) {
    showToast('فشل الحذف', 'error');
  }
};

$('lightboxClose').addEventListener('click', () => {
  $('lightbox').style.display = 'none';
  const v = $('lightboxVideo');
  if (v) v.pause();
});
