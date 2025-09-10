// --- CORE ELEMENTS & HELPERS ---
const $$ = (sel) => document.querySelector(sel);
const alertBox = $$('#alert');

function setAlert(type, message) {
  if (!message) {
    alertBox.className = '';
    alertBox.textContent = '';
    return;
  }
  alertBox.className = 'show ' + (type === 'success' ? 'success' : 'error');
  alertBox.textContent = message;
}

// --- STEP NAVIGATION LOGIC ---
let currentStep = 'welcome';

function goToStep(stepName) {
  // Close preview if we leave step 3
  if (currentStep === 'register-bio' && stepName !== 'register-bio') {
    endPreviewSafe();
  }

  document.querySelectorAll('.step').forEach(step => {
    step.classList.toggle('active', step.dataset.step === stepName);
  });
  currentStep = stepName;

  if (stepName.startsWith('register')) {
    document.body.classList.add('body-reg-active');
  } else {
    document.body.classList.remove('body-reg-active');
  }
}

// --- NAVIGATION EVENT HANDLING & VALIDATION ---
document.body.addEventListener('click', (e) => {
  const navButton = e.target.closest('[data-nav]');
  if (!navButton) return;
  const targetStep = navButton.dataset.nav;

  if (currentStep === 'register-account' && targetStep === 'register-identity') {
    if (!$('#reg-username').value.trim() || !$('#reg-password').value) {
      return setAlert('error', 'Please choose a username and password.');
    }
  }

  if (currentStep === 'register-identity' && targetStep === 'register-bio') {
    const age = parseInt($('#reg-age').value, 10);
    if (!$('#reg-first').value.trim() || !$('#reg-last').value.trim()) {
      return setAlert('error', 'Please enter a first and last name for your character.');
    }
    if (isNaN(age) || age < 18 || age > 80) {
      return setAlert('error', 'Age must be between 18 and 80.');
    }
  }

  goToStep(targetStep);
});

// --- CUSTOM DROPDOWN LOGIC ---
const selectWrapper = $$('.custom-select-wrapper');
const selectTrigger = $$('.custom-select-trigger');
const selectOptions = $$('.custom-select-options');
const hiddenPedInput = $$('#reg-ped');
const selectedValueSpan = $$('.selected-value');

// helper
function $(sel){ return document.querySelector(sel); }

function fetchNui(action, payload) {
  return fetch(`https://${GetParentResourceName()}/${action}`, {
    method: 'POST',
    body: JSON.stringify(payload || {})
  }).catch(() => {});
}

// Toggle dropdown visibility
selectTrigger.addEventListener('click', () => {
  selectWrapper.classList.toggle('open');
});

// Handle option click
selectOptions.addEventListener('click', (e) => {
  const option = e.target.closest('.custom-option');
  if (option) {
    hiddenPedInput.value = option.dataset.value || '';
    selectedValueSpan.textContent = option.textContent;
    selectWrapper.classList.remove('open');

    // Live update preview ped if active
    if (window.__isPreviewing) {
      fetchNui('updatePreviewPed', { model: hiddenPedInput.value });
    }
  }
});

// Close dropdown when clicking outside
window.addEventListener('click', (e) => {
  if (!selectWrapper.contains(e.target) && e.target !== selectTrigger) {
    selectWrapper.classList.remove('open');
  }
});

// --- DATA POPULATION & FORM LOGIC ---

// Populate peds dropdown
async function loadPeds() {
  try {
    const resp = await fetch('peds.json');
    if (!resp.ok) throw new Error('peds.json not found');
    const list = await resp.json();

    selectOptions.innerHTML = '';

    for (const p of list) {
      const opt = document.createElement('div');
      opt.className = 'custom-option';
      opt.dataset.value = p.model;
      opt.textContent = p.label;
      selectOptions.appendChild(opt);
    }
  } catch (e) {
    console.error("Failed to load peds:", e);
    setAlert('error', 'Could not load character models.');
  }
}

// Description counter
const desc = $$('#reg-desc');
const counter = $$('#desc-count');
if (desc && counter) {
  const updateCount = () => {
    const maxLength = desc.maxLength || 400;
    counter.textContent = String(maxLength - (desc.value || '').length);
  };
  desc.addEventListener('input', updateCount);
  updateCount();
}

