/**
 * Roa Analytics System v2
 * Anonymous event tracking - enabled by default (no consent dialog)
 */

const Analytics = (() => {
  const ENDPOINT = '/api/track';
  
  // Analytics enabled by default (anonymous data only)
  let enabled = true;
  let sessionId = '';
  let sessionStartTime = 0;
  let scrollDepthReached = {};

  /**
   * Generate unique session ID
   */
  function generateSessionId() {
    return 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  /**
   * Get device type
   */
  function getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  /**
   * Get basic event properties
   */
  function getBaseProperties() {
    return {
      session_id: sessionId,
      timestamp: new Date().toISOString(),
      device_type: getDeviceType(),
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      language: (typeof I18nSystem !== 'undefined') ? I18nSystem.getCurrentLang() : 'zh',
      theme: (typeof ThemeSystem !== 'undefined') ? ThemeSystem.getCurrentTheme() : 'light'
    };
  }

  /**
   * Track event
   */
  function trackEvent(eventName, properties = {}) {
    if (!enabled) return;

    const event = {
      event: eventName,
      ...getBaseProperties(),
      ...properties
    };

    // Log to console in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('[Analytics]', eventName, event);
    }

    // Send to backend
    sendEvent(event);
  }

  /**
   * Send event to backend
   */
  async function sendEvent(event) {
    try {
      // Use sendBeacon for reliability
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(event)], { type: 'application/json' });
        navigator.sendBeacon(ENDPOINT, blob);
      } else {
        // Fallback to fetch
        await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event),
          keepalive: true
        });
      }
    } catch (error) {
      // Silent fail - analytics should not break the app
    }
  }

  /**
   * Track page view
   */
  function trackPageView() {
    trackEvent('page_view', {
      page_name: 'home',
      referrer: document.referrer || 'direct',
      url: window.location.href
    });
  }

  /**
   * Track scroll depth
   */
  function trackScrollDepth() {
    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );

    const thresholds = [25, 50, 75, 100];
    
    thresholds.forEach(threshold => {
      if (scrollPercent >= threshold && !scrollDepthReached[threshold]) {
        scrollDepthReached[threshold] = true;
        trackEvent('scroll_depth', {
          depth: threshold,
          time_on_page: Math.round((Date.now() - sessionStartTime) / 1000)
        });
      }
    });
  }

  /**
   * Track CTA click
   */
  function trackCTAClick(buttonText, position) {
    trackEvent('hero_cta_click', {
      button_text: buttonText,
      position: position
    });
  }

  /**
   * Track feature card view
   */
  function trackFeatureCardView(cardId, duration) {
    trackEvent('feature_card_view', {
      card_id: cardId,
      view_duration: duration
    });
  }

  /**
   * Track scenario card click
   */
  function trackScenarioCardClick(cardId, cardTitle) {
    trackEvent('scenario_card_click', {
      card_id: cardId,
      card_title: cardTitle
    });
  }

  /**
   * Track footer link click
   */
  function trackFooterLinkClick(linkText, linkUrl) {
    trackEvent('footer_link_click', {
      link_text: linkText,
      link_url: linkUrl
    });
  }

  /**
   * Track language switch
   */
  function trackLangSwitch(fromLang, toLang) {
    trackEvent('lang_switch', {
      from_lang: fromLang,
      to_lang: toLang
    });
  }

  /**
   * Track theme switch
   */
  function trackThemeSwitch(fromTheme, toTheme) {
    trackEvent('theme_switch', {
      from_theme: fromTheme,
      to_theme: toTheme
    });
  }

  /**
   * Enable/disable analytics
   */
  function setEnabled(value) {
    enabled = value;
  }

  /**
   * Initialize analytics system
   */
  function init() {
    // Generate session ID
    sessionId = generateSessionId();
    sessionStartTime = Date.now();

    // Track page view
    trackPageView();

    // Track scroll depth
    window.addEventListener('scroll', trackScrollDepth, { passive: true });

    // Track CTA clicks
    document.querySelectorAll('.btn-primary').forEach(btn => {
      btn.addEventListener('click', () => {
        trackCTAClick(btn.textContent.trim(), btn.closest('section')?.id || 'unknown');
      });
    });

    // Track scenario card clicks
    document.querySelectorAll('.scenario-card').forEach(card => {
      card.addEventListener('click', () => {
        const cardId = card.getAttribute('data-scenario');
        const cardTitle = card.querySelector('.scenario-title')?.textContent || '';
        trackScenarioCardClick(cardId, cardTitle);
      });
    });

    // Track footer link clicks
    document.querySelectorAll('.footer-links a').forEach(link => {
      link.addEventListener('click', (e) => {
        trackFooterLinkClick(link.textContent.trim(), link.href);
      });
    });

    // Track feature card visibility
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const card = entry.target;
            const cardId = card.getAttribute('data-feature');
            const startTime = Date.now();
            
            const checkDuration = () => {
              if (!card.matches(':hover')) {
                const duration = Math.round((Date.now() - startTime) / 1000);
                trackFeatureCardView(cardId, duration);
                observer.unobserve(card);
              } else {
                setTimeout(checkDuration, 100);
              }
            };
            
            setTimeout(checkDuration, 1000);
          }
        });
      }, { threshold: 0.5 });

      document.querySelectorAll('.feature-card').forEach(card => {
        observer.observe(card);
      });
    }

    console.log('[Analytics] Initialized (anonymous tracking enabled)');
  }

  return {
    init,
    setEnabled,
    trackEvent,
    trackPageView,
    trackCTAClick,
    trackLangSwitch,
    trackThemeSwitch,
    trackFeatureCardView,
    trackScenarioCardClick,
    trackFooterLinkClick
  };
})();

// Export for use in other modules
window.Analytics = Analytics;
