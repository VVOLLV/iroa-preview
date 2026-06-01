# SVG Animation Skill

## Purpose
Guide for creating performant SVG animations for web.

## SVG Animation Techniques

### 1. Stroke Drawing Animation
```css
.draw-path {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw 2s ease-out forwards;
}

@keyframes draw {
  to { stroke-dashoffset: 0; }
}
```

### 2. SVG Morphing
```javascript
// Using GSAP MorphSVG (paid) or manual path interpolation
gsap.to('#path1', {
  attr: { d: 'M10 80 C 40 10, 65 10, 95 80 S 160 150, 190 80' },
  duration: 1,
  ease: 'power2.inOut'
});
```

### 3. SVG Filter Effects
```svg
<svg>
  <defs>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
</svg>
```

### 4. Particle Systems (SVG)
```javascript
function createParticles(svg, count) {
  for (let i = 0; i < count; i++) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', Math.random() * 3 + 1);
    circle.setAttribute('cx', Math.random() * 100 + '%');
    circle.setAttribute('cy', Math.random() * 100 + '%');
    circle.setAttribute('fill', 'var(--color-primary)');
    circle.setAttribute('opacity', Math.random() * 0.5 + 0.1);
    svg.appendChild(circle);
  }
}
```

## Performance Best Practices

### DO
- Use CSS transforms (translate, scale, rotate)
- Use opacity for fade effects
- Use will-change sparingly
- Batch DOM reads/writes
- Use requestAnimationFrame

### DON'T
- Animate layout properties (width, height, top, left)
- Create too many SVG elements (>100)
- Use complex filters on large areas
- Animate without RAF

## SVG Optimization

### Remove unnecessary attributes
```svg
<!-- Before -->
<circle cx="50" cy="50" r="25" fill="#000000" stroke="none" stroke-width="0"/>

<!-- After -->
<circle cx="50" cy="50" r="25"/>
```

### Use CSS for styling
```css
svg circle {
  fill: var(--color-primary);
  transition: transform 0.3s ease-out;
}
```

## Common SVG Animations

### Breathing Circle
```css
@keyframes breathe {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
}
```

### Rotating Element
```css
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### Pulsing Glow
```css
@keyframes pulse-glow {
  0%, 100% { filter: drop-shadow(0 0 5px rgba(194, 103, 58, 0.3)); }
  50% { filter: drop-shadow(0 0 20px rgba(194, 103, 58, 0.6)); }
}
```

## GSAP SVG Animations

### Basic SVG Animation
```javascript
gsap.from('svg circle', {
  scale: 0,
  opacity: 0,
  duration: 0.8,
  stagger: 0.1,
  ease: 'back.out(1.7)'
});
```

### Scroll-Triggered SVG
```javascript
gsap.to('svg .draw-path', {
  strokeDashoffset: 0,
  scrollTrigger: {
    trigger: '#section',
    start: 'top center',
    end: 'bottom center',
    scrub: 1
  }
});
```
