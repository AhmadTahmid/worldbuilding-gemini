import { Settlement } from '@/types/world';
import { TerrainData } from './TerrainGenerator';
import { SeedRandom } from './SeedRandom';

export interface ArchitectureTileSet {
  pavementTile: number;
  wallTile: number;
  roofTile: number;
  doorTile: number;
  windowTile: number;
  fenceTile: number;
}

/**
 * SettlementMorphology.ts
 * Reusable, grammar-driven settlement synthesis engine that builds organic,
 * identity-rich towns and cities based purely on semantic settlement specifications.
 */
export class SettlementMorphology {
  /**
   * Main entry point for synthesizing a settlement
   */
  public static synthesizeSettlement(s: Settlement, terrain: TerrainData, rng: SeedRandom): void {
    const tileset = this.getArchitectureTileSet(s.architectureStyle);
    const pattern = s.settlementPattern || 'grid_urban';

    switch (pattern) {
      case 'grid_urban':
        this.synthesizeGridUrbanCity(s, tileset, terrain, rng);
        break;
      case 'radial_green':
        this.synthesizeRadialGreenVillage(s, tileset, terrain, rng);
        break;
      case 'linear_pier':
        this.synthesizeLinearPierVillage(s, tileset, terrain, rng);
        break;
      case 'terrace_mountain':
        this.synthesizeTerraceMountainTown(s, tileset, terrain, rng);
        break;
    }
  }

  /**
   * Resolves tileset theme based on architectural style
   */
  private static getArchitectureTileSet(style: Settlement['architectureStyle']): ArchitectureTileSet {
    switch (style) {
      case 'grand_stone':
        return {
          pavementTile: 8,  // Cobblestone
          wallTile: 24,     // Ashlar Stone Wall
          roofTile: 20,     // Slate Blue Roof
          doorTile: 28,     // Arched Oak Door
          windowTile: 29,   // Glazed Glass Window
          fenceTile: 68,    // Planter box / Curb
        };
      case 'timber_thatch':
        return {
          pavementTile: 7,  // Dirt / Loam
          wallTile: 25,     // Half-Timbered Plaster Wall
          roofTile: 21,     // Woven Thatch Roof
          doorTile: 28,     // Arched Oak Door
          windowTile: 29,   // Glass Window
          fenceTile: 47,    // Post-and-Rail Fence
        };
      case 'coastal_wood':
        return {
          pavementTile: 15, // Weathered Pier Planks
          wallTile: 26,     // Weathered Siding
          roofTile: 22,     // Gray Cedar Shingles
          doorTile: 28,     // Arched Door
          windowTile: 29,   // Window
          fenceTile: 72,    // Kelp Rack
        };
      case 'slate_crag':
      default:
        return {
          pavementTile: 9,  // Alpine Slate Floor
          wallTile: 27,     // Dark Slate Wall
          roofTile: 23,     // Dark Alpine Slate Roof
          doorTile: 28,     // Arched Door
          windowTile: 29,   // Window
          fenceTile: 48,    // Scree / Rock
        };
    }
  }

