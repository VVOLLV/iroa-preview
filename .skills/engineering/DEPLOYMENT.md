# Deployment Quick Reference

## Local Development

### Start Server
```bash
cd D:\Felix\vibecoding\official-site

# Python (recommended)
python -m http.server 8000

# Node.js alternative
npx serve . -p 8000

# PHP alternative
php -S localhost:8000
```

### Access
Open browser: http://localhost:8000

## Quick Verification

### 1. Language Test (Critical)
```javascript
// In browser console (F12)
roaDebug.testLang('en')  // Should switch to English
roaDebug.testLang('ja')  // Should switch to Japanese
roaDebug.testLang('ko')  // Should switch to Korean
roaDebug.testLang('zh')  // Should switch back to Chinese
```

### 2. Theme Test
```javascript
roaDebug.testTheme('dark')    // Should apply dark theme
roaDebug.testTheme('random')  // Should apply random theme
roaDebug.testTheme('light')   // Should apply light theme
```

### 3. Full Verification
```javascript
roaDebug.checkTranslations()  // Check all translations
roaDebug.getState()           // Get current state
```

## Production Deployment

### Option 1: Static Hosting (Vercel, Netlify, GitHub Pages)
1. Push to GitHub repository
2. Connect to Vercel/Netlify
3. Deploy automatically

### Option 2: Traditional Hosting
1. Upload all files via FTP
2. Ensure web server serves static files
3. Configure CORS if needed

### Option 3: CDN Deployment
1. Upload to AWS S3 / Cloudflare R2
2. Configure CloudFront / CDN
3. Set cache headers

## Pre-deployment Checklist

- [ ] All languages work correctly
- [ ] All themes work correctly
- [ ] Mobile responsive layout works
- [ ] Animations play smoothly
- [ ] No console errors
- [ ] Performance metrics acceptable
- [ ] Accessibility features work
- [ ] Analytics consent dialog works

## Environment Variables

None required - all configuration is inline.

## Cache Strategy

```
index.html    - no-cache (always fresh)
style.css     - cache 1 year
scripts/*.js  - cache 1 year
locales/*.json - cache 1 day
assets/*      - cache 1 year
```

## Monitoring

### Analytics Events Tracked
- `page_view` - Page load
- `hero_cta_click` - CTA button clicks
- `scroll_depth` - 25/50/75/100% scroll
- `lang_switch` - Language changes
- `theme_switch` - Theme changes
- `feature_card_view` - Feature card visibility
- `scenario_card_click` - Scenario card clicks
- `footer_link_click` - Footer link clicks

### Success Metrics
- CTA click rate: ≥ 20%
- Bounce rate: ≤ 35%
- Language switch rate: ≥ 5%
- Theme switch rate: ≥ 8%
