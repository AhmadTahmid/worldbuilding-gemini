import { POI, SecretLocation } from '@/types/world';
import { TerrainData } from './TerrainGenerator';
import { SeedRandom } from './SeedRandom';

export class POIGenerator {
  public static generate(terrain: TerrainData, _rng: SeedRandom): { pois: POI[]; secrets: SecretLocation[] } {
    const pois: POI[] = [
      // Micro-Story Participating POIs
      {
        id: 'poi_crownport_clocktower',
        name: 'The Great Clocktower',
        archetype: 'mysterious_statue',
        position: { x: 180, y: 109 },
        regionId: 'region_crownport',
        description: 'The towering four-faced clocktower overlooking Crownport Plaza.',
        examineText: 'The massive brass gears tick in a rhythmic cadence. Etched into the main escapement wheel is a small inscription left by Master Jeremy.',
        microStoryId: 'story_clockmaker',
      },
      {
        id: 'poi_abandoned_cottage',
        name: 'Abandoned Woodcutter Lodge',
        archetype: 'abandoned_cottage',
        position: { x: 110, y: 85 },
        regionId: 'region_oakhaven',
        description: 'A decaying timber cabin with broken roof slats and overgrown ivy.',
        examineText: 'Dust dances in the shafts of sunlight. Beneath a loose pine floorboard rests an intricate brass cipher plate.',
        microStoryId: 'story_clockmaker',
      },
      {
        id: 'poi_clockmaker_grotto',
        name: 'Sunken Clockwork Grotto',
        archetype: 'hidden_grotto',
        position: { x: 165, y: 195 },
        regionId: 'region_azure_coast',
        description: 'A damp sea cave echoing with the tick of submerged mechanisms.',
        examineText: 'An iron chest sits on a dry stone plinth. Fitting the brass cipher plate into the lock reveals the golden Tidal Chronometer!',
        microStoryId: 'story_clockmaker',
        isSecret: true,
      },
      {
        id: 'poi_tidebreak_inn',
        name: "Old Salty's Tavern",
        archetype: 'campsite',
        position: { x: 64, y: 195 },
        regionId: 'region_tidebreak',
        description: 'A smoke-filled seaside tavern where aged mariners exchange ghost stories.',
        examineText: 'A carved whale tooth on the wall depicts the Pale Leviathan frigate sailing into dense fog.',
        microStoryId: 'story_ghost_ship',
      },
      {
        id: 'poi_lighthouse_top',
        name: 'The Ancient Beacon',
        archetype: 'watchtower_ruin',
        position: { x: 54, y: 189 },
        regionId: 'region_tidebreak',
        description: 'The monumental stone lighthouse that has warned ships away from the razor reefs for centuries.',
        examineText: 'The giant crystal lens glimmers in the sky. Behind the lens frame is a secret cubby with Keeper Silas’s remorseful journal.',
        microStoryId: 'story_ghost_ship',
      },
      {
        id: 'poi_shipwreck_cove',
        name: 'Sorrow Cove Shipwreck',
        archetype: 'sunken_skiff',
        position: { x: 115, y: 220 },
        regionId: 'region_azure_coast',
        description: 'The barnacle-encrusted ribs of a majestic frigate jutting out of the white surf.',
        examineText: 'Among the bleached timbers lies Captain Arthur’s brass compass, humming faintly with trapped memories.',
        microStoryId: 'story_ghost_ship',
      },
      {
        id: 'poi_crownport_docks',
        name: 'Admiralty Wharf',
        archetype: 'scenic_overlook',
        position: { x: 194, y: 129 },
        regionId: 'region_crownport',
        description: 'The deep-water stone quays where merchant galleons unload exotic cargoes.',
        examineText: 'A stack of heavy oak barrels bears a carved wolf-head sigil. The wood smells faintly of high mountain smelter pine.',
        microStoryId: 'story_smugglers',
      },
      {
        id: 'poi_mountain_pass_camp',
        name: "Dragon's Spine Cache",
        archetype: 'campsite',
        position: { x: 175, y: 75 },
        regionId: 'region_cragwatch',
        description: 'A sheltered nook beneath an overhanging granite boulder along the high pass.',
        examineText: 'Hidden under a flat slate slab is an oilskin ledger documenting clandestine silver shipments to the coast.',
        microStoryId: 'story_smugglers',
      },
      {
        id: 'poi_smugglers_cave',
        name: "Smuggler's Cove Cache",
        archetype: 'cave_entrance',
        position: { x: 135, y: 195 },
        regionId: 'region_azure_coast',
        description: 'A sea-level grotto stacked high with contraband crates and refined silver ingots.',
        examineText: 'The crates are marked with the wolf sigil. You uncover the iron stamp used to forge the Crownport tax seal!',
        microStoryId: 'story_smugglers',
        isSecret: true,
      },
      {
        id: 'poi_oakhaven_apothecary',
        name: "Maeve's Apothecary",
        archetype: 'strange_tree',
        position: { x: 68, y: 116 },
        regionId: 'region_oakhaven',
        description: 'A fragrant timber cottage surrounded by beds of lavender, sage, and rare moss.',
        examineText: 'Drying herbs hang from the rafters. Maeve’s treatise on the table details the medicinal virtues of the Deepwood Moonflower.',
        microStoryId: 'story_moonflower',
      },
      {
        id: 'poi_deepwood_glade',
        name: 'The Moonlit Fairy Ring',
        archetype: 'stone_circle',
        position: { x: 85, y: 45 },
        regionId: 'region_deepwood',
        description: 'A circle of glowing blue mushrooms and ancient standing stones in the heart of Deepwood.',
        examineText: 'In the center of the ring blooms the rare Luminescent Moonflower, emitting a gentle azure luminescence.',
        microStoryId: 'story_moonflower',
      },
      {
        id: 'poi_cragwatch_infirmary',
        name: "Miner's Rest Infirmary",
        archetype: 'campsite',
        position: { x: 196, y: 55 },
        regionId: 'region_cragwatch',
        description: 'A warm stone shelter where ailing miners rest by the hearth.',
        examineText: 'The miners cough softly from the smelter smoke. A fresh pot of boiling mountain water awaits herbal medicine.',
        microStoryId: 'story_moonflower',
      },
      {
        id: 'poi_mountain_shrine',
        name: 'Mistfall Peak Shrine',
        archetype: 'shrine',
        position: { x: 235, y: 65 },
        regionId: 'region_cragwatch',
        description: 'An ancient granite shrine looking out over the clouds of the continent.',
        examineText: 'The ancient stone tablet records the lineage of King Brandor and his burial in the Whispering Weald.',
        microStoryId: 'story_sunken_king',
      },
      {
        id: 'poi_weald_stone_circle',
        name: 'Twin Monoliths of Brandor',
        archetype: 'stone_circle',
        position: { x: 95, y: 100 },
        regionId: 'region_oakhaven',
        description: 'Two towering moss-covered monoliths standing silent sentinel in the forest.',
        examineText: 'Between the deep roots of the monoliths rests a stone urn containing King Brandor’s Sapphire Signet.',
        microStoryId: 'story_sunken_king',
      },
      {
        id: 'poi_sunken_crypt_vault',
        name: 'Royal Crypt of King Brandor',
        archetype: 'ruins',
        position: { x: 215, y: 195 },
        regionId: 'region_azure_coast',
        description: 'A half-submerged cyclopean stone doorway leading into the royal catacombs.',
        examineText: 'A massive seal in the center of the vault doors matches the shape of King Brandor’s signet ring.',
        microStoryId: 'story_sunken_king',
      },

      // Additional Exploration POIs
      {
        id: 'poi_elder_well',
        name: 'The Whispering Dry Well',
        archetype: 'forgotten_well',
        position: { x: 125, y: 140 },
        regionId: 'region_oakhaven',
        description: 'An ancient stone well far off the beaten road. Faint breezes murmur from its depths.',
        examineText: 'Dropping a small stone produces no sound. You hear the distant echo of a subterranean ocean tide.',
      },
      {
        id: 'poi_elderwood_altar',
        name: 'Elderwood Altar of the Weald',
        archetype: 'shrine',
        position: { x: 50, y: 40 },
        regionId: 'region_deepwood',
        description: 'A living altar carved from petrified wood and ancient vine tendrils.',
        examineText: 'The air here smells of pine needle and elder honey. The ancient forest spirits watch quietly.',
      },
    ];

    // 10+ Secrets with distinct visual hints
    const secrets: SecretLocation[] = [
      {
        id: 'secret_waterfall_grotto',
        name: 'Hidden Waterfall Grotto',
        position: { x: 105, y: 155 },
        regionId: 'region_oakhaven',
        hint: 'Where the river bends sharply east, a curtain of mist conceals a narrow passage behind the boulders.',
        visualCue: 'Cascading river foam and a slight opening between two mossy rocks.',
        discoveryFlag: 'found_secret_waterfall_grotto',
        rewardDescription: 'An ancient iron chest containing 150 Golden Florins and a Weald Warden Cloak.',
      },
      {
        id: 'secret_sandbar_shrine',
        name: 'Secluded Sandbar Shrine',
        position: { x: 100, y: 215 },
        regionId: 'region_tidebreak',
        hint: 'A string of low-tide rocks south of Tidebreak leads to a solitary white sand island.',
        visualCue: 'Natural stone stepping stones piercing the turquoise shallows.',
        discoveryFlag: 'found_secret_sandbar_shrine',
        rewardDescription: 'A glowing Pearl of the Deep Tide that repels sea mist.',
      },
      {
        id: 'secret_smuggler_passage',
        name: "Smuggler's Sea Cavern",
        position: { x: 135, y: 195 },
        regionId: 'region_azure_coast',
        hint: 'Behind the twin sea arches lies a hidden dry cavern above high-water mark.',
        visualCue: 'A narrow gap in the dark cliff wall marked by an anchor carving.',
        discoveryFlag: 'found_secret_smuggler_passage',
        rewardDescription: 'Contraband silver bars and the illicit merchant ledger.',
      },
      {
        id: 'secret_mountain_mine_stash',
        name: 'Abandoned Silver Vein Ledge',
        position: { x: 228, y: 38 },
        regionId: 'region_cragwatch',
        hint: 'Follow the broken rail cart tracks beyond the high mine portal along the outer cliff.',
        visualCue: 'A weathered wooden plank spanning a narrow rock crevice.',
        discoveryFlag: 'found_secret_mountain_mine_stash',
        rewardDescription: 'Luminous lodestones that glow in the dark.',
      },
      {
        id: 'secret_witch_sanctuary',
        name: 'The Witch’s Hidden Herb Glade',
        position: { x: 38, y: 32 },
        regionId: 'region_deepwood',
        hint: 'Dense pine trees form a labyrinth in northwest Deepwood, hiding a peaceful floral clearing.',
        visualCue: 'A carpet of glowing blue mushrooms guiding through the tree trunks.',
        discoveryFlag: 'found_secret_witch_sanctuary',
        rewardDescription: 'A vial of Elixir of Swiftness (+30% move speed).',
      },
      {
        id: 'secret_clockmaker_vault',
        name: 'Jeremy’s Tidal Workshop',
        position: { x: 165, y: 195 },
        regionId: 'region_azure_coast',
        hint: 'A secret lock in the coastal rock face operated by a brass gear.',
        visualCue: 'A brass plate embedded in the limestone.',
        discoveryFlag: 'found_secret_clockmaker_vault',
        rewardDescription: 'The Golden Tidal Chronometer.',
      },
      {
        id: 'secret_overlook_chest',
        name: 'High Peak Eagle Roost',
        position: { x: 248, y: 68 },
        regionId: 'region_cragwatch',
        hint: 'A dizzying mountain spire overlooking the entire eastern bay.',
        visualCue: 'An iron piton driven into the stone at the path edge.',
        discoveryFlag: 'found_secret_overlook_chest',
        rewardDescription: 'A Spyglass of the High Winds revealing the full world map.',
      },
      {
        id: 'secret_drowned_tomb',
        name: 'Tomb of the First Admiral',
        position: { x: 202, y: 172 },
        regionId: 'region_azure_coast',
        hint: 'Submerged marble columns near the reef at low tide.',
        visualCue: 'Pale carved marble slabs beneath clear coastal water.',
        discoveryFlag: 'found_secret_drowned_tomb',
        rewardDescription: 'The Ceremonial Rapier of the Tideguard.',
      },
      {
        id: 'secret_druid_grove',
        name: 'The Whispering Hollow',
        position: { x: 62, y: 92 },
        regionId: 'region_oakhaven',
        hint: 'A colossal hollow oak tree north of Oakhaven with a hidden interior chamber.',
        visualCue: 'A wide knot in the ancient bark emitting warm amber light.',
        discoveryFlag: 'found_secret_druid_grove',
        rewardDescription: 'An Amber Amulet of Vitality.',
      },
      {
        id: 'secret_lighthouse_cellar',
        name: 'Silas’s Secret Smuggler Cellar',
        position: { x: 50, y: 192 },
        regionId: 'region_tidebreak',
        hint: 'Beneath the wooden stilt deck of the lighthouse lies a hidden trapdoor.',
        visualCue: 'A rusted iron ring attached to a wooden hatch.',
        discoveryFlag: 'found_secret_lighthouse_cellar',
        rewardDescription: 'A cache of aged mariner’s spiced rum and silver coins.',
      },
    ];

    // Stamp POI props onto map
    for (const poi of pois) {
      const { x, y } = poi.position;
      if (x >= 0 && x < terrain.width && y >= 0 && y < terrain.height) {
        if (poi.archetype === 'shrine') {
          terrain.lowerObjectTiles[y][x] = 58; // Shrine pedestal
          terrain.collision[y][x] = true;
        } else if (poi.archetype === 'mysterious_statue') {
          terrain.lowerObjectTiles[y][x] = 57; // Runestone
          terrain.collision[y][x] = true;
        } else if (poi.archetype === 'cave_entrance' || poi.archetype === 'ruins') {
          terrain.lowerObjectTiles[y][x] = 59; // Cave / Portal
          terrain.collision[y][x] = false;
        } else if (poi.archetype === 'forgotten_well') {
          terrain.lowerObjectTiles[y][x] = 54; // Well
          terrain.collision[y][x] = true;
        } else if (poi.archetype === 'stone_circle') {
          terrain.lowerObjectTiles[y][x] = 41; // Fairy Mushroom
          terrain.collision[y][x] = false;
        } else if (poi.archetype === 'campsite') {
          terrain.lowerObjectTiles[y][x] = 60; // Campfire
          terrain.collision[y][x] = false;
        } else if (poi.archetype === 'sunken_skiff') {
          terrain.lowerObjectTiles[y][x] = 62; // Shipwreck
          terrain.collision[y][x] = false;
        } else {
          terrain.lowerObjectTiles[y][x] = 55; // Chest / POI box
          terrain.collision[y][x] = true;
        }

        // Ensure at least one adjacent tile is walkable so player can interact with the POI
        if (y + 1 < terrain.height) {
          terrain.collision[y + 1][x] = false;
        }
      }
    }

    // Stamp Secrets (Secret chests & altars)
    for (const sec of secrets) {
      const { x, y } = sec.position;
      if (x >= 0 && x < terrain.width && y >= 0 && y < terrain.height) {
        terrain.lowerObjectTiles[y][x] = 55; // Golden Chest
        terrain.collision[y][x] = true;
        if (y + 1 < terrain.height) {
          terrain.collision[y + 1][x] = false;
        }
      }
    }

    return { pois, secrets };
  }
}
