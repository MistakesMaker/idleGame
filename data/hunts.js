// --- START OF FILE data/hunts.js ---

/*
* HUNT DEFINITION GUIDE
*
* This file defines the pool of tasks for the Hunter's Board.
* Hunts are organized into tiers based on player progression within a single prestige run.
*
* TIER OBJECT:
*   requiredLevel: The highest level the player must have reached in their CURRENT RUN
*                  to unlock this tier of hunts.
*   hunts: An array of hunt objects.
*
* HUNT OBJECT:
*   id: A unique key for the task.
*   title: The display name for the UI.
*   description: A player-facing explanation of the objective. Use '{quantity}' as a
*                placeholder for the dynamically generated number.
*   type: The category of the task for the game logic.
*       - 'kill_specific': Target a single monster ID.
*       - 'kill_category': Target monsters based on properties (isBoss, realm, nameContains).
*   target: The specific monster ID (e.g., 'SLIME') or an object defining the category
*           (e.g., { isBoss: true, realm: "The Overworld" }).
*   quantityMin: The minimum number of kills required.
*   quantityMax: The maximum number of kills required.
*   rewardIds: An array of possible consumable IDs. The game will randomly pick one.
*/

export const HUNT_POOLS = [
    {
        // Tier 1: Overworld Hunts (Unlocked immediately after first prestige)
        requiredLevel: 1,
        hunts: [
            { id: 'hunt_kill_slimes', title: 'Slime Culling', description: 'Defeat {quantity} Slimes.', type: 'kill_specific', target: 'SLIME', quantityMin: 25, quantityMax: 50, rewardIds: ['SCRAP_CACHE_SMALL', 'XP_ELIXIR_MINOR'] },
            { id: 'hunt_kill_goblins', title: 'Goblin Menace', description: 'Defeat {quantity} Goblins.', type: 'kill_specific', target: 'GOBLIN', quantityMin: 25, quantityMax: 50, rewardIds: ['XP_ELIXIR_MINOR', 'GOLD_BOOSTER_MINOR'] },
            { id: 'hunt_kill_spiders', title: 'Webbed Threat', description: 'Defeat {quantity} Giant Spiders.', type: 'kill_specific', target: 'GIANT_SPIDER', quantityMin: 20, quantityMax: 40, rewardIds: ['GOLD_BOOSTER_MINOR', 'SCRAP_CACHE_SMALL'] },
            { id: 'hunt_kill_overworld_bosses', title: 'Meadow Overlords', description: 'Vanquish {quantity} bosses in The Overworld.', type: 'kill_category', target: { isBoss: true, realm: 'The Overworld' }, quantityMin: 1, quantityMax: 3, rewardIds: ['MAGIC_FIND_POTION_MINOR', 'SCRAP_CACHE_MEDIUM', 'GEM_SEEKER_DRAFT_MINOR'] }
        ]
    },
    {
        // Tier 2: Orc Volcano Hunts
        requiredLevel: 101,
        hunts: [
            { id: 'hunt_kill_orcs', title: 'For the Horde!', description: 'Defeat {quantity} Orcs of any kind.', type: 'kill_category', target: { nameContains: 'Orc' }, quantityMin: 30, quantityMax: 50, rewardIds: ['XP_ELIXIR_MINOR', 'SCRAP_CACHE_MEDIUM'] },
            { id: 'hunt_kill_salamanders', title: 'Fiery Lizards', description: 'Defeat {quantity} Salamanders.', type: 'kill_specific', target: 'SALAMANDER', quantityMin: 25, quantityMax: 45, rewardIds: ['GOLD_BOOSTER_MINOR', 'MAGIC_FIND_POTION_MINOR'] },
            { id: 'hunt_kill_volcano_any', title: 'Volcanic Eradication', description: 'Defeat {quantity} monsters within the Orc Volcano.', type: 'kill_category', target: { zoneId: 'orc_volcano', realm: 'The Overworld' }, quantityMin: 40, quantityMax: 60, rewardIds: ['SCRAP_CACHE_MEDIUM', 'GOLD_BOOSTER_MAJOR'] },
            { id: 'hunt_kill_volcano_bosses', title: 'Masters of Magma', description: 'Vanquish {quantity} bosses in the Orc Volcano.', type: 'kill_category', target: { isBoss: true, zoneId: 'orc_volcano', realm: 'The Overworld' }, quantityMin: 1, quantityMax: 3, rewardIds: ['GEM_SEEKER_DRAFT_MINOR', 'XP_ELIXIR_MAJOR', 'SCRAP_CACHE_LARGE'] }
        ]
    },
    {
        // Tier 3: Undead Desert Hunts
        requiredLevel: 201,
        hunts: [
            { id: 'hunt_kill_skeletons', title: 'Bone Collector', description: 'Defeat {quantity} Skeletons.', type: 'kill_specific', target: 'SKELETON', quantityMin: 35, quantityMax: 50, rewardIds: ['MAGIC_FIND_POTION_MINOR', 'XP_ELIXIR_MAJOR'] },
            { id: 'hunt_kill_scorpions', title: 'Stinger Season', description: 'Defeat {quantity} Giant Scorpions.', type: 'kill_specific', target: 'GIANT_SCORPION', quantityMin: 25, quantityMax: 40, rewardIds: ['XP_ELIXIR_MAJOR', 'GOLD_BOOSTER_MAJOR'] },
            { id: 'hunt_kill_desert_any', title: 'Cleansing the Desert', description: 'Defeat {quantity} monsters within the Undead Desert.', type: 'kill_category', target: { zoneId: 'undead_desert', realm: 'The Overworld' }, quantityMin: 40, quantityMax: 60, rewardIds: ['GOLD_BOOSTER_MAJOR', 'SCRAP_CACHE_LARGE'] },
            { id: 'hunt_kill_desert_bosses', title: 'Pharaoh\'s Fall', description: 'Vanquish {quantity} bosses in the Undead Desert.', type: 'kill_category', target: { isBoss: true, zoneId: 'undead_desert', realm: 'The Overworld' }, quantityMin: 1, quantityMax: 3, rewardIds: ['SCRAP_CACHE_LARGE', 'GEM_SEEKER_DRAFT_MAJOR'] }
        ]
    },
    {
        // Tier 4: Underdark Hunts
        requiredLevel: 401,
        hunts: [
            { id: 'hunt_kill_drow', title: 'Drow Purge', description: 'Defeat {quantity} Drow of any kind.', type: 'kill_category', target: { nameContains: 'Drow' }, quantityMin: 30, quantityMax: 50, rewardIds: ['XP_ELIXIR_MAJOR', 'MAGIC_FIND_POTION_MINOR'] },
            { id: 'hunt_kill_fungal', title: 'Mushroom Harvest', description: 'Defeat {quantity} fungal monsters.', type: 'kill_category', target: { zoneId: 'fungal_forest', realm: 'The Underdark' }, quantityMin: 40, quantityMax: 60, rewardIds: ['GOLD_BOOSTER_MAJOR', 'SCRAP_CACHE_LARGE'] },
            { id: 'hunt_kill_underdark_any', title: 'Light in the Dark', description: 'Defeat {quantity} monsters within The Underdark.', type: 'kill_category', target: { realm: 'The Underdark' }, quantityMin: 50, quantityMax: 75, rewardIds: ['GEM_SEEKER_DRAFT_MAJOR', 'GOLD_BOOSTER_MAJOR'] }
        ]
    }
    // Future tiers for Sunken World, Celestial Planes, etc., can be added here following the same pattern.
];