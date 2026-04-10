/* ============================================================
   CONSTRUCTION SAFETY TRAINING — script.js
   ============================================================ */

/* ----------------------------------------------------------
   HAZARD DATA
   ----------------------------------------------------------
   To add real images and videos:
   1. Place image files in /images/ folder
   2. Place video files in /videos/ folder
   3. Update the `image`, `safeVideo`, and `unsafeVideo`
      paths below to match your file names
   ---------------------------------------------------------- */
const HAZARDS = {
  roof: {
    id:         'roof',
    title:      'Roof Work',
    icon:       '🏗️',
    riskLevel:  'high',
    image:      'images/roof.jpg',          // ← replace with your image
    safeVideo:  'videos/roof_safe.mp4',     // ← replace with your video
    unsafeVideo:'videos/roof_unsafe.mp4'   // ← replace with your video
  },
  scaffolding: {
    id:         'scaffolding',
    title:      'Scaffolding',
    icon:       '🦺',
    riskLevel:  'high',
    image:      'images/scaffolding.jpg',
    safeVideo:  'videos/scaffold_safe.mp4',
    unsafeVideo:'videos/scaffold_unsafe.mp4'
  },
  electrocution: {
    id:         'electrocution',
    title:      'Electrocution',
    icon:       '⚡',
    riskLevel:  'high',
    image:      'images/electrocution.jpg',
    safeVideo:  'videos/electrocution_safe.mp4',
    unsafeVideo:'videos/electrocution_unsafe.mp4'
  },
  excavation: {
    id:         'excavation',
    title:      'Excavation',
    icon:       '⛏️',
    riskLevel:  'High',
    image:      'images/excavation.jpg',
    safeVideo:  'videos/excavation_safe.mp4',
    unsafeVideo:'videos/excavation_unsafe.mp4'
  }
};

/* ----------------------------------------------------------
   DOM REFERENCES
   ---------------------------------------------------------- */
const homeScreen        = document.getElementById('home-screen');
const trainingScreen    = document.getElementById('training-screen');
const hazardGrid        = document.getElementById('hazard-grid');

const backBtn           = document.getElementById('back-btn');
const trainingTitle     = document.getElementById('training-title');
const trainingHazardIcon= document.getElementById('training-hazard-icon');

const hazardImageWrap   = document.getElementById('hazard-image-wrap');
const hazardImage       = document.getElementById('hazard-image');
const imageOverlayTag   = document.getElementById('image-overlay-tag');

const videoWrap         = document.getElementById('video-wrap');
const trainingVideo     = document.getElementById('training-video');
const videoSource       = document.getElementById('video-source');
const videoTypeTag      = document.getElementById('video-type-tag');
const mediaLabel        = document.getElementById('media-label');

const questionBlock     = document.getElementById('question-block');
const actionButtons     = document.getElementById('action-buttons');
const videoControls     = document.getElementById('video-controls');

const btnSafe           = document.getElementById('btn-safe');
const btnUnsafe         = document.getElementById('btn-unsafe');
const btnReplay         = document.getElementById('btn-replay');
const btnShowImage      = document.getElementById('btn-show-image');

/* ----------------------------------------------------------
   STATE
   ---------------------------------------------------------- */
let currentHazard = null;

/* ----------------------------------------------------------
   INIT — Build hazard cards
   ---------------------------------------------------------- */
