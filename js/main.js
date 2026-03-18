/* ===== EXAMSHIELD — SHARED UTILITIES ===== */

// ===== THEME =====
const THEME_KEY = 'er_theme';
function getTheme() { return localStorage.getItem(THEME_KEY) || 'dark'; }
function setTheme(t) {
  localStorage.setItem(THEME_KEY, t);
  document.documentElement.setAttribute('data-theme', t === 'calm' ? 'calm' : '');
  document.querySelectorAll('.theme-btn').forEach(b => b.classList.toggle('active', b.dataset.theme === t));
}
function initTheme() { setTheme(getTheme()); }

// ===== LOCAL STORAGE HELPERS =====
const LS = {
  get: (k, def = null) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } },
  update: (k, fn, def = {}) => { LS.set(k, fn(LS.get(k, def))); }
};

// ===== STATS =====
const STATS_KEY = 'er_stats';
function getStats() {
  return LS.get(STATS_KEY, {
    studyMinutes: 0,
    streak: 0,
    lastStudyDate: null,
    sessionsCompleted: 0,
    flashcardsStudied: 0,
    questionsSolved: 0,
    weeklyMinutes: [0, 0, 0, 0, 0, 0, 0]
  });
}
function updateStats(fn) { LS.update(STATS_KEY, fn, getStats()); }
function addStudyMinutes(mins) {
  updateStats(s => {
    s.studyMinutes = (s.studyMinutes || 0) + mins;
    const today = new Date().toDateString();
    if (s.lastStudyDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      s.streak = s.lastStudyDate === yesterday ? (s.streak || 0) + 1 : 1;
      s.lastStudyDate = today;
    }
    // weekly
    const day = new Date().getDay();
    if (!s.weeklyMinutes) s.weeklyMinutes = [0, 0, 0, 0, 0, 0, 0];
    s.weeklyMinutes[day] = (s.weeklyMinutes[day] || 0) + mins;
    return s;
  });
}

// ===== TOAST NOTIFICATIONS =====
let toastContainer;
function getToastContainer() {
  if (!toastContainer) {
    toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      toastContainer.id = 'toast-container';
      document.body.appendChild(toastContainer);
    }
  }
  return toastContainer;
}
function toast(msg, emoji = '✅', duration = 3000) {
  const c = getToastContainer();
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<span>${emoji}</span><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => t.remove(), duration);
}

// ===== SIDEBAR NAVIGATION =====
const NAV_ITEMS = [
  { href: 'index.html', icon: '🏠', label: 'Dashboard' },
  { href: 'notes.html', icon: '📝', label: 'Quick Notes', badge: 'AI' },
  { href: 'doubt-solver.html', icon: '🤖', label: 'AI Doubt Solver', badge: 'AI' },
  { href: 'revision.html', icon: '🚀', label: 'Revision Mode' },
  { href: 'timer.html', icon: '⏱️', label: 'Study Timer' },
  { href: 'pyq.html', icon: '📋', label: 'PYQ Bank' },
  { href: 'uploads.html', icon: '📁', label: 'My Files', badge: 'NEW' },
  { href: 'anxiety.html', icon: '🧘', label: 'Anxiety Helper' },
];

