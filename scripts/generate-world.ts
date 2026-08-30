import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { WorldSpec, WorldBible } from '../src/types/world';
import { WorldCompiler } from '../src/world/generator/WorldCompiler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seed = process.argv[2] || 'Aethelgard-4891';

console.log(`\n========================================`);
console.log(`   AETHELGARD WORLD GENERATOR (CLI)     `);
console.log(`========================================`);
console.log(`Generating world with seed: "${seed}"...`);

const spec: WorldSpec = {
  seed,
  widthTiles: 288,
  heightTiles: 240,
  tileSize: 16,
  macroChunkSize: 24,
  worldName: 'Aethelgard',
  era: 'The Fourth Century of the Calmed Seas',
};

const biblePath = path.resolve(__dirname, '../data/world-bible.json');
const bibleData: WorldBible = JSON.parse(fs.readFileSync(biblePath, 'utf-8'));

const result = WorldCompiler.compile(spec, bibleData);

// Write compiled map JSON to public/data/compiled-world.json so the browser game can load it immediately
const outDir = path.resolve(__dirname, '../public/data');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const outPath = path.join(outDir, 'compiled-world.json');
fs.writeFileSync(outPath, JSON.stringify(result.map, null, 2), 'utf-8');

console.log(`\n✓ Compiled world map saved to: ${outPath}`);
console.log(`\nWorld Stats:`);
console.log(`- Dimensions: ${result.map.width}x${result.map.height} tiles (${result.validation.stats.totalTiles} total)`);
console.log(`- Walkable Tiles: ${result.validation.stats.walkableTiles}`);
console.log(`- Settlements: ${result.validation.stats.settlementCount}`);
console.log(`- NPCs: ${result.validation.stats.npcCount}`);
console.log(`- POIs: ${result.validation.stats.poiCount}`);
console.log(`- Secrets: ${result.validation.stats.secretCount}`);
console.log(`- Reachable Major Locations: ${result.validation.stats.reachableMajorLocations}/${result.validation.stats.totalMajorLocations}`);

if (result.validation.isValid) {
  console.log(`\n🎉 World validation PASSED with 0 errors!`);
} else {
  console.error(`\n❌ World validation FAILED with ${result.validation.errors.length} errors:`);
  for (const err of result.validation.errors) {
    console.error(`  - ${err}`);
  }
}
