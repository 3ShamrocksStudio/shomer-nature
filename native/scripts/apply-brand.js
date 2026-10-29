/* SH✡MER Nature brand for the Android shell: launcher icons, splash and launch colours.
   Runs after `npx cap add android`. Copies native/brand/res over the generated defaults
   (which are Capacitor's placeholder icon and splash). No app logic is touched. */
const fs = require('fs');
const path = require('path');
const SRC = path.resolve(__dirname, '..', 'brand', 'res');
const RES = path.resolve(__dirname, '..', 'android', 'app', 'src', 'main', 'res');
const SAND = '#FAF6EC';
if (!fs.existsSync(RES)) { console.log('no android res yet - skipping'); process.exit(0); }
let n = 0;
(function copy(dir) {
  for (const f of fs.readdirSync(dir)) {
    const s = path.join(dir, f), d = path.join(RES, path.relative(SRC, s));
    if (fs.statSync(s).isDirectory()) { fs.mkdirSync(d, { recursive: true }); copy(s); }
    else { fs.copyFileSync(s, d); n++; }
  }
})(SRC);
fs.writeFileSync(path.join(RES, 'values', 'ic_launcher_background.xml'),
  `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">${SAND}</color>\n</resources>\n`);
const styles = path.join(RES, 'values', 'styles.xml');
let x = fs.readFileSync(styles, 'utf8');
if (x.indexOf('windowSplashScreenBackground') === -1) {
  x = x.replace('<item name="android:background">@drawable/splash</item>',
    `<item name="android:background">@drawable/splash</item>\n        <item name="windowSplashScreenBackground">${SAND}</item>`);
  fs.writeFileSync(styles, x);
}
const strings = fs.readFileSync(path.join(RES, 'values', 'strings.xml'), 'utf8');
console.log('brand: copied', n, 'files; launcher label =', (strings.match(/name="app_name">([^<]*)/) || [])[1]);
