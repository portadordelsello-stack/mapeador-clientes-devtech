const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Archivos estáticos requeridos para la app web en producción
const filesToCopy = [
  'index.html',
  'app.js',
  'data.js',
  'firebase-service.js',
  'firebase-applet-config.json',
  'manifest.json',
  'icon.svg'
];

for (const file of filesToCopy) {
  const src = path.join(__dirname, file);
  const dest = path.join(publicDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✓ Copiado a public/: ${file}`);
  }
}

console.log('✅ Build completado exitosamente: Directorio "public" listo para Vercel.');
