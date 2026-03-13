function setVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', setVh);
window.addEventListener('load', setVh);

const container = document.querySelector('.snap-container');
const sections = document.querySelectorAll('.section');
const dots = document.querySelectorAll('.dot');
const tooltip = document.getElementById('tooltip');
const depthLabel = document.getElementById('fixed-depth-label');
let isScrolling = false;

const depthTexts = [
  '0 m',
  '0—200 m',
  '200—1000 m',
  '1000—4000 m',
  '4000—6000 m',
  '6000+ m'
];

function scrollToSection(index) {
  const sectionHeight = window.innerHeight;
  isScrolling = true;
  container.scrollTo({
    top: index * sectionHeight,
    behavior: 'smooth'
  });
  setTimeout(() => { isScrolling = false; }, 800);
}

container.addEventListener('wheel', (e) => {
  e.preventDefault();
  if (isScrolling) return;

  const direction = e.deltaY > 0 ? 1 : -1;
  const currentScroll = container.scrollTop;
  const currentIndex = Math.round(currentScroll / window.innerHeight);
  const nextIndex = Math.max(0, Math.min(sections.length - 1, currentIndex + direction));

  scrollToSection(nextIndex);
}, { passive: false });

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    const index = parseInt(dot.dataset.index, 10);
    scrollToSection(index);
  });

  dot.addEventListener('mouseenter', () => {
    tooltip.innerText = dot.dataset.tooltip;
    tooltip.classList.add('visible');
  });

  dot.addEventListener('mouseleave', () => {
    tooltip.classList.remove('visible');
  });

  dot.addEventListener('mousemove', (e) => {
    tooltip.style.left = (e.clientX + 12) + 'px';
    tooltip.style.top = (e.clientY - 10) + 'px';
  });
});

container.addEventListener('scroll', () => {
  const currentIndex = Math.round(container.scrollTop / window.innerHeight);

  sections.forEach((section, idx) => {
    section.classList.toggle('active', idx === currentIndex);
  });

  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentIndex);
  });

  if (depthLabel) {
    depthLabel.textContent = depthTexts[currentIndex] || '';
  }
});

window.addEventListener('load', () => {
  sections.forEach((section, i) => section.classList.toggle('active', i === 0));
  if (depthLabel) {
    depthLabel.textContent = depthTexts[0];
  }
});

// Handle name input modal
const nameModal = document.getElementById('nameModal');
const nameInput = document.getElementById('nameInput');
const nameSubmit = document.getElementById('nameSubmit');

nameSubmit.addEventListener('click', submitName);
nameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    submitName();
  }
});

function submitName() {
  const name = nameInput.value.trim();
  if (name.length > 0) {
    // Pass name to p5.js sketch
    window.receiverName = name;
    window.animationStarted = true;
    
    // Hide modal
    nameModal.classList.add('hidden');
  } else {
    nameInput.focus();
  }
}

// Focus input on load
window.addEventListener('load', () => {
  nameInput.focus();
});

