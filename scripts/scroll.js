/**
 * Roa Scroll Interaction System v4
 * Clean, polished animations
 */

const ScrollSystem = (() => {
  let isReducedMotion = false;
  let heroCanvas = null;
  let heroNodes = [];
  let heroLines = [];

  function checkReducedMotion() {
    isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

    const nodePositions = [
      { x: 15, y: 30 }, { x: 35, y: 20 }, { x: 55, y: 35 },
      { x: 75, y: 25 }, { x: 25, y: 60 }, { x: 45, y: 70 },
      { x: 65, y: 55 }, { x: 85, y: 65 }, { x: 20, y: 80 },
      { x: 50, y: 85 }
    ];

    nodePositions.forEach((pos) => {
      const node = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      node.setAttribute('cx', `${pos.x}%`);
      node.setAttribute('cy', `${pos.y}%`);
      node.setAttribute('r', '6');
      node.setAttribute('fill', 'var(--color-node)');
      node.setAttribute('opacity', '0');
      svg.appendChild(node);
      heroNodes.push(node);
    });

    const connections = [
      [0, 1], [1, 2], [2, 3], [4, 5], [5, 6], [6, 7],
      [0, 4], [1, 5], [2, 6], [3, 7], [4, 8], [5, 9], [8, 9]
    ];

    connections.forEach(([from, to]) => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', `${nodePositions[from].x}%`);
      line.setAttribute('y1', `${nodePositions[from].y}%`);
      line.setAttribute('x2', `${nodePositions[to].x}%`);
      line.setAttribute('y2', `${nodePositions[to].y}%`);
      line.setAttribute('stroke', 'var(--color-line)');
      line.setAttribute('stroke-width', '1');
      line.setAttribute('opacity', '0');
      
      const length = Math.sqrt(
        Math.pow(nodePositions[to].x - nodePositions[from].x, 2) +
        Math.pow(nodePositions[to].y - nodePositions[from].y, 2)
      );
      line.setAttribute('stroke-dasharray', length);
      line.setAttribute('stroke-dashoffset', length);
      
      svg.appendChild(line);
      heroLines.push(line);
    });

    heroCanvas.appendChild(svg);
  }

  function initHeroAnimations() {
    if (isReducedMotion) {
      heroNodes.forEach(node => node.setAttribute('opacity', '1'));
      heroLines.forEach(line => {
        line.setAttribute('opacity', '1');
        line.setAttribute('stroke-dashoffset', '0');
      });
      document.querySelector('.hero-title').style.opacity = '1';
      document.querySelector('.hero-subtitle').style.opacity = '1';
      document.querySelector('.hero-cta').style.opacity = '1';
      return;
    }

    gsap.fromTo('.hero-title', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
    );

    gsap.fromTo('.hero-subtitle',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: 'power2.out' }
    );

    gsap.fromTo('.hero-cta',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 0.6, ease: 'power2.out' }
    );

    gsap.fromTo('.scroll-indicator',
      { opacity: 0 },
      { opacity: 1, duration: 1, delay: 1.2, ease: 'power2.out' }
    );

    ScrollTrigger.create({
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const visibleNodes = Math.floor(progress * 10);
        heroNodes.forEach((node, i) => {
          node.setAttribute('opacity', i < visibleNodes ? '1' : '0');
        });
        const visibleLines = Math.floor(progress * 13);
        heroLines.forEach((line, i) => {
          if (i < visibleLines) {
            line.setAttribute('opacity', '1');
            line.setAttribute('stroke-dashoffset', '0');
          } else {
            line.setAttribute('opacity', '0');
          }
        });
      }
    });
  }

  function initFeatureAnimations() {
    if (isReducedMotion) {
      document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'none';
      });
      return;
    }

    gsap.utils.toArray('.feature-card').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' },
          delay: i * 0.1
        }
      );
    });
  }

  /**
   * Philosophy - Clean animation
   */
  function initPhilosophyAnimations() {
    const section = document.getElementById('philosophy');
    if (!section) return;

    if (isReducedMotion) {
      section.querySelectorAll('.philosophy-line, .philosophy-brand, .philosophy-ai, .philosophy-sub-line, .philosophy-domain').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#philosophy',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      }
    });

    // Brand text
    tl.fromTo('.philosophy-brand',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );

    // Title lines
    tl.fromTo('.philosophy-line',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
      '-=0.2'
    );

    // AI badge
    tl.fromTo('.philosophy-ai',
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' },
      '-=0.2'
    );

    // Subtitle
    tl.fromTo('.philosophy-sub-line',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' },
      '-=0.2'
    );

    // Domain
    tl.fromTo('.philosophy-domain',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
      '-=0.1'
    );

    // Slow circle rotation
    gsap.to('.philosophy-circle-svg', {
      rotation: 360,
      duration: 120,
      repeat: -1,
      ease: 'none'
    });
  }

  function initScenarioAnimations() {
    if (isReducedMotion) {
      document.querySelectorAll('.scenario-card').forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'none';
      });
      return;
    }

    if (window.innerWidth > 768) {
      const track = document.querySelector('.scenarios-track');
      const grid = document.querySelector('.scenarios-grid');
      
      if (track && grid) {
        const totalWidth = grid.scrollWidth - track.offsetWidth;
        ScrollTrigger.create({
          trigger: '#scenarios',
          start: 'top top',
          end: `+=${totalWidth}`,
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            grid.style.transform = `translateX(${-self.progress * totalWidth}px)`;
          }
        });
      }
    }

    gsap.utils.toArray('.scenario-card').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: window.innerWidth > 768 ? 'left 80%' : 'top 85%',
            toggleActions: 'play none none reverse',
            horizontal: window.innerWidth > 768
          },
          delay: i * 0.08
        }
      );
    });
  }

  function initCTAAnimations() {
    if (isReducedMotion) {
      ['.cta-title', '.cta-note', '.cta .btn'].forEach(sel => {
        const el = document.querySelector(sel);
        if (el) {
          el.style.opacity = '1';
          el.style.transform = 'none';
        }
      });
      return;
    }

    gsap.fromTo('.cta-title',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: '#cta', start: 'top 80%', toggleActions: 'play none none reverse' }
      }
    );

    gsap.fromTo('.cta-note',
      { opacity: 0 },
      { opacity: 1, duration: 0.6, delay: 0.2, ease: 'power2.out',
        scrollTrigger: { trigger: '#cta', start: 'top 80%', toggleActions: 'play none none reverse' }
      }
    );

    gsap.fromTo('.cta .btn',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.4, ease: 'power2.out',
        scrollTrigger: { trigger: '#cta', start: 'top 80%', toggleActions: 'play none none reverse' }
      }
    );
  }

  function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  function init() {
    checkReducedMotion();
    createHeroNodes();
    gsap.registerPlugin(ScrollTrigger);

    initHeroAnimations();
    initFeatureAnimations();
    initPhilosophyAnimations();
    initScenarioAnimations();
    initCTAAnimations();
    initNavbarScroll();

    console.log('[Scroll] Initialized');
  }

  function destroy() {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }

  return { init, destroy };
})();

window.ScrollSystem = ScrollSystem;
