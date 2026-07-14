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

window.checkAdmin = function() {
  const pwd = $('adminPassword').value;
  if (pwd === adminPassword || pwd === adminPassword2) {
    $('adminLogin').style.display = 'none';
    $('adminPanel').style.display = 'block';
    const active = document.querySelector('.admin-tab.active');
    if (active) showAdminTab(active.dataset.admin);
    else showAdminTab('members');
  } else {
    showToast('كلمة المرور خاطئة', 'error');
  }
};

window.checkChiefAdmin = function() {
  const pwd = $('adminPassword').value;
  if (pwd === chiefPassword) {
    $('adminLogin').style.display = 'none';
    $('adminPanel').style.display = 'block';
    const active = document.querySelector('.admin-tab.active');
    if (active) showAdminTab(active.dataset.admin);
    else showAdminTab('members');
  } else {
    showToast('كلمة المرور خاطئة', 'error');
  }
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
  grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(260px, 1fr))';
  grid.style.gap = '20px';
  if (!members || members.length === 0) {
    grid.innerHTML = emptyState('لا توجد نتائج للبحث', 'fa-search');
    return;
  }
  grid.innerHTML = members.map(m => `
    <div class="member-card" onclick="window.location.href='/member-detail?id=${m.id}'">
      <div class="member-avatar">
        <img src="${m.image || '/images/favicon.png'}" alt="${escHtml(m.name)}" loading="lazy">
        ${m.prime ? `<div class="prime-badge">${'★'.repeat(parseInt(m.prime))}</div>` : ''}
      </div>
      <div class="member-info">
        <h3>${escHtml(m.name)}</h3>
        ${m.level ? `<p><i class="fas fa-level-up-alt"></i> المستوى: ${escHtml(m.level)}</p>` : ''}
        ${m.gameId ? `<p><i class="fas fa-id-card"></i> ID: ${escHtml(m.gameId)}</p>` : ''}
        ${m.country ? `<p><i class="fas fa-map-marker-alt"></i> ${escHtml(m.country)}</p>` : ''}
        ${m.role ? `<p><i class="fas fa-shield-alt"></i> ${roleName(m.role)}</p>` : ''}
        ${m.instagram ? `<p><i class="fab fa-instagram"></i> @${escHtml(m.instagram)}</p>` : ''}
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
    const primeHtml = m.prime ? `<div class="member-detail-prime">${'★'.repeat(parseInt(m.prime))}</div>` : '';
    const role = m.role || '';
    const roleNames = { leader: 'قائد', vice: 'شريك قائد', chief: 'زعيم' };
    const roleIcons = { leader: 'fa-crown', vice: 'fa-star', chief: 'fa-shield-halved' };
    const roleName = roleNames[role] || '';
    const roleIcon = roleIcons[role] || '';
    container.innerHTML = `
      <div class="member-detail-card">
        <div class="member-detail-avatar">
          <img src="${m.image || '/images/favicon.png'}" alt="${escHtml(m.name)}" loading="lazy">
          ${primeHtml}
        </div>
        <h1 class="member-detail-name">${escHtml(m.name)}</h1>
        ${roleName ? `<p class="member-detail-role"><i class="fas ${roleIcon}"></i> ${roleName}</p>` : ''}
        <div class="member-detail-info-grid">
          ${m.gameId ? `<div class="member-detail-info-item"><span class="label">أيدي اللاعب</span><span class="value"><i class="fas fa-id-card"></i> ${escHtml(m.gameId)}</span></div>` : ''}
          ${m.level ? `<div class="member-detail-info-item"><span class="label">المستوى</span><span class="value"><i class="fas fa-level-up-alt"></i> ${escHtml(m.level)}</span></div>` : ''}
          ${m.country ? `<div class="member-detail-info-item"><span class="label">الدولة</span><span class="value"><i class="fas fa-map-marker-alt"></i> ${escHtml(m.country)}</span></div>` : ''}
          ${m.age ? `<div class="member-detail-info-item"><span class="label">العمر</span><span class="value"><i class="fas fa-birthday-cake"></i> ${escHtml(m.age)}</span></div>` : ''}
          ${m.joinDate ? `<div class="member-detail-info-item"><span class="label">تاريخ الانضمام</span><span class="value"><i class="fas fa-calendar-plus"></i> ${escHtml(m.joinDate)}</span></div>` : ''}
          ${m.weapon ? `<div class="member-detail-info-item"><span class="label">السلاح المفضل</span><span class="value"><i class="fas fa-crosshairs"></i> ${escHtml(m.weapon)}</span></div>` : ''}
          ${m.wins ? `<div class="member-detail-info-item"><span class="label">الانتصارات</span><span class="value"><i class="fas fa-trophy"></i> ${m.wins}</span></div>` : ''}
          ${m.instagram ? `<div class="member-detail-info-item"><span class="label">Instagram</span><span class="value"><i class="fab fa-instagram"></i> @${escHtml(m.instagram)}</span></div>` : ''}
        </div>
        ${m.bio ? `<div class="member-detail-bio"><i class="fas fa-quote-right"></i> ${escHtml(m.bio)}</div>` : ''}
        <a href="/members" class="btn btn-secondary member-detail-btn"><i class="fas fa-arrow-right"></i> العودة للأعضاء</a>
      </div>`;
    document.title = `SYRIA FOUR | ${escHtml(m.name)}`;
  } catch (err) {
    container.innerHTML = errorState('فشل تحميل ملف العضو');
  }
}

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
    container.innerHTML = `
      <div class="member-detail-card leader-detail-card">
        <div class="member-detail-avatar">
          <img src="${m.image || '/images/favicon.png'}" alt="${escHtml(m.name)}">
          <div class="leader-role-badge"><i class="fas ${roleIcon}"></i> ${roleName}</div>
        </div>
        <h1 class="member-detail-name">${escHtml(m.name)}</h1>
        ${m.instagram ? `<a href="https://instagram.com/${m.instagram}" target="_blank" class="btn btn-accent member-detail-btn"><i class="fab fa-instagram"></i> @${escHtml(m.instagram)}</a>` : ''}
        <a href="${adminPanelLink}" class="btn ${adminBtnColor} member-detail-btn"><i class="fas fa-cog"></i> ${adminBtnText}</a>
        <a href="/leaders" class="btn btn-secondary member-detail-btn"><i class="fas fa-arrow-right"></i> العودة للقيادات</a>
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

async function loadTournaments(type = 'previous') {
  const content = $('tournamentContent');
  try {
    content.innerHTML = loadingState('جاري تحميل البطولات...');
    const tournaments = await DB.getTournaments();
    if (!tournaments || tournaments.length === 0) {
      content.innerHTML = emptyState('لا توجد بطولات', 'fa-trophy');
      return;
    }
    const filtered = tournaments.filter(t => t.type === type);
    if (filtered.length === 0) {
      content.innerHTML = emptyState(`لا توجد بطولات ${type === 'previous' ? 'سابقة' : type === 'current' ? 'حالية' : 'قادمة'}`, 'fa-trophy');
      return;
    }
    content.innerHTML = filtered.map(t => `
      <div class="tournament-card">
        <h3><i class="fas fa-trophy" style="color:var(--accent)"></i> ${t.name}</h3>
        <p>${t.description || ''}</p>
        <div class="tournament-date"><i class="far fa-calendar"></i> ${t.date || '—'}</div>
        ${t.gold ? `<div style="margin-top:10px;color:var(--accent)"><i class="fas fa-medal"></i> الذهب: ${t.gold}</div>` : ''}
        ${t.silver ? `<div style="color:var(--text-dim)"><i class="fas fa-medal"></i> الفضة: ${t.silver}</div>` : ''}
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

function checkAdmin() {
  const pw = $('adminPassword');
  if (pw.value === adminPassword) {
    $('adminLogin').style.display = 'none';
    $('adminPanel').style.display = 'block';
    showAdminTab('members');
  } else {
    showToast('كلمة المرور خاطئة', 'error');
  }
}

document.querySelectorAll('.admin-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    showAdminTab(tab.dataset.admin);
  });
});

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

  }
}

async function renderAdminMembers() {
  const container = $('adminContent');
  try {
    const members = await DB.getMembers();
    let html = `<button class="admin-btn-add" onclick="showAddMemberForm()"><i class="fas fa-plus"></i> إضافة عضو</button>
      <div class="admin-table-wrapper"><table class="admin-table">
      <thead><tr><th>الصورة</th><th>الاسم</th><th>أيدي</th><th>المستوى</th><th>برايم</th><th>الصلاحية</th><th>Instagram</th><th>الإجراءات</th></tr></thead><tbody>`;
    const roleNames = { leader: 'قائد', vice: 'شريك قائد', chief: 'زعيم' };
    members.forEach(m => {
      const primeHtml = m.prime ? `<span class="prime-star-badge">${'★'.repeat(parseInt(m.prime))}</span>` : '—';
      const roleHtml = m.role ? roleNames[m.role] || m.role : '—';
      html += `<tr>
        <td><img src="${m.image || '/images/favicon.png'}" style="width:35px;height:35px;border-radius:50%;object-fit:cover;border:2px solid var(--accent)"></td>
        <td>${escHtml(m.name)}</td><td>${m.gameId || '—'}</td><td>${m.level || '—'}</td>
        <td>${primeHtml}</td><td>${roleHtml}</td><td>${m.instagram ? '<i class="fab fa-instagram"></i> @' + escHtml(m.instagram) : '—'}</td>
        <td class="admin-actions">
          <button class="admin-btn admin-btn-edit" onclick="showAddMemberForm('${m.id}')"><i class="fas fa-edit"></i></button>
          <button class="admin-btn admin-btn-delete" onclick="deleteMember('${m.id}')"><i class="fas fa-trash"></i></button>
        </td></tr>`;
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
    window.membersData = members;
  } catch (err) {
    container.innerHTML = errorState('فشل تحميل الأعضاء');
  }
}

window.showAddMemberForm = async function(editId) {
  const members = window.membersData || [];
  const edit = editId ? members.find(m => m.id === editId) : null;
  let galleryImages = [];
  try { galleryImages = await DB.getGalleryImages(); } catch(e) {}
  const currentImage = edit ? (edit.image || '/images/clan-logo.png') : '/images/clan-logo.png';
  let html = `
    <div style="max-width:550px;margin:0 auto">
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
        <div class="form-group"><label>الاسم</label><input type="text" id="memberName" value="${edit ? escHtml(edit.name) : ''}" required></div>
        <div class="form-group"><label>أيدي اللاعب (Game ID)</label><input type="text" id="memberGameId" value="${edit ? escHtml(edit.gameId || '') : ''}"></div>
        <div class="form-group"><label>المستوى (Level)</label><input type="number" id="memberLevel" value="${edit ? edit.level || '' : ''}"></div>
        <div class="form-group"><label>حساب Instagram</label><input type="text" id="memberInstagram" value="${edit ? escHtml(edit.instagram || '') : ''}"></div>
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
  window.galleryImagesForPicker = galleryImages;
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
    instagram: $('memberInstagram').value,
    image: $('memberImage').value || '/images/favicon.png',
    prime: $('memberPrime').value || '',
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
    <div style="max-width:500px;margin:0 auto">
      <h3 style="margin-bottom:20px;color:var(--accent);text-align:center">إضافة بطولة</h3>
      <form onsubmit="saveTournament();return false">
        <div class="form-group"><label>الاسم</label><input type="text" id="tournamentName" required></div>
        <div class="form-group"><label>النوع</label>
          <select id="tournamentType">
            <option value="previous">سابقة</option>
            <option value="current">حالية</option>
            <option value="upcoming">قادمة</option>
          </select>
        </div>
        <div class="form-group"><label>الوصف</label><textarea id="tournamentDesc" rows="3"></textarea></div>
        <div class="form-group"><label>التاريخ</label><input type="date" id="tournamentDate"></div>
        <div class="form-group"><label>الذهب</label><input type="text" id="tournamentGold"></div>
        <div class="form-group"><label>الفضة</label><input type="text" id="tournamentSilver"></div>
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
    date: $('tournamentDate').value,
    gold: $('tournamentGold').value,
    silver: $('tournamentSilver').value,
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
