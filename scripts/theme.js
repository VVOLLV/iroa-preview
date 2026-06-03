/**
 * Roa Theme System v2
 * Manages Light/Dark/Random color themes with CSS Custom Properties
 */

const ThemeSystem = (() => {
  const STORAGE_KEY = 'roa-theme';
  const THEMES = ['light', 'dark', 'random'];
  
  let currentTheme = 'light';

  /**
   * Apply theme to document
   */
  function applyTheme(theme) {
    if (!THEMES.includes(theme)) {
      console.warn(`[Theme] Invalid theme: ${theme}`);
      return;
    }

    const root = document.documentElement;
    
    // Set theme attribute
    root.setAttribute('data-theme', theme);
    currentTheme = theme;

    // For random theme: use CSS [data-theme="random"] variables (white base + Google glow)
    // Clear any inline custom properties so CSS takes over
    const inlineProps = ['--color-bg','--color-bg-card','--color-bg-elevated','--color-text',
      '--color-text-muted','--color-primary','--color-primary-hover','--color-node',
      '--color-line','--color-border','--color-shadow','--color-shadow-lg'];
    inlineProps.forEach(key => root.style.removeProperty(key));
    if (theme === 'random') {
      console.log('[Theme] Applied random theme (white base + Google glow)');
    }

    // Update UI buttons
    updateThemeButtons(theme);

    // Save preference
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      console.warn('[Theme] Could not save preference:', e);
    }

    // Dispatch theme change event
    window.dispatchEvent(new CustomEvent('themechange', { 
      detail: { theme } 
    }));

    console.log(`[Theme] Applied theme: ${theme}`);
  }

  /**
   * Update theme button active states
   */
  function updateThemeButtons(theme) {
    document.querySelectorAll('.theme-btn').forEach(btn => {
      const btnTheme = btn.dataset.theme;
      if (btnTheme === theme) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  }

  /**
   * Detect system theme preference
   */
  function detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  /**
   * Initialize theme system
   */
  function init() {
    console.log('[Theme] Initializing...');

    // Get saved theme or detect system preference
    let savedTheme = null;
    try {
      savedTheme = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      console.warn('[Theme] Could not read preference:', e);
    }

    if (savedTheme && THEMES.includes(savedTheme)) {
      currentTheme = savedTheme;
      console.log(`[Theme] Using saved theme: ${savedTheme}`);
    } else {
      currentTheme = detectSystemTheme();
      console.log(`[Theme] Using system theme: ${currentTheme}`);
    }

    // Apply theme
    applyTheme(currentTheme);

    // Add event listeners to theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const theme = btn.dataset.theme;
        applyTheme(theme);
      });
    });

    // Listen for system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually selected
        const savedTheme = localStorage.getItem(STORAGE_KEY);
        if (!savedTheme) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }

    console.log(`[Theme] Initialized with theme: ${currentTheme}`);
  }

  /**
   * Get current theme
   */
  function getCurrentTheme() {
    return currentTheme;
  }

  /**
   * Get available themes
   */
  function getAvailableThemes() {
    return [...THEMES];
  }

  return {
    init,
    applyTheme,
    getCurrentTheme,
    getAvailableThemes
  };
})();

// Export for use in other modules
window.ThemeSystem = ThemeSystem;

// Self-init for standalone pages (sub-pages without main.js)
(function() {
  function tryInit() {
    if (!document.documentElement.hasAttribute('data-theme-applied')) {
      ThemeSystem.init();
      document.documentElement.setAttribute('data-theme-applied', 'true');
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryInit);
  } else {
    tryInit();
  }
})();
