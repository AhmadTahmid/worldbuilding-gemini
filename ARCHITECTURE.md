# 🏛️ Architecture Specification

This document details the system design, data flow, and modular architecture of **Aethelgard**.

---

## 1. Core Architectural Philosophy

The fundamental design principle is the **strict separation of narrative/semantic world representations from the rendering engine**.

```
+-------------------------------------------------------------------------+
|                        SEMANTIC WORLD MODEL                             |
|                                                                         |
|  [World Specification] -> [World Graph] -> [Geography & Biomes]         |
|                                                     |                   |
|  [World Bible] ---------> [Settlements & POIs] <----+                   |
|                               |                                         |
|                               v                                         |
|                     [NPCs & Micro-Stories]                              |
+-------------------------------------------------------------------------+
                                    |
                                    v (WorldCompiler)
+-------------------------------------------------------------------------+
|                     COMPILED TILEMAP REPRESENTATION                     |
|                                                                         |
|  • Layer: ground (ocean, coast, sand, grass, slate)                     |
|  • Layer: terrain (roads, trails, bridges, cliffs)                      |
|  • Layer: lowerObjects (walls, doors, barrels, crops, props)            |
|  • Layer: collision (boolean occupancy grid)                            |
|  • Layer: upperObjects (roofs, tree canopies for Y-depth sorting)       |
|  • Entities: 32 NPCs, 17 POIs, 10 Secrets, Spawn Point                  |
+-------------------------------------------------------------------------+
                                    |
                                    v (Phaser 3 WebGL)
+-------------------------------------------------------------------------+
|                        GAME CLIENT & RENDERER                           |
|                                                                         |
|  • Phaser 3 Engine (Viewport culling, Y-Sort rendering, Arcade physics) |
|  • Dynamic Atmosphere (Particles, Cloud shadows, Day/Night lighting)   |
|  • Interactive DOM UI (JRPG Dialogue, Parchment Map, Lore Journal, HUD) |
|  • LocalStorage Persistence Manager                                     |
+-------------------------------------------------------------------------+
```

---

## 2. Component Breakdown

### 2.1 Semantic World Layer
- **`WorldSpec`**: Defines seed, dimensions (288×240 tiles), tile size (16px), macro chunk dimensions (24 tiles), and world identity.
- **`WorldGraph`**: Logical connectivity layer holding topological nodes (settlements, shrines, crossroads, caverns) and edges (paved highways, dirt paths, mountain passes, secret runs).
- **`WorldBible`**: Canonical persistent lore repository (`data/world-bible.json`) storing regional lore, historical summaries, factions, micro-stories, legends, and mysteries.
- **`WorldValidator`**: Automated graph validator that executes Dijkstra/BFS pathfinding over the compiled collision grid to guarantee 100% reachability from spawn to all major locations.

### 2.2 Compilation Pipeline (`WorldCompiler`)
Transforms abstract semantic entities into a multi-layer 2D tilemap matrix:
1. `SeedRandom`: Initializes deterministic PRNG and simplex noise generators.
2. `WorldGraphGenerator`: Generates the topological world graph.
3. `TerrainGenerator`: Computes continuous elevation, moisture, ocean bays, and river networks.
4. `RouteCarver`: Executes A* pathfinding along the terrain to carve paved roads, dirt tracks, and wooden bridges.
5. `SettlementSynthesizer`: Synthesizes town squares, buildings, docks, walls, and lighting props.
6. `POIGenerator`: Places contextual landmarks and hidden secrets with visual clues.
7. `NPCNarrativeGenerator`: Distributes 32 NPCs with homes, branching dialogue trees, gossip links, and micro-story hooks.
8. `WorldValidator`: Runs automated graph reachability and schema validation.

### 2.3 Game Engine Layer (Phaser 3)
- **`BootScene`**: Generates procedural pixel-art tilesets and animated character spritesheets via HTML5 Canvas, preloads JSON, and compiles sprite walk/idle animations.
- **`WorldScene`**:
  - Renders 4 tilemap layers (`ground`, `terrain`, `lowerObjects`, `upperObjects`).
  - Implements 8-directional smooth player movement with wall sliding and sprint mode.
  - Controls smooth pixel-art camera follow with deadzone and lerp (0.08).
  - Handles real-time Y-sorting depth management (`sprite.setDepth(sprite.y)`).
  - Simulates dynamic day/night ambient color grading and dynamic particle weather systems (forest leaves, sea spray, snow flurries, night fireflies, moving cloud shadows).
- **`UIManager`**: Drives the DOM overlay:
  - Classic JRPG dialogue box with typewriter audio blips and branching choices.
  - Real-time parchment World Map modal (`[M]`) rendering discovered settlements, shrines, secrets, and player position.
  - Lore Codex / Journal (`[J]`) displaying active micro-stories, clues, secrets, and NPC dossiers.
  - Developer Debug HUD (`[F3]`) displaying player coordinates, chunk index, active biome, FPS, collision wireframes, and teleport controls.
- **`SaveSystem`**: Persists player progress, discovered locations, interacted POIs, secrets found, and story flags in `localStorage`.
