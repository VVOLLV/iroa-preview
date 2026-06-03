/**
 * Roa i18n System v3
 * Clean architecture: JSON locale files as single source of truth
 */

const I18nSystem = (() => {
  const STORAGE_KEY = 'roa-lang';
  const SUPPORTED_LANGUAGES = ['zh', 'en', 'ja', 'ko'];
  const DEFAULT_LANG = 'zh';
  const LOCALE_DIR = 'locales';

  let currentLang = DEFAULT_LANG;
  let translations = {};
  let isLoading = false;

  /**
   * Fetch JSON with robust encoding support.
   * Uses fetch() API for reliable UTF-8 handling on GitHub Pages,
   * falls back to XHR for file:// protocol.
   */
  function fetchJSON(url) {
    // Use fetch() for http/https — handles charset correctly
    if (window.fetch && window.location.protocol !== 'file:') {
      return fetch(url).then(function(response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.text();
      }).then(function(text) {
        // Strip BOM if present
        if (text.charCodeAt(0) === 0xFEFF) text = text.substring(1);
        return JSON.parse(text);
      });
    }
    // XHR fallback for file:// protocol
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.overrideMimeType('application/json; charset=utf-8');
      xhr.onload = function() {
        if (xhr.status === 200 || xhr.status === 0) {
          try {
            var text = xhr.responseText.replace(/^\uFEFF/, '');
            resolve(JSON.parse(text));
          } catch (e) {
            reject(new Error('JSON parse error: ' + e.message));
          }
        } else {
          reject(new Error('HTTP ' + xhr.status));
        }
      };
      xhr.onerror = function() { reject(new Error('Network error')); };
      xhr.send();
    });
  }

  /**
   * Deep get value by dot-path key
   */
  function getByPath(obj, path) {
    return path.split('.').reduce((o, k) => (o && o[k] !== undefined) ? o[k] : undefined, obj);
  }

  /**
   * Load translations for a language
   */
  async function loadLanguage(lang) {
    if (translations[lang]) return translations[lang];

    try {
      const data = await fetchJSON(LOCALE_DIR + '/' + lang + '.json');
      translations[lang] = data;
      console.log('[i18n] Loaded ' + lang + ' from file');
      return data;
    } catch (error) {
      console.error('[i18n] Failed to load ' + lang + '.json:', error.message);
      return null;
    }
  }

  /**
   * Get translation by key
   */
  function getTranslation(key, lang) {
    lang = lang || currentLang;
    const data = translations[lang];
    if (!data) return key;
    const value = getByPath(data, key);
    return (value !== undefined) ? value : key;
  }

  /**
   * Apply translations to all [data-i18n] elements
   */
  function applyTranslations(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    let applied = 0;
    let missing = 0;

    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = getTranslation(key, lang);

      if (translation && translation !== key) {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.placeholder = translation;
        } else if (element.tagName === 'IMG') {
          element.alt = translation;
        } else if (element.tagName === 'TITLE') {
          document.title = translation;
        } else {
          element.textContent = translation;
        }
        applied++;
      } else {
        missing++;
        if (translation === key) {
          console.warn('[i18n] Missing: ' + key + ' (' + lang + ')');
        }
      }
    });

    // Update html lang attribute
    document.documentElement.lang = lang;

    // Update meta tags
    const title = getTranslation('meta.title', lang);
    const desc = getTranslation('meta.description', lang);
    if (title && title !== 'meta.title') document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && desc && desc !== 'meta.description') metaDesc.setAttribute('content', desc);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && title && title !== 'meta.title') ogTitle.setAttribute('content', title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && desc && desc !== 'meta.description') ogDesc.setAttribute('content', desc);

    console.log('[i18n] Applied: ' + applied + ', Missing: ' + missing);
  }

  /**
   * Update language button states
   */
  function updateLangButtons(lang) {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const btnLang = btn.dataset.lang;
      if (btnLang === lang) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  }

  /**
   * Switch language
   */
  async function switchLanguage(lang) {
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      console.warn('[i18n] Unsupported: ' + lang);
      return false;
    }
    if (lang === currentLang) return true;
    if (isLoading) return false;

    isLoading = true;
    const previousLang = currentLang;
    console.log('[i18n] Switching ' + previousLang + ' -> ' + lang);

    const data = await loadLanguage(lang);
    if (!data) {
      isLoading = false;
      console.error('[i18n] Failed to load ' + lang);
      return false;
    }

    currentLang = lang;
    applyTranslations(lang);
    updateLangButtons(lang);

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}

    isLoading = false;

    if (typeof Analytics !== 'undefined' && Analytics.trackEvent) {
      Analytics.trackEvent('lang_switch', { from_lang: previousLang, to_lang: lang });
    }

    const announcer = document.getElementById('sr-announcements');
    if (announcer) {
      const names = { zh: '??', en: 'English', ja: '???', ko: '???' };
      announcer.textContent = 'Language switched to ' + (names[lang] || lang);
    }

    console.log('[i18n] Switched to ' + lang);
    return true;
  }

  /**
   * Detect preferred language
   */
  function detectLanguage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED_LANGUAGES.includes(saved)) return saved;
    } catch (e) {}

    const pathMatch = window.location.pathname.match(/^\/(en|ja|ko)\//);
    if (pathMatch) return pathMatch[1];

    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang) {
      const code = browserLang.split('-')[0].toLowerCase();
      if (SUPPORTED_LANGUAGES.includes(code)) return code;
    }

    return DEFAULT_LANG;
  }

  /**
   * Initialize
   */
  async function init() {
    console.log('[i18n] Initializing...');
    currentLang = detectLanguage();

    await loadLanguage(currentLang);
    applyTranslations(currentLang);
    updateLangButtons(currentLang);

    // Bind language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        switchLanguage(btn.dataset.lang);
      });
    });

    // Preload other languages
    setTimeout(() => {
      SUPPORTED_LANGUAGES.forEach(lang => {
        if (lang !== currentLang) loadLanguage(lang);
      });
    }, 2000);

    console.log('[i18n] Ready (' + currentLang + ')');
  }

  function getCurrentLang() { return currentLang; }
  function t(key) { return getTranslation(key, currentLang); }
  function isLoaded(lang) { return !!translations[lang]; }

  return {
    init,
    switchLanguage,
    getCurrentLang,
    t,
    getTranslation,
    isLoaded,
    applyTranslations,
    SUPPORTED_LANGUAGES
  };
})();

window.I18nSystem = I18nSystem;
