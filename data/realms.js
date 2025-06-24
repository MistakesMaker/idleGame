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
                    "verdant_fields": { name: "Verdant Fields", levelRange: [1, 24], monsterPool: [MONSTERS.SLIME, MONSTERS.GOBLIN, MONSTERS.WILD_BOAR], coords: {top: '80%', left: '15%'} },
                    "general_outpost": { name: "General's Outpost", levelRange: [25, 25], monsterPool: [MONSTERS.SLIME_GENERAL], coords: {top: '60%', left: '25%'}, isBoss: true },
                    "whispering_woods": { name: "Whispering Woods", levelRange: [26, 49], monsterPool: [MONSTERS.WOLF, MONSTERS.BAT, MONSTERS.GOBLIN], coords: {top: '75%', left: '45%'} },
                    "guardian_knoll": { name: "Guardian's Knoll", levelRange: [50, 50], monsterPool: [MONSTERS.DUNGEON_GUARDIAN], coords: {top: '55%', left: '60%'}, isBoss: true },
                    "sun_dappled_hills": { name: "Sun-dappled Hills", levelRange: [51, 74], monsterPool: [MONSTERS.WOLF, MONSTERS.WILD_BOAR, MONSTERS.BAT], coords: {top: '35%', left: '40%'} },
                    "royal_vanguard": { name: "Royal Vanguard", levelRange: [75, 75], monsterPool: [MONSTERS.ROYAL_SLIME_VANGUARD], coords: {top: '20%', left: '60%'}, isBoss: true },
                    "royal_hunting_grounds": { name: "Royal Hunting Grounds", levelRange: [76, 99], monsterPool: [MONSTERS.WOLF, MONSTERS.GOBLIN, MONSTERS.SLIME], coords: {top: '30%', left: '85%'} },
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
                    "ashfall_plains": { name: "Ashfall Plains", levelRange: [101, 124], monsterPool: [MONSTERS.ORC, MONSTERS.MAGMA_SLIME], coords: {top: '80%', left: '20%'} },
                    "orc_watchtower": { name: "Orc Watchtower", levelRange: [125, 125], monsterPool: [MONSTERS.GIANT_ORC], coords: {top: '80%', left: '50%'}, isBoss: true },
                    "scorched_path": { name: "Scorched Path", levelRange: [126, 149], monsterPool: [MONSTERS.ORC, MONSTERS.ORC_SHAMAN], coords: {top: '80%', left: '80%'} },
                    "molten_heart": { name: "Molten Heart", levelRange: [150, 150], monsterPool: [MONSTERS.DUNGEON_GUARDIAN], coords: {top: '50%', left: '75%'}, isBoss: true },
                    "charred_forest": { name: "Charred Forest", levelRange: [151, 174], monsterPool: [MONSTERS.ORC_SHAMAN, MONSTERS.MAGMA_SLIME], coords: {top: '50%', left: '45%'} },
                    "chieftains_camp": { name: "Chieftain's Camp", levelRange: [175, 175], monsterPool: [MONSTERS.GIANT_ORC], coords: {top: '50%', left: '15%'}, isBoss: true },
                    "volcanos_maw": { name: "Volcano's Maw", levelRange: [176, 199], monsterPool: [MONSTERS.ORC, MONSTERS.ORC_SHAMAN], coords: {top: '20%', left: '30%'} },
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
                     "lost_tombs": { name: "Lost Tombs", levelRange: [201, 224], monsterPool: [MONSTERS.SKELETON, MONSTERS.GHOUL], coords: {top: '85%', left: '15%'} },
                     "mummy_crypt": { name: "Mummy's Crypt", levelRange: [225, 225], monsterPool: [MONSTERS.CURSED_MUMMY], coords: {top: '85%', left: '45%'}, isBoss: true },
                     "shifting_sands": { name: "Shifting Sands", levelRange: [226, 249], monsterPool: [MONSTERS.ZOMBIE, MONSTERS.GIANT_SCORPION], coords: {top: '85%', left: '75%'} },
                     "cursed_pyramid": { name: "Cursed Pyramid", levelRange: [250, 250], monsterPool: [MONSTERS.CURSED_MUMMY], coords: {top: '50%', left: '80%'}, isBoss: true },
                     "scorpion_nest": { name: "Scorpion Nest", levelRange: [251, 274], monsterPool: [MONSTERS.GIANT_SCORPION, MONSTERS.SKELETON], coords: {top: '50%', left: '50%'} },
                     "tomb_of_the_guardian": { name: "Tomb of the Guardian", levelRange: [275, 275], monsterPool: [MONSTERS.DUNGEON_GUARDIAN], coords: {top: '50%', left: '20%'}, isBoss: true },
                     "endless_dunes": { name: "Endless Dunes", levelRange: [276, 299], monsterPool: [MONSTERS.ZOMBIE, MONSTERS.GHOUL], coords: {top: '20%', left: '30%'} },
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
                    "gatehouse": { name: "The Gatehouse", levelRange: [301, 324], monsterPool: [MONSTERS.GARGOYLE, MONSTERS.IMP], coords: {top: '80%', left: '20%'} },
                    "demon_sentry": { name: "Demon Sentry", levelRange: [325, 325], monsterPool: [MONSTERS.DUNGEON_GUARDIAN], coords: {top: '80%', left: '50%'}, isBoss: true },
                    "halls_of_damnation": { name: "Halls of Damnation", levelRange: [326, 349], monsterPool: [MONSTERS.HELLHOUND, MONSTERS.CULTIST], coords: {top: '80%', left: '80%'} },
                    "the_hellforge": { name: "The Hellforge", levelRange: [350, 350], monsterPool: [MONSTERS.DUNGEON_GUARDIAN], coords: {top: '50%', left: '75%'}, isBoss: true },
                    "brimstone_corridors": { name: "Brimstone Corridors", levelRange: [351, 374], monsterPool: [MONSTERS.TOXIC_SULPHUR_GAS, MONSTERS.IMP], coords: {top: '50%', left: '45%'} },
                    "pit_lord_arena": { name: "Pit Lord's Arena", levelRange: [375, 375], monsterPool: [MONSTERS.GIANT_ORC], coords: {top: '50%', left: '15%'}, isBoss: true },
                    "throne_approach": { name: "Throne Approach", levelRange: [376, 399], monsterPool: [MONSTERS.HELLHOUND, MONSTERS.CULTIST, MONSTERS.GARGOYLE], coords: {top: '20%', left: '30%'} },
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
                    "glimmering_path": { name: "Glimmering Path", levelRange: [401, 424], monsterPool: [MONSTERS.BAT, MONSTERS.SKELETON], coords: {top: '80%', left: '20%'} },
                    "crystal_golem": { name: "Crystal Golem", levelRange: [425, 425], monsterPool: [MONSTERS.DUNGEON_GUARDIAN], coords: {top: '80%', left: '50%'}, isBoss: true },
                    "resonant_tunnels": { name: "Resonant Tunnels", levelRange: [426, 449], monsterPool: [MONSTERS.GOBLIN, MONSTERS.GHOUL], coords: {top: '80%', left: '80%'} },
                    "crystal_guardian_lair": { name: "Crystal Guardian's Lair", levelRange: [450, 450], monsterPool: [MONSTERS.DUNGEON_GUARDIAN], coords: {top: '50%', left: '75%'}, isBoss: true },
                    "deep_caverns": { name: "Deep Caverns", levelRange: [451, 474], monsterPool: [MONSTERS.BAT, MONSTERS.GHOUL], coords: {top: '50%', left: '45%'} },
                    "ancient_horror": { name: "Ancient Horror", levelRange: [475, 475], monsterPool: [MONSTERS.GATEKEEPER_OF_THE_SANDS], coords: {top: '50%', left: '15%'}, isBoss: true },
                    "geode_chamber": { name: "Geode Chamber", levelRange: [476, 499], monsterPool: [MONSTERS.SKELETON, MONSTERS.GOBLIN], coords: {top: '20%', left: '30%'} },
                    "crystal_heart": { name: "Crystal Heart", levelRange: [500, 500], monsterPool: [MONSTERS.RULER_OF_ORCS], coords: {top: '15%', left: '70%'}, isBoss: true }
                }
            },
            "fungal_forest": {
                name: "Fungal Forest",
                mapImage: "images/map_fungal_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_fungal.png",
                coords: { top: '40%', left: '50%' },
                icon: 'images/icons/necklace.png',
                subZones: {
                    "spore_meadows": { name: "Spore Meadows", levelRange: [501, 524], monsterPool: [MONSTERS.SLIME, MONSTERS.BAT, MONSTERS.WILD_BOAR], coords: {top: '80%', left: '20%'} },
                    "fungal_guardian": { name: "Fungal Guardian", levelRange: [525, 525], monsterPool: [MONSTERS.GIANT_ORC], coords: {top: '80%', left: '50%'}, isBoss: true },
                    "mycelial_network": { name: "Mycelial Network", levelRange: [526, 549], monsterPool: [MONSTERS.ZOMBIE, MONSTERS.MAGMA_SLIME], coords: {top: '80%', left: '80%'} },
                    "fungal_behemoth_cave": { name: "Fungal Behemoth's Cave", levelRange: [550, 550], monsterPool: [MONSTERS.GIANT_ORC], coords: {top: '50%', left: '75%'}, isBoss: true },
                    "shrieking_hollows": { name: "Shrieking Hollows", levelRange: [551, 574], monsterPool: [MONSTERS.BAT, MONSTERS.WOLF], coords: {top: '50%', left: '45%'} },
                    "spore_lord": { name: "Spore Lord", levelRange: [575, 575], monsterPool: [MONSTERS.RULER_OF_ORCS], coords: {top: '50%', left: '15%'}, isBoss: true },
                    "great_fungus_approach": { name: "Great Fungus Approach", levelRange: [576, 599], monsterPool: [MONSTERS.SLIME, MONSTERS.ZOMBIE], coords: {top: '20%', left: '30%'} },
                    "the_great_fungus": { name: "The Great Fungus", levelRange: [600, 600], monsterPool: [MONSTERS.DUNGEON_GUARDIAN], coords: {top: '15%', left: '70%'}, isBoss: true }
                }
            },
            "drow_city": {
                name: "Drow City",
                mapImage: "images/map_drow_zoomed.png",
                monsterAreaBg: "images/backgrounds/bg_drow.png",
                coords: { top: '25%', left: '75%' },
                icon: 'images/icons/belt.png',
                subZones: {
                    "outer_spires": { name: "Outer Spires", levelRange: [601, 624], monsterPool: [MONSTERS.SKELETON, MONSTERS.CULTIST], coords: {top: '80%', left: '20%'} },
                    "drow_patrol": { name: "Drow Patrol", levelRange: [625, 625], monsterPool: [MONSTERS.GATEKEEPER_OF_THE_SANDS], coords: {top: '80%', left: '50%'}, isBoss: true },
                    "webbed_catacombs": { name: "Webbed Catacombs", levelRange: [626, 649], monsterPool: [MONSTERS.GIANT_SCORPION, MONSTERS.GHOUL], coords: {top: '80%', left: '80%'} },
                    "drow_barracks": { name: "Drow Barracks", levelRange: [650, 650], monsterPool: [MONSTERS.GIANT_ORC], coords: {top: '50%', left: '75%'}, isBoss: true },
                    "noble_district": { name: "Noble District", levelRange: [651, 674], monsterPool: [MONSTERS.CULTIST, MONSTERS.SKELETON], coords: {top: '50%', left: '45%'} },
                    "house_captain": { name: "House Captain", levelRange: [675, 675], monsterPool: [MONSTERS.DUNGEON_GUARDIAN], coords: {top: '50%', left: '15%'}, isBoss: true },
                    "temple_of_lolth": { name: "Temple of Lolth", levelRange: [676, 699], monsterPool: [MONSTERS.CULTIST, MONSTERS.HELLHOUND], coords: {top: '20%', left: '30%'} },
                    "spider_queen_lair": { name: "Spider Queen's Lair", levelRange: [700, 700], monsterPool: [MONSTERS.ARCHDEMON_OVERLORD], coords: {top: '15%', left: '70%'}, isBoss: true }
                }
            }
        }
    }
];