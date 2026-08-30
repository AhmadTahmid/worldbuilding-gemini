import { TerrainData } from './TerrainGenerator';

export interface StampData {
  width: number;
  height: number;
  ground?: (number | null)[][];
  terrain?: (number | null)[][];
  lowerObjects?: (number | null)[][];
  upperObjects?: (number | null)[][];
  collision?: (boolean | null)[][];
}

/**
 * CompositionStamps.ts
 * Reusable, multi-tile architectural and environmental composition prefabs
 * used to stamp memorable landmarks, scenic river crossings, village greens, and shrines.
 */
export class CompositionStamps {
  /**
   * Universal stamper method
   */
  public static applyStamp(terrain: TerrainData, startX: number, startY: number, stamp: StampData): void {
    const W = terrain.width;
    const H = terrain.height;

    for (let dy = 0; dy < stamp.height; dy++) {
      for (let dx = 0; dx < stamp.width; dx++) {
        const x = startX + dx;
        const y = startY + dy;

        if (x < 0 || x >= W || y < 0 || y >= H) continue;

        if (stamp.ground && stamp.ground[dy][dx] !== null) {
          terrain.groundTiles[y][x] = stamp.ground[dy][dx]!;
        }
        if (stamp.terrain && stamp.terrain[dy][dx] !== null) {
          terrain.terrainTiles[y][x] = stamp.terrain[dy][dx]!;
        }
        if (stamp.lowerObjects && stamp.lowerObjects[dy][dx] !== null) {
          terrain.lowerObjectTiles[y][x] = stamp.lowerObjects[dy][dx]!;
        }
        if (stamp.upperObjects && stamp.upperObjects[dy][dx] !== null) {
          terrain.upperObjectTiles[y][x] = stamp.upperObjects[dy][dx]!;
        }
        if (stamp.collision && stamp.collision[dy][dx] !== null) {
          terrain.collision[y][x] = stamp.collision[dy][dx]!;
        }
      }
    }
  }

  /**
   * 1. THE 3x3 MAJESTIC ELDER OAK MONUMENT
   * Focal landmark for Oakhaven village green.
   */
  public static stampElderOakMonument(terrain: TerrainData, cx: number, cy: number): void {
    const sx = cx - 1;
    const sy = cy - 2;

    // Canopy in upperObjects (row 0-1), massive gnarled trunk in lowerObjects (row 2)
    const upper: (number | null)[][] = [
      [92, 93, 94], // Row 0: Top canopy leaves
      [92, 93, 94], // Row 1: Mid canopy leaves
      [null, null, null],
    ];

    const lower: (number | null)[][] = [
      [null, null, null],
      [null, null, null],
      [42, 95, 42], // Row 2: Mossy rock, Trunk Base, Mossy rock
    ];

    const collision: (boolean | null)[][] = [
      [false, false, false],
      [false, false, false],
      [true, true, true],
    ];

    this.applyStamp(terrain, sx, sy, {
      width: 3,
      height: 3,
      upperObjects: upper,
      lowerObjects: lower,
      collision,
    });
  }

  /**
   * 2. THE SACRED 4x4 ELDERWOOD SHRINE TEMPLE
   * Monumental endpoint with carved columns, runic pediment, crystal water pool, and altar.
   */
  public static stampSacredElderwoodShrine(terrain: TerrainData, cx: number, cy: number): void {
    const sx = cx - 2;
    const sy = cy - 2;

    // 4x4 Shrine Architecture
    const terrainGrid: (number | null)[][] = [
      [9, 9, 9, 9],       // Slate flagstone base
      [9, 9, 9, 9],
      [9, 9, 9, 9],
      [9, 7, 7, 9],       // Approaching sacred stone path
    ];

    const upper: (number | null)[][] = [
      [80, 82, 83, 80],   // Corinthian capitals & pediment
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];

    const lower: (number | null)[][] = [
      [81, null, null, 81], // Column bases
      [43, 90, 43, null],   // Standing Monolith, Glowing Altar, Monolith
      [null, null, null, null],
      [68, null, null, 68], // Planter / sacred braziers at entrance
    ];

    const collision: (boolean | null)[][] = [
      [true, false, false, true],
      [true, true, true, false],
      [false, false, false, false], // Walkable courtyard
      [true, false, false, true],
    ];

    this.applyStamp(terrain, sx, sy, {
      width: 4,
      height: 4,
      terrain: terrainGrid,
      upperObjects: upper,
      lowerObjects: lower,
      collision,
    });
  }

  /**
   * 3. OAKHAVEN WEST FOREST GATE
   * Wooden gateposts with hanging lanterns marking the village threshold.
   */
  public static stampForestGate(terrain: TerrainData, x: number, y: number): void {
    // Gatepost on top (y-1) and bottom (y+2), road passing through center (y, y+1)
    terrain.lowerObjectTiles[y - 1][x] = 91; // Gatepost with lantern
    terrain.collision[y - 1][x] = true;
    terrain.lowerObjectTiles[y + 2][x] = 91; // Gatepost with lantern
    terrain.collision[y + 2][x] = true;

    // Fence rails framing the road
    terrain.lowerObjectTiles[y - 2][x] = 47; // Post & rail fence
    terrain.collision[y - 2][x] = true;
    terrain.lowerObjectTiles[y + 3][x] = 47; // Post & rail fence
    terrain.collision[y + 3][x] = true;
  }

