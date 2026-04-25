// ── NAV scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 80);
});

// ── Hero load animation
window.addEventListener('load', () => {
  const hero = document.getElementById('hero');
  if (hero) hero.classList.add('loaded');
});

// ── Gallery Lightbox
const galleryImages = Array.from(document.querySelectorAll('.gallery-item img')).map(img => ({
  src: img.src,
  alt: img.alt
}));

let currentImg = 0;
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const counter = document.getElementById('lightbox-counter');

function updateCounter() {
  if (counter) counter.textContent = `${currentImg + 1} / ${galleryImages.length}`;
}

function openLightbox(index) {
  currentImg = index;
  lightboxImg.src = galleryImages[index].src;
  lightboxImg.alt = galleryImages[index].alt;
  updateCounter();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function prevImg() {
  currentImg = (currentImg - 1 + galleryImages.length) % galleryImages.length;
  lightboxImg.src = galleryImages[currentImg].src;
  updateCounter();
}

function nextImg() {
  currentImg = (currentImg + 1) % galleryImages.length;
  lightboxImg.src = galleryImages[currentImg].src;
  updateCounter();
}

if (lightbox) {
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev').addEventListener('click', prevImg);
  document.getElementById('lightbox-next').addEventListener('click', nextImg);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
}

document.addEventListener('keydown', e => {
  if (!lightbox || !lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') prevImg();
  if (e.key === 'ArrowRight') nextImg();
});

document.querySelectorAll('.gallery-item').forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});

// ── Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Fade-in on scroll
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), entry.target.dataset.delay || 0);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in').forEach((el, i) => {
  el.dataset.delay = (i % 4) * 80;
  fadeObserver.observe(el);
});

// ── Mobile hamburger menu
const burger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');
if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('.mob-link, .mob-book').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ── Cookie banner
const cookieBanner = document.getElementById('cookieBanner');
const cookieAccept = document.getElementById('cookieAccept');
if (cookieBanner && !localStorage.getItem('vl_cookie_ok')) {
  setTimeout(() => cookieBanner.classList.add('visible'), 1800);
}
if (cookieAccept) {
  cookieAccept.addEventListener('click', () => {
    localStorage.setItem('vl_cookie_ok', '1');
    cookieBanner.classList.remove('visible');
  });
}

// ── Enquiry form — Web3Forms
const enquiryForm = document.getElementById('enquiryForm');
const formSuccess = document.getElementById('formSuccess');
if (enquiryForm) {
  enquiryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(enquiryForm);
    const submit = enquiryForm.querySelector('.form-submit');
    submit.textContent = 'Sending…';
    submit.disabled = true;
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.fromEntries(data))
      });
      const json = await res.json();
      if (json.success) {
        enquiryForm.style.display = 'none';
        if (formSuccess) formSuccess.style.display = 'block';
      } else {
        submit.textContent = 'Error — please try WhatsApp';
        submit.disabled = false;
      }
    } catch {
      submit.textContent = 'Error — please try WhatsApp';
      submit.disabled = false;
    }
  });
}

// ── Availability Calendar
const availCalendarEl = document.getElementById('availCalendar');
if (availCalendarEl) {
  const months = [
    { name: 'April 2026',    startDay: 2, total: 30, booked: d => false,             hold: d => d >= 22 && d <= 30 },
    { name: 'May 2026',      startDay: 4, total: 31, booked: d => (d >= 1 && d <= 3) || (d >= 20 && d <= 31), hold: d => false },
    { name: 'June 2026',     startDay: 0, total: 30, booked: d => d >= 14 && d <= 30, hold: d => d >= 7 && d <= 13 },
    { name: 'July 2026',     startDay: 2, total: 31, booked: d => true,              hold: d => false },
    { name: 'August 2026',   startDay: 5, total: 31, booked: d => d >= 1 && d <= 24, hold: d => d >= 25 && d <= 31 },
    { name: 'September 2026',startDay: 1, total: 30, booked: d => (d >= 1 && d <= 7) || (d >= 14 && d <= 20), hold: d => false },
    { name: 'October 2026',  startDay: 3, total: 31, booked: d => false,             hold: d => d >= 10 && d <= 17 },
    { name: 'November 2026', startDay: 6, total: 30, booked: d => false,             hold: d => false },
    { name: 'December 2026', startDay: 1, total: 31, booked: d => d >= 24 && d <= 31, hold: d => false },
  ];
  const dayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  let html = '<div class="avail-calendar-wrap">';
  months.forEach(m => {
    html += `<div class="avail-month">
      <div class="avail-month-name">${m.name}</div>
      <div class="cal-grid">
        ${dayNames.map(d => `<div class="cal-day-header">${d}</div>`).join('')}
        ${Array(m.startDay).fill('<div class="cal-day empty"></div>').join('')}
        ${Array.from({length: m.total}, (_, i) => {
          const d = i + 1;
          const cls = m.booked(d) ? 'booked' : m.hold(d) ? 'hold' : 'available';
          return `<div class="cal-day ${cls}">${d}</div>`;
        }).join('')}
      </div>
    </div>`;
  });
  html += '</div>';
  availCalendarEl.innerHTML = html;
}
