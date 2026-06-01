# Web Design Review Skill

## Purpose
Comprehensive design review checklist for web applications.

## Visual Review Checklist

### Typography
- [ ] Font sizes follow scale (48/36/24/18/14/12px)
- [ ] Line heights are comfortable (1.5-1.8 for body)
- [ ] Letter spacing is appropriate
- [ ] Font weights are consistent

### Colors
- [ ] No saturation > 60% (40% for random theme)
- [ ] No pure black (#000) or pure white (#FFF)
- [ ] Contrast ratio >= 4.5:1 for text
- [ ] Theme colors are consistent

### Spacing
- [ ] 8px grid system followed
- [ ] Consistent padding/margins
- [ ] Hero whitespace >= 30%
- [ ] Card gaps are uniform (24px)

### Animations
- [ ] Duration >= 0.4s (regular) / >= 0.2s (micro)
- [ ] Easing: ease-out or cubic-bezier(0.25, 0.1, 0.25, 1.0)
- [ ] No flickering or bouncing
- [ ] Reduced motion fallback works

### Responsive Design
- [ ] Mobile: < 768px
- [ ] Tablet: 768px - 1024px
- [ ] Desktop: > 1024px
- [ ] No horizontal scroll on mobile

### Accessibility
- [ ] Skip link works
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader compatible
- [ ] Alt text on images

## Interaction Review

### Cursor System
- [ ] Custom cursor follows mouse
- [ ] Hover states work on buttons/cards
- [ ] Reduced motion disables custom cursor
- [ ] Mobile hides custom cursor

### Scroll Interactions
- [ ] Hero nodes animate on scroll
- [ ] Feature cards fade in
- [ ] Philosophy section pins (desktop)
- [ ] Scenarios horizontal scroll (desktop)
- [ ] CTA appears progressively

### Language Switching
- [ ] All text updates immediately
- [ ] Meta tags update
- [ ] HTML lang attribute updates
- [ ] Button active states work
- [ ] localStorage saves preference

### Theme Switching
- [ ] Light theme displays correctly
- [ ] Dark theme displays correctly
- [ ] Random theme generates valid colors
- [ ] Transitions are smooth
- [ ] localStorage saves preference

## Performance Review
- [ ] LCP <= 2s
- [ ] FID <= 100ms
- [ ] CLS <= 0.1
- [ ] No console errors
- [ ] All resources load successfully
