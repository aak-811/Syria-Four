// Auth frontend module
const AUTH_TOKEN_KEY = 'syria4_token';
const AUTH_USER_KEY = 'syria4_user';

const Auth = {
  getToken() { return localStorage.getItem(AUTH_TOKEN_KEY); },
  setToken(token) { localStorage.setItem(AUTH_TOKEN_KEY, token); },
  removeToken() { localStorage.removeItem(AUTH_TOKEN_KEY); },

  getUser() {
    try { return JSON.parse(localStorage.getItem(AUTH_USER_KEY)); } catch { return null; }
  },
  setUser(user) { localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user)); },
  removeUser() { localStorage.removeItem(AUTH_USER_KEY); },

  isLoggedIn() { return !!this.getToken(); },

  async login(email, password) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    this.setToken(data.token);
    this.setUser(data.user);
    return data.user;
  },

  async register(data) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error);
    this.setToken(result.token);
    this.setUser(result.user);
    return result.user;
  },

  logout() {
    this.removeToken();
    this.removeUser();
    window.location.href = '/';
  },

  async fetchMe() {
    const token = this.getToken();
    if (!token) return null;
    const res = await fetch('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) { this.removeToken(); this.removeUser(); return null; }
    const data = await res.json();
    this.setUser(data.user);
    return data.user;
  },

  async updateProfile(data) {
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.getToken()}` },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error);
    this.setUser(result.user);
    return result.user;
  },

  async changePassword(currentPassword, newPassword) {
    const res = await fetch('/api/auth/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.getToken()}` },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },

  async getSessions() {
    const res = await fetch('/api/auth/sessions', {
      headers: { 'Authorization': `Bearer ${this.getToken()}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data.sessions;
  },

  async deleteSession(id) {
    await fetch(`/api/auth/sessions/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${this.getToken()}` },
    });
  },

  async logoutAll() {
    await fetch('/api/auth/sessions', {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${this.getToken()}` },
    });
    this.removeToken();
    this.removeUser();
  },

  async deleteAccount(password) {
    const res = await fetch('/api/auth/account', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.getToken()}` },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    this.removeToken();
    this.removeUser();
    return data;
  },

  async exportData() {
    const res = await fetch('/api/auth/export', {
      headers: { 'Authorization': `Bearer ${this.getToken()}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  },

  async getNotifications() {
    const res = await fetch('/api/notifications/mine', {
      headers: { 'Authorization': `Bearer ${this.getToken()}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data.notifications;
  },

  async markNotificationRead(id) {
    await fetch(`/api/notifications/${id}/read`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${this.getToken()}` },
    });
  },

  async markAllNotificationsRead() {
    await fetch('/api/notifications/read-all', {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${this.getToken()}` },
    });
  },

  getAuthHeaders() {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },

  async api(path, options = {}) {
    const headers = { ...this.getAuthHeaders(), ...options.headers };
    if (options.body && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
    const res = await fetch(path, { ...options, headers });
    if (res.status === 401) { this.removeToken(); this.removeUser(); window.location.href = '/login'; }
    return res;
  }
};

// --- Login/Register form handlers ---
async function loginUser(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري...';
  try {
    await Auth.login(e.target.querySelector('#loginEmail').value, e.target.querySelector('#loginPassword').value);
    showToast('تم تسجيل الدخول بنجاح', 'success');
    setTimeout(() => { window.location.href = '/dashboard'; }, 500);
  } catch (err) {
    showToast(err.message, 'error');
    btn.disabled = false; btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> تسجيل الدخول';
  }
}

async function registerUser(e) {
  e.preventDefault();
  const password = e.target.querySelector('#regPassword').value;
  const confirm = e.target.querySelector('#regConfirm').value;
  if (password !== confirm) { showToast('كلمة المرور غير متطابقة', 'error'); return; }
  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري...';
  try {
    await Auth.register({
      name: e.target.querySelector('#regName').value,
      username: e.target.querySelector('#regUsername').value,
      email: e.target.querySelector('#regEmail').value,
      password: password,
    });
    showToast('تم إنشاء الحساب بنجاح', 'success');
    setTimeout(() => { window.location.href = '/dashboard'; }, 500);
  } catch (err) {
    showToast(err.message, 'error');
    btn.disabled = false; btn.innerHTML = '<i class="fas fa-user-plus"></i> إنشاء الحساب';
  }
}

// --- Profile Page ---
async function loadProfilePage() {
  const container = $('profileContent');
  if (!container) return;
  try {
    const user = await Auth.fetchMe();
    if (!user) { container.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>يرجى تسجيل الدخول أولاً</p><a href="/login" class="btn btn-primary" style="margin-top:15px">تسجيل الدخول</a></div>'; return; }
    const roleNames = { owner: 'مالك', admin: 'مدير', moderator: 'مشرف', leader: 'قائد', vice: 'شريك قائد', chief: 'زعيم', elite: 'نخبة', member: 'عضو', guest: 'زائر' };
    const roleName = roleNames[user.role] || user.role;
    const statusText = user.verified ? 'موثق' : 'غير موثق';
    const statusIcon = user.verified ? 'fa-check-circle' : 'fa-times-circle';
    const statusColor = user.verified ? '#4caf50' : 'var(--text-muted)';
    $('profilePageTitle').textContent = user.name;
    $('profilePageSub').textContent = `@${user.username} • ${roleName}`;
    container.innerHTML = `
      <div class="profile-cover" style="background:linear-gradient(135deg,var(--primary-dark),var(--bg-dark))">
        <div class="profile-cover-inner">
          <div class="profile-avatar-wrapper">
            <img src="${user.avatar || '/images/clan-logo.png'}" alt="${user.name}" class="profile-avatar">
            <span class="profile-status-badge" style="color:${statusColor}"><i class="fas ${statusIcon}"></i></span>
          </div>
          <div class="profile-header-info">
            <h1>${user.name}</h1>
            <p class="profile-username">@${user.username}</p>
            <span class="profile-role-badge">${roleName}</span>
          </div>
        </div>
      </div>
      <div class="profile-body">
        <div class="profile-section">
          <h3><i class="fas fa-info-circle"></i> المعلومات الأساسية</h3>
          <div class="profile-info-grid">
            <div class="profile-info-item"><span class="label">البريد الإلكتروني</span><span class="value">${user.email}</span></div>
            <div class="profile-info-item"><span class="label">الدولة</span><span class="value">${user.country || '—'}</span></div>
            <div class="profile-info-item"><span class="label">العمر</span><span class="value">${user.age || '—'}</span></div>
            <div class="profile-info-item"><span class="label">تاريخ الانضمام</span><span class="value">${user.joinDate || user.createdAt ? (user.joinDate || user.createdAt.split('T')[0]) : '—'}</span></div>
            <div class="profile-info-item"><span class="label">الحالة</span><span class="value" style="color:${statusColor}"><i class="fas ${statusIcon}"></i> ${statusText}</span></div>
            <div class="profile-info-item"><span class="label">آخر تسجيل دخول</span><span class="value">${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('ar') : '—'}</span></div>
          </div>
        </div>
        ${user.bio ? `<div class="profile-section"><h3><i class="fas fa-quote-right"></i> النبذة الشخصية</h3><p class="profile-bio">${user.bio}</p></div>` : ''}
        <div class="profile-section">
          <h3><i class="fas fa-gamepad"></i> Free Fire</h3>
          <div class="profile-info-grid">
            <div class="profile-info-item"><span class="label">IGN</span><span class="value">${user.ffIgn || '—'}</span></div>
            <div class="profile-info-item"><span class="label">UID</span><span class="value">${user.ffUid || '—'}</span></div>
            <div class="profile-info-item"><span class="label">السيرفر</span><span class="value">${user.ffServer || '—'}</span></div>
            <div class="profile-info-item"><span class="label">المستوى</span><span class="value">${user.ffLevel || '—'}</span></div>
            <div class="profile-info-item"><span class="label">الرتبة</span><span class="value">${user.ffRank || '—'}</span></div>
            <div class="profile-info-item"><span class="label">السلاح المفضل</span><span class="value">${user.weapon || '—'}</span></div>
          </div>
        </div>
        <div class="profile-section">
          <h3><i class="fas fa-link"></i> وسائل التواصل</h3>
          <div class="profile-info-grid">
            <div class="profile-info-item"><span class="label">Instagram</span><span class="value">${user.instagram ? `<a href="https://instagram.com/${user.instagram}" target="_blank">@${user.instagram}</a>` : '—'}</span></div>
            <div class="profile-info-item"><span class="label">Discord</span><span class="value">${user.discord || '—'}</span></div>
          </div>
        </div>
        <div class="profile-actions">
          <a href="/settings" class="btn btn-primary"><i class="fas fa-cog"></i> الإعدادات</a>
          <a href="/dashboard" class="btn btn-accent"><i class="fas fa-chart-pie"></i> لوحة التحكم</a>
          <a href="/" class="btn btn-secondary"><i class="fas fa-home"></i> الرئيسية</a>
        </div>
      </div>`;
  } catch (err) {
    container.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>${err.message}</p></div>`;
  }
}

// --- Dashboard Page ---
async function loadDashboardPage() {
  const container = $('dashboardContent');
  if (!container) return;
  try {
    const user = await Auth.fetchMe();
    if (!user) { container.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>يرجى تسجيل الدخول أولاً</p><a href="/login" class="btn btn-primary" style="margin-top:15px">تسجيل الدخول</a></div>'; return; }
    const roleNames = { owner: 'مالك', admin: 'مدير', moderator: 'مشرف', leader: 'قائد', vice: 'شريك قائد', chief: 'زعيم', elite: 'نخبة', member: 'عضو', guest: 'زائر' };
    const roleName = roleNames[user.role] || user.role;
    const statusText = user.verified ? 'موثق' : 'غير موثق';
    container.innerHTML = `
      <div class="dashboard-stats">
        <div class="dash-stat-card"><i class="fas fa-trophy"></i><div class="dash-stat-info"><span class="dash-stat-number">${user.ffLevel || '—'}</span><span class="dash-stat-label">المستوى</span></div></div>
        <div class="dash-stat-card"><i class="fas fa-shield-alt"></i><div class="dash-stat-info"><span class="dash-stat-number">${roleName}</span><span class="dash-stat-label">الرتبة</span></div></div>
        <div class="dash-stat-card"><i class="fas fa-calendar-plus"></i><div class="dash-stat-info"><span class="dash-stat-number">${user.joinDate || user.createdAt ? (user.joinDate || user.createdAt.split('T')[0]) : '—'}</span><span class="dash-stat-label">تاريخ الانضمام</span></div></div>
        <div class="dash-stat-card"><i class="fas ${user.verified ? 'fa-check-circle' : 'fa-times-circle'}" style="color:${user.verified ? '#4caf50' : 'var(--text-muted)'}"></i><div class="dash-stat-info"><span class="dash-stat-number">${statusText}</span><span class="dash-stat-label">حالة الحساب</span></div></div>
      </div>
      <div class="dashboard-welcome">
        <img src="${user.avatar || '/images/clan-logo.png'}" alt="${user.name}" class="dash-avatar">
        <h2>مرحباً، ${user.name}</h2>
        <p>@${user.username} • ${roleName}</p>
        <p class="dash-email">${user.email}</p>
        ${user.lastLogin ? `<p class="dash-last-login"><i class="far fa-clock"></i> آخر تسجيل دخول: ${new Date(user.lastLogin).toLocaleString('ar')}</p>` : ''}
      </div>
      <div class="dashboard-actions">
        <a href="/profile" class="btn btn-primary"><i class="fas fa-user"></i> الملف الشخصي</a>
        <a href="/settings" class="btn btn-accent"><i class="fas fa-cog"></i> الإعدادات</a>
        <button class="btn btn-secondary" onclick="Auth.logout()"><i class="fas fa-sign-out-alt"></i> تسجيل خروج</button>
      </div>
      ${(user.role === 'owner' || user.role === 'admin') ? `<div class="dashboard-actions" style="margin-top:15px"><a href="/admin" class="btn btn-primary"><i class="fas fa-cog"></i> لوحة الإدارة</a></div>` : ''}
      <div class="profile-loading" id="dashNotifications" style="margin-top:20px">
        <p><i class="fas fa-spinner fa-spin"></i> جاري تحميل الإشعارات...</p>
      </div>`;
    // Load notifications
    try {
      const notifications = await Auth.getNotifications();
      const unread = notifications.filter(n => !n.read);
      const notifHtml = notifications.length > 0 ? `
        <div class="dash-notif-header"><h4><i class="fas fa-bell"></i> الإشعارات (${unread.length} غير مقروءة)</h4>
        ${unread.length > 0 ? `<button class="btn btn-secondary" style="font-size:0.8rem;padding:6px 12px" onclick="Auth.markAllNotificationsRead().then(()=>loadDashboardPage())">قراءة الكل</button></div>` : '</div>'}
        <div class="dash-notif-list">${notifications.slice(0,10).map(n => `
          <div class="dash-notif-item ${n.read ? '' : 'unread'}" onclick="${n.read ? '' : `Auth.markNotificationRead('${n.id}').then(()=>loadDashboardPage())`}">
            <i class="fas fa-bell"></i>
            <div><p>${n.message || n.title || ''}</p><small>${n.createdAt ? new Date(n.createdAt).toLocaleDateString('ar') : ''}</small></div>
          </div>`).join('')}
        </div>` : '<p style="color:var(--text-muted);text-align:center;margin-top:15px">لا توجد إشعارات</p>';
      $('dashNotifications').innerHTML = notifHtml;
    } catch(e) {
      $('dashNotifications').innerHTML = '<p style="color:var(--text-muted);text-align:center">فشل تحميل الإشعارات</p>';
    }
  } catch (err) {
    container.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>${err.message}</p></div>`;
  }
}

// --- Settings Page ---
async function loadSettingsPage() {
  const container = $('settingsContent');
  if (!container) return;
  try {
    const user = await Auth.fetchMe();
    if (!user) { container.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>يرجى تسجيل الدخول أولاً</p><a href="/login" class="btn btn-primary" style="margin-top:15px">تسجيل الدخول</a></div>'; return; }
    container.innerHTML = `
      <div class="settings-tabs">
        <button class="settings-tab active" onclick="switchSettingsTab(this,'general')"><i class="fas fa-user"></i> عام</button>
        <button class="settings-tab" onclick="switchSettingsTab(this,'game')"><i class="fas fa-gamepad"></i> اللعبة</button>
        <button class="settings-tab" onclick="switchSettingsTab(this,'password')"><i class="fas fa-lock"></i> كلمة المرور</button>
        <button class="settings-tab" onclick="switchSettingsTab(this,'sessions')"><i class="fas fa-laptop"></i> الجلسات</button>
        <button class="settings-tab" onclick="switchSettingsTab(this,'danger')"><i class="fas fa-exclamation-triangle"></i> الأمان</button>
      </div>
      <div class="settings-content" id="settingsGeneral">
        <h3>الإعدادات العامة</h3>
        <form onsubmit="saveSettings(event)">
          <div class="settings-avatar-section">
            <img src="${user.avatar || '/images/clan-logo.png'}" id="settingsAvatar" class="settings-avatar">
            <div>
              <label class="btn btn-secondary" style="cursor:pointer"><i class="fas fa-camera"></i> تغيير الصورة<input type="file" accept="image/*" style="display:none" onchange="uploadSettingsAvatar(this)"></label>
              <p class="hint" style="margin-top:5px;font-size:0.8rem;color:var(--text-muted)">JPG, PNG • أقصى حجم 5MB</p>
            </div>
          </div>
          <div class="form-row-2">
            <div class="form-group"><label>الاسم</label><input type="text" id="setName" value="${user.name}"></div>
            <div class="form-group"><label>اسم المستخدم</label><input type="text" id="setUsername" value="${user.username}" pattern="[a-zA-Z0-9_]{3,30}"></div>
          </div>
          <div class="form-row-2">
            <div class="form-group"><label>رقم الهاتف</label><input type="text" id="setPhone" value="${user.phone || ''}"></div>
            <div class="form-group"><label>الدولة</label>
              <select id="setCountry"><option value="">— اختر —</option>${['سوريا','العراق','مصر','السعودية','الأردن','لبنان','فلسطين','اليمن','ليبيا','تونس','الجزائر','المغرب','السودان','الكويت','قطر','الإمارات','عمان','البحرين'].map(c => `<option value="${c}" ${user.country === c ? 'selected' : ''}>${c}</option>`).join('')}</select>
            </div>
          </div>
          <div class="form-row-2">
            <div class="form-group"><label>العمر</label><input type="number" id="setAge" value="${user.age || ''}"></div>
            <div class="form-group"><label>Instagram</label><input type="text" id="setInstagram" value="${user.instagram || ''}" placeholder="username"></div>
          </div>
          <div class="form-group"><label>Discord</label><input type="text" id="setDiscord" value="${user.discord || ''}" placeholder="username#0000"></div>
          <div class="form-group"><label>النبذة الشخصية</label><textarea id="setBio" rows="3">${user.bio || ''}</textarea></div>
          <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> حفظ التغييرات</button>
        </form>
      </div>
      <div class="settings-content" id="settingsGame" style="display:none">
        <h3>إعدادات Free Fire</h3>
        <form onsubmit="saveGameSettings(event)">
          <div class="form-row-2">
            <div class="form-group"><label>IGN (الاسم داخل اللعبة)</label><input type="text" id="setFfIgn" value="${user.ffIgn || ''}"></div>
            <div class="form-group"><label>UID</label><input type="text" id="setFfUid" value="${user.ffUid || ''}"></div>
          </div>
          <div class="form-row-2">
            <div class="form-group"><label>السيرفر</label><select id="setFfServer"><option value="">— اختر —</option>${['MENA','Asia','Europe','America'].map(s => `<option value="${s}" ${user.ffServer === s ? 'selected' : ''}>${s}</option>`).join('')}</select></div>
            <div class="form-group"><label>المستوى</label><input type="text" id="setFfLevel" value="${user.ffLevel || ''}"></div>
          </div>
          <div class="form-row-2">
            <div class="form-group"><label>الرتبة</label>
              <select id="setFfRank"><option value="">— اختر —</option>${['Rookie','Bronze','Silver','Gold','Platinum','Diamond','Master','Grandmaster','Heroic'].map(r => `<option value="${r}" ${user.ffRank === r ? 'selected' : ''}>${r}</option>`).join('')}</select>
            </div>
            <div class="form-group"><label>السلاح المفضل</label><input type="text" id="setWeapon" value="${user.weapon || ''}"></div>
          </div>
          <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> حفظ</button>
        </form>
      </div>
      <div class="settings-content" id="settingsPassword" style="display:none">
        <h3>تغيير كلمة المرور</h3>
        <form onsubmit="changePassword(event)" style="max-width:400px">
          <div class="form-group"><label>كلمة المرور الحالية</label><input type="password" id="setCurrentPass" required></div>
          <div class="form-group"><label>كلمة المرور الجديدة</label><input type="password" id="setNewPass" required minlength="6"></div>
          <button type="submit" class="btn btn-primary"><i class="fas fa-key"></i> تغيير كلمة المرور</button>
        </form>
      </div>
      <div class="settings-content" id="settingsSessions" style="display:none">
        <h3>الجلسات النشطة <button class="btn btn-secondary" style="font-size:0.8rem;padding:4px 12px" onclick="logoutAllSessions()"><i class="fas fa-sign-out-alt"></i> تسجيل خروج من الكل</button></h3>
        <div id="sessionsList"><p style="color:var(--text-muted)"><i class="fas fa-spinner fa-spin"></i> جاري التحميل...</p></div>
      </div>
      <div class="settings-content" id="settingsDanger" style="display:none">
        <h3 style="color:var(--primary)">منطقة الأمان</h3>
        <div class="danger-zone">
          <div class="danger-item">
            <div><h4>تصدير البيانات</h4><p>تحميل نسخة من جميع بيانات حسابك</p></div>
            <button class="btn btn-secondary" onclick="exportAccountData()"><i class="fas fa-download"></i> تصدير</button>
          </div>
          <div class="danger-item">
            <div><h4>حذف الحساب</h4><p>حذف الحساب نهائياً مع جميع البيانات</p></div>
            <button class="btn btn-danger" onclick="showDeleteConfirm()"><i class="fas fa-trash"></i> حذف الحساب</button>
          </div>
        </div>
      </div>`;
    loadSessions();
  } catch (err) {
    container.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>${err.message}</p></div>`;
  }
}

function switchSettingsTab(el, tabId) {
  document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.settings-content').forEach(c => c.style.display = 'none');
  const target = $(`settings${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`);
  if (target) target.style.display = 'block';
  if (tabId === 'sessions') loadSessions();
}

async function saveSettings(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري...';
  try {
    await Auth.updateProfile({
      name: $('setName').value, username: $('setUsername').value,
      phone: $('setPhone').value, country: $('setCountry').value,
      age: $('setAge').value, instagram: $('setInstagram').value,
      discord: $('setDiscord').value, bio: $('setBio').value,
    });
    showToast('تم الحفظ', 'success');
    setTimeout(() => loadSettingsPage(), 500);
  } catch (err) {
    showToast(err.message, 'error');
    btn.disabled = false; btn.innerHTML = '<i class="fas fa-save"></i> حفظ التغييرات';
  }
}

async function saveGameSettings(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري...';
  try {
    await Auth.updateProfile({
      ffIgn: $('setFfIgn').value, ffUid: $('setFfUid').value,
      ffServer: $('setFfServer').value, ffLevel: $('setFfLevel').value,
      ffRank: $('setFfRank').value, weapon: $('setWeapon').value,
    });
    showToast('تم الحفظ', 'success');
    btn.disabled = false; btn.innerHTML = '<i class="fas fa-save"></i> حفظ';
  } catch (err) {
    showToast(err.message, 'error');
    btn.disabled = false; btn.innerHTML = '<i class="fas fa-save"></i> حفظ';
  }
}

async function changePassword(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري...';
  try {
    await Auth.changePassword($('setCurrentPass').value, $('setNewPass').value);
    showToast('تم تغيير كلمة المرور', 'success');
    $('setCurrentPass').value = ''; $('setNewPass').value = '';
    btn.disabled = false; btn.innerHTML = '<i class="fas fa-key"></i> تغيير كلمة المرور';
  } catch (err) {
    showToast(err.message, 'error');
    btn.disabled = false; btn.innerHTML = '<i class="fas fa-key"></i> تغيير كلمة المرور';
  }
}

async function loadSessions() {
  const list = $('sessionsList');
  if (!list) return;
  try {
    const sessions = await Auth.getSessions();
    list.innerHTML = sessions.map(s => `
      <div class="session-item">
        <div><i class="fas fa-laptop"></i><div><strong>${s.device || 'جهاز غير معروف'}</strong><small>${s.ip || ''} • آخر نشاط: ${s.lastActivity ? new Date(s.lastActivity).toLocaleDateString('ar') : '—'}</small></div></div>
        <button class="btn btn-secondary" style="font-size:0.8rem;padding:4px 10px" onclick="Auth.deleteSession('${s.id}').then(()=>loadSessions())"><i class="fas fa-times"></i></button>
      </div>`).join('');
  } catch (err) {
    list.innerHTML = '<p style="color:var(--text-muted)">فشل تحميل الجلسات</p>';
  }
}

async function logoutAllSessions() {
  if (!confirm('تسجيل الخروج من جميع الأجهزة؟')) return;
  await Auth.logoutAll();
  showToast('تم تسجيل الخروج من جميع الأجهزة', 'success');
  setTimeout(() => window.location.href = '/login', 1000);
}

async function exportAccountData() {
  try {
    const data = await Auth.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `syria4-account-data.json`; a.click();
    URL.revokeObjectURL(url);
    showToast('تم التصدير بنجاح', 'success');
  } catch (err) {
    showToast('فشل التصدير', 'error');
  }
}

async function showDeleteConfirm() {
  const overlay = document.createElement('div');
  overlay.className = 'join-request-modal';
  overlay.innerHTML = `
    <div class="join-request-content">
      <h3 style="color:var(--primary)"><i class="fas fa-exclamation-triangle"></i> حذف الحساب</h3>
      <p style="color:var(--text-dim);margin:15px 0">هل أنت متأكد؟ هذا الإجراء لا يمكن التراجع عنه.</p>
      <form onsubmit="confirmDeleteAccount(event,this)">
        <div class="form-group"><label>أدخل كلمة المرور لتأكيد الحذف</label><input type="password" id="deletePass" required></div>
        <div style="display:flex;gap:10px">
          <button type="submit" class="btn btn-danger" style="flex:1"><i class="fas fa-trash"></i> تأكيد الحذف</button>
          <button type="button" class="btn btn-secondary" style="flex:1" onclick="this.closest('.join-request-modal').remove()">إلغاء</button>
        </div>
      </form>
    </div>`;
  document.body.appendChild(overlay);
}

async function confirmDeleteAccount(e, form) {
  e.preventDefault();
  try {
    await Auth.deleteAccount($('deletePass').value);
    form.closest('.join-request-modal').remove();
    showToast('تم حذف الحساب', 'info');
    setTimeout(() => window.location.href = '/', 1500);
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function uploadSettingsAvatar(input) {
  const file = input.files[0];
  if (!file) return;
  const formData = new FormData();
  formData.append('file', file);
  try {
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    await Auth.updateProfile({ avatar: data.url });
    $('settingsAvatar').src = data.url;
    showToast('تم تغيير الصورة', 'success');
  } catch (err) {
    showToast('فشل رفع الصورة', 'error');
  }
}

// --- Navbar auth state ---
async function initAuthNavbar() {
  const nav = document.querySelector('.nav-menu');
  if (!nav) return;
  // Remove any existing auth button
  const existing = nav.querySelector('.nav-auth-btn');
  if (existing) existing.remove();

  if (Auth.isLoggedIn()) {
    try {
      const user = await Auth.fetchMe();
      if (user) {
        const div = document.createElement('div');
        div.className = 'nav-auth-btn';
        div.innerHTML = `<a href="/profile" title="الملف الشخصي"><img src="${user.avatar || '/images/clan-logo.png'}" class="nav-auth-avatar"> ${user.name}</a><a href="/dashboard" title="لوحة التحكم"><i class="fas fa-chart-pie"></i></a><a href="#" onclick="Auth.logout();return false" title="تسجيل خروج"><i class="fas fa-sign-out-alt"></i></a>`;
        nav.appendChild(div);
      }
    } catch(e) {}
  } else {
    const div = document.createElement('div');
    div.className = 'nav-auth-btn';
    div.innerHTML = `<a href="/login" class="nav-auth-login"><i class="fas fa-sign-in-alt"></i> تسجيل الدخول</a><a href="/register" class="nav-auth-register">إنشاء حساب</a>`;
    nav.appendChild(div);
  }
}

// Init auth-related pages
document.addEventListener('DOMContentLoaded', () => {
  if ($('profileContent')) loadProfilePage();
  if ($('dashboardContent')) loadDashboardPage();
  if ($('settingsContent')) loadSettingsPage();
  initAuthNavbar();
});
