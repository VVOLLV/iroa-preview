# Roa Interaction Design Skill

## Interaction Philosophy
"Respond, don't react. Guide, don't command."

## Five Interaction Creeds
1. **Respond, not react** - Interactions feel like a friend's nod, not a machine's confirmation
2. **Guide, don't command** - Button text uses invitation style, not imperative
3. **Whitespace, not fill** - Give users thinking space, don't fill every frame with effects
4. **Consistent, not flashy** - All interactions follow the same rhythm and language
5. **Inclusive, not assumptive** - Respect different abilities, devices, and preferences

## Cursor System Design

### Cursor States
| Context | Style | Behavior |
|---------|-------|----------|
| Default | Small dot (8px) | Follows mouse with 0.1s delay |
| Button | Expand + semi-transparent fill | "Clickable" hint |
| Card | Subtle magnetic snap (<= 50px) | "Touchable" feel |
| Node (SVG) | Halo pulse (opacity 0.3->0.7) | "Alive" hint |
| CTA Button | Breathing circle (scale 1.0->1.1) | Attention without force |
| Empty area | Return to default dot | Rest feel |

### Cursor Emotions
- Near node: magnetic attraction feel
- Leaving node: slow release, not sudden
- Canvas area: crosshair, implying "create here"
- Overall: slow, warm, breathing feel

### Technical Implementation
- CSS `cursor: none` to hide system cursor
- Custom cursor as `div` with `pointer-events: none`
- GSAP `gsap.quickTo()` for smooth following
- Dedicated `requestAnimationFrame` loop
- `prefers-reduced-motion`: disable custom cursor, fall back to system

## Scroll Interaction System

### Hero Section: Thought Emergence
- 0-30% scroll: 3 nodes visible
- 30-100% scroll: nodes grow to 8-10
- Lines draw progressively via SVG stroke-dashoffset + ScrollTrigger

### Feature Section: Card Growth
- Cards "grow from canvas": scale(0.8) + opacity(0) -> scale(1) + opacity(1)
- Staggered delay: 0.15s per card
- Slight rotation: 2deg -> 0deg for handcrafted feel

### Scenario Section: Horizontal Scroll
- Desktop: vertical scroll -> horizontal slide (ScrollTrigger pin + scrub)
- Mobile: native vertical stacking (no horizontal)
- Speed: 100px scroll = 300px horizontal
- Card gap: 24px with inertia decay (ease-out)

### Philosophy Section: Forced Deceleration
- ScrollTrigger pin locks area, scroll speed reduced 50%
- Text fades in line by line, each needs 200px scroll distance
- Mobile: no deceleration, simple fade-in instead

### CTA Section: Progressive Summon
- Button appears gradually with scroll
- Background gradient intensifies with scroll progress
- Button entrance: scale(0.95 -> 1.0) bounce effect

## Animation Timing
- Regular transitions: >= 0.4s
- Micro-interactions: >= 0.2s
- Easing: ease-out or cubic-bezier(0.25, 0.1, 0.25, 1.0)
- No flickering or bouncing
- prefers-reduced-motion: opacity-only transitions

## Parallax Layers (Hero)
1. Background: nodes (slowest)
2. Middle: connection lines (medium)
3. Foreground: text (fastest)
