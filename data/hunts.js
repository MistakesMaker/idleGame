// --- START OF FILE data/hunts.js ---

/*
* HUNT DEFINITION GUIDE
*
* This file defines the pool of tasks for the Hunter's Board.
* Hunts are organized into tiers based on player progression within a single prestige run.
*
* TIER OBJECT:
*   requiredLevel: The highest level the player must have reached in their CURRENT RUN
*                  to unlock this tier of hunts. This should match the starting level of the relevant zone.
*   hunts: An array of hunt objects.
*
* HUNT OBJECT:
*   id: A unique key for the task.
*   title: The display name for the UI.
*   description: A player-facing explanation of the objective. Use '{quantity}' as a
*                placeholder for the dynamically generated number.
*   type: The category of the task for the game logic.
*       - 'kill_specific': Target a single monster ID.
*       - 'kill_category': Target monsters based on properties (isBoss, realm, zoneId, nameContains).
*   target: The specific monster ID (e.g., 'SLIME') or an object defining the category
*           (e.g., { isBoss: true, realm: "The Overworld" }).
*   quantityMin: The minimum number of kills required.
*   quantityMax: The maximum number of kills required.
*   rewardIds: An array of possible consumable IDs. The game will randomly pick one.
*/

export const HUNT_POOLS = [
    {
        // Tier 1: Green Meadows Hunts (Levels 1-100)
        requiredLevel: 1,
        hunts: [
            { id: 'hunt_kill_slimes', title: 'Slime Culling', description: 'Defeat {quantity} Slimes of any kind.', type: 'kill_category', target: { nameContains: 'Slime' }, quantityMin: 25, quantityMax: 50, rewardIds: ['SCRAP_CACHE_SMALL', 'XP_ELIXIR_MINOR'] },
            { id: 'hunt_kill_goblins', title: 'Goblin Menace', description: 'Defeat {quantity} Goblins of any kind.', type: 'kill_category', target: { nameContains: 'Goblin' }, quantityMin: 25, quantityMax: 50, rewardIds: ['XP_ELIXIR_MINOR', 'GOLD_BOOSTER_MINOR'] },
            { id: 'hunt_kill_spiders', title: 'Webbed Threat', description: 'Defeat {quantity} Spiders of any kind.', type: 'kill_category', target: { nameContains: 'Spider' }, quantityMin: 20, quantityMax: 40, rewardIds: ['GOLD_BOOSTER_MINOR', 'SCRAP_CACHE_SMALL'] },
            { id: 'hunt_kill_meadows_bosses', title: 'Meadow Overlords', description: 'Vanquish {quantity} bosses in the Green Meadows.', type: 'kill_category', target: { isBoss: true, zoneId: 'green_meadows' }, quantityMin: 1, quantityMax: 3, rewardIds: ['MAGIC_FIND_POTION_MINOR', 'SCRAP_CACHE_MEDIUM'] }
        ]
    },
    {
        // Tier 2: Orc Volcano Hunts (Levels 101-200)
        requiredLevel: 101,
        hunts: [
            { id: 'hunt_kill_orcs', title: 'For the Horde!', description: 'Defeat {quantity} Orcs of any kind.', type: 'kill_category', target: { nameContains: 'Orc' }, quantityMin: 30, quantityMax: 50, rewardIds: ['XP_ELIXIR_MINOR', 'SCRAP_CACHE_MEDIUM'] },
            { id: 'hunt_kill_salamanders', title: 'Fiery Lizards', description: 'Defeat {quantity} Salamanders.', type: 'kill_specific', target: 'SALAMANDER', quantityMin: 25, quantityMax: 45, rewardIds: ['GOLD_BOOSTER_MINOR', 'MAGIC_FIND_POTION_MINOR'] },
            { id: 'hunt_kill_volcano_any', title: 'Volcanic Eradication', description: 'Defeat {quantity} monsters within the Orc Volcano.', type: 'kill_category', target: { zoneId: 'orc_volcano' }, quantityMin: 40, quantityMax: 60, rewardIds: ['SCRAP_CACHE_MEDIUM', 'GOLD_BOOSTER_MAJOR'] },
            { id: 'hunt_kill_volcano_bosses', title: 'Masters of Magma', description: 'Vanquish {quantity} bosses in the Orc Volcano.', type: 'kill_category', target: { isBoss: true, zoneId: 'orc_volcano' }, quantityMin: 1, quantityMax: 3, rewardIds: ['GEM_SEEKER_DRAFT_MINOR', 'XP_ELIXIR_MAJOR', 'SCRAP_CACHE_LARGE'] }
        ]
    },
    {
        // Tier 3: Undead Desert Hunts (Levels 201-300)
        requiredLevel: 201,
        hunts: [
            { id: 'hunt_kill_skeletons', title: 'Bone Collector', description: 'Defeat {quantity} Skeletons of any kind.', type: 'kill_category', target: { nameContains: 'Skeleton' }, quantityMin: 35, quantityMax: 50, rewardIds: ['MAGIC_FIND_POTION_MINOR', 'XP_ELIXIR_MAJOR'] },
            { id: 'hunt_kill_scorpions', title: 'Stinger Season', description: 'Defeat {quantity} Giant Scorpions.', type: 'kill_specific', target: 'GIANT_SCORPION', quantityMin: 25, quantityMax: 40, rewardIds: ['XP_ELIXIR_MAJOR', 'GOLD_BOOSTER_MAJOR'] },
            { id: 'hunt_kill_desert_any', title: 'Cleansing the Desert', description: 'Defeat {quantity} monsters within the Undead Desert.', type: 'kill_category', target: { zoneId: 'undead_desert' }, quantityMin: 40, quantityMax: 60, rewardIds: ['GOLD_BOOSTER_MAJOR', 'SCRAP_CACHE_LARGE'] },
            { id: 'hunt_kill_desert_bosses', title: 'Pharaoh\'s Fall', description: 'Vanquish {quantity} bosses in the Undead Desert.', type: 'kill_category', target: { isBoss: true, zoneId: 'undead_desert' }, quantityMin: 1, quantityMax: 3, rewardIds: ['SCRAP_CACHE_LARGE', 'GEM_SEEKER_DRAFT_MINOR'] }
        ]
    },
    {
        // Tier 4: Final Dungeon Hunts (Levels 301-400)
        requiredLevel: 301,
        hunts: [
            { id: 'hunt_kill_imps', title: 'Imp Infestation', description: 'Defeat {quantity} Imps.', type: 'kill_specific', target: 'IMP', quantityMin: 35, quantityMax: 55, rewardIds: ['XP_ELIXIR_MAJOR', 'GOLD_BOOSTER_MAJOR'] },
            { id: 'hunt_kill_hellhounds', title: 'Culling the Pack', description: 'Defeat {quantity} Hellhounds.', type: 'kill_specific', target: 'HELLHOUND', quantityMin: 30, quantityMax: 50, rewardIds: ['SCRAP_CACHE_LARGE', 'MAGIC_FIND_POTION_MINOR'] },
            { id: 'hunt_kill_dungeon_any', title: 'Dungeon Delving', description: 'Defeat {quantity} monsters within the Final Dungeon.', type: 'kill_category', target: { zoneId: 'final_dungeon' }, quantityMin: 50, quantityMax: 70, rewardIds: ['GOLD_BOOSTER_MAJOR', 'XP_ELIXIR_MAJOR'] },
            { id: 'hunt_kill_dungeon_bosses', title: 'Slaying the Lords', description: 'Vanquish {quantity} bosses in the Final Dungeon.', type: 'kill_category', target: { isBoss: true, zoneId: 'final_dungeon' }, quantityMin: 1, quantityMax: 3, rewardIds: ['SCRAP_CACHE_LARGE', 'GEM_SEEKER_DRAFT_MINOR'] }
        ]
    },
    {
        // Tier 5: Crystal Caverns Hunts (Levels 401-500)
        requiredLevel: 401,
        hunts: [
            { id: 'hunt_kill_crystal_spiders', title: 'Crystal Clear', description: 'Defeat {quantity} Crystal Spiders.', type: 'kill_specific', target: 'CRYSTAL_SPIDER', quantityMin: 40, quantityMax: 60, rewardIds: ['SCRAP_CACHE_LARGE', 'GOLD_BOOSTER_MAJOR'] },
            { id: 'hunt_kill_caverns_any', title: 'Cavern Clean-up', description: 'Defeat {quantity} monsters within the Crystal Caverns.', type: 'kill_category', target: { zoneId: 'crystal_caves' }, quantityMin: 50, quantityMax: 75, rewardIds: ['XP_ELIXIR_MAJOR', 'MAGIC_FIND_POTION_MINOR'] },
            { id: 'hunt_kill_caverns_bosses', title: 'Heart of the Mountain', description: 'Vanquish {quantity} bosses in the Crystal Caverns.', type: 'kill_category', target: { isBoss: true, zoneId: 'crystal_caves' }, quantityMin: 1, quantityMax: 3, rewardIds: ['SCRAP_CACHE_LARGE', 'GEM_SEEKER_DRAFT_MINOR'] }
        ]
    },
    {
        // Tier 6: Fungal Forest Hunts (Levels 501-600)
        requiredLevel: 501,
        hunts: [
            { id: 'hunt_kill_myconids', title: 'Mushroom Harvest', description: 'Defeat {quantity} Myconids.', type: 'kill_specific', target: 'MYCONID_SPOREKEEPER', quantityMin: 40, quantityMax: 60, rewardIds: ['SCRAP_CACHE_LARGE', 'GOLD_BOOSTER_MAJOR'] },
            { id: 'hunt_kill_fungal_any', title: 'Spore Control', description: 'Defeat {quantity} monsters within the Fungal Forest.', type: 'kill_category', target: { zoneId: 'fungal_forest' }, quantityMin: 50, quantityMax: 75, rewardIds: ['XP_ELIXIR_MAJOR', 'GEM_SEEKER_DRAFT_MINOR'] },
            { id: 'hunt_kill_fungal_bosses', title: 'Clearcutting the Core', description: 'Vanquish {quantity} bosses in the Fungal Forest.', type: 'kill_category', target: { isBoss: true, zoneId: 'fungal_forest' }, quantityMin: 1, quantityMax: 3, rewardIds: ['SCRAP_CACHE_LARGE', 'GEM_SEEKER_DRAFT_MINOR'] }
        ]
    },
    {
        // Tier 7: Drow City Hunts (Levels 601-700)
        requiredLevel: 601,
        hunts: [
            { id: 'hunt_kill_drow', title: 'Drow Purge', description: 'Defeat {quantity} Drow of any kind.', type: 'kill_category', target: { nameContains: 'Drow' }, quantityMin: 45, quantityMax: 65, rewardIds: ['XP_ELIXIR_MAJOR', 'GOLD_BOOSTER_MAJOR'] },
            { id: 'hunt_kill_drow_city_any', title: 'City Patrol', description: 'Defeat {quantity} monsters within the Drow City.', type: 'kill_category', target: { zoneId: 'drow_city' }, quantityMin: 60, quantityMax: 80, rewardIds: ['SCRAP_CACHE_LARGE', 'GEM_SEEKER_DRAFT_MINOR'] },
            { id: 'hunt_kill_drow_bosses', title: 'Matron\'s Scorn', description: 'Vanquish {quantity} bosses in the Drow City.', type: 'kill_category', target: { isBoss: true, zoneId: 'drow_city' }, quantityMin: 1, quantityMax: 3, rewardIds: ['SCRAP_CACHE_LARGE', 'GEM_SEEKER_DRAFT_MINOR'] }
        ]
    },
    {
        // Tier 8: Abyssal Rift Hunts (Levels 701-800)
        requiredLevel: 701,
        hunts: [
            { id: 'hunt_kill_abyss_creatures', title: 'Gazing into the Abyss', description: 'Defeat {quantity} shadowy or abyssal creatures.', type: 'kill_category', target: { nameContains: 'Shadow' }, quantityMin: 45, quantityMax: 65, rewardIds: ['XP_ELIXIR_MAJOR', 'GOLD_BOOSTER_MAJOR'] }, // Note: Using a broader target
            { id: 'hunt_kill_abyss_any', title: 'Rift Scouring', description: 'Defeat {quantity} monsters within the Abyssal Rift.', type: 'kill_category', target: { zoneId: 'abyssal_rift' }, quantityMin: 60, quantityMax: 80, rewardIds: ['SCRAP_CACHE_LARGE', 'GEM_SEEKER_DRAFT_MINOR'] },
            { id: 'hunt_kill_abyss_bosses', title: 'Banishing the Void', description: 'Vanquish {quantity} bosses in the Abyssal Rift.', type: 'kill_category', target: { isBoss: true, zoneId: 'abyssal_rift' }, quantityMin: 1, quantityMax: 3, rewardIds: ['SCRAP_CACHE_LARGE', 'GEM_SEEKER_DRAFT_MINOR'] }
        ]
    }
];