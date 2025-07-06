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
                mapImage: "images/backgrounds/sub_zone/map_meadows_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_green_meadows.png",
                coords: { top: '78%', left: '20%' },
                icon: 'images/icons/green_meadows.png',
                subZones: {
                    // --- Sub-Zone: Verdant Fields (Levels 1-24) ---
                    "verdant_fields": { name: "Verdant Fields", levelRange: [1, 24], monsterPool: [MONSTERS.SLIME, MONSTERS.GOBLIN, MONSTERS.WILD_BOAR], coords: {top: '80%', left: '15%'}, icon: 'images/icons/verdant_fields.png' },
                    // --- Sub-Zone: General's Outpost (Boss Lvl 25) ---
                    "general_outpost": { name: "General's Outpost", levelRange: [25, 25], monsterPool: [MONSTERS.SLIME_GENERAL], coords: {top: '60%', left: '25%'}, isBoss: true, icon: 'images/icons/general_outpost.png' },
                    // --- Sub-Zone: Whispering Woods (Levels 26-49) ---
                    "whispering_woods": { name: "Whispering Woods", levelRange: [26, 49], monsterPool: [MONSTERS.WOLF, MONSTERS.BAT, MONSTERS.GIANT_SPIDER], coords: {top: '75%', left: '45%'}, icon: 'images/icons/whispering_woods.png' },
                    // --- Sub-Zone: Guardian's Knoll (Boss Lvl 50) ---
                    "guardian_knoll": { name: "Guardian's Knoll", levelRange: [50, 50], monsterPool: [MONSTERS.DUNGEON_GUARDIAN], coords: {top: '55%', left: '60%'}, isBoss: true, icon: 'images/icons/guardian_knoll.png' },
                    // --- Sub-Zone: Sun-dappled Hills (Levels 51-74) ---
                    "sun_dappled_hills": { name: "Sun-dappled Hills", levelRange: [51, 74], monsterPool: [MONSTERS.TREANT_SPROUT, MONSTERS.HOBGOBLIN, MONSTERS.FOREST_SPRITE], coords: {top: '35%', left: '40%'}, icon: 'images/icons/sun_dappled_hills.png' },
                    // --- Sub-Zone: Royal Vanguard (Boss Lvl 75) ---
                    "royal_vanguard": { name: "Royal Vanguard", levelRange: [75, 75], monsterPool: [MONSTERS.ROYAL_GRIFFIN], coords: {top: '20%', left: '60%'}, isBoss: true, icon: 'images/icons/royal_vanguard.png' },
                    // --- Sub-Zone: Royal Hunting Grounds (Levels 76-99) ---
                    "royal_hunting_grounds": { name: "Royal Hunting Grounds", levelRange: [76, 99], monsterPool: [MONSTERS.GRIFFIN_CHICK, MONSTERS.HOBGOBLIN, MONSTERS.FOREST_SPRITE], coords: {top: '30%', left: '85%'}, icon: 'images/icons/royal_hunting_grounds.png' },
                    // --- Sub-Zone: King's Castle (Boss Lvl 100) ---
                    "kings_castle": { name: "King's Castle", levelRange: [100, 100], monsterPool: [MONSTERS.KING_OF_SLIMES], coords: {top: '10%', left: '75%'}, isBoss: true, icon: 'images/icons/kings_castle.png' }
                }
            },
            "orc_volcano": {
                name: "Orc Volcano",
                mapImage: "images/backgrounds/sub_zone/map_volcano_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_orc_volcano.png",
                coords: { top: '30%', left: '38%' },
                icon: 'images/icons/orc_volcano.png',
                subZones: {
                    // --- Sub-Zone: Ashfall Plains (Levels 101-124) ---
                    "ashfall_plains": { name: "Ashfall Plains", levelRange: [101, 124], monsterPool: [MONSTERS.ORC, MONSTERS.MAGMA_SLIME], coords: {top: '80%', left: '20%'}, icon: 'images/icons/ashfall_plains.png' },
                    // --- Sub-Zone: Orc Watchtower (Boss Lvl 125) ---
                    "orc_watchtower": { name: "Orc Watchtower", levelRange: [125, 125], monsterPool: [MONSTERS.GIANT_ORC], coords: {top: '80%', left: '50%'}, isBoss: true, icon: 'images/icons/orc_watchtower.png' },
                    // --- Sub-Zone: Scorched Path (Levels 126-149) ---
                    "scorched_path": { name: "Scorched Path", levelRange: [126, 149], monsterPool: [MONSTERS.ORC_SHAMAN, MONSTERS.LAVA_TURTLE], coords: {top: '80%', left: '80%'}, icon: 'images/icons/scorched_path.png' },
                    // --- Sub-Zone: Molten Heart (Boss Lvl 150) ---
                    "molten_heart": { name: "Molten Heart", levelRange: [150, 150], monsterPool: [MONSTERS.MOLTEN_GUARDIAN], coords: {top: '50%', left: '75%'}, isBoss: true, icon: 'images/icons/molten_heart.png' },
                    // --- Sub-Zone: Charred Forest (Levels 151-174) ---
                    "charred_forest": { name: "Charred Forest", levelRange: [151, 174], monsterPool: [MONSTERS.FIRE_ELEMENTAL, MONSTERS.SALAMANDER], coords: {top: '50%', left: '45%'}, icon: 'images/icons/charred_forest.png' },
                    // --- Sub-Zone: Chieftain's Camp (Boss Lvl 175) ---
                    "chieftains_camp": { name: "Chieftain's Camp", levelRange: [175, 175], monsterPool: [MONSTERS.OBSIDIAN_GOLEM], coords: {top: '50%', left: '15%'}, isBoss: true, icon: 'images/icons/chieftains_camp.png' },
                    // --- Sub-Zone: Volcano's Maw (Levels 176-199) ---
                    "volcanos_maw": { name: "Volcano's Maw", levelRange: [176, 199], monsterPool: [MONSTERS.ORC_BERSERKER, MONSTERS.FIRE_ELEMENTAL], coords: {top: '20%', left: '30%'}, icon: 'images/icons/volcanos_maw.png' },
                    // --- Sub-Zone: Volcano Peak (Boss Lvl 200) ---
                    "volcano_peak": { name: "Volcano Peak", levelRange: [200, 200], monsterPool: [MONSTERS.RULER_OF_ORCS], coords: {top: '15%', left: '70%'}, isBoss: true, icon: 'images/icons/volcano_peak.png' }
                }
            },
            "undead_desert": {
                name: "Undead Desert",
                mapImage: "images/backgrounds/sub_zone/map_desert_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_undead_desert.png",
                coords: { top: '70%', left: '75%' },
                icon: 'images/icons/undead_desert.png',
                subZones: {
                    // --- Sub-Zone: Lost Tombs (Levels 201-224) ---
                    "lost_tombs": { name: "Lost Tombs", levelRange: [201, 224], monsterPool: [MONSTERS.SKELETON, MONSTERS.VULTURE], coords: {top: '85%', left: '15%'}, icon: 'images/icons/lost_tombs.png' },
                    // --- Sub-Zone: Mummy's Crypt (Boss Lvl 225) ---
                    "mummy_crypt": { name: "Mummy's Crypt", levelRange: [225, 225], monsterPool: [MONSTERS.CURSED_MUMMY], coords: {top: '85%', left: '45%'}, isBoss: true, icon: 'images/icons/mummy_crypt.png' },
                    // --- Sub-Zone: Shifting Sands (Levels 226-249) ---
                    "shifting_sands": { name: "Shifting Sands", levelRange: [226, 249], monsterPool: [MONSTERS.ZOMBIE, MONSTERS.GHOUL], coords: {top: '85%', left: '75%'}, icon: 'images/icons/shifting_sands.png' },
                    // --- Sub-Zone: Cursed Pyramid (Boss Lvl 250) ---
                    "cursed_pyramid": { name: "Cursed Pyramid", levelRange: [250, 250], monsterPool: [MONSTERS.TOMB_ROBBER], coords: {top: '50%', left: '80%'}, isBoss: true, icon: 'images/icons/cursed_pyramid.png' },
                    // --- Sub-Zone: Scorpion Nest (Levels 251-274) ---
                    "scorpion_nest": { name: "Scorpion Nest", levelRange: [251, 274], monsterPool: [MONSTERS.GIANT_SCORPION, MONSTERS.SKELETAL_ARCHER], coords: {top: '50%', left: '50%'}, icon: 'images/icons/scorpion_nest.png' },
                    // --- Sub-Zone: Tomb of the Guardian (Boss Lvl 275) ---
                    "tomb_of_the_guardian": { name: "Tomb of the Guardian", levelRange: [275, 275], monsterPool: [MONSTERS.SAND_WRAITH], coords: {top: '50%', left: '20%'}, isBoss: true, icon: 'images/icons/tomb_of_the_guardian.png' },
                    // --- Sub-Zone: Endless Dunes (Levels 276-299) ---
                    "endless_dunes": { name: "Endless Dunes", levelRange: [276, 299], monsterPool: [MONSTERS.SAND_WRAITH, MONSTERS.GIANT_SCORPION, MONSTERS.SKELETAL_ARCHER], coords: {top: '20%', left: '30%'}, icon: 'images/icons/endless_dunes.png' },
                    // --- Sub-Zone: The Sand Pit (Boss Lvl 300) ---
                    "the_sand_pit": { name: "The Sand Pit", levelRange: [300, 300], monsterPool: [MONSTERS.GATEKEEPER_OF_THE_SANDS], coords: {top: '15%', left: '70%'}, isBoss: true, icon: 'images/icons/the_sand_pit.png' }
                }
            },
            "final_dungeon": {
                name: "Final Dungeon",
                mapImage: "images/backgrounds/sub_zone/map_dungeon_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_final_dungeon.png",
                coords: { top: '22%', left: '78%' },
                icon: 'images/icons/final_dungeon.png',
                subZones: {
                    // --- Sub-Zone: The Gatehouse (Levels 301-324) ---
                    "gatehouse": { name: "The Gatehouse", levelRange: [301, 324], monsterPool: [MONSTERS.GARGOYLE, MONSTERS.IMP], coords: {top: '80%', left: '20%'}, icon: 'images/icons/gatehouse.png' },
                    // --- Sub-Zone: Demon Sentry (Boss Lvl 325) ---
                    "demon_sentry": { name: "Demon Sentry", levelRange: [325, 325], monsterPool: [MONSTERS.DEMON_SENTRY_BOSS], coords: {top: '80%', left: '50%'}, isBoss: true, icon: 'images/icons/demon_sentry.png' },
                    // --- Sub-Zone: Halls of Damnation (Levels 326-349) ---
                    "halls_of_damnation": { name: "Halls of Damnation", levelRange: [326, 349], monsterPool: [MONSTERS.HELLHOUND, MONSTERS.CULTIST], coords: {top: '80%', left: '80%'}, icon: 'images/icons/halls_of_damnation.png' },
                    // --- Sub-Zone: The Hellforge (Boss Lvl 350) ---
                    "the_hellforge": { name: "The Hellforge", levelRange: [350, 350], monsterPool: [MONSTERS.HELLFORGE_GUARDIAN], coords: {top: '50%', left: '75%'}, isBoss: true, icon: 'images/icons/the_hellforge.png' },
                    // --- Sub-Zone: Brimstone Corridors (Levels 351-374) ---
                    "brimstone_corridors": { name: "Brimstone Corridors", levelRange: [351, 374], monsterPool: [MONSTERS.TOXIC_SULPHUR_GAS, MONSTERS.SUCCUBUS], coords: {top: '50%', left: '45%'}, icon: 'images/icons/brimstone_corridors.png' },
                    // --- Sub-Zone: Pit Lord's Arena (Boss Lvl 375) ---
                    "pit_lord_arena": { name: "Pit Lord's Arena", levelRange: [375, 375], monsterPool: [MONSTERS.PIT_FIEND], coords: {top: '50%', left: '15%'}, isBoss: true, icon: 'images/icons/pit_lord_arena.png' },
                    // --- Sub-Zone: Throne Approach (Levels 376-399) ---
                    "throne_approach": { name: "Throne Approach", levelRange: [376, 399], monsterPool: [MONSTERS.CHAOS_DEMON, MONSTERS.PIT_FIEND], coords: {top: '20%', left: '30%'}, icon: 'images/icons/throne_approach.png' },
                    // --- Sub-Zone: Archdemon's Lair (Boss Lvl 400) ---
                    "archdemon_lair": { name: "Archdemon's Lair", levelRange: [400, 400], monsterPool: [MONSTERS.ARCHDEMON_OVERLORD], coords: {top: '15%', left: '70%'}, isBoss: true, icon: 'images/icons/archdemon_lair.png' }
                }
            }
        }
    },
    {
        name: "The Underdark",
        mapImage: "images/underdark_world_map.png",
        requiredLevel: 401,
        zones: {
             "crystal_caves": {
                name: "Crystal Caverns",
                mapImage: "images/backgrounds/sub_zone/map_caves_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_caves.png",
                coords: { top: '70%', left: '25%' },
                icon: 'images/icons/crystal_caves.png',
                subZones: {
                    // --- Sub-Zone: Glimmering Path (Levels 401-424) ---
                    "glimmering_path": { name: "Glimmering Path", levelRange: [401, 424], monsterPool: [MONSTERS.CRYSTAL_SPIDER, MONSTERS.SHARD_SLIME], coords: {top: '80%', left: '20%'}, icon: 'images/icons/glimmering_path.png' },
                    // --- Sub-Zone: Crystal Golem (Boss Lvl 425) ---
                    "crystal_golem": { name: "Crystal Golem", levelRange: [425, 425], monsterPool: [MONSTERS.CRYSTAL_GOLEM], coords: {top: '80%', left: '50%'}, isBoss: true, icon: 'images/icons/crystal_golem.png' },
                    // --- Sub-Zone: Resonant Tunnels (Levels 426-449) ---
                    "resonant_tunnels": { name: "Resonant Tunnels", levelRange: [426, 449], monsterPool: [MONSTERS.DEEP_GNOME_MINER, MONSTERS.CAVE_LURKER], coords: {top: '80%', left: '80%'}, icon: 'images/icons/resonant_tunnels.png' },
                    // --- Sub-Zone: Crystal Guardian's Lair (Boss Lvl 450) ---
                    "crystal_guardian_lair": { name: "Crystal Guardian's Lair", levelRange: [450, 450], monsterPool: [MONSTERS.CRYSTALLINE_ELEMENTAL], coords: {top: '50%', left: '75%'}, isBoss: true, icon: 'images/icons/crystal_guardian_lair.png' },
                    // --- Sub-Zone: Deep Caverns (Levels 451-499) ---
                    "deep_caverns": { name: "Deep Caverns", levelRange: [451, 499], monsterPool: [MONSTERS.CAVE_LURKER, MONSTERS.DEEP_GNOME_MINER, MONSTERS.CRYSTAL_SPIDER], coords: {top: '50%', left: '45%'}, icon: 'images/icons/deep_caverns.png' },
                    // --- Sub-Zone: Crystal Heart (Boss Lvl 500) ---
                    "crystal_heart": { name: "Crystal Heart", levelRange: [500, 500], monsterPool: [MONSTERS.CRYSTAL_KING], coords: {top: '15%', left: '70%'}, isBoss: true, icon: 'images/icons/crystal_heart.png' }
                }
            },
            "fungal_forest": {
                name: "Fungal Forest",
                mapImage: "images/backgrounds/sub_zone/map_fungal_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_fungal.png",
                coords: { top: '40%', left: '50%' },
                icon: 'images/icons/fungal_forest.png',
                subZones: {
                    // --- Sub-Zone: Spore Meadows (Levels 501-524) ---
                    "spore_meadows": { name: "Spore Meadows", levelRange: [501, 524], monsterPool: [MONSTERS.MYCONID_SPOREKEEPER, MONSTERS.SPORE_BAT], coords: {top: '80%', left: '20%'}, icon: 'images/icons/spore_meadows.png' },
                    // --- Sub-Zone: Fungal Guardian (Boss Lvl 525) ---
                    "fungal_guardian": { name: "Fungal Guardian", levelRange: [525, 525], monsterPool: [MONSTERS.FUNGAL_BEHEMOTH], coords: {top: '80%', left: '50%'}, isBoss: true, icon: 'images/icons/fungal_guardian.png' },
                    // --- Sub-Zone: Mycelial Network (Levels 526-549) ---
                    "mycelial_network": { name: "Mycelial Network", levelRange: [526, 549], monsterPool: [MONSTERS.FUNGAL_CRAWLER, MONSTERS.SHRIEKER], coords: {top: '80%', left: '80%'}, icon: 'images/icons/mycelial_network.png' },
                    // --- Sub-Zone: Fungal Behemoth's Cave (Boss Lvl 550) ---
                    "fungal_behemoth_cave": { name: "Fungal Behemoth's Cave", levelRange: [550, 550], monsterPool: [MONSTERS.GAS_SPORE], coords: {top: '50%', left: '75%'}, isBoss: true, icon: 'images/icons/fungal_behemoth_cave.png' },
                    // --- Sub-Zone: Shrieking Hollows (Levels 551-599) ---
                    "shrieking_hollows": { name: "Shrieking Hollows", levelRange: [551, 599], monsterPool: [MONSTERS.SHRIEKER, MONSTERS.MYCONID_SPOREKEEPER, MONSTERS.FUNGAL_CRAWLER], coords: {top: '50%', left: '45%'}, icon: 'images/icons/shrieking_hollows.png' },
                    // --- Sub-Zone: The Great Fungus (Boss Lvl 600) ---
                    "the_great_fungus": { name: "The Great Fungus", levelRange: [600, 600], monsterPool: [MONSTERS.THE_GREAT_MYCELIUM], coords: {top: '15%', left: '70%'}, isBoss: true, icon: 'images/icons/the_great_fungus.png' }
                }
            },
            "drow_city": {
                name: "Drow City",
                mapImage: "images/backgrounds/sub_zone/map_drow_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_drow.png",
                coords: { top: '25%', left: '75%' },
                icon: 'images/icons/drow_city.png',
                subZones: {
                    // --- Sub-Zone: Outer Spires (Levels 601-624) ---
                    "outer_spires": { name: "Outer Spires", levelRange: [601, 624], monsterPool: [MONSTERS.DROW_WARRIOR, MONSTERS.GIANT_CAVE_SPIDER], coords: {top: '80%', left: '20%'}, icon: 'images/icons/outer_spires.png' },
                    // --- Sub-Zone: Drow Patrol (Boss Lvl 625) ---
                    "drow_patrol": { name: "Drow Patrol", levelRange: [625, 625], monsterPool: [MONSTERS.DRIDER], coords: {top: '80%', left: '50%'}, isBoss: true, icon: 'images/icons/drow_patrol.png' },
                    // --- Sub-Zone: Webbed Catacombs (Levels 626-649) ---
                    "webbed_catacombs": { name: "Webbed Catacombs", levelRange: [626, 649], monsterPool: [MONSTERS.DROW_MAGE, MONSTERS.SHADOW_STALKER], coords: {top: '80%', left: '80%'}, icon: 'images/icons/webbed_catacombs.png' },
                    // --- Sub-Zone: Drow Barracks (Boss Lvl 650) ---
                    "drow_barracks": { name: "Drow Barracks", levelRange: [650, 650], monsterPool: [MONSTERS.DROW_PRIESTESS], coords: {top: '50%', left: '75%'}, isBoss: true, icon: 'images/icons/drow_barracks.png' },
                    // --- Sub-Zone: Noble District (Levels 651-699) ---
                    "noble_district": { name: "Noble District", levelRange: [651, 699], monsterPool: [MONSTERS.DROW_WARRIOR, MONSTERS.DROW_MAGE, MONSTERS.SHADOW_STALKER], coords: {top: '50%', left: '45%'}, icon: 'images/icons/noble_district.png' },
                    // --- Sub-Zone: Spider Queen's Lair (Boss Lvl 700) ---
                    "spider_queen_lair": { name: "Spider Queen's Lair", levelRange: [700, 700], monsterPool: [MONSTERS.SPIDER_QUEEN_MATRON], coords: {top: '15%', left: '70%'}, isBoss: true, icon: 'images/icons/spider_queen_lair.png' }
                }
            },
            "abyssal_rift": {
                name: "Abyssal Rift",
                mapImage: "images/backgrounds/sub_zone/map_abyss_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_abyss.png",
                coords: { top: '15%', left: '85%' },
                icon: 'images/icons/abyssal_rift.png',
                subZones: {
                    "chasm_descent": { name: "Chasm Descent", levelRange: [701, 724], monsterPool: [MONSTERS.SHADOW_FIEND, MONSTERS.ABYSSAL_LEECH], coords: {top: '80%', left: '20%'}, icon: 'images/icons/chasm_descent.png' },
                    "demonic_gate": { name: "Demonic Gate", levelRange: [725, 725], monsterPool: [MONSTERS.DEMONIC_OVERSEER], coords: {top: '80%', left: '50%'}, isBoss: true, icon: 'images/icons/demonic_gate.png' },
                    "fields_of_madness": { name: "Fields of Madness", levelRange: [726, 749], monsterPool: [MONSTERS.VOID_WRAITH, MONSTERS.SHADOW_FIEND], coords: {top: '80%', left: '80%'}, icon: 'images/icons/fields_of_madness.png' },
                    "balors_roost": { name: "Balor's Roost", levelRange: [750, 750], monsterPool: [MONSTERS.BALOR], coords: {top: '50%', left: '75%'}, isBoss: true, icon: 'images/icons/balors_roost.png' },
                    "heart_of_chaos": { name: "Heart of Chaos", levelRange: [751, 799], monsterPool: [MONSTERS.VOID_WRAITH, MONSTERS.ABYSSAL_LEECH], coords: {top: '50%', left: '45%'}, icon: 'images/icons/heart_of_chaos.png' },
                    "the_final_abyss": { name: "The Final Abyss", levelRange: [800, 800], monsterPool: [MONSTERS.MAW_OF_THE_ABYSS], coords: {top: '15%', left: '70%'}, isBoss: true, icon: 'images/icons/the_final_abyss.png' }
                }
            }
        }
    },
    {
        name: "The Sunken World",
        mapImage: "images/sunken_world_map.png",
        requiredLevel: 801,
        zones: {
            "tide_wracked_coast": {
                name: "Tide-Wracked Coast",
                mapImage: "images/backgrounds/sub_zone/map_tide_wracked_coast_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_tide_wracked_coast.png",
                coords: { top: '78%', left: '20%' }, // Placeholder
                icon: 'images/icons/tide_wracked_coast.png', // Placeholder
                subZones: {
                    "shipwreck_graveyard": { name: "Shipwreck Graveyard", levelRange: [801, 824], monsterPool: [MONSTERS.GHOSTLY_PIRATE, MONSTERS.SIREN], coords: { top: '80%', left: '20%' }, icon: 'images/icons/shipwreck_graveyard.png' },
                    "harbor_of_the_damned": { name: "Harbor of the Damned", levelRange: [825, 825], monsterPool: [MONSTERS.TIDAL_ELEMENTAL], coords: { top: '80%', left: '50%' }, isBoss: true, icon: 'images/icons/harbor_of_the_damned.png' },
                    "coral_forest": { name: "Coral Forest", levelRange: [826, 849], monsterPool: [MONSTERS.GHOSTLY_PIRATE, MONSTERS.SIREN], coords: { top: '80%', left: '80%' }, icon: 'images/icons/coral_forest.png' },
                    "captains_folly": { name: "Captain's Folly", levelRange: [850, 850], monsterPool: [MONSTERS.TIDAL_ELEMENTAL], coords: { top: '50%', left: '75%' }, isBoss: true, icon: 'images/icons/captains_folly.png' },
                    "siren_cove": { name: "Siren's Cove", levelRange: [851, 899], monsterPool: [MONSTERS.GHOSTLY_PIRATE, MONSTERS.SIREN], coords: { top: '50%', left: '45%' }, icon: 'images/icons/siren_cove.png' },
                    "the_maelstrom": { name: "The Maelstrom", levelRange: [900, 900], monsterPool: [MONSTERS.TIDAL_ELEMENTAL], coords: { top: '15%', left: '70%' }, isBoss: true, icon: 'images/icons/the_maelstrom.png' }
                }
            },
            "sunken_city": {
                name: "Sunken City",
                mapImage: "images/backgrounds/sub_zone/map_sunken_city_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_sunken_city.png",
                coords: { top: '30%', left: '38%' }, // Placeholder
                icon: 'images/icons/sunken_city.png', // Placeholder
                subZones: {
                    "ruined_plaza": { name: "Ruined Plaza", levelRange: [901, 924], monsterPool: [MONSTERS.DEEP_SEA_SERPENT, MONSTERS.ANGLERFISH_HORROR], coords: { top: '80%', left: '20%' }, icon: 'images/icons/ruined_plaza.png' },
                    "the_triton_king": { name: "The Triton King", levelRange: [925, 925], monsterPool: [MONSTERS.THE_KRAKEN], coords: { top: '80%', left: '50%' }, isBoss: true, icon: 'images/icons/the_triton_king.png' },
                    "royal_gardens": { name: "Royal Gardens", levelRange: [926, 949], monsterPool: [MONSTERS.DEEP_SEA_SERPENT, MONSTERS.ANGLERFISH_HORROR], coords: { top: '80%', left: '80%' }, icon: 'images/icons/royal_gardens.png' },
                    "the_leviathan": { name: "The Leviathan", levelRange: [950, 950], monsterPool: [MONSTERS.THE_KRAKEN], coords: { top: '50%', left: '75%' }, isBoss: true, icon: 'images/icons/the_leviathan.png' },
                    "throne_room": { name: "Throne Room", levelRange: [951, 999], monsterPool: [MONSTERS.DEEP_SEA_SERPENT, MONSTERS.ANGLERFISH_HORROR], coords: { top: '50%', left: '45%' }, icon: 'images/icons/throne_room.png' },
                    "heart_of_atlantis": { name: "Heart of Atlantis", levelRange: [1000, 1000], monsterPool: [MONSTERS.THE_KRAKEN], coords: { top: '15%', left: '70%' }, isBoss: true, icon: 'images/icons/heart_of_atlantis.png' }
                }
            },
            "bioluminescent_trench": {
                name: "Bioluminescent Trench",
                mapImage: "images/backgrounds/sub_zone/map_bioluminescent_trench_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_bioluminescent_trench.png",
                coords: { top: '70%', left: '75%' }, // Placeholder
                icon: 'images/icons/bioluminescent_trench.png', // Placeholder
                subZones: {
                    "glowing_caves": { name: "Glowing Caves", levelRange: [1001, 1024], monsterPool: [MONSTERS.VOLCANIC_TUBE_WORM, MONSTERS.MAGMA_CRAB], coords: { top: '80%', left: '20%' }, icon: 'images/icons/glowing_caves.png' },
                    "ancient_crab": { name: "Ancient Crab", levelRange: [1025, 1025], monsterPool: [MONSTERS.ANCIENT_LEVIATHAN], coords: { top: '80%', left: '50%' }, isBoss: true, icon: 'images/icons/ancient_crab.png' },
                    "thermal_vents": { name: "Thermal Vents", levelRange: [1026, 1049], monsterPool: [MONSTERS.VOLCANIC_TUBE_WORM, MONSTERS.MAGMA_CRAB], coords: { top: '80%', left: '80%' }, icon: 'images/icons/thermal_vents.png' },
                    "the_great_worm": { name: "The Great Worm", levelRange: [1050, 1050], monsterPool: [MONSTERS.ANCIENT_LEVIATHAN], coords: { top: '50%', left: '75%' }, isBoss: true, icon: 'images/icons/the_great_worm.png' },
                    "deepest_dark": { name: "Deepest Dark", levelRange: [1051, 1099], monsterPool: [MONSTERS.VOLCANIC_TUBE_WORM, MONSTERS.MAGMA_CRAB], coords: { top: '50%', left: '45%' }, icon: 'images/icons/deepest_dark.png' },
                    "the_unseen_terror": { name: "The Unseen Terror", levelRange: [1100, 1100], monsterPool: [MONSTERS.ANCIENT_LEVIATHAN], coords: { top: '15%', left: '70%' }, isBoss: true, icon: 'images/icons/the_unseen_terror.png' }
                }
            },
            "void_maw": {
                name: "Void Maw",
                mapImage: "images/backgrounds/sub_zone/map_void_maw_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_void_maw.png",
                coords: { top: '22%', left: '78%' }, // Placeholder
                icon: 'images/icons/void_maw.png', // Placeholder
                subZones: {
                    "edge_of_sanity": { name: "Edge of Sanity", levelRange: [1101, 1124], monsterPool: [MONSTERS.FACELESS_ONE, MONSTERS.ELDRITCH_TENTACLE], coords: { top: '80%', left: '20%' }, icon: 'images/icons/edge_of_sanity.png' },
                    "first_seal": { name: "First Seal", levelRange: [1125, 1125], monsterPool: [MONSTERS.CTHULIAN_ASPECT], coords: { top: '80%', left: '50%' }, isBoss: true, icon: 'images/icons/first_seal.png' },
                    "whispering_chasm": { name: "Whispering Chasm", levelRange: [1126, 1149], monsterPool: [MONSTERS.FACELESS_ONE, MONSTERS.ELDRITCH_TENTACLE], coords: { top: '80%', left: '80%' }, icon: 'images/icons/whispering_chasm.png' },
                    "second_seal": { name: "Second Seal", levelRange: [1150, 1150], monsterPool: [MONSTERS.CTHULIAN_ASPECT], coords: { top: '50%', left: '75%' }, isBoss: true, icon: 'images/icons/second_seal.png' },
                    "the_unraveling": { name: "The Unraveling", levelRange: [1151, 1199], monsterPool: [MONSTERS.FACELESS_ONE, MONSTERS.ELDRITCH_TENTACLE], coords: { top: '50%', left: '45%' }, icon: 'images/icons/the_unraveling.png' },
                    "the_dreaming_god": { name: "The Dreaming God", levelRange: [1200, 1200], monsterPool: [MONSTERS.CTHULIAN_ASPECT], coords: { top: '15%', left: '70%' }, isBoss: true, icon: 'images/icons/the_dreaming_god.png' }
                }
            }
        }
    },
    {
        name: "The Celestial Planes",
        mapImage: "images/celestial_planes_map.png",
        requiredLevel: 1201,
        zones: {
            "azure_pathway": {
                name: "Azure Pathway",
                mapImage: "images/backgrounds/sub_zone/map_azure_pathway_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_azure_pathway.png",
                coords: { top: '78%', left: '20%' }, // Placeholder
                icon: 'images/icons/azure_pathway.png', // Placeholder
                subZones: {
                    "cloudy_steps": { name: "Cloudy Steps", levelRange: [1201, 1224], monsterPool: [MONSTERS.CLOUD_SERPENT, MONSTERS.SKY_WISP], coords: { top: '80%', left: '20%' }, icon: 'images/icons/cloudy_steps.png' },
                    "the_wind_lord": { name: "The Wind Lord", levelRange: [1225, 1225], monsterPool: [MONSTERS.GRYPHON_SENTINEL], coords: { top: '80%', left: '50%' }, isBoss: true, icon: 'images/icons/the_wind_lord.png' },
                    "sea_of_clouds": { name: "Sea of Clouds", levelRange: [1226, 1249], monsterPool: [MONSTERS.CLOUD_SERPENT, MONSTERS.SKY_WISP], coords: { top: '80%', left: '80%' }, icon: 'images/icons/sea_of_clouds.png' },
                    "the_storm_titan": { name: "The Storm Titan", levelRange: [1250, 1250], monsterPool: [MONSTERS.GRYPHON_SENTINEL], coords: { top: '50%', left: '75%' }, isBoss: true, icon: 'images/icons/the_storm_titan.png' },
                    "tempest_peak": { name: "Tempest Peak", levelRange: [1251, 1299], monsterPool: [MONSTERS.CLOUD_SERPENT, MONSTERS.SKY_WISP], coords: { top: '50%', left: '45%' }, icon: 'images/icons/tempest_peak.png' },
                    "the_sky_father": { name: "The Sky Father", levelRange: [1300, 1300], monsterPool: [MONSTERS.GRYPHON_SENTINEL], coords: { top: '15%', left: '70%' }, isBoss: true, icon: 'images/icons/the_sky_father.png' }
                }
            },
            "halls_of_valor": {
                name: "Halls of Valor",
                mapImage: "images/backgrounds/sub_zone/map_halls_of_valor_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_halls_of_valor.png",
                coords: { top: '30%', left: '38%' }, // Placeholder
                icon: 'images/icons/halls_of_valor.png', // Placeholder
                subZones: {
                    "gates_of_valhalla": { name: "Gates of Valhalla", levelRange: [1301, 1324], monsterPool: [MONSTERS.VALKYRIE, MONSTERS.EINHERJAR], coords: { top: '80%', left: '20%' }, icon: 'images/icons/gates_of_valhalla.png' },
                    "heimdall": { name: "Heimdall", levelRange: [1325, 1325], monsterPool: [MONSTERS.ODINS_RAVEN], coords: { top: '80%', left: '50%' }, isBoss: true, icon: 'images/icons/heimdall.png' },
                    "the_great_hall": { name: "The Great Hall", levelRange: [1326, 1349], monsterPool: [MONSTERS.VALKYRIE, MONSTERS.EINHERJAR], coords: { top: '80%', left: '80%' }, icon: 'images/icons/the_great_hall.png' },
                    "thor": { name: "Thor", levelRange: [1350, 1350], monsterPool: [MONSTERS.ODINS_RAVEN], coords: { top: '50%', left: '75%' }, isBoss: true, icon: 'images/icons/thor.png' },
                    "asgardian_armory": { name: "Asgardian Armory", levelRange: [1351, 1399], monsterPool: [MONSTERS.VALKYRIE, MONSTERS.EINHERJAR], coords: { top: '50%', left: '45%' }, icon: 'images/icons/asgardian_armory.png' },
                    "odin_the_allfather": { name: "Odin the Allfather", levelRange: [1400, 1400], monsterPool: [MONSTERS.ODINS_RAVEN], coords: { top: '15%', left: '70%' }, isBoss: true, icon: 'images/icons/odin_the_allfather.png' }
                }
            },
            "astral_sea": {
                name: "Astral Sea",
                mapImage: "images/backgrounds/sub_zone/map_astral_sea_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_astral_sea.png",
                coords: { top: '70%', left: '75%' }, // Placeholder
                icon: 'images/icons/astral_sea.png', // Placeholder
                subZones: {
                    "nebula_fields": { name: "Nebula Fields", levelRange: [1401, 1424], monsterPool: [MONSTERS.STARWHALE, MONSTERS.COMET_ELEMENTAL], coords: { top: '80%', left: '20%' }, icon: 'images/icons/nebula_fields.png' },
                    "the_hunter": { name: "The Hunter", levelRange: [1425, 1425], monsterPool: [MONSTERS.THE_LIVING_CONSTELLATION], coords: { top: '80%', left: '50%' }, isBoss: true, icon: 'images/icons/the_hunter.png' },
                    "stardust_river": { name: "Stardust River", levelRange: [1426, 1449], monsterPool: [MONSTERS.STARWHALE, MONSTERS.COMET_ELEMENTAL], coords: { top: '80%', left: '80%' }, icon: 'images/icons/stardust_river.png' },
                    "the_great_bear": { name: "The Great Bear", levelRange: [1450, 1450], monsterPool: [MONSTERS.THE_LIVING_CONSTELLATION], coords: { top: '50%', left: '75%' }, isBoss: true, icon: 'images/icons/the_great_bear.png' },
                    "galaxy_core": { name: "Galaxy Core", levelRange: [1451, 1499], monsterPool: [MONSTERS.STARWHALE, MONSTERS.COMET_ELEMENTAL], coords: { top: '50%', left: '45%' }, icon: 'images/icons/galaxy_core.png' },
                    "the_zodiac": { name: "The Zodiac", levelRange: [1500, 1500], monsterPool: [MONSTERS.THE_LIVING_CONSTELLATION], coords: { top: '15%', left: '70%' }, isBoss: true, icon: 'images/icons/the_zodiac.png' }
                }
            },
            "empyrean_throne": {
                name: "Empyrean Throne",
                mapImage: "images/backgrounds/sub_zone/map_empyrean_throne_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_empyrean_throne.png",
                coords: { top: '22%', left: '78%' }, // Placeholder
                icon: 'images/icons/empyrean_throne.png', // Placeholder
                subZones: {
                    "the_pearly_gates": { name: "The Pearly Gates", levelRange: [1501, 1524], monsterPool: [MONSTERS.SERAPH, MONSTERS.ARCHON], coords: { top: '80%', left: '20%' }, icon: 'images/icons/the_pearly_gates.png' },
                    "the_gatekeeper": { name: "The Gatekeeper", levelRange: [1525, 1525], monsterPool: [MONSTERS.CELESTIAL_JUDGE], coords: { top: '80%', left: '50%' }, isBoss: true, icon: 'images/icons/the_gatekeeper.png' },
                    "the_divine_court": { name: "The Divine Court", levelRange: [1526, 1549], monsterPool: [MONSTERS.SERAPH, MONSTERS.ARCHON], coords: { top: '80%', left: '80%' }, icon: 'images/icons/the_divine_court.png' },
                    "the_high_council": { name: "The High Council", levelRange: [1550, 1550], monsterPool: [MONSTERS.CELESTIAL_JUDGE], coords: { top: '50%', left: '75%' }, isBoss: true, icon: 'images/icons/the_high_council.png' },
                    "the_sanctum_sanctorum": { name: "The Sanctum Sanctorum", levelRange: [1551, 1599], monsterPool: [MONSTERS.SERAPH, MONSTERS.ARCHON], coords: { top: '50%', left: '45%' }, icon: 'images/icons/the_sanctum_sanctorum.png' },
                    "the_creator": { name: "The Creator", levelRange: [1600, 1600], monsterPool: [MONSTERS.CELESTIAL_JUDGE], coords: { top: '15%', left: '70%' }, isBoss: true, icon: 'images/icons/the_creator.png' }
                }
            }
        }
    },
    {
        name: "The Aetherium Forge",
        mapImage: "images/aetherium_forge_map.png",
        requiredLevel: 1601,
        zones: {
            "mana_wastes": {
                name: "Mana Wastes",
                mapImage: "images/backgrounds/sub_zone/map_mana_wastes_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_mana_wastes.png",
                coords: { top: '78%', left: '20%' }, // Placeholder
                icon: 'images/icons/mana_wastes.png', // Placeholder
                subZones: {
                    "the_weeping_wastes": { name: "The Weeping Wastes", levelRange: [1601, 1624], monsterPool: [MONSTERS.MANA_WRAITH, MONSTERS.CHAOS_SPAWN], coords: { top: '80%', left: '20%' }, icon: 'images/icons/the_weeping_wastes.png' },
                    "the_first_automaton": { name: "The First Automaton", levelRange: [1625, 1625], monsterPool: [MONSTERS.GUARDIAN_AUTOMATON], coords: { top: '80%', left: '50%' }, isBoss: true, icon: 'images/icons/the_first_automaton.png' },
                    "the_unraveled_lands": { name: "The Unraveled Lands", levelRange: [1626, 1649], monsterPool: [MONSTERS.MANA_WRAITH, MONSTERS.CHAOS_SPAWN], coords: { top: '80%', left: '80%' }, icon: 'images/icons/the_unraveled_lands.png' },
                    "the_mad_architect": { name: "The Mad Architect", levelRange: [1650, 1650], monsterPool: [MONSTERS.GUARDIAN_AUTOMATON], coords: { top: '50%', left: '75%' }, isBoss: true, icon: 'images/icons/the_mad_architect.png' },
                    "the_broken_shore": { name: "The Broken Shore", levelRange: [1651, 1699], monsterPool: [MONSTERS.MANA_WRAITH, MONSTERS.CHAOS_SPAWN], coords: { top: '50%', left: '45%' }, icon: 'images/icons/the_broken_shore.png' },
                    "the_entropy_engine": { name: "The Entropy Engine", levelRange: [1700, 1700], monsterPool: [MONSTERS.GUARDIAN_AUTOMATON], coords: { top: '15%', left: '70%' }, isBoss: true, icon: 'images/icons/the_entropy_engine.png' }
                }
            },
            "clockwork_city": {
                name: "Clockwork City",
                mapImage: "images/backgrounds/sub_zone/map_clockwork_city_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_clockwork_city.png",
                coords: { top: '30%', left: '38%' }, // Placeholder
                icon: 'images/icons/clockwork_city.png', // Placeholder
                subZones: {
                    "the_bronze_gate": { name: "The Bronze Gate", levelRange: [1701, 1724], monsterPool: [MONSTERS.LIVING_SPELLBOOK, MONSTERS.RUNE_GOLEM], coords: { top: '80%', left: '20%' }, icon: 'images/icons/the_bronze_gate.png' },
                    "the_timekeeper": { name: "The Timekeeper", levelRange: [1725, 1725], monsterPool: [MONSTERS.THE_LIBRARIAN], coords: { top: '80%', left: '50%' }, isBoss: true, icon: 'images/icons/the_timekeeper.png' },
                    "the_gear_district": { name: "The Gear District", levelRange: [1726, 1749], monsterPool: [MONSTERS.LIVING_SPELLBOOK, MONSTERS.RUNE_GOLEM], coords: { top: '80%', left: '80%' }, icon: 'images/icons/the_gear_district.png' },
                    "the_astronomer": { name: "The Astronomer", levelRange: [1750, 1750], monsterPool: [MONSTERS.THE_LIBRARIAN], coords: { top: '50%', left: '75%' }, isBoss: true, icon: 'images/icons/the_astronomer.png' },
                    "the_power_core": { name: "The Power Core", levelRange: [1751, 1799], monsterPool: [MONSTERS.LIVING_SPELLBOOK, MONSTERS.RUNE_GOLEM], coords: { top: '50%', left: '45%' }, icon: 'images/icons/the_power_core.png' },
                    "the_prime_mover": { name: "The Prime Mover", levelRange: [1800, 1800], monsterPool: [MONSTERS.THE_LIBRARIAN], coords: { top: '15%', left: '70%' }, isBoss: true, icon: 'images/icons/the_prime_mover.png' }
                }
            },
            "rune_scriptorium": {
                name: "Rune Scriptorium",
                mapImage: "images/backgrounds/sub_zone/map_rune_scriptorium_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_rune_scriptorium.png",
                coords: { top: '70%', left: '75%' }, // Placeholder
                icon: 'images/icons/rune_scriptorium.png', // Placeholder
                subZones: {
                    "the_silent_library": { name: "The Silent Library", levelRange: [1801, 1824], monsterPool: [MONSTERS.AETHER_ELEMENTAL, MONSTERS.NEXUS_STALKER], coords: { top: '80%', left: '20%' }, icon: 'images/icons/the_silent_library.png' },
                    "the_first_scribe": { name: "The First Scribe", levelRange: [1825, 1825], monsterPool: [MONSTERS.THE_FORGEMASTER], coords: { top: '80%', left: '50%' }, isBoss: true, icon: 'images/icons/the_first_scribe.png' },
                    "the_forbidden_wing": { name: "The Forbidden Wing", levelRange: [1826, 1849], monsterPool: [MONSTERS.AETHER_ELEMENTAL, MONSTERS.NEXUS_STALKER], coords: { top: '80%', left: '80%' }, icon: 'images/icons/the_forbidden_wing.png' },
                    "the_archivist": { name: "The Archivist", levelRange: [1850, 1850], monsterPool: [MONSTERS.THE_FORGEMASTER], coords: { top: '50%', left: '75%' }, isBoss: true, icon: 'images/icons/the_archivist.png' },
                    "the_endless_stacks": { name: "The Endless Stacks", levelRange: [1851, 1899], monsterPool: [MONSTERS.AETHER_ELEMENTAL, MONSTERS.NEXUS_STALKER], coords: { top: '50%', left: '45%' }, icon: 'images/icons/the_endless_stacks.png' },
                    "the_final_word": { name: "The Final Word", levelRange: [1900, 1900], monsterPool: [MONSTERS.THE_FORGEMASTER], coords: { top: '15%', left: '70%' }, isBoss: true, icon: 'images/icons/the_final_word.png' }
                }
            },
            "nexus_of_creation": {
                name: "Nexus of Creation",
                mapImage: "images/backgrounds/sub_zone/map_nexus_of_creation_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_nexus_of_creation.png",
                coords: { top: '22%', left: '78%' }, // Placeholder
                icon: 'images/icons/nexus_of_creation.png', // Placeholder
                subZones: {
                    "the_birthing_pools": { name: "The Birthing Pools", levelRange: [1901, 1924], monsterPool: [MONSTERS.PRIMORDIAL_BEING, MONSTERS.ECHO_OF_CREATION], coords: { top: '80%', left: '20%' }, icon: 'images/icons/the_birthing_pools.png' },
                    "the_first_thought": { name: "The First Thought", levelRange: [1925, 1925], monsterPool: [MONSTERS.THE_FIRST_SENTIENCE], coords: { top: '80%', left: '50%' }, isBoss: true, icon: 'images/icons/the_first_thought.png' },
                    "the_loom_of_fate": { name: "The Loom of Fate", levelRange: [1926, 1949], monsterPool: [MONSTERS.PRIMORDIAL_BEING, MONSTERS.ECHO_OF_CREATION], coords: { top: '80%', left: '80%' }, icon: 'images/icons/the_loom_of_fate.png' },
                    "the_first_feeling": { name: "The First Feeling", levelRange: [1950, 1950], monsterPool: [MONSTERS.THE_FIRST_SENTIENCE], coords: { top: '50%', left: '75%' }, isBoss: true, icon: 'images/icons/the_first_feeling.png' },
                    "the_final_nexus": { name: "The Final Nexus", levelRange: [1951, 1999], monsterPool: [MONSTERS.PRIMORDIAL_BEING, MONSTERS.ECHO_OF_CREATION], coords: { top: '50%', left: '45%' }, icon: 'images/icons/the_final_nexus.png' },
                    "the_first_will": { name: "The First Will", levelRange: [2000, 2000], monsterPool: [MONSTERS.THE_FIRST_SENTIENCE], coords: { top: '15%', left: '70%' }, isBoss: true, icon: 'images/icons/the_first_will.png' }
                }
            }
        }
    }
];