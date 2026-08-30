import Phaser from 'phaser';
import { CompiledMap, WorldBible, NPC, POI, SecretLocation, Region } from '@/types/world';
import { UIManager } from '../ui/UIManager';
import { SaveSystem, SaveData } from '../systems/SaveSystem';
import { SoundFX } from '../assets/SoundFX';

export class WorldScene extends Phaser.Scene {
  private mapData!: CompiledMap;
  private bibleData!: WorldBible;
  private saveData!: SaveData;
  private uiManager!: UIManager;

  // Player & Controls
  private player!: Phaser.GameObjects.Sprite;
  private playerBody!: Phaser.Physics.Arcade.Body;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
    Shift: Phaser.Input.Keyboard.Key;
    E: Phaser.Input.Keyboard.Key;
    Space: Phaser.Input.Keyboard.Key;
  };

  private currentFacing: 'down' | 'left' | 'right' | 'up' = 'down';
  private playerSpeed = 110;
  private isSprinting = false;
  private superSpeed = false;

  // World Rendering
  private tilemap!: Phaser.Tilemaps.Tilemap;
  private groundLayer!: Phaser.Tilemaps.TilemapLayer;
  private terrainLayer!: Phaser.Tilemaps.TilemapLayer;
  private lowerObjLayer!: Phaser.Tilemaps.TilemapLayer;
  private upperObjLayer!: Phaser.Tilemaps.TilemapLayer;

  // Entities
  private npcSprites: Map<string, Phaser.GameObjects.Sprite> = new Map();
  private poiTriggers: POI[] = [];
  private secretTriggers: SecretLocation[] = [];
  private currentActiveTarget: { type: 'npc' | 'poi' | 'secret'; data: any } | null = null;

  // Atmosphere & Lighting
  private ambientDayNightOverlay!: Phaser.GameObjects.Rectangle;
  private cloudShadows: Phaser.GameObjects.Graphics[] = [];
  private weatherEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private fireflyEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private worldTimeMinutes = 720; // Starts at 12:00 PM (noon)
  private currentRegionId = '';

  // Debug
  private showCollisionDebug = false;
  private debugGraphics!: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: 'WorldScene' });
  }

  public init(data: { compiledMap: CompiledMap; worldBible: WorldBible }): void {
    this.mapData = data.compiledMap;
    this.bibleData = data.worldBible;

    // Load or create persistence
    const loadedSave = SaveSystem.load();
    this.saveData = loadedSave || SaveSystem.createDefaultSave(this.mapData.spawnPoint);
  }

  public create(): void {
    const W = this.mapData.width;
    const H = this.mapData.height;
    const tileSize = this.mapData.tileSize;

    // 1. Initialize UIManager
    this.uiManager = UIManager.init(this.mapData, this.bibleData, this.saveData);
    this.uiManager.setOnTeleport((tx, ty) => this.teleportPlayer(tx, ty));

    // 2. Build Tilemap and Layers
    this.tilemap = this.make.tilemap({
      tileWidth: tileSize,
      tileHeight: tileSize,
      width: W,
      height: H,
    });

    const tileset = this.tilemap.addTilesetImage('tileset', 'tileset', tileSize, tileSize, 0, 0)!;

    this.groundLayer = this.tilemap.createBlankLayer('ground', tileset)!;
    this.terrainLayer = this.tilemap.createBlankLayer('terrain', tileset)!;
    this.lowerObjLayer = this.tilemap.createBlankLayer('lowerObjects', tileset)!;
    this.upperObjLayer = this.tilemap.createBlankLayer('upperObjects', tileset)!;

    // Populate tile layers from compiled data
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const gTile = this.mapData.layers.ground[y][x];
        const tTile = this.mapData.layers.terrain[y][x];
        const lTile = this.mapData.layers.lowerObjects[y][x];
        const uTile = this.mapData.layers.upperObjects[y][x];

        if (gTile > 0) this.groundLayer.putTileAt(gTile, x, y);
        if (tTile > 0) this.terrainLayer.putTileAt(tTile, x, y);
        if (lTile > 0) this.lowerObjLayer.putTileAt(lTile, x, y);
        if (uTile > 0) this.upperObjLayer.putTileAt(uTile, x, y);
      }
    }

    this.groundLayer.setDepth(1);
    this.terrainLayer.setDepth(2);
    this.lowerObjLayer.setDepth(3);
    this.upperObjLayer.setDepth(100); // Upper objects (roofs, tree canopies) always draw above player

    // 3. Create Player Character
    const startX = this.saveData.playerPosition.x * tileSize + tileSize / 2;
    const startY = this.saveData.playerPosition.y * tileSize + tileSize / 2;

    this.player = this.physics.add.sprite(startX, startY, 'characters', 'char_frame_0_0');
    this.player.setDepth(10);
    this.playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    this.playerBody.setSize(12, 10);
    this.playerBody.setOffset(2, 6);

    // 4. Create NPC Sprites
    for (const npc of this.mapData.npcs) {
      const nx = npc.position.x * tileSize + tileSize / 2;
      const ny = npc.position.y * tileSize + tileSize / 2;
      const sprite = this.add.sprite(nx, ny, 'characters', `char_frame_${npc.spriteIndex * 3}_0`);
      sprite.setDepth(ny);
      this.npcSprites.set(npc.id, sprite);
    }

    this.poiTriggers = this.mapData.pois;
    this.secretTriggers = this.mapData.secrets;

    // 5. Setup Camera
    this.cameras.main.setBounds(0, 0, W * tileSize, H * tileSize);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setZoom(2.8);

    // 6. Setup Controls
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasdKeys = {
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      Shift: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT),
      E: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      Space: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
    };

    // 7. Setup Dynamic Weather & Atmosphere
    this.setupAtmosphericSystems(W * tileSize, H * tileSize);

    // 8. Day / Night Overlay
    this.ambientDayNightOverlay = this.add.rectangle(0, 0, W * tileSize, H * tileSize, 0x10172a, 0);
    this.ambientDayNightOverlay.setOrigin(0, 0);
    this.ambientDayNightOverlay.setDepth(90);

    // 9. Debug Graphics
    this.debugGraphics = this.add.graphics();
    this.debugGraphics.setDepth(200);

    const collisionToggle = document.getElementById('dbg-collision-toggle') as HTMLInputElement;
    collisionToggle?.addEventListener('change', (e) => {
      this.showCollisionDebug = (e.target as HTMLInputElement).checked;
      this.debugGraphics.clear();
    });

    const speedToggle = document.getElementById('dbg-speed-toggle') as HTMLInputElement;
    speedToggle?.addEventListener('change', (e) => {
      this.superSpeed = (e.target as HTMLInputElement).checked;
    });

    // Announce starting region
    this.checkRegionChange(true);
  }

  public update(_time: number, delta: number): void {
    // 1. Handle Player Movement & Animation
    this.handlePlayerMovement();

    // 2. Depth Sort Player & NPCs
    this.player.setDepth(this.player.y + 4);
    for (const [_, sprite] of this.npcSprites.entries()) {
      sprite.setDepth(sprite.y + 4);
    }

    // 3. Check Interaction Targets
    this.checkInteractionProximity();

    // 4. Update Time & Day/Night Lighting Cycle
    this.updateDayNightCycle(delta);

    // 5. Update Region Boundaries & Banner
    this.checkRegionChange();

    // 6. Update HUD & Debug Info
    this.updateHUDAndDebug();

    // 7. Render Collision Debug Wireframes if enabled
    if (this.showCollisionDebug) {
      this.renderCollisionDebug();
    }
  }

  private handlePlayerMovement(): void {
    if (this.uiManager.isDialogueOpen()) {
      this.playerBody.setVelocity(0, 0);
      this.player.anims.play(`char_0_idle_${this.currentFacing}`, true);
      return;
    }

    let vx = 0;
    let vy = 0;

    const left = this.cursors.left.isDown || this.wasdKeys.A.isDown;
    const right = this.cursors.right.isDown || this.wasdKeys.D.isDown;
    const up = this.cursors.up.isDown || this.wasdKeys.W.isDown;
    const down = this.cursors.down.isDown || this.wasdKeys.S.isDown;

    if (left) vx -= 1;
    if (right) vx += 1;
    if (up) vy -= 1;
    if (down) vy += 1;

    this.isSprinting = this.wasdKeys.Shift.isDown || this.cursors.shift.isDown;
    let speed = this.isSprinting ? 180 : this.playerSpeed;
    if (this.superSpeed) speed = 320;

    if (vx !== 0 && vy !== 0) {
      vx *= 0.7071;
      vy *= 0.7071;
    }

    const proposedVx = vx * speed;
    const proposedVy = vy * speed;

    // Check tile-based collision ahead
    const tileSize = this.mapData.tileSize;

    // Allow sliding against walls
    let finalVx = proposedVx;
    let finalVy = proposedVy;

    if (this.isTileBlocked(Math.floor((this.player.x + (proposedVx * 1) / 60) / tileSize), Math.floor(this.player.y / tileSize))) {
      finalVx = 0;
    }
    if (this.isTileBlocked(Math.floor(this.player.x / tileSize), Math.floor((this.player.y + (proposedVy * 1) / 60) / tileSize))) {
      finalVy = 0;
    }

    this.playerBody.setVelocity(finalVx, finalVy);

    // Animations & Facing
    if (finalVx !== 0 || finalVy !== 0) {
      if (Math.abs(finalVx) > Math.abs(finalVy)) {
        this.currentFacing = finalVx > 0 ? 'right' : 'left';
      } else {
        this.currentFacing = finalVy > 0 ? 'down' : 'up';
      }
      this.player.anims.play(`char_0_walk_${this.currentFacing}`, true);
    } else {
      this.player.anims.play(`char_0_idle_${this.currentFacing}`, true);
    }

    // Save player tile pos periodically
    this.saveData.playerPosition = { x: Math.floor(this.player.x / tileSize), y: Math.floor(this.player.y / tileSize) };

    // Interaction Trigger Key
    if (Phaser.Input.Keyboard.JustDown(this.wasdKeys.E) || Phaser.Input.Keyboard.JustDown(this.wasdKeys.Space)) {
      this.handleInteract();
    }
  }

  private isTileBlocked(tx: number, ty: number): boolean {
    if (tx < 0 || tx >= this.mapData.width || ty < 0 || ty >= this.mapData.height) return true;
    return this.mapData.layers.collision[ty][tx];
  }

  private checkInteractionProximity(): void {
    if (this.uiManager.isDialogueOpen()) {
      this.uiManager.hideInteractionPrompt();
      return;
    }

    const pPos = { x: this.player.x, y: this.player.y };
    const interactionRadius = 24; // 1.5 tiles
    let target: { type: 'npc' | 'poi' | 'secret'; data: any } | null = null;
    let minDistance = Infinity;

    // Check NPCs
    for (const npc of this.mapData.npcs) {
      const nx = npc.position.x * 16 + 8;
      const ny = npc.position.y * 16 + 8;
      const dist = Math.hypot(pPos.x - nx, pPos.y - ny);
      if (dist < interactionRadius && dist < minDistance) {
        minDistance = dist;
        target = { type: 'npc', data: npc };
      }
    }

    // Check POIs
    for (const poi of this.poiTriggers) {
      const px = poi.position.x * 16 + 8;
      const py = poi.position.y * 16 + 8;
      const dist = Math.hypot(pPos.x - px, pPos.y - py);
      if (dist < interactionRadius && dist < minDistance) {
        minDistance = dist;
        target = { type: 'poi', data: poi };
      }
    }

    // Check Secrets
    for (const sec of this.secretTriggers) {
      const sx = sec.position.x * 16 + 8;
      const sy = sec.position.y * 16 + 8;
      const dist = Math.hypot(pPos.x - sx, pPos.y - sy);
      if (dist < interactionRadius && dist < minDistance) {
        minDistance = dist;
        target = { type: 'secret', data: sec };
      }
    }

    this.currentActiveTarget = target;

    if (target) {
      if (target.type === 'npc') {
        this.uiManager.showInteractionPrompt(`[E] Talk to ${(target.data as NPC).name}`);
      } else if (target.type === 'poi') {
        this.uiManager.showInteractionPrompt(`[E] Examine ${(target.data as POI).name}`);
      } else if (target.type === 'secret') {
        const isDiscovered = this.saveData.discoveredSecrets.includes(target.data.id);
        this.uiManager.showInteractionPrompt(`[E] ${isDiscovered ? 'Examine' : 'Open'} Secret Chest`);
      }
    } else {
      this.uiManager.hideInteractionPrompt();
    }
  }

  private handleInteract(): void {
    if (!this.currentActiveTarget) return;

    const { type, data } = this.currentActiveTarget;

    if (type === 'npc') {
      const npc = data as NPC;
      const firstNode = npc.dialogueTree[0];
      const speaker = {
        name: npc.name,
        role: npc.role,
        avatar: npc.avatarEmoji,
      };

      const choices = firstNode.choices?.map((c) => ({
        text: c.text,
        onSelect: () => {
          if (c.nextNodeId) {
            const nextNode = npc.dialogueTree.find((n) => n.id === c.nextNodeId);
            if (nextNode) {
              this.uiManager.startDialogue(speaker, nextNode.text);
            }
          }
        },
      }));

      // Record NPC interaction in save data
      if (!this.saveData.interactedPOIs.includes(npc.id)) {
        this.saveData.interactedPOIs.push(npc.id);
        SaveSystem.save(this.saveData);
      }

      this.uiManager.startDialogue(speaker, firstNode.text, choices);
    } else if (type === 'poi') {
      const poi = data as POI;
      SoundFX.playDiscovery();

      // Check micro-story progression
      let storyText = poi.examineText;
      if (poi.microStoryId) {
        const story = this.bibleData.microStories.find((s) => s.id === poi.microStoryId);
        if (story) {
          const step = story.steps.find((st) => st.locationId === poi.id);
          if (step) {
            this.saveData.storyFlags[step.setsFlag] = true;
            SaveSystem.save(this.saveData);
          }
        }
      }

      this.uiManager.startDialogue(
        { name: poi.name, role: 'Point of Interest', avatar: '🏛️' },
        storyText
      );
    } else if (type === 'secret') {
      const sec = data as SecretLocation;
      const alreadyFound = this.saveData.discoveredSecrets.includes(sec.id);

      if (!alreadyFound) {
        SoundFX.playDiscovery();
        this.saveData.discoveredSecrets.push(sec.id);
        this.saveData.storyFlags[sec.discoveryFlag] = true;
        SaveSystem.save(this.saveData);

        this.uiManager.startDialogue(
          { name: sec.name, role: 'Secret Discovery!', avatar: '🤫' },
          `✨ SECRET UNCOVERED! ${sec.rewardDescription}`
        );
      } else {
        this.uiManager.startDialogue(
          { name: sec.name, role: 'Discovered Secret', avatar: '🤫' },
          `The chest rests open. ${sec.rewardDescription}`
        );
      }
    }
  }

  private setupAtmosphericSystems(worldW: number, worldH: number): void {
    // 1. Moving Cloud Shadows
    for (let i = 0; i < 6; i++) {
      const cloud = this.add.graphics();
      cloud.fillStyle(0x000000, 0.12);
      cloud.fillEllipse(0, 0, 180, 90);
      cloud.setPosition(Phaser.Math.Between(0, worldW), Phaser.Math.Between(0, worldH));
      cloud.setDepth(80);
      this.cloudShadows.push(cloud);
    }

    // 2. Weather Particles Texture (Procedural white dot / leaf)
    if (!this.textures.exists('particle_leaf')) {
      const pCanvas = document.createElement('canvas');
      pCanvas.width = 6;
      pCanvas.height = 6;
      const pCtx = pCanvas.getContext('2d')!;
      pCtx.fillStyle = '#22c55e';
      pCtx.beginPath();
      pCtx.ellipse(3, 3, 3, 1.5, Math.PI / 4, 0, Math.PI * 2);
      pCtx.fill();
      this.textures.addCanvas('particle_leaf', pCanvas);
    }

    if (!this.textures.exists('particle_firefly')) {
      const fCanvas = document.createElement('canvas');
      fCanvas.width = 4;
      fCanvas.height = 4;
      const fCtx = fCanvas.getContext('2d')!;
      fCtx.fillStyle = '#facc15';
      fCtx.beginPath();
      fCtx.arc(2, 2, 2, 0, Math.PI * 2);
      fCtx.fill();
      this.textures.addCanvas('particle_firefly', fCanvas);
    }

    // Emitters follow player camera
    const particles = this.add.particles(0, 0, 'particle_leaf', {
      x: { min: -400, max: 400 },
      y: { min: -300, max: 300 },
      speedX: { min: -30, max: -10 },
      speedY: { min: 20, max: 40 },
      scale: { start: 1, end: 0.5 },
      alpha: { start: 0.7, end: 0 },
      lifespan: 3000,
      frequency: 180,
    });
    particles.setDepth(85);
    this.weatherEmitter = particles;

    const fireflies = this.add.particles(0, 0, 'particle_firefly', {
      x: { min: -400, max: 400 },
      y: { min: -300, max: 300 },
      speedX: { min: -8, max: 8 },
      speedY: { min: -8, max: 8 },
      scale: { start: 1.2, end: 0.4 },
      alpha: { start: 0.9, end: 0.1 },
      lifespan: 2200,
      frequency: 250,
    });
    fireflies.setDepth(86);
    this.fireflyEmitter = fireflies;
  }

  private updateDayNightCycle(delta: number): void {
    // 1 real second = 4 in-game minutes (full day cycle ~6 minutes)
    this.worldTimeMinutes += (delta / 1000) * 4;
    if (this.worldTimeMinutes >= 1440) {
      this.worldTimeMinutes -= 1440;
    }

    const hours = Math.floor(this.worldTimeMinutes / 60);
    const mins = Math.floor(this.worldTimeMinutes % 60);
    const timeStr = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;

    // Drift cloud shadows slowly east
    for (const cloud of this.cloudShadows) {
      cloud.x += (delta / 1000) * 12;
      cloud.y += (delta / 1000) * 4;
      if (cloud.x > this.mapData.width * 16 + 200) {
        cloud.x = -200;
        cloud.y = Phaser.Math.Between(0, this.mapData.height * 16);
      }
    }

    // Follow player with particle emitters
    this.weatherEmitter.setPosition(this.player.x, this.player.y);
    this.fireflyEmitter.setPosition(this.player.x, this.player.y);

    // Calculate Ambient Lighting Alpha & Tint based on Hour
    let ambientAlpha = 0;
    let ambientColor = 0x10172a; // Midnight blue

    if (hours >= 20 || hours < 5) {
      // Deep Night (20:00 - 05:00)
      ambientAlpha = 0.52;
      ambientColor = 0x0a1128;
      this.fireflyEmitter.start();
    } else if (hours >= 5 && hours < 8) {
      // Sunrise / Golden Morning (05:00 - 08:00)
      const progress = (hours - 5) / 3;
      ambientAlpha = (1 - progress) * 0.45;
      ambientColor = 0xd97706;
      this.fireflyEmitter.stop();
    } else if (hours >= 8 && hours < 17) {
      // Clear Daylight (08:00 - 17:00)
      ambientAlpha = 0.0;
      this.fireflyEmitter.stop();
    } else {
      // Sunset (17:00 - 20:00)
      const progress = (hours - 17) / 3;
      ambientAlpha = progress * 0.48;
      ambientColor = 0xb45309;
      this.fireflyEmitter.start();
    }

    // Deepwood localized atmospheric enhancement
    const currentReg = this.getCurrentRegion();
    if (currentReg && currentReg.id === 'region_deepwood') {
      // In Deepwood, add mystical enchanted tint even in daytime and keep spores/fireflies active
      ambientAlpha = Math.max(0.25, ambientAlpha);
      ambientColor = 0x06282d; // Deep enchanted teal-indigo
      this.fireflyEmitter.start();
    }

    this.ambientDayNightOverlay.setFillStyle(ambientColor, ambientAlpha);
    this.ambientDayNightOverlay.setPosition(this.player.x - 800, this.player.y - 600);
    this.ambientDayNightOverlay.setSize(1600, 1200);

    const timeLabel = hours >= 6 && hours < 18 ? `Day (${timeStr})` : `Night (${timeStr})`;
    this.uiManager.updateHUD(currentReg ? currentReg.name : 'Aethelgard Wilds', timeLabel);
  }

  private checkRegionChange(force = false): void {
    const reg = this.getCurrentRegion();
    if (!reg) return;

    if (reg.id !== this.currentRegionId || force) {
      this.currentRegionId = reg.id;
      this.uiManager.showLocationBanner(reg);
    }
  }

  private getCurrentRegion(): Region | null {
    const tx = Math.floor(this.player.x / 16);
    const ty = Math.floor(this.player.y / 16);

    for (const r of this.mapData.regions) {
      if (
        tx >= r.bounds.x &&
        tx < r.bounds.x + r.bounds.width &&
        ty >= r.bounds.y &&
        ty < r.bounds.y + r.bounds.height
      ) {
        return r;
      }
    }
    return this.mapData.regions[0] || null;
  }

  private updateHUDAndDebug(): void {
    const tx = Math.floor(this.player.x / 16);
    const ty = Math.floor(this.player.y / 16);
    const reg = this.getCurrentRegion();
    const chunkX = Math.floor(tx / 24);
    const chunkY = Math.floor(ty / 24);

    this.uiManager.updateDebugInfo({
      x: this.player.x,
      y: this.player.y,
      tileX: tx,
      tileY: ty,
      regionName: reg ? reg.name : 'Unknown',
      chunkX,
      chunkY,
      biome: reg ? reg.biome.toUpperCase() : 'WILDLANDS',
      seed: 'Aethelgard-4891',
      fps: Math.round(this.game.loop.actualFps),
      nearbyCount: `${this.mapData.npcs.length} NPCs, ${this.mapData.pois.length} POIs`,
    });
  }

  private renderCollisionDebug(): void {
    this.debugGraphics.clear();
    const tileSize = 16;
    const pTileX = Math.floor(this.player.x / tileSize);
    const pTileY = Math.floor(this.player.y / tileSize);

    // Draw only tiles around the viewport
    this.debugGraphics.lineStyle(1, 0xef4444, 0.6);
    this.debugGraphics.fillStyle(0xef4444, 0.25);

    for (let dy = -16; dy <= 16; dy++) {
      for (let dx = -20; dx <= 20; dx++) {
        const cx = pTileX + dx;
        const cy = pTileY + dy;
        if (cx >= 0 && cx < this.mapData.width && cy >= 0 && cy < this.mapData.height) {
          if (this.mapData.layers.collision[cy][cx]) {
            this.debugGraphics.fillRect(cx * tileSize, cy * tileSize, tileSize, tileSize);
            this.debugGraphics.strokeRect(cx * tileSize, cy * tileSize, tileSize, tileSize);
          }
        }
      }
    }
  }

  private teleportPlayer(tx: number, ty: number): void {
    this.player.setPosition(tx * 16 + 8, ty * 16 + 8);
    this.cameras.main.centerOn(this.player.x, this.player.y);
    this.checkRegionChange(true);
  }
}
