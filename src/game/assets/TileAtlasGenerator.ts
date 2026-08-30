/**
 * TileAtlasGenerator.ts
 * Generates a cohesive 16x16 pixel-art tileset texture atlas and character spritesheets
 * entirely using HTML Canvas / pixel-level drawing.
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

    // Draw all tiles
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
   * Generates character spritesheet canvas (4 directions x 3 animation frames)
   */
  public static generateCharactersCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 16 * 12; // 12 character types x 4 directions x 3 frames
    canvas.height = 16 * 4;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Could not create 2D context for character canvas');

    ctx.imageSmoothingEnabled = false;

    // Character color palettes: [hair, skin, tunic, pants]
    const palettes = [
      ['#5a3d28', '#fcd5b5', '#3b82f6', '#1e293b'], // 0: Player Traveler (Blue cloak)
      ['#2d3748', '#f8c291', '#dc2626', '#334155'], // 1: Tideguard Guard (Red tunic)
      ['#713f12', '#f6d8ae', '#16a34a', '#3f2e18'], // 2: Forest Ranger (Green tunic)
      ['#475569', '#f3c68f', '#0284c7', '#1e293b'], // 3: Tidebreak Mariner (Cyan vest)
      ['#1f2937', '#e5b887', '#d97706', '#451a03'], // 4: Cragwatch Miner (Orange vest)
      ['#e2e8f0', '#fbd5c0', '#7c3aed', '#3b0764'], // 5: Elder Scholar (Purple robe)
      ['#9a3412', '#fde047', '#059669', '#14532d'], // 6: Herbalist Maeve (Emerald gown)
      ['#3b82f6', '#fcd5b5', '#eab308', '#713f12'], // 7: Merchant Vance (Gold doublet)
      ['#e0e7ff', '#fcd5b5', '#6366f1', '#312e81'], // 8: Clockmaker (Indigo apron)
      ['#374151', '#e2e8f0', '#64748b', '#0f172a'], // 9: Ghost Captain (Spectral pale)
      ['#14532d', '#fcd5b5', '#15803d', '#1e293b'], // 10: Weald Druid (Lush robes)
      ['#78350f', '#fcd5b5', '#b45309', '#451a03'], // 11: Tavern Keeper (Brown apron)
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

  private static drawTile(ctx: CanvasRenderingContext2D, id: number, x: number, y: number): void {
    const S = this.TILE_SIZE;

    switch (id) {
      case 0: // 0: Empty / Void
        ctx.fillStyle = '#000000';
        ctx.fillRect(x, y, S, S);
        break;

      case 1: // 1: Deep Ocean
        ctx.fillStyle = '#0f3854';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#18527a';
        ctx.fillRect(x + 2, y + 4, 4, 1);
        ctx.fillRect(x + 10, y + 11, 5, 1);
        break;

      case 2: // 2: Shallow Ocean / Coast
        ctx.fillStyle = '#1d6387';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#2b84b3';
        ctx.fillRect(x + 3, y + 3, 5, 1);
        ctx.fillRect(x + 9, y + 10, 4, 1);
        break;

      case 3: // 3: Water Foam / Edge
        ctx.fillStyle = '#1d6387';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#7dd3fc';
        ctx.fillRect(x + 1, y + 2, 6, 2);
        ctx.fillRect(x + 8, y + 8, 7, 2);
        break;

      case 4: // 4: Sand / Beach
        ctx.fillStyle = '#d6ba82';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#c4a56c';
        ctx.fillRect(x + 3, y + 4, 1, 1);
        ctx.fillRect(x + 11, y + 9, 1, 1);
        ctx.fillRect(x + 7, y + 13, 1, 1);
        break;

      case 5: // 5: Lush Grass (Meadow)
        ctx.fillStyle = '#4b8f3c';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#5aa849';
        ctx.fillRect(x + 3, y + 3, 1, 2);
        ctx.fillRect(x + 10, y + 8, 1, 2);
        ctx.fillStyle = '#3f7a32';
        ctx.fillRect(x + 4, y + 4, 1, 1);
        ctx.fillRect(x + 11, y + 9, 1, 1);
        break;

      case 6: // 6: Dark Forest Grass (Deepwood)
        ctx.fillStyle = '#2a5e2c';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#3a783d';
        ctx.fillRect(x + 2, y + 5, 1, 2);
        ctx.fillRect(x + 9, y + 11, 1, 2);
        ctx.fillStyle = '#1f4721';
        ctx.fillRect(x + 3, y + 6, 1, 1);
        break;

      case 7: // 7: Dirt Trail
        ctx.fillStyle = '#946f48';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#7a5836';
        ctx.fillRect(x + 2, y + 2, 2, 1);
        ctx.fillRect(x + 10, y + 7, 3, 1);
        ctx.fillRect(x + 5, y + 12, 2, 1);
        ctx.fillStyle = '#ab845b';
        ctx.fillRect(x + 7, y + 4, 1, 1);
        break;

      case 8: // 8: Cobblestone Paved Road (Crownport)
        ctx.fillStyle = '#64748b';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#475569';
        // Draw brick pattern
        ctx.strokeRect(x + 0.5, y + 0.5, 7, 7);
        ctx.strokeRect(x + 8.5, y + 0.5, 7, 7);
        ctx.strokeRect(x + 4.5, y + 8.5, 7, 7);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(x + 2, y + 2, 4, 4);
        ctx.fillRect(x + 10, y + 2, 4, 4);
        ctx.fillRect(x + 6, y + 10, 4, 4);
        break;

      case 9: // 9: Mountain Slate / Stone Floor
        ctx.fillStyle = '#505a69';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#6b788a';
        ctx.fillRect(x + 1, y + 1, 6, 6);
        ctx.fillRect(x + 8, y + 8, 7, 7);
        ctx.fillStyle = '#3a414c';
        ctx.fillRect(x + 1, y + 7, 7, 1);
        ctx.fillRect(x + 7, y + 1, 1, 7);
        break;

      case 10: // 10: Cliff Top Edge
        ctx.fillStyle = '#4b8f3c'; // Grass top
        ctx.fillRect(x, y, S, 6);
        ctx.fillStyle = '#5a6578'; // Stone cliff face
        ctx.fillRect(x, y + 6, S, 10);
        ctx.fillStyle = '#39414d';
        ctx.fillRect(x, y + 6, S, 2);
        break;

      case 11: // 11: Cliff Wall Center
        ctx.fillStyle = '#47505e';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#343b45';
        ctx.fillRect(x + 3, y + 2, 2, 8);
        ctx.fillRect(x + 10, y + 6, 2, 7);
        ctx.fillStyle = '#5e697a';
        ctx.fillRect(x + 1, y + 1, 2, 2);
        ctx.fillRect(x + 8, y + 5, 2, 2);
        break;

      case 12: // 12: Cliff Base
        ctx.fillStyle = '#3e4652';
        ctx.fillRect(x, y, S, 12);
        ctx.fillStyle = '#4b8f3c'; // Grass at bottom
        ctx.fillRect(x, y + 12, S, 4);
        ctx.fillStyle = '#2c323b';
        ctx.fillRect(x, y + 11, S, 2);
        break;

      case 13: // 13: Wooden Bridge Horizontal
        ctx.fillStyle = '#80512c';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#573317';
        ctx.fillRect(x, y, S, 2);
        ctx.fillRect(x, y + 14, S, 2);
        // Vertical planks
        ctx.fillStyle = '#a1683b';
        for (let px = 2; px < S; px += 4) {
          ctx.fillRect(x + px, y + 2, 3, 12);
        }
        break;

      case 14: // 14: Wooden Bridge Vertical
        ctx.fillStyle = '#80512c';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#573317';
        ctx.fillRect(x, y, 2, S);
        ctx.fillRect(x + 14, y, 2, S);
        // Horizontal planks
        ctx.fillStyle = '#a1683b';
        for (let py = 2; py < S; py += 4) {
          ctx.fillRect(x + 2, y + py, 12, 3);
        }
        break;

      case 15: // 15: Wooden Pier / Dock Plank
        ctx.fillStyle = '#94663e';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#6b4625';
        ctx.fillRect(x, y + 7, S, 1);
        ctx.fillRect(x, y + 15, S, 1);
        ctx.fillStyle = '#ba8554';
        ctx.fillRect(x + 1, y + 1, 14, 6);
        ctx.fillRect(x + 1, y + 8, 14, 6);
        break;

      case 16: // 16: Stone Quay / Sea Wall
        ctx.fillStyle = '#475569';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(x + 1, y + 1, 14, 5);
        ctx.fillStyle = '#334155';
        ctx.fillRect(x, y + 6, S, 2);
        ctx.fillRect(x + 1, y + 8, 14, 7);
        break;

      // Buildings & Architecture (20-34)
      case 20: // Grand Granite Wall (Crownport)
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#64748b';
        ctx.strokeRect(x + 0.5, y + 0.5, S - 1, S - 1);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(x + 2, y + 2, 12, 5);
        ctx.fillRect(x + 2, y + 9, 12, 5);
        break;

      case 21: // Timber Wall (Oakhaven)
        ctx.fillStyle = '#6d4323';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#452610';
        ctx.fillRect(x, y + 4, S, 1);
        ctx.fillRect(x, y + 9, S, 1);
        ctx.fillRect(x, y + 14, S, 1);
        ctx.fillStyle = '#8f5c35';
        ctx.fillRect(x + 1, y + 1, S - 2, 3);
        ctx.fillRect(x + 1, y + 5, S - 2, 4);
        ctx.fillRect(x + 1, y + 10, S - 2, 4);
        break;

      case 22: // Weathered Coastal Wood (Tidebreak)
        ctx.fillStyle = '#64748b';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#475569';
        ctx.fillRect(x, y + 5, S, 1);
        ctx.fillRect(x, y + 11, S, 1);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(x + 1, y + 1, S - 2, 4);
        ctx.fillRect(x + 1, y + 6, S - 2, 5);
        break;

      case 23: // Dark Slate Stone Wall (Cragwatch)
        ctx.fillStyle = '#334155';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#1e293b';
        ctx.strokeRect(x + 0.5, y + 0.5, S - 1, S - 1);
        ctx.fillStyle = '#475569';
        ctx.fillRect(x + 2, y + 2, 5, 5);
        ctx.fillRect(x + 9, y + 9, 5, 5);
        break;

      case 24: // Grand Blue Slate Roof
        ctx.fillStyle = '#1e3a5f';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#2d5a88';
        ctx.fillRect(x + 1, y + 1, 6, 6);
        ctx.fillRect(x + 8, y + 1, 7, 6);
        ctx.fillRect(x + 4, y + 8, 7, 7);
        ctx.fillStyle = '#10233b';
        ctx.fillRect(x, y + 7, S, 1);
        ctx.fillRect(x, y + 15, S, 1);
        break;

      case 25: // Thatch Roof
        ctx.fillStyle = '#996f26';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#c7963c';
        for (let py = 1; py < S; py += 3) {
          ctx.fillRect(x + 1, y + py, S - 2, 2);
        }
        ctx.fillStyle = '#6b4c14';
        ctx.fillRect(x, y + 14, S, 2);
        break;

      case 26: // Red Terracotta Roof
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(x + 1, y + 1, 6, 6);
        ctx.fillRect(x + 8, y + 1, 7, 6);
        ctx.fillRect(x + 4, y + 8, 7, 7);
        ctx.fillStyle = '#7f1d1d';
        ctx.fillRect(x, y + 7, S, 1);
        break;

      case 27: // Wooden Door
        ctx.fillStyle = '#94a3b8'; // Wall frame
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#452610'; // Door wood
        ctx.fillRect(x + 3, y + 2, 10, 14);
        ctx.fillStyle = '#633919';
        ctx.fillRect(x + 4, y + 3, 8, 12);
        ctx.fillStyle = '#fbbf24'; // Brass knob
        ctx.fillRect(x + 10, y + 9, 2, 2);
        break;

      case 28: // Window - Day (Sky reflection)
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(x + 4, y + 4, 8, 8);
        ctx.fillStyle = '#1e293b'; // Cross frame
        ctx.fillRect(x + 7, y + 4, 2, 8);
        ctx.fillRect(x + 4, y + 7, 8, 2);
        break;

      case 29: // Window - Night Warm Glow
        ctx.fillStyle = '#334155';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(x + 4, y + 4, 8, 8);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(x + 5, y + 5, 3, 3);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(x + 7, y + 4, 2, 8);
        ctx.fillRect(x + 4, y + 7, 8, 2);
        break;

      case 30: // Chimney
        ctx.fillStyle = '#1e3a5f'; // Roof background
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#475569'; // Chimney brick
        ctx.fillRect(x + 5, y + 2, 6, 12);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(x + 4, y + 1, 8, 2);
        ctx.fillStyle = '#e2e8f0'; // Smoke wisp
        ctx.fillRect(x + 7, y, 2, 1);
        break;

      // Vegetation & Nature (35-49)
      case 35: // Oak Tree Canopy Top
        ctx.fillStyle = '#4b8f3c'; // Grass bg
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#15803d'; // Tree canopy
        ctx.beginPath();
        ctx.arc(x + 8, y + 8, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#22c55e'; // Highlight
        ctx.beginPath();
        ctx.arc(x + 7, y + 6, 4, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 36: // Oak Tree Trunk / Base
        ctx.fillStyle = '#4b8f3c';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#15803d'; // Canopy overlap top
        ctx.fillRect(x + 2, y, 12, 5);
        ctx.fillStyle = '#5c3619'; // Brown trunk
        ctx.fillRect(x + 6, y + 5, 4, 9);
        ctx.fillStyle = '#3a200d';
        ctx.fillRect(x + 5, y + 12, 6, 3);
        break;

      case 37: // Pine Tree Top (Mountain / Deepwood)
        ctx.fillStyle = '#2a5e2c';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#064e3b';
        ctx.beginPath();
        ctx.moveTo(x + 8, y + 1);
        ctx.lineTo(x + 14, y + 14);
        ctx.lineTo(x + 2, y + 14);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#047857';
        ctx.beginPath();
        ctx.moveTo(x + 8, y + 3);
        ctx.lineTo(x + 12, y + 12);
        ctx.lineTo(x + 4, y + 12);
        ctx.closePath();
        ctx.fill();
        break;

      case 38: // Pine Tree Base
        ctx.fillStyle = '#2a5e2c';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#064e3b';
        ctx.fillRect(x + 3, y, 10, 6);
        ctx.fillStyle = '#452610';
        ctx.fillRect(x + 6, y + 6, 4, 8);
        break;

      case 39: // Wildflower Patch
        ctx.fillStyle = '#4b8f3c';
        ctx.fillRect(x, y, S, S);
        // Red, yellow, blue, white petals
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(x + 3, y + 3, 2, 2);
        ctx.fillStyle = '#facc15';
        ctx.fillRect(x + 10, y + 4, 2, 2);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(x + 4, y + 10, 2, 2);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(x + 11, y + 11, 2, 2);
        break;

      case 40: // Shrub / Bush
        ctx.fillStyle = '#4b8f3c';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#166534';
        ctx.beginPath();
        ctx.arc(x + 8, y + 9, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(x + 7, y + 7, 3, 0, Math.PI * 2);
        ctx.fill();
        // Red berries
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(x + 6, y + 8, 1, 1);
        ctx.fillRect(x + 9, y + 10, 1, 1);
        break;

      case 41: // Fairy Ring / Glowing Mushroom
        ctx.fillStyle = '#2a5e2c';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#38bdf8'; // Glowing azure mushroom cap
        ctx.beginPath();
        ctx.arc(x + 8, y + 6, 4, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = '#e0f2fe';
        ctx.fillRect(x + 7, y + 6, 2, 5);
        // Spores
        ctx.fillStyle = '#7dd3fc';
        ctx.fillRect(x + 3, y + 10, 1, 1);
        ctx.fillRect(x + 12, y + 4, 1, 1);
        break;

      case 42: // Small Boulder
        ctx.fillStyle = '#4b8f3c';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.arc(x + 8, y + 9, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(x + 6, y + 7, 2, 2);
        break;

      case 43: // Large Mossy Boulder
        ctx.fillStyle = '#4b8f3c';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.arc(x + 8, y + 8, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#22c55e'; // Green moss
        ctx.fillRect(x + 5, y + 4, 4, 3);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x + 4, y + 12, 8, 2);
        break;

      // Props, POIs & Landmarks (50-70)
      case 50: // Wooden Barrel
        ctx.fillStyle = '#4b8f3c';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(x + 4, y + 3, 8, 10);
        ctx.fillStyle = '#92400e';
        ctx.fillRect(x + 5, y + 4, 6, 8);
        ctx.fillStyle = '#451a03'; // Iron hoops
        ctx.fillRect(x + 4, y + 5, 8, 1);
        ctx.fillRect(x + 4, y + 10, 8, 1);
        break;

      case 51: // Wooden Crate
        ctx.fillStyle = '#4b8f3c';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#854d0e';
        ctx.fillRect(x + 3, y + 3, 10, 10);
        ctx.fillStyle = '#a16207';
        ctx.fillRect(x + 4, y + 4, 8, 8);
        ctx.fillStyle = '#713f12'; // Diagonal cross
        ctx.beginPath();
        ctx.moveTo(x + 4, y + 4);
        ctx.lineTo(x + 12, y + 12);
        ctx.moveTo(x + 12, y + 4);
        ctx.lineTo(x + 4, y + 12);
        ctx.stroke();
        break;

      case 52: // Signpost
        ctx.fillStyle = '#4b8f3c';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#5c3619'; // Post
        ctx.fillRect(x + 7, y + 6, 2, 8);
        ctx.fillStyle = '#b45309'; // Wooden sign board
        ctx.fillRect(x + 3, y + 3, 10, 5);
        ctx.fillStyle = '#451a03';
        ctx.fillRect(x + 5, y + 5, 6, 1);
        break;

      case 53: // Lamp Post
        ctx.fillStyle = '#64748b'; // Pavement base
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#1e293b'; // Cast iron post
        ctx.fillRect(x + 7, y + 3, 2, 11);
        ctx.fillStyle = '#fef08a'; // Golden lantern bulb
        ctx.fillRect(x + 6, y + 2, 4, 4);
        ctx.fillStyle = '#eab308';
        ctx.strokeRect(x + 5.5, y + 1.5, 4, 4);
        break;

      case 54: // Stone Well
        ctx.fillStyle = '#4b8f3c';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#64748b'; // Round stone rim
        ctx.beginPath();
        ctx.arc(x + 8, y + 9, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0284c7'; // Deep blue water inside
        ctx.beginPath();
        ctx.arc(x + 8, y + 9, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#78350f'; // Wooden crossbeam
        ctx.fillRect(x + 3, y + 2, 10, 2);
        ctx.fillRect(x + 7, y + 4, 2, 3);
        break;

      case 55: // Treasure Chest - Closed
        ctx.fillStyle = '#4b8f3c';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#854d0e';
        ctx.fillRect(x + 3, y + 4, 10, 8);
        ctx.fillStyle = '#eab308'; // Gold bands
        ctx.fillRect(x + 3, y + 7, 10, 2);
        ctx.fillRect(x + 7, y + 6, 2, 3);
        break;

      case 56: // Treasure Chest - Opened
        ctx.fillStyle = '#4b8f3c';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#713f12';
        ctx.fillRect(x + 3, y + 6, 10, 6);
        ctx.fillStyle = '#451a03'; // Opened lid inside
        ctx.fillRect(x + 3, y + 2, 10, 4);
        ctx.fillStyle = '#facc15'; // Glowing gold coins inside
        ctx.fillRect(x + 5, y + 6, 6, 3);
        break;

      case 57: // Ancient Runestone / Monolith
        ctx.fillStyle = '#4b8f3c';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#475569';
        ctx.fillRect(x + 4, y + 2, 8, 12);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(x + 5, y + 3, 6, 10);
        ctx.fillStyle = '#38bdf8'; // Glowing runes
        ctx.fillRect(x + 7, y + 4, 2, 2);
        ctx.fillRect(x + 6, y + 7, 4, 1);
        ctx.fillRect(x + 7, y + 9, 2, 2);
        break;

      case 58: // Shrine Pedestal
        ctx.fillStyle = '#475569';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#94a3b8'; // Stone pedestal
        ctx.fillRect(x + 3, y + 7, 10, 7);
        ctx.fillRect(x + 2, y + 12, 12, 3);
        ctx.fillStyle = '#a855f7'; // Glowing purple relic
        ctx.beginPath();
        ctx.arc(x + 8, y + 4, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#e9d5ff';
        ctx.fillRect(x + 7, y + 3, 2, 2);
        break;

      case 59: // Cave / Dungeon Entrance
        ctx.fillStyle = '#334155'; // Rock cliff surrounding
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#020617'; // Deep black portal arch
        ctx.beginPath();
        ctx.arc(x + 8, y + 8, 6, Math.PI, 0);
        ctx.lineTo(x + 14, y + 16);
        ctx.lineTo(x + 2, y + 16);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#38bdf8'; // Subtle mystic glimmer
        ctx.fillRect(x + 7, y + 12, 2, 2);
        break;

      case 60: // Campfire
        ctx.fillStyle = '#4b8f3c';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#334155'; // Firepit stones
        ctx.beginPath();
        ctx.arc(x + 8, y + 9, 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#ea580c'; // Fire flame
        ctx.beginPath();
        ctx.moveTo(x + 8, y + 4);
        ctx.lineTo(x + 11, y + 11);
        ctx.lineTo(x + 5, y + 11);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#fde047'; // Inner yellow flame
        ctx.fillRect(x + 7, y + 7, 2, 3);
        break;

      case 61: // Market Stall Canopy (Red/White striped)
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(x + 4, y, 4, S);
        ctx.fillRect(x + 12, y, 4, S);
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(x, y + 14, S, 2);
        break;

      case 62: // Shipwreck Timber Rib
        ctx.fillStyle = '#d6ba82'; // Sand
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#452610'; // Broken weathered keel
        ctx.beginPath();
        ctx.moveTo(x + 2, y + 14);
        ctx.lineTo(x + 14, y + 2);
        ctx.lineTo(x + 12, y + 1);
        ctx.lineTo(x + 1, y + 12);
        ctx.closePath();
        ctx.fill();
        break;

      case 63: // Clocktower Gear Ornament
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#d97706'; // Golden brass gear
        ctx.beginPath();
        ctx.arc(x + 8, y + 8, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(x + 7, y + 7, 2, 2);
        break;

      default:
        // Generic fallback checkerboard
        ctx.fillStyle = (x + y) % 2 === 0 ? '#4a5568' : '#2d3748';
        ctx.fillRect(x, y, S, S);
        break;
    }
  }

  /**
   * Draws a single 16x16 humanoid character frame
   */
  private static drawCharacterSprite(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    dir: number, // 0: Down, 1: Left, 2: Right, 3: Up
    frame: number, // 0: Idle/Step1, 1: Walk1, 2: Walk2
    palette: string[] // [hair, skin, tunic, pants]
  ): void {
    const [hair, skin, tunic, pants] = palette;

    // Head / Face
    ctx.fillStyle = skin;
    ctx.fillRect(x + 5, y + 2, 6, 5);

    // Hair
    ctx.fillStyle = hair;
    if (dir === 3) {
      // Facing Up (Back of head)
      ctx.fillRect(x + 4, y + 1, 8, 6);
    } else {
      ctx.fillRect(x + 4, y + 1, 8, 3);
      ctx.fillRect(x + 4, y + 4, 1, 3);
      ctx.fillRect(x + 11, y + 4, 1, 3);
    }

    // Eyes
    if (dir === 0) { // Facing Down
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + 6, y + 4, 1, 1);
      ctx.fillRect(x + 9, y + 4, 1, 1);
    } else if (dir === 1) { // Left
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + 5, y + 4, 1, 1);
    } else if (dir === 2) { // Right
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + 10, y + 4, 1, 1);
    }

    // Body / Tunic
    ctx.fillStyle = tunic;
    ctx.fillRect(x + 5, y + 7, 6, 5);

    // Arms
    ctx.fillStyle = skin;
    if (dir === 1) {
      ctx.fillRect(x + 4, y + 8, 2, 3);
    } else if (dir === 2) {
      ctx.fillRect(x + 10, y + 8, 2, 3);
    } else {
      ctx.fillRect(x + 3, y + 8, 2, 3);
      ctx.fillRect(x + 11, y + 8, 2, 3);
    }

    // Legs / Pants & Walk animation offset
    ctx.fillStyle = pants;
    const legOffset = frame === 1 ? -1 : (frame === 2 ? 1 : 0);

    if (dir === 1 || dir === 2) {
      // Side walk
      ctx.fillRect(x + 6 + legOffset, y + 12, 4, 4);
    } else {
      // Down or Up walk
      ctx.fillRect(x + 5, y + 12 + (frame === 1 ? -1 : 0), 2, 4);
      ctx.fillRect(x + 9, y + 12 + (frame === 2 ? -1 : 0), 2, 4);
    }
  }
}
