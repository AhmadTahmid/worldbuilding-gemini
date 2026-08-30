import type { CompiledMap, WorldBible, Region } from '@/types/world';
import { SaveData, SaveSystem } from '../systems/SaveSystem';
import { SoundFX } from '../assets/SoundFX';

export class UIManager {
  private static instance: UIManager | null = null;

  private mapData!: CompiledMap;
  private bibleData!: WorldBible;
  private saveData!: SaveData;

  // DOM Elements
  private dialogueBox = document.getElementById('dialogue-box')!;
  private dialogueAvatar = document.getElementById('dialogue-avatar')!;
  private dialogueSpeakerName = document.getElementById('dialogue-speaker-name')!;
  private dialogueSpeakerRole = document.getElementById('dialogue-speaker-role')!;
  private dialogueText = document.getElementById('dialogue-text')!;
  private dialogueChoices = document.getElementById('dialogue-choices')!;

  private locationBanner = document.getElementById('location-banner')!;
  private bannerRegionName = document.getElementById('banner-region-name')!;
  private bannerRegionSubtitle = document.getElementById('banner-region-subtitle')!;

  private interactionPrompt = document.getElementById('interaction-prompt')!;
  private promptActionText = document.getElementById('prompt-action-text')!;

  private hudLocationText = document.getElementById('hud-location-text')!;
  private hudTimeText = document.getElementById('hud-time-text')!;

  private worldMapModal = document.getElementById('world-map-modal')!;
  private worldMapCanvas = document.getElementById('world-map-canvas') as HTMLCanvasElement;
  private codexModal = document.getElementById('codex-modal')!;
  private codexPaneContent = document.getElementById('codex-pane-content')!;
  private debugOverlay = document.getElementById('debug-overlay')!;

  private dbgPos = document.getElementById('dbg-pos')!;
  private dbgRegion = document.getElementById('dbg-region')!;
  private dbgBiome = document.getElementById('dbg-biome')!;
  private dbgSeed = document.getElementById('dbg-seed')!;
  private dbgFps = document.getElementById('dbg-fps')!;
  private dbgEntities = document.getElementById('dbg-entities')!;
  private dbgTeleportSelect = document.getElementById('dbg-teleport-select') as HTMLSelectElement;

  private isDialogueActive = false;
  private currentTypingTimer: number | null = null;
  private onDialogueEndCallback: (() => void) | null = null;
  private onTeleportCallback: ((x: number, y: number) => void) | null = null;

  public static init(map: CompiledMap, bible: WorldBible, save: SaveData): UIManager {
    if (!this.instance) {
      this.instance = new UIManager(map, bible, save);
    }
    return this.instance;
  }

  public static get(): UIManager {
    if (!this.instance) throw new Error('UIManager not initialized');
    return this.instance;
  }

  private constructor(map: CompiledMap, bible: WorldBible, save: SaveData) {
    this.mapData = map;
    this.bibleData = bible;
    this.saveData = save;

    this.setupListeners();
    this.populateTeleportOptions();
  }

