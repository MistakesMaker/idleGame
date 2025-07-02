// --- START OF FILE realms.js ---

import { MONSTERS } from './monsters.js';

export const REALMS = [
    {
        name: "The Overworld",
        mapImage: "images/world_map.png",
        requiredLevel: 1,
        zones: {
            "green_meadows": {
                name: "Green Meadows",
                mapImage: "images/map_meadows_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_green_meadows.png",
                coords: { top: '78%', left: '20%' },
                icon: 'images/icons/green_meadows.png',
                subZones: {
                    // --- Sub-Zone: Verdant Fields (Levels 1-24) ---
                    "verdant_fields": { name: "Verdant Fields", levelRange: [1, 24], monsterPool: [MONSTERS.SLIME, MONSTERS.GOBLIN, MONSTERS.WILD_BOAR], coords: {top: '80%', left: '15%'} },
                    // --- Sub-Zone: General's Outpost (Boss Lvl 25) ---
                    "general_outpost": { name: "General's Outpost", levelRange: [25, 25], monsterPool: [MONSTERS.SLIME_GENERAL], coords: {top: '60%', left: '25%'}, isBoss: true },
                    // --- Sub-Zone: Whispering Woods (Levels 26-49) ---
                    "whispering_woods": { name: "Whispering Woods", levelRange: [26, 49], monsterPool: [MONSTERS.WOLF, MONSTERS.BAT, MONSTERS.GIANT_SPIDER], coords: {top: '75%', left: '45%'} },
                    // --- Sub-Zone: Guardian's Knoll (Boss Lvl 50) ---
                    "guardian_knoll": { name: "Guardian's Knoll", levelRange: [50, 50], monsterPool: [MONSTERS.DUNGEON_GUARDIAN], coords: {top: '55%', left: '60%'}, isBoss: true },
                    // --- Sub-Zone: Sun-dappled Hills (Levels 51-74) ---
                    "sun_dappled_hills": { name: "Sun-dappled Hills", levelRange: [51, 74], monsterPool: [MONSTERS.TREANT_SPROUT, MONSTERS.HOBGOBLIN, MONSTERS.FOREST_SPRITE], coords: {top: '35%', left: '40%'} },
                    // --- Sub-Zone: Royal Vanguard (Boss Lvl 75) ---
                    "royal_vanguard": { name: "Royal Vanguard", levelRange: [75, 75], monsterPool: [MONSTERS.ROYAL_GRIFFIN], coords: {top: '20%', left: '60%'}, isBoss: true }, 
                    // --- Sub-Zone: Royal Hunting Grounds (Levels 76-99) ---
                    "royal_hunting_grounds": { name: "Royal Hunting Grounds", levelRange: [76, 99], monsterPool: [MONSTERS.GRIFFIN_CHICK, MONSTERS.HOBGOBLIN, MONSTERS.FOREST_SPRITE], coords: {top: '30%', left: '85%'} },
                    // --- Sub-Zone: King's Castle (Boss Lvl 100) ---
                    "kings_castle": { name: "King's Castle", levelRange: [100, 100], monsterPool: [MONSTERS.KING_OF_SLIMES], coords: {top: '10%', left: '75%'}, isBoss: true }
                }
            },
            "orc_volcano": {
                name: "Orc Volcano",
                mapImage: "images/map_volcano_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_orc_volcano.png",
                coords: { top: '30%', left: '38%' },
                icon: 'images/icons/orc_volcano.png',
                subZones: {
                    // --- Sub-Zone: Ashfall Plains (Levels 101-124) ---
                    "ashfall_plains": { name: "Ashfall Plains", levelRange: [101, 124], monsterPool: [MONSTERS.ORC, MONSTERS.MAGMA_SLIME], coords: {top: '80%', left: '20%'} },
                    // --- Sub-Zone: Orc Watchtower (Boss Lvl 125) ---
                    "orc_watchtower": { name: "Orc Watchtower", levelRange: [125, 125], monsterPool: [MONSTERS.GIANT_ORC], coords: {top: '80%', left: '50%'}, isBoss: true },
                    // --- Sub-Zone: Scorched Path (Levels 126-149) ---
                    "scorched_path": { name: "Scorched Path", levelRange: [126, 149], monsterPool: [MONSTERS.ORC_SHAMAN, MONSTERS.LAVA_TURTLE], coords: {top: '80%', left: '80%'} },
                    // --- Sub-Zone: Molten Heart (Boss Lvl 150) ---
                    "molten_heart": { name: "Molten Heart", levelRange: [150, 150], monsterPool: [MONSTERS.MOLTEN_GUARDIAN], coords: {top: '50%', left: '75%'}, isBoss: true },
                    // --- Sub-Zone: Charred Forest (Levels 151-174) ---
                    "charred_forest": { name: "Charred Forest", levelRange: [151, 174], monsterPool: [MONSTERS.FIRE_ELEMENTAL, MONSTERS.SALAMANDER], coords: {top: '50%', left: '45%'} },
                    // --- Sub-Zone: Chieftain's Camp (Boss Lvl 175) ---
                    "chieftains_camp": { name: "Chieftain's Camp", levelRange: [175, 175], monsterPool: [MONSTERS.OBSIDIAN_GOLEM], coords: {top: '50%', left: '15%'}, isBoss: true },
                    // --- Sub-Zone: Volcano's Maw (Levels 176-199) ---
                    "volcanos_maw": { name: "Volcano's Maw", levelRange: [176, 199], monsterPool: [MONSTERS.ORC_BERSERKER, MONSTERS.FIRE_ELEMENTAL], coords: {top: '20%', left: '30%'} },
                    // --- Sub-Zone: Volcano Peak (Boss Lvl 200) ---
                    "volcano_peak": { name: "Volcano Peak", levelRange: [200, 200], monsterPool: [MONSTERS.RULER_OF_ORCS], coords: {top: '15%', left: '70%'}, isBoss: true }
                }
            },
            "undead_desert": {
                name: "Undead Desert",
                mapImage: "images/map_desert_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_undead_desert.png",
                coords: { top: '70%', left: '75%' },
                icon: 'images/icons/undead_desert.png',
                subZones: {
                    // --- Sub-Zone: Lost Tombs (Levels 201-224) ---
                    "lost_tombs": { name: "Lost Tombs", levelRange: [201, 224], monsterPool: [MONSTERS.SKELETON, MONSTERS.VULTURE], coords: {top: '85%', left: '15%'} },
                    // --- Sub-Zone: Mummy's Crypt (Boss Lvl 225) ---
                    "mummy_crypt": { name: "Mummy's Crypt", levelRange: [225, 225], monsterPool: [MONSTERS.CURSED_MUMMY], coords: {top: '85%', left: '45%'}, isBoss: true },
                    // --- Sub-Zone: Shifting Sands (Levels 226-249) ---
                    "shifting_sands": { name: "Shifting Sands", levelRange: [226, 249], monsterPool: [MONSTERS.ZOMBIE, MONSTERS.GHOUL], coords: {top: '85%', left: '75%'} },
                    // --- Sub-Zone: Cursed Pyramid (Boss Lvl 250) ---
                    "cursed_pyramid": { name: "Cursed Pyramid", levelRange: [250, 250], monsterPool: [MONSTERS.TOMB_ROBBER], coords: {top: '50%', left: '80%'}, isBoss: true },
                    // --- Sub-Zone: Scorpion Nest (Levels 251-274) ---
                    "scorpion_nest": { name: "Scorpion Nest", levelRange: [251, 274], monsterPool: [MONSTERS.GIANT_SCORPION, MONSTERS.SKELETAL_ARCHER], coords: {top: '50%', left: '50%'} },
                    // --- Sub-Zone: Tomb of the Guardian (Boss Lvl 275) ---
                    "tomb_of_the_guardian": { name: "Tomb of the Guardian", levelRange: [275, 275], monsterPool: [MONSTERS.SAND_WRAITH], coords: {top: '50%', left: '20%'}, isBoss: true },
                    // --- Sub-Zone: Endless Dunes (Levels 276-299) ---
                    "endless_dunes": { name: "Endless Dunes", levelRange: [276, 299], monsterPool: [MONSTERS.SAND_WRAITH, MONSTERS.GIANT_SCORPION, MONSTERS.SKELETAL_ARCHER], coords: {top: '20%', left: '30%'} },
                    // --- Sub-Zone: The Sand Pit (Boss Lvl 300) ---
                    "the_sand_pit": { name: "The Sand Pit", levelRange: [300, 300], monsterPool: [MONSTERS.GATEKEEPER_OF_THE_SANDS], coords: {top: '15%', left: '70%'}, isBoss: true }
                }
            },
            "final_dungeon": {
                name: "Final Dungeon",
                mapImage: "images/map_dungeon_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_final_dungeon.png",
                coords: { top: '22%', left: '78%' },
                icon: 'images/icons/final_dungeon.png',
                subZones: {
                    // --- Sub-Zone: The Gatehouse (Levels 301-324) ---
                    "gatehouse": { name: "The Gatehouse", levelRange: [301, 324], monsterPool: [MONSTERS.GARGOYLE, MONSTERS.IMP], coords: {top: '80%', left: '20%'} },
                    // --- Sub-Zone: Demon Sentry (Boss Lvl 325) ---
                    "demon_sentry": { name: "Demon Sentry", levelRange: [325, 325], monsterPool: [MONSTERS.DEMON_SENTRY_BOSS], coords: {top: '80%', left: '50%'}, isBoss: true },
                    // --- Sub-Zone: Halls of Damnation (Levels 326-349) ---
                    "halls_of_damnation": { name: "Halls of Damnation", levelRange: [326, 349], monsterPool: [MONSTERS.HELLHOUND, MONSTERS.CULTIST], coords: {top: '80%', left: '80%'} },
                    // --- Sub-Zone: The Hellforge (Boss Lvl 350) ---
                    "the_hellforge": { name: "The Hellforge", levelRange: [350, 350], monsterPool: [MONSTERS.HELLFORGE_GUARDIAN], coords: {top: '50%', left: '75%'}, isBoss: true },
                    // --- Sub-Zone: Brimstone Corridors (Levels 351-374) ---
                    "brimstone_corridors": { name: "Brimstone Corridors", levelRange: [351, 374], monsterPool: [MONSTERS.TOXIC_SULPHUR_GAS, MONSTERS.SUCCUBUS], coords: {top: '50%', left: '45%'} },
                    // --- Sub-Zone: Pit Lord's Arena (Boss Lvl 375) ---
                    "pit_lord_arena": { name: "Pit Lord's Arena", levelRange: [375, 375], monsterPool: [MONSTERS.PIT_FIEND], coords: {top: '50%', left: '15%'}, isBoss: true },
                    // --- Sub-Zone: Throne Approach (Levels 376-399) ---
                    "throne_approach": { name: "Throne Approach", levelRange: [376, 399], monsterPool: [MONSTERS.CHAOS_DEMON, MONSTERS.PIT_FIEND], coords: {top: '20%', left: '30%'} },
                    // --- Sub-Zone: Archdemon's Lair (Boss Lvl 400) ---
                    "archdemon_lair": { name: "Archdemon's Lair", levelRange: [400, 400], monsterPool: [MONSTERS.ARCHDEMON_OVERLORD], coords: {top: '15%', left: '70%'}, isBoss: true }
                }
            }
        }
    },
    {
        name: "The Underdark",
        mapImage: "images/underground_world_map.png", 
        requiredLevel: 401,
        zones: {
             "crystal_caves": {
                name: "Crystal Caverns",
                mapImage: "images/map_caves_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_caves.png",
                coords: { top: '80%', left: '15%' },
                icon: 'images/icons/ring.png',
                subZones: {
                    "glimmering_path": { name: "Glimmering Path", levelRange: [401, 424], monsterPool: [MONSTERS.CRYSTAL_SPIDER, MONSTERS.SHARD_SLIME], coords: {top: '80%', left: '20%'} },
                    "crystal_golem_boss": { name: "Crystal Golem", levelRange: [425, 425], monsterPool: [MONSTERS.CRYSTAL_GOLEM], coords: {top: '80%', left: '50%'}, isBoss: true },
                    "resonant_tunnels": { name: "Resonant Tunnels", levelRange: [426, 449], monsterPool: [MONSTERS.DEEP_GNOME_MINER, MONSTERS.CAVE_LURKER], coords: {top: '80%', left: '80%'} },
                    "crystal_guardian_lair": { name: "Crystal Guardian's Lair", levelRange: [450, 450], monsterPool: [MONSTERS.CRYSTALLINE_ELEMENTAL], coords: {top: '50%', left: '75%'}, isBoss: true },
                    "deep_caverns": { name: "Deep Caverns", levelRange: [451, 499], monsterPool: [MONSTERS.CAVE_LURKER, MONSTERS.DEEP_GNOME_MINER, MONSTERS.CRYSTAL_SPIDER], coords: {top: '50%', left: '45%'} },
                    "crystal_heart": { name: "Crystal Heart", levelRange: [500, 500], monsterPool: [MONSTERS.CRYSTAL_KING], coords: {top: '15%', left: '70%'}, isBoss: true }
                }
            },
            "fungal_forest": {
                name: "Fungal Forest",
                mapImage: "images/map_fungal_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_fungal.png",
                coords: { top: '65%', left: '40%' },
                icon: 'images/icons/necklace.png',
                subZones: {
                    "spore_meadows": { name: "Spore Meadows", levelRange: [501, 524], monsterPool: [MONSTERS.MYCONID_SPOREKEEPER, MONSTERS.SPORE_BAT], coords: {top: '80%', left: '20%'} },
                    "fungal_guardian": { name: "Fungal Guardian", levelRange: [525, 525], monsterPool: [MONSTERS.FUNGAL_BEHEMOTH], coords: {top: '80%', left: '50%'}, isBoss: true },
                    "mycelial_network": { name: "Mycelial Network", levelRange: [526, 549], monsterPool: [MONSTERS.FUNGAL_CRAWLER, MONSTERS.SHRIEKER], coords: {top: '80%', left: '80%'} },
                    "fungal_behemoth_cave": { name: "Fungal Behemoth's Cave", levelRange: [550, 550], monsterPool: [MONSTERS.GAS_SPORE], coords: {top: '50%', left: '75%'}, isBoss: true },
                    "shrieking_hollows": { name: "Shrieking Hollows", levelRange: [551, 599], monsterPool: [MONSTERS.SHRIEKER, MONSTERS.MYCONID_SPOREKEEPER, MONSTERS.FUNGAL_CRAWLER], coords: {top: '50%', left: '45%'} },
                    "the_great_fungus": { name: "The Great Fungus", levelRange: [600, 600], monsterPool: [MONSTERS.THE_GREAT_MYCELIUM], coords: {top: '15%', left: '70%'}, isBoss: true }
                }
            },
            "drow_city": {
                name: "Drow City",
                mapImage: "images/map_drow_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_drow.png",
                coords: { top: '35%', left: '65%' },
                icon: 'images/icons/belt.png',
                subZones: {
                    "outer_spires": { name: "Outer Spires", levelRange: [601, 624], monsterPool: [MONSTERS.DROW_WARRIOR, MONSTERS.GIANT_CAVE_SPIDER], coords: {top: '80%', left: '20%'} },
                    "drow_patrol": { name: "Drow Patrol", levelRange: [625, 625], monsterPool: [MONSTERS.DRIDER], coords: {top: '80%', left: '50%'}, isBoss: true },
                    "webbed_catacombs": { name: "Webbed Catacombs", levelRange: [626, 649], monsterPool: [MONSTERS.DROW_MAGE, MONSTERS.SHADOW_STALKER], coords: {top: '80%', left: '80%'} },
                    "drow_barracks": { name: "Drow Barracks", levelRange: [650, 650], monsterPool: [MONSTERS.DROW_PRIESTESS], coords: {top: '50%', left: '75%'}, isBoss: true },
                    "noble_district": { name: "Noble District", levelRange: [651, 699], monsterPool: [MONSTERS.DROW_WARRIOR, MONSTERS.DROW_MAGE, MONSTERS.SHADOW_STALKER], coords: {top: '50%', left: '45%'} },
                    "spider_queen_lair": { name: "Spider Queen's Lair", levelRange: [700, 700], monsterPool: [MONSTERS.SPIDER_QUEEN_MATRON], coords: {top: '15%', left: '70%'}, isBoss: true }
                }
            },
            "abyssal_rift": {
                name: "Abyssal Rift",
                mapImage: "images/map_abyss_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_abyss.png",
                coords: { top: '15%', left: '85%' },
                icon: 'images/icons/sword.png',
                subZones: {
                    "chasm_descent": { name: "Chasm Descent", levelRange: [701, 724], monsterPool: [MONSTERS.SHADOW_FIEND, MONSTERS.ABYSSAL_LEECH], coords: {top: '80%', left: '20%'} },
                    "demonic_gate": { name: "Demonic Gate", levelRange: [725, 725], monsterPool: [MONSTERS.DEMONIC_OVERSEER], coords: {top: '80%', left: '50%'}, isBoss: true },
                    "fields_of_madness": { name: "Fields of Madness", levelRange: [726, 749], monsterPool: [MONSTERS.VOID_WRAITH, MONSTERS.SHADOW_FIEND], coords: {top: '80%', left: '80%'} },
                    "balors_roost": { name: "Balor's Roost", levelRange: [750, 750], monsterPool: [MONSTERS.BALOR], coords: {top: '50%', left: '75%'}, isBoss: true },
                    "heart_of_chaos": { name: "Heart of Chaos", levelRange: [751, 799], monsterPool: [MONSTERS.VOID_WRAITH, MONSTERS.ABYSSAL_LEECH], coords: {top: '50%', left: '45%'} },
                    "the_final_abyss": { name: "The Final Abyss", levelRange: [800, 800], monsterPool: [MONSTERS.MAW_OF_THE_ABYSS], coords: {top: '15%', left: '70%'}, isBoss: true }
                }
            }
        }
    },
    {
        name: "The Sunken World",
        mapImage: "images/world_map.png", // Placeholder
        requiredLevel: 801,
        zones: {
            "tide_wracked_coast": {
                name: "Tide-Wracked Coast",
                mapImage: "images/map_caves_zoomed.png", // Placeholder
                monsterAreaBg: "images/backgrounds/bg_caves.png", // Placeholder
                coords: { top: '78%', left: '20%' }, // Placeholder
                icon: 'images/icons/green_meadows.png', // Placeholder
                subZones: {
                    "shipwreck_graveyard": { name: "Shipwreck Graveyard", levelRange: [801, 824], monsterPool: [MONSTERS.GHOSTLY_PIRATE, MONSTERS.SIREN], coords: { top: '80%', left: '20%' } },
                    "harbor_of_the_damned": { name: "Harbor of the Damned", levelRange: [825, 825], monsterPool: [MONSTERS.TIDAL_ELEMENTAL], coords: { top: '80%', left: '50%' }, isBoss: true },
                    "coral_forest": { name: "Coral Forest", levelRange: [826, 849], monsterPool: [MONSTERS.GHOSTLY_PIRATE, MONSTERS.SIREN], coords: { top: '80%', left: '80%' } },
                    "captains_folly": { name: "Captain's Folly", levelRange: [850, 850], monsterPool: [MONSTERS.TIDAL_ELEMENTAL], coords: { top: '50%', left: '75%' }, isBoss: true },
                    "siren_cove": { name: "Siren's Cove", levelRange: [851, 899], monsterPool: [MONSTERS.GHOSTLY_PIRATE, MONSTERS.SIREN], coords: { top: '50%', left: '45%' } },
                    "the_maelstrom": { name: "The Maelstrom", levelRange: [900, 900], monsterPool: [MONSTERS.TIDAL_ELEMENTAL], coords: { top: '15%', left: '70%' }, isBoss: true }
                }
            },
            "sunken_city": {
                name: "Sunken City",
                mapImage: "images/map_volcano_zoomed.png", // Placeholder
                monsterAreaBg: "images/backgrounds/bg_orc_volcano.png", // Placeholder
                coords: { top: '30%', left: '38%' }, // Placeholder
                icon: 'images/icons/orc_volcano.png', // Placeholder
                subZones: {
                    "ruined_plaza": { name: "Ruined Plaza", levelRange: [901, 924], monsterPool: [MONSTERS.DEEP_SEA_SERPENT, MONSTERS.ANGLERFISH_HORROR], coords: { top: '80%', left: '20%' } },
                    "the_triton_king": { name: "The Triton King", levelRange: [925, 925], monsterPool: [MONSTERS.THE_KRAKEN], coords: { top: '80%', left: '50%' }, isBoss: true },
                    "royal_gardens": { name: "Royal Gardens", levelRange: [926, 949], monsterPool: [MONSTERS.DEEP_SEA_SERPENT, MONSTERS.ANGLERFISH_HORROR], coords: { top: '80%', left: '80%' } },
                    "the_leviathan": { name: "The Leviathan", levelRange: [950, 950], monsterPool: [MONSTERS.THE_KRAKEN], coords: { top: '50%', left: '75%' }, isBoss: true },
                    "throne_room": { name: "Throne Room", levelRange: [951, 999], monsterPool: [MONSTERS.DEEP_SEA_SERPENT, MONSTERS.ANGLERFISH_HORROR], coords: { top: '50%', left: '45%' } },
                    "heart_of_atlantis": { name: "Heart of Atlantis", levelRange: [1000, 1000], monsterPool: [MONSTERS.THE_KRAKEN], coords: { top: '15%', left: '70%' }, isBoss: true }
                }
            },
            "bioluminescent_trench": {
                name: "Bioluminescent Trench",
                mapImage: "images/map_desert_zoomed.png", // Placeholder
                monsterAreaBg: "images/backgrounds/bg_undead_desert.png", // Placeholder
                coords: { top: '70%', left: '75%' }, // Placeholder
                icon: 'images/icons/undead_desert.png', // Placeholder
                subZones: {
                    "glowing_caves": { name: "Glowing Caves", levelRange: [1001, 1024], monsterPool: [MONSTERS.VOLCANIC_TUBE_WORM, MONSTERS.MAGMA_CRAB], coords: { top: '80%', left: '20%' } },
                    "ancient_crab": { name: "Ancient Crab", levelRange: [1025, 1025], monsterPool: [MONSTERS.ANCIENT_LEVIATHAN], coords: { top: '80%', left: '50%' }, isBoss: true },
                    "thermal_vents": { name: "Thermal Vents", levelRange: [1026, 1049], monsterPool: [MONSTERS.VOLCANIC_TUBE_WORM, MONSTERS.MAGMA_CRAB], coords: { top: '80%', left: '80%' } },
                    "the_great_worm": { name: "The Great Worm", levelRange: [1050, 1050], monsterPool: [MONSTERS.ANCIENT_LEVIATHAN], coords: { top: '50%', left: '75%' }, isBoss: true },
                    "deepest_dark": { name: "Deepest Dark", levelRange: [1051, 1099], monsterPool: [MONSTERS.VOLCANIC_TUBE_WORM, MONSTERS.MAGMA_CRAB], coords: { top: '50%', left: '45%' } },
                    "the_unseen_terror": { name: "The Unseen Terror", levelRange: [1100, 1100], monsterPool: [MONSTERS.ANCIENT_LEVIATHAN], coords: { top: '15%', left: '70%' }, isBoss: true }
                }
            },
            "void_maw": {
                name: "Void Maw",
                mapImage: "images/map_dungeon_zoomed.png", // Placeholder
                monsterAreaBg: "images/backgrounds/bg_final_dungeon.png", // Placeholder
                coords: { top: '22%', left: '78%' }, // Placeholder
                icon: 'images/icons/final_dungeon.png', // Placeholder
                subZones: {
                    "edge_of_sanity": { name: "Edge of Sanity", levelRange: [1101, 1124], monsterPool: [MONSTERS.FACELESS_ONE, MONSTERS.ELDRITCH_TENTACLE], coords: { top: '80%', left: '20%' } },
                    "first_seal": { name: "First Seal", levelRange: [1125, 1125], monsterPool: [MONSTERS.CTHULIAN_ASPECT], coords: { top: '80%', left: '50%' }, isBoss: true },
                    "whispering_chasm": { name: "Whispering Chasm", levelRange: [1126, 1149], monsterPool: [MONSTERS.FACELESS_ONE, MONSTERS.ELDRITCH_TENTACLE], coords: { top: '80%', left: '80%' } },
                    "second_seal": { name: "Second Seal", levelRange: [1150, 1150], monsterPool: [MONSTERS.CTHULIAN_ASPECT], coords: { top: '50%', left: '75%' }, isBoss: true },
                    "the_unraveling": { name: "The Unraveling", levelRange: [1151, 1199], monsterPool: [MONSTERS.FACELESS_ONE, MONSTERS.ELDRITCH_TENTACLE], coords: { top: '50%', left: '45%' } },
                    "the_dreaming_god": { name: "The Dreaming God", levelRange: [1200, 1200], monsterPool: [MONSTERS.CTHULIAN_ASPECT], coords: { top: '15%', left: '70%' }, isBoss: true }
                }
            }
        }
    },
    {
        name: "The Celestial Planes",
        mapImage: "images/world_map.png", // Placeholder
        requiredLevel: 1201,
        zones: {
            "azure_pathway": {
                name: "Azure Pathway",
                mapImage: "images/map_caves_zoomed.png", // Placeholder
                monsterAreaBg: "images/backgrounds/bg_caves.png", // Placeholder
                coords: { top: '78%', left: '20%' }, // Placeholder
                icon: 'images/icons/green_meadows.png', // Placeholder
                subZones: {
                    "cloudy_steps": { name: "Cloudy Steps", levelRange: [1201, 1224], monsterPool: [MONSTERS.CLOUD_SERPENT, MONSTERS.SKY_WISP], coords: { top: '80%', left: '20%' } },
                    "the_wind_lord": { name: "The Wind Lord", levelRange: [1225, 1225], monsterPool: [MONSTERS.GRYPHON_SENTINEL], coords: { top: '80%', left: '50%' }, isBoss: true },
                    "sea_of_clouds": { name: "Sea of Clouds", levelRange: [1226, 1249], monsterPool: [MONSTERS.CLOUD_SERPENT, MONSTERS.SKY_WISP], coords: { top: '80%', left: '80%' } },
                    "the_storm_titan": { name: "The Storm Titan", levelRange: [1250, 1250], monsterPool: [MONSTERS.GRYPHON_SENTINEL], coords: { top: '50%', left: '75%' }, isBoss: true },
                    "tempest_peak": { name: "Tempest Peak", levelRange: [1251, 1299], monsterPool: [MONSTERS.CLOUD_SERPENT, MONSTERS.SKY_WISP], coords: { top: '50%', left: '45%' } },
                    "the_sky_father": { name: "The Sky Father", levelRange: [1300, 1300], monsterPool: [MONSTERS.GRYPHON_SENTINEL], coords: { top: '15%', left: '70%' }, isBoss: true }
                }
            },
            "halls_of_valor": {
                name: "Halls of Valor",
                mapImage: "images/map_volcano_zoomed.png", // Placeholder
                monsterAreaBg: "images/backgrounds/bg_orc_volcano.png", // Placeholder
                coords: { top: '30%', left: '38%' }, // Placeholder
                icon: 'images/icons/orc_volcano.png', // Placeholder
                subZones: {
                    "gates_of_valhalla": { name: "Gates of Valhalla", levelRange: [1301, 1324], monsterPool: [MONSTERS.VALKYRIE, MONSTERS.EINHERJAR], coords: { top: '80%', left: '20%' } },
                    "heimdall": { name: "Heimdall", levelRange: [1325, 1325], monsterPool: [MONSTERS.ODINS_RAVEN], coords: { top: '80%', left: '50%' }, isBoss: true },
                    "the_great_hall": { name: "The Great Hall", levelRange: [1326, 1349], monsterPool: [MONSTERS.VALKYRIE, MONSTERS.EINHERJAR], coords: { top: '80%', left: '80%' } },
                    "thor": { name: "Thor", levelRange: [1350, 1350], monsterPool: [MONSTERS.ODINS_RAVEN], coords: { top: '50%', left: '75%' }, isBoss: true },
                    "asgardian_armory": { name: "Asgardian Armory", levelRange: [1351, 1399], monsterPool: [MONSTERS.VALKYRIE, MONSTERS.EINHERJAR], coords: { top: '50%', left: '45%' } },
                    "odin_the_allfather": { name: "Odin the Allfather", levelRange: [1400, 1400], monsterPool: [MONSTERS.ODINS_RAVEN], coords: { top: '15%', left: '70%' }, isBoss: true }
                }
            },
            "astral_sea": {
                name: "Astral Sea",
                mapImage: "images/map_desert_zoomed.png", // Placeholder
                monsterAreaBg: "images/backgrounds/bg_undead_desert.png", // Placeholder
                coords: { top: '70%', left: '75%' }, // Placeholder
                icon: 'images/icons/undead_desert.png', // Placeholder
                subZones: {
                    "nebula_fields": { name: "Nebula Fields", levelRange: [1401, 1424], monsterPool: [MONSTERS.STARWHALE, MONSTERS.COMET_ELEMENTAL], coords: { top: '80%', left: '20%' } },
                    "the_hunter": { name: "The Hunter", levelRange: [1425, 1425], monsterPool: [MONSTERS.THE_LIVING_CONSTELLATION], coords: { top: '80%', left: '50%' }, isBoss: true },
                    "stardust_river": { name: "Stardust River", levelRange: [1426, 1449], monsterPool: [MONSTERS.STARWHALE, MONSTERS.COMET_ELEMENTAL], coords: { top: '80%', left: '80%' } },
                    "the_great_bear": { name: "The Great Bear", levelRange: [1450, 1450], monsterPool: [MONSTERS.THE_LIVING_CONSTELLATION], coords: { top: '50%', left: '75%' }, isBoss: true },
                    "galaxy_core": { name: "Galaxy Core", levelRange: [1451, 1499], monsterPool: [MONSTERS.STARWHALE, MONSTERS.COMET_ELEMENTAL], coords: { top: '50%', left: '45%' } },
                    "the_zodiac": { name: "The Zodiac", levelRange: [1500, 1500], monsterPool: [MONSTERS.THE_LIVING_CONSTELLATION], coords: { top: '15%', left: '70%' }, isBoss: true }
                }
            },
            "empyrean_throne": {
                name: "Empyrean Throne",
                mapImage: "images/map_dungeon_zoomed.png", // Placeholder
                monsterAreaBg: "images/backgrounds/bg_final_dungeon.png", // Placeholder
                coords: { top: '22%', left: '78%' }, // Placeholder
                icon: 'images/icons/final_dungeon.png', // Placeholder
                subZones: {
                    "the_pearly_gates": { name: "The Pearly Gates", levelRange: [1501, 1524], monsterPool: [MONSTERS.SERAPH, MONSTERS.ARCHON], coords: { top: '80%', left: '20%' } },
                    "the_gatekeeper": { name: "The Gatekeeper", levelRange: [1525, 1525], monsterPool: [MONSTERS.CELESTIAL_JUDGE], coords: { top: '80%', left: '50%' }, isBoss: true },
                    "the_divine_court": { name: "The Divine Court", levelRange: [1526, 1549], monsterPool: [MONSTERS.SERAPH, MONSTERS.ARCHON], coords: { top: '80%', left: '80%' } },
                    "the_high_council": { name: "The High Council", levelRange: [1550, 1550], monsterPool: [MONSTERS.CELESTIAL_JUDGE], coords: { top: '50%', left: '75%' }, isBoss: true },
                    "the_sanctum_sanctorum": { name: "The Sanctum Sanctorum", levelRange: [1551, 1599], monsterPool: [MONSTERS.SERAPH, MONSTERS.ARCHON], coords: { top: '50%', left: '45%' } },
                    "the_creator": { name: "The Creator", levelRange: [1600, 1600], monsterPool: [MONSTERS.CELESTIAL_JUDGE], coords: { top: '15%', left: '70%' }, isBoss: true }
                }
            }
        }
    },
    {
        name: "The Aetherium Forge",
        mapImage: "images/world_map.png", // Placeholder
        requiredLevel: 1601,
        zones: {
            "mana_wastes": {
                name: "Mana Wastes",
                mapImage: "images/map_caves_zoomed.png", // Placeholder
                monsterAreaBg: "images/backgrounds/bg_caves.png", // Placeholder
                coords: { top: '78%', left: '20%' }, // Placeholder
                icon: 'images/icons/green_meadows.png', // Placeholder
                subZones: {
                    "the_weeping_wastes": { name: "The Weeping Wastes", levelRange: [1601, 1624], monsterPool: [MONSTERS.MANA_WRAITH, MONSTERS.CHAOS_SPAWN], coords: { top: '80%', left: '20%' } },
                    "the_first_automaton": { name: "The First Automaton", levelRange: [1625, 1625], monsterPool: [MONSTERS.GUARDIAN_AUTOMATON], coords: { top: '80%', left: '50%' }, isBoss: true },
                    "the_unraveled_lands": { name: "The Unraveled Lands", levelRange: [1626, 1649], monsterPool: [MONSTERS.MANA_WRAITH, MONSTERS.CHAOS_SPAWN], coords: { top: '80%', left: '80%' } },
                    "the_mad_architect": { name: "The Mad Architect", levelRange: [1650, 1650], monsterPool: [MONSTERS.GUARDIAN_AUTOMATON], coords: { top: '50%', left: '75%' }, isBoss: true },
                    "the_broken_shore": { name: "The Broken Shore", levelRange: [1651, 1699], monsterPool: [MONSTERS.MANA_WRAITH, MONSTERS.CHAOS_SPAWN], coords: { top: '50%', left: '45%' } },
                    "the_entropy_engine": { name: "The Entropy Engine", levelRange: [1700, 1700], monsterPool: [MONSTERS.GUARDIAN_AUTOMATON], coords: { top: '15%', left: '70%' }, isBoss: true }
                }
            },
            "clockwork_city": {
                name: "Clockwork City",
                mapImage: "images/map_volcano_zoomed.png", // Placeholder
                monsterAreaBg: "images/backgrounds/bg_orc_volcano.png", // Placeholder
                coords: { top: '30%', left: '38%' }, // Placeholder
                icon: 'images/icons/orc_volcano.png', // Placeholder
                subZones: {
                    "the_bronze_gate": { name: "The Bronze Gate", levelRange: [1701, 1724], monsterPool: [MONSTERS.LIVING_SPELLBOOK, MONSTERS.RUNE_GOLEM], coords: { top: '80%', left: '20%' } },
                    "the_timekeeper": { name: "The Timekeeper", levelRange: [1725, 1725], monsterPool: [MONSTERS.THE_LIBRARIAN], coords: { top: '80%', left: '50%' }, isBoss: true },
                    "the_gear_district": { name: "The Gear District", levelRange: [1726, 1749], monsterPool: [MONSTERS.LIVING_SPELLBOOK, MONSTERS.RUNE_GOLEM], coords: { top: '80%', left: '80%' } },
                    "the_astronomer": { name: "The Astronomer", levelRange: [1750, 1750], monsterPool: [MONSTERS.THE_LIBRARIAN], coords: { top: '50%', left: '75%' }, isBoss: true },
                    "the_power_core": { name: "The Power Core", levelRange: [1751, 1799], monsterPool: [MONSTERS.LIVING_SPELLBOOK, MONSTERS.RUNE_GOLEM], coords: { top: '50%', left: '45%' } },
                    "the_prime_mover": { name: "The Prime Mover", levelRange: [1800, 1800], monsterPool: [MONSTERS.THE_LIBRARIAN], coords: { top: '15%', left: '70%' }, isBoss: true }
                }
            },
            "rune_scriptorium": {
                name: "Rune Scriptorium",
                mapImage: "images/map_desert_zoomed.png", // Placeholder
                monsterAreaBg: "images/backgrounds/bg_undead_desert.png", // Placeholder
                coords: { top: '70%', left: '75%' }, // Placeholder
                icon: 'images/icons/undead_desert.png', // Placeholder
                subZones: {
                    "the_silent_library": { name: "The Silent Library", levelRange: [1801, 1824], monsterPool: [MONSTERS.AETHER_ELEMENTAL, MONSTERS.NEXUS_STALKER], coords: { top: '80%', left: '20%' } },
                    "the_first_scribe": { name: "The First Scribe", levelRange: [1825, 1825], monsterPool: [MONSTERS.THE_FORGEMASTER], coords: { top: '80%', left: '50%' }, isBoss: true },
                    "the_forbidden_wing": { name: "The Forbidden Wing", levelRange: [1826, 1849], monsterPool: [MONSTERS.AETHER_ELEMENTAL, MONSTERS.NEXUS_STALKER], coords: { top: '80%', left: '80%' } },
                    "the_archivist": { name: "The Archivist", levelRange: [1850, 1850], monsterPool: [MONSTERS.THE_FORGEMASTER], coords: { top: '50%', left: '75%' }, isBoss: true },
                    "the_endless_stacks": { name: "The Endless Stacks", levelRange: [1851, 1899], monsterPool: [MONSTERS.AETHER_ELEMENTAL, MONSTERS.NEXUS_STALKER], coords: { top: '50%', left: '45%' } },
                    "the_final_word": { name: "The Final Word", levelRange: [1900, 1900], monsterPool: [MONSTERS.THE_FORGEMASTER], coords: { top: '15%', left: '70%' }, isBoss: true }
                }
            },
            "nexus_of_creation": {
                name: "Nexus of Creation",
                mapImage: "images/map_dungeon_zoomed.png", // Placeholder
                monsterAreaBg: "images/backgrounds/bg_final_dungeon.png", // Placeholder
                coords: { top: '22%', left: '78%' }, // Placeholder
                icon: 'images/icons/final_dungeon.png', // Placeholder
                subZones: {
                    "the_birthing_pools": { name: "The Birthing Pools", levelRange: [1901, 1924], monsterPool: [MONSTERS.PRIMORDIAL_BEING, MONSTERS.ECHO_OF_CREATION], coords: { top: '80%', left: '20%' } },
                    "the_first_thought": { name: "The First Thought", levelRange: [1925, 1925], monsterPool: [MONSTERS.THE_FIRST_SENTIENCE], coords: { top: '80%', left: '50%' }, isBoss: true },
                    "the_loom_of_fate": { name: "The Loom of Fate", levelRange: [1926, 1949], monsterPool: [MONSTERS.PRIMORDIAL_BEING, MONSTERS.ECHO_OF_CREATION], coords: { top: '80%', left: '80%' } },
                    "the_first_feeling": { name: "The First Feeling", levelRange: [1950, 1950], monsterPool: [MONSTERS.THE_FIRST_SENTIENCE], coords: { top: '50%', left: '75%' }, isBoss: true },
                    "the_final_nexus": { name: "The Final Nexus", levelRange: [1951, 1999], monsterPool: [MONSTERS.PRIMORDIAL_BEING, MONSTERS.ECHO_OF_CREATION], coords: { top: '50%', left: '45%' } },
                    "the_first_will": { name: "The First Will", levelRange: [2000, 2000], monsterPool: [MONSTERS.THE_FIRST_SENTIENCE], coords: { top: '15%', left: '70%' }, isBoss: true }
                }
            }
        }
    }
];