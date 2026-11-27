// Gobble Dash — hands the entry in: copies game/ and screenshots/ to the output
// directory and writes dossier.json with buildDossier from vendor/makefun-game.ts.
// Runs under Node 22, standard library only. No network, no secrets.
import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)));
const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR || '/output');

// Fail fast with a clear message if the game is not laid out as expected,
// instead of letting buildDossier report a missing index.html later.
if (!existsSync(join(repoRoot, 'game', 'index.html'))) {
  throw new Error('gobble-dash: game/index.html is missing from the repository');
}

mkdirSync(join(outDir, 'game'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
cpSync(join(repoRoot, 'game'), join(outDir, 'game'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);
console.log(`gobble-dash: wrote ${join(outDir, 'dossier.json')} (${dossier.length} bytes)`);
