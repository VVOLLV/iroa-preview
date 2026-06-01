# Scroll Effect Patterns Skill

## Purpose
High-performance scroll-driven animation patterns.

## Core Principles

### 1. Use CSS Transforms Only
```css
/* GOOD - GPU accelerated */
transform: translateX(100px);
transform: scale(1.5);
transform: rotate(45deg);
opacity: 0.5;

/* BAD - Triggers layout */
left: 100px;
width: 200px;
margin-left: 50px;
```

### 2. Use will-change Sparingly
```css
.animated-element {
  will-change: transform, opacity;
}
```

### 3. Debounce Scroll Handlers
```javascript
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
```

## Scroll Animation Patterns

### Pattern 1: Simple Fade In
```javascript
ScrollTrigger.create({
  trigger: '.element',
  start: 'top 80%',
  onEnter: () => gsap.to('.element', { opacity: 1, y: 0, duration: 0.8 })
});
```

### Pattern 2: Parallax Layers
```javascript
gsap.to('.bg-layer', {
  y: -100,
  scrollTrigger: {
    trigger: '#section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true
  }
});

gsap.to('.fg-layer', {
  y: -200,
  scrollTrigger: {
    trigger: '#section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true
  }
});
```

### Pattern 3: Text Reveal (Word by Word)
```javascript
const text = document.querySelector('.reveal-text');
const words = text.textContent.split(' ');
text.innerHTML = words.map(w => `<span class="word">${w}</span>`).join(' ');

gsap.from('.word', {
  opacity: 0,
  y: 20,
  stagger: 0.1,
  scrollTrigger: {
    trigger: '.reveal-text',
    start: 'top 80%'
  }
});
```

### Pattern 4: Scale Reveal
```javascript
gsap.from('.element', {
  scale: 0.8,
  opacity: 0,
  duration: 1,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.element',
    start: 'top 85%'
  }
});
```

### Pattern 5: Horizontal Scroll
```javascript
const track = document.querySelector('.track');
const totalWidth = track.scrollWidth - window.innerWidth;

gsap.to(track, {
  x: -totalWidth,
  scrollTrigger: {
    trigger: '.horizontal-section',
    pin: true,
    scrub: 1,
    end: () => `+=${totalWidth}`
  }
});
```

### Pattern 6: Progress-Based Animation
```javascript
ScrollTrigger.create({
  trigger: '#section',
  start: 'top top',
  end: 'bottom bottom',
  onUpdate: (self) => {
    const progress = self.progress;
    // Animate based on progress (0 to 1)
    element.style.opacity = progress;
    element.style.transform = `scale(${0.8 + progress * 0.2})`;
  }
});
```

## Performance Tips

### 1. Use scrub: 1 instead of scrub: true
```javascript
// Slightly delayed, smoother
scrollTrigger: { scrub: 1 }
```

### 2. Limit Number of Triggers
- Combine related animations
- Use batch processing
- Kill unused triggers

### 3. Use IntersectionObserver for Simple Cases
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animate').forEach(el => observer.observe(el));
```

### 4. Avoid Pinning on Mobile
```javascript
if (window.innerWidth > 768) {
  // Desktop: use pin
  ScrollTrigger.create({ pin: true, ... });
} else {
  // Mobile: simple fade in
  gsap.from('.element', { opacity: 0, y: 20 });
}
```

## Easing Functions

### Natural Movement
```javascript
ease: 'power2.out'      // Deceleration
ease: 'power2.in'       // Acceleration
ease: 'power2.inOut'    // Accelerate then decelerate
ease: 'back.out(1.7)'   // Overshoot
ease: 'elastic.out(1, 0.3)' // Bounce
```

### Custom Cubic Bezier
```javascript
ease: CustomEase.create('custom', 'M0,0 C0.25,0.1 0.25,1 1,1')
```

## Debugging Scroll Animations

### Enable ScrollTrigger Markers
```javascript
ScrollTrigger.create({
  trigger: '#section',
  start: 'top center',
  end: 'bottom center',
  markers: true,  // Shows visual markers
  ...
});
```

### Log Progress
```javascript
ScrollTrigger.create({
  onUpdate: (self) => {
    console.log(`Progress: ${(self.progress * 100).toFixed(1)}%`);
  }
});
```
