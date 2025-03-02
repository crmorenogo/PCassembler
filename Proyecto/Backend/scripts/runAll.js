import { exec } from "child_process";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

// Obtener la ruta del directorio actual del script
const __dirname = dirname(fileURLToPath(import.meta.url));

// Lista de scripts a ejecutar (con ruta absoluta)
const scripts = [
  "insertCPU.js",
  "insertGPU.js",
  "insertRAM.js",
  "insertMotherboard.js",
  "insertPower.js",
  "insertCase.js",
  "insertCompatibility.js",
  "insertStorage.js",
  "insertMonitor.js",
].map(script => resolve(__dirname, script));

// Ejecutar todos los scripts en paralelo
scripts.forEach(script => {
  exec(`node "${script}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error ejecutando ${script}:`, error);
      return;
    }
    if (stderr) {
      console.error(`⚠️ Advertencia en ${script}:`, stderr);
    }
    console.log(`✅ ${script} ejecutado correctamente:\n${stdout}`);
  });
});
