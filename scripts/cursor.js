/**
 * Roa Cursor System v4
 * Circular color ring cursor
 */

const CursorSystem = (() => {
  let cursor = null;
  let mouseX = -100;
  let mouseY = -100;
  let cursorX = -100;
  let cursorY = -100;
  let currentState = 'default';
  let isVisible = false;
  let isReducedMotion = false;
  let isMobile = false;
  let animationId = null;

  /**
   * Check system preferences
   */
  function checkSystemPreferences() {
    isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    isMobile = window.matchMedia('(max-width: 768px)').matches || 
               'ontouchstart' in window || 
               navigator.maxTouchPoints > 0;
  }

  /**
   * Create cursor element
   */
  function createCursor() {
    const existing = document.getElementById('custom-cursor');
    if (existing) existing.remove();

    cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
  }

  /**
   * Initialize cursor
   */
  function initElements() {
    if (isMobile || isReducedMotion) {
      return false;
    }
    createCursor();
    return true;
  }

  /**
   * Update cursor position
   */
  function updatePosition() {
    const ease = 0.12;
    cursorX += (mouseX - cursorX) * ease;
    cursorY += (mouseY - cursorY) * ease;

    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;

    if (!isVisible && mouseX > 0) {
      isVisible = true;
      cursor.style.opacity = '1';
    }

    animationId = requestAnimationFrame(updatePosition);
  }

  /**
   * Handle mouse movement
   */
  function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function handleMouseEnterPage() {
    if (cursor) cursor.style.opacity = '1';
  }

  function handleMouseLeavePage() {
    if (cursor) cursor.style.opacity = '0';
  }

  /**
   * Set cursor state
   */
  function setCursorState(state) {
    if (currentState === state) return;
    cursor.classList.remove(`cursor-${currentState}`);
    currentState = state;
    cursor.classList.add(`cursor-${state}`);
  }

  /**
   * Handle mouse over interactive elements
   */
  function handleMouseOver(e) {
    const target = e.target.closest('a, button, .btn, .feature-card, .scenario-card, .btn-primary');
    
    if (!target) {
      setCursorState('default');
      return;
    }

    if (target.classList.contains('btn-primary')) {
      setCursorState('cta');
    } else if (target.classList.contains('feature-card') || target.classList.contains('scenario-card')) {
      setCursorState('card');
    } else if (target.matches('a, button, .btn')) {
      setCursorState('link');
    } else {
      setCursorState('default');
    }
  }

  function handleMouseOut(e) {
    const relatedTarget = e.relatedTarget;
    const currentTarget = e.target.closest('a, button, .btn, .feature-card, .scenario-card');
    if (!currentTarget || !currentTarget.contains(relatedTarget)) {
      setCursorState('default');
    }
  }

  function handleVisibilityChange() {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
      animationId = null;
    } else if (!animationId) {
      animationId = requestAnimationFrame(updatePosition);
    }
  }

  function handleResize() {
    const wasMobile = isMobile;
    checkSystemPreferences();
    if (isMobile && !wasMobile) destroy();
    else if (!isMobile && wasMobile) init();
  }

  function init() {
    if (cursor && document.contains(cursor)) return;

    checkSystemPreferences();
    if (!initElements()) return;

    cursor.style.opacity = '0';

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnterPage);
    document.addEventListener('mouseleave', handleMouseLeavePage);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });
    window.addEventListener('resize', handleResize);

    animationId = requestAnimationFrame(updatePosition);
    console.log('[Cursor] Initialized');
  }

  function destroy() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }

    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseenter', handleMouseEnterPage);
    document.removeEventListener('mouseleave', handleMouseLeavePage);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    document.removeEventListener('mouseover', handleMouseOver);
    document.removeEventListener('mouseout', handleMouseOut);
    window.removeEventListener('resize', handleResize);

    if (cursor && cursor.parentNode) cursor.remove();
    cursor = null;
    isVisible = false;
    currentState = 'default';
  }

  function isSupported() {
    return !isMobile && !isReducedMotion;
  }

  return {
    init,
    destroy,
    isSupported,
    getState: () => ({ currentState, isVisible, isMobile, isReducedMotion })
  };
})();

window.CursorSystem = CursorSystem;
