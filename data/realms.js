import { MONSTERS } from './monsters.js';
// We no longer import ITEMS here to prevent circular dependencies.

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
                    // --- Tier 1 (Levels 1-50) ---
                    "verdant_fields": { name: "Verdant Fields", levelRange: [1, 24], monsterPool: [MONSTERS.SLIME, MONSTERS.GOBLIN, MONSTERS.WILD_BOAR], coords: {top: '80%', left: '15%'} },
                    "general_outpost": { name: "General's Outpost", levelRange: [25, 25], monsterPool: [MONSTERS.SLIME_GENERAL], coords: {top: '60%', left: '25%'}, isBoss: true },
                    "whispering_woods": { name: "Whispering Woods", levelRange: [26, 49], monsterPool: [MONSTERS.WOLF, MONSTERS.BAT, MONSTERS.GIANT_SPIDER], coords: {top: '75%', left: '45%'} },
                    "guardian_knoll": { name: "Guardian's Knoll", levelRange: [50, 50], monsterPool: [MONSTERS.DUNGEON_GUARDIAN], coords: {top: '55%', left: '60%'}, isBoss: true },
                    
                    // --- Tier 2 (Levels 51-75) ---
                    "sun_dappled_hills": { name: "Sun-dappled Hills", levelRange: [51, 74], monsterPool: [MONSTERS.TREANT_SPROUT, MONSTERS.HOBGOBLIN, MONSTERS.FOREST_SPRITE], coords: {top: '35%', left: '40%'} },
                    "royal_vanguard": { name: "Royal Vanguard", levelRange: [75, 75], monsterPool: [MONSTERS.ROYAL_GRIFFIN], coords: {top: '20%', left: '60%'}, isBoss: true }, 
                    
                    // --- Tier 3 (Levels 76-100) ---
                    "royal_hunting_grounds": { name: "Royal Hunting Grounds", levelRange: [76, 99], monsterPool: [MONSTERS.GRIFFIN_CHICK, MONSTERS.HOBGOBLIN, MONSTERS.FOREST_SPRITE], coords: {top: '30%', left: '85%'} },
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
                    // --- Tier 1 (Levels 101-150) ---
                    "ashfall_plains": { name: "Ashfall Plains", levelRange: [101, 124], monsterPool: [MONSTERS.ORC, MONSTERS.MAGMA_SLIME], coords: {top: '80%', left: '20%'} },
                    "orc_watchtower": { name: "Orc Watchtower", levelRange: [125, 125], monsterPool: [MONSTERS.GIANT_ORC], coords: {top: '80%', left: '50%'}, isBoss: true },
                    "scorched_path": { name: "Scorched Path", levelRange: [126, 149], monsterPool: [MONSTERS.ORC_SHAMAN, MONSTERS.LAVA_TURTLE], coords: {top: '80%', left: '80%'} },
                    "molten_heart": { name: "Molten Heart", levelRange: [150, 150], monsterPool: [MONSTERS.DUNGEON_GUARDIAN], coords: {top: '50%', left: '75%'}, isBoss: true },
                    
                    // --- Tier 2 (Levels 151-175) ---
                    "charred_forest": { name: "Charred Forest", levelRange: [151, 174], monsterPool: [MONSTERS.FIRE_ELEMENTAL, MONSTERS.SALAMANDER], coords: {top: '50%', left: '45%'} },
                    "chieftains_camp": { name: "Chieftain's Camp", levelRange: [175, 175], monsterPool: [MONSTERS.OBSIDIAN_GOLEM], coords: {top: '50%', left: '15%'}, isBoss: true },

                    // --- Tier 3 (Levels 176-200) ---
                    "volcanos_maw": { name: "Volcano's Maw", levelRange: [176, 199], monsterPool: [MONSTERS.ORC_BERSERKER, MONSTERS.FIRE_ELEMENTAL], coords: {top: '20%', left: '30%'} },
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
                     // --- Tier 1 (Levels 201-250) ---
                     "lost_tombs": { name: "Lost Tombs", levelRange: [201, 224], monsterPool: [MONSTERS.SKELETON, MONSTERS.VULTURE], coords: {top: '85%', left: '15%'} },
                     "mummy_crypt": { name: "Mummy's Crypt", levelRange: [225, 225], monsterPool: [MONSTERS.CURSED_MUMMY], coords: {top: '85%', left: '45%'}, isBoss: true },
                     "shifting_sands": { name: "Shifting Sands", levelRange: [226, 249], monsterPool: [MONSTERS.ZOMBIE, MONSTERS.GHOUL], coords: {top: '85%', left: '75%'} },
                     "cursed_pyramid": { name: "Cursed Pyramid", levelRange: [250, 250], monsterPool: [MONSTERS.TOMB_ROBBER], coords: {top: '50%', left: '80%'}, isBoss: true },

                     // --- Tier 2 (Levels 251-275) ---
                     "scorpion_nest": { name: "Scorpion Nest", levelRange: [251, 274], monsterPool: [MONSTERS.GIANT_SCORPION, MONSTERS.SKELETAL_ARCHER], coords: {top: '50%', left: '50%'} },
                     "tomb_of_the_guardian": { name: "Tomb of the Guardian", levelRange: [275, 275], monsterPool: [MONSTERS.SAND_WRAITH], coords: {top: '50%', left: '20%'}, isBoss: true },

                     // --- Tier 3 (Levels 276-300) ---
                     "endless_dunes": { name: "Endless Dunes", levelRange: [276, 299], monsterPool: [MONSTERS.SAND_WRAITH, MONSTERS.GIANT_SCORPION, MONSTERS.SKELETAL_ARCHER], coords: {top: '20%', left: '30%'} },
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
                    // --- Tier 1 (Levels 301-350) ---
                    "gatehouse": { name: "The Gatehouse", levelRange: [301, 324], monsterPool: [MONSTERS.GARGOYLE, MONSTERS.IMP], coords: {top: '80%', left: '20%'} },
                    "demon_sentry": { name: "Demon Sentry", levelRange: [325, 325], monsterPool: [MONSTERS.DUNGEON_GUARDIAN], coords: {top: '80%', left: '50%'}, isBoss: true },
                    "halls_of_damnation": { name: "Halls of Damnation", levelRange: [326, 349], monsterPool: [MONSTERS.HELLHOUND, MONSTERS.CULTIST], coords: {top: '80%', left: '80%'} },
                    "the_hellforge": { name: "The Hellforge", levelRange: [350, 350], monsterPool: [MONSTERS.DUNGEON_GUARDIAN], coords: {top: '50%', left: '75%'}, isBoss: true },
                    
                    // --- Tier 2 (Levels 351-375) ---
                    "brimstone_corridors": { name: "Brimstone Corridors", levelRange: [351, 374], monsterPool: [MONSTERS.TOXIC_SULPHUR_GAS, MONSTERS.SUCCUBUS], coords: {top: '50%', left: '45%'} },
                    "pit_lord_arena": { name: "Pit Lord's Arena", levelRange: [375, 375], monsterPool: [MONSTERS.PIT_FIEND], coords: {top: '50%', left: '15%'}, isBoss: true },
                    
                    // --- Tier 3 (Levels 376-400) ---
                    "throne_approach": { name: "Throne Approach", levelRange: [376, 399], monsterPool: [MONSTERS.CHAOS_DEMON, MONSTERS.PIT_FIEND], coords: {top: '20%', left: '30%'} },
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
                coords: { top: '70%', left: '25%' },
                icon: 'images/icons/ring.png',
                subZones: {
                    // --- Tier 1 (Levels 401-450) ---
                    "glimmering_path": { name: "Glimmering Path", levelRange: [401, 424], monsterPool: [MONSTERS.CRYSTAL_SPIDER, MONSTERS.SHARD_SLIME], coords: {top: '80%', left: '20%'} },
                    "crystal_golem": { name: "Crystal Golem", levelRange: [425, 425], monsterPool: [MONSTERS.CRYSTAL_GOLEM], coords: {top: '80%', left: '50%'}, isBoss: true },
                    "resonant_tunnels": { name: "Resonant Tunnels", levelRange: [426, 449], monsterPool: [MONSTERS.DEEP_GNOME_MINER, MONSTERS.CAVE_LURKER], coords: {top: '80%', left: '80%'} },
                    "crystal_guardian_lair": { name: "Crystal Guardian's Lair", levelRange: [450, 450], monsterPool: [MONSTERS.CRYSTALLINE_ELEMENTAL], coords: {top: '50%', left: '75%'}, isBoss: true },
                    
                    // --- Tier 2 (Levels 451-500) ---
                    "deep_caverns": { name: "Deep Caverns", levelRange: [451, 499], monsterPool: [MONSTERS.CAVE_LURKER, MONSTERS.DEEP_GNOME_MINER, MONSTERS.CRYSTAL_SPIDER], coords: {top: '50%', left: '45%'} },
                    "crystal_heart": { name: "Crystal Heart", levelRange: [500, 500], monsterPool: [MONSTERS.CRYSTAL_KING], coords: {top: '15%', left: '70%'}, isBoss: true }
                }
            },
            "fungal_forest": {
                name: "Fungal Forest",
                mapImage: "images/map_fungal_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_fungal.png",
                coords: { top: '40%', left: '50%' },
                icon: 'images/icons/necklace.png',
                subZones: {
                    // --- Tier 1 (Levels 501-550) ---
                    "spore_meadows": { name: "Spore Meadows", levelRange: [501, 524], monsterPool: [MONSTERS.MYCONID_SPOREKEEPER, MONSTERS.SPORE_BAT], coords: {top: '80%', left: '20%'} },
                    "fungal_guardian": { name: "Fungal Guardian", levelRange: [525, 525], monsterPool: [MONSTERS.FUNGAL_BEHEMOTH], coords: {top: '80%', left: '50%'}, isBoss: true },
                    "mycelial_network": { name: "Mycelial Network", levelRange: [526, 549], monsterPool: [MONSTERS.FUNGAL_CRAWLER, MONSTERS.SHRIEKER], coords: {top: '80%', left: '80%'} },
                    "fungal_behemoth_cave": { name: "Fungal Behemoth's Cave", levelRange: [550, 550], monsterPool: [MONSTERS.GAS_SPORE], coords: {top: '50%', left: '75%'}, isBoss: true },

                    // --- Tier 2 (Levels 551-600) ---
                    "shrieking_hollows": { name: "Shrieking Hollows", levelRange: [551, 599], monsterPool: [MONSTERS.SHRIEKER, MONSTERS.MYCONID_SPOREKEEPER, MONSTERS.FUNGAL_CRAWLER], coords: {top: '50%', left: '45%'} },
                    "the_great_fungus": { name: "The Great Fungus", levelRange: [600, 600], monsterPool: [MONSTERS.THE_GREAT_MYCELIUM], coords: {top: '15%', left: '70%'}, isBoss: true }
                }
            },
            "drow_city": {
                name: "Drow City",
                mapImage: "images/map_drow_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_drow.png",
                coords: { top: '25%', left: '75%' },
                icon: 'images/icons/belt.png',
                subZones: {
                    // --- Tier 1 (Levels 601-650) ---
                    "outer_spires": { name: "Outer Spires", levelRange: [601, 624], monsterPool: [MONSTERS.DROW_WARRIOR, MONSTERS.GIANT_CAVE_SPIDER], coords: {top: '80%', left: '20%'} },
                    "drow_patrol": { name: "Drow Patrol", levelRange: [625, 625], monsterPool: [MONSTERS.DRIDER], coords: {top: '80%', left: '50%'}, isBoss: true },
                    "webbed_catacombs": { name: "Webbed Catacombs", levelRange: [626, 649], monsterPool: [MONSTERS.DROW_MAGE, MONSTERS.SHADOW_STALKER], coords: {top: '80%', left: '80%'} },
                    "drow_barracks": { name: "Drow Barracks", levelRange: [650, 650], monsterPool: [MONSTERS.DROW_PRIESTESS], coords: {top: '50%', left: '75%'}, isBoss: true },
                    
                    // --- Tier 2 (Levels 651-700) ---
                    "noble_district": { name: "Noble District", levelRange: [651, 699], monsterPool: [MONSTERS.DROW_WARRIOR, MONSTERS.DROW_MAGE, MONSTERS.SHADOW_STALKER], coords: {top: '50%', left: '45%'} },
                    "spider_queen_lair": { name: "Spider Queen's Lair", levelRange: [700, 700], monsterPool: [MONSTERS.SPIDER_QUEEN_MATRON], coords: {top: '15%', left: '70%'}, isBoss: true }
                }
            }
        }
    }
];