  /**
   * 1. GRID URBAN MORPHOLOGY (Crownport Port Metropolis)
   * Multi-district urban composition: Civic Cathedral Plaza, Market Square, Quayside Docks, Residential Lanes.
   */
  private static synthesizeGridUrbanCity(
    s: Settlement,
    t: ArchitectureTileSet,
    terrain: TerrainData,
    _rng: SeedRandom
  ): void {
    const { bounds, center } = s;

    // 1. Pave the urban district footprint with cobblestones
    for (let y = bounds.y; y < bounds.y + bounds.height; y++) {
      for (let x = bounds.x; x < bounds.x + bounds.width; x++) {
        // Skip deep water
        if (terrain.groundTiles[y][x] !== 1) {
          terrain.terrainTiles[y][x] = t.pavementTile;
          terrain.lowerObjectTiles[y][x] = 0;
          terrain.upperObjectTiles[y][x] = 0;
          terrain.collision[y][x] = false;
        }
      }
    }

    // 2. CIVIC DISTRICT: The Great Clocktower, Fountain & Iron Lanterns
    // Monumental Clocktower at center
    this.buildBuilding(terrain, center.x - 3, center.y - 5, 7, 5, t, true);
    terrain.lowerObjectTiles[center.y - 2][center.x] = 63; // Celestial Clock Dial Motif

    // City Fountain at (center.x, center.y + 2)
    terrain.lowerObjectTiles[center.y + 2][center.x] = 55; // Marble Fountain
    terrain.collision[center.y + 2][center.x] = true;

    // Plaza Park Benches & Lanterns
    const plazaProps = [
      { x: center.x - 5, y: center.y - 2, tile: 53 }, // Lantern
      { x: center.x + 5, y: center.y - 2, tile: 53 }, // Lantern
      { x: center.x - 5, y: center.y + 2, tile: 53 }, // Lantern
      { x: center.x + 5, y: center.y + 2, tile: 53 }, // Lantern
      { x: center.x - 3, y: center.y + 2, tile: 69 }, // Stone Bench
      { x: center.x + 3, y: center.y + 2, tile: 69 }, // Stone Bench
      { x: center.x - 2, y: center.y + 4, tile: 68 }, // Flowerbox
      { x: center.x + 2, y: center.y + 4, tile: 68 }, // Flowerbox
    ];
    for (const p of plazaProps) {
      terrain.lowerObjectTiles[p.y][p.x] = p.tile;
      if (p.tile === 53 || p.tile === 69) terrain.collision[p.y][p.x] = true;
    }

    // 3. MARKET SQUARE DISTRICT (North Plaza)
    const marketStalls = [
      { x: center.x - 6, y: center.y - 9, tile: 59 }, // Blue stall
      { x: center.x - 2, y: center.y - 9, tile: 60 }, // Red stall
      { x: center.x + 4, y: center.y - 9, tile: 59 }, // Blue stall
    ];
    for (const m of marketStalls) {
      terrain.lowerObjectTiles[m.y][m.x] = m.tile;
      terrain.collision[m.y][m.x] = true;
    }
    // Crates and Barrels in market
    terrain.lowerObjectTiles[center.y - 8][center.x - 7] = 50; // Barrel
    terrain.lowerObjectTiles[center.y - 8][center.x + 6] = 51; // Crate

    // 4. QUAYSIDE DOCKS & WATERFRONT DISTRICT (South-East edge)
    for (let qx = bounds.x + 35; qx <= bounds.x + bounds.width - 2; qx++) {
      terrain.terrainTiles[center.y + 18][qx] = 16; // Stone Harbor Quay Wall
    }
    // Wooden piers extending into the sea
    for (let py = center.y + 19; py <= center.y + 28; py++) {
      for (const px of [bounds.x + 38, bounds.x + 39, bounds.x + 46, bounds.x + 47]) {
        if (py < terrain.height && px < terrain.width) {
          terrain.terrainTiles[py][px] = 15; // Wooden Pier
          terrain.collision[py][px] = false;
        }
      }
    }
    // Ship Anchor & Cargo
    terrain.lowerObjectTiles[center.y + 19][bounds.x + 37] = 67; // Anchor
    terrain.lowerObjectTiles[center.y + 19][bounds.x + 40] = 50; // Barrel
    terrain.lowerObjectTiles[center.y + 20][bounds.x + 45] = 51; // Crate

    // 5. CIVIC GUILDS & RESIDENTIAL QUARTERS (Distinct Large City Buildings)
    this.buildBuilding(terrain, bounds.x + 8, bounds.y + 7, 8, 5, t);   // Admiralty Headquarters
    this.buildBuilding(terrain, bounds.x + 42, bounds.y + 7, 7, 5, t);  // Merchant Guildhall
    this.buildBuilding(terrain, bounds.x + 8, bounds.y + 28, 6, 4, t);  // West Residential
    this.buildBuilding(terrain, bounds.x + 22, bounds.y + 32, 6, 4, t); // Dockmaster Office
  }

