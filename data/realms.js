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
                coords: { top: '78%', left: '20%' },
                icon: 'images/icons/green_meadows.png', // Just the path string
                subZones: {
                    "starting_fields": { name: "Starting Fields", levelRange: [1, 19], monsterPool: [MONSTERS.SLIME, MONSTERS.GOBLIN, MONSTERS.BAT], coords: {top: '60%', left: '30%'} },
                    "meadows_boss_area": { name: "Guardian's Post", levelRange: [20, 20], monsterPool: [MONSTERS.DUNGEON_GUARDIAN], coords: {top: '75%', left: '70%'}, isBoss: true }
                }
            },
            "orc_volcano": {
                name: "Orc Volcano",
                mapImage: "images/map_volcano_zoomed.png",
                coords: { top: '30%', left: '38%' },
                icon: 'images/icons/orc_volcano.png', // Just the path string
                subZones: {
                    "ashfall_plains": { name: "Ashfall Plains", levelRange: [21, 39], monsterPool: [MONSTERS.ORC], coords: {top: '70%', left: '30%'} },
                    "volcano_peak": { name: "Volcano Peak", levelRange: [40, 40], monsterPool: [MONSTERS.DUNGEON_GUARDIAN], coords: {top: '20%', left: '50%'}, isBoss: true }
                }
            },
            "undead_desert": {
                name: "Undead Desert",
                mapImage: "images/map_desert_zoomed.png",
                coords: { top: '70%', left: '75%' },
                icon: 'images/icons/undead_desert.png', // Just the path string
                subZones: {
                     "lost_tombs": { name: "Lost Tombs", levelRange: [41, 59], monsterPool: [MONSTERS.SKELETON, MONSTERS.ZOMBIE], coords: {top: '70%', left: '30%'} },
                     "sand_pit": { name: "The Sand Pit", levelRange: [60, 60], monsterPool: [MONSTERS.DUNGEON_GUARDIAN], coords: {top: '20%', left: '50%'}, isBoss: true }
                }
            },
            "final_dungeon": {
                name: "Final Dungeon",
                mapImage: "images/map_dungeon_zoomed.png",
                coords: { top: '22%', left: '78%' },
                icon: 'images/icons/final_dungeon.png', // Just the path string
                subZones: {
                    // --- FIX: This pool should contain regular monsters, not the boss ---
                    "gatehouse": { name: "The Gatehouse", levelRange: [61, 99], monsterPool: [MONSTERS.SKELETON, MONSTERS.ORC, MONSTERS.ZOMBIE], coords: {top: '80%', left: '50%'} },
                    "archdemon_lair": { name: "Archdemon's Lair", levelRange: [100, 100], monsterPool: [MONSTERS.ARCHDEMON_OVERLORD], coords: {top: '10%', left: '50%'}, isBoss: true }
                }
            }
        }
    },
    {
        name: "The Underdark",
        mapImage: "images/underground_world_map.png", 
        requiredLevel: 101,
        zones: {
             "crystal_caves": {
                name: "Crystal Caverns",
                mapImage: "images/map_caves_zoomed.png",
                coords: { top: '70%', left: '25%' },
                icon: 'images/icons/ring.png', // Just the path string
                subZones: {
                    "glimmering_path": { name: "Glimmering Path", levelRange: [101, 119], monsterPool: [MONSTERS.BAT, MONSTERS.SKELETON], coords: {top: '60%', left: '30%'} },
                    "crystal_heart": { name: "Crystal Heart", levelRange: [120, 120], monsterPool: [MONSTERS.DUNGEON_GUARDIAN], coords: {top: '75%', left: '70%'}, isBoss: true }
                }
            },
            "fungal_forest": {
                name: "Fungal Forest",
                mapImage: "images/map_fungal_zoomed.png",
                coords: { top: '40%', left: '50%' },
                icon: 'images/icons/necklace.png', // Just the path string
                subZones: {
                    "spore_meadows": { name: "Spore Meadows", levelRange: [121, 159], monsterPool: [MONSTERS.SLIME, MONSTERS.BAT, MONSTERS.ZOMBIE], coords: {top: '60%', left: '30%'} },
                    "great_fungus": { name: "The Great Fungus", levelRange: [160, 160], monsterPool: [MONSTERS.DUNGEON_GUARDIAN], coords: {top: '20%', left: '50%'}, isBoss: true }
                }
            },
            "drow_city": {
                name: "Drow City",
                mapImage: "images/map_drow_zoomed.png",
                coords: { top: '25%', left: '75%' },
                icon: 'images/icons/belt.png', // Just the path string
                subZones: {
                    "outer_spires": { name: "Outer Spires", levelRange: [161, 199], monsterPool: [MONSTERS.SKELETON, MONSTERS.ORC], coords: {top: '70%', left: '30%'} },
                    "spider_queen_lair": { name: "Spider Queen's Lair", levelRange: [200, 200], monsterPool: [MONSTERS.ARCHDEMON_OVERLORD], coords: {top: '20%', left: '50%'}, isBoss: true }
                }
            }
        }
    }
];