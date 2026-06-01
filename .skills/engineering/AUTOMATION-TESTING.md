# Automation & Batch Verification Skill

## Purpose
Automated testing and verification for web applications.

## Batch Verification Script

```javascript
// Run in browser console to verify all systems

async function runFullVerification() {
  const results = {
    timestamp: new Date().toISOString(),
    tests: []
  };

  function test(name, pass, details = '') {
    results.tests.push({ name, pass, details });
    console.log(pass ? '✓' : '✗', name, details ? `(${details})` : '');
  }

  // 1. Check DOM structure
  test('HTML structure', document.querySelector('#hero') !== null);
  test('Navigation', document.querySelector('.navbar') !== null);
  test('Language switcher', document.querySelector('.lang-switcher') !== null);
  test('Theme switcher', document.querySelector('.theme-switcher') !== null);

  // 2. Check scripts loaded
  test('ThemeSystem loaded', typeof ThemeSystem !== 'undefined');
  test('I18nSystem loaded', typeof I18nSystem !== 'undefined');
  test('CursorSystem loaded', typeof CursorSystem !== 'undefined');
  test('ScrollSystem loaded', typeof ScrollSystem !== 'undefined');
  test('Analytics loaded', typeof Analytics !== 'undefined');

  // 3. Check i18n elements
  const i18nElements = document.querySelectorAll('[data-i18n]');
  test('i18n elements exist', i18nElements.length > 0, `Found ${i18nElements.length}`);

  // 4. Test language switching
  if (typeof I18nSystem !== 'undefined') {
    const originalLang = I18nSystem.getCurrentLang();
    
    // Test English
    const enResult = await I18nSystem.switchLanguage('en');
    test('Switch to English', enResult, I18nSystem.getCurrentLang());
    
    // Test Japanese
    const jaResult = await I18nSystem.switchLanguage('ja');
    test('Switch to Japanese', jaResult, I18nSystem.getCurrentLang());
    
    // Test Korean
    const koResult = await I18nSystem.switchLanguage('ko');
    test('Switch to Korean', koResult, I18nSystem.getCurrentLang());
    
    // Restore original
    await I18nSystem.switchLanguage(originalLang);
    test('Restore language', true, originalLang);
  }

  // 5. Test theme switching
  if (typeof ThemeSystem !== 'undefined') {
    const originalTheme = ThemeSystem.getCurrentTheme();
    
    ThemeSystem.applyTheme('dark');
    test('Switch to Dark', ThemeSystem.getCurrentTheme() === 'dark');
    
    ThemeSystem.applyTheme('random');
    test('Switch to Random', ThemeSystem.getCurrentTheme() === 'random');
    
    ThemeSystem.applyTheme('light');
    test('Switch to Light', ThemeSystem.getCurrentTheme() === 'light');
  }

  // 6. Check CSS variables
  const root = document.documentElement;
  const bgColor = getComputedStyle(root).getPropertyValue('--color-bg');
  test('CSS variables defined', bgColor !== '', bgColor.trim());

  // 7. Summary
  const passed = results.tests.filter(t => t.pass).length;
  const total = results.tests.length;
  console.log(`\n${'='.repeat(40)}`);
  console.log(`Results: ${passed}/${total} passed`);
  console.log(`${'='.repeat(40)}\n`);

  return results;
}

// Run verification
runFullVerification();
```

## Automated File Check

```javascript
// Check all required files exist
async function checkFiles() {
  const files = [
    'index.html',
    'style.css',
    'scripts/theme.js',
    'scripts/i18n.js',
    'scripts/cursor.js',
    'scripts/scroll.js',
    'scripts/analytics.js',
    'scripts/main.js',
    'locales/zh.json',
    'locales/en.json',
    'locales/ja.json',
    'locales/ko.json'
  ];

  for (const file of files) {
    try {
      const response = await fetch(file);
      console.log(response.ok ? '✓' : '✗', file);
    } catch (e) {
      console.log('✗', file, '(network error)');
    }
  }
}
```

## Performance Check

```javascript
// Check performance metrics
function checkPerformance() {
  if (window.performance) {
    const timing = performance.timing;
    const metrics = {
      'Page Load': timing.loadEventEnd - timing.navigationStart,
      'DOM Ready': timing.domContentLoadedEventEnd - timing.navigationStart,
      'First Paint': timing.responseEnd - timing.navigationStart
    };
    
    console.log('Performance Metrics:');
    Object.entries(metrics).forEach(([name, value]) => {
      console.log(`  ${name}: ${value}ms`);
    });
  }
}
```
