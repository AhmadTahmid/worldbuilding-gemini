import { Settlement } from '@/types/world';
import { TerrainData } from './TerrainGenerator';
import { SeedRandom } from './SeedRandom';

export class SettlementSynthesizer {
  public static synthesize(settlements: Settlement[], terrain: TerrainData, rng: SeedRandom): void {
    for (const s of settlements) {
      if (s.id === 'settlement_crownport') {
        this.synthesizeCrownport(s, terrain, rng);
      } else if (s.id === 'settlement_oakhaven') {
        this.synthesizeOakhaven(s, terrain, rng);
      } else if (s.id === 'settlement_tidebreak') {
        this.synthesizeTidebreak(s, terrain, rng);
      } else if (s.id === 'settlement_cragwatch') {
        this.synthesizeCragwatch(s, terrain, rng);
      }
    }
  }

  /**
   * Builds the Grand City of Crownport
   */
  private static synthesizeCrownport(s: Settlement, terrain: TerrainData, _rng: SeedRandom): void {
    const { bounds } = s;

    // 1. Paved city plaza & esplanades
    for (let y = bounds.y; y < bounds.y + bounds.height; y++) {
      for (let x = bounds.x; x < bounds.x + bounds.width; x++) {
        if (terrain.groundTiles[y][x] !== 1) { // not deep ocean
          terrain.terrainTiles[y][x] = 8; // Cobblestone
          terrain.lowerObjectTiles[y][x] = 0;
          terrain.upperObjectTiles[y][x] = 0;
          terrain.collision[y][x] = false;
        }
      }
    }

    // 2. Coastal Stone Quays & Wooden Docks (South-East edge: x: 195-210, y: 120-135)
    for (let x = 190; x <= 208; x++) {
      terrain.terrainTiles[128][x] = 16; // Stone Quay Wall
      terrain.collision[128][x] = false;
    }
    // Wooden piers extending into water
    for (let py = 129; py <= 138; py++) {
      for (let px of [193, 194, 201, 202]) {
        terrain.terrainTiles[py][px] = 15; // Wooden Pier
        terrain.collision[py][px] = false;
      }
    }

    // 3. Central Grand Plaza Features
    // Great Clocktower at center (180, 110)
    this.buildHouse(terrain, 178, 106, 5, 4, 20, 24, true);
    terrain.lowerObjectTiles[109][180] = 63; // Clocktower Gear Motif

    // City Fountain / Stone Well & Lampposts
    terrain.lowerObjectTiles[112][180] = 54; // Well
    terrain.collision[112][180] = true;

    // Lampposts around plaza
    const lamps = [
      { x: 174, y: 108 },
      { x: 186, y: 108 },
      { x: 174, y: 114 },
      { x: 186, y: 114 },
      { x: 165, y: 98 },
      { x: 195, y: 98 },
    ];
    for (const lamp of lamps) {
      terrain.lowerObjectTiles[lamp.y][lamp.x] = 53; // Lamp post
      terrain.collision[lamp.y][lamp.x] = true;
    }

    // Market Stalls in North Plaza (172-188, 100-104)
    terrain.lowerObjectTiles[101][174] = 61; // Stall 1
    terrain.collision[101][174] = true;
    terrain.lowerObjectTiles[101][178] = 61; // Stall 2
    terrain.collision[101][178] = true;
    terrain.lowerObjectTiles[101][184] = 61; // Stall 3
    terrain.collision[101][184] = true;

    // Barrels and Crates
    terrain.lowerObjectTiles[129][192] = 50;
    terrain.lowerObjectTiles[129][195] = 51;
    terrain.lowerObjectTiles[130][203] = 50;

    // 4. Grand City Buildings (Admiralty Hall, Guilds, Residences)
    this.buildHouse(terrain, 158, 92, 7, 5, 20, 24); // Admiralty Headquarters
    this.buildHouse(terrain, 192, 92, 6, 5, 20, 24); // Merchant Guildhall
    this.buildHouse(terrain, 158, 116, 6, 4, 20, 24); // West Residential
    this.buildHouse(terrain, 172, 122, 5, 4, 20, 24); // Dockmaster Office
  }

  /**
   * Builds the Forest Village of Oakhaven
   */
  private static synthesizeOakhaven(s: Settlement, terrain: TerrainData, _rng: SeedRandom): void {
    const { center } = s;

    // Central Village Green (Lush grass with dirt clearing)
    for (let y = center.y - 8; y <= center.y + 8; y++) {
      for (let x = center.x - 8; x <= center.x + 8; x++) {
        if (Math.hypot(x - center.x, y - center.y) < 7) {
          terrain.terrainTiles[y][x] = 7; // Dirt clearing
          terrain.lowerObjectTiles[y][x] = 0;
          terrain.upperObjectTiles[y][x] = 0;
          terrain.collision[y][x] = false;
        }
      }
    }

    // Elder Oak in center
    terrain.upperObjectTiles[center.y - 1][center.x] = 35;
    terrain.lowerObjectTiles[center.y][center.x] = 36;
    terrain.collision[center.y][center.x] = true;

    // Ancient Freshwater Well
    terrain.lowerObjectTiles[center.y + 2][center.x] = 54;
    terrain.collision[center.y + 2][center.x] = true;

    // Timber Cottages with Thatch Roofs
    this.buildHouse(terrain, center.x - 14, center.y - 10, 5, 4, 21, 25); // Healer Maeve's Apothecary
    this.buildHouse(terrain, center.x + 8, center.y - 10, 6, 4, 21, 25);  // Great Hearth Inn
    this.buildHouse(terrain, center.x - 12, center.y + 6, 5, 4, 21, 25);  // Woodcutter Lodge
    this.buildHouse(terrain, center.x + 8, center.y + 6, 5, 4, 21, 25);   // Warden Garrison

    // Apothecary Garden (Flowers & herbs around Maeve's)
    terrain.lowerObjectTiles[center.y - 6][center.x - 13] = 39;
    terrain.lowerObjectTiles[center.y - 6][center.x - 12] = 40;
    terrain.lowerObjectTiles[center.y - 6][center.x - 11] = 39;
    terrain.lowerObjectTiles[center.y - 5][center.x - 13] = 41; // Glowing herb

    // Village Campfire
    terrain.lowerObjectTiles[center.y - 2][center.x + 3] = 60;
  }

