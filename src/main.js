// ==========================================================================
// Aadil & Shifa Wedding Portfolio - Interactive JavaScript Engine
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initAudioPlayer();
  initCalendarGenerator();
  initCopyInvitation();
  initRSVPModal();
  initGalleryLightbox();
  loadSavedWishes();
});

// --------------------------------------------------------------------------
// 1. LIVE COUNTDOWN TIMER (Target: October 11, 2026 at 11:00 AM)
// --------------------------------------------------------------------------
function initCountdown() {
  const targetDate = new Date('October 11, 2026 11:00:00').getTime();

  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minsEl = document.getElementById('count-minutes');
  const secsEl = document.getElementById('count-seconds');

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minsEl) minsEl.textContent = '00';
      if (secsEl) secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

// --------------------------------------------------------------------------
// 2. AUDIO PLAYER WITH UPLOADED BARAKALLAH MP3 (Loops 1:12 to 1:30 min)
// --------------------------------------------------------------------------
function initAudioPlayer() {
  const audioBtn = document.getElementById('audio-toggle-btn');
  const playingIcon = document.getElementById('audio-icon-playing');
  const mutedIcon = document.getElementById('audio-icon-muted');

  const bgAudio = new Audio('/audio/Barakallah(KoshalWorld.Com).mp3');
  bgAudio.loop = true;
  bgAudio.volume = 0.8;
  const START_TIME = 72; // 1:12 min (72 seconds)
  const END_TIME = 90;   // 1:30 min (90 seconds)

  let isPlaying = false;

  bgAudio.addEventListener('timeupdate', () => {
    if (isPlaying && (bgAudio.currentTime >= END_TIME || bgAudio.currentTime < START_TIME)) {
      bgAudio.currentTime = START_TIME;
    }
  });

  function playAudio() {
    if (bgAudio.currentTime < START_TIME || bgAudio.currentTime >= END_TIME) {
      bgAudio.currentTime = START_TIME;
    }

    bgAudio.play().then(() => {
      isPlaying = true;
      updateUI(true);
    }).catch(err => {
      console.log('Autoplay blocked, waiting for user click:', err);
    });
  }

  function pauseAudio() {
    bgAudio.pause();
    isPlaying = false;
    updateUI(false);
  }

  function updateUI(playing) {
    if (!audioBtn) return;
    if (playing) {
      audioBtn.classList.remove('muted');
      if (playingIcon) {
        playingIcon.classList.remove('hidden-svg');
        playingIcon.classList.add('active-svg');
      }
      if (mutedIcon) {
        mutedIcon.classList.add('hidden-svg');
        mutedIcon.classList.remove('active-svg');
      }
    } else {
      audioBtn.classList.add('muted');
      if (playingIcon) {
        playingIcon.classList.add('hidden-svg');
        playingIcon.classList.remove('active-svg');
      }
      if (mutedIcon) {
        mutedIcon.classList.remove('hidden-svg');
        mutedIcon.classList.add('active-svg');
      }
    }
  }

  // Initial UI state set to muted until played
  updateUI(false);

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      if (isPlaying) {
        pauseAudio();
        showToast('🔇 Audio muted');
      } else {
        playAudio();
        showToast('🎵 Playing "Barakallah" (1:12 - 1:30)');
      }
    });
  }

  // Auto-play on first click anywhere on page if not already playing
  const handleFirstInteraction = () => {
    if (!isPlaying) {
      playAudio();
    }
    document.removeEventListener('click', handleFirstInteraction);
  };
  document.addEventListener('click', handleFirstInteraction, { once: true });
}

// --------------------------------------------------------------------------
// 3. GOOGLE CALENDAR LINK GENERATOR
// --------------------------------------------------------------------------
function initCalendarGenerator() {
  const calBtn = document.getElementById('add-calendar-btn');
  if (!calBtn) return;

  calBtn.addEventListener('click', () => {
    const title = encodeURIComponent('Aadil & Shifa Wedding Celebration');
    const details = encodeURIComponent('We warmly invite you to celebrate the marriage of Aadil & Shifa at Qamar Palace, Kallumpuram.');
    const location = encodeURIComponent('Qamar Palace, Kallumpuram');
    const dates = '20261011T053000Z/20261011T093000Z'; // UTC equivalent of 11:00 AM - 3:00 PM IST

    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
    window.open(googleCalUrl, '_blank');
    showToast('📅 Opening Google Calendar...');
  });
}

