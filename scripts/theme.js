/**
 * Roa Theme System v2
 * Manages Light/Dark/Random color themes with CSS Custom Properties
 */

const ThemeSystem = (() => {
  const STORAGE_KEY = 'roa-theme';
  const THEMES = ['light', 'dark', 'random'];
  
  let currentTheme = 'light';

  /**
   * Generate random HSL color with constraints
   * - Hue: random 0-360
   * - Saturation: <= 40%
   * - Lightness: >= 70% (for backgrounds)
   * - Seed: current date (consistent within same day)
   */
  function generateRandomTheme() {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    
    // Simple seeded random function
    const seededRandom = (s) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };

    const hue = Math.floor(seededRandom(seed) * 360);
    const saturation = Math.floor(seededRandom(seed + 1) * 30) + 10; // 10-40%
    const lightness = Math.floor(seededRandom(seed + 2) * 15) + 75; // 75-90%

    // Derive other colors based on base HSL
    const bgLightness = lightness;
    const cardLightness = Math.min(95, lightness + 10);
    const elevatedLightness = Math.max(70, lightness - 5);
    const textLightness = Math.floor(seededRandom(seed + 3) * 10) + 15; // 15-25%
    const mutedLightness = Math.floor(seededRandom(seed + 4) * 10) + 40; // 40-50%
    const primarySaturation = Math.min(40, saturation + 15);
    const primaryLightness = Math.floor(seededRandom(seed + 5) * 10) + 50; // 50-60%
    const nodeLightness = Math.floor(seededRandom(seed + 6) * 10) + 55; // 55-65%
    const lineLightness = Math.floor(seededRandom(seed + 7) * 10) + 70; // 70-80%
    const borderLightness = Math.floor(seededRandom(seed + 8) * 5) + 80; // 80-85%

    return {
      '--color-bg': `hsl(${hue}, ${saturation}%, ${bgLightness}%)`,
      '--color-bg-card': `hsl(${hue}, ${Math.min(25, saturation)}%, ${cardLightness}%)`,
      '--color-bg-elevated': `hsl(${hue}, ${saturation}%, ${elevatedLightness}%)`,
      '--color-text': `hsl(${hue}, ${Math.min(40, saturation + 10)}%, ${textLightness}%)`,
      '--color-text-muted': `hsl(${hue}, ${Math.min(30, saturation)}%, ${mutedLightness}%)`,
      '--color-primary': `hsl(${(hue + 10) % 360}, ${primarySaturation}%, ${primaryLightness}%)`,
      '--color-primary-hover': `hsl(${(hue + 10) % 360}, ${primarySaturation}%, ${Math.max(40, primaryLightness - 10)}%)`,
      '--color-node': `hsl(${hue}, ${Math.min(35, saturation + 5)}%, ${nodeLightness}%)`,
      '--color-line': `hsl(${hue}, ${Math.min(20, saturation)}%, ${lineLightness}%)`,
      '--color-border': `hsl(${hue}, ${Math.min(20, saturation)}%, ${borderLightness}%)`,
      '--color-shadow': `hsla(${hue}, ${saturation}%, ${textLightness}%, 0.08)`,
      '--color-shadow-lg': `hsla(${hue}, ${saturation}%, ${textLightness}%, 0.12)`
    };
  }

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

    // Apply random theme colors if needed
    if (theme === 'random') {
      const colors = generateRandomTheme();
      Object.entries(colors).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
      console.log('[Theme] Applied random theme colors');
    } else {
      // Clear custom properties for non-random themes
      const colors = generateRandomTheme();
      Object.keys(colors).forEach(key => {
        root.style.removeProperty(key);
      });
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
