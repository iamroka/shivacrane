/* ============================================================
   script.js — Shiva Breakdown Service
   Structure:
     1.  Navbar — scroll + mobile toggle + active links
     2.  Hero — background slideshow
     3.  Typewriter effect
     4.  Counter animation (stats bar)
     5.  Scroll reveal
     6.  Services — tabbed spotlight
     7.  Equipment — mobile view-all toggle
     8.  Industries — mobile view-all toggle
     9.  Gallery — category filter + mosaic (mobile)
    10.  Lightbox — full-screen image viewer
    11.  Testimonials — infinite carousel
    12.  Contact form — validation + WhatsApp submit
    13.  Footer year
============================================================ */


/* ============================================================
   1. NAVBAR
============================================================ */
(function initNavbar() {
  const navbar     = document.getElementById('navbar');
  const backTop    = document.getElementById('btn-back-to-top');
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  /* Scroll: sticky style + back-to-top visibility */
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    backTop.classList.toggle('visible', window.scrollY > 350);
  }, { passive: true });

  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* Mobile hamburger toggle */
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  /* Close mobile menu on link click */
  mobileMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  /* Active nav link on scroll */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#desktop-menu .nav-link, #mobile-menu .nav-link');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => sectionObserver.observe(s));

  /* Smooth scroll with navbar offset */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - 72,
          behavior: 'smooth',
        });
      }
    });
  });
})();


/* ============================================================
   2. HERO SLIDESHOW
============================================================ */
(function initHero() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  let current  = 0;
  let heroTimer;

  function goToSlide(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startHeroAuto() {
    heroTimer = setInterval(() => goToSlide(current + 1), 5500);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(heroTimer);
      goToSlide(i);
      startHeroAuto();
    });
  });

  startHeroAuto();
})();


/* ============================================================
   3. TYPEWRITER EFFECT
============================================================ */
(function initTypewriter() {
  const phrases = [
    'Crane Hire Solutions',
    '24/7 Lifting Services',
    'Heavy Lifting Excellence',
    'Precision Crane Operations',
  ];

  const typeEl = document.getElementById('typewriter-text');
  if (!typeEl) return;

  let phraseIdx  = 0;
  let charIdx    = 0;
  let isDeleting = false;

  function typewrite() {
    const curr = phrases[phraseIdx];

    typeEl.textContent = isDeleting
      ? curr.substring(0, charIdx - 1)
      : curr.substring(0, charIdx + 1);

    isDeleting ? charIdx-- : charIdx++;

    let delay = isDeleting ? 45 : 80;

    if (!isDeleting && charIdx === curr.length) {
      delay      = 2200;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx  = (phraseIdx + 1) % phrases.length;
      delay      = 400;
    }

    setTimeout(typewrite, delay);
  }

  typewrite();
})();


/* ============================================================
   4. COUNTER ANIMATION
============================================================ */
(function initCounters() {
  const statsSection = document.getElementById('stats');
  if (!statsSection) return;

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target);
    const suffix   = el.dataset.suffix || '';
    const duration = 1800;
    const step     = 16;
    const steps    = Math.ceil(duration / step);
    let   count    = 0;
    const inc      = target / steps;

    const interval = setInterval(() => {
      count += inc;
      if (count >= target) {
        count = target;
        clearInterval(interval);
      }
      el.textContent = Math.floor(count).toLocaleString('en-IN') + suffix;
    }, step);
  }

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.counter').forEach(el => {
          if (!el.dataset.animated) {
            el.dataset.animated = 'true';
            animateCounter(el);
          }
        });
      }
    });
  }, { threshold: 0.4 });

  counterObserver.observe(statsSection);
})();


/* ============================================================
   5. SCROLL REVEAL
============================================================ */
(function initScrollReveal() {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('revealed');
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-right').forEach(el => revealObserver.observe(el));
})();


