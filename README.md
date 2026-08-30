# ⚔️ Aethelgard — Procedural JRPG Exploration Game

> **An experimental browser-based 2D JRPG world exploration prototype exploring whether LLMs/coding agents can construct large, coherent, authored-feeling worlds through structured semantic generation rather than hardcoded static maps.**

---

## 🌟 Overview & Vision

Classic JRPG worlds (such as early Pokémon, Chrono Trigger, and Dragon Quest) evoke a deep sense of wonder through:
- **Curiosity** about what lies beyond the next route
- **Distinct regional identities** (bustling maritime port, tranquil forest sanctuary, weathered stilt fishing village, rugged slate mining stronghold)
- **Environmental storytelling** and small mysteries discoverable without intrusive quest markers
- **Interconnected NPCs** who gossip, reference each other, and foreshadow world events
- **Atmospheric charm** (drifting forest leaves, coastal sea spray, mountain snow flurries, day/night lighting, and fireflies)
- **100% CC0 Public Domain Assets** and clean procedural synthesis

Rather than handcrafting a static tilemap, **Aethelgard** implements a **Semantic World Generation Pipeline** where the rendered tilemap is downstream of a topological world graph, geographic noise simulation, settlement synthesizer, and a persistent canonical **World Bible**.

---

## 🎮 Features

- 🗺️ **Massive Seamless Overworld**: 288×240 tiles (69,120 tiles / 4,608×3,840 px) with 0 loading screens.
- 🏰 **4 Distinct Settlements**:
  - **Crownport**: Grand metropolis with cobblestone plazas, grand clocktower, stone quays, and market stalls.
  - **Oakhaven**: Timber forest village built around the 500-year-old Elder Oak and freshwater well.
  - **Tidebreak**: Rugged coastal village perched on stilt-pier networks with an ancient lighthouse beacon.
  - **Cragwatch**: Alpine slate mining town with smoke-plumed smelters and a high gorge suspension bridge.
- 🌲 **5 Diverse Biomes**: Deep Ocean & Shallow Coast, Lush Meadow & Grasslands, Whispering Weald, The Deepwood Gloom, and Mistfall Peaks.
- 🏛️ **3 Dungeons & Shrines**: *Sunken Crypt of the Tide King*, *Echoing Chasm*, and *Elderwood Shrine*.
- 👥 **32 Named NPCs**: Complete with distinctive roles, personality tags, homes, branching dialogue trees, gossip links, and story clues.
- 🔍 **5 Multi-Step Environmental Micro-Stories**:
  1. *The Clockmaker's Lost Chronometer*
  2. *The Ballad of the Pale Leviathan*
  3. *The Smuggler's Silver Cipher*
  4. *The Herbalist's Ancient Panacea*
  5. *The Signet of the Drowned King*
- 🤫 **10 Hidden Secrets**: Concealed grottos behind waterfalls, stepping stone sandbars, abandoned mountain mine stashes, and ancient druid hollows.
- ⏳ **Dynamic Day / Night & Atmospheric Systems**:
  - Continuous day/night lighting cycle (Dawn, Noon, Amber Sunset, Midnight Blue with glowing lanterns).
  - Ambient particle weather systems (Falling leaves, ocean sea breeze, alpine snow, night fireflies, drifting cloud shadows).
