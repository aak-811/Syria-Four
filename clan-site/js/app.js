let adminPassword = 'syria2026';

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
  if ($('allPlayersGrid')) loadAllPlayers();
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
});

function initLoadingScreen() {
  const screen = $('loadingScreen');
  const progress = $('loaderProgress');
  const logo = $('loaderLogo');
  screen.id = 'loadingScreen';
  screen.classList.add('loading-screen');
  let p = 0;
  const interval = setInterval(() => {
    p += Math.random() * 15 + 5;
    if (p >= 100) { p = 100; clearInterval(interval); }
    progress.style.width = p + '%';
  }, 200);
  setTimeout(() => {
    progress.style.width = '100%';
    clearInterval(interval);
    setTimeout(() => {
      screen.classList.add('hidden');
      setTimeout(() => screen.style.display = 'none', 500);
    }, 500);
  }, 2500);
}

function initNavbar() {
  const navbar = $('navbar');
  const toggle = $('navToggle');
  const menu = $('navMenu');
  toggle.addEventListener('click', () => menu.classList.toggle('open'));
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => menu.classList.remove('open'));
  });
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    let current = '';
    document.querySelectorAll('section[id]').forEach(section => {
      const top = section.offsetTop - 200;
      if (window.scrollY >= top) current = section.getAttribute('id');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
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

function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        let current = 0;
        const step = Math.ceil(target / 60);
        const interval = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(interval); }
          el.textContent = current;
        }, 30);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
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
        <div class="video-thumb">
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

function openLightbox(src, caption, type) {
  const lb = $('lightbox');
  const img = $('lightboxImage');
  const video = $('lightboxVideo');
  const cap = $('lightboxCaption');
  img.style.display = 'none';
  video.style.display = 'none';
  if (type === 'image' && src) {
    img.src = src;
    img.style.display = 'block';
  } else if (type === 'video' && src) {
    video.src = src;
    video.style.display = 'block';
  }
  cap.textContent = caption || '';
  lb.style.display = 'flex';
}

function initLightbox() {
  $('lightboxClose').addEventListener('click', () => {
    $('lightbox').style.display = 'none';
    $('lightboxVideo').pause();
  });
  $('lightbox').addEventListener('click', (e) => {
    if (e.target === $('lightbox')) {
      $('lightbox').style.display = 'none';
      $('lightboxVideo').pause();
    }
  });
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
    const leaders = members.filter(m => m.name === 'أبو أمير' || m.name === 'قصي | QUSAI');
    if (leaders.length === 0) {
      grid.innerHTML = emptyState('لا توجد قيادات بعد', 'fa-crown');
      return;
    }
    grid.innerHTML = leaders.map(l => `
      <div class="leader-card">
        <div class="leader-avatar">
          <img src="${l.image || '/images/favicon.png'}" alt="${l.name}">
        </div>
        <h3>${l.name}</h3>
        <p class="leader-role"><i class="fas fa-crown" style="color:var(--accent)"></i> قائد</p>
        ${l.instagram ? `<a href="https://instagram.com/${l.instagram}" target="_blank" class="leader-instagram"><i class="fab fa-instagram"></i> @${l.instagram}</a>` : ''}
      </div>
    `).join('');
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
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        loadTournaments(btn.dataset.tab);
      });
    });
  } catch (err) {
    content.innerHTML = errorState('فشل تحميل البطولات');
  }
}

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
  { gems: 70, price: '$0.99', label: '70 جوهرة' },
  { gems: 140, price: '$1.99', label: '140 جوهرة' },
  { gems: 355, price: '$4.99', label: '355 جوهرة', badge: 'الأكثر مبيعاً', bonus: '+10 هدية' },
  { gems: 720, price: '$9.99', label: '720 جوهرة', bonus: '+25 هدية' },
  { gems: 1450, price: '$19.99', label: '1450 جوهرة', bonus: '+70 هدية' },
  { gems: 2900, price: '$39.99', label: '2900 جوهرة', bonus: '+150 هدية' },
  { gems: 4350, price: '$49.99', label: '4350 جوهرة', bonus: '+250 هدية' },
  { gems: 7200, price: '$99.99', label: '7200 جوهرة', bonus: '+500 هدية' },
];

function loadShop() {
  const grid = $('shopGrid');
  grid.innerHTML = shopPackages.map(p => `
    <div class="shop-card">
      ${p.badge ? `<span class="shop-badge">${p.badge}</span>` : ''}
      <div class="shop-gems">${p.gems}</div>
      <div class="shop-price">${p.price}</div>
      <div class="shop-desc">${p.label} ${p.bonus ? '<br><span style="color:var(--accent)">🎁 ' + p.bonus + '</span>' : ''}</div>
    </div>
  `).join('');
}

function initShopForm() {
  $('shopForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      playerName: form.playerName.value,
      playerId: form.playerId.value,
      item: form.item.value,
      payment: form.payment.value,
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
      code: form.code.value,
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
    case 'tournaments': renderAdminTournaments(); break;
    case 'events': renderAdminEvents(); break;
    case 'leaderboard': renderAdminLeaderboard(); break;
    case 'orders': renderAdminOrders(); break;
    case 'support': renderAdminSupport(); break;
    case 'instagram': renderAdminInstagram(); break;
    case 'gallery': renderAdminGallery(); break;
    case 'videos': renderAdminVideos(); break;
    case 'notifications': renderAdminNotifications(); break;
    case 'players': renderAdminPlayers(); break;
  }
}

