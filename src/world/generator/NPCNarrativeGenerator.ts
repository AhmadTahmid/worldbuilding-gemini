import { NPC } from '@/types/world';
import { TerrainData } from './TerrainGenerator';
import { SeedRandom } from './SeedRandom';

export class NPCNarrativeGenerator {
  public static generate(terrain: TerrainData, _rng: SeedRandom): NPC[] {
    const npcs: NPC[] = [
      // ================= CROWNPORT (10 NPCs) =================
      {
        id: 'npc_eldrin',
        name: 'Eldrin',
        role: 'Harbor Archivist',
        avatarEmoji: '🧙',
        settlementId: 'settlement_crownport',
        regionId: 'region_crownport',
        position: { x: 178, y: 114 },
        spriteIndex: 5,
        personalityTags: ['scholarly', 'meticulous', 'curious'],
        gossipTargets: ['npc_apprentice_toby', 'npc_lady_lydia'],
        relatedStoryId: 'story_clockmaker',
        dialogueTree: [
          {
            id: 'root',
            text: 'Greetings, traveler! I catalog every vessel and navigational chart entering Crownport. Lately, the tides have been erratic ever since Master Jeremy disappeared.',
            choices: [
              { text: 'Who is Master Jeremy?', nextNodeId: 'about_jeremy' },
              { text: 'Tell me about Crownport.', nextNodeId: 'about_city' },
              { text: 'Farewell.', nextNodeId: 'exit' },
            ],
          },
          {
            id: 'about_jeremy',
            text: 'Jeremy was our greatest horologist! He built the Great Clocktower in the plaza. He claimed he designed a Tidal Chronometer that could forecast sea surges, but he fled after arguing with the merchant council.',
          },
          {
            id: 'about_city',
            text: 'Crownport is the jewel of Aethelgard. Our docks connect to Tidebreak in the west and the mountain mines of Cragwatch in the northeast.',
          },
          { id: 'exit', text: 'May the calm seas favor your journey.' },
        ],
      },
      {
        id: 'npc_vance',
        name: 'Dockmaster Vance',
        role: 'Admiralty Wharfmaster',
        avatarEmoji: '⚓',
        settlementId: 'settlement_crownport',
        regionId: 'region_crownport',
        position: { x: 193, y: 128 },
        spriteIndex: 7,
        personalityTags: ['stern', 'observant', 'suspicious'],
        gossipTargets: ['npc_captain_kallum', 'npc_smuggler_jax'],
        relatedStoryId: 'story_smugglers',
        dialogueTree: [
          {
            id: 'root',
            text: 'Keep clear of the cargo cranes! We have three galleons unloading silver and mountain timber today.',
            choices: [
              { text: 'Notice any unusual shipments?', nextNodeId: 'smugglers_hint' },
              { text: 'How do I reach Tidebreak?', nextNodeId: 'directions' },
            ],
          },
          {
            id: 'smugglers_hint',
            text: 'Aye! Last night I caught sight of unmarked barrels stamped with a wolf head. They never paid the Admiralty tariff. The tracks came down from the mountain pass!',
          },
          {
            id: 'directions',
            text: 'Head west along the Old King’s Highway past the Crossroads, then take the salt trail south to Tidebreak.',
          },
        ],
      },
      {
        id: 'npc_captain_kallum',
        name: 'Captain Kallum',
        role: 'Tideguard Commander',
        avatarEmoji: '🛡️',
        settlementId: 'settlement_crownport',
        regionId: 'region_crownport',
        position: { x: 162, y: 96 },
        spriteIndex: 1,
        personalityTags: ['honorable', 'vigilant', 'authoritative'],
        gossipTargets: ['npc_vance', 'npc_keeper_silas'],
        dialogueTree: [
          {
            id: 'root',
            text: 'The Tideguard maintains law across the highways. Beware the deep waters south of Azure Coast—ancient ruins lurk beneath the surface.',
          },
        ],
      },
      {
        id: 'npc_lady_lydia',
        name: 'Lady Lydia',
        role: 'House Valerius Envoy',
        avatarEmoji: '👑',
        settlementId: 'settlement_crownport',
        regionId: 'region_crownport',
        position: { x: 182, y: 104 },
        spriteIndex: 6,
        personalityTags: ['aristocratic', 'sharp', 'gossipy'],
        gossipTargets: ['npc_eldrin', 'npc_apprentice_toby'],
        dialogueTree: [
          {
            id: 'root',
            text: 'That infernal clocktower ticks too loudly! Master Jeremy was always eccentric, murmuring about celestial gears before he vanished into the forest.',
          },
        ],
      },
      {
        id: 'npc_barkeep_barnaby',
        name: 'Barnaby',
        role: 'Tavern Keeper',
        avatarEmoji: '🍺',
        settlementId: 'settlement_crownport',
        regionId: 'region_crownport',
        position: { x: 160, y: 118 },
        spriteIndex: 11,
        personalityTags: ['jovial', 'talkative'],
        gossipTargets: ['npc_seraphina'],
        dialogueTree: [
          {
            id: 'root',
            text: 'Welcome to the Gilded Anchor! Warm stew and spiced cider for weary travelers. Have you heard the music Seraphina plays in the square?',
          },
        ],
      },
      {
        id: 'npc_mercer_felix',
        name: 'Felix',
        role: 'Market Merchant',
        avatarEmoji: '💰',
        settlementId: 'settlement_crownport',
        regionId: 'region_crownport',
        position: { x: 175, y: 102 },
        spriteIndex: 7,
        personalityTags: ['ambitious', 'shrewd'],
        gossipTargets: ['npc_foreman_burl'],
        dialogueTree: [
          {
            id: 'root',
            text: 'Fine highland wool from Cragwatch, medicinal tea from Oakhaven! Best prices in the realm.',
          },
        ],
      },
      {
        id: 'npc_apprentice_toby',
        name: 'Toby',
        role: 'Clockmaker Apprentice',
        avatarEmoji: '👦',
        settlementId: 'settlement_crownport',
        regionId: 'region_crownport',
        position: { x: 181, y: 107 },
        spriteIndex: 8,
        personalityTags: ['nervous', 'loyal', 'earnest'],
        gossipTargets: ['npc_eldrin'],
        relatedStoryId: 'story_clockmaker',
        dialogueTree: [
          {
            id: 'root',
            text: 'Master Jeremy didn’t abandon us! He left a hidden message in the clocktower gears pointing toward the abandoned lodge in the Whispering Weald.',
          },
        ],
      },
      {
        id: 'npc_seraphina',
        name: 'Seraphina',
        role: 'Wandering Minstrel',
        avatarEmoji: '🎻',
        settlementId: 'settlement_crownport',
        regionId: 'region_crownport',
        position: { x: 177, y: 112 },
        spriteIndex: 6,
        personalityTags: ['poetic', 'mysterious'],
        gossipTargets: ['npc_old_marin'],
        relatedStoryId: 'story_ghost_ship',
        dialogueTree: [
          {
            id: 'root',
            text: '♪ "O the pale frigate sails where the cold breakers weep, while Silas’s dark beacon lies asleep..." ♪ That song came from the old fishers of Tidebreak.',
          },
        ],
      },
      {
        id: 'npc_guard_garret',
        name: 'Garret',
        role: 'West Gate Sentry',
        avatarEmoji: '⚔️',
        settlementId: 'settlement_crownport',
        regionId: 'region_crownport',
        position: { x: 148, y: 108 },
        spriteIndex: 1,
        personalityTags: ['dutiful', 'cautious'],
        gossipTargets: ['npc_scout_talia'],
        dialogueTree: [
          {
            id: 'root',
            text: 'The road west leads through the Whispering Weald. Stay on the paved stones—the northern Deepwood is disorienting.',
          },
        ],
      },
      {
        id: 'npc_sister_clara',
        name: 'Sister Clara',
        role: 'Seafarer Priestess',
        avatarEmoji: '🕊️',
        settlementId: 'settlement_crownport',
        regionId: 'region_crownport',
        position: { x: 194, y: 96 },
        spriteIndex: 5,
        personalityTags: ['serene', 'pious'],
        gossipTargets: ['npc_diver_finn'],
        dialogueTree: [
          {
            id: 'root',
            text: 'We pray for all who brave the tides. The sea remembers what the land forgets.',
          },
        ],
      },

      // ================= OAKHAVEN & WEALD (8 NPCs) =================
      {
        id: 'npc_healer_maeve',
        name: 'Maeve',
        role: 'Master Herbalist',
        avatarEmoji: '🌿',
        settlementId: 'settlement_oakhaven',
        regionId: 'region_oakhaven',
        position: { x: 70, y: 118 },
        spriteIndex: 6,
        personalityTags: ['compassionate', 'wise', 'concerned'],
        gossipTargets: ['npc_foreman_burl', 'npc_hermit_alois'],
        relatedStoryId: 'story_moonflower',
        dialogueTree: [
          {
            id: 'root',
            text: 'Welcome, friend. I am tending healing brews. The miners up in Cragwatch suffer terribly from smelter smoke, and only the Deepwood Moonflower can cure them.',
            choices: [
              { text: 'Where can I find the Moonflower?', nextNodeId: 'moonflower_hint' },
              { text: 'Tell me about Oakhaven.', nextNodeId: 'about_oakhaven' },
            ],
          },
          {
            id: 'moonflower_hint',
            text: 'It blooms only under the full starlight in the ancient stone circle north of the Whispering Weald. Be careful of the thick forest fog!',
          },
          {
            id: 'about_oakhaven',
            text: 'Oakhaven is our sanctuary. The roots of the Great Oak run deep into the bedrock, providing sweet freshwater to all.',
          },
        ],
      },
      {
        id: 'npc_elder_rowan',
        name: 'Elder Rowan',
        role: 'Village Elder',
        avatarEmoji: '👴',
        settlementId: 'settlement_oakhaven',
        regionId: 'region_oakhaven',
        position: { x: 80, y: 122 },
        spriteIndex: 5,
        personalityTags: ['reverent', 'patient'],
        gossipTargets: ['npc_scholar_eustace'],
        relatedStoryId: 'story_sunken_king',
        dialogueTree: [
          {
            id: 'root',
            text: 'Long before Crownport existed, King Brandor ruled these shores. The twin standing stones northeast of our village mark where his signet was safeguarded.',
          },
        ],
      },
      {
        id: 'npc_ranger_brenna',
        name: 'Brenna',
        role: 'Weald Warden',
        avatarEmoji: '🏹',
        settlementId: 'settlement_oakhaven',
        regionId: 'region_oakhaven',
        position: { x: 86, y: 126 },
        spriteIndex: 2,
        personalityTags: ['sharp', 'stealthy'],
        gossipTargets: ['npc_woodcutter_cormac'],
        dialogueTree: [
          {
            id: 'root',
            text: 'The Weald is peaceful if you respect the trees. But watch for the waterfall grotto along the river—the water masks secret openings.',
          },
        ],
      },
      {
        id: 'npc_woodcutter_cormac',
        name: 'Cormac',
        role: 'Woodsman',
        avatarEmoji: '🪓',
        settlementId: 'settlement_oakhaven',
        regionId: 'region_oakhaven',
        position: { x: 72, y: 130 },
        spriteIndex: 4,
        personalityTags: ['gruff', 'hardworking'],
        gossipTargets: ['npc_apprentice_toby'],
        relatedStoryId: 'story_clockmaker',
        dialogueTree: [
          {
            id: 'root',
            text: 'I abandoned my old lodge to the northeast weeks ago. Some fellow in an indigo apron was hiding in the floorboards with brass gears.',
          },
        ],
      },
      {
        id: 'npc_innkeeper_willa',
        name: 'Willa',
        role: 'Hearthmistress',
        avatarEmoji: '🍲',
        settlementId: 'settlement_oakhaven',
        regionId: 'region_oakhaven',
        position: { x: 87, y: 118 },
        spriteIndex: 11,
        personalityTags: ['warm', 'hospitable'],
        gossipTargets: ['npc_healer_maeve'],
        dialogueTree: [
          {
            id: 'root',
            text: 'Rest your feet by the hearth! Have a bowl of wild mushroom broth before you venture down to the coast.',
          },
        ],
      },
      {
        id: 'npc_tanner_gideon',
        name: 'Gideon',
        role: 'Leatherworker',
        avatarEmoji: '🧤',
        settlementId: 'settlement_oakhaven',
        regionId: 'region_oakhaven',
        position: { x: 76, y: 132 },
        spriteIndex: 4,
        personalityTags: ['quiet', 'focused'],
        gossipTargets: ['npc_elder_rowan'],
        dialogueTree: [
          {
            id: 'root',
            text: 'Tanning buckskin requires steady hands. Don’t toss your coins down the dry well east of here—nobody has ever heard them hit bottom.',
          },
        ],
      },
      {
        id: 'npc_hermit_alois',
        name: 'Alois',
        role: 'Deepwood Hermit',
        avatarEmoji: '🍄',
        settlementId: 'settlement_oakhaven',
        regionId: 'region_deepwood',
        position: { x: 42, y: 36 },
        spriteIndex: 10,
        personalityTags: ['mystical', 'eccentric'],
        gossipTargets: ['npc_healer_maeve'],
        relatedStoryId: 'story_moonflower',
        dialogueTree: [
          {
            id: 'root',
            text: 'The trees whisper when the moon is high! Follow the blue spores to find the fairy ring.',
          },
        ],
      },
      {
        id: 'npc_scout_talia',
        name: 'Talia',
        role: 'Crossroad Wayfinder',
        avatarEmoji: '🧭',
        settlementId: 'settlement_oakhaven',
        regionId: 'region_oakhaven',
        position: { x: 128, y: 118 },
        spriteIndex: 2,
        personalityTags: ['friendly', 'informative'],
        gossipTargets: ['npc_guard_garret'],
        dialogueTree: [
          {
            id: 'root',
            text: 'You stand at Old King’s Crossroads! East leads to Crownport, West to Oakhaven, South to Tidebreak, and North across the bridge to the Dragon’s Spine.',
          },
        ],
      },

      // ================= TIDEBREAK (7 NPCs) =================
      {
        id: 'npc_old_marin',
        name: 'Old Marin',
        role: 'Veteran Fisherman',
        avatarEmoji: '🎣',
        settlementId: 'settlement_tidebreak',
        regionId: 'region_tidebreak',
        position: { x: 66, y: 196 },
        spriteIndex: 3,
        personalityTags: ['weathered', 'superstitious', 'haunted'],
        gossipTargets: ['npc_keeper_silas'],
        relatedStoryId: 'story_ghost_ship',
        dialogueTree: [
          {
            id: 'root',
            text: 'Listen closely, young traveler... The Pale Leviathan didn’t founder on the reef by accident forty winters ago. The lighthouse beacon went pitch black!',
            choices: [
              { text: 'Why did the lighthouse go dark?', nextNodeId: 'silas_hint' },
              { text: 'Where is the wreckage now?', nextNodeId: 'wreck_hint' },
            ],
          },
          {
            id: 'silas_hint',
            text: 'Ask Keeper Silas up in the tower! He was on duty that night, and his eyes have held the shadow of guilt ever since.',
          },
          {
            id: 'wreck_hint',
            text: 'Its bleached timbers lie in Sorrow Cove along the eastern sandbars. Some nights you can still hear the ship bell ringing.',
          },
        ],
      },
      {
        id: 'npc_keeper_silas',
        name: 'Silas',
        role: 'Beacon Keeper',
        avatarEmoji: '🏮',
        settlementId: 'settlement_tidebreak',
        regionId: 'region_tidebreak',
        position: { x: 55, y: 190 },
        spriteIndex: 5,
        personalityTags: ['sorrowful', 'reclusive'],
        gossipTargets: ['npc_old_marin'],
        relatedStoryId: 'story_ghost_ship',
        dialogueTree: [
          {
            id: 'root',
            text: 'The wind howls through the crystal prisms... If you seek the truth of that cursed winter night, check the journal behind the lantern glass.',
          },
        ],
      },
      {
        id: 'npc_barkeep_kora',
        name: 'Kora',
        role: 'Salty’s Proprietress',
        avatarEmoji: '🍷',
        settlementId: 'settlement_tidebreak',
        regionId: 'region_tidebreak',
        position: { x: 63, y: 194 },
        spriteIndex: 11,
        personalityTags: ['tough', 'clever'],
        gossipTargets: ['npc_smuggler_jax'],
        dialogueTree: [
          {
            id: 'root',
            text: 'Best clam chowder on the coast! Just don’t ask where the silver in the tip jar came from.',
          },
        ],
      },
      {
        id: 'npc_diver_finn',
        name: 'Finn',
        role: 'Pearl Diver',
        avatarEmoji: '🤿',
        settlementId: 'settlement_tidebreak',
        regionId: 'region_tidebreak',
        position: { x: 74, y: 202 },
        spriteIndex: 3,
        personalityTags: ['adventurous', 'carefree'],
        gossipTargets: ['npc_sister_clara'],
        dialogueTree: [
          {
            id: 'root',
            text: 'At low tide, you can walk the stepping stones south to a secluded sandbar shrine! The water is crystal clear.',
          },
        ],
      },
      {
        id: 'npc_shipwright_oscar',
        name: 'Oscar',
        role: 'Master Shipwright',
        avatarEmoji: '🔨',
        settlementId: 'settlement_tidebreak',
        regionId: 'region_tidebreak',
        position: { x: 72, y: 192 },
        spriteIndex: 4,
        personalityTags: ['practical', 'grumpy'],
        gossipTargets: ['npc_vance'],
        dialogueTree: [
          {
            id: 'root',
            text: 'Salt air rots oak faster than you’d believe. If Crownport keeps hiking timber tariffs, we’ll be rowing driftwood.',
          },
        ],
      },
      {
        id: 'npc_netweaver_maren',
        name: 'Maren',
        role: 'Kelp Weaver',
        avatarEmoji: '🧶',
        settlementId: 'settlement_tidebreak',
        regionId: 'region_tidebreak',
        position: { x: 68, y: 204 },
        spriteIndex: 6,
        personalityTags: ['gentle', 'melancholic'],
        gossipTargets: ['npc_old_marin'],
        dialogueTree: [
          {
            id: 'root',
            text: 'I weave blessings into the fishing nets so the sea spirits bring our mariners safely home.',
          },
        ],
      },
      {
        id: 'npc_smuggler_jax',
        name: 'Jax',
        role: 'Shadow Trader',
        avatarEmoji: '🗝️',
        settlementId: 'settlement_tidebreak',
        regionId: 'region_tidebreak',
        position: { x: 60, y: 206 },
        spriteIndex: 3,
        personalityTags: ['cunning', 'secretive'],
        gossipTargets: ['npc_vance'],
        relatedStoryId: 'story_smugglers',
        dialogueTree: [
          {
            id: 'root',
            text: 'Looking for rare goods? Follow the low-tide cliffs east toward the sea arches... if you know how to pick a lock, that is.',
          },
        ],
      },

      // ================= CRAGWATCH (7 NPCs) =================
      {
        id: 'npc_foreman_burl',
        name: 'Foreman Burl',
        role: 'High Peak Mining Boss',
        avatarEmoji: '⛏️',
        settlementId: 'settlement_cragwatch',
        regionId: 'region_cragwatch',
        position: { x: 204, y: 48 },
        spriteIndex: 4,
        personalityTags: ['sturdy', 'practical', 'ailing'],
        gossipTargets: ['npc_healer_maeve', 'npc_vance'],
        relatedStoryId: 'story_moonflower',
        dialogueTree: [
          {
            id: 'root',
            text: '*Cough*... The silver vein in the Echoing Chasm is rich, but the smelter fumes are taking our breath. We sent word to Healer Maeve in Oakhaven for her panacea.',
            choices: [
              { text: 'I am helping Maeve find the Moonflower.', nextNodeId: 'moonflower_progress' },
              { text: 'Tell me about Cragwatch.', nextNodeId: 'about_cragwatch' },
            ],
          },
          {
            id: 'moonflower_progress',
            text: 'Bless you, traveler! If you bring the elixir to our infirmary, the High Peak Guild will never forget your kindness.',
          },
          {
            id: 'about_cragwatch',
            text: 'We supply the finest forged steel and lodestones in the realm. The suspension bridge across the gorge leads down toward Crownport.',
          },
        ],
      },
      {
        id: 'npc_blacksmith_torin',
        name: 'Torin',
        role: 'Master Armorer',
        avatarEmoji: '⚒️',
        settlementId: 'settlement_cragwatch',
        regionId: 'region_cragwatch',
        position: { x: 210, y: 56 },
        spriteIndex: 4,
        personalityTags: ['boisterous', 'proud'],
        gossipTargets: ['npc_foreman_burl'],
        dialogueTree: [
          {
            id: 'root',
            text: 'Lodestone alloy doesn’t bend or rust! Crownport’s knights pay a fortune for our breastplates.',
          },
        ],
      },
      {
        id: 'npc_scholar_eustace',
        name: 'Scholar Eustace',
        role: 'Antiquarian',
        avatarEmoji: '📜',
        settlementId: 'settlement_cragwatch',
        regionId: 'region_cragwatch',
        position: { x: 198, y: 46 },
        spriteIndex: 5,
        personalityTags: ['intellectual', 'curious'],
        gossipTargets: ['npc_elder_rowan'],
        relatedStoryId: 'story_sunken_king',
        dialogueTree: [
          {
            id: 'root',
            text: 'The inscriptions at the peak overlook tell of King Brandor’s royal tomb beneath Azure Coast. Only his sapphire signet can break the ancient vault wards.',
          },
        ],
      },
      {
        id: 'npc_miner_flint',
        name: 'Flint',
        role: 'Cavern Sentry',
        avatarEmoji: '🕯️',
        settlementId: 'settlement_cragwatch',
        regionId: 'region_cragwatch',
        position: { x: 218, y: 46 },
        spriteIndex: 4,
        personalityTags: ['alert', 'brave'],
        gossipTargets: ['npc_foreman_burl'],
        dialogueTree: [
          {
            id: 'root',
            text: 'The Echoing Chasm portal is straight ahead. Strange resonance hums in the crystals when night falls.',
          },
        ],
      },
      {
        id: 'npc_innkeeper_greta',
        name: 'Greta',
        role: 'Lodge Hostess',
        avatarEmoji: '🍖',
        settlementId: 'settlement_cragwatch',
        regionId: 'region_cragwatch',
        position: { x: 198, y: 56 },
        spriteIndex: 11,
        personalityTags: ['robust', 'cheerful'],
        gossipTargets: ['npc_foreman_burl'],
        dialogueTree: [
          {
            id: 'root',
            text: 'Come inside where it’s warm! Roasted highland lamb and hot spiced mead will melt the frost from your boots.',
          },
        ],
      },
      {
        id: 'npc_bridge_guard_rolf',
        name: 'Rolf',
        role: 'Gorge Sentinel',
        avatarEmoji: '🛡️',
        settlementId: 'settlement_cragwatch',
        regionId: 'region_cragwatch',
        position: { x: 188, y: 72 },
        spriteIndex: 1,
        personalityTags: ['vigilant', 'stoic'],
        gossipTargets: ['npc_scout_talia'],
        dialogueTree: [
          {
            id: 'root',
            text: 'Watch your step on Dragon’s Spine Pass. The wind howls fiercely through the gorge, but the bridge ropes are freshly greased.',
          },
        ],
      },
      {
        id: 'npc_astronomer_lyra',
        name: 'Lyra',
        role: 'Stargazer',
        avatarEmoji: '🔭',
        settlementId: 'settlement_cragwatch',
        regionId: 'region_cragwatch',
        position: { x: 236, y: 66 },
        spriteIndex: 5,
        personalityTags: ['dreamy', 'insightful'],
        gossipTargets: ['npc_scholar_eustace'],
        dialogueTree: [
          {
            id: 'root',
            text: 'From this overlook you can see across all Aethelgard! On clear nights, the submerged arches of Azure Coast shine like sapphire stars.',
          },
        ],
      },
    ];

    // Stamp NPC positions into terrain collision grid (NPCs are solid to walk through directly, but interactive)
    for (const npc of npcs) {
      const { x, y } = npc.position;
      if (x >= 0 && x < terrain.width && y >= 0 && y < terrain.height) {
        terrain.collision[y][x] = true;
      }
    }

    return npcs;
  }
}
