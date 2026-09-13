const fs = require('fs');
const { execSync } = require('child_process');

console.log('⚡ Building You & Me 3D Chat Application...');

// 1. Bundle CSS
const cssFiles = [
  'variables.css',
  'base.css',
  'animations.css',
  'background3d.css',
  'components.css',
  'auth.css',
  'chat.css',
  'responsive.css'
];
const cssContent = cssFiles.map(f => fs.readFileSync('css/' + f, 'utf8')).join('\n\n');
fs.writeFileSync('css/style.css', cssContent);
console.log('✅ Bundled css/style.css (' + (cssContent.length / 1024).toFixed(1) + ' KB)');

// 2. Bundle JS
try {
  execSync('npx esbuild js/app.js --bundle --outfile=js/bundle.js --format=iife', { stdio: 'inherit' });
  console.log('✅ Bundled js/bundle.js');
} catch (e) {
  console.error('Failed to bundle JS with esbuild', e);
}

console.log('🎉 Build complete! Ready for Vercel and local usage.');
