/**
 * Quan Zhen Cultural Society — Interactions v1.1
 * Fixes: removed hide-on-scroll nav (caused visual issues + broke mobile menu)
 * Added: image placeholder hover effects
 */

/* ── Scroll reveal for cards and sections ───────────────── */
(function () {
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
    '.lineage-connector',
    '.gold-divider',
    '.gold-divider-center',
  ];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0) scale(1)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -24px 0px' }
  );

  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      // Find sibling index for stagger
      const siblings = Array.from(el.parentElement.children).filter(c =>
        c.matches(selector)
      );
      const siblingIndex = siblings.indexOf(el);
      const delay = siblingIndex * 0.09;

      el.style.opacity = '0';
      el.style.transform = 'translateY(22px)';
      el.style.transition = `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`;
      observer.observe(el);
    });
  });
})();

/* ── Section headings reveal ────────────────────────────── */
(function () {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('h2, .eyebrow').forEach((el) => {
    if (el.closest('.hero')) return; // skip hero — has own animation
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
})();

/* ── Stats counter animation ────────────────────────────── */
(function () {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const statValue = entry.target.querySelector('.stat-value');
        if (!statValue) return;

        const text = statValue.textContent.trim();
        const hasPlus = text.includes('+');
        const num = parseFloat(text);

        if (!isNaN(num)) {
          const duration = 1400;
          const start = performance.now();
          const animate = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            statValue.textContent = Math.floor(eased * num) + (hasPlus ? '+' : '');
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stat-item').forEach((el) => observer.observe(el));
})();

/* ── Smooth scroll for anchor links ─────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 120;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── Nav scrolled state only (no hide/show) ─────────────── */
(function () {
  const nav = document.getElementById('site-nav');
  if (!nav) return;
  // Only toggle the .scrolled class for background change
  // No transform/hide behaviour — that caused the visual issues
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();

/* ── Button ripple effect ────────────────────────────────── */
(function () {
  const style = document.createElement('style');
  style.textContent = '@keyframes qz-ripple { to { transform: scale(2.5); opacity: 0; } }';
  document.head.appendChild(style);

  document.querySelectorAll('.btn').forEach((btn) => {
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';

    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute;
        width:${size}px; height:${size}px;
        left:${e.clientX - rect.left - size / 2}px;
        top:${e.clientY - rect.top - size / 2}px;
        background:rgba(255,255,255,0.15);
        border-radius:50%;
        transform:scale(0);
        animation:qz-ripple 0.5s ease forwards;
        pointer-events:none;
      `;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });
  });
})();

/* ── Image placeholder click-to-upload hint ─────────────── */
(function () {
  document.querySelectorAll('.img-placeholder').forEach((el) => {
    el.setAttribute('title', 'Replace src attribute with your image URL');
  });
})();