function buildSidebar(activeHref) {
  window._activeHref = activeHref;
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;
  const stats = getStats();
  const hours = Math.floor((stats.studyMinutes || 0) / 60);
  const profile = (typeof getProfile === 'function') ? getProfile() : null;
  const courseLabel = profile ? profile.courseLabel : null;
  const activeFiles = (typeof FileHandler !== 'undefined') ? FileHandler.activeCount() : 0;

  sidebar.innerHTML = `
    <div class="sidebar-logo">
      <div class="logo-mark" style="flex:1;min-width:0">
        <div class="logo-icon">🎓</div>
        <div style="min-width:0;flex:1">
          <div class="logo-text">ExamShield</div>
          <div class="logo-sub" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:140px" title="${courseLabel || 'Student Survival Toolkit'}">${courseLabel || 'Student Survival Toolkit'}</div>
        </div>
        <button onclick="showProfileModal(true)" title="Change Course" style="background:none;border:none;cursor:pointer;font-size:14px;color:var(--text-muted);flex-shrink:0;padding:4px">${courseLabel ? '✏️' : '🎯'}</button>
      </div>
    </div>
    <div class="nav-section">
      <div class="nav-section-label">Navigation</div>
      ${NAV_ITEMS.map(item => `
        <a href="${item.href}" class="nav-item${activeHref === item.href ? ' active' : ''}">
          <span class="nav-icon">${item.icon}</span>
          <span>${item.label}</span>
          ${item.href === 'uploads.html' && activeFiles > 0 ? `<span class="nav-badge" style="background:var(--gradient-green)">${activeFiles} on</span>` : item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
        </a>
      `).join('')}
    </div>
    <div class="nav-section" style="margin-top:auto">
      <div class="nav-section-label">Quick Stats</div>
      <div style="padding:8px;background:var(--bg-card);border-radius:var(--radius-md);border:1px solid var(--border-color)">
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted);margin-bottom:6px">
          <span>📈 ${hours}h studied</span>
          <span>🔥 ${stats.streak || 0} day streak</span>
        </div>
      </div>
    </div>
    <div class="sidebar-footer">
      <div class="sound-player">
        <div class="sound-label">🎵 Focus Sounds</div>
        <div class="sound-btns">
          <button class="sound-btn" id="snd-rain" onclick="toggleSound('rain')" title="Rain">🌧 Rain</button>
          <button class="sound-btn" id="snd-lib" onclick="toggleSound('library')" title="Library">📚 Lib</button>
          <button class="sound-btn" id="snd-noise" onclick="toggleSound('noise')" title="White Noise">📡 Noise</button>
        </div>
      </div>
      <div class="theme-toggle-wrapper">
        <button class="theme-btn" data-theme="dark" onclick="setTheme('dark')">🌙 Dark</button>
        <button class="theme-btn" data-theme="calm" onclick="setTheme('calm')">🌸 Calm</button>
      </div>
      <div style="margin-top:8px">
        <button class="btn btn-ghost btn-sm" style="width:100%" onclick="openSettings()">⚙️ API Keys & Settings</button>
      </div>
    </div>
   `;
  // Re-apply theme buttons state
  setTheme(getTheme());

  // ——— MOBILE HAMBURGER ———
  // Inject hamburger button + overlay once
  if (!document.getElementById('hamburger-btn')) {
    const btn = document.createElement('button');
    btn.id = 'hamburger-btn';
    btn.className = 'hamburger-btn';
    btn.setAttribute('aria-label', 'Toggle navigation');
    btn.innerHTML = '<span></span><span></span><span></span>';
    btn.onclick = toggleMobileSidebar;
    document.body.appendChild(btn);

    const overlay = document.createElement('div');
    overlay.id = 'sidebar-overlay';
    overlay.className = 'sidebar-overlay';
    overlay.onclick = closeMobileSidebar;
    document.body.appendChild(overlay);
  }
}

// ——— MOBILE SIDEBAR TOGGLE ———
function toggleMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const btn = document.getElementById('hamburger-btn');
  const overlay = document.getElementById('sidebar-overlay');
  const isOpen = sidebar.classList.contains('mobile-open');
  if (isOpen) {
    closeMobileSidebar();
  } else {
    sidebar.classList.add('mobile-open');
    btn.classList.add('open');
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }
}
function closeMobileSidebar() {
  document.getElementById('sidebar')?.classList.remove('mobile-open');
  document.getElementById('hamburger-btn')?.classList.remove('open');
  document.getElementById('sidebar-overlay')?.classList.remove('visible');
  document.body.style.overflow = '';
}