  /**
   * 4. SCENIC RIVER CROSSING BEAT
   * River meander, 3-tile wide wooden bridge with railings, riverbank reeds, and weeping birch trees.
   */
  public static stampScenicRiverBridge(terrain: TerrainData, bx: number, by: number): void {
    // 3-tile wide horizontal bridge
    for (let x = bx; x <= bx + 3; x++) {
      for (let y = by - 1; y <= by + 1; y++) {
        terrain.terrainTiles[y][x] = 13; // Wooden River Bridge
        terrain.lowerObjectTiles[y][x] = 0;
        terrain.upperObjectTiles[y][x] = 0;
        terrain.collision[y][x] = false;
      }
    }

    // Riverbank water reeds & cattails
    terrain.terrainTiles[by - 3][bx - 1] = 88; // Reeds & Lilypads
    terrain.terrainTiles[by + 3][bx - 1] = 88;
    terrain.terrainTiles[by - 3][bx + 4] = 88;
    terrain.terrainTiles[by + 3][bx + 4] = 88;

    // Framing Golden Birch trees on bridge approach
    terrain.upperObjectTiles[by - 3][bx - 2] = 44; // Birch Top
    terrain.lowerObjectTiles[by - 2][bx - 2] = 45; // Birch Trunk
    terrain.collision[by - 2][bx - 2] = true;

    terrain.upperObjectTiles[by + 2][bx + 5] = 44;
    terrain.lowerObjectTiles[by + 3][bx + 5] = 45;
    terrain.collision[by + 3][bx + 5] = true;
  }

  /**
   * 5. ABANDONED HUNTER'S CAMPSITE (Environmental Storytelling)
   * Decaying tent canvas, broken wagon wheel, and stone campfire.
   */
  public static stampAbandonedCamp(terrain: TerrainData, cx: number, cy: number): void {
    terrain.lowerObjectTiles[cy][cx - 1] = 89; // Tent canvas & wagon wheel
    terrain.lowerObjectTiles[cy][cx + 1] = 58; // Campfire
    terrain.collision[cy][cx - 1] = true;
    terrain.collision[cy][cx + 1] = true;

    // Fallen mossy log for sitting
    terrain.lowerObjectTiles[cy + 1][cx] = 46;
    terrain.collision[cy + 1][cx] = true;
  }

  /**
   * 6. HIDDEN FAIRY GLADE (Optional Secret Path Payoff)
   * Bioluminescent mushroom ring, standing stone monolith, and rare moonflowers.
   */
  public static stampHiddenFairyGlade(terrain: TerrainData, cx: number, cy: number): void {
    // Clearing dirt/moss floor
    for (let y = cy - 2; y <= cy + 2; y++) {
      for (let x = cx - 2; x <= cx + 2; x++) {
        terrain.groundTiles[y][x] = 6; // Deepwood grass
        terrain.lowerObjectTiles[y][x] = 0;
        terrain.upperObjectTiles[y][x] = 0;
        terrain.collision[y][x] = false;
      }
    }

    // Fairy Ring in center
    terrain.lowerObjectTiles[cy][cx] = 78; // Fairy Mushroom Ring
    terrain.lowerObjectTiles[cy - 1][cx - 1] = 41; // Glowing Mushroom
    terrain.lowerObjectTiles[cy - 1][cx + 1] = 41;
    terrain.lowerObjectTiles[cy + 1][cx - 1] = 43; // Celtic Monolith
    terrain.collision[cy + 1][cx - 1] = true;
  }

  /**
   * 7. DEEPWOOD THRESHOLD COMPOSITION
   * Atmospheric portal: towering 2x3 pines, glowing spore rings, and sudden palette shift.
   */
  public static stampDeepwoodThreshold(terrain: TerrainData, cx: number, cy: number): void {
    // Clear path corridor
    for (let y = cy - 1; y <= cy + 1; y++) {
      terrain.terrainTiles[y][cx] = 7;
      terrain.collision[y][cx] = false;
    }

    // Dense flanking Pine trees
    terrain.upperObjectTiles[cy - 2][cx - 1] = 37;
    terrain.lowerObjectTiles[cy - 1][cx - 1] = 38;
    terrain.collision[cy - 1][cx - 1] = true;

    terrain.upperObjectTiles[cy + 1][cx - 1] = 37;
    terrain.lowerObjectTiles[cy + 2][cx - 1] = 38;
    terrain.collision[cy + 2][cx - 1] = true;

    // Glowing boundary mushrooms
    terrain.lowerObjectTiles[cy - 1][cx + 1] = 41;
    terrain.lowerObjectTiles[cy + 1][cx + 1] = 41;
  }
}
