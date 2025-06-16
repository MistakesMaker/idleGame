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
                coords: { top: '85%', left: '20%' },
                icon: 'images/icons/green_meadows.png',
                labelPosition: 'top',
                subZones: {
                    // A gentle S-curve wave from bottom-left to top-right
                    "verdant_fields":        { name: "Verdant Fields",        levelRange: [1, 24],   monsterPool: [MONSTERS.SLIME, MONSTERS.GOBLIN, MONSTERS.WILD_BOAR], coords: { top: '85%', left: '20%'}, labelPosition: 'top' },
                    "general_outpost":       { name: "General's Outpost",     levelRange: [25, 25],   monsterPool: [MONSTERS.SLIME_GENERAL], isBoss: true,             coords: { top: '70%', left: '40%'}, labelPosition: 'bottom' },
                    "whispering_woods":      { name: "Whispering Woods",      levelRange: [26, 49],   monsterPool: [MONSTERS.WOLF, MONSTERS.BAT, MONSTERS.GOBLIN],    coords: { top: '50%', left: '25%'}, labelPosition: 'top' },
                    "guardian_knoll":        { name: "Guardian's Knoll",      levelRange: [50, 50],   monsterPool: [MONSTERS.DUNGEON_GUARDIAN], isBoss: true,          coords: { top: '35%', left: '50%'}, labelPosition: 'bottom' },
                    "sun_dappled_hills":     { name: "Sun-dappled Hills",     levelRange: [51, 74],   monsterPool: [MONSTERS.WOLF, MONSTERS.WILD_BOAR, MONSTERS.BAT],  coords: { top: '55%', left: '70%'}, labelPosition: 'top' },
                    "royal_vanguard":        { name: "Royal Vanguard",        levelRange: [75, 75],   monsterPool: [MONSTERS.SLIME_GENERAL], isBoss: true,            coords: { top: '40%', left: '88%'}, labelPosition: 'bottom' },
                    "royal_hunting_grounds": { name: "Royal Hunting Grounds", levelRange: [76, 99],   monsterPool: [MONSTERS.WOLF, MONSTERS.GOBLIN, MONSTERS.SLIME],   coords: { top: '20%', left: '70%'}, labelPosition: 'top' },
                    "kings_castle":          { name: "King's Castle",         levelRange: [100, 100], monsterPool: [MONSTERS.KING_OF_SLIMES], isBoss: true,             coords: { top: '15%', left: '45%'}, labelPosition: 'bottom' }
                }
            },
            "orc_volcano": {
                name: "Orc Volcano",
                mapImage: "images/map_volcano_zoomed.png",
                coords: { top: '50%', left: '45%' },
                icon: 'images/icons/orc_volcano.png',
                labelPosition: 'bottom',
                subZones: {
                    // A path that spirals up and around the central volcano
                    "ashfall_plains": { name: "Ashfall Plains", levelRange: [101, 124], monsterPool: [MONSTERS.ORC, MONSTERS.MAGMA_SLIME], coords: {top: '88%', left: '25%'}, labelPosition: 'top' },
                    "orc_watchtower": { name: "Orc Watchtower", levelRange: [125, 125], monsterPool: [MONSTERS.GIANT_ORC], isBoss: true, coords: {top: '70%', left: '35%'}, labelPosition: 'bottom' },
                    "scorched_path": { name: "Scorched Path", levelRange: [126, 149], monsterPool: [MONSTERS.ORC, MONSTERS.ORC_SHAMAN], coords: {top: '65%', left: '60%'}, labelPosition: 'top' },
                    "molten_heart": { name: "Molten Heart", levelRange: [150, 150], monsterPool: [MONSTERS.DUNGEON_GUARDIAN], isBoss: true, coords: {top: '45%', left: '50%'}, labelPosition: 'bottom' },
                    "charred_forest": { name: "Charred Forest", levelRange: [151, 174], monsterPool: [MONSTERS.ORC_SHAMAN, MONSTERS.MAGMA_SLIME], coords: {top: '30%', left: '30%'}, labelPosition: 'top' },
                    "chieftains_camp": { name: "Chieftain's Camp", levelRange: [175, 175], monsterPool: [MONSTERS.GIANT_ORC], isBoss: true, coords: {top: '35%', left: '75%'}, labelPosition: 'bottom' },
                    "volcanos_maw": { name: "Volcano's Maw", levelRange: [176, 199], monsterPool: [MONSTERS.ORC, MONSTERS.ORC_SHAMAN], coords: {top: '55%', left: '85%'}, labelPosition: 'top' },
                    "volcano_peak": { name: "Volcano Peak", levelRange: [200, 200], monsterPool: [MONSTERS.RULER_OF_ORCS], isBoss: true, coords: {top: '15%', left: '60%'}, labelPosition: 'bottom' }
                }
            },
            "undead_desert": {
                name: "Undead Desert",
                mapImage: "images/map_desert_zoomed.png",
                coords: { top: '65%', left: '78%' },
                icon: 'images/icons/undead_desert.png',
                labelPosition: 'bottom',
                subZones: {
                     // A wide, sweeping wave across the dunes
                     "lost_tombs": { name: "Lost Tombs", levelRange: [201, 224], monsterPool: [MONSTERS.SKELETON, MONSTERS.GHOUL], coords: {top: '85%', left: '20%'}, labelPosition: 'top' },
                     "mummy_crypt": { name: "Mummy's Crypt", levelRange: [225, 225], monsterPool: [MONSTERS.CURSED_MUMMY], isBoss: true, coords: {top: '65%', left: '35%'}, labelPosition: 'bottom' },
                     "shifting_sands": { name: "Shifting Sands", levelRange: [226, 249], monsterPool: [MONSTERS.ZOMBIE, MONSTERS.GIANT_SCORPION], coords: {top: '80%', left: '55%'}, labelPosition: 'top' },
                     "cursed_pyramid": { name: "Cursed Pyramid", levelRange: [250, 250], monsterPool: [MONSTERS.CURSED_MUMMY], isBoss: true, coords: {top: '60%', left: '75%'}, labelPosition: 'bottom' },
                     "scorpion_nest": { name: "Scorpion Nest", levelRange: [251, 274], monsterPool: [MONSTERS.GIANT_SCORPION, MONSTERS.SKELETON], coords: {top: '40%', left: '60%'}, labelPosition: 'top' },
                     "tomb_of_the_guardian": { name: "Tomb of the Guardian", levelRange: [275, 275], monsterPool: [MONSTERS.DUNGEON_GUARDIAN], isBoss: true, coords: {top: '55%', left: '40%'}, labelPosition: 'bottom' },
                     "endless_dunes": { name: "Endless Dunes", levelRange: [276, 299], monsterPool: [MONSTERS.ZOMBIE, MONSTERS.GHOUL], coords: {top: '25%', left: '25%'}, labelPosition: 'top' },
                     "the_sand_pit": { name: "The Sand Pit", levelRange: [300, 300], monsterPool: [MONSTERS.GATEKEEPER_OF_THE_SANDS], isBoss: true, coords: {top: '20%', left: '80%'}, labelPosition: 'bottom' }
                }
            },
            "final_dungeon": {
                name: "Final Dungeon",
                mapImage: "images/map_dungeon_zoomed.png",
                coords: { top: '25%', left: '70%' },
                icon: 'images/icons/final_dungeon.png',
                labelPosition: 'top',
                subZones: {
                    // A tight, serpentine path through the dungeon
                    "gatehouse": { name: "The Gatehouse", levelRange: [301, 324], monsterPool: [MONSTERS.GARGOYLE, MONSTERS.IMP], coords: {top: '85%', left: '15%'}, labelPosition: 'top' },
                    "demon_sentry": { name: "Demon Sentry", levelRange: [325, 325], monsterPool: [MONSTERS.DUNGEON_GUARDIAN], isBoss: true, coords: {top: '65%', left: '25%'}, labelPosition: 'bottom' },
                    "halls_of_damnation": { name: "Halls of Damnation", levelRange: [326, 349], monsterPool: [MONSTERS.HELLHOUND, MONSTERS.CULTIST], coords: {top: '70%', left: '50%'}, labelPosition: 'top' },
                    "the_hellforge": { name: "The Hellforge", levelRange: [350, 350], monsterPool: [MONSTERS.DUNGEON_GUARDIAN], isBoss: true, coords: {top: '50%', left: '40%'}, labelPosition: 'bottom' },
                    "brimstone_corridors": { name: "Brimstone Corridors", levelRange: [351, 374], monsterPool: [MONSTERS.TOXIC_SULPHUR_GAS, MONSTERS.IMP], coords: {top: '55%', left: '70%'}, labelPosition: 'top' },
                    "pit_lord_arena": { name: "Pit Lord's Arena", levelRange: [375, 375], monsterPool: [MONSTERS.GIANT_ORC], isBoss: true, coords: {top: '30%', left: '55%'}, labelPosition: 'bottom' },
                    "throne_approach": { name: "Throne Approach", levelRange: [376, 399], monsterPool: [MONSTERS.HELLHOUND, MONSTERS.CULTIST, MONSTERS.GARGOYLE], coords: {top: '15%', left: '30%'}, labelPosition: 'top' },
                    "archdemon_lair": { name: "Archdemon's Lair", levelRange: [400, 400], monsterPool: [MONSTERS.ARCHDEMON_OVERLORD], isBoss: true, coords: {top: '20%', left: '80%'}, labelPosition: 'bottom' }
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
                coords: { top: '80%', left: '25%' },
                icon: 'images/icons/ring.png',
                labelPosition: 'top',
                subZones: {
                    // Re-using the tight serpentine path for a cave-like feel
                    "glimmering_path": { name: "Glimmering Path", levelRange: [401, 424], monsterPool: [MONSTERS.BAT, MONSTERS.SKELETON], coords: {top: '85%', left: '15%'}, labelPosition: 'top' },
                    "crystal_golem": { name: "Crystal Golem", levelRange: [425, 425], monsterPool: [MONSTERS.DUNGEON_GUARDIAN], isBoss: true, coords: {top: '65%', left: '25%'}, labelPosition: 'bottom' },
                    "resonant_tunnels": { name: "Resonant Tunnels", levelRange: [426, 449], monsterPool: [MONSTERS.GOBLIN, MONSTERS.GHOUL], coords: {top: '70%', left: '50%'}, labelPosition: 'top' },
                    "crystal_guardian_lair": { name: "Crystal Guardian's Lair", levelRange: [450, 450], monsterPool: [MONSTERS.DUNGEON_GUARDIAN], isBoss: true, coords: {top: '50%', left: '40%'}, labelPosition: 'bottom' },
                    "deep_caverns": { name: "Deep Caverns", levelRange: [451, 474], monsterPool: [MONSTERS.BAT, MONSTERS.GHOUL], coords: {top: '55%', left: '70%'}, labelPosition: 'top' },
                    "ancient_horror": { name: "Ancient Horror", levelRange: [475, 475], monsterPool: [MONSTERS.GATEKEEPER_OF_THE_SANDS], isBoss: true, coords: {top: '30%', left: '55%'}, labelPosition: 'bottom' },
                    "geode_chamber": { name: "Geode Chamber", levelRange: [476, 499], monsterPool: [MONSTERS.SKELETON, MONSTERS.GOBLIN], coords: {top: '15%', left: '30%'}, labelPosition: 'top' },
                    "crystal_heart": { name: "Crystal Heart", levelRange: [500, 500], monsterPool: [MONSTERS.RULER_OF_ORCS], isBoss: true, coords: {top: '20%', left: '80%'}, labelPosition: 'bottom' }
                }
            },
            "fungal_forest": {
                name: "Fungal Forest",
                mapImage: "images/map_fungal_zoomed.png",
                coords: { top: '50%', left: '50%' },
                icon: 'images/icons/necklace.png',
                labelPosition: 'top',
                subZones: {
                    // Re-using the S-curve for a classic forest path
                    "spore_meadows": { name: "Spore Meadows", levelRange: [501, 524], monsterPool: [MONSTERS.SLIME, MONSTERS.BAT, MONSTERS.WILD_BOAR], coords: {top: '85%', left: '20%'}, labelPosition: 'top' },
                    "fungal_guardian": { name: "Fungal Guardian", levelRange: [525, 525], monsterPool: [MONSTERS.GIANT_ORC], isBoss: true, coords: {top: '70%', left: '40%'}, labelPosition: 'bottom' },
                    "mycelial_network": { name: "Mycelial Network", levelRange: [526, 549], monsterPool: [MONSTERS.ZOMBIE, MONSTERS.MAGMA_SLIME], coords: {top: '50%', left: '25%'}, labelPosition: 'top' },
                    "fungal_behemoth_cave": { name: "Fungal Behemoth's Cave", levelRange: [550, 550], monsterPool: [MONSTERS.GIANT_ORC], isBoss: true, coords: {top: '35%', left: '50%'}, labelPosition: 'bottom' },
                    "shrieking_hollows": { name: "Shrieking Hollows", levelRange: [551, 574], monsterPool: [MONSTERS.BAT, MONSTERS.WOLF], coords: {top: '55%', left: '70%'}, labelPosition: 'top' },
                    "spore_lord": { name: "Spore Lord", levelRange: [575, 575], monsterPool: [MONSTERS.RULER_OF_ORCS], isBoss: true, coords: {top: '40%', left: '88%'}, labelPosition: 'bottom' },
                    "great_fungus_approach": { name: "Great Fungus Approach", levelRange: [576, 599], monsterPool: [MONSTERS.SLIME, MONSTERS.ZOMBIE], coords: {top: '20%', left: '70%'}, labelPosition: 'top' },
                    "the_great_fungus": { name: "The Great Fungus", levelRange: [600, 600], monsterPool: [MONSTERS.DUNGEON_GUARDIAN], isBoss: true, coords: {top: '15%', left: '45%'}, labelPosition: 'bottom' }
                }
            },
            "drow_city": {
                name: "Drow City",
                mapImage: "images/map_drow_zoomed.png",
                coords: { top: '20%', left: '75%' },
                icon: 'images/icons/belt.png',
                labelPosition: 'bottom',
                subZones: {
                    // Re-using the wide wave for a sprawling city
                    "outer_spires": { name: "Outer Spires", levelRange: [601, 624], monsterPool: [MONSTERS.SKELETON, MONSTERS.CULTIST], coords: {top: '85%', left: '20%'}, labelPosition: 'top' },
                    "drow_patrol": { name: "Drow Patrol", levelRange: [625, 625], monsterPool: [MONSTERS.GATEKEEPER_OF_THE_SANDS], isBoss: true, coords: {top: '65%', left: '35%'}, labelPosition: 'bottom' },
                    "webbed_catacombs": { name: "Webbed Catacombs", levelRange: [626, 649], monsterPool: [MONSTERS.GIANT_SCORPION, MONSTERS.GHOUL], coords: {top: '80%', left: '55%'}, labelPosition: 'top' },
                    "drow_barracks": { name: "Drow Barracks", levelRange: [650, 650], monsterPool: [MONSTERS.GIANT_ORC], isBoss: true, coords: {top: '60%', left: '75%'}, labelPosition: 'bottom' },
                    "noble_district": { name: "Noble District", levelRange: [651, 674], monsterPool: [MONSTERS.CULTIST, MONSTERS.SKELETON], coords: {top: '40%', left: '60%'}, labelPosition: 'top' },
                    "house_captain": { name: "House Captain", levelRange: [675, 675], monsterPool: [MONSTERS.DUNGEON_GUARDIAN], isBoss: true, coords: {top: '55%', left: '40%'}, labelPosition: 'bottom' },
                    "temple_of_lolth": { name: "Temple of Lolth", levelRange: [676, 699], monsterPool: [MONSTERS.CULTIST, MONSTERS.HELLHOUND], coords: {top: '25%', left: '25%'}, labelPosition: 'top' },
                    "spider_queen_lair": { name: "Spider Queen's Lair", levelRange: [700, 700], monsterPool: [MONSTERS.ARCHDEMON_OVERLORD], isBoss: true, coords: {top: '20%', left: '80%'}, labelPosition: 'bottom' }
                }
            }
        }
    }
];