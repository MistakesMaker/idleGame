// --- START OF FILE data/hunt_shop.js ---

/*
* HUNT SHOP DEFINITION GUIDE
*
* This file defines the items available in the Hunt Shop.
*
* id: The item ID from CONSUMABLES.js or a special unique key for shop-only actions.
* cost: The price in Hunt Tokens.
* unlock: (Optional) The number of total hunts the player must complete to unlock this item for purchase.
* oneTimePurchase: (Optional) If true, this item can only be purchased once per save file.
*/
export const HUNT_SHOP_INVENTORY = [
    {
        id: 'HUNT_CANCEL',
        cost: 5,
    },
    {
        id: 'HUNT_REROLL',
        cost: 10,
    },
    {
        id: 'SCRAP_CACHE_SMALL',
        cost: 2,
    },
    {
        id: 'GOLD_BOOSTER_MINOR',
        cost: 3,
    },
    {
        id: 'XP_ELIXIR_MINOR',
        cost: 5,
        unlock: 10,
    },
    {
        id: 'GOLD_BOOSTER_MAJOR',
        cost: 10,
        unlock: 50,
    },
    {
        id: 'MAGIC_FIND_POTION_MINOR',
        cost: 12,
        unlock: 50,
    },
    {
        id: 'XP_ELIXIR_MAJOR',
        cost: 15,
        unlock: 100,
    },
    {
        id: 'GEM_SEEKER_DRAFT_MINOR',
        cost: 20,
        unlock: 100,
    },
    {
        id: 'ARTISAN_DRILL', // Re-added with a new name
        cost: 120,
        unlock: 100,
    },
    {
        id: 'TOME_OF_STRENGTH', // Replaces Hunter's Emblem
        cost: 250,
        unlock: 200,
        oneTimePurchase: true,
    },
    {
        id: 'TOME_OF_AGILITY', // New DPS Tome
        cost: 250,
        unlock: 200,
        oneTimePurchase: true,
    }
];