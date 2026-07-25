(function() {
  'use strict';

  // ===== 1. WORD REVEAL ANIMATION =====
  const headline = document.getElementById('headline');
  if (headline) {
    const text = "We build immersive web & mobile experiences that hang between creativity and technology.";
    const words = text.split(' ');
    words.forEach(function(word, i) {
      const span = document.createElement('span');
      span.className = 'word-reveal';
      span.textContent = word;
      span.style.animationDelay = (1 + i * 0.05) + 's';
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
  const SPOTLIGHT_R = 280;
  const imgLayer = document.getElementById('reveal-img');
  const heroSection = document.getElementById('home');

  if (imgLayer && heroSection) {
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const smooth = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let isHovering = false;

    window.addEventListener('mousemove', function(e) {
      const rect = heroSection.getBoundingClientRect();
      if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
        mouse.x = e.clientX;
        mouse.y = e.clientY - rect.top;
        if (!isHovering) {
          isHovering = true;
          imgLayer.style.opacity = '1';
        }
      } else if (isHovering) {
        isHovering = false;
        imgLayer.style.opacity = '0';
      }
    });

    function updateSpotlight() {
      if (isHovering) {
        smooth.x += (mouse.x - smooth.x) * 0.12;
        smooth.y += (mouse.y - smooth.y) * 0.12;

        const maskStyle = `radial-gradient(circle ${SPOTLIGHT_R}px at ${smooth.x}px ${smooth.y}px, black 0%, black 40%, rgba(0,0,0,0.75) 60%, rgba(0,0,0,0.4) 75%, rgba(0,0,0,0.12) 88%, transparent 100%)`;
        imgLayer.style.webkitMaskImage = maskStyle;
        imgLayer.style.maskImage = maskStyle;
      }
      requestAnimationFrame(updateSpotlight);
    }
    requestAnimationFrame(updateSpotlight);
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
      heroImg: "https://images.unsplash.com/photo-1556742049-0a67daf4005a?auto=format&fit=crop&w=1200&q=80",
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
      heroImg: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
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
      heroImg: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
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

  function openContact() {
    toggleMenu(false);
    contactModal.classList.add('open');
    contactModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeContact() {
    contactModal.classList.remove('open');
    contactModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openContactBtns.forEach(btn => btn.addEventListener('click', openContact));
  if (contactClose) contactClose.addEventListener('click', closeContact);
  if (contactBackdrop) contactBackdrop.addEventListener('click', closeContact);

  window.handleFormSubmit = function() {
    const form = document.getElementById('project-inquiry-form');
    const msg = document.getElementById('form-success-msg');
    if (form && msg) {
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

})();
