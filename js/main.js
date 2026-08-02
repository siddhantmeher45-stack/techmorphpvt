(function() {
  'use strict';

  // ===== 1. WORD REVEAL & KINETIC TYPOGRAPHY ANIMATION =====
  const headline = document.getElementById('headline');
  if (headline) {
    const headlineWords = [
      { text: "We", highlight: false },
      { text: "engineer", highlight: false },
      { text: "immersive", highlight: true, style: "cyan-blue" },
      { text: "web", highlight: false },
      { text: "&", highlight: false },
      { text: "mobile", highlight: false },
      { text: "experiences", highlight: true, style: "cyan-blue" },
      { text: "driven", highlight: false },
      { text: "by", highlight: false },
      { text: "creativity", highlight: true, style: "purple-pink" },
      { text: "and", highlight: false },
      { text: "technology.", highlight: true, style: "cyan-blue" }
    ];

    headlineWords.forEach(function(item, i) {
      const span = document.createElement('span');
      span.className = 'word-reveal' + (item.highlight ? ' highlight-' + item.style : '');
      span.textContent = item.text;
      span.style.animationDelay = (0.7 + i * 0.055) + 's';
      headline.appendChild(span);
    });
  }

  // ===== 2. BURGER MENU & PANEL TOGGLE =====
  const burgerBtn = document.getElementById('burger-btn');
  const menuPanel = document.getElementById('menu-panel');
  let menuOpen = false;

  function toggleMenu(open) {
    menuOpen = open !== undefined ? open : !menuOpen;
    if (menuOpen) {
      burgerBtn.classList.add('open');
      menuPanel.classList.add('open');
      menuPanel.setAttribute('aria-hidden', 'false');
      burgerBtn.setAttribute('aria-label', 'Close menu');
    } else {
      burgerBtn.classList.remove('open');
      menuPanel.classList.remove('open');
      menuPanel.setAttribute('aria-hidden', 'true');
      burgerBtn.setAttribute('aria-label', 'Open menu');
    }
  }

  if (burgerBtn && menuPanel) {
    burgerBtn.addEventListener('click', () => toggleMenu());

    menuPanel.querySelectorAll('.menu-nav a, .menu-socials a').forEach(a => {
      a.addEventListener('click', () => toggleMenu(false));
    });
  }

  // ===== 3. HARDWARE-ACCELERATED SPOTLIGHT REVEAL =====
  const imgLayer = document.getElementById('reveal-img');
  const heroSection = document.getElementById('home');

  if (imgLayer && heroSection) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let smoothX = mouseX;
    let smoothY = mouseY;
    let isHovering = false;
    let animationFrameId = null;

    function updateSpotlight() {
      if (isHovering) {
        const dx = mouseX - smoothX;
        const dy = mouseY - smoothY;

        smoothX += dx * 0.15;
        smoothY += dy * 0.15;

        imgLayer.style.setProperty('--spotlight-x', `${smoothX.toFixed(1)}px`);
        imgLayer.style.setProperty('--spotlight-y', `${smoothY.toFixed(1)}px`);

        if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
          animationFrameId = requestAnimationFrame(updateSpotlight);
        } else {
          animationFrameId = null;
        }
      } else {
        animationFrameId = null;
      }
    }

    function triggerSpotlightUpdate() {
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(updateSpotlight);
      }
    }

    heroSection.addEventListener('mousemove', function(e) {
      const rect = heroSection.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;

      if (!isHovering) {
        isHovering = true;
        imgLayer.style.opacity = '1';
      }
      triggerSpotlightUpdate();
    }, { passive: true });

    heroSection.addEventListener('mouseleave', function() {
      if (isHovering) {
        isHovering = false;
        imgLayer.style.opacity = '0';
      }
    });
  }

  // ===== 4. PORTFOLIO FILTERING =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      workCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // ===== 5. TECHMORPH PROJECT CASE STUDY DATA & MODAL =====
  const projectsData = {
    ecommerce: {
      title: "E-Commerce Mobile App",
      category: "Mobile & Flutter",
      year: "2026",
      client: "Global Retail Brand",
      role: "Full-Stack Mobile Engineering (TechMorph)",
      heroImg: "images/ecommerce-app.jpg",
      description: "A cross-platform mobile shopping application engineered with Flutter, focusing on seamless multi-currency checkout, low-latency catalog filtering, and real-time push notification tracking.",
      highlights: [
        "Cross-platform iOS & Android deployment powered by Flutter & Antigravity.",
        "Sub-100ms inventory search and automated coupon engine.",
        "35% increase in conversion rates during pilot rollout."
      ]
    },
    fintech: {
      title: "FinTech Analytics Dashboard",
      category: "FinTech & Data",
      year: "2026",
      client: "Apex Capital Systems",
      role: "UI/UX & Full-Stack Development",
      heroImg: "images/fintech-dash.jpg",
      description: "A high-density financial analytics dashboard designed for real-time asset monitoring, transaction ledger auditing, and interactive chart visualizations.",
      highlights: [
        "Real-time WebSocket data stream integration.",
        "Custom glassmorphic dark interface optimized for multi-monitor trading desks.",
        "Role-based security & audit logging compliant with global fintech standards."
      ]
    },
    travel: {
      title: "Travel Booking Experience",
      category: "Interactive Web UI",
      year: "2025",
      client: "Wanderlust Destinations",
      role: "Web Design & Frontend Development",
      heroImg: "images/travel-app.jpg",
      description: "An immersive travel platform featuring interactive destination maps, personalized itinerary planners, and instant booking confirmation.",
      highlights: [
        "Fluid micro-animations and micro-interactions on itinerary selection.",
        "Fully responsive layout optimized for mobile travelers.",
        "Integrated payment gateways and automated booking receipts."
      ]
    }
  };

  const projectModal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');
  const modalBackdrop = document.getElementById('modal-backdrop');

  function openProjectModal(id) {
    const p = projectsData[id];
    if (!p) return;

    modalBody.innerHTML = `
      <div style="margin-bottom: 20px; color: var(--accent-cyan); font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;">
        ${p.category} • ${p.year}
      </div>
      <h2 style="font-family: var(--font-display); font-size: 32px; font-weight: 700; color: white; margin-bottom: 16px;">
        ${p.title}
      </h2>
      <div style="display: flex; gap: 24px; font-size: 14px; color: var(--text-muted); margin-bottom: 28px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px;">
        <div><strong>Client:</strong> ${p.client}</div>
        <div><strong>Role:</strong> ${p.role}</div>
      </div>
      <img src="${p.heroImg}" alt="${p.title}" style="width: 100%; height: 340px; object-fit: cover; border-radius: 16px; margin-bottom: 24px;" />
      <p style="font-size: 16px; color: #ddd; line-height: 160%; margin-bottom: 24px;">
        ${p.description}
      </p>
      <h3 style="font-size: 18px; font-weight: 600; color: white; margin-bottom: 12px;">Key Project Highlights</h3>
      <ul style="list-style-type: disc; padding-left: 20px; color: var(--text-muted); line-height: 170%; font-size: 15px;">
        ${p.highlights.map(h => `<li>${h}</li>`).join('')}
      </ul>
    `;

    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  workCards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      openProjectModal(id);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeProjectModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeProjectModal);

  // ===== 6. INQUIRY / CONTACT MODAL =====
  const contactModal = document.getElementById('contact-modal');
  const contactClose = document.getElementById('contact-close');
  const contactBackdrop = document.getElementById('contact-backdrop');
  const openContactBtns = document.querySelectorAll('.open-contact-modal');

  function openContact(serviceVal) {
    toggleMenu(false);
    if (serviceVal) {
      const form = document.getElementById('project-inquiry-form');
      if (form) {
        const checkboxes = form.querySelectorAll('input[name="service"]');
        checkboxes.forEach(cb => {
          cb.checked = (cb.value === serviceVal);
        });
      }
    }
    contactModal.classList.add('open');
    contactModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeContact() {
    contactModal.classList.remove('open');
    contactModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openContactBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const serviceVal = btn.getAttribute('data-service');
      openContact(serviceVal);
    });
  });if (contactClose) contactClose.addEventListener('click', closeContact);
  if (contactBackdrop) contactBackdrop.addEventListener('click', closeContact);

  const CONTACT_API = '/api/contact';
  const submitBtnDefaultHtml = `
    Send Message to TechMorph
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  `;

  function showFormSuccess(form, msg) {
    form.style.display = 'none';
    msg.classList.remove('d-none');
    setTimeout(() => {
      closeContact();
      setTimeout(() => {
        form.reset();
        form.style.display = 'block';
        msg.classList.add('d-none');
      }, 500);
    }, 3000);
  }

  window.handleFormSubmit = async function() {
    const form = document.getElementById('project-inquiry-form');
    const msg = document.getElementById('form-success-msg');
    const errorMsg = document.getElementById('form-error-msg');
    const submitBtn = form?.querySelector('.submit-form-btn');

    if (!form || !msg) return;

    const name = document.getElementById('client-name')?.value?.trim();
    const email = document.getElementById('client-email')?.value?.trim();
    const services = [...form.querySelectorAll('input[name="service"]:checked')].map((cb) => cb.value);
    const details = document.getElementById('project-details')?.value?.trim() || '';

    if (errorMsg) errorMsg.classList.add('d-none');

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending...';
    }

    try {
      const response = await fetch(CONTACT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, services, details }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      showFormSuccess(form, msg);
    } catch (err) {
      if (errorMsg) errorMsg.classList.remove('d-none');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = submitBtnDefaultHtml;
      }
    }
  };

  // ===== 7. METRIC COUNTER ANIMATION =====
  const metricCards = document.querySelectorAll('.metric-card');
  let animated = false;

  function animateCounters() {
    if (animated) return;
    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;

    const rect = aboutSection.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.8) {
      animated = true;
      metricCards.forEach(card => {
        const numElem = card.querySelector('.metric-number');
        if (!numElem) return;
        const target = parseInt(numElem.getAttribute('data-target'), 10);
        let current = 0;
        const increment = Math.ceil(target / 30);
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            numElem.textContent = target;
            clearInterval(timer);
          } else {
            numElem.textContent = current;
          }
        }, 35);
      });
    }
  }

  window.addEventListener('scroll', animateCounters);
  animateCounters();

  // ===== 8. SCROLL PROGRESS BAR, HEADER SCROLL BLUR, & BACK TO TOP =====
  const progressBar = document.getElementById('scroll-progress');
  const headerElem = document.querySelector('.header');
  const backToTopBtn = document.getElementById('back-to-top');

  function handleScrollEffects() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    if (progressBar && height > 0) {
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    }

    if (headerElem) {
      if (winScroll > 40) {
        headerElem.classList.add('scrolled');
      } else {
        headerElem.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (winScroll > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScrollEffects);
  handleScrollEffects();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();
