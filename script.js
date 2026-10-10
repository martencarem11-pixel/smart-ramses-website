const sidebar = document.getElementById('sidebar');
const menuBtn = document.getElementById('menuBtn');
const settingsModal = document.getElementById('settingsModal');
const voiceOverlay = document.getElementById('voiceOverlay');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const voiceBtn = document.getElementById('voiceBtn');
const waveCanvas = document.getElementById('waveCanvas');
const welcomeCard = document.getElementById('welcomeCard');
const chatArea = document.getElementById('chatArea');

function toggleSidebar() {
  sidebar.classList.toggle('open');
}

if (menuBtn) {
  menuBtn.addEventListener('click', toggleSidebar);
}

function openSettings() {
  settingsModal.classList.remove('hidden');
}

function closeSettings() {
  settingsModal.classList.add('hidden');
}

function openVoiceMode() {
  voiceOverlay.classList.remove('hidden');
  startWaveAnimation();
}

function closeVoiceMode() {
  voiceOverlay.classList.add('hidden');
  stopWaveAnimation();
}

document.getElementById('settingsBtn')?.addEventListener('click', openSettings);
document.getElementById('topSettingsBtn')?.addEventListener('click', openSettings);
document.getElementById('profileBtn')?.addEventListener('click', openSettings);
document.getElementById('closeSettingsBtn')?.addEventListener('click', closeSettings);
document.getElementById('closeVoiceBtn')?.addEventListener('click', closeVoiceMode);
voiceBtn?.addEventListener('click', openVoiceMode);
document.getElementById('toggleVoiceBtn')?.addEventListener('click', () => {
  voiceBtn.classList.toggle('recording');
  const btn = document.getElementById('toggleVoiceBtn');
  btn.textContent = btn.textContent === 'Start' ? 'Stop' : 'Start';
});

chatInput.addEventListener('input', () => {
  const hasText = chatInput.value.trim().length > 0;
  sendBtn.disabled = !hasText;
  sendBtn.style.opacity = hasText ? '1' : '0.5';
});

sendBtn.addEventListener('click', () => {
  const text = chatInput.value.trim();
  if (!text) return;

  createMessage(text, 'user');
  chatInput.value = '';
  sendBtn.disabled = true;
  sendBtn.style.opacity = '0.5';

  if (welcomeCard) {
    welcomeCard.remove();
  }

  setTimeout(() => {
    createMessage('Ramses AI: This is a simulated historical answer. Connect the backend API to get real RAG responses and citations from Egyptian history sources.', 'ai');
  }, 700);
});

chatInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendBtn.click();
  }
});

document.querySelectorAll('.starter-card').forEach((card) => {
  card.addEventListener('click', () => {
    const prompt = card.dataset.prompt || card.textContent.trim();
    chatInput.value = prompt;
    chatInput.focus();
    sendBtn.disabled = false;
    sendBtn.style.opacity = '1';
  });
});

document.querySelectorAll('.chat-item').forEach((item) => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.chat-item').forEach((el) => el.classList.remove('active'));
    item.classList.add('active');
  });
});

const newChatBtn = document.getElementById('newChatBtn');
newChatBtn?.addEventListener('click', () => {
  const existing = document.querySelector('.welcome-card');
  if (existing) existing.remove();

  const newWelcome = document.createElement('div');
  newWelcome.className = 'welcome-card';
  newWelcome.innerHTML = `
    <div class="welcome-icon">👑</div>
    <h1>Ask Ramses</h1>
    <p>Ask about Ancient Egypt, temples, pharaohs, archaeology and monuments.</p>
    <div class="starter-grid">
      <button class="starter-card" data-prompt="Tell me about the construction of Abu Simbel."><span class="starter-icon">🏛️</span><span>Tell me about the construction of Abu Simbel.</span></button>
      <button class="starter-card" data-prompt="What were the key details of the Battle of Kadesh?"><span class="starter-icon">⚔️</span><span>What were the key details of the Battle of Kadesh?</span></button>
      <button class="starter-card" data-prompt="Explain the life and achievements of Ramses II."><span class="starter-icon">👑</span><span>Explain the life and achievements of Ramses II.</span></button>
      <button class="starter-card" data-prompt="What is the significance of the Rosetta Stone?"><span class="starter-icon">📜</span><span>What is the significance of the Rosetta Stone?</span></button>
      <button class="starter-card" data-prompt="Describe daily life in Ancient Egypt."><span class="starter-icon">🏺</span><span>Describe daily life in Ancient Egypt.</span></button>
      <button class="starter-card" data-prompt="What were the major discoveries in the Valley of the Kings?"><span class="starter-icon">🔍</span><span>What were the major discoveries in the Valley of the Kings?</span></button>
    </div>
  `;

  chatArea.prepend(newWelcome);
  bindStarterCards();
});

