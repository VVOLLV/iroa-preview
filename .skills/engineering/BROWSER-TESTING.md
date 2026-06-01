# Browser Testing & Debugging Skill

## Purpose
Guide for testing and debugging web applications in the browser.

## Common Issues & Solutions

### 1. fetch() fails on local files (file:// protocol)
**Problem**: `fetch()` doesn't work with `file://` protocol in most browsers.
**Solution**: Use XMLHttpRequest or embed translations inline.

```javascript
// Fallback for local files
function loadLocalJSON(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.overrideMimeType('application/json');
    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 0) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`Failed to load ${url}`));
      }
    };
    xhr.onerror = () => reject(new Error(`Network error loading ${url}`));
    xhr.send();
  });
}
```

### 2. Script execution order
**Problem**: Scripts execute before DOM is ready.
**Solution**: Use `DOMContentLoaded` or `defer` attribute.

### 3. CSS/JS caching issues
**Problem**: Browser caches old files during development.
**Solution**: Add version query parameter `?v=1.0.1`

### 4. Console debugging checklist
- Check Console for errors (red)
- Check Network tab for failed requests
- Check Elements tab for applied styles
- Use `console.log()` strategically

## Testing Checklist
- [ ] All scripts load without errors
- [ ] No 404 errors in Network tab
- [ ] Language switching updates all text
- [ ] Theme switching changes colors
- [ ] Animations play smoothly
- [ ] Mobile responsive layout works
- [ ] Keyboard navigation works

## Local Server Options
```bash
# Python
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```