function initHazardGrid () {
  Object.values(HAZARDS).forEach(hazard => {
    const card = document.createElement('div');
    card.className  = 'hazard-card';
    card.setAttribute('data-hazard', hazard.id);
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Open ${hazard.title} training`);

    card.innerHTML = `
      <div class="card-icon-wrap">${hazard.icon}</div>
      <span class="card-hazard-name">${hazard.title}</span>
      <span class="card-level level-${hazard.riskLevel}">
        ${hazard.riskLevel === 'high' ? '⚠ HIGH RISK' : '⚡ MED RISK'}
      </span>
    `;

    card.addEventListener('click',   () => openTraining(hazard.id));
    card.addEventListener('keydown',  e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openTraining(hazard.id); } });

    hazardGrid.appendChild(card);
  });
}

/* ----------------------------------------------------------
   OPEN TRAINING SCREEN
   ---------------------------------------------------------- */
function openTraining (hazardId) {
  const hazard = HAZARDS[hazardId];
  if (!hazard) return;

  currentHazard = hazard;

  /* Populate header */
  trainingTitle.textContent      = hazard.title;
  trainingHazardIcon.textContent = hazard.icon;

  /* Reset media zone to image view */
  showHazardImage(hazard);

  /* Switch screens */
  homeScreen.classList.remove('active');
  trainingScreen.classList.add('active');

  /* Scroll to top */
  window.scrollTo({ top: 0, behavior: 'instant' });
}

/* ----------------------------------------------------------
   SHOW HAZARD IMAGE (reset state)
   ---------------------------------------------------------- */
function showHazardImage (hazard) {
  /* Stop any playing video */
  trainingVideo.pause();

  /* Set image */
  hazardImage.src = hazard.image;
  hazardImage.alt = `${hazard.title} hazard scenario`;

  /* Show image, hide video */
  hazardImageWrap.classList.remove('hidden');
  videoWrap.classList.add('hidden');
  videoControls.classList.add('hidden');

  /* Show question + buttons */
  questionBlock.classList.remove('hidden');
  actionButtons.classList.remove('hidden');

  /* Reset media label */
  mediaLabel.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
    HAZARD SCENARIO
  `;
}

/* ----------------------------------------------------------
   PLAY VIDEO
   ---------------------------------------------------------- */
function playVideo (type) {
  if (!currentHazard) return;

  const isSafe  = type === 'safe';
  const srcPath = isSafe ? currentHazard.safeVideo : currentHazard.unsafeVideo;

  /* Update tag */
  videoTypeTag.textContent = isSafe ? '✔ SAFE SCENARIO' : '✘ UNSAFE SCENARIO';
  videoTypeTag.className   = `video-type-tag ${isSafe ? 'tag-safe' : 'tag-unsafe'}`;

  /* Load & play */
  videoSource.src = srcPath;
  trainingVideo.load();
  trainingVideo.play().catch(() => {
    /* Autoplay blocked by browser — video still loads, user can press play */
  });

  /* Update media label */
  mediaLabel.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
    ${isSafe ? 'SAFE PROCEDURE VIDEO' : 'UNSAFE SCENARIO — DO NOT REPLICATE'}
  `;

  /* Swap image for video */
  hazardImageWrap.classList.add('hidden');
  videoWrap.classList.remove('hidden');

  /* Show controls, hide question + buttons */
  questionBlock.classList.add('hidden');
  actionButtons.classList.add('hidden');
  videoControls.classList.remove('hidden');

  /* Scroll media into view */
  mediaLabel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ----------------------------------------------------------
   BACK TO HOME
   ---------------------------------------------------------- */
function goHome () {
  trainingVideo.pause();
  trainingScreen.classList.remove('active');
  homeScreen.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'instant' });
  currentHazard = null;
}

/* ----------------------------------------------------------
   EVENT LISTENERS
   ---------------------------------------------------------- */
backBtn.addEventListener('click', goHome);

btnSafe.addEventListener('click',   () => playVideo('safe'));
btnUnsafe.addEventListener('click', () => playVideo('unsafe'));

btnReplay.addEventListener('click', () => {
  trainingVideo.currentTime = 0;
  trainingVideo.play().catch(() => {});
});

btnShowImage.addEventListener('click', () => {
  if (currentHazard) showHazardImage(currentHazard);
});

/* Browser back button support */
window.addEventListener('popstate', () => {
  if (trainingScreen.classList.contains('active')) goHome();
});

/* ----------------------------------------------------------
   BOOTSTRAP
   ---------------------------------------------------------- */
initHazardGrid();