  /**
   * 2. RADIAL GREEN MORPHOLOGY (Oakhaven Forest Sanctuary)
   * Organic circular village green around the 500-year-old Elder Oak with gardens and rustic timber cottages.
   */
  private static synthesizeRadialGreenVillage(
    s: Settlement,
    t: ArchitectureTileSet,
    terrain: TerrainData,
    _rng: SeedRandom
  ): void {
    const { center } = s;

    // 1. Central Village Green (Circular dirt clearing)
    for (let y = center.y - 9; y <= center.y + 9; y++) {
      for (let x = center.x - 9; x <= center.x + 9; x++) {
        if (Math.hypot(x - center.x, y - center.y) < 8.5) {
          terrain.terrainTiles[y][x] = t.pavementTile;
          terrain.lowerObjectTiles[y][x] = 0;
          terrain.upperObjectTiles[y][x] = 0;
          terrain.collision[y][x] = false;
        }
      }
    }

    // 2. Elder Oak Tree in center
    terrain.upperObjectTiles[center.y - 1][center.x] = 35; // Large Oak Canopy
    terrain.lowerObjectTiles[center.y][center.x] = 36;     // Trunk Base
    terrain.collision[center.y][center.x] = true;

    // 3. Ancient Stone Well & Village Campfire
    terrain.lowerObjectTiles[center.y + 2][center.x] = 54; // Well
    terrain.collision[center.y + 2][center.x] = true;

    terrain.lowerObjectTiles[center.y - 2][center.x + 3] = 58; // Campfire
    terrain.collision[center.y - 2][center.x + 3] = true;

    // 4. Radial Timber Cottages with Thatch Roofs
    this.buildBuilding(terrain, center.x - 14, center.y - 10, 5, 4, t); // Apothecary (Maeve)
    this.buildBuilding(terrain, center.x + 8, center.y - 10, 6, 4, t);  // Great Hearth Inn
    this.buildBuilding(terrain, center.x - 12, center.y + 6, 5, 4, t);  // Woodcutter Lodge
    this.buildBuilding(terrain, center.x + 8, center.y + 6, 5, 4, t);   // Warden Garrison

    // 5. Apothecary Garden & Rustic Fences
    terrain.lowerObjectTiles[center.y - 6][center.x - 13] = 39; // Wildflowers
    terrain.lowerObjectTiles[center.y - 6][center.x - 12] = 40; // Berry bush
    terrain.lowerObjectTiles[center.y - 6][center.x - 11] = 41; // Glowing medicinal herb
    terrain.lowerObjectTiles[center.y - 5][center.x - 13] = 39;

    // Post-and-rail fences enclosing garden
    terrain.lowerObjectTiles[center.y - 7][center.x - 14] = 47;
    terrain.lowerObjectTiles[center.y - 7][center.x - 10] = 47;
  }

  /**
   * 3. LINEAR PIER MORPHOLOGY (Tidebreak Coastal Fishing Village)
   * Interconnected wooden stilt platforms over coastal breakers with weathered shacks and the Ancient Beacon.
   */
  private static synthesizeLinearPierVillage(
    s: Settlement,
    t: ArchitectureTileSet,
    terrain: TerrainData,
    _rng: SeedRandom
  ): void {
    const { center } = s;

    // 1. Wooden Stilt Pier Platform Network (x: 48-84, y: 180-212)
    for (let y = 180; y <= 212; y++) {
      for (let x = 48; x <= 84; x++) {
        terrain.terrainTiles[y][x] = t.pavementTile; // Wooden Pier Planks
        terrain.lowerObjectTiles[y][x] = 0;
        terrain.upperObjectTiles[y][x] = 0;
        terrain.collision[y][x] = false;
      }
    }

    // 2. Weathered Stilt Houses
    this.buildBuilding(terrain, center.x - 8, center.y - 7, 5, 4, t); // Old Salty's Tavern
    this.buildBuilding(terrain, center.x + 4, center.y - 7, 5, 4, t); // Fisherman Hut
    this.buildBuilding(terrain, center.x - 8, center.y + 3, 5, 4, t); // Net Repair Shed

    // 3. The Ancient Beacon Lighthouse (Promontory Prominence)
    this.buildBuilding(terrain, 52, 184, 5, 5, t, true);
    terrain.lowerObjectTiles[187][54] = 64; // Fresnel Lens Crystal

    // 4. Coastal Fishing Props
    terrain.lowerObjectTiles[center.y - 2][center.x - 9] = 72; // Kelp drying rack
    terrain.lowerObjectTiles[center.y - 2][center.x + 9] = 72; // Kelp drying rack
    terrain.lowerObjectTiles[center.y + 5][center.x + 3] = 67; // Anchor & ropes
    terrain.lowerObjectTiles[center.y + 5][center.x + 5] = 50; // Fish barrel
    terrain.lowerObjectTiles[center.y + 6][center.x + 5] = 51; // Crate
  }

