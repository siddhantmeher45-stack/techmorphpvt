(function () {
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

    headlineWords.forEach(function (item, i) {
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
  const menuBackdrop = document.getElementById('menu-backdrop');
  let menuOpen = false;

  function toggleMenu(open) {
    menuOpen = open !== undefined ? open : !menuOpen;
    if (menuOpen) {
      burgerBtn.classList.add('open');
      menuPanel.classList.add('open');
      if (menuBackdrop) menuBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
      menuPanel.setAttribute('aria-hidden', 'false');
      burgerBtn.setAttribute('aria-label', 'Close menu');
    } else {
      burgerBtn.classList.remove('open');
      menuPanel.classList.remove('open');
      if (menuBackdrop) menuBackdrop.classList.remove('open');
      document.body.style.overflow = '';
      menuPanel.setAttribute('aria-hidden', 'true');
      burgerBtn.setAttribute('aria-label', 'Open menu');
    }
  }

  const drawerCloseBtn = document.getElementById('drawer-close-btn');

  if (burgerBtn && menuPanel) {
    burgerBtn.addEventListener('click', () => toggleMenu());

    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', () => toggleMenu(false));
    }

    if (menuBackdrop) {
      menuBackdrop.addEventListener('click', () => toggleMenu(false));
    }

    menuPanel.querySelectorAll('.menu-nav a, .menu-socials a, .open-contact-modal').forEach(a => {
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

    heroSection.addEventListener('mousemove', function (e) {
      const rect = heroSection.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;

      if (!isHovering) {
        isHovering = true;
        imgLayer.style.opacity = '1';
      }
      triggerSpotlightUpdate();
    }, { passive: true });

    heroSection.addEventListener('mouseleave', function () {
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
    },
    ai_workflow: {
      title: "AI Enterprise Workflow Engine",
      category: "AI & Enterprise",
      year: "2026",
      client: "Global Operations Corp",
      role: "AI Architecture & Backend (TechMorph)",
      heroImg: "images/fintech-dash.jpg",
      description: "An intelligent enterprise orchestration platform that automates document intake, natural language classification, and automated routing.",
      highlights: [
        "LLM-powered document parsing with 98.4% field accuracy.",
        "Automated fallback escalation matrix for manual human review.",
        "60% reduction in manual processing overhead for enterprise clients."
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
      <img src="${p.heroImg}" alt="${p.title}" class="modal-hero-img" />
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
  }); if (contactClose) contactClose.addEventListener('click', closeContact);
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

    // Trigger celebratory sparkles visual feedback
    const modalContent = document.querySelector('.contact-modal-content') || document.body;
    triggerCelebrationSparks(modalContent);

    setTimeout(() => {
      closeContact();
      setTimeout(() => {
        form.reset();
        form.style.display = 'block';
        msg.classList.add('d-none');
      }, 500);
    }, 3200);
  }

  window.handleFormSubmit = async function () {
    const form = document.getElementById('project-inquiry-form');
    const msg = document.getElementById('form-success-msg');
    const errorMsg = document.getElementById('form-error-msg');
    const submitBtn = form?.querySelector('.submit-form-btn');

    if (!form || !msg) return;

    const name = document.getElementById('client-name')?.value?.trim();
    const email = document.getElementById('client-email')?.value?.trim();
    const services = [...form.querySelectorAll('input[name="service"]:checked')].map((cb) => cb.value);
    const details = document.getElementById('project-details')?.value?.trim() || '';
    const honeypot = form.querySelector('input[name="b_website"]')?.value || '';

    if (errorMsg) errorMsg.classList.add('d-none');

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending...';
    }

    try {
      const response = await fetch(CONTACT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, services, details, honeypot }),
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
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== 9. FIREFLY ENERGY SWARM PARTICLE ENGINE =====
  function initParticleCanvas() {
    const canvas = document.getElementById('hero-particle-canvas');
    if (!canvas || !canvas.parentElement) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    const isMobile = window.innerWidth < 768;
    const fireflyCount = isMobile ? 25 : 65;
    const fireflies = [];
    const mouse = { x: null, y: null, radius: isMobile ? 120 : 220 };

    window.addEventListener('resize', () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    });

    const heroEl = document.getElementById('home');
    if (heroEl) {
      heroEl.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });

      heroEl.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
      });
    }

    class Firefly {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 3.5 + 1.8;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.8 + 0.3;
        this.colorHue = Math.random() > 0.4 ? 'rgba(0, 242, 254, ' : 'rgba(168, 85, 247, ';
        this.alpha = Math.random() * 0.5 + 0.3;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.03 + 0.01;
      }

      update() {
        // Natural brownian sine-wave drift
        this.angle += (Math.random() - 0.5) * 0.12;
        let vx = Math.cos(this.angle) * this.speed;
        let vy = Math.sin(this.angle) * this.speed;

        // Mouse swarm gravitation attraction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const attraction = (1 - dist / mouse.radius) * 1.2;
            const swarmAngle = Math.atan2(dy, dx);
            vx += Math.cos(swarmAngle) * attraction;
            vy += Math.sin(swarmAngle) * attraction;
          }
        }

        this.x += vx;
        this.y += vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Breathing halo pulse
        this.pulsePhase += this.pulseSpeed;
      }

      draw() {
        const currentAlpha = Math.max(0.1, this.alpha + Math.sin(this.pulsePhase) * 0.25);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

        // Radiant halo shadow glow
        ctx.shadowBlur = 18;
        ctx.shadowColor = this.colorHue.includes('0, 242') ? 'rgba(0, 242, 254, 0.85)' : 'rgba(168, 85, 247, 0.85)';
        ctx.fillStyle = this.colorHue + currentAlpha.toFixed(2) + ')';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < fireflyCount; i++) {
      fireflies.push(new Firefly());
    }

    function animateFireflies() {
      ctx.clearRect(0, 0, width, height);

      // Update & render fireflies
      for (let i = 0; i < fireflies.length; i++) {
        fireflies[i].update();
        fireflies[i].draw();
      }

      // Draw delicate luminous energy filaments between nearby fireflies
      for (let i = 0; i < fireflies.length; i++) {
        for (let j = i + 1; j < fireflies.length; j++) {
          const f1 = fireflies[i];
          const f2 = fireflies[j];
          const dx = f1.x - f2.x;
          const dy = f1.y - f2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = isMobile ? 60 : 110;

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.22;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 242, 254, ${lineAlpha.toFixed(2)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(f1.x, f1.y);
            ctx.lineTo(f2.x, f2.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animateFireflies);
    }

    animateFireflies();
  }

  // ===== 10. SCROLL REVEAL OBSERVER =====
  function initScrollRevealer() {
    const revealTargets = document.querySelectorAll(
      '.section-header, .glass-card, .service-card, .work-card, .stripe-team-card, .goal-card, .metric-card, .about-layout > div'
    );

    revealTargets.forEach((el, idx) => {
      el.classList.add('reveal-on-scroll');
      el.style.transitionDelay = `${(idx % 4) * 0.12}s`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      { threshold: 0.12 }
    );

    revealTargets.forEach((el) => observer.observe(el));
  }

  // ===== 11. CELEBRATORY SPARKS FOR FORM SUCCESS =====
  function triggerCelebrationSparks(container) {
    const burst = document.createElement('div');
    burst.className = 'celebration-burst';
    container.appendChild(burst);

    const colors = ['#00F2FE', '#4FACFE', '#A855F7', '#F472B6', '#10B981'];

    for (let i = 0; i < 28; i++) {
      const spark = document.createElement('div');
      spark.className = 'celebration-spark';
      const color = colors[Math.floor(Math.random() * colors.length)];
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 120 + 35;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;

      spark.style.backgroundColor = color;
      spark.style.setProperty('--dx', `${dx}px`);
      spark.style.setProperty('--dy', `${dy}px`);
      burst.appendChild(spark);
    }

    setTimeout(() => burst.remove(), 1000);
  }

  // Initialize enhancements when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    initParticleCanvas();
    initScrollRevealer();
  });
  initParticleCanvas();
  initScrollRevealer();

})();

