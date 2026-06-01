# Roa Design System Skill

## Color Token System (CSS Custom Properties)

### Light Theme (Default)
```css
--color-bg: #FDF7F3;          /* Warm off-white */
--color-bg-card: #FFFFFF;      /* Pure white cards */
--color-bg-elevated: #F5EDE7;  /* Elevated surfaces */
--color-text: #1F1713;         /* Warm dark brown */
--color-text-muted: #6B5B4B;   /* Muted text */
--color-primary: #C2673A;      /* Warm orange */
--color-node: #D4956B;         /* Soft orange nodes */
--color-line: #E8D5C4;         /* Connection lines */
--color-border: #E8DDD4;       /* Borders */
```

### Dark Theme (Warm Dark)
```css
--color-bg: #1E1A17;           /* Warm black */
--color-bg-card: #2A2420;      /* Card background */
--color-bg-elevated: #332D28;  /* Elevated surfaces */
--color-text: #EDE7E3;         /* Warm white */
--color-text-muted: #9B8B7B;   /* Muted text */
--color-primary: #D4875A;      /* Desaturated orange */
--color-node: #B07B5A;         /* Deep warm orange */
--color-line: #4A3F36;         /* Connection lines */
--color-border: #3D3530;       /* Borders */
```

### Random Color Rules
- Hue: random 0-360
- Saturation: <= 40%
- Lightness: >= 70% (bg), derived for other tokens
- Seed: current date (consistent within same day)

## Typography
- Headings: Lora / Noto Serif SC / Noto Serif JP / Noto Serif KR
- Body: Inter
- Scale: 48/36/24/18/14/12px

## Spacing
- 8px grid system
- Hero whitespace: >= 30%
- Card gap: 24px
- Section padding: 120px vertical

## Visual Constraints (MUST FOLLOW)
- Saturation <= 60% (Random <= 40%)
- No pure black (#000) or pure white (#FFF)
- Animation duration >= 0.4s (regular) / >= 0.2s (micro)
- Easing: ease-out or cubic-bezier(0.25, 0.1, 0.25, 1.0)
- No flickering/bouncing effects
- All interactive elements need hover/focus/active states
- prefers-reduced-motion: degrade to opacity-only

## Shadows
- sm: subtle card shadow
- md: elevated elements
- lg: modals/overlays
- Dark mode: use rgba(0,0,0,0.3)

## Border Radius
- Cards: 8px
- Buttons: 12px
- Pills: 999px

## Texture
- Background: ~3% opacity paper texture overlay
- Grid: ~4% opacity dot grid
