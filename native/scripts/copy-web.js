/* Copies the live SHOMER Nature PWA into the Capacitor web dir, patching the CSP
   so it works inside the native webview. The live web app is never modified. */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const WWW  = path.resolve(__dirname, '..', 'www');

const FILES = [
  'nature.html', 'privacy.html', 'sw.js', 'manifest.json',
  'logo-192.png', 'logo-512.png', 'icon-192.png', 'icon-512.png', 'nature-badge.png', 'SHOMER-bg.jpg',
  '3shamrocks.png', 'report-icon-96.png', 'sos-icon-96.png'
];

fs.mkdirSync(WWW, { recursive: true });
for (const f of FILES) {
  const src = path.join(ROOT, f);
  if (fs.existsSync(src)) { fs.copyFileSync(src, path.join(WWW, f)); console.log('copied', f); }
}

/* Emergency-guide pictures are referenced as img/guide/<id>.jpg; without them the offline
   guide shows no illustrations inside the APK. */
const GUIDE_SRC = path.join(ROOT, 'img', 'guide'), GUIDE_DST = path.join(WWW, 'img', 'guide');
if (fs.existsSync(GUIDE_SRC)) {
  fs.mkdirSync(GUIDE_DST, { recursive: true });
  for (const f of fs.readdirSync(GUIDE_SRC)) { fs.copyFileSync(path.join(GUIDE_SRC, f), path.join(GUIDE_DST, f)); }
  console.log('copied img/guide (' + fs.readdirSync(GUIDE_DST).length + ' files)');
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