/* ============================================================
   6. SERVICES — TABBED SPOTLIGHT
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.srv-nav-item');
  const panels   = document.querySelectorAll('.srv-panel');
  const fill     = document.getElementById('srvProgressFill');
  const total    = panels.length;

  function activateService(idx, skipScroll) {
    navItems.forEach(b => b.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    navItems[idx].classList.add('active');
    panels[idx].classList.add('active');

    if (fill) fill.style.width = ((idx + 1) / total * 100) + '%';

    /* Scroll nav item into view on mobile, but not on initial load */
    if (!skipScroll) {
      navItems[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  navItems.forEach((btn, i) => {
    btn.addEventListener('click', () => activateService(i));
  });

  /* Keyboard arrow navigation (only when focus is inside the services section) */
  document.addEventListener('keydown', e => {
    const srvSection = document.getElementById('services');
    if (!srvSection || !srvSection.contains(document.activeElement)) return;
    const active = document.querySelector('.srv-nav-item.active');
    if (!active) return;
    const idx = [...navItems].indexOf(active);
    if (e.key === 'ArrowRight') { e.preventDefault(); activateService((idx + 1) % total); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); activateService((idx - 1 + total) % total); }
  });

  activateService(0, true);
});


/* ============================================================
   7. EQUIPMENT — MOBILE VIEW ALL / SHOW LESS
============================================================ */
function toggleEquipment(btn) {
  const hiddenCards = document.querySelectorAll('.equip-mobile-hidden');
  const isExpanded  = btn.dataset.expanded === 'true';

  if (!isExpanded) {
    hiddenCards.forEach((card, i) => {
      card.classList.add('equip-mobile-shown');
      card.style.opacity    = '0';
      card.style.transform  = 'translateY(20px)';
      card.style.transition = `opacity 0.4s ease ${i * 0.07}s, transform 0.4s ease ${i * 0.07}s`;
      void card.offsetWidth; /* trigger reflow */
      card.style.opacity   = '1';
      card.style.transform = 'translateY(0)';
    });
    const icon = document.createElement('i');
    icon.className  = 'fas fa-minus';
    btn.textContent = ' Show Less';
    btn.prepend(icon);
    btn.dataset.expanded = 'true';
  } else {
    /* Collapse cards */
    hiddenCards.forEach(card => {
      card.classList.remove('equip-mobile-shown');
      card.style.opacity   = '';
      card.style.transform = '';
      card.style.transition = '';
    });
    const icon = document.createElement('i');
    icon.className  = 'fas fa-plus';
    btn.textContent = ' View All Equipments';
    btn.prepend(icon);
    btn.dataset.expanded = 'false';

    /* Scroll back so the top of the equipment section is visible */
    const section = document.getElementById('equipment');
    if (section) {
      const top = section.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }
}


/* ============================================================
   8. INDUSTRIES — MOBILE VIEW ALL / SHOW LESS
============================================================ */
function toggleIndustries(btn) {
  const hiddenCards = document.querySelectorAll('.industry-mobile-hidden');
  const isExpanded  = btn.dataset.expanded === 'true';

  if (!isExpanded) {
    hiddenCards.forEach((card, i) => {
      card.classList.add('industry-shown');
      card.style.opacity    = '0';
      card.style.transform  = 'translateY(20px)';
      card.style.transition = `opacity 0.4s ease ${i * 0.07}s, transform 0.4s ease ${i * 0.07}s`;
      void card.offsetWidth;
      card.style.opacity   = '1';
      card.style.transform = 'translateY(0)';
    });
    const icon = document.createElement('i');
    icon.className  = 'fas fa-minus';
    btn.textContent = ' Show Less';
    btn.prepend(icon);
    btn.dataset.expanded = 'true';
  } else {
    /* Collapse cards */
    hiddenCards.forEach(card => {
      card.classList.remove('industry-shown');
      card.style.opacity   = '';
      card.style.transform = '';
      card.style.transition = '';
    });
    const icon = document.createElement('i');
    icon.className  = 'fas fa-plus';
    btn.textContent = ' View All';
    btn.prepend(icon);
    btn.dataset.expanded = 'false';

    /* Scroll back so the top of the industries section is visible */
    const section = document.getElementById('industries');
    if (section) {
      const top = section.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }
}


/* ============================================================
   9. GALLERY — CATEGORY FILTER + MOBILE MOSAIC
============================================================ */
const galleryBtns  = document.querySelectorAll('.gallery-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

function filterGallery(category) {
  /* Mark show/hide by category */
  galleryItems.forEach(item => {
    const matches = category === 'all' || item.classList.contains(category);
    item.classList.toggle('show', matches);
    item.removeAttribute('data-extra');
  });

  const grid     = document.querySelector('.gallery-grid.gallery-fullwidth');
  const viewBtn  = document.getElementById('galleryViewAllBtn');
  const viewWrap = viewBtn ? viewBtn.closest('.gallery-view-all-wrap') : null;
  const isMobile = window.innerWidth <= 767;

  if (!grid) return;

  if (isMobile) {
    const shown = Array.from(galleryItems).filter(i => i.classList.contains('show'));

    if (shown.length > 4) {
      /* Collapse to first 4, tag the rest */
      shown.forEach((item, idx) => {
        if (idx >= 4) {
          item.classList.remove('show');
          item.setAttribute('data-extra', 'true');
        }
      });
      grid.setAttribute('data-mosaic', 'true');
      grid.setAttribute('data-expanded', 'false');
      if (viewBtn)  viewBtn.innerHTML = 'View All Photos <i class="fas fa-chevron-right"></i>';
      if (viewWrap) viewWrap.style.display = '';
    } else {
      grid.setAttribute('data-mosaic', 'true');
      grid.removeAttribute('data-expanded');
      if (viewWrap) viewWrap.style.display = 'none';
    }
  } else {
    /* Desktop: show everything */
    grid.removeAttribute('data-mosaic');
    grid.removeAttribute('data-expanded');
    if (viewWrap) viewWrap.style.display = 'none';
  }
}

function toggleGalleryExpand() {
  const grid    = document.querySelector('.gallery-grid.gallery-fullwidth');
  const viewBtn = document.getElementById('galleryViewAllBtn');
  if (!grid) return;

  const expanded = grid.getAttribute('data-expanded') === 'true';

  if (!expanded) {
    document.querySelectorAll('[data-extra="true"]').forEach(item => {
      item.classList.add('show');
      item.removeAttribute('data-extra');
    });
    grid.setAttribute('data-expanded', 'true');
    grid.setAttribute('data-mosaic', 'true');
    if (viewBtn) viewBtn.innerHTML = 'Show Less <i class="fas fa-chevron-up"></i>';
  } else {
    /* Re-run active filter to collapse back */
    const activeBtn = document.querySelector('.gallery-btn.active');
    const category  = activeBtn ? activeBtn.dataset.filter : 'all';
    filterGallery(category);
  }
}

galleryBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    galleryBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterGallery(btn.dataset.filter);
  });
});