// ===== SETTINGS PANEL =====
const KEYS_KEY = 'er_apikeys';
function getApiKeys() { return LS.get(KEYS_KEY, { openai: '', gemini: '' }); }
function buildSettings() {
  const existing = document.getElementById('settings-panel');
  if (existing) return;
  const panel = document.createElement('div');
  panel.className = 'settings-panel';
  panel.id = 'settings-panel';
  panel.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px">
      <div style="font-family:var(--font-heading);font-size:20px;font-weight:700">⚙️ Settings</div>
      <button onclick="closeSettings()" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:20px">✕</button>
    </div>
    <div style="font-size:12px;color:var(--text-muted);margin-bottom:16px;line-height:1.6">
      Your API keys are stored <strong>locally</strong> in your browser (never sent to our servers). They're used to query AI models directly.
    </div>
    <div style="font-size:11px;color:var(--text-muted);margin-bottom:12px">
      For privacy, saved keys are hidden here. Enter a new key only if you want to change it.
    </div>
    <div class="input-group">
      <div class="input-label">🤖 OpenAI API Key</div>
      <input type="password" class="input-field api-key-input" id="key-openai" placeholder="Enter new OpenAI key (optional)" value="">
      <div style="font-size:11px;color:var(--text-muted)">Get key: <a href="https://platform.openai.com/api-keys" target="_blank" style="color:var(--accent)">platform.openai.com</a></div>
    </div>
    <div class="input-group">
      <div class="input-label">✨ Google Gemini API Key</div>
      <input type="password" class="input-field api-key-input" id="key-gemini" placeholder="Enter new Gemini key (optional)" value="">
      <div style="font-size:11px;color:var(--text-muted)">Get key: <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color:var(--accent)">aistudio.google.com</a></div>
    </div>
    <button class="btn btn-primary" style="width:100%;margin-top:8px" onclick="saveApiKeys()">💾 Save Keys</button>
    <div class="divider"></div>
    <div style="font-family:var(--font-heading);font-size:16px;font-weight:700;margin-bottom:16px">🎯 Preferences</div>
    <div class="input-group">
      <div class="input-label">Default Study Session</div>
      <select class="input-field" id="pref-session" onchange="savePrefs()">
        <option value="25">25 minutes (Classic Pomodoro)</option>
        <option value="45">45 minutes (Deep Work)</option>
        <option value="60">60 minutes (Flow State)</option>
      </select>
    </div>
    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border-color)">
      <span style="font-size:14px">Focus Mode</span>
      <label class="toggle-switch">
        <input type="checkbox" id="pref-focus" onchange="toggleFocusMode(this.checked)">
        <span class="toggle-slider"></span>
      </label>
    </div>
    <div class="divider"></div>
    <div style="font-family:var(--font-heading);font-size:16px;font-weight:700;margin-bottom:12px">📊 Stats Reset</div>
    <button class="btn btn-danger btn-sm" onclick="resetStats()">🗑️ Reset All Study Stats</button>
  `;
  document.body.appendChild(panel);
  const overlay = document.createElement('div');
  overlay.className = 'settings-overlay';
  overlay.id = 'settings-overlay';
  overlay.onclick = closeSettings;
  document.body.appendChild(overlay);
}
function openSettings() {
  buildSettings();
  document.getElementById('settings-panel').classList.add('open');
  document.getElementById('settings-overlay').classList.add('open');
}
function closeSettings() {
  document.getElementById('settings-panel')?.classList.remove('open');
  document.getElementById('settings-overlay')?.classList.remove('open');
}
function saveApiKeys() {
  const existing = getApiKeys();
  const openaiInput = document.getElementById('key-openai').value.trim();
  const geminiInput = document.getElementById('key-gemini').value.trim();
  const keys = {
    openai: openaiInput || existing.openai || '',
    gemini: geminiInput || existing.gemini || ''
  };
  LS.set(KEYS_KEY, keys);
  toast((openaiInput || geminiInput) ? 'API keys updated securely!' : 'No key changes saved.', '🔑');
}
function resetStats() {
  if (confirm('Reset all study stats? This cannot be undone.')) {
    localStorage.removeItem(STATS_KEY);
    toast('Stats reset!', '🗑️');
    setTimeout(() => location.reload(), 1000);
  }
}
function savePrefs() { }
function toggleFocusMode(on) { document.body.classList.toggle('focus-mode', on); }

// ===== WEB AUDIO SOUND ENGINE =====
let audioCtx = null;
let currentSound = null;
let soundNodes = {};
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
function createRainNoise(ctx) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.18;
  const src = ctx.createBufferSource();
  src.buffer = buf; src.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass'; filter.frequency.value = 500; filter.Q.value = 0.3;
  const gain = ctx.createGain(); gain.gain.value = 0.6;
  src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
  src.start();
  return { src, gain };
}
function createLibraryNoise(ctx) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.04;
  const src = ctx.createBufferSource();
  src.buffer = buf; src.loop = true;
  const gain = ctx.createGain(); gain.gain.value = 0.4;
  src.connect(gain); gain.connect(ctx.destination);
  src.start();
  return { src, gain };
}
function createWhiteNoise(ctx) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.12;
  const src = ctx.createBufferSource();
  src.buffer = buf; src.loop = true;
  const gain = ctx.createGain(); gain.gain.value = 0.5;
  src.connect(gain); gain.connect(ctx.destination);
  src.start();
  return { src, gain };
}
function stopCurrentSound() {
  if (soundNodes.src) { try { soundNodes.src.stop(); } catch { } }
  soundNodes = {};
}
function toggleSound(type) {
  const ctx = getAudioCtx();
  document.querySelectorAll('.sound-btn').forEach(b => b.classList.remove('active'));
  if (currentSound === type) {
    stopCurrentSound(); currentSound = null; return;
  }
  stopCurrentSound();
  if (type === 'rain') soundNodes = createRainNoise(ctx);
  else if (type === 'library') soundNodes = createLibraryNoise(ctx);
  else if (type === 'noise') soundNodes = createWhiteNoise(ctx);
  currentSound = type;
  const btn = document.getElementById(`snd-${type === 'rain' ? 'rain' : type === 'library' ? 'lib' : 'noise'}`);
  if (btn) btn.classList.add('active');
}

// ===== MOTIVATIONAL QUOTES =====
const QUOTES = [
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Your only limit is your mind.", author: "Unknown" },
  { text: "Push yourself because no one else is going to do it for you.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Dream it. Wish it. Do it.", author: "Unknown" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "Education is the most powerful weapon you can use to change the world.", author: "Nelson Mandela" },
  { text: "You are capable of more than you know.", author: "E.O. Wilson" },
  { text: "Every expert was once a beginner.", author: "Helen Hayes" },
  { text: "Strive for progress, not perfection.", author: "Unknown" },
  { text: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" }
];
function getRandomQuote() { return QUOTES[Math.floor(Math.random() * QUOTES.length)]; }

// ===== MNEMONICS =====
const MNEMONICS = [
  { topic: "OSI Model Layers", trick: "Please Do Not Throw Sausage Pizza Away → Physical, Data Link, Network, Transport, Session, Presentation, Application" },
  { topic: "TCP vs UDP", trick: "TCP = Telephone Call (reliable, ordered, connected). UDP = Unregistered Delivery Person (fast, no guarantee)" },
  { topic: "AVL Tree Rotations", trick: "LL → Right Rotate • RR → Left Rotate • LR → Left then Right • RL → Right then Left" },
  { topic: "Deadlock Conditions", trick: "MICE: Mutual exclusion, no preemption (Involuntary), Circular wait, Hold & wait (Existing resources)" },
  { topic: "SQL Joins", trick: "INNER = only matching. LEFT = all left + matching right. RIGHT = all right + matching left. FULL = everything." },
  { topic: "Big-O Cheat", trick: "O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ). Remember: Constant Log Linear NlogN Quadratic Exponential" },
  { topic: "Blockchain PoW vs PoS", trick: "PoW = Work hard (miners, energy). PoS = Stake money (validators, eco-friendly). PoW = Bitcoin. PoS = Ethereum 2.0" },
  { topic: "IoT Protocol Layers", trick: "AMQP, MQTT, CoAP are to IoT what HTTP is to Web. MQTT = lightweight pub/sub for constrained devices" },
  { topic: "Normal Forms", trick: "1NF: Atomic. 2NF: No partial dependency. 3NF: No transitive dependency. BCNF: Every determinant is superkey." },
  { topic: "Sorting Complexity", trick: "Bubble/Selection/Insertion = O(n²). Merge/Heap/Quick(avg) = O(n log n). Radix/Counting = O(n). Merge always O(n log n)." },
  { topic: "IP Address Classes", trick: "A(1-126): Big networks. B(128-191): Medium. C(192-223): Small. D(224-239): Multicast. E(240-255): Experimental" },
  { topic: "OOP Pillars", trick: "APIE: Abstraction, Polymorphism, Inheritance, Encapsulation. All 4 make code maintainable and reusable." },
];

// ===== INIT =====
function initPage(activeHref) {
  initTheme();
  buildSidebar(activeHref);
  // Show profile modal on first visit (after 500ms for smooth page load)
  if (typeof showProfileModal === 'function') {
    setTimeout(() => showProfileModal(false), 500);
  }
}

