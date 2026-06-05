const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const ASSETS_DIR = path.join(ROOT_DIR, 'assets', 'img');

console.log(`Iniciando monitoramento de alterações de imagens em: ${ASSETS_DIR}`);

let timeoutId = null;

function runSync() {
  console.log('Alteração de imagem detectada! Sincronizando imagens...');
  exec('node scripts/sync-images.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao sincronizar: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Aviso: ${stderr}`);
    }
    console.log(stdout.trim());
  });
}

// Watch recursively (supported natively on win32 and macOS)
fs.watch(ASSETS_DIR, { recursive: true }, (eventType, filename) => {
  if (!filename) return;

  // Ignorar arquivos ocultos, temporários ou do git
  if (filename.includes('.git') || filename.startsWith('.')) return;

  // Ignorar arquivos que não sejam imagens comuns
  const ext = path.extname(filename).toLowerCase();
  const validExtensions = ['.webp', '.jpeg', '.jpg', '.png', '.svg', '.gif'];
  if (!validExtensions.includes(ext)) return;

  // Debouncing de 300ms para evitar chamadas duplicadas ou em lote
  clearTimeout(timeoutId);
  timeoutId = setTimeout(runSync, 300);
});

// Executa uma vez ao iniciar o monitoramento
runSync();
