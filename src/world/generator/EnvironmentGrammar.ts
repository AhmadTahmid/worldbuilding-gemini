import { BiomeType, WorldSpec } from '@/types/world';
import { SeedRandom } from './SeedRandom';

export interface EnvironmentLayers {
  groundTiles: number[][];
  terrainTiles: number[][];
  lowerObjectTiles: number[][];
  upperObjectTiles: number[][];
  collision: boolean[][];
}

/**
 * EnvironmentGrammar.ts
 * Replaces uniform random scatter with structured, intentional spatial grammars:
 * - Noise-masked vegetation density fields
 * - Canopy clusters & organic forest clearings
 * - Trailside framing & negative space corridors
 * - Biome-specific landscape compositions (scree slopes, tidal pools, farm fringes)
 */
export class EnvironmentGrammar {
  public static apply(
    spec: WorldSpec,
    biomes: BiomeType[][],
    elevation: number[][],
    _moisture: number[][],
    layers: EnvironmentLayers,
    rng: SeedRandom
  ): void {
    const W = spec.widthTiles;
    const H = spec.heightTiles;

    // 1. Generate Multi-Scale Density Field Noise Maps
    const forestDensity: number[][] = Array.from({ length: H }, () => new Array(W).fill(0));
    const meadowFloraDensity: number[][] = Array.from({ length: H }, () => new Array(W).fill(0));
    const mountainRockDensity: number[][] = Array.from({ length: H }, () => new Array(W).fill(0));

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        // Low-frequency clump noise (creates large groves and clearings)
        const clump = rng.fbmNoise2D(x * 0.04, y * 0.04, 0.03, 3, 2.0, 0.5);
        // Detail variation
        const detail = rng.fbmNoise2D(x * 0.12 + 100, y * 0.12 + 100, 0.05, 2, 2.0, 0.4);
        forestDensity[y][x] = clump * 0.7 + detail * 0.3;

        // Meadow flora patches
        meadowFloraDensity[y][x] = rng.fbmNoise2D(x * 0.08 + 200, y * 0.08 + 200, 0.04, 2);

        // Mountain scree / rocks
        mountainRockDensity[y][x] = rng.fbmNoise2D(x * 0.06 + 300, y * 0.06 + 300, 0.05, 2);
      }
    }

    // 2. Identify Road/Path Corridor Proximity Buffer (Trailside Framing)
    const isNearRoad: boolean[][] = Array.from({ length: H }, () => new Array(W).fill(false));
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        // Road tiles: 7 (dirt), 8 (cobble), 13/14 (bridge), 15 (pier), 16 (quay)
        const t = layers.terrainTiles[y][x];
        if (t === 7 || t === 8 || t === 13 || t === 14 || t === 15 || t === 16) {
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const ny = y + dy;
              const nx = x + dx;
              if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
                isNearRoad[ny][nx] = true;
              }
            }
          }
        }
      }
    }

    // 3. Apply Biome-Specific Environment Grammars
    for (let y = 2; y < H - 2; y++) {
      for (let x = 2; x < W - 2; x++) {
        // Skip water, cliffs, existing structures, and road centers
        if (layers.collision[y][x] || layers.terrainTiles[y][x] !== 0) continue;

        const biome = biomes[y][x];
        const nearRoad = isNearRoad[y][x];
        const roll = rng.next();

        if (biome === 'deepwood') {
          this.applyDeepwoodGrammar(x, y, forestDensity[y][x], nearRoad, roll, layers);
        } else if (biome === 'forest') {
          this.applyForestGrammar(x, y, forestDensity[y][x], nearRoad, roll, layers);
        } else if (biome === 'mountain' || biome === 'mountain_pass') {
          this.applyMountainGrammar(x, y, elevation[y][x], mountainRockDensity[y][x], nearRoad, roll, layers);
        } else if (biome === 'beach' || biome === 'coastal_rock') {
          this.applyCoastalGrammar(x, y, nearRoad, roll, layers);
        } else if (biome === 'grassland') {
          this.applyMeadowGrammar(x, y, meadowFloraDensity[y][x], nearRoad, roll, layers);
        }
      }
    }
  }

  /**
   * Deepwood Gloom Grammar:
   * Primeval dense pines, bioluminescent mushroom rings, mossy boulders, and dark fairy glades.
   */
  private static applyDeepwoodGrammar(
    x: number,
    y: number,
    density: number,
    nearRoad: boolean,
    roll: number,
    layers: EnvironmentLayers
  ): void {
    if (nearRoad) {
      // Trailside verge in deep forest: glowing mushrooms and ferns
      if (roll < 0.15 && layers.lowerObjectTiles[y][x] === 0) {
        layers.lowerObjectTiles[y][x] = 41; // Bioluminescent Mushroom
      }
      return;
    }

    // High density zone: Dense Pine Groves
    if (density > 0.45) {
      if (roll < 0.35 && layers.lowerObjectTiles[y][x] === 0 && layers.upperObjectTiles[y - 1][x] === 0) {
        layers.upperObjectTiles[y - 1][x] = 37; // Pine Top
        layers.lowerObjectTiles[y][x] = 38;     // Pine Trunk
        layers.collision[y][x] = true;
      }
    } else if (density < 0.25) {
      // Secluded Fairy Clearing
      if (roll < 0.12 && layers.lowerObjectTiles[y][x] === 0) {
        layers.lowerObjectTiles[y][x] = 78; // Fairy Mushroom Ring
      } else if (roll < 0.22 && layers.lowerObjectTiles[y][x] === 0) {
        layers.lowerObjectTiles[y][x] = 46; // Fallen Mossy Log
        layers.collision[y][x] = true;
      }
    } else {
      // Medium density: Mossy boulders and glowing spores
      if (roll < 0.08 && layers.lowerObjectTiles[y][x] === 0) {
        layers.lowerObjectTiles[y][x] = 42; // Mossy Boulder
        layers.collision[y][x] = true;
      } else if (roll < 0.16 && layers.lowerObjectTiles[y][x] === 0) {
        layers.lowerObjectTiles[y][x] = 41; // Glowing Mushroom
      }
    }
  }

  /**
   * Forest (Whispering Weald) Grammar:
   * Volumetric oak canopies, sunlit clearings, berry bushes, and wildflowers.
   */
  private static applyForestGrammar(
    x: number,
    y: number,
    density: number,
    nearRoad: boolean,
    roll: number,
    layers: EnvironmentLayers
  ): void {
    if (nearRoad) {
      // Roadside verge: Wildflowers and low shrubs for framing
      if (roll < 0.18 && layers.lowerObjectTiles[y][x] === 0) {
        layers.lowerObjectTiles[y][x] = 39; // Wildflowers
      } else if (roll < 0.28 && layers.lowerObjectTiles[y][x] === 0) {
        layers.lowerObjectTiles[y][x] = 40; // Berry Bush
      }
      return;
    }

    // High Density: Oak Groves & Birches
    if (density > 0.48) {
      if (roll < 0.32 && layers.lowerObjectTiles[y][x] === 0 && layers.upperObjectTiles[y - 1][x] === 0) {
        if (roll < 0.24) {
          layers.upperObjectTiles[y - 1][x] = 35; // Oak Canopy
          layers.lowerObjectTiles[y][x] = 36;     // Oak Trunk
        } else {
          layers.upperObjectTiles[y - 1][x] = 44; // Golden Birch Top
          layers.lowerObjectTiles[y][x] = 45;     // Birch Trunk
        }
        layers.collision[y][x] = true;
      }
    } else if (density < 0.28) {
      // Sunlit Meadow Clearing
      if (roll < 0.25 && layers.lowerObjectTiles[y][x] === 0) {
        layers.lowerObjectTiles[y][x] = 39; // Wildflowers
      } else if (roll < 0.35 && layers.lowerObjectTiles[y][x] === 0) {
        layers.lowerObjectTiles[y][x] = 40; // Shrub
      }
    } else {
      // Moderate forest: Solitary trees, logs, and bushes
      if (roll < 0.12 && layers.lowerObjectTiles[y][x] === 0 && layers.upperObjectTiles[y - 1][x] === 0) {
        layers.upperObjectTiles[y - 1][x] = 35;
        layers.lowerObjectTiles[y][x] = 36;
        layers.collision[y][x] = true;
      } else if (roll < 0.18 && layers.lowerObjectTiles[y][x] === 0) {
        layers.lowerObjectTiles[y][x] = 46; // Fallen Log
        layers.collision[y][x] = true;
      }
    }
  }

  /**
   * Mountain & Alpine High Pass Grammar:
   * Jagged scree, sparse hardy pines, amethyst crystal veins, and weathered rock cairns.
   */
  private static applyMountainGrammar(
    x: number,
    y: number,
    elev: number,
    rockDensity: number,
    nearRoad: boolean,
    roll: number,
    layers: EnvironmentLayers
  ): void {
    if (nearRoad) {
      // Mountain road verge: loose scree and milestone cairns
      if (roll < 0.12 && layers.lowerObjectTiles[y][x] === 0) {
        layers.lowerObjectTiles[y][x] = 48; // Loose Scree
      }
      return;
    }

    if (rockDensity > 0.5) {
      // Heavy Scree Field / Rock Outcrop
      if (roll < 0.22 && layers.lowerObjectTiles[y][x] === 0) {
        layers.lowerObjectTiles[y][x] = 42; // Highland Boulder
        layers.collision[y][x] = true;
      } else if (roll < 0.35 && layers.lowerObjectTiles[y][x] === 0) {
        layers.lowerObjectTiles[y][x] = 48; // Jagged Scree
      } else if (roll < 0.40 && layers.lowerObjectTiles[y][x] === 0) {
        layers.lowerObjectTiles[y][x] = 76; // Amethyst Crystal Cluster
      }
    } else if (elev < 0.82) {
      // Sub-alpine tree line
      if (roll < 0.10 && layers.lowerObjectTiles[y][x] === 0 && layers.upperObjectTiles[y - 1][x] === 0) {
        layers.upperObjectTiles[y - 1][x] = 37; // Alpine Pine
        layers.lowerObjectTiles[y][x] = 38;
        layers.collision[y][x] = true;
      }
    }
  }

  /**
   * Coastal Shoreline & Dunes Grammar:
   * Dune verges, tidal pools with sea anemones, driftwood, and kelp racks.
   */
  private static applyCoastalGrammar(
    x: number,
    y: number,
    nearRoad: boolean,
    roll: number,
    layers: EnvironmentLayers
  ): void {
    if (nearRoad) return;

    if (roll < 0.06 && layers.lowerObjectTiles[y][x] === 0) {
      layers.lowerObjectTiles[y][x] = 49; // Tidal Pool
    } else if (roll < 0.10 && layers.lowerObjectTiles[y][x] === 0) {
      layers.lowerObjectTiles[y][x] = 42; // Coastal Rock
      layers.collision[y][x] = true;
    } else if (roll < 0.13 && layers.lowerObjectTiles[y][x] === 0) {
      layers.lowerObjectTiles[y][x] = 67; // Anchor & Ropes
    }
  }

  /**
   * Grassland / Meadow & Farmland Fringe Grammar:
   * Rustic wooden post-and-rail fences, clustered flower meadows, and solitary shade trees.
   */
  private static applyMeadowGrammar(
    x: number,
    y: number,
    floraDensity: number,
    nearRoad: boolean,
    roll: number,
    layers: EnvironmentLayers
  ): void {
    if (nearRoad) {
      // Roadside: Planter boxes, stone benches, or signposts
      if (roll < 0.08 && layers.lowerObjectTiles[y][x] === 0) {
        layers.lowerObjectTiles[y][x] = 68; // Planter Box
      } else if (roll < 0.16 && layers.lowerObjectTiles[y][x] === 0) {
        layers.lowerObjectTiles[y][x] = 39; // Wildflowers
      }
      return;
    }

    if (floraDensity > 0.52) {
      // Wildflower Meadow Patch
      if (roll < 0.38 && layers.lowerObjectTiles[y][x] === 0) {
        layers.lowerObjectTiles[y][x] = 39; // Wildflowers
      } else if (roll < 0.48 && layers.lowerObjectTiles[y][x] === 0) {
        layers.lowerObjectTiles[y][x] = 40; // Bush
      }
    } else if (floraDensity < 0.22) {
      // Cultivated Farmland Fringe (Rustic fence lines)
      if (roll < 0.12 && layers.lowerObjectTiles[y][x] === 0) {
        layers.lowerObjectTiles[y][x] = 47; // Post-and-rail fence
        layers.collision[y][x] = true;
      }
    } else {
      // Open Countryside: Occasional solitary stately oak
      if (roll < 0.03 && layers.lowerObjectTiles[y][x] === 0 && layers.upperObjectTiles[y - 1][x] === 0) {
        layers.upperObjectTiles[y - 1][x] = 35; // Oak Canopy
        layers.lowerObjectTiles[y][x] = 36;     // Oak Trunk
        layers.collision[y][x] = true;
      }
    }
  }
}
