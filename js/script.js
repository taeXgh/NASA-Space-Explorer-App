// Use this URL to fetch NASA APOD JSON data.
const apodData = 'https://cdn.jsdelivr.net/gh/GCA-Classroom/apod/data.json';

const imgBtn = document.getElementById("getImageBtn");
const display = document.getElementById("gallery");

// Random facts object (store facts in an object as requested)
const facts = {
  0: "Space isn't completely silent.",
  1: "The Moon is lemon-shaped.",
  2: "The Milky Way smells of rum, raspberries and booze.",
  3: "On Mercury a day is twice as long as a year.",
  4: "All the other planets could fit between Earth and the Moon.",
  5: "You could survive a couple of minutes in a leaky spacesuit.",
  6: "1 tsp of neutron star weighs the same as the human population."
};

function displayRandomFact() {
  const el = document.getElementById('didYouKnowFact');
  if (!el) return;
  const values = Object.values(facts);
  const rnd = Math.floor(Math.random() * values.length);
  el.textContent = values[rnd];
}

imgBtn.addEventListener('click', ()=>{
  console.log('Getting images...');
})
// Modal elements
const modal = document.getElementById('modal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalImage = document.getElementById('modalImage');
const modalMedia = document.getElementById('modalMedia');
const modalDate = document.getElementById('modalDate');
const modalCopyright = document.getElementById('modalCopyright');
const modalExplanation = document.getElementById('modalExplanation');

// Store fetched entries (images + videos)
let apodImages = [];

// Fetch data once on load and keep items in memory
fetch(apodData)
  .then(response => response.json())
  .then(data => {
    // Keep all entries (images and videos). We'll render both.
    apodImages = Array.isArray(data) ? data : [];
    console.log('APOD entries loaded:', apodImages.length);
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

    if (item.media_type === 'video') {
      // Create iframe for video embeds in the gallery
      const iframe = document.createElement('iframe');
      iframe.setAttribute('loading', 'lazy');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('referrerpolicy', 'no-referrer');

      // Try to convert common video links to embed links
      let src = item.url || item.thumbnail_url || '';
      // YouTube watch -> embed
      if (/youtube\.com\/watch/.test(src) || /youtu\.be\//.test(src)) {
        const idMatch = src.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
        if (idMatch && idMatch[1]) src = `https://www.youtube.com/embed/${idMatch[1]}`;
      } else if (/vimeo\.com\//.test(src)) {
        const idMatch = src.match(/vimeo\.com\/(\d+)/);
        if (idMatch && idMatch[1]) src = `https://player.vimeo.com/video/${idMatch[1]}`;
      }

      iframe.src = src;
      iframe.title = item.title || 'APOD video';

      // Append iframe (no hover-zoom for videos)
      card.appendChild(iframe);
        // Add fallback link in case the embed can't play
        if (item.url) {
          const srcLink = document.createElement('a');
          srcLink.href = item.url;
          srcLink.textContent = 'Open source';
          srcLink.target = '_blank';
          srcLink.rel = 'noopener noreferrer';
          srcLink.className = 'source-link';
          card.appendChild(srcLink);
        }
    } else {
      // Image: clicking opens modal
      img.addEventListener('click', () => openModal(item));
      card.appendChild(img);
    }

    // Append title & date for all media types
    card.appendChild(title);
    card.appendChild(dateP);
    display.appendChild(card);
  });
}

// Populate and show modal
function openModal(item) {
  modalTitle.textContent = item.title || '';
  modalDate.textContent = item.date ? `Date: ${item.date}` : '';
  modalCopyright.textContent = item.copyright ? `© ${item.copyright}` : '';
  modalExplanation.textContent = item.explanation || '';

  // Clear previous media
  if (modalMedia) modalMedia.innerHTML = '';

  if (item.media_type === 'video') {
    // Create iframe in modal for playback
    const iframe = document.createElement('iframe');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('frameborder', '0');
    iframe.style.width = '100%';
    iframe.style.height = '480px';

    let src = item.url || item.thumbnail_url || '';
    if (/youtube\.com\/watch/.test(src) || /youtu\.be\//.test(src)) {
      const idMatch = src.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
      if (idMatch && idMatch[1]) src = `https://www.youtube.com/embed/${idMatch[1]}?rel=0`;
    } else if (/vimeo\.com\//.test(src)) {
      const idMatch = src.match(/vimeo\.com\/(\d+)/);
      if (idMatch && idMatch[1]) src = `https://player.vimeo.com/video/${idMatch[1]}`;
    }

    iframe.src = src;
    iframe.title = item.title || 'APOD video';
    if (modalMedia) {
      modalMedia.appendChild(iframe);
      // Add fallback link under the player inside the modal
      if (item.url) {
        const srcLink = document.createElement('a');
        srcLink.href = item.url;
        srcLink.textContent = 'Open source';
        srcLink.target = '_blank';
        srcLink.rel = 'noopener noreferrer';
        srcLink.className = 'source-link';
        modalMedia.appendChild(srcLink);
      }
    }
  } else {
    // Image
    if (modalImage) {
      modalImage.src = item.hdurl || item.url || '';
      modalImage.alt = item.title || 'APOD image';
      // ensure modalMedia contains the image element
      if (modalMedia) modalMedia.appendChild(modalImage);
    }
  }

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
  if (modalImage) modalImage.src = '';
  if (modalMedia) modalMedia.innerHTML = '';
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
// Kick off star field and display a random fact after DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    createStarField(100);
    displayRandomFact();
  });
} else {
  createStarField(100);
  displayRandomFact();
}