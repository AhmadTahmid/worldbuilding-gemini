import Phaser from 'phaser';
import { TileAtlasGenerator } from '../assets/TileAtlasGenerator';
import { CompiledMap, WorldBible, WorldSpec } from '@/types/world';
import { WorldCompiler } from '@/world/generator/WorldCompiler';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  public preload(): void {
    // 1. Generate & Register Master 16x16 Pixel Tileset Texture
    const tilesetCanvas = TileAtlasGenerator.generateTilesetCanvas();
    this.textures.addCanvas('tileset', tilesetCanvas);

    // 2. Generate & Register Character Spritesheet Texture
    const charCanvas = TileAtlasGenerator.generateCharactersCanvas();
    this.textures.addCanvas('characters', charCanvas);

    // 3. Load pre-compiled world JSON if available
    this.load.json('world_data', '/data/compiled-world.json');
    this.load.json('world_bible', '/data/world-bible.json');
  }

  public create(): void {
    // Create Character Walk Animations for all 12 character types
    for (let c = 0; c < 12; c++) {
      const directions = ['down', 'left', 'right', 'up'];
      for (let d = 0; d < 4; d++) {
        const dirName = directions[d];
        const animKey = `char_${c}_walk_${dirName}`;
        const idleKey = `char_${c}_idle_${dirName}`;

        // Create frames for this character, direction, and animation frames
        const frame0 = this.getCharacterFrame(c, d, 0);
        const frame1 = this.getCharacterFrame(c, d, 1);
        const frame2 = this.getCharacterFrame(c, d, 2);

        if (!this.anims.exists(animKey)) {
          this.anims.create({
            key: animKey,
            frames: [
              { key: 'characters', frame: frame1 },
              { key: 'characters', frame: frame0 },
              { key: 'characters', frame: frame2 },
              { key: 'characters', frame: frame0 },
            ],
            frameRate: 6,
            repeat: -1,
          });
        }

        if (!this.anims.exists(idleKey)) {
          this.anims.create({
            key: idleKey,
            frames: [{ key: 'characters', frame: frame0 }],
            frameRate: 1,
            repeat: 0,
          });
        }
      }
    }

    // Retrieve or compile world
    let compiledMap: CompiledMap | null = this.cache.json.get('world_data');
    const worldBible: WorldBible = this.cache.json.get('world_bible') || {
      worldName: 'Aethelgard',
      era: 'The Fourth Century of the Calmed Seas',
      historySummary: '',
      regions: [],
      settlements: [],
      factions: [],
      microStories: [],
      legends: [],
      mysteries: [],
    };

    if (!compiledMap) {
      // Fallback dynamic compilation in browser
      const spec: WorldSpec = {
        seed: 'Aethelgard-4891',
        widthTiles: 288,
        heightTiles: 240,
        tileSize: 16,
        macroChunkSize: 24,
        worldName: 'Aethelgard',
        era: 'The Fourth Century of the Calmed Seas',
      };
      const res = WorldCompiler.compile(spec, worldBible);
      compiledMap = res.map;
    }

    // Launch World Scene
    this.scene.start('WorldScene', { compiledMap, worldBible });
  }

  private getCharacterFrame(charIndex: number, dir: number, frame: number): string {
    const colIndex = charIndex * 3 + frame;
    const frameName = `char_frame_${colIndex}_${dir}`;

    if (!this.textures.get('characters').has(frameName)) {
      this.textures.get('characters').add(
        frameName,
        0,
        colIndex * 16,
        dir * 16,
        16,
        16
      );
    }

    return frameName;
  }
}
