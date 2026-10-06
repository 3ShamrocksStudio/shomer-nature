/* Copies the live SHOMER Nature PWA into the Capacitor web dir, patching the CSP
   so it works inside the native webview. The live web app is never modified. */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const WWW  = path.resolve(__dirname, '..', 'www');

const FILES = [
  'nature.html', 'sw.js', 'manifest.json',
  'logo-192.png', 'logo-512.png', 'SHOMER_logo_big.png', 'SHOMER-bg.jpg',
  '3shamrocks.png', 'report-icon-96.png', 'sos-icon-96.png'
];

fs.mkdirSync(WWW, { recursive: true });
for (const f of FILES) {
  const src = path.join(ROOT, f);
  if (fs.existsSync(src)) { fs.copyFileSync(src, path.join(WWW, f)); console.log('copied', f); }
}

let html = fs.readFileSync(path.join(ROOT, 'nature.html'), 'utf8');
const NATIVE_ORIGINS = "https://localhost capacitor://localhost http://localhost";
html = html.replace(/(<meta http-equiv="Content-Security-Policy" content=")([^"]*)(")/, function(_, a, csp, c) {
  csp = csp.replace(/default-src ([^;]*);/, `default-src $1 ${NATIVE_ORIGINS};`);
  csp = csp.replace(/script-src ([^;]*);/, `script-src $1 ${NATIVE_ORIGINS};`);
  csp = csp.replace(/connect-src ([^;]*);/, `connect-src $1 ${NATIVE_ORIGINS};`);
  csp = csp.replace(/img-src ([^;]*);/, `img-src $1 ${NATIVE_ORIGINS};`);
  csp = csp.replace(/style-src ([^;]*);/, `style-src $1 ${NATIVE_ORIGINS};`);
  return a + csp + c;
});
fs.writeFileSync(path.join(WWW, 'index.html'), html);
console.log('wrote patched index.html (CSP adjusted for native) ->', WWW);
