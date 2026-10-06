/* Merges permission lines from android-config into the generated AndroidManifest.xml. */
const fs = require('fs');
const path = require('path');
const manifestPath = path.resolve(__dirname, '..', 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
const additionsPath = path.resolve(__dirname, '..', 'android-config', 'AndroidManifest-additions.xml');
if (!fs.existsSync(manifestPath)) { console.log('no manifest yet — skipping'); process.exit(0); }
let manifest = fs.readFileSync(manifestPath, 'utf8');
const additions = fs.readFileSync(additionsPath, 'utf8');
const perms = (additions.match(/<uses-permission[^>]*\/>/g) || []);
let added = 0;
for (const p of perms) {
  const nameMatch = p.match(/android:name="([^"]+)"/);
  if (nameMatch && manifest.indexOf(nameMatch[1]) === -1) {
    manifest = manifest.replace('<application', '    ' + p + '\n    <application');
    added++;
  }
}
fs.writeFileSync(manifestPath, manifest);
console.log('applied', added, 'permission(s) to AndroidManifest.xml');
