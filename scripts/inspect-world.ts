import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { WorldSpec, WorldBible } from '../src/types/world';
import { WorldCompiler } from '../src/world/generator/WorldCompiler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seed = process.argv[2] || 'Aethelgard-4891';

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

console.log(`\n======================================================`);
console.log(`   AETHELGARD WORLD INSPECTOR — ${spec.worldName.toUpperCase()}   `);
console.log(`======================================================`);
console.log(`Seed: ${seed}`);
console.log(`Map Size: ${spec.widthTiles}x${spec.heightTiles} tiles (${spec.widthTiles * 16}px x ${spec.heightTiles * 16}px)`);
console.log(`Player Spawn: (${result.map.spawnPoint.x}, ${result.map.spawnPoint.y})`);

console.log(`\n--- REGIONS (${result.map.regions.length}) ---`);
for (const r of result.map.regions) {
  console.log(`• [${r.id}] ${r.name} — "${r.subtitle}" (${r.biome})`);
}

console.log(`\n--- SETTLEMENTS (${result.map.settlements.length}) ---`);
for (const s of result.map.settlements) {
  console.log(`• ${s.name} (${s.type.toUpperCase()}) @ (${s.center.x}, ${s.center.y})`);
  console.log(`  Economy: ${s.economy.join(', ')} | Pop: ${s.population}`);
  console.log(`  Landmarks: ${s.landmarks.join(', ')}`);
}

console.log(`\n--- NOTABLE POIs (${result.map.pois.length}) ---`);
for (const p of result.map.pois.slice(0, 10)) {
  console.log(`• ${p.name} [${p.archetype}] @ (${p.position.x}, ${p.position.y}) in ${p.regionId}`);
}
console.log(`  ... and ${result.map.pois.length - 10} more.`);

console.log(`\n--- HIDDEN SECRETS (${result.map.secrets.length}) ---`);
for (const sec of result.map.secrets) {
  console.log(`• 🤫 ${sec.name} @ (${sec.position.x}, ${sec.position.y})`);
  console.log(`  Hint: "${sec.hint}"`);
}

console.log(`\n--- POPULATION & NPCS (${result.map.npcs.length}) ---`);
const bySettlement = new Map<string, string[]>();
for (const npc of result.map.npcs) {
  const list = bySettlement.get(npc.settlementId) || [];
  list.push(`${npc.name} (${npc.role})`);
  bySettlement.set(npc.settlementId, list);
}
for (const [settlement, names] of bySettlement.entries()) {
  console.log(`\n[${settlement}] (${names.length} NPCs):`);
  console.log(`  ${names.join(' | ')}`);
}

console.log(`\n======================================================\n`);