function createMessage(text, sender) {
  const message = document.createElement('div');
  message.className = `message-bubble ${sender}`;

  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = sender === 'user' ? 'U' : 'R';

  const body = document.createElement('div');
  body.className = 'message-body';

  if (sender === 'ai') {
    const state = document.createElement('div');
    state.className = 'message-state';
    state.innerHTML = '<span class="tiny-dot"></span> Ramses AI';
    body.appendChild(state);
  }

  const textNode = document.createElement('div');
  textNode.className = 'message-text';
  textNode.textContent = text;
  body.appendChild(textNode);

  const actions = document.createElement('div');
  actions.className = 'message-actions';
  if (sender === 'ai') {
    actions.innerHTML = `
      <button><i class="fa-regular fa-copy"></i> Copy</button>
      <button><i class="fa-solid fa-volume-high"></i> Audio</button>
      <button><i class="fa-regular fa-thumbs-up"></i> Good</button>
    `;
  }
  body.appendChild(actions);

  message.appendChild(avatar);
  message.appendChild(body);
  chatArea.appendChild(message);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function bindStarterCards() {
  document.querySelectorAll('.starter-card').forEach((card) => {
    card.addEventListener('click', () => {
      const prompt = card.dataset.prompt || card.textContent.trim();
      chatInput.value = prompt;
      chatInput.focus();
      sendBtn.disabled = false;
      sendBtn.style.opacity = '1';
    });
  });
}

bindStarterCards();

const ctx = waveCanvas.getContext('2d');
let waveAnimationId = null;

function drawWaveFrame() {
  const { width, height } = waveCanvas;
  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = '#090d18';
  ctx.fillRect(0, 0, width, height);

  const centerY = height / 2;
  const amplitude = 14;
  const barCount = 34;

  for (let i = 0; i < barCount; i++) {
    const x = (i / barCount) * width;
    const waveValue = Math.sin((Date.now() / 500) + i / 2.4) * amplitude;
    const h = 32 + Math.abs(waveValue) + (Math.sin((i + Date.now() / 200) / 1.8) + 1) * 18;

    ctx.fillStyle = i % 2 === 0 ? '#d4af37' : '#5aa9ff';
    ctx.fillRect(x + 6, centerY - h / 2, 10, h);
  }

  for (let i = 0; i < barCount; i++) {
    const x = (i / barCount) * width;
    const waveValue = Math.cos((Date.now() / 650) + i / 3) * amplitude;
    const h = 24 + Math.abs(waveValue) + (Math.cos((i + Date.now() / 300) / 2.2) + 1) * 14;

    ctx.fillStyle = 'rgba(255,255,255,0.33)';
    ctx.fillRect(x + 6, centerY + 8 - h / 2, 4, h);
  }

  waveAnimationId = requestAnimationFrame(drawWaveFrame);
}

function startWaveAnimation() {
  cancelAnimationFrame(waveAnimationId);
  drawWaveFrame();
}

function stopWaveAnimation() {
  cancelAnimationFrame(waveAnimationId);
  const { width, height } = waveCanvas;
  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = '#090d18';
  ctx.fillRect(0, 0, width, height);
}

settingsModal?.addEventListener('click', (event) => {
  if (event.target === settingsModal) closeSettings();
});

voiceOverlay?.addEventListener('click', (event) => {
  if (event.target === voiceOverlay) closeVoiceMode();
});

window.addEventListener('resize', () => {
  if (!voiceOverlay.classList.contains('hidden')) {
    startWaveAnimation();
  }
});

sendBtn.disabled = true;
sendBtn.style.opacity = '0.5';
