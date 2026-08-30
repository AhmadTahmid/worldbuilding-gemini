# 🌍 Procedural World Generation & LLM Authoring

This document explains the procedural generation algorithms used in **Aethelgard** and how future LLMs/coding agents can extend and author content within the system.

---

## 1. The Generation Pipeline

```
generateWorld(seed)
       ↓
1. Initialize SeedRandom(seed) & Simplex 2D Noise
       ↓
2. Generate World Graph (Nodes: Settlements, Landmarks, Shrines; Edges: Routes)
       ↓
3. Generate Continuous Geography (Elevation field, Moisture field, Mountain peaks, Bays, Rivers)
       ↓
4. Assign Biomes (Ocean, Beach, Meadow, Whispering Weald, Deepwood Gloom, Mistfall Slate)
       ↓
5. Carve Routes (A* cost-field pathfinding, Wooden bridges over rivers, Cliffs steps)
       ↓
6. Synthesize Settlements (Crownport, Oakhaven, Tidebreak, Cragwatch architecture & footprints)
       ↓
7. Place POIs & Secrets (Contextual archetypes, visual clues, 10+ hidden locations)
       ↓
8. Generate NPCs & Micro-Stories (32 named NPCs, branching dialogue, gossip cross-references)
       ↓
9. Compile Multi-Layer Map (Ground, Terrain, LowerObjects, Collision, UpperObjects)
       ↓
10. Validate World (BFS Reachability, Boundary checks, Collision sanity, Zod schema validation)
       ↓
11. Export Compiled Map JSON
```

---

## 2. Key Generation Algorithms

### 2.1 Continental Geography & Rivers
- **Elevation Simulation**: Evaluates Fractal Brownian Motion (FBM) with 4 octaves of 2D Simplex noise. Applies an asymmetric continental distance field with a mountain bias in the northeast (Mistfall Peaks) and an ocean basin bias in the southwest/southeast (Grand Bay & Azure Coast).
- **River Generation**: Simulates hydrological flow starting from the high alpine lake (x: 195, y: 48), meandering downward through Oakhaven forest and terminating in the coastal bay.

### 2.2 Route & Bridge Carving via Cost-Field A*
- Traverses the 2D terrain grid using an A* pathfinder.
- **Cost Weights**:
  - Existing paved roads: `0.5x`
  - High mountain slopes: `2.0x`
  - River crossings: `2.0x` (spawns horizontal `tile 13` or vertical `tile 14` wooden bridges and clears collision)
  - Coastal shallows: `3.0x` (spawns wooden boardwalk piers `tile 15`)
- Automatically clears tree and boulder collision obstacles along path corridors.

### 2.3 Intentional Settlement Synthesis
Instead of scattering random building footprints:
- **Crownport (Grand Port City)**: Synthesizes cobblestone plazas, grand clocktower, stone quays along the water, multi-pier docks, market canopies, and granite residences with slate blue roofs.
- **Oakhaven (Forest Village)**: Generates a village green around the 500-year-old Elder Oak, freshwater well, timber cottages with thatch roofs, and herbalist garden patches.
- **Tidebreak (Fishing Village)**: Generates a connected wooden pier platform extending over the coastal breakers, weathered stilt shacks, and the Ancient Beacon lighthouse.
- **Cragwatch (Mountain Town)**: Synthesizes dark slate stone buildings, a smelter with smoking chimney, forge embers, and the cavern mine entrance.

---

## 3. How Future LLMs / Agents Can Author & Extend the World

The world generation pipeline was architected to be modular so that future autonomous agents or LLM APIs can generate new content without touching the graphics renderer:

### 3.1 Adding a New Settlement
1. Add a new `Settlement` entry in `data/world-bible.json` or `src/types/world.ts`.
2. Add a `WorldNode` in `src/world/generator/WorldGraphGenerator.ts`.
3. Add a layout synthesizer in `src/world/generator/SettlementSynthesizer.ts`.
4. Run `npm run world:validate` to ensure the new settlement is automatically connected by roads and 100% reachable.

### 3.2 Adding an Environmental Micro-Story
1. Add a `MicroStory` definition in `data/world-bible.json` with 3+ progressive steps.
2. In `src/world/generator/POIGenerator.ts`, attach `microStoryId` and `clueRef` to relevant POIs.
3. In `src/world/generator/NPCNarrativeGenerator.ts`, add dialogue nodes where NPCs discuss or hint at the story.
4. The game's `UIManager` and `SaveSystem` will automatically track the clues in the Traveler's Journal (`[J]`).

### 3.3 Adding New NPCs
1. Append an `NPC` object to `NPCNarrativeGenerator.ts` with:
   - Unique `id`, `name`, `role`, `avatarEmoji`
   - `settlementId` and `position`
   - `spriteIndex` (0 to 11)
   - Branching `dialogueTree` with choices and gossip targets
2. Run `npm run world:validate` to verify coordinates and schema validity.
