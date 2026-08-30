import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { WorldSpec, WorldBible } from '../src/types/world';
import { WorldCompiler } from '../src/world/generator/WorldCompiler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Aethelgard World Generation & Integrity Suite', () => {
  const biblePath = path.resolve(__dirname, '../data/world-bible.json');
  const bibleData: WorldBible = JSON.parse(fs.readFileSync(biblePath, 'utf-8'));

  const baseSpec: WorldSpec = {
    seed: 'Aethelgard-4891',
    widthTiles: 288,
    heightTiles: 240,
    tileSize: 16,
    macroChunkSize: 24,
    worldName: 'Aethelgard',
    era: 'The Fourth Century of the Calmed Seas',
  };

  it('should generate a valid world with 0 validation errors', () => {
    const result = WorldCompiler.compile(baseSpec, bibleData);
    expect(result.validation.isValid).toBe(true);
    expect(result.validation.errors).toHaveLength(0);
  });

  it('should be 100% deterministic given the same seed', () => {
    const res1 = WorldCompiler.compile(baseSpec, bibleData);
    const res2 = WorldCompiler.compile(baseSpec, bibleData);

    expect(res1.map.spawnPoint).toEqual(res2.map.spawnPoint);
    expect(res1.map.npcs.length).toBe(res2.map.npcs.length);
    expect(res1.map.pois.length).toBe(res2.map.pois.length);
    expect(res1.map.layers.ground[100][100]).toBe(res2.map.layers.ground[100][100]);
  }, 15000);

  it('should contain 1 grand city, 3 towns/villages, 30+ NPCs, 15+ POIs, 10+ secrets', () => {
    const result = WorldCompiler.compile(baseSpec, bibleData);
    expect(result.map.settlements.length).toBe(4);
    expect(result.map.npcs.length).toBeGreaterThanOrEqual(30);
    expect(result.map.pois.length).toBeGreaterThanOrEqual(15);
    expect(result.map.secrets.length).toBeGreaterThanOrEqual(10);
  });

  it('should guarantee 100% reachability of all major locations from spawn', () => {
    const result = WorldCompiler.compile(baseSpec, bibleData);
    expect(result.validation.stats.reachableMajorLocations).toBe(result.validation.stats.totalMajorLocations);
  });
});
