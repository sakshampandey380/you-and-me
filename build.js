const fs = require('fs');
const esbuild = require('esbuild');

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

try {
  const cssContent = cssFiles.map(f => fs.readFileSync('css/' + f, 'utf8')).join('\n\n');
  fs.writeFileSync('css/style.css', cssContent);
  console.log('✅ Bundled css/style.css (' + (cssContent.length / 1024).toFixed(1) + ' KB)');
} catch (e) {
  console.error('Error bundling CSS:', e);
}

// 2. Bundle JS
try {
  esbuild.buildSync({
    entryPoints: ['js/app.js'],
    bundle: true,
    outfile: 'js/bundle.js',
    format: 'iife'
  });
  console.log('✅ Bundled js/bundle.js');
} catch (e) {
  console.error('Error bundling JS:', e);
}

console.log('🎉 Build complete! Ready for Vercel.');
