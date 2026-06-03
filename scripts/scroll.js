/**
 * Roa Scroll Interaction System v5
 * Native IntersectionObserver + CSS class animations (no GSAP dependency)
 */

const ScrollSystem = (() => {
  let isReducedMotion = false;
  let heroCanvas = null;
  let heroNodes = [];
  let heroLines = [];
  let observers = [];
  let rafId = null;

  function checkReducedMotion() {
    isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function createFloatingParticles(svg) {
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const r = Math.random() * 2 + 1;
      particle.setAttribute('cx', x + '%');
      particle.setAttribute('cy', y + '%');
      particle.setAttribute('r', r.toString());
      particle.setAttribute('fill', 'var(--color-node)');
      particle.setAttribute('opacity', (Math.random() * 0.15 + 0.05).toFixed(2));
      particle.classList.add('hero-particle');
      particle.dataset.baseX = x;
      particle.dataset.baseY = y;
      particle.dataset.speed = (Math.random() * 0.5 + 0.2).toFixed(2);
      svg.appendChild(particle);
    }
  }

  function createHeroNodes() {
    heroCanvas = document.getElementById('hero-canvas');
    if (!heroCanvas) return;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';

    createFloatingParticles(svg);

    const nodePositions = [
      { x: 15, y: 30 }, { x: 35, y: 20 }, { x: 55, y: 35 },
      { x: 75, y: 25 }, { x: 25, y: 60 }, { x: 45, y: 70 },
      { x: 65, y: 55 }, { x: 85, y: 65 }, { x: 20, y: 80 },
      { x: 50, y: 85 }
    ];

    nodePositions.forEach(function(pos) {
      const node = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      node.setAttribute('cx', pos.x + '%');
      node.setAttribute('cy', pos.y + '%');
      node.setAttribute('r', '6');
      node.setAttribute('fill', 'var(--color-node)');
      node.setAttribute('opacity', '0');
      node.style.transition = 'opacity 0.4s ease-out';
      svg.appendChild(node);
      heroNodes.push(node);
    });

    const connections = [
      [0, 1], [1, 2], [2, 3], [4, 5], [5, 6], [6, 7],
      [0, 4], [1, 5], [2, 6], [3, 7], [4, 8], [5, 9], [8, 9]
    ];

    connections.forEach(function(pair) {
      const from = pair[0], to = pair[1];
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', nodePositions[from].x + '%');
      line.setAttribute('y1', nodePositions[from].y + '%');
      line.setAttribute('x2', nodePositions[to].x + '%');
      line.setAttribute('y2', nodePositions[to].y + '%');
      line.setAttribute('stroke', 'var(--color-line)');
      line.setAttribute('stroke-width', '1');
      line.setAttribute('opacity', '0');
      line.style.transition = 'opacity 0.4s ease-out';

      const dx = nodePositions[to].x - nodePositions[from].x;
      const dy = nodePositions[to].y - nodePositions[from].y;
      const length = Math.sqrt(dx * dx + dy * dy);
      line.setAttribute('stroke-dasharray', length);
      line.setAttribute('stroke-dashoffset', length);
      line.style.transition = 'stroke-dashoffset 0.6s ease-out, opacity 0.4s ease-out';

      svg.appendChild(line);
      heroLines.push(line);
    });

    heroCanvas.appendChild(svg);
  }

  /* ---- Hero entrance animations (CSS class driven) ---- */
  function initHeroAnimations() {
    var title = document.querySelector('.hero-title');
    var subtitle = document.querySelector('.hero-subtitle');
    var cta = document.querySelector('.hero-cta');
    var indicator = document.querySelector('.scroll-indicator');
    var items = [title, subtitle, cta, indicator];

    if (isReducedMotion) {
      items.forEach(function(el) { if (el) el.classList.remove('is-hidden'); });
      heroNodes.forEach(function(n) { n.setAttribute('opacity', '1'); });
      heroLines.forEach(function(l) { l.setAttribute('opacity', '1'); l.setAttribute('stroke-dashoffset', '0'); });
      return;
    }

    // Staggered reveal via CSS class removal
    items.forEach(function(el, i) {
      if (!el) return;
      el.style.transitionDelay = (i * 0.3) + 's';
      // Trigger reflow then remove hidden class
      el.offsetHeight; // force reflow
      requestAnimationFrame(function() {
        el.classList.remove('is-hidden');
      });
    });

    // Scroll-based node/line reveal
    initHeroScrollReveal();
  }

  function initHeroScrollReveal() {
    var hero = document.getElementById('hero');
    if (!hero) return;

    var lastProgress = -1;
    function onScroll() {
      var rect = hero.getBoundingClientRect();
      var progress = Math.max(0, Math.min(1, -rect.top / rect.height));
      if (Math.abs(progress - lastProgress) < 0.01) return;
      lastProgress = progress;

      var visibleNodes = Math.floor(progress * 10);
      heroNodes.forEach(function(node, i) {
        node.setAttribute('opacity', i < visibleNodes ? '1' : '0');
      });

      var visibleLines = Math.floor(progress * 13);
      heroLines.forEach(function(line, i) {
        if (i < visibleLines) {
          line.setAttribute('opacity', '1');
          line.setAttribute('stroke-dashoffset', '0');
        } else {
          line.setAttribute('opacity', '0');
        }
      });

      // Parallax on hero content
      var heroContent = hero.querySelector('.hero-content');
      if (heroContent) {
        heroContent.style.transform = 'translateY(' + (progress * 100) + 'px)';
        heroContent.style.opacity = 1 - progress * 0.7;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Floating node breathing animation (rAF) ---- */
  function initFloatingNodes() {
    if (isReducedMotion || heroNodes.length === 0) return;
    var t = 0;
    function tick() {
      t += 0.01;
      heroNodes.forEach(function(node, i) {
        var dy = Math.sin(t + i * 0.7) * 8;
        var dx = Math.cos(t * 0.8 + i * 0.5) * 5;
        node.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
      });
      rafId = requestAnimationFrame(tick);
    }
    tick();
  }

  /* ---- Scroll reveal via IntersectionObserver ---- */
  function initScrollReveal(selector, staggerMs) {
    var els = document.querySelectorAll(selector);
    if (els.length === 0) return;

    if (isReducedMotion) {
      els.forEach(function(el) { el.classList.remove('is-hidden'); });
      return;
    }

    // Set stagger delays
    els.forEach(function(el, i) {
      el.style.transitionDelay = (i * (staggerMs || 0)) + 'ms';
    });

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.remove('is-hidden');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

    els.forEach(function(el) { observer.observe(el); });
    observers.push(observer);
  }

  function initFeatureAnimations() {
    initScrollReveal('.feature-card.scroll-reveal', 100);
  }

  function initScenarioAnimations() {
    initScrollReveal('.scenario-card.scroll-reveal', 100);
  }


  /* ---- Gravity Tilt Effect on Scroll ---- */
    /* ---- Gravity Tilt Effect on Scroll ---- */
  function initTiltEffect() {
    var cards = document.querySelectorAll('.feature-card, .scenario-card');
    if (cards.length === 0 || isReducedMotion) return;

    var lastScrollY = window.scrollY;
    var maxTilt = 6;

    // Click to reset tilt
    cards.forEach(function(card) {
      card.addEventListener('click', function() {
        card.classList.remove('tilting');
        card.style.transform = '';
        card.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        setTimeout(function() {
          card.style.transition = '';
        }, 400);
      });
    });

    window.addEventListener('scroll', function() {
      var currentY = window.scrollY;
      var velocity = currentY - lastScrollY;
      lastScrollY = currentY;
      if (Math.abs(velocity) < 2) return;

      var clamped = Math.max(-80, Math.min(80, velocity));
      var ratio = clamped / 80;
      var tiltZ = ratio * maxTilt;

      cards.forEach(function(card) {
        var rect = card.getBoundingClientRect();
        var inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (!inView) return;
        if (card.classList.contains('is-hidden')) return;

        card.classList.add('tilting');
        card.style.transform = 'rotate(' + tiltZ + 'deg)';
      });
    }, { passive: true });
  }

  /* ---- Floating CTA visibility ---- */
  function initFloatingCTA() {
    var floatingBtn = document.getElementById('floating-cta');
    var scenariosSection = document.getElementById('scenarios');
    if (!floatingBtn || !scenariosSection) return;

    window.addEventListener('scroll', function() {
      var rect = scenariosSection.getBoundingClientRect();
      floatingBtn.classList.toggle('visible', rect.bottom < window.innerHeight * 0.5);
    }, { passive: true });
  }

  /* ---- Navbar scroll effect ---- */
  function initNavbarScroll() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;
    window.addEventListener('scroll', function() {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  /* ---- Public API ---- */
  function init() {
    // Remove no-js class (CSS safety net)
    document.documentElement.classList.remove('no-js');

    checkReducedMotion();
    createHeroNodes();

    // Failsafe: if anything goes wrong, show everything after 3s
    var failsafe = setTimeout(function() {
      console.warn('[Scroll] Failsafe triggered - showing all content');
      document.querySelectorAll('.is-hidden').forEach(function(el) {
        el.classList.remove('is-hidden');
      });
    }, 3000);

    try {
      initHeroAnimations();
      initFloatingNodes();
      initFeatureAnimations();
      initScenarioAnimations();
      initFloatingCTA();
      initNavbarScroll();
      initTiltEffect();
      console.log('[Scroll] Initialized (native, no GSAP)');
    } catch (e) {
      console.error('[Scroll] Init error:', e);
      clearTimeout(failsafe);
      // Immediately show everything on error
      document.querySelectorAll('.is-hidden').forEach(function(el) {
        el.classList.remove('is-hidden');
      });
    }
  }

  function destroy() {
    observers.forEach(function(obs) { obs.disconnect(); });
    observers = [];
    if (rafId) cancelAnimationFrame(rafId);
  }

  return { init: init, destroy: destroy };
})();

window.ScrollSystem = ScrollSystem;
