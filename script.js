// ===== DOM Elements =====
const loader = document.getElementById('loader');
const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const hamburger = document.getElementById('hamburger');
const darkToggle = document.getElementById('darkToggle');
const scrollTopBtn = document.getElementById('scrollTop');
const heroSlider = document.getElementById('heroSlider');
const sliderDots = document.getElementById('sliderDots');
const popupOverlay = document.getElementById('popupOverlay');
const popupClose = document.getElementById('popupClose');
const popupSubtitle = document.getElementById('popupSubtitle');
const bookNowBtn = document.getElementById('bookNowBtn');
const heroCta = document.getElementById('heroCta');
const contactForm = document.getElementById('contactForm');
const popupForm = document.getElementById('popupForm');

// ===== Loader =====
window.addEventListener('load', () => {
  setTimeout(() => loader.classList.add('hidden'), 800);
});

// ===== Sticky Navbar =====
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  navbar.classList.toggle('scrolled', scrollY > 60);
  scrollTopBtn.classList.toggle('show', scrollY > 500);

  // Active nav link based on scroll position
  const sections = document.querySelectorAll('section[id]');
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    const bottom = top + sec.offsetHeight;
    const id = sec.getAttribute('id');
    const link = navLinks.querySelector(`a[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < bottom);
    }
  });
  lastScroll = scrollY;
});

// ===== Hamburger Menu =====
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '1';
    spans[2].style.transform = '';
  }
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '1';
    spans[2].style.transform = '';
  });
});

// ===== Dark Mode Toggle =====
function setTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  darkToggle.textContent = dark ? '☀️' : '🌙';
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}

darkToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  setTheme(!isDark);
});

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') setTheme(true);

// ===== Hero Image Slider =====
let currentSlide = 0;
const slides = heroSlider.querySelectorAll('.hero-slide');
const dots = sliderDots.querySelectorAll('span');

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = index;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function nextSlide() {
  goToSlide((currentSlide + 1) % slides.length);
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    goToSlide(parseInt(dot.dataset.index));
  });
});

let sliderInterval = setInterval(nextSlide, 5000);

// Pause on hover
heroSlider.addEventListener('mouseenter', () => clearInterval(sliderInterval));
heroSlider.addEventListener('mouseleave', () => {
  sliderInterval = setInterval(nextSlide, 5000);
});

// ===== Scroll Animations =====
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.dest-card, .pkg-card, .test-card').forEach((el, i) => {
  el.style.transitionDelay = `${i % 3 * 0.15}s`;
  observer.observe(el);
});

// ===== Scroll To Top =====
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== Booking Popup =====
function openPopup(packageName) {
  popupOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
  if (packageName) {
    popupSubtitle.textContent = `Booking: ${packageName} — Fill in your details and we'll confirm within 24 hours.`;
  } else {
    popupSubtitle.textContent = "Fill in your details and we'll get back to you within 24 hours.";
  }
}

function closePopup() {
  popupOverlay.classList.remove('show');
  document.body.style.overflow = '';
}

popupClose.addEventListener('click', closePopup);
popupOverlay.addEventListener('click', (e) => {
  if (e.target === popupOverlay) closePopup();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePopup();
});

bookNowBtn.addEventListener('click', () => openPopup());
heroCta.addEventListener('click', () => openPopup());

// ===== Form Submissions =====
function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  Object.assign(toast.style, {
    position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
    background: 'linear-gradient(135deg, #1a73e8, #4e9af1)', color: '#fff',
    padding: '14px 32px', borderRadius: '50px', fontSize: '0.95rem', fontWeight: '600',
    fontFamily: "'Inter', sans-serif", zIndex: '9999',
    boxShadow: '0 8px 30px rgba(26,115,232,0.4)',
    animation: 'fadeUp 0.4s ease'
  });
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  showToast('✅ Message sent! We\'ll get back to you soon.');
  contactForm.reset();
});

popupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  closePopup();
  showToast('✅ Booking confirmed! Check your email for details.');
  popupForm.reset();
});

// Make openPopup available globally for onclick handlers
window.openPopup = openPopup;
