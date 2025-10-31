// Use this URL to fetch NASA APOD JSON data.
const apodData = 'https://cdn.jsdelivr.net/gh/GCA-Classroom/apod/data.json';

const imgBtn = document.getElementById("getImageBtn");
const display = document.getElementById("gallery");

imgBtn.addEventListener('click', ()=>{
  console.log('Getting images...');
})
// Modal elements
const modal = document.getElementById('modal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalImage = document.getElementById('modalImage');
const modalDate = document.getElementById('modalDate');
const modalCopyright = document.getElementById('modalCopyright');
const modalExplanation = document.getElementById('modalExplanation');

// Store fetched image entries
let apodImages = [];

// Fetch data once on load and keep images in memory
fetch(apodData)
  .then(response => response.json())
  .then(data => {
    // Filter only entries where media_type is image
    apodImages = data.filter(item => item.media_type === 'image');
    console.log('APOD images loaded:', apodImages.length);
  })
  .catch(err => {
    console.error('Failed to load APOD data', err);
  });

// When the user clicks the button, render the first 9 images
imgBtn.addEventListener('click', () => {
  if (!apodImages.length) {
    // If data hasn't loaded yet, give user feedback
    imgBtn.textContent = 'Loading...';
    setTimeout(() => { imgBtn.textContent = 'Fetch Space Images'; }, 1000);
    return;
  }

  // Render all image entries (remove the 9-image limit)
  renderGallery(apodImages);
});

// Render gallery thumbnails
function renderGallery(items) {
  // Clear any existing content
  display.innerHTML = '';

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'gallery-item';

    const img = document.createElement('img');
    img.src = item.url;
    img.alt = item.title || 'NASA APOD image';
    img.loading = 'lazy';

  // Title and date under the thumbnail
  const title = document.createElement('h3');
  title.textContent = item.title || '';
  title.style.fontSize = '16px';
  title.style.marginTop = '10px';

  const dateP = document.createElement('p');
  dateP.textContent = item.date ? `Date: ${item.date}` : '';
  dateP.className = 'muted';

  // Clicking the image opens the modal with details
  img.addEventListener('click', () => openModal(item));

  card.appendChild(img);
  card.appendChild(title);
  card.appendChild(dateP);
  display.appendChild(card);
  });
}

// Populate and show modal
function openModal(item) {
  modalTitle.textContent = item.title || '';
  modalImage.src = item.hdurl || item.url || '';
  modalImage.alt = item.title || 'APOD image';
  modalDate.textContent = item.date ? `Date: ${item.date}` : '';
  modalCopyright.textContent = item.copyright ? `© ${item.copyright}` : '';
  modalExplanation.textContent = item.explanation || '';

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  // Prevent background scroll while modal open
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  // restore scrolling
  document.body.style.overflow = '';
  // Clear large image src to free memory
  modalImage.src = '';
}

// Close handlers
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('open')) {
    closeModal();
  }
});

// Helpful console log for debugging
console.log('Script loaded.');

// Create a decorative star field with twinkling stars
function createStarField(count = 80) {
  // Respect reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const field = document.querySelector('.star-field');
  if (!field) return;

  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';

    // Random position
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    star.style.left = left + '%';
    star.style.top = top + '%';

    // Random size between 1 and 4 px
    const size = 1 + Math.random() * 3;
    star.style.width = size + 'px';
    star.style.height = size + 'px';

    // Random twinkle duration and delay
    const duration = 2 + Math.random() * 4; // 2s - 6s
    const delay = Math.random() * 6; // 0 - 6s
    star.style.animationDuration = prefersReduced ? '0s' : duration + 's';
    star.style.animationDelay = prefersReduced ? '0s' : delay + 's';

    // Slight variation in opacity
    star.style.opacity = 0.4 + Math.random() * 0.7;

    field.appendChild(star);
  }
}

// Kick off star field after DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => createStarField(100));
} else {
  createStarField(100);
}