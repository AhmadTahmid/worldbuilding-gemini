import { WorldGraph, Point } from '@/types/world';
import { TerrainData } from './TerrainGenerator';

export class RouteCarver {
  public static carveRoutes(graph: WorldGraph, terrain: TerrainData): void {
    const nodeMap = new Map(graph.nodes.map((n) => [n.id, n]));

    for (const edge of graph.edges) {
      const fromNode = nodeMap.get(edge.fromNodeId);
      const toNode = nodeMap.get(edge.toNodeId);

      if (!fromNode || !toNode) continue;

      const path = this.findAStarPath(
        { x: fromNode.x, y: fromNode.y },
        { x: toNode.x, y: toNode.y },
        terrain,
        edge.isSecret || false
      );

      // Save points onto edge for minimap rendering
      edge.points = path;

      // Stamp path tiles
      for (let i = 0; i < path.length; i++) {
        const pt = path[i];
        const prevPt = i > 0 ? path[i - 1] : pt;
        const isRiver = terrain.riverMap[pt.y][pt.x];

        // Determine road tile type
        let roadTile = 7; // Default dirt trail
        if (edge.routeType === 'paved_road') {
          roadTile = 8; // Cobblestone
        } else if (edge.routeType === 'mountain_pass') {
          roadTile = 9; // Mountain Slate
        } else if (edge.routeType === 'hidden_trail') {
          roadTile = 7; // Subtle trail
        }

        // Bridge handling over rivers or water
        if (isRiver || terrain.groundTiles[pt.y][pt.x] === 1 || terrain.groundTiles[pt.y][pt.x] === 2) {
          const isHorizontal = Math.abs(pt.x - prevPt.x) >= Math.abs(pt.y - prevPt.y);
          if (edge.routeType === 'coastal_path' || edge.routeType === 'hidden_trail') {
            terrain.terrainTiles[pt.y][pt.x] = 15; // Wooden Pier / Boardwalk
          } else {
            terrain.terrainTiles[pt.y][pt.x] = isHorizontal ? 13 : 14; // Wooden Bridge
          }
          terrain.collision[pt.y][pt.x] = false; // Walkable bridge/pier
        } else {
          terrain.terrainTiles[pt.y][pt.x] = roadTile;
          terrain.collision[pt.y][pt.x] = false;
        }

        // Clear tree / boulder obstacles on and adjacent to the path
        const width = edge.routeType === 'paved_road' ? 1 : 0;
        for (let dy = -width; dy <= width; dy++) {
          for (let dx = -width; dx <= width; dx++) {
            const nx = pt.x + dx;
            const ny = pt.y + dy;
            if (nx >= 0 && nx < terrain.width && ny >= 0 && ny < terrain.height) {
              terrain.upperObjectTiles[ny][nx] = 0;
              terrain.lowerObjectTiles[ny][nx] = 0;
              terrain.collision[ny][nx] = false;
              if (width > 0 && terrain.terrainTiles[ny][nx] === 0) {
                terrain.terrainTiles[ny][nx] = roadTile;
              }
            }
          }
        }
      }
    }
  }

  private static findAStarPath(
    start: Point,
    end: Point,
    terrain: TerrainData,
    _isSecret: boolean
  ): Point[] {
    const W = terrain.width;
    const H = terrain.height;

    const openSet: { pt: Point; f: number; g: number }[] = [];
    const cameFrom = new Map<string, Point>();
    const gScore = new Map<string, number>();

    const key = (p: Point) => `${p.x},${p.y}`;
    const startKey = key(start);
    gScore.set(startKey, 0);

    const heuristic = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

    openSet.push({ pt: start, g: 0, f: heuristic(start, end) });

    while (openSet.length > 0) {
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift()!.pt;

      if (current.x === end.x && current.y === end.y) {
        const totalPath: Point[] = [current];
        let currKey = key(current);
        while (cameFrom.has(currKey)) {
          const prev = cameFrom.get(currKey)!;
          totalPath.unshift(prev);
          currKey = key(prev);
        }
        return totalPath;
      }

      const neighbors: Point[] = [
        { x: current.x + 1, y: current.y },
        { x: current.x - 1, y: current.y },
        { x: current.x, y: current.y + 1 },
        { x: current.x, y: current.y - 1 },
      ];

      for (const neighbor of neighbors) {
        if (neighbor.x < 1 || neighbor.x >= W - 1 || neighbor.y < 1 || neighbor.y >= H - 1) {
          continue;
        }

        const isDeepOcean = terrain.groundTiles[neighbor.y][neighbor.x] === 1;
        const isShallowOcean = terrain.groundTiles[neighbor.y][neighbor.x] === 2;

        let cost = 1.0;
        if (isDeepOcean) {
          cost += 8.0; // High cost for building over deep water
        } else if (isShallowOcean) {
          cost += 3.0; // Moderate cost for coastal boardwalks
        }
        if (terrain.riverMap[neighbor.y][neighbor.x]) {
          cost += 2.0; // Bridge cost
        }
        if (terrain.elevation[neighbor.y][neighbor.x] > 0.75) {
          cost += 2.0; // Mountain slope
        }
        if (terrain.terrainTiles[neighbor.y][neighbor.x] === 8 || terrain.terrainTiles[neighbor.y][neighbor.x] === 7) {
          cost *= 0.5; // Favor existing roads
        }

        const tentativeG = (gScore.get(key(current)) ?? Infinity) + cost;
        const neighborKey = key(neighbor);

        if (tentativeG < (gScore.get(neighborKey) ?? Infinity)) {
          cameFrom.set(neighborKey, current);
          gScore.set(neighborKey, tentativeG);
          const f = tentativeG + heuristic(neighbor, end);

          const existing = openSet.find((item) => item.pt.x === neighbor.x && item.pt.y === neighbor.y);
          if (existing) {
            existing.g = tentativeG;
            existing.f = f;
          } else {
            openSet.push({ pt: neighbor, g: tentativeG, f });
          }
        }
      }
    }

    return [start, end];
  }
}
