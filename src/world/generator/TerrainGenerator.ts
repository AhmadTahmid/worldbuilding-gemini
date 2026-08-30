import { WorldSpec, BiomeType } from '@/types/world';
import { SeedRandom } from './SeedRandom';
import { EnvironmentGrammar } from './EnvironmentGrammar';

export interface TerrainData {
  width: number;
  height: number;
  elevation: number[][];
  moisture: number[][];
  biomes: BiomeType[][];
  groundTiles: number[][];
  terrainTiles: number[][];
  lowerObjectTiles: number[][];
  upperObjectTiles: number[][];
  collision: boolean[][];
  riverMap: boolean[][];
}

/**
 * TerrainGenerator.ts
 * Generates continuous elevation fields, river networks, biome classification,
 * autotiled terrain transitions, and delegates flora/scenery synthesis to EnvironmentGrammar.
 */
export class TerrainGenerator {
  public static generate(spec: WorldSpec, rng: SeedRandom): TerrainData {
    const W = spec.widthTiles;
    const H = spec.heightTiles;

    const elevation: number[][] = Array.from({ length: H }, () => new Array(W).fill(0));
    const moisture: number[][] = Array.from({ length: H }, () => new Array(W).fill(0));
    const biomes: BiomeType[][] = Array.from({ length: H }, () => new Array(W).fill('grassland'));
    const groundTiles: number[][] = Array.from({ length: H }, () => new Array(W).fill(5));
    const terrainTiles: number[][] = Array.from({ length: H }, () => new Array(W).fill(0));
    const lowerObjectTiles: number[][] = Array.from({ length: H }, () => new Array(W).fill(0));
    const upperObjectTiles: number[][] = Array.from({ length: H }, () => new Array(W).fill(0));
    const collision: boolean[][] = Array.from({ length: H }, () => new Array(W).fill(false));
    const riverMap: boolean[][] = Array.from({ length: H }, () => new Array(W).fill(false));

    // 1. Generate Continuous Elevation Field with Continental Shape
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        // Base simplex noise
        const rawElev = rng.fbmNoise2D(x, y, 0.015, 4, 2.0, 0.5);
        const detailElev = rng.fbmNoise2D(x, y, 0.05, 2, 2.0, 0.4);

        // Mountain peak bias at North-East (x: 210, y: 40)
        const distToPeak = Math.hypot((x - 210) / W, (y - 40) / H);
        const mountainBias = Math.max(0, 1.0 - distToPeak * 1.6);

        // Ocean bias at South-West edge (x: 0, y: H) and South-East bay (x: W, y: H)
        const southOceanBias = (y / H) * 0.4;
        const westOceanBias = Math.max(0, (30 - x) / 30) * 0.5;

        let finalElev = rawElev * 0.7 + detailElev * 0.3 + mountainBias * 0.55 - southOceanBias - westOceanBias;
        finalElev = Math.max(0, Math.min(1, finalElev));
        elevation[y][x] = finalElev;

        // Moisture noise
        const rawMoisture = rng.fbmNoise2D(x + 500, y + 500, 0.02, 3, 2.0, 0.5);
        moisture[y][x] = Math.max(0, Math.min(1, rawMoisture));
      }
    }

    // 2. Trace Continuous River Network from Mountain Lake to Ocean Bay
    let rx = 195;
    let ry = 48;
    const riverPoints: [number, number][] = [];

    while (rx > 30 && ry < H - 20) {
      riverPoints.push([Math.round(rx), Math.round(ry)]);
      const stepNoise = rng.fbmNoise2D(rx, ry, 0.1, 2) - 0.5;
      rx -= 0.6 + stepNoise * 0.4;
      ry += 0.9;
    }

    for (const [px, py] of riverPoints) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = px + dx;
          const ny = py + dy;
          if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
            riverMap[ny][nx] = true;
          }
        }
      }
    }

    // 3. Assign Biomes and Base Ground / Collision
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const elev = elevation[y][x];
        const moist = moisture[y][x];
        const isRiver = riverMap[y][x];

        if (isRiver && elev > 0.28) {
          // River Water
          biomes[y][x] = 'ocean';
          groundTiles[y][x] = 2; // Shallow water
          collision[y][x] = true; // Solid unless bridged
          continue;
        }

        if (elev < 0.22) {
          // Deep Ocean
          biomes[y][x] = 'ocean';
          groundTiles[y][x] = 1; // Deep ocean
          collision[y][x] = true;
        } else if (elev < 0.28) {
          // Shallow Water & Coastline
          biomes[y][x] = 'ocean';
          groundTiles[y][x] = 2;
          collision[y][x] = true;
        } else if (elev < 0.34) {
          // Sandy Beach / Shore
          biomes[y][x] = 'beach';
          groundTiles[y][x] = 4; // Sand
          collision[y][x] = false;
        } else if (elev > 0.72) {
          // High Mountain Peaks & Cliffs
          biomes[y][x] = 'mountain';
          groundTiles[y][x] = 9; // Mountain Slate
          collision[y][x] = false;
        } else if (x < 110 && y < 75) {
          // Deepwood Gloom (North-West)
          biomes[y][x] = 'deepwood';
          groundTiles[y][x] = 6; // Dark Forest Grass
          collision[y][x] = false;
        } else if (moist > 0.52 || (x < 140 && y >= 75 && y < 160)) {
          // Forest / Whispering Weald
          biomes[y][x] = 'forest';
          groundTiles[y][x] = 5; // Lush Grass
          collision[y][x] = false;
        } else {
          // Open Grassland / Meadow
          biomes[y][x] = 'grassland';
          groundTiles[y][x] = 5; // Grass
          collision[y][x] = false;
        }
      }
    }

    // 4. Generate Natural Mountain Cliffs & Elevation Borders
    for (let y = 1; y < H - 2; y++) {
      for (let x = 1; x < W - 1; x++) {
        const elev = elevation[y][x];
        const elevBelow = elevation[y + 1][x];

        if (elev >= 0.72 && elevBelow < 0.72 && groundTiles[y + 1][x] !== 1 && groundTiles[y + 1][x] !== 2) {
          terrainTiles[y][x] = 10; // Cliff Top Edge
          terrainTiles[y + 1][x] = 11; // Cliff Wall Center
          terrainTiles[y + 2][x] = 12; // Cliff Base Scree
          collision[y + 1][x] = true;  // Cliff Wall is impassable
        }
      }
    }

    // 5. Generate Shoreline Transitions & Foam Edges
    for (let y = 1; y < H - 1; y++) {
      for (let x = 1; x < W - 1; x++) {
        // If this tile is shallow water (2) adjacent to sand (4) or grass (5)
        if (groundTiles[y][x] === 2) {
          const hasLandNeighbor =
            groundTiles[y - 1][x] >= 4 ||
            groundTiles[y + 1][x] >= 4 ||
            groundTiles[y][x - 1] >= 4 ||
            groundTiles[y][x + 1] >= 4;

          if (hasLandNeighbor && terrainTiles[y][x] === 0) {
            terrainTiles[y][x] = 3; // Water Foam / Shoreline Crest
          }
        }
      }
    }

    // 6. Apply Structured Spatial Environment Grammars
    EnvironmentGrammar.apply(
      spec,
      biomes,
      elevation,
      moisture,
      {
        groundTiles,
        terrainTiles,
        lowerObjectTiles,
        upperObjectTiles,
        collision,
      },
      rng
    );

    return {
      width: W,
      height: H,
      elevation,
      moisture,
      biomes,
      groundTiles,
      terrainTiles,
      lowerObjectTiles,
      upperObjectTiles,
      collision,
      riverMap,
    };
  }
}
