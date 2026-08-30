/**
 * TileAtlasGenerator.ts
 * Generates a cohesive, beautiful 16x16 pixel-art tileset texture atlas and character spritesheets
 * entirely using HTML Canvas with rich palettes, multi-tone shading, volumetric lighting, and autotiling transitions.
 * 100% CC0 Public Domain.
 */

export class TileAtlasGenerator {
  public static readonly TILE_SIZE = 16;
  public static readonly ATLAS_COLS = 16;
  public static readonly ATLAS_ROWS = 16;

  /**
   * Generates the master tileset canvas
   */
  public static generateTilesetCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = this.ATLAS_COLS * this.TILE_SIZE;
    canvas.height = this.ATLAS_ROWS * this.TILE_SIZE;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Could not create 2D context for tileset canvas');

    ctx.imageSmoothingEnabled = false;

    // Draw all 128 tile definitions
    for (let id = 0; id < 128; id++) {
      const col = id % this.ATLAS_COLS;
      const row = Math.floor(id / this.ATLAS_COLS);
      const x = col * this.TILE_SIZE;
      const y = row * this.TILE_SIZE;

      this.drawTile(ctx, id, x, y);
    }

    return canvas;
  }

  /**
   * Generates character spritesheet canvas (12 character classes x 4 directions x 3 animation frames)
   */
  public static generateCharactersCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 16 * 12 * 3; // 12 characters * 3 animation frames
    canvas.height = 16 * 4;     // 4 directions (Down, Left, Right, Up)
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Could not create 2D context for character canvas');

    ctx.imageSmoothingEnabled = false;

    // Curated JRPG Character palettes: [hair, skin, tunic/main, pants/trim, detail/hat]
    const palettes = [
      ['#4a3728', '#ffd8b5', '#2563eb', '#1e293b', '#60a5fa'], // 0: Player Traveler (Royal blue cloak & scarf)
      ['#1e293b', '#f8c291', '#dc2626', '#334155', '#fbbf24'], // 1: Tideguard Knight (Steel & scarlet with gold crest)
      ['#713f12', '#f6d8ae', '#15803d', '#3f2e18', '#86efac'], // 2: Forest Warden (Forest green tunic & leather)
      ['#334155', '#f3c68f', '#0284c7', '#1e293b', '#f8fafc'], // 3: Mariner Pilot (Nautical navy & white)
      ['#1f2937', '#e5b887', '#ea580c', '#451a03', '#facc15'], // 4: Cragwatch Miner (Heavy apron & brass helmet)
      ['#e2e8f0', '#fbd5c0', '#7c3aed', '#3b0764', '#c084fc'], // 5: High Scholar (Amethyst robe & silver beard)
      ['#9a3412', '#fde047', '#059669', '#14532d', '#f43f5e'], // 6: Herbalist Maeve (Emerald gown with red wild rose)
      ['#1d4ed8', '#fcd5b5', '#ca8a04', '#713f12', '#fef08a'], // 7: Guild Merchant (Opulent saffron & velvet)
      ['#4338ca', '#fcd5b5', '#4f46e5', '#312e81', '#38bdf8'], // 8: Clockmaker (Indigo apron with brass goggles)
      ['#64748b', '#e2e8f0', '#94a3b8', '#0f172a', '#38bdf8'], // 9: Pale Spectral Captain (Ethereal mist hue)
      ['#14532d', '#fcd5b5', '#166534', '#1e293b', '#a7f3d0'], // 10: Ancient Weald Druid (Verdant leaf mantle)
      ['#78350f', '#fcd5b5', '#b45309', '#451a03', '#fef3c7'], // 11: Tavern Keeper (Warm cider apron)
    ];

    for (let c = 0; c < palettes.length; c++) {
      const palette = palettes[c];
      for (let dir = 0; dir < 4; dir++) { // 0: Down, 1: Left, 2: Right, 3: Up
        for (let frame = 0; frame < 3; frame++) {
          const colIndex = c * 3 + frame;
          const x = colIndex * 16;
          const y = dir * 16;
          this.drawCharacterSprite(ctx, x, y, dir, frame, palette);
        }
      }
    }

    return canvas;
  }

  /**
   * Master Tile Drawing Method
   */
  private static drawTile(ctx: CanvasRenderingContext2D, id: number, x: number, y: number): void {
    const S = this.TILE_SIZE;

    switch (id) {
      // -------------------------------------------------------------
      // 0-19: Base Ground, Waters, Shorelines, Paths, Bridges
      // -------------------------------------------------------------
      case 0: // Void / Transparent
        ctx.clearRect(x, y, S, S);
        break;

      case 1: // Deep Ocean: Rich blue with gentle waves
        ctx.fillStyle = '#0f2b48';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#163d66';
        ctx.fillRect(x + 2, y + 3, 5, 1);
        ctx.fillRect(x + 9, y + 10, 6, 1);
        ctx.fillStyle = '#22578c';
        ctx.fillRect(x + 3, y + 4, 3, 1);
        ctx.fillRect(x + 11, y + 11, 2, 1);
        break;

      case 2: // Shallow Coast: Vibrant tropical aquamarine with light refraction
        ctx.fillStyle = '#1b6785';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#278ca6';
        ctx.fillRect(x + 1, y + 2, 6, 2);
        ctx.fillRect(x + 8, y + 8, 7, 2);
        ctx.fillStyle = '#4cc9f0';
        ctx.fillRect(x + 3, y + 3, 3, 1);
        ctx.fillRect(x + 10, y + 9, 3, 1);
        break;

      case 3: // Shoreline Water Foam
        ctx.fillStyle = '#1b6785';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#4cc9f0';
        ctx.fillRect(x, y + 1, S, 4);
        ctx.fillStyle = '#f0f9ff';
        ctx.fillRect(x + 1, y + 2, 4, 2);
        ctx.fillRect(x + 7, y + 1, 5, 2);
        ctx.fillRect(x + 13, y + 3, 2, 1);
        break;

      case 4: // Warm Sand Beach: Golden dunes with texture grains
        ctx.fillStyle = '#d9b675';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#c7a362';
        ctx.fillRect(x + 2, y + 3, 2, 1);
        ctx.fillRect(x + 9, y + 7, 2, 1);
        ctx.fillRect(x + 5, y + 12, 2, 1);
        ctx.fillStyle = '#f2d79d';
        ctx.fillRect(x + 3, y + 4, 1, 1);
        ctx.fillRect(x + 11, y + 8, 1, 1);
        ctx.fillRect(x + 14, y + 2, 1, 1);
        break;

      case 5: // Lush Meadow Grass: Rich emerald greens with layered blades
        ctx.fillStyle = '#418a38';
        ctx.fillRect(x, y, S, S);
        // Highlight tufts
        ctx.fillStyle = '#5fb84d';
        ctx.fillRect(x + 2, y + 3, 2, 3);
        ctx.fillRect(x + 9, y + 8, 2, 3);
        ctx.fillRect(x + 13, y + 2, 1, 2);
        // Shadow tufts
        ctx.fillStyle = '#2f6927';
        ctx.fillRect(x + 2, y + 6, 2, 1);
        ctx.fillRect(x + 9, y + 11, 2, 1);
        ctx.fillRect(x + 5, y + 13, 2, 1);
        break;

      case 6: // Deepwood Dark Grass: Mystical deep teal-green with moss specks
        ctx.fillStyle = '#235229';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#327039';
        ctx.fillRect(x + 3, y + 4, 2, 2);
        ctx.fillRect(x + 10, y + 10, 2, 2);
        ctx.fillStyle = '#143618';
        ctx.fillRect(x + 4, y + 6, 1, 1);
        ctx.fillRect(x + 11, y + 12, 1, 1);
        ctx.fillStyle = '#52b788'; // Spore dot
        ctx.fillRect(x + 7, y + 2, 1, 1);
        break;

      case 7: // Earth Dirt Path: Warm loam with rounded pebbles
        ctx.fillStyle = '#9c6f44';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#7d532f';
        ctx.fillRect(x + 2, y + 4, 3, 2);
        ctx.fillRect(x + 9, y + 11, 4, 2);
        ctx.fillRect(x + 11, y + 3, 2, 1);
        ctx.fillStyle = '#bfa07c'; // Highlight pebbles
        ctx.fillRect(x + 3, y + 3, 1, 1);
        ctx.fillRect(x + 10, y + 10, 1, 1);
        ctx.fillRect(x + 6, y + 8, 1, 1);
        break;

      case 8: // Crownport Cobblestone: Stylized ashlar pavers with beveled highlights
        ctx.fillStyle = '#64748b';
        ctx.fillRect(x, y, S, S);
        // Mortar lines
        ctx.fillStyle = '#334155';
        ctx.fillRect(x, y + 7, S, 1);
        ctx.fillRect(x, y + 15, S, 1);
        ctx.fillRect(x + 7, y, 1, 7);
        ctx.fillRect(x + 3, y + 8, 1, 7);
        ctx.fillRect(x + 11, y + 8, 1, 7);
        // Paver highlight bevels
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(x + 1, y + 1, 6, 1);
        ctx.fillRect(x + 8, y + 1, 7, 1);
        ctx.fillRect(x + 1, y + 9, 2, 1);
        ctx.fillRect(x + 4, y + 9, 6, 1);
        ctx.fillRect(x + 12, y + 9, 3, 1);
        // Paver stone texture
        ctx.fillStyle = '#475569';
        ctx.fillRect(x + 5, y + 5, 2, 2);
        ctx.fillRect(x + 9, y + 13, 2, 2);
        break;

      case 9: // Alpine Slate Stone Floor: Dark cut mountain slate with chisel texture
        ctx.fillStyle = '#475569';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x, y, S, 1);
        ctx.fillRect(x, y, 1, S);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(x + 1, y + 1, S - 2, 1);
        ctx.fillRect(x + 1, y + 1, 1, S - 2);
        ctx.fillStyle = '#334155';
        ctx.fillRect(x + 4, y + 5, 4, 3);
        ctx.fillRect(x + 10, y + 11, 3, 3);
        break;

      case 10: // Cliff Top Edge: Grass mantle with vertical rock shadow
        ctx.fillStyle = '#418a38';
        ctx.fillRect(x, y, S, 6);
        ctx.fillStyle = '#5fb84d';
        ctx.fillRect(x, y, S, 2);
        ctx.fillStyle = '#2f6927';
        ctx.fillRect(x, y + 5, S, 1);
        // Stone face drop
        ctx.fillStyle = '#475569';
        ctx.fillRect(x, y + 6, S, 10);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x, y + 6, S, 2);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(x + 2, y + 9, 3, 4);
        ctx.fillRect(x + 9, y + 8, 4, 5);
        break;

      case 11: // Cliff Wall Mid Face: Heavy textured mountain crags
        ctx.fillStyle = '#475569';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#334155';
        ctx.fillRect(x + 2, y + 2, 5, 8);
        ctx.fillRect(x + 10, y + 5, 4, 9);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(x + 1, y + 1, 3, 2);
        ctx.fillRect(x + 8, y + 4, 3, 2);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x + 6, y + 6, 2, 8);
        break;

      case 12: // Cliff Base / Scree Slope: Rubble debris onto grass
        ctx.fillStyle = '#418a38';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#334155';
        ctx.fillRect(x, y, S, 4);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(x + 2, y + 4, 3, 3);
        ctx.fillRect(x + 9, y + 5, 4, 3);
        ctx.fillRect(x + 6, y + 9, 3, 2);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(x + 3, y + 4, 1, 1);
        ctx.fillRect(x + 10, y + 5, 1, 1);
        break;

      case 13: // Wooden River Bridge (Horizontal): Sturdy oak planks with railings
        // Water underneath
        ctx.fillStyle = '#1b6785';
        ctx.fillRect(x, y, S, S);
        // Bridge Deck
        ctx.fillStyle = '#8b5a2b';
        ctx.fillRect(x, y + 2, S, 12);
        // Planks separation
        ctx.fillStyle = '#5c3a1e';
        for (let px = x; px < x + S; px += 4) {
          ctx.fillRect(px, y + 2, 1, 12);
        }
        // Top & Bottom Railings
        ctx.fillStyle = '#b5793e';
        ctx.fillRect(x, y + 1, S, 2);
        ctx.fillRect(x, y + 13, S, 2);
        ctx.fillStyle = '#45260f';
        ctx.fillRect(x, y + 3, S, 1);
        ctx.fillRect(x, y + 15, S, 1);
        break;

      case 14: // Wooden River Bridge (Vertical)
        ctx.fillStyle = '#1b6785';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#8b5a2b';
        ctx.fillRect(x + 2, y, 12, S);
        ctx.fillStyle = '#5c3a1e';
        for (let py = y; py < y + S; py += 4) {
          ctx.fillRect(x + 2, py, 12, 1);
        }
        ctx.fillStyle = '#b5793e';
        ctx.fillRect(x + 1, y, 2, S);
        ctx.fillRect(x + 13, y, 2, S);
        ctx.fillStyle = '#45260f';
        ctx.fillRect(x + 3, y, 1, S);
        ctx.fillRect(x + 15, y, 1, S);
        break;

      case 15: // Weathered Pier / Boardwalk: Coastal planks over water with pilings
        ctx.fillStyle = '#1b6785';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#7a6652';
        ctx.fillRect(x + 1, y + 1, 14, 14);
        ctx.fillStyle = '#524335';
        ctx.fillRect(x + 1, y + 4, 14, 1);
        ctx.fillRect(x + 1, y + 9, 14, 1);
        ctx.fillRect(x + 1, y + 14, 14, 1);
        ctx.fillStyle = '#a68e77';
        ctx.fillRect(x + 1, y + 1, 14, 1);
        // Rusty nail heads
        ctx.fillStyle = '#3e2e20';
        ctx.fillRect(x + 3, y + 2, 1, 1);
        ctx.fillRect(x + 12, y + 2, 1, 1);
        ctx.fillRect(x + 3, y + 6, 1, 1);
        ctx.fillRect(x + 12, y + 6, 1, 1);
        break;

      case 16: // Stone Quay Wall (Crownport Waterfront)
        ctx.fillStyle = '#475569';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x, y + 14, S, 2);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(x, y, S, 2);
        // Iron Mooring Ring
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x + 7, y + 6, 3, 4);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(x + 8, y + 7, 1, 2);
        break;

      case 17: // Sand / Beach Transition to Grass (Dune verge)
        ctx.fillStyle = '#d9b675';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#418a38';
        ctx.fillRect(x, y, S, 8);
        ctx.fillStyle = '#5fb84d';
        ctx.fillRect(x + 2, y + 7, 3, 2);
        ctx.fillRect(x + 9, y + 7, 4, 3);
        ctx.fillStyle = '#c7a362';
        ctx.fillRect(x + 4, y + 12, 2, 1);
        break;

      case 18: // Dirt Path Transition to Grass (Verge)
        ctx.fillStyle = '#418a38';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#9c6f44';
        ctx.fillRect(x + 3, y + 3, 10, 10);
        ctx.fillStyle = '#7d532f';
        ctx.fillRect(x + 5, y + 5, 6, 6);
        ctx.fillStyle = '#5fb84d';
        ctx.fillRect(x + 2, y + 2, 2, 1);
        ctx.fillRect(x + 12, y + 11, 2, 1);
        break;

      case 19: // River Stepping Stones (Natural crossing)
        ctx.fillStyle = '#1b6785';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(x + 3, y + 3, 10, 10);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(x + 4, y + 4, 8, 4);
        ctx.fillStyle = '#334155';
        ctx.fillRect(x + 4, y + 10, 8, 2);
        // Green lichen patch
        ctx.fillStyle = '#52b788';
        ctx.fillRect(x + 5, y + 5, 3, 2);
        break;

      // -------------------------------------------------------------
      // 20-34: Architecture: Roofs, Walls, Doors, Windows, Details
      // -------------------------------------------------------------
      case 20: // Slate Blue Roof (Crownport City Slate Gable)
        ctx.fillStyle = '#2c4365';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#1d2d44';
        ctx.fillRect(x, y + 14, S, 2);
        ctx.fillStyle = '#415a77';
        ctx.fillRect(x, y, S, 2);
        ctx.fillRect(x + 2, y + 4, 5, 4);
        ctx.fillRect(x + 9, y + 8, 5, 4);
        ctx.fillStyle = '#778da9';
        ctx.fillRect(x + 3, y + 5, 2, 1);
        ctx.fillRect(x + 10, y + 9, 2, 1);
        break;

      case 21: // Woven Thatch Roof (Oakhaven Forest Village)
        ctx.fillStyle = '#c2883f';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#8f5e23';
        ctx.fillRect(x, y + 13, S, 3);
        ctx.fillStyle = '#dfaa5d';
        for (let py = y; py < y + 12; py += 3) {
          ctx.fillRect(x, py, S, 1);
        }
        ctx.fillStyle = '#fae19c';
        ctx.fillRect(x + 2, y + 2, 4, 1);
        ctx.fillRect(x + 9, y + 5, 4, 1);
        break;

      case 22: // Weathered Coastal Shingles (Tidebreak Stilt Shacks)
        ctx.fillStyle = '#6b7280';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#374151';
        ctx.fillRect(x, y + 14, S, 2);
        ctx.fillStyle = '#9ca3af';
        ctx.fillRect(x, y, S, 2);
        ctx.fillRect(x + 3, y + 3, 4, 3);
        ctx.fillRect(x + 9, y + 7, 4, 3);
        break;

      case 23: // Dark Alpine Slate Roof (Cragwatch Mountain Forge)
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x, y + 14, S, 2);
        ctx.fillStyle = '#334155';
        ctx.fillRect(x, y, S, 2);
        ctx.fillRect(x + 2, y + 3, 5, 4);
        ctx.fillRect(x + 9, y + 8, 5, 4);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(x + 3, y + 4, 2, 1);
        ctx.fillRect(x + 10, y + 9, 2, 1);
        break;

      case 24: // Ashlar Granite Wall (Crownport Stone Facade)
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#475569';
        ctx.fillRect(x, y + 7, S, 1);
        ctx.fillRect(x, y + 15, S, 1);
        ctx.fillRect(x + 7, y, 1, 7);
        ctx.fillRect(x + 4, y + 8, 1, 7);
        ctx.fillRect(x + 12, y + 8, 1, 7);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(x + 1, y + 1, 5, 2);
        ctx.fillRect(x + 8, y + 1, 6, 2);
        ctx.fillRect(x + 5, y + 9, 6, 2);
        break;

      case 25: // Half-Timbered Plaster Wall (Oakhaven Timber Cottage)
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(x, y, S, S);
        // Timber beams
        ctx.fillStyle = '#5c3a1e';
        ctx.fillRect(x, y, S, 2);
        ctx.fillRect(x, y + 14, S, 2);
        ctx.fillRect(x, y, 2, S);
        ctx.fillRect(x + 14, y, 2, S);
        // Diagonal timber strut
        for (let i = 2; i < 14; i++) {
          ctx.fillRect(x + i, y + i, 2, 1);
        }
        ctx.fillStyle = '#8b5a2b';
        ctx.fillRect(x + 1, y + 1, S - 2, 1);
        break;

      case 26: // Weathered Wood Wall (Tidebreak Horizontal Siding)
        ctx.fillStyle = '#8a7968';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#4a3d31';
        for (let py = y + 3; py < y + S; py += 4) {
          ctx.fillRect(x, py, S, 1);
        }
        ctx.fillStyle = '#b5a494';
        ctx.fillRect(x, y, S, 1);
        ctx.fillRect(x, y + 4, S, 1);
        ctx.fillRect(x, y + 8, S, 1);
        break;

      case 27: // Dark Slate Wall (Cragwatch Mountain Mining Fortress)
        ctx.fillStyle = '#334155';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x, y + 8, S, 1);
        ctx.fillRect(x, y + 15, S, 1);
        ctx.fillRect(x + 8, y, 1, 8);
        ctx.fillRect(x + 5, y + 8, 1, 7);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(x + 1, y + 1, 6, 2);
        ctx.fillRect(x + 6, y + 9, 7, 2);
        break;

      case 28: // Sturdy Arched Oak Door
        ctx.fillStyle = '#5c3a1e';
        ctx.fillRect(x + 2, y + 1, 12, 15);
        ctx.fillStyle = '#8b5a2b';
        ctx.fillRect(x + 3, y + 2, 10, 13);
        // Arch trim
        ctx.fillStyle = '#334155';
        ctx.fillRect(x + 2, y, 12, 2);
        // Iron studs & handle
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(x + 10, y + 8, 2, 2);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x + 4, y + 4, 1, 1);
        ctx.fillRect(x + 11, y + 4, 1, 1);
        ctx.fillRect(x + 4, y + 12, 1, 1);
        ctx.fillRect(x + 11, y + 12, 1, 1);
        break;

      case 29: // Glazed Glass Window (Day - Sunlight Glass Reflection)
        ctx.fillStyle = '#334155'; // Frame
        ctx.fillRect(x + 3, y + 3, 10, 10);
        ctx.fillStyle = '#38bdf8'; // Glass
        ctx.fillRect(x + 4, y + 4, 8, 8);
        ctx.fillStyle = '#f0f9ff'; // Reflection
        ctx.fillRect(x + 5, y + 5, 2, 4);
        ctx.fillRect(x + 8, y + 5, 2, 2);
        // Window mullion cross
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x + 7, y + 4, 1, 8);
        ctx.fillRect(x + 4, y + 7, 8, 1);
        break;

      case 30: // Lit Glass Window (Warm Hearth Glow)
        ctx.fillStyle = '#334155';
        ctx.fillRect(x + 3, y + 3, 10, 10);
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(x + 4, y + 4, 8, 8);
        ctx.fillStyle = '#fef08a'; // Golden glow
        ctx.fillRect(x + 5, y + 5, 6, 6);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x + 7, y + 4, 1, 8);
        ctx.fillRect(x + 4, y + 7, 8, 1);
        break;

      case 31: // Roof Eaves Border (Gable edge drop shadow)
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x, y, S, 4);
        ctx.fillStyle = '#475569';
        ctx.fillRect(x, y + 4, S, 4);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x, y + 8, S, S - 8);
        break;

      case 32: // Roof Peak / Finial Ridge
        ctx.fillStyle = '#778da9';
        ctx.fillRect(x, y + 10, S, 4);
        ctx.fillStyle = '#1b263b';
        ctx.fillRect(x, y + 14, S, 2);
        ctx.fillStyle = '#e0e1dd';
        ctx.fillRect(x + 6, y + 3, 4, 8);
        ctx.fillRect(x + 7, y + 1, 2, 2);
        break;

      case 33: // Brick Chimney with Smoke Puff
        ctx.fillStyle = '#7f1d1d';
        ctx.fillRect(x + 4, y + 5, 8, 11);
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(x + 3, y + 4, 10, 2);
        ctx.fillStyle = '#450a0a';
        ctx.fillRect(x + 6, y + 8, 4, 1);
        // Smoke puff
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(x + 6, y + 1, 4, 2);
        ctx.fillRect(x + 8, y, 3, 2);
        break;

      case 34: // Striped Market Fabric Awning
        ctx.fillStyle = '#dc2626'; // Red stripe
        ctx.fillRect(x, y + 2, S, 10);
        ctx.fillStyle = '#f8fafc'; // White stripe
        ctx.fillRect(x + 4, y + 2, 4, 10);
        ctx.fillRect(x + 12, y + 2, 4, 10);
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(x, y + 12, S, 2);
        break;

      // -------------------------------------------------------------
      // 35-49: Flora, Trees, Shrubs, Boulders, Props
      // -------------------------------------------------------------
      case 35: // Large Lush Oak Canopy Top (Volumetric multi-tone leaves)
        ctx.fillStyle = '#1b4332';
        ctx.fillRect(x + 1, y + 2, 14, 14);
        ctx.fillStyle = '#2d6a4f';
        ctx.fillRect(x + 2, y + 1, 12, 13);
        ctx.fillStyle = '#40916c';
        ctx.fillRect(x + 3, y + 2, 10, 10);
        ctx.fillStyle = '#74c69d';
        ctx.fillRect(x + 4, y + 3, 5, 4);
        ctx.fillRect(x + 9, y + 6, 4, 4);
        ctx.fillStyle = '#b7e4c7';
        ctx.fillRect(x + 5, y + 4, 2, 2);
        break;

      case 36: // Large Oak Trunk Base (Gnarled oak trunk & roots)
        ctx.fillStyle = '#1b4332'; // Under-canopy shadow
        ctx.fillRect(x + 2, y, 12, 4);
        // Trunk
        ctx.fillStyle = '#5c3a1e';
        ctx.fillRect(x + 5, y + 2, 6, 12);
        ctx.fillStyle = '#784620';
        ctx.fillRect(x + 6, y + 2, 4, 11);
        ctx.fillStyle = '#3a200e';
        ctx.fillRect(x + 5, y + 6, 1, 6);
        ctx.fillRect(x + 10, y + 6, 1, 6);
        // Roots spreading
        ctx.fillStyle = '#5c3a1e';
        ctx.fillRect(x + 3, y + 12, 3, 3);
        ctx.fillRect(x + 10, y + 12, 3, 3);
        // Moss patch
        ctx.fillStyle = '#52b788';
        ctx.fillRect(x + 6, y + 10, 2, 3);
        break;

      case 37: // Alpine Pine Tree Top (Sharp conical tiers)
        ctx.fillStyle = '#081c15';
        ctx.fillRect(x + 7, y + 1, 2, 2);
        ctx.fillRect(x + 5, y + 3, 6, 4);
        ctx.fillRect(x + 3, y + 7, 10, 5);
        ctx.fillRect(x + 1, y + 12, 14, 4);
        ctx.fillStyle = '#1b4332';
        ctx.fillRect(x + 7, y + 1, 2, 1);
        ctx.fillRect(x + 6, y + 3, 4, 3);
        ctx.fillRect(x + 4, y + 7, 8, 4);
        ctx.fillRect(x + 2, y + 12, 12, 3);
        ctx.fillStyle = '#40916c';
        ctx.fillRect(x + 7, y + 4, 2, 1);
        ctx.fillRect(x + 5, y + 8, 3, 2);
        ctx.fillRect(x + 3, y + 13, 4, 1);
        break;

      case 38: // Alpine Pine Trunk Base
        ctx.fillStyle = '#081c15';
        ctx.fillRect(x + 2, y, 12, 4);
        ctx.fillStyle = '#45260f';
        ctx.fillRect(x + 6, y + 2, 4, 12);
        ctx.fillStyle = '#6b3a15';
        ctx.fillRect(x + 7, y + 2, 2, 11);
        // Fallen pine needles on grass
        ctx.fillStyle = '#78350f';
        ctx.fillRect(x + 4, y + 13, 8, 2);
        break;

      case 39: // Clustered Wildflowers (Poppies, Bluebells & Buttercups)
        ctx.fillStyle = '#418a38';
        ctx.fillRect(x, y, S, S);
        // Red poppies
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(x + 3, y + 4, 3, 3);
        ctx.fillRect(x + 11, y + 9, 3, 3);
        ctx.fillStyle = '#fde047';
        ctx.fillRect(x + 4, y + 5, 1, 1);
        ctx.fillRect(x + 12, y + 10, 1, 1);
        // Bluebells
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(x + 10, y + 3, 2, 3);
        ctx.fillRect(x + 4, y + 11, 2, 3);
        ctx.fillStyle = '#93c5fd';
        ctx.fillRect(x + 10, y + 3, 1, 1);
        break;

      case 40: // Dense Shrub / Berry Bush
        ctx.fillStyle = '#1b4332';
        ctx.fillRect(x + 2, y + 3, 12, 11);
        ctx.fillStyle = '#2d6a4f';
        ctx.fillRect(x + 3, y + 2, 10, 11);
        ctx.fillStyle = '#52b788';
        ctx.fillRect(x + 4, y + 4, 6, 5);
        // Red berries
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(x + 5, y + 6, 2, 2);
        ctx.fillRect(x + 10, y + 5, 2, 2);
        ctx.fillRect(x + 7, y + 10, 2, 2);
        ctx.fillStyle = '#fca5a5';
        ctx.fillRect(x + 5, y + 6, 1, 1);
        break;

      case 41: // Bioluminescent Glowing Mushroom (Deepwood Glow)
        ctx.fillStyle = '#235229';
        ctx.fillRect(x, y, S, S);
        // Cyan mushroom
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(x + 4, y + 4, 8, 5);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(x + 5, y + 3, 6, 4);
        ctx.fillStyle = '#f0f9ff';
        ctx.fillRect(x + 6, y + 4, 2, 2);
        // Stalk
        ctx.fillStyle = '#e0f2fe';
        ctx.fillRect(x + 7, y + 9, 2, 4);
        // Violet mini mushroom
        ctx.fillStyle = '#9333ea';
        ctx.fillRect(x + 11, y + 8, 4, 3);
        ctx.fillStyle = '#c084fc';
        ctx.fillRect(x + 12, y + 7, 2, 2);
        ctx.fillStyle = '#f3e8ff';
        ctx.fillRect(x + 12, y + 11, 1, 2);
        break;

      case 42: // Mossy Highland Boulder
        ctx.fillStyle = '#334155';
        ctx.fillRect(x + 2, y + 3, 12, 11);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(x + 3, y + 2, 10, 10);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(x + 4, y + 3, 6, 4);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x + 4, y + 12, 9, 2);
        // Lichen / Moss on stone
        ctx.fillStyle = '#52b788';
        ctx.fillRect(x + 4, y + 4, 4, 2);
        ctx.fillRect(x + 8, y + 7, 3, 2);
        break;

      case 43: // Ancient Carved Standing Stone / Monolith
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x + 4, y + 1, 8, 14);
        ctx.fillStyle = '#475569';
        ctx.fillRect(x + 5, y + 2, 6, 12);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(x + 5, y + 2, 2, 12);
        // Glowing Celtic Rune
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(x + 7, y + 4, 2, 2);
        ctx.fillRect(x + 7, y + 7, 3, 1);
        ctx.fillRect(x + 8, y + 8, 1, 3);
        ctx.fillRect(x + 7, y + 11, 2, 1);
        break;

      case 44: // Golden Birch Tree Top
        ctx.fillStyle = '#713f12';
        ctx.fillRect(x + 2, y + 2, 12, 13);
        ctx.fillStyle = '#ca8a04';
        ctx.fillRect(x + 3, y + 1, 10, 12);
        ctx.fillStyle = '#eab308';
        ctx.fillRect(x + 4, y + 2, 7, 6);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(x + 5, y + 3, 3, 3);
        break;

      case 45: // Golden Birch Trunk Base (Iconic white bark with dark notches)
        ctx.fillStyle = '#ca8a04';
        ctx.fillRect(x + 3, y, 10, 3);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(x + 6, y + 2, 4, 12);
        ctx.fillStyle = '#0f172a'; // Bark marks
        ctx.fillRect(x + 6, y + 4, 2, 1);
        ctx.fillRect(x + 8, y + 7, 2, 1);
        ctx.fillRect(x + 6, y + 10, 3, 1);
        break;

      case 46: // Fallen Mossy Hollow Log
        ctx.fillStyle = '#418a38';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#45260f';
        ctx.fillRect(x + 1, y + 5, 14, 8);
        ctx.fillStyle = '#6b3a15';
        ctx.fillRect(x + 2, y + 6, 12, 6);
        ctx.fillStyle = '#291406'; // Hollow interior
        ctx.fillRect(x + 2, y + 7, 4, 4);
        // Fern on top
        ctx.fillStyle = '#74c69d';
        ctx.fillRect(x + 8, y + 3, 4, 3);
        ctx.fillStyle = '#40916c';
        ctx.fillRect(x + 9, y + 4, 2, 2);
        break;

      case 47: // Rustic Post-and-Rail Wooden Fence
        ctx.fillStyle = '#418a38';
        ctx.fillRect(x, y, S, S);
        // Wooden Posts
        ctx.fillStyle = '#784620';
        ctx.fillRect(x + 2, y + 2, 3, 12);
        ctx.fillRect(x + 11, y + 2, 3, 12);
        ctx.fillStyle = '#a16207';
        ctx.fillRect(x + 3, y + 2, 1, 11);
        ctx.fillRect(x + 12, y + 2, 1, 11);
        // Horizontal Rails
        ctx.fillStyle = '#784620';
        ctx.fillRect(x, y + 4, S, 2);
        ctx.fillRect(x, y + 9, S, 2);
        ctx.fillStyle = '#ca8a04';
        ctx.fillRect(x, y + 4, S, 1);
        ctx.fillRect(x, y + 9, S, 1);
        break;

      case 48: // Mountain Scree & Jagged Slate Shards
        ctx.fillStyle = '#475569';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x + 2, y + 3, 4, 3);
        ctx.fillRect(x + 8, y + 8, 5, 4);
        ctx.fillRect(x + 11, y + 2, 3, 3);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(x + 3, y + 3, 2, 1);
        ctx.fillRect(x + 9, y + 8, 3, 1);
        break;

      case 49: // Coastal Tidal Pool with Sea Anemone
        ctx.fillStyle = '#d9b675';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#1b6785';
        ctx.fillRect(x + 2, y + 2, 12, 12);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(x + 4, y + 4, 8, 8);
        // Pink sea anemone
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(x + 6, y + 6, 4, 4);
        ctx.fillStyle = '#fecdd3';
        ctx.fillRect(x + 7, y + 7, 2, 2);
        break;

      // -------------------------------------------------------------
      // 50-79: Props, Landmarks, Interactables & Dungeons
      // -------------------------------------------------------------
      case 50: // Oak Trade Barrel
        ctx.fillStyle = '#5c3a1e';
        ctx.fillRect(x + 3, y + 2, 10, 12);
        ctx.fillStyle = '#8b5a2b';
        ctx.fillRect(x + 4, y + 3, 8, 10);
        // Iron hoops
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x + 3, y + 4, 10, 1);
        ctx.fillRect(x + 3, y + 11, 10, 1);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(x + 4, y + 4, 8, 1);
        ctx.fillRect(x + 4, y + 11, 8, 1);
        break;

      case 51: // Wooden Cargo Crate
        ctx.fillStyle = '#784620';
        ctx.fillRect(x + 2, y + 2, 12, 12);
        ctx.fillStyle = '#a16207';
        ctx.fillRect(x + 3, y + 3, 10, 10);
        // Diagonal cross
        ctx.fillStyle = '#5c3a1e';
        ctx.fillRect(x + 2, y + 2, 12, 1);
        ctx.fillRect(x + 2, y + 13, 12, 1);
        ctx.fillRect(x + 2, y + 2, 1, 12);
        ctx.fillRect(x + 13, y + 2, 1, 12);
        for (let i = 0; i < 10; i++) {
          ctx.fillRect(x + 3 + i, y + 3 + i, 1, 1);
          ctx.fillRect(x + 12 - i, y + 3 + i, 1, 1);
        }
        break;

      case 52: // Golden Treasure Chest (Closed)
        ctx.fillStyle = '#5c3a1e';
        ctx.fillRect(x + 2, y + 4, 12, 10);
        ctx.fillStyle = '#8b5a2b';
        ctx.fillRect(x + 3, y + 5, 10, 8);
        // Gold bands & lock
        ctx.fillStyle = '#ca8a04';
        ctx.fillRect(x + 2, y + 4, 12, 2);
        ctx.fillRect(x + 2, y + 8, 12, 1);
        ctx.fillStyle = '#fde047';
        ctx.fillRect(x + 7, y + 8, 2, 3);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x + 8, y + 9, 1, 1); // Keyhole
        break;

      case 53: // Classic Iron Street Lantern
        // Base & Post
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x + 6, y + 8, 4, 8);
        ctx.fillStyle = '#334155';
        ctx.fillRect(x + 7, y + 2, 2, 12);
        // Lantern head
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x + 4, y + 2, 8, 2);
        ctx.fillRect(x + 4, y + 7, 8, 1);
        // Glowing flame inside
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(x + 5, y + 4, 6, 3);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(x + 7, y + 5, 2, 2);
        break;

      case 54: // Stone Water Well
        ctx.fillStyle = '#334155';
        ctx.fillRect(x + 2, y + 6, 12, 9);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(x + 3, y + 7, 10, 7);
        // Water center
        ctx.fillStyle = '#1b6785';
        ctx.fillRect(x + 5, y + 8, 6, 4);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(x + 6, y + 9, 3, 2);
        // Wooden frame & roof
        ctx.fillStyle = '#784620';
        ctx.fillRect(x + 3, y + 2, 2, 5);
        ctx.fillRect(x + 11, y + 2, 2, 5);
        ctx.fillRect(x + 2, y + 1, 12, 2);
        break;

      case 55: // Ornate Marble City Fountain
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(x + 1, y + 4, 14, 11);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(x + 2, y + 5, 12, 9);
        // Splashing Water
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(x + 3, y + 6, 10, 7);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(x + 4, y + 7, 8, 5);
        ctx.fillStyle = '#f0f9ff';
        ctx.fillRect(x + 7, y + 2, 2, 6);
        ctx.fillRect(x + 6, y + 3, 4, 2);
        break;

      case 56: // Wooden Directional Signpost
        ctx.fillStyle = '#5c3a1e';
        ctx.fillRect(x + 7, y + 6, 2, 10);
        // Arrows
        ctx.fillStyle = '#8b5a2b';
        ctx.fillRect(x + 2, y + 2, 8, 3);
        ctx.fillStyle = '#ca8a04';
        ctx.fillRect(x + 2, y + 2, 7, 1);
        ctx.fillStyle = '#8b5a2b';
        ctx.fillRect(x + 6, y + 5, 8, 3);
        ctx.fillStyle = '#ca8a04';
        ctx.fillRect(x + 7, y + 5, 7, 1);
        break;

      case 57: // Opened Gleaming Treasure Chest
        ctx.fillStyle = '#5c3a1e';
        ctx.fillRect(x + 2, y + 6, 12, 8);
        ctx.fillStyle = '#ca8a04';
        ctx.fillRect(x + 2, y + 1, 12, 4); // Raised lid
        // Gleaming gems & relics
        ctx.fillStyle = '#fde047';
        ctx.fillRect(x + 4, y + 6, 8, 4);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(x + 5, y + 7, 2, 2);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(x + 9, y + 7, 2, 2);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + 7, y + 5, 2, 2);
        break;

      case 58: // Campfire with Glowing Embers
        ctx.fillStyle = '#334155'; // Stone circle
        ctx.fillRect(x + 2, y + 5, 12, 9);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x + 4, y + 6, 8, 7);
        // Firewood
        ctx.fillStyle = '#5c3a1e';
        ctx.fillRect(x + 4, y + 9, 8, 2);
        // Flame
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(x + 5, y + 4, 6, 6);
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(x + 6, y + 3, 4, 5);
        ctx.fillStyle = '#fde047';
        ctx.fillRect(x + 7, y + 2, 2, 4);
        break;

      case 59: // Market Stall (Blue/White Canopy)
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(x + 1, y + 1, 14, 6);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(x + 4, y + 1, 4, 6);
        ctx.fillRect(x + 11, y + 1, 4, 6);
        // Counter table
        ctx.fillStyle = '#784620';
        ctx.fillRect(x + 2, y + 7, 12, 7);
        // Goods (Apples, Bread)
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(x + 3, y + 8, 3, 3);
        ctx.fillStyle = '#ca8a04';
        ctx.fillRect(x + 8, y + 8, 4, 3);
        break;

      case 60: // Market Stall (Red/Gold Canopy)
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(x + 1, y + 1, 14, 6);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(x + 4, y + 1, 4, 6);
        ctx.fillRect(x + 11, y + 1, 4, 6);
        ctx.fillStyle = '#784620';
        ctx.fillRect(x + 2, y + 7, 12, 7);
        // Spices & Potions
        ctx.fillStyle = '#8b5cf6';
        ctx.fillRect(x + 4, y + 8, 2, 3);
        ctx.fillStyle = '#10b981';
        ctx.fillRect(x + 9, y + 8, 2, 3);
        break;

      case 61: // Blacksmith Anvil & Glowing Forge Basin
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x + 2, y + 6, 12, 8);
        ctx.fillStyle = '#475569';
        ctx.fillRect(x + 4, y + 3, 8, 4);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(x + 3, y + 3, 10, 2);
        // Glowing hot iron
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(x + 6, y + 2, 4, 2);
        ctx.fillStyle = '#fde047';
        ctx.fillRect(x + 7, y + 2, 2, 1);
        break;

      case 62: // Weapon Rack (Swords, Spears, Shields)
        ctx.fillStyle = '#5c3a1e';
        ctx.fillRect(x + 2, y + 3, 12, 11);
        ctx.fillStyle = '#784620';
        ctx.fillRect(x + 3, y + 4, 10, 9);
        // Steel Blades
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(x + 4, y + 2, 1, 11);
        ctx.fillRect(x + 7, y + 1, 1, 12);
        ctx.fillRect(x + 10, y + 2, 1, 11);
        ctx.fillStyle = '#dc2626'; // Shield trim
        ctx.fillRect(x + 5, y + 7, 5, 5);
        break;

      case 63: // Great Clocktower Celestial Dial (Crownport Monument)
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x + 1, y + 1, 14, 14);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x + 2, y + 2, 12, 12);
        // Brass celestial ring
        ctx.fillStyle = '#ca8a04';
        ctx.fillRect(x + 3, y + 3, 10, 10);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(x + 4, y + 4, 8, 8);
        // Clock Hands
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x + 7, y + 5, 2, 4);
        ctx.fillRect(x + 7, y + 7, 4, 2);
        ctx.fillStyle = '#ef4444'; // Center jewel
        ctx.fillRect(x + 7, y + 7, 2, 2);
        break;

      case 64: // Ancient Beacon Lighthouse Fresnel Crystal
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x + 2, y + 2, 12, 12);
        // Brilliant Radiating Crystal
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(x + 4, y + 4, 8, 8);
        ctx.fillStyle = '#f0f9ff';
        ctx.fillRect(x + 5, y + 5, 6, 6);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + 7, y + 6, 2, 4);
        ctx.fillRect(x + 6, y + 7, 4, 2);
        break;

      case 65: // Ancient Crypt Verdigris Bronze Portcullis
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x + 1, y + 1, 14, 15);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x + 2, y + 3, 12, 13);
        // Verdigris bronze bars
        ctx.fillStyle = '#0d9488';
        ctx.fillRect(x + 4, y + 3, 1, 13);
        ctx.fillRect(x + 7, y + 3, 2, 13);
        ctx.fillRect(x + 11, y + 3, 1, 13);
        ctx.fillRect(x + 2, y + 7, 12, 2);
        ctx.fillRect(x + 2, y + 12, 12, 2);
        break;

      case 66: // Cavern Mine Archway (Timber Shored Shaft)
        ctx.fillStyle = '#0f172a'; // Pitch black cave
        ctx.fillRect(x + 1, y + 1, 14, 15);
        // Sturdy timber frame
        ctx.fillStyle = '#5c3a1e';
        ctx.fillRect(x + 2, y + 1, 12, 3);
        ctx.fillRect(x + 2, y + 1, 3, 15);
        ctx.fillRect(x + 11, y + 1, 3, 15);
        ctx.fillStyle = '#8b5a2b';
        ctx.fillRect(x + 3, y + 2, 10, 1);
        // Lantern hanging on post
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(x + 12, y + 5, 2, 3);
        break;

      case 67: // Weathered Ship Anchor & Dockside Ropes
        ctx.fillStyle = '#64748b';
        ctx.fillRect(x + 3, y + 3, 10, 10);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x + 7, y + 3, 2, 8);
        ctx.fillRect(x + 4, y + 9, 8, 2);
        ctx.fillRect(x + 3, y + 7, 2, 3);
        ctx.fillRect(x + 11, y + 7, 2, 3);
        // Rope coils
        ctx.fillStyle = '#ca8a04';
        ctx.fillRect(x + 8, y + 9, 5, 4);
        break;

      case 68: // Planter Flower Box (Window or roadside)
        ctx.fillStyle = '#5c3a1e';
        ctx.fillRect(x + 2, y + 7, 12, 7);
        ctx.fillStyle = '#784620';
        ctx.fillRect(x + 3, y + 8, 10, 5);
        // Blooming Petunias
        ctx.fillStyle = '#ec4899';
        ctx.fillRect(x + 3, y + 4, 3, 3);
        ctx.fillStyle = '#a855f7';
        ctx.fillRect(x + 7, y + 3, 3, 3);
        ctx.fillStyle = '#eab308';
        ctx.fillRect(x + 11, y + 4, 3, 3);
        break;

      case 69: // Limestone Park Bench
        ctx.fillStyle = '#64748b';
        ctx.fillRect(x + 2, y + 5, 12, 8);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(x + 2, y + 4, 12, 3); // Seat
        ctx.fillRect(x + 3, y + 1, 10, 2); // Backrest
        ctx.fillStyle = '#334155';
        ctx.fillRect(x + 3, y + 7, 2, 6); // Legs
        ctx.fillRect(x + 11, y + 7, 2, 6);
        break;

      case 70: // Weathered Stone Gravestone
        ctx.fillStyle = '#475569';
        ctx.fillRect(x + 4, y + 3, 8, 11);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(x + 5, y + 2, 6, 11);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x + 7, y + 4, 2, 6); // Cross
        ctx.fillRect(x + 6, y + 6, 4, 2);
        break;

      case 71: // Magic Warp Sigil (Glowing Blue Circle)
        ctx.fillStyle = '#0369a1';
        ctx.fillRect(x + 1, y + 1, 14, 14);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(x + 3, y + 3, 10, 10);
        ctx.fillStyle = '#f0f9ff';
        ctx.fillRect(x + 5, y + 5, 6, 6);
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(x + 7, y + 2, 2, 12);
        ctx.fillRect(x + 2, y + 7, 12, 2);
        break;

      case 72: // Kelp Drying Rack (Tidebreak Coastal Prop)
        ctx.fillStyle = '#5c3a1e';
        ctx.fillRect(x + 2, y + 2, 2, 12);
        ctx.fillRect(x + 12, y + 2, 2, 12);
        ctx.fillRect(x + 2, y + 3, 12, 2);
        // Hanging kelp
        ctx.fillStyle = '#14532d';
        ctx.fillRect(x + 4, y + 4, 2, 9);
        ctx.fillRect(x + 7, y + 4, 2, 10);
        ctx.fillRect(x + 10, y + 4, 2, 8);
        break;

      case 73: // Mountain Smelter Furnace Base (Molten Glow)
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x + 1, y + 1, 14, 15);
        ctx.fillStyle = '#334155';
        ctx.fillRect(x + 2, y + 2, 12, 13);
        // Molten Ore Glow
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(x + 4, y + 6, 8, 7);
        ctx.fillStyle = '#fde047';
        ctx.fillRect(x + 5, y + 7, 6, 5);
        break;

      case 74: // Rope Gorge Suspension Cable Anchor
        ctx.fillStyle = '#334155';
        ctx.fillRect(x + 3, y + 4, 10, 10);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x + 5, y + 2, 6, 6);
        // Heavy Cable
        ctx.fillStyle = '#ca8a04';
        ctx.fillRect(x, y + 7, S, 2);
        break;

      case 75: // Ancient Knight Statue on Pedestal
        ctx.fillStyle = '#475569';
        ctx.fillRect(x + 2, y + 10, 12, 5); // Pedestal
        ctx.fillStyle = '#64748b';
        ctx.fillRect(x + 4, y + 3, 8, 8); // Armor
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(x + 6, y + 1, 4, 4); // Helmet
        // Sword plunging down
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(x + 7, y + 4, 2, 8);
        ctx.fillRect(x + 5, y + 5, 6, 1);
        break;

      case 76: // Amethyst Crystal Cluster
        ctx.fillStyle = '#334155';
        ctx.fillRect(x + 3, y + 6, 10, 8);
        // Crystals
        ctx.fillStyle = '#7e22ce';
        ctx.fillRect(x + 5, y + 2, 4, 8);
        ctx.fillRect(x + 9, y + 4, 3, 7);
        ctx.fillStyle = '#c084fc';
        ctx.fillRect(x + 6, y + 2, 2, 6);
        ctx.fillRect(x + 10, y + 4, 1, 5);
        ctx.fillStyle = '#f3e8ff';
        ctx.fillRect(x + 6, y + 2, 1, 2);
        break;

      case 77: // Sunken Skiff Hull Wreckage
        ctx.fillStyle = '#1b6785';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#5c3a1e';
        ctx.fillRect(x + 2, y + 4, 12, 8);
        ctx.fillStyle = '#3a200e';
        ctx.fillRect(x + 4, y + 6, 8, 4);
        // Barnacles & Green algae
        ctx.fillStyle = '#10b981';
        ctx.fillRect(x + 3, y + 5, 2, 2);
        ctx.fillRect(x + 10, y + 9, 3, 2);
        break;

      case 78: // Fairy Mushroom Ring
        ctx.fillStyle = '#235229';
        ctx.fillRect(x, y, S, S);
        // Small luminous mushrooms in circle
        const ring = [
          [x + 4, y + 3], [x + 11, y + 3],
          [x + 2, y + 8], [x + 13, y + 8],
          [x + 4, y + 13], [x + 11, y + 13]
        ];
        ctx.fillStyle = '#38bdf8';
        for (const [mx, my] of ring) {
          ctx.fillRect(mx, my, 2, 2);
        }
        ctx.fillStyle = '#f0f9ff';
        for (const [mx, my] of ring) {
          ctx.fillRect(mx, my, 1, 1);
        }
        break;

      case 79: // Submerged Wooden Stilt Post (Pier Support)
        ctx.fillStyle = '#1b6785';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#45260f';
        ctx.fillRect(x + 5, y, 6, 16);
        ctx.fillStyle = '#6b3a15';
        ctx.fillRect(x + 6, y, 4, 16);
        // Water ripples around post
        ctx.fillStyle = '#4cc9f0';
        ctx.fillRect(x + 3, y + 8, 2, 1);
        ctx.fillRect(x + 11, y + 8, 2, 1);
        ctx.fillRect(x + 2, y + 12, 3, 1);
        ctx.fillRect(x + 11, y + 12, 3, 1);
        break;

      // -------------------------------------------------------------
      // 80-99: Vertical Slice Multi-Tile & Specialized Primitives
      // -------------------------------------------------------------
      case 80: // Temple Column Top (Carved Corinthian Capital)
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(x + 2, y + 4, 12, 12);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(x + 1, y + 2, 14, 3);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(x + 2, y + 2, 12, 1);
        // Fluting
        ctx.fillStyle = '#64748b';
        ctx.fillRect(x + 4, y + 6, 2, 10);
        ctx.fillRect(x + 10, y + 6, 2, 10);
        break;

      case 81: // Temple Column Base (Sturdy Plinth)
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(x + 2, y, 12, 12);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(x + 1, y + 11, 14, 4);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(x + 4, y, 2, 11);
        ctx.fillRect(x + 10, y, 2, 11);
        // Lichen on stone
        ctx.fillStyle = '#52b788';
        ctx.fillRect(x + 3, y + 8, 3, 3);
        break;

      case 82: // Temple Carved Pediment Arch Left
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(x, y + 6, S, 10);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(x, y + 4, S, 3);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(x, y + 14, S, 2);
        // Runic engraving
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(x + 4, y + 9, 6, 2);
        break;

      case 83: // Temple Carved Pediment Arch Right
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(x, y + 6, S, 10);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(x, y + 4, S, 3);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(x, y + 14, S, 2);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(x + 6, y + 9, 6, 2);
        break;

      case 88: // Riverbank Water Reeds & Lilypads
        ctx.fillStyle = '#1b6785';
        ctx.fillRect(x, y, S, S);
        // Green lilypads
        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.arc(x + 4, y + 11, 3, 0, Math.PI * 1.8);
        ctx.fill();
        // Tall Reeds / Cattails
        ctx.fillStyle = '#166534';
        ctx.fillRect(x + 9, y + 3, 1, 12);
        ctx.fillRect(x + 12, y + 1, 1, 14);
        ctx.fillStyle = '#78350f'; // Brown heads
        ctx.fillRect(x + 8, y + 3, 3, 4);
        ctx.fillRect(x + 11, y + 1, 3, 5);
        break;

      case 89: // Weathered Tent Canvas & Broken Wagon Wheel
        ctx.fillStyle = '#418a38';
        ctx.fillRect(x, y, S, S);
        // Cloth tent
        ctx.fillStyle = '#d6d3d1';
        ctx.fillRect(x + 2, y + 3, 12, 10);
        ctx.fillStyle = '#78716c';
        ctx.fillRect(x + 6, y + 5, 4, 8); // Tent flap
        // Broken wooden wheel
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.arc(x + 13, y + 12, 3, 0, Math.PI * 2);
        ctx.stroke();
        break;

      case 90: // Sacred Glowing Runic Altar Pedestal
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x + 1, y + 3, 14, 12);
        ctx.fillStyle = '#475569';
        ctx.fillRect(x + 2, y + 4, 12, 10);
        // Glowing Cyan Crystal Basin
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(x + 4, y + 5, 8, 6);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(x + 5, y + 6, 6, 4);
        ctx.fillStyle = '#f0f9ff';
        ctx.fillRect(x + 6, y + 7, 4, 2);
        // Sacred Rune Glow
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(x + 7, y + 1, 2, 3);
        ctx.fillRect(x + 7, y + 12, 2, 2);
        break;

      case 91: // Village Wooden Gatepost with Hanging Lantern
        ctx.fillStyle = '#5c3a1e';
        ctx.fillRect(x + 4, y + 1, 8, 15);
        ctx.fillStyle = '#784620';
        ctx.fillRect(x + 5, y + 2, 6, 13);
        // Crossbeam
        ctx.fillStyle = '#45260f';
        ctx.fillRect(x, y + 3, S, 2);
        // Glowing Lantern
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(x + 1, y + 6, 3, 4);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(x + 2, y + 7, 1, 2);
        break;

      case 92: // Massive 3x3 Elder Oak Crown - Top Left
        ctx.fillStyle = '#1b4332';
        ctx.fillRect(x + 3, y + 4, 13, 12);
        ctx.fillStyle = '#2d6a4f';
        ctx.fillRect(x + 5, y + 3, 11, 13);
        ctx.fillStyle = '#52b788';
        ctx.fillRect(x + 7, y + 5, 7, 6);
        ctx.fillStyle = '#a7f3d0';
        ctx.fillRect(x + 9, y + 7, 3, 3);
        break;

      case 93: // Massive 3x3 Elder Oak Crown - Top Center
        ctx.fillStyle = '#1b4332';
        ctx.fillRect(x, y + 2, S, 14);
        ctx.fillStyle = '#2d6a4f';
        ctx.fillRect(x, y + 1, S, 14);
        ctx.fillStyle = '#40916c';
        ctx.fillRect(x + 2, y + 2, 12, 10);
        ctx.fillStyle = '#74c69d';
        ctx.fillRect(x + 4, y + 3, 8, 6);
        ctx.fillStyle = '#b7e4c7';
        ctx.fillRect(x + 6, y + 4, 4, 3);
        break;

      case 94: // Massive 3x3 Elder Oak Crown - Top Right
        ctx.fillStyle = '#1b4332';
        ctx.fillRect(x, y + 4, 13, 12);
        ctx.fillStyle = '#2d6a4f';
        ctx.fillRect(x, y + 3, 11, 13);
        ctx.fillStyle = '#40916c';
        ctx.fillRect(x + 2, y + 5, 7, 6);
        break;

      case 95: // Massive 3x3 Elder Oak Trunk - Base Center
        ctx.fillStyle = '#1b4332'; // Shadow
        ctx.fillRect(x, y, S, 4);
        // Gnarled Trunk
        ctx.fillStyle = '#45260f';
        ctx.fillRect(x + 2, y + 1, 12, 14);
        ctx.fillStyle = '#6b3a15';
        ctx.fillRect(x + 4, y + 2, 8, 12);
        ctx.fillStyle = '#8b5a2b';
        ctx.fillRect(x + 6, y + 3, 4, 10);
        // Spreading massive roots
        ctx.fillStyle = '#45260f';
        ctx.fillRect(x, y + 11, 4, 4);
        ctx.fillRect(x + 12, y + 11, 4, 4);
        // Ancient moss
        ctx.fillStyle = '#52b788';
        ctx.fillRect(x + 5, y + 8, 3, 4);
        break;

      default:
        // Generic fallback grid
        ctx.fillStyle = '#64748b';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#475569';
        ctx.strokeRect(x + 0.5, y + 0.5, S - 1, S - 1);
        break;
    }
  }

  /**
   * Procedural Character Sprite Drawer
   */
  private static drawCharacterSprite(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    dir: number,
    frame: number,
    palette: string[]
  ): void {
    const [hairColor, skinColor, tunicColor, pantsColor, accentColor] = palette;

    // Bobbing offset for walking animation
    const bob = frame === 1 ? 0 : -1;
    const legOffset = frame === 0 ? -1 : frame === 2 ? 1 : 0;

    // 1. Shadow underneath
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.beginPath();
    ctx.ellipse(x + 8, y + 15, 5, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Legs / Boots
    ctx.fillStyle = pantsColor;
    if (dir === 0 || dir === 3) { // Facing Down or Up
      ctx.fillRect(x + 5 + legOffset, y + 12 + bob, 2, 3);
      ctx.fillRect(x + 9 - legOffset, y + 12 + bob, 2, 3);
    } else { // Facing Side
      ctx.fillRect(x + 6 + legOffset, y + 12 + bob, 4, 3);
    }

    // 3. Tunic / Body
    ctx.fillStyle = tunicColor;
    ctx.fillRect(x + 4, y + 6 + bob, 8, 6);
    // Accent trim / belt
    ctx.fillStyle = accentColor;
    ctx.fillRect(x + 4, y + 10 + bob, 8, 1);
    ctx.fillStyle = '#ca8a04'; // Buckle
    ctx.fillRect(x + 7, y + 10 + bob, 2, 1);

    // 4. Head & Face
    ctx.fillStyle = skinColor;
    ctx.fillRect(x + 5, y + 2 + bob, 6, 5);

    // 5. Hair & Eyes based on direction
    ctx.fillStyle = hairColor;
    if (dir === 0) { // Facing Down
      ctx.fillRect(x + 4, y + 1 + bob, 8, 3);
      ctx.fillRect(x + 4, y + 3 + bob, 1, 3);
      ctx.fillRect(x + 11, y + 3 + bob, 1, 3);
      // Eyes
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + 6, y + 4 + bob, 1, 2);
      ctx.fillRect(x + 9, y + 4 + bob, 1, 2);
    } else if (dir === 1) { // Facing Left
      ctx.fillRect(x + 5, y + 1 + bob, 7, 3);
      ctx.fillRect(x + 10, y + 3 + bob, 2, 4);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + 6, y + 4 + bob, 1, 2);
    } else if (dir === 2) { // Facing Right
      ctx.fillRect(x + 4, y + 1 + bob, 7, 3);
      ctx.fillRect(x + 4, y + 3 + bob, 2, 4);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + 9, y + 4 + bob, 1, 2);
    } else if (dir === 3) { // Facing Up (Back of head)
      ctx.fillRect(x + 4, y + 1 + bob, 8, 6);
    }
  }
}