filterGallery('all');


/* ============================================================
   10. LIGHTBOX
============================================================ */
let lightboxImages = [];
let lightboxIndex  = 0;

function buildLightboxImages() {
  lightboxImages = Array.from(document.querySelectorAll('.gallery-grid .gallery-item')).map(item => {
    const img = item.querySelector('img');
    return { src: img.src, alt: img.alt };
  });
}

function openLightbox(item) {
  buildLightboxImages();
  const img    = item.querySelector('img');
  lightboxIndex = lightboxImages.findIndex(i => i.src === img.src);
  document.getElementById('lightbox-img').src = img.src;
  document.getElementById('lightbox-img').alt = img.alt;
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

function lightboxNav(dir) {
  lightboxIndex = (lightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
  const data    = lightboxImages[lightboxIndex];
  document.getElementById('lightbox-img').src = data.src;
  document.getElementById('lightbox-img').alt = data.alt;
}

document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb.classList.contains('active')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  lightboxNav(-1);
  if (e.key === 'ArrowRight') lightboxNav(1);
});


/* ============================================================
   11. TESTIMONIALS CAROUSEL — infinite loop, touch + keyboard
============================================================ */
(function initTestimonialsCarousel() {
  const track    = document.getElementById('testimonialsTrack');
  const dotsWrap = document.getElementById('tcarouselDots');
  const prevBtn  = document.getElementById('tcarouselPrev');
  const nextBtn  = document.getElementById('tcarouselNext');
  if (!track) return;

  /* Clone all original cards for seamless infinite loop */
  const origCards = Array.from(track.children);
  const total     = origCards.length;
  origCards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });

  let current     = 0;
  let autoTimer   = null;
  let isAnimating = false;

  /* Measure one card + gap width */
  function cardStep() {
    const card = track.children[0];
    const gap  = parseFloat(getComputedStyle(track).gap) || 0;
    return card.offsetWidth + gap;
  }

  /* Silent jump (no transition) */
  function jumpSilent(idx) {
    track.style.transition = 'none';
    track.style.transform  = `translateX(-${idx * cardStep()}px)`;
    void track.offsetWidth; /* force reflow */
  }

  /* Animated slide */
  function animateTo(idx) {
    track.style.transition = 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)';
    track.style.transform  = `translateX(-${idx * cardStep()}px)`;
  }

  /* Advance forward one card, wrapping seamlessly */
  function next() {
    if (isAnimating) return;
    const nextIdx = current + 1;

    if (nextIdx >= total) {
      /* Animate into clone of card 0, then silently reset */
      isAnimating = true;
      animateTo(total);
      updateDots(0);
      track.addEventListener('transitionend', function onEnd() {
        track.removeEventListener('transitionend', onEnd);
        jumpSilent(0);
        current     = 0;
        isAnimating = false;
      });
    } else {
      isAnimating = true;
      current     = nextIdx;
      animateTo(current);
      updateDots();
      track.addEventListener('transitionend', function onEnd() {
        track.removeEventListener('transitionend', onEnd);
        isAnimating = false;
      });
    }
  }

  /* Go backward one card */
  function prev() {
    if (isAnimating) return;

    if (current - 1 < 0) {
      /* Jump silently to the last real card */
      current     = total - 1;
      jumpSilent(total - 1);
      updateDots();
      isAnimating = false;
    } else {
      isAnimating = true;
      current--;
      animateTo(current);
      updateDots();
      track.addEventListener('transitionend', function onEnd() {
        track.removeEventListener('transitionend', onEnd);
        isAnimating = false;
      });
    }
  }

  /* Build pagination dots */
  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const d = document.createElement('button');
      d.className = 'tcarousel-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      d.addEventListener('click', () => {
        if (isAnimating) return;
        isAnimating = true;
        current     = i;
        animateTo(current);
        updateDots();
        track.addEventListener('transitionend', function onEnd() {
          track.removeEventListener('transitionend', onEnd);
          isAnimating = false;
        });
        startAuto();
      });
      dotsWrap.appendChild(d);
    }
  }

  function updateDots(forceDot) {
    const activeIdx = (forceDot !== undefined) ? forceDot : current;
    dotsWrap.querySelectorAll('.tcarousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === activeIdx);
    });
  }

  /* Auto-play */
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, 3500);
  }
  function stopAuto() { clearInterval(autoTimer); }

  /* Arrows */
  nextBtn.addEventListener('click', () => { next(); startAuto(); });
  prevBtn.addEventListener('click', () => { prev(); startAuto(); });

  /* Pause on hover */
  const wrap = track.closest('.testimonials-carousel-wrap');
  wrap.addEventListener('mouseenter', stopAuto);
  wrap.addEventListener('mouseleave', startAuto);

  /* Touch swipe */
  let touchStartX = 0;
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); startAuto(); }
  }, { passive: true });

  /* Resize: recalculate position */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => jumpSilent(current), 150);
  });

  /* Initialise */
  buildDots();
  jumpSilent(0);
  startAuto();
})();