- 📜 **Parchment World Map & Lore Codex / Journal**: Interactive map overlay (`[M]`) and lore journal (`[J]`) tracking discovered stories, secrets, and world history.
- 🛠️ **Developer Debug Overlay**: Real-time FPS, player coordinates, active region/biome, collision wireframes toggle, 3x super speed, and fast-travel teleportation dropdown (`[F3]` or ``[`]``).

---

## 🕹️ Controls

| Action | Primary Key | Secondary Key |
| :--- | :--- | :--- |
| **Move Up / Down / Left / Right** | `W` `A` `S` `D` | Arrow Keys `↑` `←` `↓` `→` |
| **Sprint** | `Shift` (Hold) | `Shift` (Hold) |
| **Interact / Advance Dialogue** | `E` | `Space` / `Enter` |
| **Toggle World Map** | `M` | HUD Button |
| **Toggle Traveler's Journal / Codex** | `J` | HUD Button |
| **Toggle Debug Overlay** | `F3` | `` ` `` (Backquote) / HUD Button |

---

## 🚀 Quickstart & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- `npm`

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to play immediately!

---

## 🛠️ CLI & Developer Tooling

The project provides dedicated CLI tools for headless world generation, integrity validation, and data inspection:

```bash
# 1. Regenerate the world with a default or custom seed
npm run world:generate [seed]
# Example: npm run world:generate "Aethelgard-4891"

# 2. Run automated graph reachability, collision sanity, and schema checks across multiple seeds
npm run world:validate

# 3. Inspect semantic world statistics, settlements, NPCs, and secrets in terminal
npm run world:inspect

# 4. Run automated test suite
npm test
```

---

## 📂 Project Architecture

```
e:/WorldBuilding Gemini/
├── data/
│   └── world-bible.json          # Canonical persistent world lore, factions, & micro-stories
├── public/
│   └── data/
│       ├── compiled-world.json   # Exported multi-layer compiled tilemap
│       └── world-bible.json      # Static runtime lore bible
├── scripts/
│   ├── generate-world.ts         # CLI world generator
│   ├── validate-world.ts         # CLI world validator
│   └── inspect-world.ts          # CLI world inspector
├── src/
│   ├── game/
│   │   ├── assets/
│   │   │   ├── SoundFX.ts            # Web Audio API sound synthesizer
│   │   │   └── TileAtlasGenerator.ts # Rich 16x16 pixel-art atlas & character generator with autotiling
│   │   ├── scenes/
│   │   │   ├── BootScene.ts          # Preloads textures, creates animations, loads world data
│   │   │   └── WorldScene.ts         # Main Phaser game scene (rendering, movement, camera, weather)
│   │   ├── systems/
│   │   │   └── SaveSystem.ts         # LocalStorage persistence manager
│   │   ├── ui/
│   │   │   └── UIManager.ts          # Dialogue, World Map, Codex Journal, & Debug HUD
│   │   └── GameApp.ts                # Phaser 3 Game bootstrap
│   ├── types/
│   │   └── world.ts                  # TypeScript schemas and Zod validators (Districts, Morphology)
│   ├── world/
│   │   └── generator/
│   │       ├── SeedRandom.ts             # Deterministic PRNG & Simplex FBM noise
│   │       ├── WorldGraphGenerator.ts    # Macro topological graph & connectivity
│   │       ├── TerrainGenerator.ts       # Elevation, biomes, rivers, autotile foam shorelines
│   │       ├── EnvironmentGrammar.ts     # Spatial density fields, canopy clusters & clearings
│   │       ├── RouteCarver.ts            # A* path carver with bridges and milestone signposts
│   │       ├── SettlementMorphology.ts   # Generic rule-driven district settlement synthesis
│   │       ├── SettlementSynthesizer.ts  # Settlement compilation coordinator
│   │       ├── POIGenerator.ts           # 17 POIs and 10 visual secrets
│   │       ├── NPCNarrativeGenerator.ts  # 32 NPCs, gossip networks, and dialogue trees
│   │       ├── WorldCompiler.ts          # Compiles semantic data into layered tilemap
│   │       └── WorldValidator.ts         # Graph reachability & integrity validation
│   ├── main.ts
│   └── style.css
├── test/
│   └── world-generation.test.ts  # Vitest test suite
├── HANDOFF.md                    # Milestone 2 inspection and handoff report
├── ARCHITECTURE.md               # Detailed architectural specification
├── WORLD_GENERATION.md           # Pipeline explanation & future LLM authoring hooks
└── ASSETS.md                     # 100% CC0 public domain provenance documentation
```

---

## 📜 License

- **Code**: MIT License.
- **Assets**: 100% CC0 1.0 Universal (Public Domain).