async function renderAdminMembers() {
  const container = $('adminContent');
  try {
    const members = await DB.getMembers();
    let html = `<button class="admin-btn-add" onclick="showAddMemberForm()"><i class="fas fa-plus"></i> إضافة عضو</button>
      <div class="admin-table-wrapper"><table class="admin-table">
      <thead><tr><th>الاسم</th><th>الكود</th><th>Instagram</th><th>الإجراءات</th></tr></thead><tbody>`;
    members.forEach(m => {
      html += `<tr>
        <td>${m.name}</td><td>${m.code || '—'}</td><td>${m.instagram || '—'}</td>
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

window.showAddMemberForm = function(editId) {
  const members = window.membersData || [];
  const edit = editId ? members.find(m => m.id === editId) : null;
  const html = `
    <div style="max-width:500px;margin:0 auto">
      <h3 style="margin-bottom:20px;color:var(--accent);text-align:center">${edit ? 'تعديل عضو' : 'إضافة عضو'}</h3>
      <form onsubmit="saveMember('${editId || ''}');return false">
        <div class="form-group"><label>الاسم</label><input type="text" id="memberName" value="${edit ? edit.name : ''}" required></div>
        <div class="form-group"><label>الكود</label><input type="text" id="memberCode" value="${edit ? edit.code || '' : ''}"></div>
        <div class="form-group"><label>Instagram</label><input type="text" id="memberInstagram" value="${edit ? edit.instagram || '' : ''}"></div>
        <button type="submit" class="btn btn-primary" style="width:100%"><i class="fas fa-save"></i> حفظ</button>
        <button type="button" class="btn btn-secondary" style="width:100%;margin-top:10px" onclick="renderAdminMembers()">إلغاء</button>
      </form>
    </div>`;
  $('adminContent').innerHTML = html;
};

window.saveMember = async function(id) {
  const data = {
    name: $('memberName').value,
    code: $('memberCode').value,
    instagram: $('memberInstagram').value,
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
    let html = `<button class="admin-btn-add" onclick="showAddGalleryForm()"><i class="fas fa-plus"></i> إضافة صورة</button>
      <div class="admin-table-wrapper"><table class="admin-table">
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
  } catch (err) {
    container.innerHTML = errorState('فشل تحميل الصور');
  }
}

window.showAddGalleryForm = function() {
  const html = `
    <div style="max-width:500px;margin:0 auto">
      <h3 style="margin-bottom:20px;color:var(--accent);text-align:center">إضافة صورة</h3>
      <form onsubmit="saveGalleryFile();return false">
        <div class="form-group"><label>التسمية</label><input type="text" id="galleryLabel" required></div>
        <div class="form-group"><label>الصورة</label><input type="file" id="galleryFile" accept="image/*"></div>
        <div id="galleryPreview" style="margin-bottom:15px;text-align:center;display:none">
          <img id="galleryPreviewImg" style="max-width:200px;border-radius:8px">
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%"><i class="fas fa-save"></i> حفظ</button>
        <button type="button" class="btn btn-secondary" style="width:100%;margin-top:10px" onclick="renderAdminGallery()">إلغاء</button>
      </form>
    </div>`;
  $('adminContent').innerHTML = html;
  setTimeout(() => {
    const input = $('galleryFile');
    if (input) input.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(ev) {
          const preview = $('galleryPreview');
          preview.style.display = 'block';
          $('galleryPreviewImg').src = ev.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }, 100);
};

window.saveGalleryFile = async function() {
  const label = $('galleryLabel').value;
  const fileInput = $('galleryFile');
  try {
    let src = '';
    if (fileInput && fileInput.files[0]) {
      const result = await DB.uploadFile(fileInput.files[0]);
      src = result.url;
    }
    await DB.addGalleryImage({ label, src });
    showToast('تمت الإضافة', 'success');
    renderAdminGallery();
  } catch (err) {
    showToast('فشل الحفظ', 'error');
  }
};

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
    let html = `<button class="admin-btn-add" onclick="showAddVideoForm()"><i class="fas fa-plus"></i> إضافة فيديو</button>
      <div class="admin-table-wrapper"><table class="admin-table">
      <thead><tr><th>العنوان</th><th>الرابط</th><th>الإجراءات</th></tr></thead><tbody>`;
    videos.forEach(v => {
      html += `<tr>
        <td>${v.title || '—'}</td>
        <td>${v.url ? '<i class="fas fa-check" style="color:#4caf50"></i>' : '<span style="color:var(--text-muted)">—</span>'}</td>
        <td class="admin-actions">
          <button class="admin-btn admin-btn-delete" onclick="deleteVideo('${v.id}')"><i class="fas fa-trash"></i></button>
        </td></tr>`;
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
  } catch (err) {
    container.innerHTML = errorState('فشل تحميل الفيديوهات');
  }
}

window.showAddVideoForm = function() {
  const html = `
    <div style="max-width:500px;margin:0 auto">
      <h3 style="margin-bottom:20px;color:var(--accent);text-align:center">إضافة فيديو</h3>
      <form onsubmit="saveVideo();return false">
        <div class="form-group"><label>العنوان</label><input type="text" id="videoTitle" required></div>
        <div class="form-group"><label>رابط الفيديو</label><input type="text" id="videoUrl" placeholder="https://..."></div>
        <button type="submit" class="btn btn-primary" style="width:100%"><i class="fas fa-save"></i> حفظ</button>
        <button type="button" class="btn btn-secondary" style="width:100%;margin-top:10px" onclick="renderAdminVideos()">إلغاء</button>
      </form>
    </div>`;
  $('adminContent').innerHTML = html;
};

window.saveVideo = async function() {
  const data = {
    title: $('videoTitle').value,
    url: $('videoUrl').value,
  };
  try {
    await DB.addVideo(data);
    showToast('تمت الإضافة', 'success');
    renderAdminVideos();
  } catch (err) {
    showToast('فشل الحفظ', 'error');
  }
};

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