/* ============================================================
   12. CONTACT FORM — VALIDATION + WHATSAPP SUBMIT
============================================================ */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput    = document.getElementById('f-name');
  const companyInput = document.getElementById('f-company');
  const phoneInput   = document.getElementById('f-phone');
  const emailInput   = document.getElementById('f-email');
  const serviceInput = document.getElementById('f-service');
  const messageInput = document.getElementById('f-message');

  const isValidPhone = d => /^[6-9]\d{9}$/.test(d.replace(/^(91|0091)/, ''));
  const isValidEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  /* Create and inject inline error message divs for all validated fields */
  function makeError(input, message) {
    const div = document.createElement('div');
    div.className   = 'field-error';
    div.textContent = message;
    input.parentNode.appendChild(div);
    return div;
  }

  const nameError    = makeError(nameInput,    'Please enter your name.');
  const phoneError   = makeError(phoneInput,   'Please enter a valid Indian mobile number (10 digits).');
  const emailError   = makeError(emailInput,   'Please enter a valid email address.');
  const serviceError = makeError(serviceInput, 'Please select a service.');

  /* Helper: show / clear an error */
  function showError(input, errorDiv) {
    input.classList.add('input-error');
    errorDiv.style.display = 'block';
  }
  function clearError(input, errorDiv) {
    input.classList.remove('input-error');
    errorDiv.style.display = 'none';
  }

  /* Live validation — clears error as soon as the field becomes valid */
  nameInput.addEventListener('input', () => {
    if (nameInput.value.trim()) clearError(nameInput, nameError);
  });

  phoneInput.addEventListener('input', () => {
    const d = phoneInput.value.replace(/\D/g, '');
    if (!d.length || isValidPhone(d)) clearError(phoneInput, phoneError);
  });

  emailInput.addEventListener('input', () => {
    const v = emailInput.value.trim();
    if (!v.length || isValidEmail(v)) clearError(emailInput, emailError);
  });

  serviceInput.addEventListener('change', () => {
    if (serviceInput.value) clearError(serviceInput, serviceError);
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    /* Bot honeypot — real users leave this blank */
    const honeypot = document.getElementById('f-honeypot');
    if (honeypot && honeypot.value.trim() !== '') return;

    /* Run all validations; collect first failure to focus */
    let firstError = null;

    /* Name — required */
    if (!nameInput.value.trim()) {
      showError(nameInput, nameError);
      firstError = firstError || nameInput;
    } else {
      clearError(nameInput, nameError);
    }

    /* Phone — required + format */
    const rawPhone = phoneInput.value.trim();
    if (!rawPhone || !isValidPhone(rawPhone.replace(/\D/g, ''))) {
      showError(phoneInput, phoneError);
      firstError = firstError || phoneInput;
    } else {
      clearError(phoneInput, phoneError);
    }

    /* Email — optional, but must be valid if provided */
    const rawEmail = emailInput.value.trim();
    if (rawEmail && !isValidEmail(rawEmail)) {
      showError(emailInput, emailError);
      firstError = firstError || emailInput;
    } else {
      clearError(emailInput, emailError);
    }

    /* Service — required */
    if (!serviceInput.value) {
      showError(serviceInput, serviceError);
      firstError = firstError || serviceInput;
    } else {
      clearError(serviceInput, serviceError);
    }

    /* If any field failed, focus the first one and stop */
    if (firstError) {
      firstError.focus();
      return;
    }

    /* Build WhatsApp message */
    const waText =
      `*New Enquiry — Shiva Breakdown Service*\n\n` +
      `*Name:* ${nameInput.value.trim()       || 'Not provided'}\n` +
      `*Company:* ${companyInput.value.trim() || 'Not provided'}\n` +
      `*Phone:* ${rawPhone}\n` +
      `*Email:* ${rawEmail                    || 'Not provided'}\n` +
      `*Service Required:* ${serviceInput.value}\n` +
      `*Message:* ${messageInput.value.trim() || 'No details provided'}`;

    const waURL = `https://wa.me/919822157499?text=${encodeURIComponent(waText)}`;

    /* Button loading state */
    const submitBtn = form.querySelector('.btn-submit');
    const spinIcon  = document.createElement('i');
    spinIcon.className    = 'fas fa-spinner fa-spin';
    submitBtn.textContent = ' Opening WhatsApp…';
    submitBtn.prepend(spinIcon);
    submitBtn.disabled = true;

    setTimeout(() => {
      document.getElementById('formSuccess').style.display = 'flex';
      const waIcon = document.createElement('i');
      waIcon.className      = 'fab fa-whatsapp';
      submitBtn.textContent = ' Sent via WhatsApp!';
      submitBtn.prepend(waIcon);
      submitBtn.style.background = '#25D366';
      window.open(waURL, '_blank', 'noopener,noreferrer');
    }, 800);
  });
})();


/* ============================================================
   13. FOOTER YEAR
============================================================ */
const yearEl = document.getElementById('current-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();