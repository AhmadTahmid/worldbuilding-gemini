import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { WorldSpec, WorldBible } from '../src/types/world';
import { WorldCompiler } from '../src/world/generator/WorldCompiler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(`\n========================================`);
console.log(`    AETHELGARD WORLD VALIDATION SUITE   `);
console.log(`========================================`);

const seedsToTest = ['Aethelgard-4891', 'Seed-Alpha', 'Seed-Beta', 'World-999'];

const biblePath = path.resolve(__dirname, '../data/world-bible.json');
const bibleData: WorldBible = JSON.parse(fs.readFileSync(biblePath, 'utf-8'));

let allPassed = true;

for (const seed of seedsToTest) {
  console.log(`\nValidating seed: "${seed}"...`);
  const spec: WorldSpec = {
    seed,
    widthTiles: 288,
    heightTiles: 240,
    tileSize: 16,
    macroChunkSize: 24,
    worldName: 'Aethelgard',
    era: 'The Fourth Century of the Calmed Seas',
  };

  const result = WorldCompiler.compile(spec, bibleData);

  if (result.validation.isValid) {
    console.log(`  ✓ Schema & Graph Validation: PASSED`);
    console.log(`  ✓ Reachable Locations: ${result.validation.stats.reachableMajorLocations}/${result.validation.stats.totalMajorLocations}`);
    console.log(`  ✓ NPCs: ${result.validation.stats.npcCount}, POIs: ${result.validation.stats.poiCount}, Secrets: ${result.validation.stats.secretCount}`);
  } else {
    allPassed = false;
    console.error(`  ❌ Validation FAILED:`);
    for (const err of result.validation.errors) {
      console.error(`    - ${err}`);
    }
  }

  if (result.validation.warnings.length > 0) {
    for (const warn of result.validation.warnings) {
      console.warn(`    ⚠️  ${warn}`);
    }
  }
}

if (allPassed) {
  console.log(`\n========================================`);
  console.log(`✓ ALL SEEDS VALIDATED SUCCESSFULLY!`);
  console.log(`========================================\n`);
  process.exit(0);
} else {
  console.error(`\n❌ ONE OR MORE SEEDS FAILED VALIDATION!`);
  process.exit(1);
}
