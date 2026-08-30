import { CompiledMap, WorldGraph, WorldBible, Point } from '@/types/world';

export interface ValidationReport {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    totalTiles: number;
    walkableTiles: number;
    settlementCount: number;
    npcCount: number;
    poiCount: number;
    secretCount: number;
    reachableMajorLocations: number;
    totalMajorLocations: number;
  };
}

export class WorldValidator {
  public static validate(
    map: CompiledMap,
    _graph: WorldGraph,
    _bible: WorldBible
  ): ValidationReport {
    const errors: string[] = [];
    const warnings: string[] = [];

    const W = map.width;
    const H = map.height;

    // 1. Boundary & Coordinate Integrity
    if (map.spawnPoint.x < 0 || map.spawnPoint.x >= W || map.spawnPoint.y < 0 || map.spawnPoint.y >= H) {
      errors.push(`Invalid spawn point (${map.spawnPoint.x}, ${map.spawnPoint.y}) out of map bounds.`);
    }

    if (map.layers.collision[map.spawnPoint.y][map.spawnPoint.x]) {
      errors.push(`Player spawn point (${map.spawnPoint.x}, ${map.spawnPoint.y}) is blocked by collision.`);
    }

    // 2. Settlement Validation
    for (const s of map.settlements) {
      if (s.center.x < 0 || s.center.x >= W || s.center.y < 0 || s.center.y >= H) {
        errors.push(`Settlement ${s.name} (${s.id}) center (${s.center.x}, ${s.center.y}) is out of bounds.`);
      }
    }

    // 3. NPC Validation
    const npcIds = new Set<string>();
    for (const npc of map.npcs) {
      if (npcIds.has(npc.id)) {
        errors.push(`Duplicate NPC ID detected: ${npc.id}`);
      }
      npcIds.add(npc.id);

      if (npc.position.x < 0 || npc.position.x >= W || npc.position.y < 0 || npc.position.y >= H) {
        errors.push(`NPC ${npc.name} (${npc.id}) position is out of bounds.`);
      }

      if (!npc.dialogueTree || npc.dialogueTree.length === 0) {
        warnings.push(`NPC ${npc.name} (${npc.id}) has no dialogue entries.`);
      }
    }

    if (map.npcs.length < 30) {
      warnings.push(`NPC count (${map.npcs.length}) is below the prototype target of 30.`);
    }

    // 4. POI & Secrets Validation
    if (map.pois.length < 15) {
      warnings.push(`POI count (${map.pois.length}) is below target 15.`);
    }
    if (map.secrets.length < 10) {
      warnings.push(`Secrets count (${map.secrets.length}) is below target 10.`);
    }

    // 5. Breadth-First Search (BFS) Reachability Analysis from Spawn
    const walkable = map.layers.collision;
    const visited: boolean[][] = Array.from({ length: H }, () => new Array(W).fill(false));
    const queue: Point[] = [map.spawnPoint];
    visited[map.spawnPoint.y][map.spawnPoint.x] = true;
    let walkableCount = 0;

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (!walkable[y][x]) walkableCount++;
      }
    }

    while (queue.length > 0) {
      const curr = queue.shift()!;
      const neighbors: Point[] = [
        { x: curr.x + 1, y: curr.y },
        { x: curr.x - 1, y: curr.y },
        { x: curr.x, y: curr.y + 1 },
        { x: curr.x, y: curr.y - 1 },
      ];

      for (const n of neighbors) {
        if (n.x >= 0 && n.x < W && n.y >= 0 && n.y < H && !visited[n.y][n.x] && !walkable[n.y][n.x]) {
          visited[n.y][n.x] = true;
          queue.push(n);
        }
      }
    }

    // Check reachability of major settlements and landmarks (within 3 tiles of center)
    const majorLocationsToCheck = [
      ...map.settlements.map((s) => ({ name: s.name, pt: s.center })),
      ...map.pois.filter((p) => !p.isSecret).map((p) => ({ name: p.name, pt: p.position })),
    ];

    let reachableCount = 0;
    for (const loc of majorLocationsToCheck) {
      let isReachable = false;
      for (let dy = -3; dy <= 3; dy++) {
        for (let dx = -3; dx <= 3; dx++) {
          const nx = loc.pt.x + dx;
          const ny = loc.pt.y + dy;
          if (nx >= 0 && nx < W && ny >= 0 && ny < H && visited[ny][nx]) {
            isReachable = true;
            break;
          }
        }
        if (isReachable) break;
      }

      if (isReachable) {
        reachableCount++;
      } else {
        errors.push(`Major location ${loc.name} at (${loc.pt.x}, ${loc.pt.y}) is unreachable from player spawn!`);
      }
    }

    const isValid = errors.length === 0;

    return {
      isValid,
      errors,
      warnings,
      stats: {
        totalTiles: W * H,
        walkableTiles: walkableCount,
        settlementCount: map.settlements.length,
        npcCount: map.npcs.length,
        poiCount: map.pois.length,
        secretCount: map.secrets.length,
        reachableMajorLocations: reachableCount,
        totalMajorLocations: majorLocationsToCheck.length,
      },
    };
  }
}
