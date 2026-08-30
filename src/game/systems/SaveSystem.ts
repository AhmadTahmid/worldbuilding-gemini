import { Point } from '@/types/world';

export interface SaveData {
  playerPosition: Point;
  discoveredRegions: string[];
  discoveredSecrets: string[];
  interactedPOIs: string[];
  storyFlags: Record<string, boolean>;
  journalNotes: { storyId: string; title: string; entries: string[] }[];
  playtimeSeconds: number;
  lastSaved: number;
}

export class SaveSystem {
  private static readonly STORAGE_KEY = 'aethelgard_save_v1';

  public static load(): SaveData | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return null;
      return JSON.parse(data) as SaveData;
    } catch {
      return null;
    }
  }

  public static save(data: SaveData): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Storage quota or private mode
    }
  }

  public static createDefaultSave(spawnPoint: Point): SaveData {
    return {
      playerPosition: { ...spawnPoint },
      discoveredRegions: ['region_crownport'],
      discoveredSecrets: [],
      interactedPOIs: [],
      storyFlags: {},
      journalNotes: [],
      playtimeSeconds: 0,
      lastSaved: Date.now(),
    };
  }

  public static clear(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch {
      // Ignore
    }
  }
}
