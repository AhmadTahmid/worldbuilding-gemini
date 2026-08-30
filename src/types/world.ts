import { z } from 'zod';

export type BiomeType =
  | 'ocean'
  | 'beach'
  | 'grassland'
  | 'forest'
  | 'deepwood'
  | 'mountain'
  | 'mountain_pass'
  | 'coastal_rock'
  | 'city'
  | 'village'
  | 'ruins';

export type NodeType =
  | 'city'
  | 'town'
  | 'village'
  | 'dungeon'
  | 'shrine'
  | 'landmark'
  | 'poi'
  | 'crossroad'
  | 'secret';

export type RouteType =
  | 'paved_road'
  | 'dirt_trail'
  | 'mountain_pass'
  | 'coastal_path'
  | 'bridge'
  | 'hidden_trail';

export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WorldSpec {
  seed: string;
  widthTiles: number; // e.g., 288
  heightTiles: number; // e.g., 240
  tileSize: number; // 16px or 32px
  macroChunkSize: number; // 24 tiles
  worldName: string;
  era: string;
}

export interface WorldNode {
  id: string;
  name: string;
  type: NodeType;
  biome: BiomeType;
  x: number;
  y: number;
  regionId: string;
  importance: number; // 1 to 5
  description: string;
}

export type SettlementPattern =
  | 'grid_urban'
  | 'radial_green'
  | 'linear_pier'
  | 'terrace_mountain';

export type DistrictType =
  | 'civic'
  | 'market'
  | 'docks'
  | 'residential'
  | 'craft'
  | 'farming'
  | 'harbor'
  | 'temple';

export interface WorldEdge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  routeType: RouteType;
  name: string;
  points?: Point[];
  isSecret?: boolean;
  beats?: string[];
}

export interface WorldGraph {
  nodes: WorldNode[];
  edges: WorldEdge[];
}

export interface Region {
  id: string;
  name: string;
  subtitle: string;
  biome: BiomeType;
  bounds: Rect;
  colorHex: string;
  ambientWeather: 'clear' | 'clouds' | 'forest_leaves' | 'sea_spray' | 'mountain_snow' | 'mist' | 'rain';
  bgmKey?: string;
  loreSummary: string;
}

export interface Settlement {
  id: string;
  name: string;
  type: 'city' | 'town' | 'village';
  regionId: string;
  center: Point;
  bounds: Rect;
  population: number;
  economy: string[];
  mood: string;
  architectureStyle: 'grand_stone' | 'timber_thatch' | 'coastal_wood' | 'slate_crag';
  settlementPattern?: SettlementPattern;
  districts?: DistrictType[];
  surroundingLandUse?: string[];
  landmarks: string[];
  loreSummary: string;
}

export interface POI {
  id: string;
  name: string;
  archetype:
    | 'abandoned_cottage'
    | 'shrine'
    | 'mysterious_statue'
    | 'scenic_overlook'
    | 'strange_tree'
    | 'campsite'
    | 'ruins'
    | 'old_grave'
    | 'cave_entrance'
    | 'forgotten_well'
    | 'sunken_skiff'
    | 'hidden_grotto'
    | 'stone_circle'
    | 'watchtower_ruin';
  position: Point;
  regionId: string;
  description: string;
  examineText: string;
  clueRef?: string;
  microStoryId?: string;
  isSecret?: boolean;
  discoveryFlag?: string;
}

export interface SecretLocation {
  id: string;
  name: string;
  position: Point;
  regionId: string;
  hint: string;
  visualCue: string;
  discoveryFlag: string;
  rewardDescription: string;
}

export interface MicroStoryStep {
  stepIndex: number;
  locationId: string;
  locationName: string;
  clueText: string;
  journalEntry: string;
  relatedNpcId?: string;
  requiredFlag?: string;
  setsFlag: string;
}

export interface MicroStory {
  id: string;
  title: string;
  premise: string;
  resolutionText: string;
  steps: MicroStoryStep[];
}

export interface DialogueChoice {
  text: string;
  nextNodeId?: string;
  actionFlag?: string;
}

export interface DialogueNode {
  id: string;
  text: string;
  choices?: DialogueChoice[];
  conditionFlag?: string;
  setFlag?: string;
}

export interface NPC {
  id: string;
  name: string;
  role: string;
  avatarEmoji: string;
  settlementId: string;
  regionId: string;
  position: Point;
  spriteIndex: number;
  personalityTags: string[];
  factionId?: string;
  dialogueTree: DialogueNode[];
  gossipTargets: string[];
  relatedStoryId?: string;
}

export interface Faction {
  id: string;
  name: string;
  motto: string;
  seatId: string;
  description: string;
}

export interface WorldBible {
  worldName: string;
  era: string;
  historySummary: string;
  regions: Region[];
  settlements: Settlement[];
  factions: Faction[];
  microStories: MicroStory[];
  legends: { title: string; text: string }[];
  mysteries: { title: string; hint: string; locationRef: string }[];
}

export interface CompiledLayer {
  name: string;
  data: number[][]; // grid of tile IDs
}

export interface MapEntity {
  id: string;
  type: 'npc' | 'poi' | 'chest' | 'sign' | 'door' | 'light_source';
  x: number; // tile coordinate
  y: number; // tile coordinate
  properties: Record<string, any>;
}

export interface CompiledMap {
  width: number; // in tiles
  height: number; // in tiles
  tileSize: number;
  layers: {
    ground: number[][];
    terrain: number[][];
    lowerObjects: number[][];
    collision: boolean[][];
    upperObjects: number[][];
  };
  entities: MapEntity[];
  regions: Region[];
  settlements: Settlement[];
  pois: POI[];
  secrets: SecretLocation[];
  npcs: NPC[];
  spawnPoint: Point;
}

// Zod Schemas for Validation
export const PointSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const RectSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
});

export const WorldNodeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.string(),
  biome: z.string(),
  x: z.number(),
  y: z.number(),
  regionId: z.string().min(1),
  importance: z.number().min(1).max(5),
  description: z.string(),
});

export const WorldEdgeSchema = z.object({
  id: z.string().min(1),
  fromNodeId: z.string().min(1),
  toNodeId: z.string().min(1),
  routeType: z.string(),
  name: z.string(),
});

export const SettlementSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(['city', 'town', 'village']),
  regionId: z.string().min(1),
  center: PointSchema,
  bounds: RectSchema,
  population: z.number().positive(),
  economy: z.array(z.string()),
  mood: z.string(),
  architectureStyle: z.string(),
  landmarks: z.array(z.string()),
  loreSummary: z.string(),
});

export const POISchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  archetype: z.string(),
  position: PointSchema,
  regionId: z.string().min(1),
  description: z.string(),
  examineText: z.string(),
});

export const NPCSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
  settlementId: z.string().min(1),
  regionId: z.string().min(1),
  position: PointSchema,
  spriteIndex: z.number(),
  personalityTags: z.array(z.string()),
  dialogueTree: z.array(z.object({
    id: z.string(),
    text: z.string(),
  })),
});