  /**
   * Builds the Fishing Village of Tidebreak
   */
  private static synthesizeTidebreak(s: Settlement, terrain: TerrainData, _rng: SeedRandom): void {
    const { center } = s;

    // Wooden Pier Platform Network (48-84, 180-212)
    for (let y = 180; y <= 212; y++) {
      for (let x = 48; x <= 84; x++) {
        terrain.terrainTiles[y][x] = 15; // Wooden Pier Planks
        terrain.lowerObjectTiles[y][x] = 0;
        terrain.upperObjectTiles[y][x] = 0;
        terrain.collision[y][x] = false;
      }
    }

    // Weathered Stilt Houses
    this.buildHouse(terrain, center.x - 8, center.y - 7, 5, 4, 22, 25); // Old Salty's Tavern
    this.buildHouse(terrain, center.x + 4, center.y - 7, 5, 4, 22, 25); // Fisherman Hut
    this.buildHouse(terrain, center.x - 8, center.y + 3, 5, 4, 22, 25); // Net Repair Shed

    // The Ancient Beacon Lighthouse (x: 52, y: 184)
    this.buildHouse(terrain, 52, 184, 5, 5, 20, 24, true);
    // Doorstep at (54, 189) is walkable
    terrain.lowerObjectTiles[188][54] = 27; // Door
    terrain.lowerObjectTiles[189][54] = 53; // Lighthouse Lamp
    terrain.collision[189][54] = false;

    // Shoreline Shipwreck & Fish Barrels
    terrain.lowerObjectTiles[205][76] = 62; // Shipwreck Keel
    terrain.lowerObjectTiles[204][72] = 50; // Barrels
    terrain.lowerObjectTiles[205][73] = 50;
    terrain.lowerObjectTiles[195][65] = 52; // Signpost
  }

  /**
   * Builds the Mountain Stronghold of Cragwatch
   */
  private static synthesizeCragwatch(s: Settlement, terrain: TerrainData, _rng: SeedRandom): void {
    const { center } = s;

    // Paved slate road network
    for (let y = center.y - 8; y <= center.y + 8; y++) {
      for (let x = center.x - 8; x <= center.x + 8; x++) {
        terrain.terrainTiles[y][x] = 9; // Mountain Slate
        terrain.lowerObjectTiles[y][x] = 0;
        terrain.upperObjectTiles[y][x] = 0;
        terrain.collision[y][x] = false;
      }
    }

    // Slate stone buildings
    this.buildHouse(terrain, center.x - 10, center.y - 8, 5, 4, 23, 24); // Mining Guildhall
    this.buildHouse(terrain, center.x + 5, center.y - 8, 6, 4, 23, 24);  // Smelter Workshop
    this.buildHouse(terrain, center.x - 10, center.y + 4, 5, 4, 23, 24); // Miner's Rest Bunkhouse
    this.buildHouse(terrain, center.x + 5, center.y + 4, 5, 4, 23, 24);  // Forge & Anvil

    // Smelter Chimney with smoke
    terrain.lowerObjectTiles[center.y - 9][center.x + 8] = 30; // Chimney

    // High Forge Embers / Fire
    terrain.lowerObjectTiles[center.y + 6][center.x + 8] = 60;

    // Mine Shaft Portal (x: 220, y: 44)
    terrain.lowerObjectTiles[44][220] = 59; // Cave Entrance Portal
    terrain.collision[44][220] = false; // Walkable into cave
  }

  /**
   * Helper: Builds a rectangular building footprint with roof, walls, doors, and windows
   */
  private static buildHouse(
    terrain: TerrainData,
    bx: number,
    by: number,
    w: number,
    h: number,
    wallTile: number,
    roofTile: number,
    _isTower = false
  ): void {
    for (let y = by; y < by + h; y++) {
      for (let x = bx; x < bx + w; x++) {
        // Upper roof layer
        if (y < by + Math.floor(h / 2) + 1) {
          terrain.upperObjectTiles[y][x] = roofTile;
        } else {
          // Wall layer
          terrain.lowerObjectTiles[y][x] = wallTile;
        }

        // Collision for the entire building body
        terrain.collision[y][x] = true;
      }
    }

    // Place Front Door in bottom center
    const doorX = bx + Math.floor(w / 2);
    const doorY = by + h - 1;
    terrain.lowerObjectTiles[doorY][doorX] = 27; // Door
    terrain.collision[doorY][doorX] = false; // Walkable doorstep

    // Place Windows on left and right of door
    if (w >= 4) {
      if (doorX - 1 >= bx) terrain.lowerObjectTiles[doorY][doorX - 1] = 28;
      if (doorX + 1 < bx + w) terrain.lowerObjectTiles[doorY][doorX + 1] = 28;
    }
  }
}
