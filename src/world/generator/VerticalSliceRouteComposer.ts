import { TerrainData } from './TerrainGenerator';
import { CompositionStamps } from './CompositionStamps';
import { SeedRandom } from './SeedRandom';

/**
 * VerticalSliceRouteComposer.ts
 * Composes the canonical vertical slice journey:
 * Oakhaven Village Green → West Forest Gate → River Bridge Crossing →
 * Abandoned Camp → Deepwood Threshold → Elderwood Shrine Sanctuary.
 */
export class VerticalSliceRouteComposer {
  public static compose(terrain: TerrainData, _rng: SeedRandom): void {
    // 1. Oakhaven Village Green (3x3 Elder Oak & Well)
    CompositionStamps.stampElderOakMonument(terrain, 80, 125);

    // Stone well at (80, 127)
    terrain.lowerObjectTiles[127][80] = 54; // Well
    terrain.collision[127][80] = true;

    // 2. West Forest Gate at (68, 125)
    CompositionStamps.stampForestGate(terrain, 68, 125);

    // 3. Scenic River Bridge Beat at (74, 95)
    CompositionStamps.stampScenicRiverBridge(terrain, 74, 95);

    // 4. Abandoned Hunter's Campsite at (65, 80)
    CompositionStamps.stampAbandonedCamp(terrain, 65, 80);

    // 5. Optional Side Trail to the Moonlit Glade (85, 45)
    // Carve subtle winding trail from main road (68, 65) to glade (85, 45)
    this.carveSubtleTrail(terrain, { x: 68, y: 65 }, { x: 85, y: 45 });
    CompositionStamps.stampHiddenFairyGlade(terrain, 85, 45);

    // 6. Deepwood Threshold Portal at (55, 60)
    CompositionStamps.stampDeepwoodThreshold(terrain, 55, 60);

    // 7. Sacred Elderwood Shrine Sanctuary at (50, 40)
    CompositionStamps.stampSacredElderwoodShrine(terrain, 50, 40);
  }

  /**
   * Helper: Carves a subtle winding single-tile trail
   */
  private static carveSubtleTrail(terrain: TerrainData, start: { x: number; y: number }, end: { x: number; y: number }): void {
    let currX = start.x;
    let currY = start.y;

    while (currX !== end.x || currY !== end.y) {
      if (currX >= 0 && currX < terrain.width && currY >= 0 && currY < terrain.height) {
        if (terrain.groundTiles[currY][currX] !== 1 && terrain.groundTiles[currY][currX] !== 2) {
          terrain.terrainTiles[currY][currX] = 7; // Dirt trail
          terrain.lowerObjectTiles[currY][currX] = 0;
          terrain.upperObjectTiles[currY][currX] = 0;
          terrain.collision[currY][currX] = false;
        }
      }

      if (currX < end.x) currX++;
      else if (currX > end.x) currX--;

      if (currY < end.y) currY++;
      else if (currY > end.y) currY--;
    }
  }
}