// --------------------------------------------------------------------------
// 4. COPY INVITATION TO CLIPBOARD
// --------------------------------------------------------------------------
function initCopyInvitation() {
  const copyBtn = document.getElementById('copy-invite-btn');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const inviteText = `✨ Wedding Invitation: Aadil & Shifa ✨\n\nTogether with their families, we cordially solicit your prayers and presence on the marriage of Aadil with Shifa.\n\n📅 Date: Sunday, 11 October 2026\n⏰ Lunch: 11:00 AM – 3:00 PM\n📍 Venue: Qamar Palace, Kallumpuram\n\nMap Link: https://www.google.com/maps/search/?api=1&query=Qamar+Palace+Kallumpuram\n\nWebsite: https://adhil-shifa-wedding.vercel.app/`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(inviteText).then(() => {
        showToast('📋 Wedding Invitation copied to clipboard!');
      }).catch(() => {
        fallbackCopyText(inviteText);
      });
    } else {
      fallbackCopyText(inviteText);
    }
  });

  function fallbackCopyText(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('📋 Wedding Invitation copied to clipboard!');
  }
}

// --------------------------------------------------------------------------
// 5. RSVP & WISH MODAL HANDLER
// --------------------------------------------------------------------------
function initRSVPModal() {
  const modal = document.getElementById('rsvp-modal');
  const openBtn = document.getElementById('open-rsvp-btn');
  const openWallBtn = document.getElementById('open-rsvp-wall-btn');
  const closeBtn = document.getElementById('close-modal-btn');
  const rsvpForm = document.getElementById('rsvp-form');

  function openModal() {
    if (modal) {
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (openWallBtn) openWallBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('guest-name').value.trim();
      const status = document.getElementById('attendance-status').value;
      const message = document.getElementById('guest-message').value.trim();

      if (!name || !message) return;

      const wishObj = {
        name,
        status,
        message,
        timestamp: new Date().toLocaleDateString()
      };

      appendWishCard(wishObj, true);
      saveWishToLocalStorage(wishObj);

      rsvpForm.reset();
      closeModal();
      showToast('💖 Thank you! Your wish & RSVP have been received.');
    });
  }
}

function appendWishCard(wish, animate = false) {
  const grid = document.getElementById('wishes-grid');
  if (!grid) return;

  const card = document.createElement('div');
  card.className = 'wish-card glass-card' + (animate ? ' fade-in-up' : '');
  card.innerHTML = `
    <p class="wish-message">“${escapeHTML(wish.message)}”</p>
    <div class="wish-author">
      <span class="author-name">${escapeHTML(wish.name)}</span>
      <span class="wish-badge">${escapeHTML(wish.status)}</span>
    </div>
  `;

  grid.prepend(card);
}

function saveWishToLocalStorage(wish) {
  let wishes = JSON.parse(localStorage.getItem('aadil_shifa_wishes') || '[]');
  wishes.unshift(wish);
  localStorage.setItem('aadil_shifa_wishes', JSON.stringify(wishes));
}

function loadSavedWishes() {
  const wishes = JSON.parse(localStorage.getItem('aadil_shifa_wishes') || '[]');
  wishes.forEach(wish => appendWishCard(wish, false));
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g,
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// --------------------------------------------------------------------------
// 6. GALLERY LIGHTBOX VIEWER
// --------------------------------------------------------------------------
function initGalleryLightbox() {
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('close-lightbox-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const src = card.getAttribute('data-src');
      const caption = card.getAttribute('data-caption');

      if (lightbox && lightboxImg) {
        lightboxImg.src = src;
        if (lightboxCaption) lightboxCaption.textContent = caption || '';
        lightbox.classList.remove('hidden');
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (lightbox) lightbox.classList.add('hidden');
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.classList.add('hidden');
    });
  }
}

// --------------------------------------------------------------------------
// 7. TOAST NOTIFICATION UTILITY
// --------------------------------------------------------------------------
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}
