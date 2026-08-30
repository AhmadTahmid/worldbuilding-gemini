import { WorldSpec, WorldBible, CompiledMap, MapEntity } from '@/types/world';
import { SeedRandom } from './SeedRandom';
import { WorldGraphGenerator } from './WorldGraphGenerator';
import { TerrainGenerator } from './TerrainGenerator';
import { RouteCarver } from './RouteCarver';
import { SettlementSynthesizer } from './SettlementSynthesizer';
import { VerticalSliceRouteComposer } from './VerticalSliceRouteComposer';
import { POIGenerator } from './POIGenerator';
import { NPCNarrativeGenerator } from './NPCNarrativeGenerator';
import { WorldValidator, ValidationReport } from './WorldValidator';

export interface CompilationResult {
  map: CompiledMap;
  validation: ValidationReport;
}

export class WorldCompiler {
  public static compile(spec: WorldSpec, bible: WorldBible): CompilationResult {
    const rng = new SeedRandom(spec.seed);

    // 1. Build Topological World Graph
    const graph = WorldGraphGenerator.generate(spec, rng);

    // 2. Generate Base Terrain, Biomes, Rivers, and Cliffs
    const terrain = TerrainGenerator.generate(spec, rng);

    // 3. Carve Roads, Trails, Bridges, and Passages
    RouteCarver.carveRoutes(graph, terrain);

    // 4. Synthesize Settlements (Crownport, Oakhaven, Tidebreak, Cragwatch)
    SettlementSynthesizer.synthesize(bible.settlements, terrain, rng);

    // 5. Compose Canonical Vertical Slice (Oakhaven -> Deepwood -> Elderwood Shrine)
    VerticalSliceRouteComposer.compose(terrain, rng);

    // 6. Place Contextual POIs & Visual Secrets
    const { pois, secrets } = POIGenerator.generate(terrain, rng);

    // 7. Generate 32 Interconnected NPCs with Dialogues and Lore Hints
    const npcs = NPCNarrativeGenerator.generate(terrain, rng);

    // 7. Assemble Entities
    const entities: MapEntity[] = [];

    for (const npc of npcs) {
      entities.push({
        id: npc.id,
        type: 'npc',
        x: npc.position.x,
        y: npc.position.y,
        properties: npc,
      });
    }

    for (const poi of pois) {
      entities.push({
        id: poi.id,
        type: 'poi',
        x: poi.position.x,
        y: poi.position.y,
        properties: poi,
      });
    }

    // Default Spawn Point in Crownport Plaza
    const spawnPoint = { x: 180, y: 112 };
    terrain.collision[spawnPoint.y][spawnPoint.x] = false;

    // Assemble CompiledMap
    const compiledMap: CompiledMap = {
      width: spec.widthTiles,
      height: spec.heightTiles,
      tileSize: spec.tileSize,
      layers: {
        ground: terrain.groundTiles,
        terrain: terrain.terrainTiles,
        lowerObjects: terrain.lowerObjectTiles,
        collision: terrain.collision,
        upperObjects: terrain.upperObjectTiles,
      },
      entities,
      regions: bible.regions,
      settlements: bible.settlements,
      pois,
      secrets,
      npcs,
      spawnPoint,
    };

    // 8. Run Automated Validation & Reachability Checks
    const validation = WorldValidator.validate(compiledMap, graph, bible);

    return {
      map: compiledMap,
      validation,
    };
  }
}
