/**
 * Quan Zhen Cultural Society — Interactions v1.0
 * Save as: js/interactions.js
 * Add to every HTML file before </body>:
 * <script src="js/interactions.js"></script>
 */

/* ── Scroll reveal ──────────────────────────────────────── */
(function () {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once revealed, stop observing
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  // Observe all reveal elements
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  // Also observe gold dividers
  document.querySelectorAll('.gold-divider, .gold-divider-center').forEach((el) =>
    observer.observe(el)
  );

  // Observe lineage connectors
  document.querySelectorAll('.lineage-connector').forEach((el) =>
    observer.observe(el)
  );
})();

/* ── Auto-apply reveal classes to key sections ──────────── */
(function () {
  // Elements to reveal on scroll — applied automatically
  // so you don't have to manually add .reveal to every element

  const selectors = [
    '.event-card',
    '.pillar-card',
    '.cta-card',
    '.stat-item',
    '.scripture-card',
    '.practice-card',
    '.deity-card',
    '.committee-card',
    '.album-card',
    '.annual-card',
    '.recurring-card',
    '.timeline-item',
    '.aim-item',
    '.join-card',
    '.contact-method',
    '.social-card',
    '.article-card',
    '.process-step',
    '.lineage-node',
    '.class-slot',
    '.how-to-step',
  ];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
  );

  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el, index) => {
      // Start hidden
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = `opacity 0.6s ease ${index * 0.08}s, transform 0.6s ease ${index * 0.08}s`;

      // Only stagger within the same parent container
      // Reset index for each new parent
      const siblings = el.parentElement.querySelectorAll(selector);
      const siblingIndex = Array.from(siblings).indexOf(el);
      el.style.transitionDelay = `${siblingIndex * 0.1}s`;

      observer.observe(el);
    });
  });

  // Add visible class when intersecting
  const visibilityObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          visibilityObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
  );

  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      visibilityObserver.observe(el);
    });
  });
})();

/* ── Section headings reveal ────────────────────────────── */
(function () {
  const headingObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          headingObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll('h2, .eyebrow').forEach((el) => {
    // Skip hero headings — they have their own animation
    if (el.closest('.hero')) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    headingObserver.observe(el);
  });
})();

/* ── Stats counter animation ────────────────────────────── */
(function () {
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const statValue = entry.target.querySelector('.stat-value');
          if (!statValue) return;

          const text = statValue.textContent.trim();
          const num = parseFloat(text);

          // Only animate pure numbers
          if (!isNaN(num) && text === num.toString() ||
              text.endsWith('+') && !isNaN(parseFloat(text))) {
            const hasPlus = text.includes('+');
            const target = parseFloat(text);
            const duration = 1500;
            const start = performance.now();

            const animate = (now) => {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              // Ease out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.floor(eased * target);
              statValue.textContent = current + (hasPlus ? '+' : '');
              if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
          }
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stat-item').forEach((el) =>
    statsObserver.observe(el)
  );
})();

/* ── Smooth scroll for anchor links ─────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 120; // account for sticky nav + tabs
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── Active nav link highlight based on scroll ──────────── */
(function () {
  const navLinks = document.querySelectorAll('.nav-links a');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPath ||
        (currentPath === '' && href === 'index.html') ||
        (currentPath === 'index.html' && href === '/')) {
      link.classList.add('active');
    }
  });
})();

/* ── Hover ripple on buttons ─────────────────────────────── */
document.querySelectorAll('.btn').forEach((btn) => {
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255,255,255,0.15);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.5s ease forwards;
      pointer-events: none;
    `;

    if (!this.style.position || this.style.position === 'static') {
      this.style.position = 'relative';
    }
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});

// Inject ripple keyframe
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to { transform: scale(2.5); opacity: 0; }
  }
`;
document.head.appendChild(style);

/* ── Navbar hide on scroll down, show on scroll up ─────── */
(function () {
  const nav = document.getElementById('site-nav');
  if (!nav) return;

  let lastScroll = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const current = window.scrollY;

        if (current > lastScroll && current > 200) {
          // Scrolling down — hide nav
          nav.style.transform = 'translateY(-100%)';
        } else {
          // Scrolling up — show nav
          nav.style.transform = 'translateY(0)';
        }

        nav.style.transition = 'transform 0.3s ease, background 0.2s ease';
        lastScroll = current;
        ticking = false;
      });
      ticking = true;
    }
  });
})();

/* ── Image lazy load with fade-in ───────────────────────── */
(function () {
  const imgObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.style.transition = 'opacity 0.5s ease';
          img.style.opacity = '1';
          imgObserver.unobserve(img);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    img.style.opacity = '0';
    imgObserver.observe(img);
  });
})();
