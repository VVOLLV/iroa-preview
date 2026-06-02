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

  function createFloatingParticles(svg) {
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const r = Math.random() * 2 + 1;
      particle.setAttribute('cx', `${x}%`);
      particle.setAttribute('cy', `${y}%`);
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

    // Add floating particles
    createFloatingParticles(svg);

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

    // Gentle breathing/floating animation for visible nodes
    if (typeof gsap !== 'undefined') {
      heroNodes.forEach((node, i) => {
        gsap.to(node, {
          y: `+=${Math.sin(i * 0.7) * 8}`,
          x: `+=${Math.cos(i * 0.5) * 5}`,
          duration: 3 + i * 0.3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      });

      // Subtle hero content parallax on scroll
      gsap.to('.hero-content', {
        y: 100,
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });
    }
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
  function initScenarioAnimations() {
    if (isReducedMotion) {
      document.querySelectorAll('.scenario-card').forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'none';
      });
      return;
    }

    gsap.utils.toArray('.scenario-card').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          delay: i * 0.1
        }
      );
    });
  }

  function initFloatingCTA() {
    var floatingBtn = document.getElementById('floating-cta');
    if (!floatingBtn) return;

    var scenariosSection = document.getElementById('scenarios');
    if (!scenariosSection) return;

    window.addEventListener('scroll', function() {
      var rect = scenariosSection.getBoundingClientRect();
      var show = rect.bottom < window.innerHeight * 0.5;
      floatingBtn.classList.toggle('visible', show);
    }, { passive: true });
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
    initScenarioAnimations();
    initFloatingCTA();
    initNavbarScroll();

    console.log('[Scroll] Initialized');
  }

  function destroy() {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }

  return { init, destroy };
})();

window.ScrollSystem = ScrollSystem;
