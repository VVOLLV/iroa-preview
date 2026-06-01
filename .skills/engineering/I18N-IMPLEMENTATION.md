# i18n Implementation Skill

## Purpose
Guide for implementing robust internationalization in web applications.

## Architecture Principles

### 1. Inline Fallback Strategy
Always embed default language inline to avoid fetch failures on local files.

```javascript
// Default translations embedded in code
const INLINE_TRANSLATIONS = {
  zh: { /* ... */ },
  en: { /* ... */ },
  ja: { /* ... */ },
  ko: { /* ... */ }
};

// Try fetch first, fallback to inline
async function loadTranslations(lang) {
  try {
    return await fetchJSON(`locales/${lang}.json`);
  } catch (e) {
    return INLINE_TRANSLATIONS[lang] || INLINE_TRANSLATIONS.zh;
  }
}
```

### 2. Key Path Resolution
Support dot notation for nested keys: `feature.1.title`

```javascript
function getByPath(obj, path) {
  return path.split('.').reduce((o, k) => o && o[k], obj);
}
```

### 3. DOM Update Strategy
- Use `data-i18n` attribute for text content
- Use `data-i18n-placeholder` for input placeholders
- Use `data-i18n-alt` for image alt text
- Update `<html lang="">` attribute
- Update `<title>` and meta tags

### 4. Language Detection Priority
1. localStorage saved preference
2. URL path prefix (/en, /ja, /ko)
3. navigator.language
4. Default (zh)

### 5. Performance Optimization
- Load default language synchronously (inline)
- Preload other languages after initial render
- Cache loaded translations in memory
- Use requestAnimationFrame for DOM updates

### 6. Event System
```javascript
// Emit language change event
window.dispatchEvent(new CustomEvent('langchange', { 
  detail: { lang, prevLang } 
}));

// Listen for changes
window.addEventListener('langchange', (e) => {
  console.log('Language changed to:', e.detail.lang);
});
```

## Common Pitfalls
1. **fetch() on file://** - Always have inline fallback
2. **Nested key with hyphens** - Use bracket notation if needed
3. **Missing translations** - Show key as fallback, log warning
4. **Race conditions** - Use async/await properly
5. **Memory leaks** - Clean up event listeners
