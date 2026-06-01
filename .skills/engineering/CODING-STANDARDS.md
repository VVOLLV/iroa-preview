# Roa Software Engineering Coding Standards

## Core Philosophy
"Like breathing, not showing off."

## Code Quality Rules

### 1. Strict Type Safety
- All functions must have clear input/output contracts
- Use JSDoc for all public APIs
- No implicit any types

### 2. Error Handling
- Every async operation must have error handling
- Graceful degradation for all external dependencies
- User-facing errors must be warm and human ("Roa is organizing thoughts")

### 3. Performance Budget
- LCP <= 2s
- FID <= 100ms
- CLS <= 0.1
- Total page weight <= 500KB (JS <= 200KB, CSS <= 100KB, Images <= 200KB)
- Animation FPS >= 55fps
- i18n switch <= 100ms
- Theme switch <= 50ms
- Cursor animation >= 60fps (dedicated rAF loop)

### 4. Code Organization
```
scripts/
  main.js       - Entry point, orchestration
  i18n.js       - Internationalization engine
  theme.js      - Theme system (Light/Dark/Random)
  cursor.js     - Custom cursor system
  scroll.js     - Scroll interaction engine
  analytics.js  - Event tracking
```

### 5. Naming Conventions
- CSS classes: BEM-like with component prefix
- JS functions: camelCase, verb-first (initTheme, switchLang)
- Constants: UPPER_SNAKE_CASE
- Files: kebab-case

### 6. Comments
- Every module must have a header comment explaining its purpose
- Complex algorithms must have inline comments
- No commented-out code in production

### 7. Dependency Management
- CDN with local fallbacks
- GSAP + ScrollTrigger via CDN
- Tailwind CSS via CDN
- No unnecessary dependencies

### 8. Security
- No inline scripts (CSP-friendly)
- Sanitize all user inputs
- No PII collection (anonymous analytics only)
- GDPR/CCPA compliant data deletion

### 9. Accessibility
- Semantic HTML5 (main, section, nav, article)
- All interactive elements keyboard accessible
- Contrast ratio >= 4.5:1
- prefers-reduced-motion support
- Screen reader compatible

### 10. Testing Checklist
- [ ] All themes render correctly
- [ ] All 4 languages display properly
- [ ] Cursor system works on desktop
- [ ] Scroll interactions work smoothly
- [ ] Mobile responsive (no horizontal scroll on mobile)
- [ ] Performance metrics within budget
- [ ] No console errors
- [ ] Keyboard navigation works
- [ ] Reduced motion mode works
