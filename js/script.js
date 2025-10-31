// Use this URL to fetch NASA APOD JSON data.
const apodData = 'https://cdn.jsdelivr.net/gh/GCA-Classroom/apod/data.json';

const imgBtn = document.getElementById("getImageBtn");
const display = document.getElementById("gallery");

imgBtn.addEventListener('click', ()=>{
  console.log('Getting an image...');
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

  const nine = apodImages.slice(0, 9);
  renderGallery(nine);
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

    const caption = document.createElement('p');
    caption.textContent = item.title || '';

    // Clicking the image opens the modal with details
    img.addEventListener('click', () => openModal(item));

    card.appendChild(img);
    card.appendChild(caption);
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