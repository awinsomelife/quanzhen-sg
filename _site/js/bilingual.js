/**
 * Quan Zhen Cultural Society — Bilingual Toggle v1.1
 * Fixed: uses 'inline' instead of '' to properly show spans
 */

(function () {
  const LANG_KEY = 'qzcs_lang';
  const DEFAULT_LANG = 'en';

  function getLang() {
    return localStorage.getItem(LANG_KEY) || DEFAULT_LANG;
  }

  function setLang(lang) {
    localStorage.setItem(LANG_KEY, lang);
  }

  function applyLang(lang) {
    // Show/hide English spans
    document.querySelectorAll('[data-en]').forEach(el => {
      el.style.display = lang === 'en' ? 'inline' : 'none';
    });

    // Show/hide Chinese spans
    document.querySelectorAll('[data-zh]').forEach(el => {
      el.style.display = lang === 'zh' ? 'inline' : 'none';
    });

    // Update toggle button active states
    document.querySelectorAll('.lang-en-btn').forEach(el => {
      el.classList.toggle('active', lang === 'en');
    });
    document.querySelectorAll('.lang-zh-btn').forEach(el => {
      el.classList.toggle('active', lang === 'zh');
    });

    // Update html lang attribute for accessibility
    document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';

    // Update page title if bilingual title exists
    const titleEl = document.querySelector('title');
    if (titleEl) {
      const enTitle = titleEl.getAttribute('data-en');
      const zhTitle = titleEl.getAttribute('data-zh');
      if (enTitle && zhTitle) {
        titleEl.textContent = lang === 'zh' ? zhTitle : enTitle;
      }
    }
  }

  // Expose toggle function globally
  window.qzSetLang = function(lang) {
    setLang(lang);
    applyLang(lang);
  };

  // Apply on DOMContentLoaded to ensure all elements exist
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      applyLang(getLang());
    });
  } else {
    // DOM already ready
    applyLang(getLang());
  }

})();