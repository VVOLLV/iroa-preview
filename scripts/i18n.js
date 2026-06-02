/**
 * Roa i18n System v2
 * Robust language switching with inline fallback translations
 */

const I18nSystem = (() => {
  const STORAGE_KEY = 'roa-lang';
  const SUPPORTED_LANGUAGES = ['zh', 'en', 'ja', 'ko'];
  const DEFAULT_LANG = 'zh';
  
  // Inline translations as fallback for local file:// protocol
  const INLINE_TRANSLATIONS = {
    zh: {
      meta: {
        title: "Roa - ��˼�����еط����",
        description: "Roa ��һ���˼���Ļ������������ﲻֻ�Ǽ�¼������̽����"
      },
      nav: { logo: "Roa" },
      hero: {
        title: "��˼�����еط����",
        subtitle: "Roa ��һ���˼���Ļ������������ﲻֻ�Ǽ�¼������̽����",
        cta: "��ʼ�ҵĵ�һ�黭��",
        "cta-secondary": "�ȿ���������ʲô"
      },
      features: {
        title: "������ʲô",
        subtitle: "�������㾪ϲ������"
      },
      feature: {
        1: { title: "˼��������������״", desc: "�ڵ�������ó�����뷨��ÿɼ����ɴ��������顣" },
        2: { title: "AI ������㣬������", desc: "AI ������Ҫʱ���֣�����˼��ʱ��Ĭ����������Ľ��ࡣ" },
        3: { title: "�����ϸ�ڣ�ͬʱ����", desc: "�������磬���ܿ���ɭ�֣�Ҳ�ܿ���ÿһƬҶ�ӡ�" }
      },
      philosophy: {
        label: "THINKING SPACE",
        line1: "˼������һ��",
        line2: "��Ҫ�ռ��",
        line3: "���",
        sub1: "����Ϊ��",
        sub2: "����һ����"
      },
      scenarios: {
        title: "˭������",
        subtitle: "�����ˣ�ͬһ������"
      },
      scenario: {
        1: { title: "֪ʶ������", desc: "��֯������Ϣ������̽���������ڻ������ҵ�����" },
        2: { title: "�о���", desc: "�������ף��Ա�ʵ�顣�ڵ�����߳�����������ġ�" },
        3: { title: "��Ʒ/���ʦ", desc: "������󣬿��ӻ����̡���ק����������е����ɡ�" },
        4: { title: "ѧ��/����ѧϰ��", desc: "ѧϰ�滮��֪ʶ���ۡ��ο�ģʽ������ѹ�����顣" }
      },
      cta: {
        title: "��ĵ�һ�黭�������ھͿ��Կ�ʼ",
        note: "����ע�ᣬ�ο�ģʽֱ�����顣����뷨���ᶪʧ��",
        button: "��ʼ�ҵĵ�һ�黭��"
      },
      footer: {
        tagline: "Ϊ˼���߶���",
        privacy: "��˽����",
        terms: "ʹ������",
        contact: "��ϵ����"
      }
    },
    en: {
      meta: {
        title: "Roa - A place for your thoughts",
        description: "Roa is a canvas that thinks. Not just notes, exploration."
      },
      nav: { logo: "Roa" },
      hero: {
        title: "A place for your thoughts",
        subtitle: "Roa is a canvas that thinks. Not just notes, exploration.",
        cta: "Start my first canvas",
        "cta-secondary": "See what it can do"
      },
      features: {
        title: "What it can do",
        subtitle: "Three capabilities that will surprise you"
      },
      feature: {
        1: { title: "Thoughts, finally shaped", desc: "Nodes and connections make abstract ideas visible, touchable, and reorganizable." },
        2: { title: "AI waits, never interrupts", desc: "AI appears when you need it, stays silent when you think. It respects your rhythm." },
        3: { title: "Big picture and detail, together", desc: "Zoom freely��see the forest and every single leaf at once." }
      },
      philosophy: {
        label: "THINKING SPACE",
        line1: "Thinking is an",
        line2: "activity that",
        line3: "needs space.",
        sub1: "We built it",
        sub2: "a home"
      },
      scenarios: {
        title: "Who uses it",
        subtitle: "Four types of people, one shared need"
      },
      scenario: {
        1: { title: "Knowledge Workers", desc: "Organize complex information, explore solutions in parallel. Find order in chaos." },
        2: { title: "Researchers", desc: "Organize literature, compare experiments. Nodes and connections carry your context." },
        3: { title: "Product/Designers", desc: "Break down requirements, visualize workflows. Drag and connect to feel free." },
        4: { title: "Students/Lifelong Learners", desc: "Plan learning, accumulate knowledge. Guest mode lets you explore stress-free." }
      },
      cta: {
        title: "Your first canvas starts now",
        note: "No sign-up needed. Try as guest. Your thoughts are safe.",
        button: "Start my first canvas"
      },
      footer: {
        tagline: "Built for thinkers",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        contact: "Contact Us"
      }
    },
    ja: {
      meta: {
        title: "Roa - ˼���ˡ��ӈ�����",
        description: "Roa �Ͽ����륭���Х���ӛ�h�����Ǥʤ���̽��Έ���"
      },
      nav: { logo: "Roa" },
      hero: {
        title: "˼���ˡ��ӈ�����",
        subtitle: "Roa �Ͽ����륭���Х���ӛ�h�����Ǥʤ���̽��Έ���",
        cta: "�Ϥ���ƤΥ����Х���",
        "cta-secondary": "�Ǥ��뤳�Ȥ�Ҋ��"
      },
      features: {
        title: "�Ǥ��뤳��",
        subtitle: "���ʤ����@������3�Ĥ���"
      },
      feature: {
        1: { title: "˼�������������ˤʤ�", desc: "�Ω`�ɤȽӾA�ǡ�����Ĥʥ����ǥ���Ҋ�����ꡢ���ä��ꡢ�٘��ɤǤ���褦�ˡ�" },
        2: { title: "AI �ϴ��ġ��ڤ�ʤ���", desc: "AI �ϱ�Ҫ�ʕr�ˬF�졢�����Ƥ���r�����a���ޤ������ʤ��Υꥺ������ؤ��ޤ���" },
        3: { title: "ȫ���Ԕ����ͬ�r��", desc: "���ɤ˥��`�ࡪɭ�Ȥ��٤Ƥ��~��ͬ�r��Ҋ�뤳�Ȥ��Ǥ��ޤ���" }
      },
      philosophy: {
        label: "THINKING SPACE",
        line1: "˼���Ȥϡ�",
        line2: "���g���Ҫ�Ȥ���",
        line3: "��ӤǤ���",
        sub1: "����ˡ�",
        sub2: "�ӈ����򽨤Ƥ�"
      },
      scenarios: {
        title: "�l��ʹ�äƤ��뤫",
        subtitle: "4�����פ��ˡ�����ͨ�Υ˩`��"
      },
      scenario: {
        1: { title: "�ʥ�å���`���`", desc: "�}�j���������������K�Ф��ƥ����`������̽����������Ф������Ҋ�Ĥ��롣" },
        2: { title: "�о���", desc: "���פ����������g�Y����^���Ω`�ɤȽӾA�����ʤ��Υ���ƥ����Ȥ򱣳֤��ޤ���" },
        3: { title: "�ץ�������/�ǥ����ʩ`", desc: "Ҫ����ֽ⤷����`���ե��`���ҕ�����ɥ�å��ȽӾA�����ɤ�Ф��롣" },
        4: { title: "ѧ��/����ѧ����", desc: "ѧ��Ӌ����֪�R����e�������ȥ�`�ɤǥ��ȥ쥹�ʤ����Y�Ǥ��ޤ���" }
      },
      cta: {
        title: "�Ϥ���ƤΥ����Х��ϡ���",
        note: "���h��Ҫ�������Ȥ����Y�Ǥ��ޤ����ǩ`����ʧ���ޤ���",
        button: "�Ϥ���ƤΥ����Х���"
      },
      footer: {
        tagline: "˼���ߤΤ����",
        privacy: "�ץ饤�Х��`�ݥꥷ�`",
        terms: "����Ҏ�s",
        contact: "�������Ϥ碌"
      }
    },
    ko: {
      meta: {
        title: "Roa - ???, ???",
        description: "Roa? ???? ???. ??? ??, ??? ??."
      },
      nav: { logo: "Roa" },
      hero: {
        title: "???, ???",
        subtitle: "Roa? ???? ???. ??? ??, ??? ??.",
        cta: "? ?? ??? ??",
        "cta-secondary": "??? ? ? ??? ??"
      },
      features: {
        title: "??? ? ? ???",
        subtitle: "??? ??? ? ? ?? ??"
      },
      feature: {
        1: { title: "???, ??? ???", desc: "??? ??? ???? ????? ??, ???, ???? ? ????." },
        2: { title: "AI? ?????. ?? ???.", desc: "AI? ??? ? ????, ??? ? ?????. ??? ??? ?????." },
        3: { title: "??? ???, ???", desc: "???? ??��?? ?? ???? ??? ? ? ????." }
      },
      philosophy: {
        label: "THINKING SPACE",
        line1: "????,",
        line2: "??? ???",
        line3: "?????.",
        sub1: "??? ???",
        sub2: "?????"
      },
      scenarios: {
        title: "?? ?????",
        subtitle: "? ?? ??? ???, ??? ??? ??"
      },
      scenario: {
        1: { title: "?? ???", desc: "??? ??? ????, ??? ???? ?????. ?? ??? ??? ????." },
        2: { title: "???", desc: "??? ????, ??? ?????. ??? ??? ??? ??? ????." },
        3: { title: "????/????", desc: "????? ????, ????? ??????. ???? ??? ??? ????." },
        4: { title: "??/?? ???", desc: "?? ??, ?? ??. ??? ??? ?? ?? ?????." }
      },
      cta: {
        title: "? ?? ???, ?? ?????",
        note: "?? ?? ???? ??. ???? ?????.",
        button: "? ?? ??? ??"
      },
      footer: {
        tagline: "???? ??",
        privacy: "???? ????",
        terms: "????",
        contact: "????"
      }
    }
  };

  let currentLang = DEFAULT_LANG;
  let translations = {};
  let isLoading = false;

  /**
   * Get nested value from object using dot notation path
   * Supports: "feature.1.title", "hero.cta-secondary"
   */
  function getByPath(obj, path) {
    if (!obj || !path) return undefined;
    const keys = path.split('.');
    let result = obj;
    for (const key of keys) {
      if (result === null || result === undefined) return undefined;
      // Try both string and number keys (for arrays/numbered properties)
      result = result[key] !== undefined ? result[key] : result[parseInt(key)];
    }
    return result;
  }

  /**
   * Load language with fallback to inline translations
   */
  async function loadLanguage(lang) {
    if (translations[lang]) {
      return translations[lang];
    }

    // Try loading from JSON file first
    try {
      const data = await fetchJSON(`locales/${lang}.json`);
      translations[lang] = data;
      console.log(`[i18n] Loaded ${lang} from file`);
      return data;
    } catch (error) {
      console.warn(`[i18n] Could not load ${lang}.json from file, using inline fallback`);
    }

    // Fallback to inline translations
    if (INLINE_TRANSLATIONS[lang]) {
      translations[lang] = INLINE_TRANSLATIONS[lang];
      console.log(`[i18n] Using inline translations for ${lang}`);
      return translations[lang];
    }

    console.error(`[i18n] No translations available for ${lang}`);
    return null;
  }

  /**
   * Fetch JSON with XMLHttpRequest (works with file:// protocol)
   */
  function fetchJSON(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.overrideMimeType('application/json; charset=utf-8');
      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 0) {
          try {
            // Strip BOM if present
            const text = xhr.responseText.replace(/^\uFEFF/, '');
            resolve(JSON.parse(text));
          } catch (e) {
            reject(new Error(`JSON parse error for ${url}`));
          }
        } else {
          reject(new Error(`HTTP ${xhr.status} for ${url}`));
        }
      };
      xhr.onerror = () => reject(new Error(`Network error for ${url}`));
      xhr.send();
    });
  }

  /**
   * Get translation by key path
   */
  function getTranslation(key, lang = currentLang) {
    const data = translations[lang];
    if (!data) {
      console.warn(`[i18n] No translations loaded for ${lang}`);
      return key;
    }
    const value = getByPath(data, key);
    if (value === undefined) {
      console.warn(`[i18n] Missing translation: ${key} (${lang})`);
      return key;
    }
    return value;
  }

  /**
   * Apply translations to all DOM elements with data-i18n attribute
   */
  function applyTranslations(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    let applied = 0;
    let missing = 0;

    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = getTranslation(key, lang);

      if (translation && translation !== key) {
        // Handle different element types
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.placeholder = translation;
        } else if (element.tagName === 'IMG') {
          element.alt = translation;
        } else {
          element.innerHTML = translation;
        }
        applied++;
      } else {
        missing++;
        console.warn(`[i18n] Could not translate: ${key}`);
      }
    });

    console.log(`[i18n] Applied ${applied} translations, ${missing} missing`);

    // Update meta tags
    updateMetaTags(lang);

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Update language buttons
    updateLangButtons(lang);

    // Dispatch language change event
    window.dispatchEvent(new CustomEvent('langchange', { 
      detail: { lang, applied, missing } 
    }));
  }

  /**
   * Update meta tags for SEO
   */
  function updateMetaTags(lang) {
    const title = getTranslation('meta.title', lang);
    const desc = getTranslation('meta.description', lang);

    // Update title
    const metaTitle = document.querySelector('title');
    if (metaTitle) metaTitle.textContent = title;

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', desc);
  }

  /**
   * Update language button active states
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
   * Switch to a new language
   */
  async function switchLanguage(lang) {
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      console.warn(`[i18n] Unsupported language: ${lang}`);
      return false;
    }

    if (lang === currentLang) {
      console.log(`[i18n] Already using ${lang}`);
      return true;
    }

    if (isLoading) {
      console.warn(`[i18n] Language switch in progress, please wait`);
      return false;
    }

    isLoading = true;
    const previousLang = currentLang;

    console.log(`[i18n] Switching from ${previousLang} to ${lang}`);

    // Load language translations
    const data = await loadLanguage(lang);
    if (!data) {
      isLoading = false;
      console.error(`[i18n] Failed to load translations for ${lang}`);
      return false;
    }

    // Update current language
    currentLang = lang;

    // Apply translations to DOM
    applyTranslations(lang);

    // Save preference
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      console.warn('[i18n] Could not save language preference:', e);
    }

    isLoading = false;

    // Track language switch in analytics
    if (typeof Analytics !== 'undefined' && Analytics.trackEvent) {
      Analytics.trackEvent('lang_switch', {
        from_lang: previousLang,
        to_lang: lang
      });
    }

    // Announce to screen readers
    const announcer = document.getElementById('sr-announcements');
    if (announcer) {
      const langNames = { zh: '中文', en: 'English', ja: '日本語', ko: '한국어' };
      announcer.textContent = 'Language switched to ' + (langNames[lang] || lang);
    }

    console.log(`[i18n] Successfully switched to ${lang}`);
    return true;
  }

  /**
   * Detect user's preferred language
   */
  function detectLanguage() {
    // 1. Check localStorage
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY);
      if (savedLang && SUPPORTED_LANGUAGES.includes(savedLang)) {
        console.log(`[i18n] Using saved language: ${savedLang}`);
        return savedLang;
      }
    } catch (e) {
      console.warn('[i18n] Could not read language preference:', e);
    }

    // 2. Check URL path prefix
    const pathMatch = window.location.pathname.match(/^\/(en|ja|ko)\//);
    if (pathMatch) {
      console.log(`[i18n] Using URL language: ${pathMatch[1]}`);
      return pathMatch[1];
    }

    // 3. Check browser language
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang) {
      const langCode = browserLang.split('-')[0].toLowerCase();
      if (SUPPORTED_LANGUAGES.includes(langCode)) {
        console.log(`[i18n] Using browser language: ${langCode}`);
        return langCode;
      }
    }

    // 4. Fallback to default
    console.log(`[i18n] Using default language: ${DEFAULT_LANG}`);
    return DEFAULT_LANG;
  }

  /**
   * Initialize i18n system
   */
  async function init() {
    console.log('[i18n] Initializing...');

    // Detect language
    currentLang = detectLanguage();

    // Load and apply current language
    await loadLanguage(currentLang);
    applyTranslations(currentLang);

    // Add event listeners to language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = btn.dataset.lang;
        switchLanguage(lang);
      });
    });

    // Preload other languages after a delay
    setTimeout(() => {
      SUPPORTED_LANGUAGES.forEach(lang => {
        if (lang !== currentLang) {
          loadLanguage(lang);
        }
      });
    }, 2000);

    console.log(`[i18n] Initialized with language: ${currentLang}`);
  }

  /**
   * Get current language
   */
  function getCurrentLang() {
    return currentLang;
  }

  /**
   * Get translation (shorthand)
   */
  function t(key) {
    return getTranslation(key, currentLang);
  }

  /**
   * Check if a language is loaded
   */
  function isLoaded(lang) {
    return !!translations[lang];
  }

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

// Export for use in other modules
window.I18nSystem = I18nSystem;

