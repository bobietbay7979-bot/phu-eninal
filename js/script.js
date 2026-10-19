const root = document.documentElement;
const previewMode = new URLSearchParams(window.location.search).get('preview');
if (previewMode === 'mobile') {
  root.classList.add('preview-mobile');
}

const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.site-nav');
const themeButton = document.querySelector('.theme-button');
const photoDialog = document.querySelector('.photo-dialog');
const dialogImage = photoDialog.querySelector('img');
const dialogCaption = document.querySelector('#dialog-caption');
const backToTop = document.querySelector('.back-to-top');

function setTheme(theme) {
  root.dataset.theme = theme;
  themeButton.setAttribute(
    'aria-label',
    theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
  );

  try {
    localStorage.setItem('phu-yen-theme', theme);
  } catch (error) {
    console.info('Theme preference could not be stored.', error);
  }
}

let savedTheme = null;
try {
  savedTheme = localStorage.getItem('phu-yen-theme');
} catch (error) {
  console.info('Theme preference could not be read.', error);
}

setTheme(
  savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
);

themeButton.addEventListener('click', () => {
  setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
});

menuButton.addEventListener('click', () => {
  const isOpen = navigation.dataset.open === 'true';
  navigation.dataset.open = String(!isOpen);
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.querySelector('.sr-only').textContent = isOpen ? 'Open navigation' : 'Close navigation';
});

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.dataset.open = 'false';
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.querySelector('.sr-only').textContent = 'Open navigation';
  });
});

document.querySelectorAll('.photo-button').forEach((button) => {
  button.addEventListener('click', () => {
    dialogImage.src = button.dataset.image;
    dialogImage.alt = button.dataset.alt;
    dialogCaption.textContent = button.dataset.caption;
    photoDialog.showModal();
  });
});

photoDialog.addEventListener('click', (event) => {
  if (event.target === photoDialog) {
    photoDialog.close();
  }
});

window.addEventListener('scroll', () => {
  backToTop.hidden = window.scrollY < 650;
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');

if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
}

document.querySelector('#year').textContent = new Date().getFullYear();
