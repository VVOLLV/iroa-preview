# Anthropic Design Style Research & Analysis

## Anthropic.com Design Patterns

### Typography
- **Hero Text**: Extremely large (80-120px+), bold, tight line-height
- **Font Weight**: 700-900 for impact
- **Letter Spacing**: Negative (-0.02em to -0.05em) for modern feel
- **Line Height**: Tight (0.9-1.1) for headlines

### Visual Effects
- **Text Reveal**: Characters/words animate in sequence
- **Parallax Depth**: Background moves slower than foreground
- **Gradient Overlays**: Subtle gradients on text backgrounds
- **Blur Effects**: Backdrop blur for glassmorphism

### Animation Patterns
- **Scroll-triggered**: Animations tied to scroll position
- **Staggered reveals**: Elements appear one by one
- **Easing**: Custom cubic-bezier for natural feel
- **Duration**: 0.6-1.2s for main animations

### Color Usage
- **High contrast**: Dark text on light, or vice versa
- **Accent colors**: Used sparingly for CTAs
- **Gradients**: Subtle, not overwhelming

## Modern AI Website Trends (2025-2026)

### 1. Large Typography Hero
- Single powerful statement
- 60-120px font size
- Often black/white with accent highlight

### 2. Text Morphing/Reveal
- Words change on scroll
- Typewriter effects
- Character-by-character reveal

### 3. 3D Depth Illusions
- Parallax layers
- Perspective transforms
- Z-axis movement on scroll

### 4. Gradient Animations
- Moving gradient backgrounds
- Gradient text fills
- Animated gradient borders

### 5. Cursor/Mouse Interactions
- Magnetic elements
- Distortion effects
- Light follow effects

## Recommended Approach for Philosophy Section

### Current Issues
- ScrollTrigger pin causes jank on some devices
- Animation is too slow/boring
- Text fade-in is underwhelming

### Proposed Solution: "Impact Reveal" Design

1. **Full-screen bold text** (like Anthropic)
   - 72-96px font size
   - Font weight 800
   - Tight line-height

2. **Scroll-driven word reveal**
   - Each line reveals as you scroll
   - Words scale up from 0.8 to 1.0
   - Opacity 0 to 1
   - Slight vertical movement

3. **Background visual effect**
   - Gradient mesh or blur effect
   - Subtle animation
   - High contrast with text

4. **Domain branding integration**
   - "iroa.im" as visual element
   - Subtle animation or highlight

5. **Performance optimization**
   - Use CSS transforms only (no layout triggers)
   - will-change for animated elements
   - requestAnimationFrame for smooth updates
   - No heavy ScrollTrigger pinning

## CSS Animation Techniques

### Text Reveal with clip-path
```css
.reveal-text {
  clip-path: inset(0 100% 0 0);
  animation: reveal 1s ease-out forwards;
}

@keyframes reveal {
  to { clip-path: inset(0 0 0 0); }
}
```

### Scale Reveal
```css
.scale-reveal {
  transform: scale(0.8);
  opacity: 0;
  transition: transform 0.8s ease-out, opacity 0.8s ease-out;
}

.scale-reveal.visible {
  transform: scale(1);
  opacity: 1;
}
```

### Gradient Text
```css
.gradient-text {
  background: linear-gradient(135deg, var(--color-primary), var(--color-node));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```
