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
        title: "Roa - 让思考，有地方落脚",
        description: "Roa 是一块会思考的画布。你在这里不只是记录，而是探索。"
      },
      nav: { logo: "Roa" },
      hero: {
        title: "让思考，有地方落脚",
        subtitle: "Roa 是一块会思考的画布。你在这里不只是记录，而是探索。",
        cta: "开始我的第一块画布",
        "cta-secondary": "先看看它能做什么"
      },
      features: {
        title: "它能做什么",
        subtitle: "三个让你惊喜的能力"
      },
      feature: {
        1: { title: "思考，终于有了形状", desc: "节点和连线让抽象的想法变得可见、可触、可重组。" },
        2: { title: "AI 不打断你，它等你", desc: "AI 在你需要时出现，在你思考时沉默。它尊重你的节奏。" },
        3: { title: "大局与细节，同时看见", desc: "缩放自如，既能看到森林，也能看清每一片叶子。" }
      },
      philosophy: {
        label: "THINKING SPACE",
        line1: "思考，是一种",
        line2: "需要空间的",
        line3: "活动。",
        sub1: "我们为它",
        sub2: "建了一个家"
      },
      scenarios: {
        title: "谁在用它",
        subtitle: "四种人，同一个需求"
      },
      scenario: {
        1: { title: "知识工作者", desc: "组织复杂信息，并行探索方案。在混乱中找到秩序。" },
        2: { title: "研究者", desc: "整理文献，对比实验。节点和连线承载你的上下文。" },
        3: { title: "产品/设计师", desc: "拆解需求，可视化流程。拖拽和连线让你感到自由。" },
        4: { title: "学生/终身学习者", desc: "学习规划，知识积累。游客模式让你无压力体验。" }
      },
      cta: {
        title: "你的第一块画布，现在就可以开始",
        note: "无需注册，游客模式直接体验。你的想法不会丢失。",
        button: "开始我的第一块画布"
      },
      footer: {
        tagline: "为思考者而建",
        privacy: "隐私政策",
        terms: "使用条款",
        contact: "联系我们"
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
        3: { title: "Big picture and detail, together", desc: "Zoom freely—see the forest and every single leaf at once." }
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
        title: "Roa - 思考に、居場所を",
        description: "Roa は考えるキャンバス。記録だけでなく、探求の場。"
      },
      nav: { logo: "Roa" },
      hero: {
        title: "思考に、居場所を",
        subtitle: "Roa は考えるキャンバス。記録だけでなく、探求の場。",
        cta: "はじめてのキャンバスを",
        "cta-secondary": "できることを見る"
      },
      features: {
        title: "できること",
        subtitle: "あなたを驚かせる3つの力"
      },
      feature: {
        1: { title: "思考が、かたちになる", desc: "ノードと接続で、抽象的なアイデアが見えたり、触ったり、再構成できるように。" },
        2: { title: "AI は待つ。遮らない。", desc: "AI は必要な時に現れ、考えている時は沈黙します。あなたのリズムを尊重します。" },
        3: { title: "全体と詳細を、同時に", desc: "自由にズーム—森とすべての葉を同時に見ることができます。" }
      },
      philosophy: {
        label: "THINKING SPACE",
        line1: "思考とは、",
        line2: "空間を必要とする",
        line3: "活動です。",
        sub1: "それに、",
        sub2: "居場所を建てた"
      },
      scenarios: {
        title: "誰が使っているか",
        subtitle: "4タイプの人々、共通のニーズ"
      },
      scenario: {
        1: { title: "ナレッジワーカー", desc: "複雑な情報を整理し、並行してソリューションを探索。混沌の中に秩序を見つける。" },
        2: { title: "研究者", desc: "文献を整理し、実験を比較。ノードと接続があなたのコンテキストを保持します。" },
        3: { title: "プロダクト/デザイナー", desc: "要件を分解し、ワークフローを可視化。ドラッグと接続で自由を感じる。" },
        4: { title: "学生/生涯学習者", desc: "学習計画、知識の蓄積。ゲストモードでストレスなく体験できます。" }
      },
      cta: {
        title: "はじめてのキャンバスは、今",
        note: "登録不要。ゲストで体験できます。データは失われません。",
        button: "はじめてのキャンバスを"
      },
      footer: {
        tagline: "思考者のために",
        privacy: "プライバシーポリシー",
        terms: "利用規約",
        contact: "お問い合わせ"
      }
    },
    ko: {
      meta: {
        title: "Roa - 생각에, 자리를",
        description: "Roa는 생각하는 캔버스. 기록이 아닌, 탐색의 공간."
      },
      nav: { logo: "Roa" },
      hero: {
        title: "생각에, 자리를",
        subtitle: "Roa는 생각하는 캔버스. 기록이 아닌, 탐색의 공간.",
        cta: "첫 번째 캔버스 시작",
        "cta-secondary": "무엇을 할 수 있는지 보기"
      },
      features: {
        title: "무엇을 할 수 있나요",
        subtitle: "당신을 놀라게 할 세 가지 능력"
      },
      feature: {
        1: { title: "생각이, 형태를 갖추다", desc: "노드와 연결로 추상적인 아이디어를 보고, 만지고, 재구성할 수 있습니다." },
        2: { title: "AI는 기다립니다. 끊지 않아요.", desc: "AI는 필요할 때 나타나고, 생각할 때 침묵합니다. 당신의 리듬을 존중합니다." },
        3: { title: "전체와 세부를, 동시에", desc: "자유롭게 확대—숲과 모든 나뭇잎을 동시에 볼 수 있습니다." }
      },
      philosophy: {
        label: "THINKING SPACE",
        line1: "생각이란,",
        line2: "공간이 필요한",
        line3: "활동입니다.",
        sub1: "우리는 그곳을",
        sub2: "지었습니다"
      },
      scenarios: {
        title: "누가 사용하나요",
        subtitle: "네 가지 유형의 사람들, 하나의 공통된 필요"
      },
      scenario: {
        1: { title: "지식 근로자", desc: "복잡한 정보를 정리하고, 병렬로 솔루션을 탐색합니다. 혼돈 속에서 질서를 찾으세요." },
        2: { title: "연구자", desc: "문헌을 정리하고, 실험을 비교합니다. 노드와 연결이 당신의 맥락을 담습니다." },
        3: { title: "프로덕트/디자이너", desc: "요구사항을 분해하고, 워크플로를 시각화합니다. 드래그와 연결로 자유를 느끼세요." },
        4: { title: "학생/평생 학습자", desc: "학습 계획, 지식 축적. 게스트 모드로 부담 없이 체험하세요." }
      },
      cta: {
        title: "첫 번째 캔버스, 지금 시작하세요",
        note: "가입 없이 게스트로 체험. 데이터는 안전합니다.",
        button: "첫 번째 캔버스 시작"
      },
      footer: {
        tagline: "사색가를 위해",
        privacy: "개인정보 처리방침",
        terms: "이용약관",
        contact: "문의하기"
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
            resolve(JSON.parse(xhr.responseText));
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