  /**
   * 4. TERRACE MOUNTAIN MORPHOLOGY (Cragwatch Alpine Stronghold)
   * Terraced slate buildings hugging the mountain slope with smelter chimneys and forge yards.
   */
  private static synthesizeTerraceMountainTown(
    s: Settlement,
    t: ArchitectureTileSet,
    terrain: TerrainData,
    _rng: SeedRandom
  ): void {
    const { center } = s;

    // 1. Pave the mountain terrace plateau
    for (let y = center.y - 8; y <= center.y + 8; y++) {
      for (let x = center.x - 8; x <= center.x + 8; x++) {
        terrain.terrainTiles[y][x] = t.pavementTile; // Mountain Slate Flagstone
        terrain.lowerObjectTiles[y][x] = 0;
        terrain.upperObjectTiles[y][x] = 0;
        terrain.collision[y][x] = false;
      }
    }

    // 2. High Peak Smelter Chimney & Forge
    this.buildBuilding(terrain, center.x - 12, center.y - 8, 6, 5, t);
    terrain.lowerObjectTiles[center.y - 6][center.x - 9] = 73; // Smelter Furnace Base
    terrain.lowerObjectTiles[center.y - 4][center.x - 9] = 61; // Anvil & Forge

    // 3. Guild Hall & Miner's Rest Lodge
    this.buildBuilding(terrain, center.x + 6, center.y - 8, 6, 4, t);  // Miner's Rest
    this.buildBuilding(terrain, center.x - 8, center.y + 5, 5, 4, t);  // Blacksmith Quarters
    this.buildBuilding(terrain, center.x + 6, center.y + 5, 6, 4, t);  // Silver Vault

    // 4. Weapons & Tools, Crag Props
    terrain.lowerObjectTiles[center.y - 2][center.x - 5] = 62; // Weapon / Tool Rack
    terrain.lowerObjectTiles[center.y - 2][center.x + 3] = 58; // Warming firepit
    terrain.lowerObjectTiles[center.y + 2][center.x - 2] = 53; // Iron Lantern
    terrain.lowerObjectTiles[center.y + 2][center.x + 2] = 53; // Iron Lantern

    // 5. Rope Gorge Bridge Anchor (x: 220, y: 50)
    terrain.lowerObjectTiles[50][220] = 74; // Gorge Cable Anchor
    terrain.collision[50][220] = true;
  }

  /**
   * Helper: Builds a charming, multi-tile building with layered roof, walls, door, window, and chimney
   */
  public static buildBuilding(
    terrain: TerrainData,
    bx: number,
    by: number,
    w: number,
    h: number,
    t: ArchitectureTileSet,
    isLandmark: boolean = false
  ): void {
    const W = terrain.width;
    const H = terrain.height;

    // Roof: Top rows in upperObjects (for player walking behind roof)
    const roofHeight = Math.max(2, Math.floor(h / 2));
    for (let y = by; y < by + roofHeight; y++) {
      for (let x = bx; x < bx + w; x++) {
        if (x >= 0 && x < W && y >= 0 && y < H) {
          terrain.upperObjectTiles[y][x] = t.roofTile;
        }
      }
    }

    // Walls: Lower rows in lowerObjects with solid collision
    for (let y = by + roofHeight; y < by + h; y++) {
      for (let x = bx; x < bx + w; x++) {
        if (x >= 0 && x < W && y >= 0 && y < H) {
          terrain.lowerObjectTiles[y][x] = t.wallTile;
          terrain.collision[y][x] = true;
        }
      }
    }

    // Windows on wall
    const midX = bx + Math.floor(w / 2);
    const wallY = by + roofHeight;
    if (w >= 5 && midX - 1 >= 0 && midX + 1 < W && wallY < H) {
      terrain.lowerObjectTiles[wallY][midX - 1] = t.windowTile;
      terrain.lowerObjectTiles[wallY][midX + 1] = t.windowTile;
    }

    // Doorway in center bottom
    const doorY = by + h - 1;
    if (midX >= 0 && midX < W && doorY >= 0 && doorY < H) {
      terrain.lowerObjectTiles[doorY][midX] = t.doorTile;
      terrain.collision[doorY][midX] = false; // Doorstep is walkable
    }

    // Chimney with smoke on left or right roof
    if (!isLandmark && bx + 1 < W && by >= 0 && by < H) {
      terrain.upperObjectTiles[by][bx + 1] = 33; // Chimney with smoke
    }
  }
}
