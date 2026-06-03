/**
 * Roa Main Application v3
 * Orchestrates all systems with robust error handling and debugging
 */

const RoaApp = (() => {
  let isInitialized = false;
  const DEBUG = true;

  /**
   * Debug logging
   */
  function log(...args) {
    if (DEBUG) {
      console.log('[Roa]', ...args);
    }
  }

  function warn(...args) {
    if (DEBUG) {
      console.warn('[Roa]', ...args);
    }
  }

  function error(...args) {
    console.error('[Roa]', ...args);
  }

  /**
   * Safely initialize a system
   */
  async function safeInit(name, initFn) {
    try {
      log(`Initializing ${name}...`);
      await initFn();
      log(`${name} initialized successfully`);
      return true;
    } catch (e) {
      error(`Failed to initialize ${name}:`, e);
      return false;
    }
  }

  /**
   * Check if a system is available
   */
  function isSystemAvailable(name) {
    const available = typeof window[name] !== 'undefined';
    if (!available) {
      warn(`${name} not available`);
    }
    return available;
  }

  /**
   * Initialize all systems
   */
  async function init() {
    if (isInitialized) {
      warn('Already initialized');
      return;
    }

    log('Starting application initialization...');

    const results = {};

    // 1. Initialize theme system first (affects CSS)
    if (isSystemAvailable('ThemeSystem')) {
      results.theme = await safeInit('ThemeSystem', () => ThemeSystem.init());
      document.documentElement.setAttribute('data-theme-applied', 'true');
    }

    // 2. Initialize i18n system
    if (isSystemAvailable('I18nSystem')) {
      results.i18n = await safeInit('I18nSystem', () => I18nSystem.init());
    }

    // 3. Initialize cursor system (desktop only)
    if (isSystemAvailable('CursorSystem')) {
      results.cursor = await safeInit('CursorSystem', () => {
        if (CursorSystem.isSupported && CursorSystem.isSupported()) {
          CursorSystem.init();
        } else {
          log('Cursor system not supported on this device');
        }
      });
    }

    // 4. Initialize scroll interactions
    if (isSystemAvailable('ScrollSystem')) {
      results.scroll = await safeInit('ScrollSystem', () => ScrollSystem.init());
    }

    // 5. Initialize analytics (no consent dialog, enabled by default)
    if (isSystemAvailable('Analytics')) {
      results.analytics = await safeInit('Analytics', () => Analytics.init());
    }

    // Add mobile menu
    initMobileMenu();

    // Add friend links toggle
    initFriendLinksToggle();

    // Add smooth scroll for anchor links
    initSmoothScroll();

    // Add keyboard navigation
    initKeyboardNav();

    // Add debug tools
    if (DEBUG) {
      initDebugTools();
    }

    // Mark as initialized
    isInitialized = true;
    log('Application initialized successfully', results);

    // Dispatch ready event
    window.dispatchEvent(new CustomEvent('roaready', { detail: results }));
  }

  /**
   * Initialize smooth scrolling for anchor links
   */
  function initMobileMenu() {
    const hamburger = document.querySelector('.nav-hamburger');
    const navControls = document.querySelector('.nav-controls');
    if (!hamburger || !navControls) return;

    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);

    function toggleMenu(open) {
      const isOpen = open !== undefined ? open : !navControls.classList.contains('open');
      navControls.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen.toString());
      backdrop.classList.toggle('visible', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    hamburger.addEventListener('click', () => toggleMenu());
    backdrop.addEventListener('click', () => toggleMenu(false));

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') toggleMenu(false);
    });

    // Close when a control is clicked
    navControls.querySelectorAll('.lang-btn, .theme-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        setTimeout(() => toggleMenu(false), 150);
      });
    });
  }

  function initFriendLinksToggle() {
    const grid = document.querySelector('.footer-friends-grid');
    const toggle = document.querySelector('.friends-toggle');
    if (!grid || !toggle) return;

    // CSS handles collapsed state by default
    toggle.setAttribute('aria-expanded', 'false');

    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      const textEl = toggle.querySelector('.friends-toggle-text');
      if (isExpanded) {
        grid.classList.remove('expanded');
        toggle.setAttribute('aria-expanded', 'false');
        if (textEl) {
          const t = (typeof I18nSystem !== 'undefined') ? I18nSystem.t('footer.friendsExpand') : '';
          textEl.textContent = (t && t !== 'footer.friendsExpand') ? t : '\u5c55\u5f00\u66f4\u591a';
        }
      } else {
        grid.classList.add('expanded');
        toggle.setAttribute('aria-expanded', 'true');
        if (textEl) textEl.textContent = '\u6536\u8d77';
      }
    });
  }
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
          const offset = 80;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /**
   * Initialize keyboard navigation
   */
  function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-nav');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.menu-open').forEach(el => {
          el.classList.remove('menu-open');
        });
      }
    });
  }

  /**
   * Initialize debug tools (development only)
   */
  function initDebugTools() {
    window.roaDebug = {
      // Test language switching
      testLang: async (lang) => {
        log(`Testing language switch to: ${lang}`);
        if (I18nSystem) {
          const result = await I18nSystem.switchLanguage(lang);
          log(`Language switch result: ${result}`);
          return result;
        }
      },

      // Test theme switching
      testTheme: (theme) => {
        log(`Testing theme switch to: ${theme}`);
        if (ThemeSystem) {
          ThemeSystem.applyTheme(theme);
        }
      },

      // Get current state
      getState: () => ({
        lang: I18nSystem?.getCurrentLang(),
        theme: ThemeSystem?.getCurrentTheme(),
        cursor: CursorSystem?.getState ? CursorSystem.getState() : 'unavailable',
        initialized: isInitialized
      }),

      // List all i18n elements
      listI18n: () => {
        const elements = document.querySelectorAll('[data-i18n]');
        const list = [];
        elements.forEach(el => {
          list.push({
            key: el.getAttribute('data-i18n'),
            text: el.textContent.trim().substring(0, 50),
            tag: el.tagName
          });
        });
        console.table(list);
        return list;
      },

      // Check translations
      checkTranslations: (lang) => {
        const currentLang = lang || I18nSystem?.getCurrentLang() || 'zh';
        log(`Checking translations for: ${currentLang}`);
        const elements = document.querySelectorAll('[data-i18n]');
        let ok = 0, missing = 0;
        elements.forEach(el => {
          const key = el.getAttribute('data-i18n');
          const translation = I18nSystem?.getTranslation(key, currentLang);
          if (translation && translation !== key) {
            ok++;
          } else {
            missing++;
            warn(`Missing: ${key}`);
          }
        });
        log(`Translations: ${ok} ok, ${missing} missing`);
        return { ok, missing };
      },

      // Test cursor
      testCursor: () => {
        if (!CursorSystem) {
          log('CursorSystem not available');
          return;
        }
        const state = CursorSystem.getState();
        log('Cursor state:', state);
        return state;
      },

      // Destroy and reinitialize cursor
      resetCursor: () => {
        if (CursorSystem) {
          CursorSystem.destroy();
          setTimeout(() => {
            CursorSystem.init();
            log('Cursor system reset');
          }, 100);
        }
      },

      // Toggle analytics
      toggleAnalytics: (value) => {
        if (Analytics && Analytics.setEnabled) {
          Analytics.setEnabled(value !== undefined ? value : true);
          log('Analytics enabled:', value !== undefined ? value : true);
        }
      }
    };

    log('Debug tools available: window.roaDebug');
    log('  - roaDebug.testLang("en")     - Test language switch');
    log('  - roaDebug.testTheme("dark")  - Test theme switch');
    log('  - roaDebug.getState()         - Get current state');
    log('  - roaDebug.listI18n()         - List all i18n elements');
    log('  - roaDebug.checkTranslations()- Check translations');
    log('  - roaDebug.testCursor()       - Check cursor state');
    log('  - roaDebug.resetCursor()      - Reset cursor system');
  }

  /**
   * Cleanup application
   */
  function destroy() {
    if (typeof CursorSystem !== 'undefined') {
      CursorSystem.destroy();
    }
    if (typeof ScrollSystem !== 'undefined') {
      ScrollSystem.destroy();
    }
    isInitialized = false;
    log('Application destroyed');
  }

  return {
    init,
    destroy,
    isInitialized: () => isInitialized
  };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  RoaApp.init();
});

// Export for use in other modules
window.RoaApp = RoaApp;