  private setupListeners(): void {
    // Top Bar Buttons
    document.getElementById('btn-world-map')?.addEventListener('click', () => this.toggleWorldMap());
    document.getElementById('btn-codex')?.addEventListener('click', () => this.toggleCodex());
    document.getElementById('btn-debug')?.addEventListener('click', () => this.toggleDebug());

    // Modal Close Buttons
    document.getElementById('close-map-btn')?.addEventListener('click', () => this.toggleWorldMap(false));
    document.getElementById('close-codex-btn')?.addEventListener('click', () => this.toggleCodex(false));

    // Codex Tabs
    const tabs = document.querySelectorAll('.codex-tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        tabs.forEach((t) => t.classList.remove('active'));
        (e.target as HTMLElement).classList.add('active');
        const tabType = (e.target as HTMLElement).dataset.tab || 'stories';
        this.renderCodexTab(tabType);
      });
    });

    // Teleport dropdown change
    this.dbgTeleportSelect?.addEventListener('change', (e) => {
      const val = (e.target as HTMLSelectElement).value;
      if (val && this.onTeleportCallback) {
        const [x, y] = val.split(',').map(Number);
        this.onTeleportCallback(x, y);
      }
      (e.target as HTMLSelectElement).value = '';
    });

    // Dialogue progression via Space / Enter
    window.addEventListener('keydown', (e) => {
      if (this.isDialogueActive && (e.code === 'Space' || e.code === 'Enter')) {
        e.preventDefault();
        this.advanceDialogue();
      }
      if (e.code === 'KeyM') {
        this.toggleWorldMap();
      }
      if (e.code === 'KeyJ') {
        this.toggleCodex();
      }
      if (e.code === 'F3' || e.code === 'Backquote') {
        this.toggleDebug();
      }
    });

    this.dialogueBox?.addEventListener('click', () => {
      if (this.isDialogueActive) {
        this.advanceDialogue();
      }
    });
  }

  public setOnTeleport(cb: (x: number, y: number) => void): void {
    this.onTeleportCallback = cb;
  }

  public showInteractionPrompt(actionText: string): void {
    this.promptActionText.textContent = actionText;
    this.interactionPrompt.classList.remove('hidden');
  }

  public hideInteractionPrompt(): void {
    this.interactionPrompt.classList.add('hidden');
  }

  public showLocationBanner(region: Region): void {
    this.bannerRegionName.textContent = region.name;
    this.bannerRegionSubtitle.textContent = region.subtitle;
    this.locationBanner.classList.remove('hidden');

    // Reset CSS animation
    this.locationBanner.style.animation = 'none';
    this.locationBanner.offsetHeight; /* trigger reflow */
    this.locationBanner.style.animation = 'bannerFadeInOut 4s ease forwards';

    // Add to discovered regions in save
    if (!this.saveData.discoveredRegions.includes(region.id)) {
      this.saveData.discoveredRegions.push(region.id);
      SaveSystem.save(this.saveData);
    }
  }

  public updateHUD(locationName: string, timeOfDay: string): void {
    this.hudLocationText.textContent = locationName;
    this.hudTimeText.textContent = timeOfDay;
  }

  public updateDebugInfo(info: {
    x: number;
    y: number;
    tileX: number;
    tileY: number;
    regionName: string;
    chunkX: number;
    chunkY: number;
    biome: string;
    seed: string;
    fps: number;
    nearbyCount: string;
  }): void {
    this.dbgPos.textContent = `X: ${Math.round(info.x)}, Y: ${Math.round(info.y)} (Tile: ${info.tileX}, ${info.tileY})`;
    this.dbgRegion.textContent = `${info.regionName} (Chunk: ${info.chunkX}, ${info.chunkY})`;
    this.dbgBiome.textContent = info.biome;
    this.dbgSeed.textContent = info.seed;
    this.dbgFps.textContent = `${info.fps} FPS`;
    this.dbgEntities.textContent = info.nearbyCount;
  }

  /**
   * Starts a typed JRPG dialogue sequence
   */
  public startDialogue(
    speaker: { name: string; role: string; avatar: string },
    text: string,
    choices?: { text: string; nextNodeId?: string; onSelect?: () => void }[],
    onEnd?: () => void
  ): void {
    this.isDialogueActive = true;
    this.onDialogueEndCallback = onEnd || null;

    this.dialogueAvatar.textContent = speaker.avatar;
    this.dialogueSpeakerName.textContent = speaker.name;
    this.dialogueSpeakerRole.textContent = speaker.role;
    this.dialogueChoices.innerHTML = '';
    this.dialogueBox.classList.remove('hidden');

    this.typewriteText(text, () => {
      if (choices && choices.length > 0) {
        for (const choice of choices) {
          const btn = document.createElement('button');
          btn.className = 'dialogue-choice-btn';
          btn.textContent = choice.text;
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (choice.onSelect) choice.onSelect();
            this.endDialogue();
          });
          this.dialogueChoices.appendChild(btn);
        }
      }
    });
  }

  private typewriteText(text: string, onComplete?: () => void): void {
    if (this.currentTypingTimer) {
      clearInterval(this.currentTypingTimer);
      this.currentTypingTimer = null;
    }

    this.dialogueText.textContent = '';
    let index = 0;

    this.currentTypingTimer = window.setInterval(() => {
      if (index < text.length) {
        this.dialogueText.textContent += text[index];
        if (index % 3 === 0) {
          SoundFX.playDialogueBlip();
        }
        index++;
      } else {
        if (this.currentTypingTimer) {
          clearInterval(this.currentTypingTimer);
          this.currentTypingTimer = null;
        }
        if (onComplete) onComplete();
      }
    }, 18);
  }

  private advanceDialogue(): void {
    // If choices exist, force user to pick a choice
    if (this.dialogueChoices.children.length > 0) return;
    this.endDialogue();
  }

  public endDialogue(): void {
    if (this.currentTypingTimer) {
      clearInterval(this.currentTypingTimer);
      this.currentTypingTimer = null;
    }
    this.isDialogueActive = false;
    this.dialogueBox.classList.add('hidden');
    if (this.onDialogueEndCallback) {
      this.onDialogueEndCallback();
      this.onDialogueEndCallback = null;
    }
  }

  public isDialogueOpen(): boolean {
    return this.isDialogueActive;
  }

  /**
   * World Map Modal Toggle & Canvas Render
   */
  public toggleWorldMap(forceState?: boolean): void {
    const isHidden = this.worldMapModal.classList.contains('hidden');
    const newState = forceState !== undefined ? !forceState : isHidden;

    if (newState) {
      this.renderWorldMap();
      this.worldMapModal.classList.remove('hidden');
    } else {
      this.worldMapModal.classList.add('hidden');
    }
  }

  private renderWorldMap(): void {
    const canvas = this.worldMapCanvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = this.mapData.width;
    const H = this.mapData.height;
    const scaleX = canvas.width / W;
    const scaleY = canvas.height / H;

    // Draw base map parchment terrain
    ctx.fillStyle = '#1e293b'; // Ocean bg
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < H; y += 2) {
      for (let x = 0; x < W; x += 2) {
        const ground = this.mapData.layers.ground[y][x];
        const terrain = this.mapData.layers.terrain[y][x];

        if (ground === 1) ctx.fillStyle = '#0f3854'; // Deep ocean
        else if (ground === 2) ctx.fillStyle = '#1d6387'; // Coast water
        else if (ground === 4) ctx.fillStyle = '#d6ba82'; // Sand
        else if (ground === 9) ctx.fillStyle = '#505a69'; // Mountain
        else if (ground === 6) ctx.fillStyle = '#166534'; // Deepwood
        else ctx.fillStyle = '#4b8f3c'; // Meadow

        // Roads overlay
        if (terrain === 8) ctx.fillStyle = '#e2e8f0'; // Paved road
        else if (terrain === 7) ctx.fillStyle = '#b45309'; // Dirt trail
        else if (terrain === 13 || terrain === 14 || terrain === 15) ctx.fillStyle = '#f59e0b'; // Bridge/Pier

        ctx.fillRect(x * scaleX, y * scaleY, scaleX * 2, scaleY * 2);
      }
    }

    // Draw Settlements
    for (const s of this.mapData.settlements) {
      const sx = s.center.x * scaleX;
      const sy = s.center.y * scaleY;

      ctx.fillStyle = s.type === 'city' ? '#d97706' : '#2563eb';
      ctx.beginPath();
      ctx.arc(sx, sy, s.type === 'city' ? 7 : 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Label
      ctx.font = 'bold 10px Outfit, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 4;
      ctx.fillText(s.name, sx - 15, sy - 8);
      ctx.shadowBlur = 0;
    }

    // Draw Dungeons & Shrines
    for (const poi of this.mapData.pois) {
      if (poi.archetype === 'ruins' || poi.archetype === 'cave_entrance' || poi.archetype === 'shrine') {
        const px = poi.position.x * scaleX;
        const py = poi.position.y * scaleY;
        ctx.fillStyle = '#7c3aed';
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw Discovered Secrets
    for (const sec of this.mapData.secrets) {
      if (this.saveData.discoveredSecrets.includes(sec.id)) {
        const px = sec.position.x * scaleX;
        const py = sec.position.y * scaleY;
        ctx.fillStyle = '#059669';
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw Player Position Marker
    const px = this.saveData.playerPosition.x * scaleX;
    const py = this.saveData.playerPosition.y * scaleY;
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  /**
   * Lore Codex / Journal Toggle & Tab Render
   */
  public toggleCodex(forceState?: boolean): void {
    const isHidden = this.codexModal.classList.contains('hidden');
    const newState = forceState !== undefined ? !forceState : isHidden;

    if (newState) {
      this.renderCodexTab('stories');
      this.codexModal.classList.remove('hidden');
    } else {
      this.codexModal.classList.add('hidden');
    }
  }

  private renderCodexTab(tab: string): void {
    const pane = this.codexPaneContent;
    pane.innerHTML = '';

    // Update Counts in sidebar
    const storyCountEl = document.getElementById('story-count');
    const secretCountEl = document.getElementById('secret-count');
    const npcCountEl = document.getElementById('npc-count');

    const completedStories = this.bibleData.microStories.filter((s) => this.saveData.storyFlags[`${s.id}_completed`]).length;
    if (storyCountEl) storyCountEl.textContent = `${completedStories}/${this.bibleData.microStories.length}`;
    if (secretCountEl) secretCountEl.textContent = `${this.saveData.discoveredSecrets.length}/${this.mapData.secrets.length}`;
    if (npcCountEl) npcCountEl.textContent = `${this.saveData.interactedPOIs.length}/${this.mapData.npcs.length}`;

    if (tab === 'stories') {
      for (const story of this.bibleData.microStories) {
        const isCompleted = this.saveData.storyFlags[`${story.id}_completed`];
        const card = document.createElement('div');
        card.className = 'codex-story-card';

        let stepsHtml = '';
        story.steps.forEach((step) => {
          const isDone = this.saveData.storyFlags[step.setsFlag];
          stepsHtml += `<li><strong>Step ${step.stepIndex} (${step.locationName}):</strong> ${isDone ? `✓ ${step.journalEntry}` : '<em>??? (Undiscovered clue)</em>'}</li>`;
        });

        card.innerHTML = `
          <div class="codex-card-title">
            <span>${story.title}</span>
            <span>${isCompleted ? '⭐ RESOLVED' : '🔍 IN PROGRESS'}</span>
          </div>
          <p><em>${story.premise}</em></p>
          <ul class="codex-clue-list">
            ${stepsHtml}
          </ul>
          ${isCompleted ? `<p style="margin-top:8px; color:#15803d;"><strong>Conclusion:</strong> ${story.resolutionText}</p>` : ''}
        `;
        pane.appendChild(card);
      }
    } else if (tab === 'secrets') {
      if (this.saveData.discoveredSecrets.length === 0) {
        pane.innerHTML = `<p><em>No secrets discovered yet! Keep your eyes open for hidden trails behind trees, sea arches, and odd rock formations.</em></p>`;
      } else {
        for (const secId of this.saveData.discoveredSecrets) {
          const sec = this.mapData.secrets.find((s) => s.id === secId);
          if (sec) {
            const card = document.createElement('div');
            card.className = 'codex-secret-card';
            card.innerHTML = `
              <div class="codex-card-title"><span>🤫 ${sec.name}</span></div>
              <p><strong>Visual Cue:</strong> ${sec.visualCue}</p>
              <p><strong>Reward:</strong> ${sec.rewardDescription}</p>
            `;
            pane.appendChild(card);
          }
        }
      }
    } else if (tab === 'lore') {
      pane.innerHTML = `
        <div class="codex-story-card">
          <div class="codex-card-title"><span>Chronicles of ${this.bibleData.worldName}</span></div>
          <p><strong>Era:</strong> ${this.bibleData.era}</p>
          <p style="margin-top:6px;">${this.bibleData.historySummary}</p>
        </div>
        <div class="codex-story-card">
          <div class="codex-card-title"><span>Great Factions of the Realm</span></div>
          ${this.bibleData.factions.map((f) => `<p style="margin-top:6px;"><strong>${f.name}</strong> (<em>"${f.motto}"</em>)<br>${f.description}</p>`).join('')}
        </div>
        <div class="codex-story-card">
          <div class="codex-card-title"><span>Folk Legends & Mysteries</span></div>
          ${this.bibleData.legends.map((l) => `<p style="margin-top:6px;"><strong>${l.title}:</strong> ${l.text}</p>`).join('')}
        </div>
      `;
    } else if (tab === 'npcs') {
      for (const npc of this.mapData.npcs) {
        const card = document.createElement('div');
        card.className = 'codex-npc-card';
        card.innerHTML = `
          <div class="codex-card-title"><span>${npc.avatarEmoji} ${npc.name}</span> <span style="font-size:12px; color:#5c3c1e;">${npc.role}</span></div>
          <p><strong>Home:</strong> ${npc.settlementId.replace('settlement_', '').toUpperCase()}</p>
          <p><strong>Personality:</strong> ${npc.personalityTags.join(', ')}</p>
        `;
        pane.appendChild(card);
      }
    }
  }

  public toggleDebug(): void {
    this.debugOverlay.classList.toggle('hidden');
  }

  private populateTeleportOptions(): void {
    const select = this.dbgTeleportSelect;
    if (!select) return;

    select.innerHTML = '<option value="">-- Quick Jump to Location --</option>';

    for (const s of this.mapData.settlements) {
      const opt = document.createElement('option');
      opt.value = `${s.center.x},${s.center.y}`;
      opt.textContent = `📍 ${s.name} (${s.type})`;
      select.appendChild(opt);
    }

    for (const poi of this.mapData.pois) {
      const opt = document.createElement('option');
      opt.value = `${poi.position.x},${poi.position.y}`;
      opt.textContent = `🏛️ ${poi.name}`;
      select.appendChild(opt);
    }

    for (const sec of this.mapData.secrets) {
      const opt = document.createElement('option');
      opt.value = `${sec.position.x},${sec.position.y}`;
      opt.textContent = `🤫 ${sec.name} (Secret)`;
      select.appendChild(opt);
    }
  }
}