// LOGIN: Submit handler
$('#btn-login').addEventListener('click', (e) => {
  e.preventDefault();
  console.log("BBBBB")
  const username = $('#login-username').value.trim();
  const password = $('#login-password').value;
  setAlert(null);
  fetchNui('login', { username, password });
});

// REGISTER: Submit handler
$('#btn-register').addEventListener('click', (e) => {
  e.preventDefault();

  const payload = {
    username: $('#reg-username').value.trim(),
    password: $('#reg-password').value,
    first: $('#reg-first').value.trim(),
    last: $('#reg-last').value.trim(),
    age: parseInt($('#reg-age').value, 10) || 18,
    // gender: $('#reg-gender').value || 'other',
    ped: $('#reg-ped').value,
    description: ($('#reg-desc').value || '').slice(0, 400),
  };

  if (!payload.username || !payload.password) {
    return setAlert('error', 'Username & password are required.');
  }
  if (!payload.first || !payload.last) {
    return setAlert('error', 'Please enter a first and last name.');
  }
  if (payload.age < 18 || payload.age > 80) {
    return setAlert('error', 'Age must be between 18 and 80.');
  }
  if (payload.description.length > 400) {
    return setAlert('error', 'Description is too long.');
  }

  setAlert(null);
  fetchNui('register', payload);
});

// --- PREVIEW UX ---
window.__isPreviewing = false;
let __dragging = false;
let __lastX = 0;
let __zoomValue = 40; // 0..100

function startPreview() {
  const model = $('#reg-ped').value;
  if (!model) {
    setAlert('error', 'Select a model to preview.');
    return;
  }
  fetchNui('startPreview', { model });
  window.__isPreviewing = true;
}

function endPreviewSafe() {
  if (!window.__isPreviewing) return;
  window.__isPreviewing = false;
  fetchNui('endPreview', {});
}

// PED PREVIEW: Button
$('#btn-preview').addEventListener('click', (e) => {
  e.preventDefault();
  if (!window.__isPreviewing) startPreview();
});



// NUI open/close + alerts
window.addEventListener('message', (event) => {
  const d = event.data || {};
  switch (d.action) {
    case 'open':
      document.body.classList.remove('hidden');
      goToStep('welcome');
      setAlert('success', 'Connected! Please log in or register.');
      break;
    case 'close':
      document.body.classList.add('hidden');
      endPreviewSafe();
      setAlert(null);
      break;
    case 'alert':
      // Expect payload like { type, message }
      if (d.type && d.message) setAlert(d.type, d.message);
      // If registration succeeded, navigate to login
      if (d.type === 'success' && d.message && d.message.includes('Registration successful')) {
        goToStep('login');
      }
      break;
  }
});

// Block ESC close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') e.preventDefault();
});

// Initial load
loadPeds();


// --- LOGIN LOGIC ---

// Validation before navigating out of login (optional)
document.body.addEventListener('click', (e) => {
  const navButton = e.target.closest('[data-nav]');
  if (!navButton) return;
  const targetStep = navButton.dataset.nav;

  if (currentStep === 'login' && targetStep !== 'welcome') {
    const u = $('#login-username').value.trim();
    const p = $('#login-password').value;
    if (!u || !p) {
      e.preventDefault();
      return setAlert('error', 'Enter your username and password first.');
    }
  }
});

// Allow Enter key in login form
$('#login-password').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    $('#btn-login').click();
  }
});

// Extend NUI listener to handle login success
window.addEventListener('message', (event) => {
  const d = event.data || {};
  switch (d.action) {
    case 'alert':
      if (d.type && d.message) setAlert(d.type, d.message);

      // Registration success: redirect to login
      if (d.type === 'success' && d.message.includes('Registration successful')) {
        goToStep('login');
      }

      // Login success: auto-close UI
      if (d.type === 'success' && d.message.includes('Login successful')) {
        document.body.classList.add('hidden');
        endPreviewSafe();
      }
      break;
  }
});
