// --- START OF FILE data/realms.js ---

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
                coords: { top: '70%', left: '25%' },
                icon: 'images/icons/green_meadows.png',
                subZones: {
                    // --- Sub-Zone: Verdant Fields (Levels 1-24) ---
                    "verdant_fields": { name: "Verdant Fields", levelRange: [1, 24], monsterPool: [MONSTERS.SLIME, MONSTERS.GOBLIN, MONSTERS.WILD_BOAR], coords: {top: '85%', left: '10%'}, icon: 'images/icons/verdant_fields.png' },
                    // --- Sub-Zone: General's Outpost (Boss Lvl 25) ---
                    "general_outpost": { name: "General's Outpost", levelRange: [25, 25], monsterPool: [MONSTERS.SLIME_GENERAL], coords: {top: '60%', left: '25%'}, isBoss: true, icon: 'images/icons/general_outpost.png' },
                    // --- Sub-Zone: Whispering Woods (Levels 26-49) ---
                    "whispering_woods": { name: "Whispering Woods", levelRange: [26, 49], monsterPool: [MONSTERS.WOLF, MONSTERS.BAT, MONSTERS.GIANT_SPIDER], coords: {top: '83%', left: '50%'}, icon: 'images/icons/whispering_woods.png' },
                    // --- Sub-Zone: Guardian's Knoll (Boss Lvl 50) ---
                    "guardian_knoll": { name: "Guardian's Knoll", levelRange: [50, 50], monsterPool: [MONSTERS.DUNGEON_GUARDIAN], coords: {top: '44%', left: '50%'}, isBoss: true, icon: 'images/icons/guardian_knoll.png' },
                    // --- Sub-Zone: Sun-dappled Hills (Levels 51-74) ---
                    "sun_dappled_hills": { name: "Sun-dappled Hills", levelRange: [51, 74], monsterPool: [MONSTERS.TREANT_SPROUT, MONSTERS.HOBGOBLIN, MONSTERS.FOREST_SPRITE], coords: {top: '15%', left: '50%'}, icon: 'images/icons/sun_dappled_hills.png' },
                    // --- Sub-Zone: Royal Vanguard (Boss Lvl 75) ---
                    "royal_vanguard": { name: "Royal Vanguard", levelRange: [75, 75], monsterPool: [MONSTERS.ROYAL_GRIFFIN], coords: {top: '35%', left: '68%'}, isBoss: true, icon: 'images/icons/royal_vanguard.png' },
                    // --- Sub-Zone: Royal Hunting Grounds (Levels 76-99) ---
                    "royal_hunting_grounds": { name: "Royal Hunting Grounds", levelRange: [76, 99], monsterPool: [MONSTERS.GRIFFIN_CHICK, MONSTERS.HOBGOBLIN, MONSTERS.FOREST_SPRITE], coords: {top: '50%', left: '88%'}, icon: 'images/icons/royal_hunting_grounds.png' },
                    // --- Sub-Zone: King's Castle (Boss Lvl 100) ---
                    "kings_castle": { name: "King's Castle", levelRange: [100, 100], monsterPool: [MONSTERS.KING_OF_SLIMES], coords: {top: '20%', left: '82%'}, isBoss: true, icon: 'images/icons/kings_castle.png' }
                }
            },
            "orc_volcano": {
                name: "Orc Volcano",
                mapImage: "images/backgrounds/sub_zone/map_volcano_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_orc_volcano.png",
                coords: { top: '41%', left: '42%' },
                icon: 'images/icons/orc_volcano.png',
                subZones: {
                    // --- Sub-Zone: Ashfall Plains (Levels 101-124) ---
                    "ashfall_plains": { name: "Ashfall Plains", levelRange: [101, 124], monsterPool: [MONSTERS.ORC, MONSTERS.MAGMA_SLIME], coords: {top: '85%', left: '10%'}, icon: 'images/icons/ashfall_plains.png' },
                    // --- Sub-Zone: Orc Watchtower (Boss Lvl 125) ---
                    "orc_watchtower": { name: "Orc Watchtower", levelRange: [125, 125], monsterPool: [MONSTERS.GIANT_ORC], coords: {top: '80%', left: '44%'}, isBoss: true, icon: 'images/icons/orc_watchtower.png' },
                    // --- Sub-Zone: Scorched Path (Levels 126-149) ---
                    "scorched_path": { name: "Scorched Path", levelRange: [126, 149], monsterPool: [MONSTERS.ORC_SHAMAN, MONSTERS.LAVA_TURTLE], coords: {top: '80%', left: '80%'}, icon: 'images/icons/scorched_path.png' },
                    // --- Sub-Zone: Molten Heart (Boss Lvl 150) ---
                    "molten_heart": { name: "Molten Heart", levelRange: [150, 150], monsterPool: [MONSTERS.MOLTEN_GUARDIAN], coords: {top: '55%', left: '60%'}, isBoss: true, icon: 'images/icons/molten_heart.png' },
                    // --- Sub-Zone: Charred Forest (Levels 151-174) ---
                    "charred_forest": { name: "Charred Forest", levelRange: [151, 174], monsterPool: [MONSTERS.FIRE_ELEMENTAL, MONSTERS.SALAMANDER], coords: {top: '57%', left: '26%'}, icon: 'images/icons/charred_forest.png' },
                    // --- Sub-Zone: Chieftain's Camp (Boss Lvl 175) ---
                    "chieftains_camp": { name: "Chieftain's Camp", levelRange: [175, 175], monsterPool: [MONSTERS.OBSIDIAN_GOLEM], coords: {top: '25%', left: '18%'}, isBoss: true, icon: 'images/icons/chieftains_camp.png' },
                    // --- Sub-Zone: Volcano's Maw (Levels 176-199) ---
                    "volcanos_maw": { name: "Volcano's Maw", levelRange: [176, 199], monsterPool: [MONSTERS.ORC_BERSERKER, MONSTERS.FIRE_ELEMENTAL], coords: {top: '23%', left: '40%'}, icon: 'images/icons/volcanos_maw.png' },
                    // --- Sub-Zone: Volcano Peak (Boss Lvl 200) ---
                    "volcano_peak": { name: "Volcano Peak", levelRange: [200, 200], monsterPool: [MONSTERS.RULER_OF_ORCS], coords: {top: '18%', left: '66%'}, isBoss: true, icon: 'images/icons/volcano_peak.png' }
                }
            },
            "undead_desert": {
                name: "Undead Desert",
                mapImage: "images/backgrounds/sub_zone/map_desert_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_undead_desert.png",
                coords: { top: '68%', left: '73.5%' },
                icon: 'images/icons/undead_desert.png',
                subZones: {
                    // --- Sub-Zone: Lost Tombs (Levels 201-224) ---
                    "lost_tombs": { name: "Lost Tombs", levelRange: [201, 224], monsterPool: [MONSTERS.SKELETON, MONSTERS.VULTURE], coords: {top: '85%', left: '15%'}, icon: 'images/icons/lost_tombs.png' },
                    // --- Sub-Zone: Mummy's Crypt (Boss Lvl 225) ---
                    "mummy_crypt": { name: "Mummy's Crypt", levelRange: [225, 225], monsterPool: [MONSTERS.CURSED_MUMMY], coords: {top: '85%', left: '38%'}, isBoss: true, icon: 'images/icons/mummy_crypt.png' },
                    // --- Sub-Zone: Shifting Sands (Levels 226-249) ---
                    "shifting_sands": { name: "Shifting Sands", levelRange: [226, 249], monsterPool: [MONSTERS.ZOMBIE, MONSTERS.GHOUL], coords: {top: '85%', left: '75%'}, icon: 'images/icons/shifting_sands.png' },
                    // --- Sub-Zone: Cursed Pyramid (Boss Lvl 250) ---
                    "cursed_pyramid": { name: "Cursed Pyramid", levelRange: [250, 250], monsterPool: [MONSTERS.TOMB_ROBBER], coords: {top: '48%', left: '77%'}, isBoss: true, icon: 'images/icons/cursed_pyramid.png' },
                    // --- Sub-Zone: Scorpion Nest (Levels 251-274) ---
                    "scorpion_nest": { name: "Scorpion Nest", levelRange: [251, 274], monsterPool: [MONSTERS.GIANT_SCORPION, MONSTERS.SKELETAL_ARCHER], coords: {top: '40%', left: '50%'}, icon: 'images/icons/scorpion_nest.png' },
                    // --- Sub-Zone: Tomb of the Guardian (Boss Lvl 275) ---
                    "tomb_of_the_guardian": { name: "Tomb of the Guardian", levelRange: [275, 275], monsterPool: [MONSTERS.SAND_WRAITH], coords: {top: '50%', left: '20%'}, isBoss: true, icon: 'images/icons/tomb_of_the_guardian.png' },
                    // --- Sub-Zone: Endless Dunes (Levels 276-299) ---
                    "endless_dunes": { name: "Endless Dunes", levelRange: [276, 299], monsterPool: [MONSTERS.GIANT_SCORPION, MONSTERS.SKELETAL_ARCHER], coords: {top: '20%', left: '30%'}, icon: 'images/icons/endless_dunes.png' },
                    // --- Sub-Zone: The Sand Pit (Boss Lvl 300) ---
                    "the_sand_pit": { name: "The Sand Pit", levelRange: [300, 300], monsterPool: [MONSTERS.GATEKEEPER_OF_THE_SANDS], coords: {top: '15%', left: '70%'}, isBoss: true, icon: 'images/icons/the_sand_pit.png' }
                }
            },
            "final_dungeon": {
                name: "Final Dungeon",
                mapImage: "images/backgrounds/sub_zone/map_dungeon_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_final_dungeon.png",
                coords: { top: '34%', left: '72%' },
                icon: 'images/icons/final_dungeon.png',
                subZones: {
                    // --- Sub-Zone: The Gatehouse (Levels 301-324) ---
                    "gatehouse": { name: "The Gatehouse", levelRange: [301, 324], monsterPool: [MONSTERS.GARGOYLE, MONSTERS.IMP], coords: {top: '80%', left: '20%'}, icon: 'images/icons/gatehouse.png' },
                    // --- Sub-Zone: Demon Sentry (Boss Lvl 325) ---
                    "demon_sentry": { name: "Demon Sentry", levelRange: [325, 325], monsterPool: [MONSTERS.DEMON_SENTRY_BOSS], coords: {top: '52%', left: '40%'}, isBoss: true, icon: 'images/icons/demon_sentry.png' },
                    // --- Sub-Zone: Halls of Damnation (Levels 326-349) ---
                    "halls_of_damnation": { name: "Halls of Damnation", levelRange: [326, 349], monsterPool: [MONSTERS.HELLHOUND, MONSTERS.CULTIST], coords: {top: '58%', left: '55%'}, icon: 'images/icons/halls_of_damnation.png' },
                    // --- Sub-Zone: The Hellforge (Boss Lvl 350) ---
                    "the_hellforge": { name: "The Hellforge", levelRange: [350, 350], monsterPool: [MONSTERS.HELLFORGE_GUARDIAN], coords: {top: '50%', left: '75%'}, isBoss: true, icon: 'images/icons/the_hellforge.png' },
                    // --- Sub-Zone: Brimstone Corridors (Levels 351-374) ---
                    "brimstone_corridors": { name: "Brimstone Corridors", levelRange: [351, 374], monsterPool: [MONSTERS.TOXIC_SULPHUR_GAS, MONSTERS.SUCCUBUS], coords: {top: '30%', left: '75%'}, icon: 'images/icons/brimstone_corridors.png' },
                    // --- Sub-Zone: Pit Lord's Arena (Boss Lvl 375) ---
                    "pit_lord_arena": { name: "Pit Lord's Arena", levelRange: [375, 375], monsterPool: [MONSTERS.PIT_FIEND], coords: {top: '20%', left: '50%'}, isBoss: true, icon: 'images/icons/pit_lord_arena.png' },
                    // --- Sub-Zone: Throne Approach (Levels 376-399) ---
                    "throne_approach": { name: "Throne Approach", levelRange: [376, 399], monsterPool: [MONSTERS.CHAOS_DEMON, MONSTERS.SUCCUBUS], coords: {top: '40%', left: '25%'}, icon: 'images/icons/throne_approach.png' },
                    // --- Sub-Zone: Archdemon's Lair (Boss Lvl 400) ---
                    "archdemon_lair": { name: "Archdemon's Lair", levelRange: [400, 400], monsterPool: [MONSTERS.ARCHDEMON_OVERLORD], coords: {top: '85%', left: '45%'}, isBoss: true, icon: 'images/icons/archdemon_lair.png' }
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
                coords: { top: '30%', left: '25%' },
                icon: 'images/icons/crystal_caves.png',
                subZones: {
                    "glimmering_path": { name: "Glimmering Path", levelRange: [401, 424], monsterPool: [MONSTERS.CRYSTAL_SPIDER, MONSTERS.SHARD_SLIME, MONSTERS.CRYSTAL_SCUTTLER], coords: {top: '80%', left: '20%'}, icon: 'images/icons/glimmering_path.png' },
                    "crystal_golem": { name: "Crystal Golem", levelRange: [425, 425], monsterPool: [MONSTERS.CRYSTAL_GOLEM], coords: {top: '80%', left: '50%'}, isBoss: true, icon: 'images/icons/crystal_golem.png' },
                    "resonant_tunnels": { name: "Resonant Tunnels", levelRange: [426, 449], monsterPool: [MONSTERS.DEEP_GNOME_MINER, MONSTERS.CAVE_LURKER, MONSTERS.ECHO_WISP], coords: {top: '80%', left: '80%'}, icon: 'images/icons/resonant_tunnels.png' },
                    "crystal_guardian_lair": { name: "Crystal Guardian's Lair", levelRange: [450, 450], monsterPool: [MONSTERS.CRYSTALLINE_ELEMENTAL], coords: {top: '50%', left: '75%'}, isBoss: true, icon: 'images/icons/crystal_guardian_lair.png' },
                    "deep_caverns": { name: "Deep Caverns", levelRange: [451, 474], monsterPool: [MONSTERS.DEEP_GNOME_MINER, MONSTERS.ROCKWORM, MONSTERS.CAVERN_PROWLER], coords: {top: '50%', left: '45%'}, icon: 'images/icons/deep_caverns.png' },
                    "gemstone_hoard": { name: "Gemstone Hoard", levelRange: [475, 475], monsterPool: [MONSTERS.GEMSTONE_HYDRA], coords: { top: '50%', left: '15%' }, isBoss: true, icon: 'images/icons/gemstone_hoard.png' },
                    "crystalline_heart": { name: "Crystalline Heart", levelRange: [476, 499], monsterPool: [MONSTERS.ROCKWORM, MONSTERS.QUARTZ_BEAST, MONSTERS.LIVING_CRYSTAL], coords: { top: '20%', left: '30%' }, icon: 'images/icons/crystalline_heart.png' },
                    "crystal_king_throne": { name: "Crystal King's Throne", levelRange: [500, 500], monsterPool: [MONSTERS.CRYSTAL_KING], coords: {top: '15%', left: '70%'}, isBoss: true, icon: 'images/icons/crystal_king.png' }
                }
            },
            "fungal_forest": {
                name: "Fungal Forest",
                mapImage: "images/backgrounds/sub_zone/map_fungal_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_fungal.png",
                coords: { top: '70%', left: '20%' },
                icon: 'images/icons/fungal_forest.png',
                subZones: {
                    "spore_meadows": { name: "Spore Meadows", levelRange: [501, 524], monsterPool: [MONSTERS.MYCONID_SPOREKEEPER, MONSTERS.SPORE_BAT, MONSTERS.FUNGAL_HULK], coords: {top: '80%', left: '20%'}, icon: 'images/icons/spore_meadows.png' },
                    "fungal_guardian": { name: "Fungal Guardian", levelRange: [525, 525], monsterPool: [MONSTERS.FUNGAL_BEHEMOTH], coords: {top: '80%', left: '50%'}, isBoss: true, icon: 'images/icons/fungal_guardian.png' },
                    "mycelial_network": { name: "Mycelial Network", levelRange: [526, 549], monsterPool: [MONSTERS.FUNGAL_CRAWLER, MONSTERS.SHRIEKER, MONSTERS.MYCELIAL_WEBBER], coords: {top: '80%', left: '80%'}, icon: 'images/icons/mycelial_network.png' },
                    "gas_spore_grotto": { name: "Gas Spore Grotto", levelRange: [550, 550], monsterPool: [MONSTERS.GAS_SPORE], coords: {top: '50%', left: '75%'}, isBoss: true, icon: 'images/icons/fungal_behemoth_cave.png' },
                    "shrieking_hollows": { name: "Shrieking Hollows", levelRange: [551, 574], monsterPool: [MONSTERS.SHRIEKER, MONSTERS.MIND_FLAYER_SPORE, MONSTERS.CORRUPTED_DRYAD], coords: {top: '50%', left: '45%'}, icon: 'images/icons/shrieking_hollows.png' },
                    "mycelial_core": { name: "Mycelial Core", levelRange: [575, 575], monsterPool: [MONSTERS.FUNGAL_TITAN], coords: { top: '50%', left: '15%' }, isBoss: true, icon: 'images/icons/mycelial_core.png' },
                    "heart_of_the_forest": { name: "Heart of the Forest", levelRange: [576, 599], monsterPool: [MONSTERS.FUNGAL_HULK, MONSTERS.SPORE_WOLF, MONSTERS.MANDRAGORA], coords: { top: '20%', left: '30%' }, icon: 'images/icons/heart_of_the_forest.png' },
                    "the_great_fungus": { name: "The Great Fungus", levelRange: [600, 600], monsterPool: [MONSTERS.THE_GREAT_MYCELIUM], coords: {top: '15%', left: '70%'}, isBoss: true, icon: 'images/icons/the_great_fungus.png' }
                }
            },
            "drow_city": {
                name: "Drow City",
                mapImage: "images/backgrounds/sub_zone/map_drow_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_drow.png",
                coords: { top: '75%', left: '82%' },
                icon: 'images/icons/drow_city.png',
                subZones: {
                    "outer_spires": { name: "Outer Spires", levelRange: [601, 624], monsterPool: [MONSTERS.DROW_WARRIOR, MONSTERS.GIANT_CAVE_SPIDER, MONSTERS.DROW_SCOUT], coords: {top: '80%', left: '20%'}, icon: 'images/icons/outer_spires.png' },
                    "drow_patrol": { name: "Drow Patrol", levelRange: [625, 625], monsterPool: [MONSTERS.DRIDER], coords: {top: '80%', left: '50%'}, isBoss: true, icon: 'images/icons/drow_patrol.png' },
                    "webbed_catacombs": { name: "Webbed Catacombs", levelRange: [626, 649], monsterPool: [MONSTERS.DROW_MAGE, MONSTERS.SHADOW_STALKER, MONSTERS.PHASE_SPIDER], coords: {top: '80%', left: '80%'}, icon: 'images/icons/webbed_catacombs.png' },
                    "drow_barracks": { name: "Drow Barracks", levelRange: [650, 650], monsterPool: [MONSTERS.DROW_PRIESTESS], coords: {top: '50%', left: '75%'}, isBoss: true, icon: 'images/icons/drow_barracks.png' },
                    "noble_district": { name: "Noble District", levelRange: [651, 674], monsterPool: [MONSTERS.DROW_WARRIOR, MONSTERS.DROW_ELITE_GUARD, MONSTERS.DROW_SPELLWEAVER], coords: {top: '50%', left: '45%'}, icon: 'images/icons/noble_district.png' },
                    "house_of_shadows": { name: "House of Shadows", levelRange: [675, 675], monsterPool: [MONSTERS.YOCHLOL], coords: { top: '50%', left: '15%' }, isBoss: true, icon: 'images/icons/house_of_shadows.png' },
                    "matrons_court": { name: "Matron's Court", levelRange: [676, 699], monsterPool: [MONSTERS.DROW_ELITE_GUARD, MONSTERS.DROW_HIGH_PRIESTESS, MONSTERS.SPIDER_SWARM], coords: { top: '20%', left: '30%' }, icon: 'images/icons/matrons_court.png' },
                    "spider_queen_lair": { name: "Spider Queen's Lair", levelRange: [700, 700], monsterPool: [MONSTERS.SPIDER_QUEEN_MATRON], coords: {top: '15%', left: '70%'}, isBoss: true, icon: 'images/icons/spider_queen_lair.png' }
                }
            },
            "abyssal_rift": {
                name: "Abyssal Rift",
                mapImage: "images/backgrounds/sub_zone/map_abyss_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_abyss.png",
                coords: { top: '60%', left: '52%' },
                icon: 'images/icons/abyssal_rift.png',
                subZones: {
                    "chasm_descent": { name: "Chasm Descent", levelRange: [701, 724], monsterPool: [MONSTERS.SHADOW_FIEND, MONSTERS.ABYSSAL_LEECH, MONSTERS.WARPED_SOUL], coords: {top: '80%', left: '20%'}, icon: 'images/icons/chasm_descent.png' },
                    "demonic_gate": { name: "Demonic Gate", levelRange: [725, 725], monsterPool: [MONSTERS.DEMONIC_OVERSEER], coords: {top: '80%', left: '50%'}, isBoss: true, icon: 'images/icons/demonic_gate.png' },
                    "fields_of_madness": { name: "Fields of Madness", levelRange: [726, 749], monsterPool: [MONSTERS.VOID_WRAITH, MONSTERS.SOUL_EATER, MONSTERS.MIND_SHARD], coords: {top: '80%', left: '80%'}, icon: 'images/icons/fields_of_madness.png' },
                    "balors_roost": { name: "Balor's Roost", levelRange: [750, 750], monsterPool: [MONSTERS.BALOR], coords: {top: '50%', left: '75%'}, isBoss: true, icon: 'images/icons/balors_roost.png' },
                    "heart_of_chaos": { name: "Heart of Chaos", levelRange: [751, 774], monsterPool: [MONSTERS.ABYSSAL_LEECH, MONSTERS.CHAOS_HOUND, MONSTERS.FLESH_GOLEM], coords: {top: '50%', left: '45%'}, icon: 'images/icons/heart_of_chaos.png' },
                    "the_soul_well": { name: "The Soul Well", levelRange: [775, 775], monsterPool: [MONSTERS.ABYSSAL_TYRANT], coords: { top: '50%', left: '15%' }, isBoss: true, icon: 'images/icons/the_soul_well.png' },
                    "the_brink": { name: "The Brink", levelRange: [776, 799], monsterPool: [MONSTERS.SOUL_EATER, MONSTERS.RIFT_STALKER, MONSTERS.CHAOS_BEAST], coords: { top: '20%', left: '30%' }, icon: 'images/icons/the_brink.png' },
                    "the_final_abyss": { name: "The Final Abyss", levelRange: [800, 800], monsterPool: [MONSTERS.MAW_OF_THE_ABYSS], coords: {top: '15%', left: '70%'}, isBoss: true, icon: 'images/icons/the_final_abyss.png' }
                }
            }
        }
    }
];