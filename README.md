<div align="center">

# Roa Official Welcome Page

**让思考，有地方落脚** · **A place for your thoughts**

[![Website](https://img.shields.io/badge/website-live-brightgreen)](https://iroa.im)
[![License](https://img.shields.io/badge/license-proprietary-blue)](#)

<br>

Roa is an AI-native thinking tool. This is the official welcome page featuring multi-language support, theme system, and immersive scroll interactions.

</div>

---

## ✨ Features

- 🌍 **4-Language Support** — Chinese, English, Japanese, Korean
- 🎨 **3 Theme Modes** — Light, Dark, Random Color
- 🖱️ **Custom Cursor** — Circular ring with semantic interactions
- 📜 **Scroll Animations** — GSAP ScrollTrigger powered narrative
- 📊 **Analytics** — Anonymous behavior tracking
- ♿ **Accessible** — WCAG compliant, keyboard navigation
- ⚡ **Fast** — Under 150KB total, optimized performance

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/roa-official-site.git
cd roa-official-site

# Start local server
python -m http.server 8000
# or
npx serve .

# Open in browser
open http://localhost:8000
```

## 📁 Project Structure

```
roa-official-site/
├── index.html          # Main page
├── style.css           # Styles with CSS variables
├── scripts/
│   ├── main.js         # App orchestration
│   ├── theme.js        # Theme system
│   ├── i18n.js         # Internationalization
│   ├── cursor.js       # Custom cursor
│   ├── scroll.js       # Scroll animations
│   └── analytics.js    # Event tracking
├── locales/
│   ├── zh.json         # Chinese
│   ├── en.json         # English
│   ├── ja.json         # Japanese
│   └── ko.json         # Korean
└── assets/             # Static assets
```

## 🎨 Theme System

| Theme | Description |
|-------|-------------|
| ☀️ Light | Warm off-white with orange accents |
| 🌙 Dark | Warm dark with desaturated colors |
| 🎲 Random | Date-seeded HSL colors, consistent per day |

## 🌐 Internationalization

| Language | Code | Font |
|----------|------|------|
| 中文 | `zh` | Noto Serif SC + Inter |
| English | `en` | Lora + Inter |
| 日本語 | `ja` | Noto Serif JP + Inter |
| 한국어 | `ko` | Noto Serif KR + Inter |

## 🛠️ Tech Stack

- **HTML5** — Semantic markup
- **CSS3** — Custom properties, animations
- **JavaScript** — Vanilla ES6+
- **Tailwind CSS** — Utility-first (CDN)
- **GSAP** — Animation library (CDN)
- **ScrollTrigger** — Scroll animations

## 📊 Performance

| Metric | Target | Status |
|--------|--------|--------|
| Page Weight | < 150KB | ✅ ~105KB |
| CSS Size | < 100KB | ✅ 22KB |
| JS Size | < 200KB | ✅ 53KB |
| Animations | ≥ 55fps | ✅ |

## 🧪 Debug Console

Open browser console (F12):

```javascript
roaDebug.getState()           // Get current state
roaDebug.testLang('en')       // Switch language
roaDebug.testTheme('dark')    // Switch theme
roaDebug.listI18n()           // List translations
roaDebug.checkTranslations()  // Verify translations
```

## 📄 License

© 2026 Roa. All rights reserved.

---

<div align="center">

**iroa.im** · Built for thinkers

</div>
