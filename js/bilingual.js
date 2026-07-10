/**
 * Quan Zhen Cultural Society — Bilingual Toggle v1.0
 * Handles EN / 中文 switching across all pages
 * Save as: js/bilingual.js
 * Add to every HTML file: <script src="js/bilingual.js"></script>
 */

(function () {
  const LANG_KEY = 'qzcs_lang';
  const DEFAULT_LANG = 'en';

  // Get saved language or default to English
  function getLang() {
    return localStorage.getItem(LANG_KEY) || DEFAULT_LANG;
  }

  // Save language preference
  function setLang(lang) {
    localStorage.setItem(LANG_KEY, lang);
  }

  // Apply language to the page
  function applyLang(lang) {
    // Show/hide language spans
    document.querySelectorAll('[data-en]').forEach(el => {
      el.style.display = lang === 'en' ? '' : 'none';
    });
    document.querySelectorAll('[data-zh]').forEach(el => {
      el.style.display = lang === 'zh' ? '' : 'none';
    });

    // Update toggle active states
    document.querySelectorAll('.lang-en-btn').forEach(el => {
      el.classList.toggle('active', lang === 'en');
    });
    document.querySelectorAll('.lang-zh-btn').forEach(el => {
      el.classList.toggle('active', lang === 'zh');
    });

    // Update html lang attribute
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

  // Toggle between languages
  function toggleLang(lang) {
    setLang(lang);
    applyLang(lang);
  }

  // Expose toggle function globally
  window.qzSetLang = toggleLang;

  // Apply on page load
  document.addEventListener('DOMContentLoaded', function () {
    applyLang(getLang());
  });

  // Also apply immediately for elements already in DOM
  applyLang(getLang());

})();
