import { STATS } from './stat_pools.js';

/*
* ITEM DEFINITION GUIDE
*
* Each item is a "Unique-Base Item" with a specific identity.
*
* name: The in-game name of the item.
* type: The equipment slot this item uses. Must match a slot name (e.g., 'sword', 'helmet').
* icon: The path to the item's image.
* possibleStats: An array of stats that can appear on this item.
*   - The number of stats an item gets is determined by its rarity (common, epic, etc.).
*   - If an item has only one stat in this array, it will always roll with that stat.
*   - For each stat:
*     - key: The internal stat key from stat_pools.js (e.g., STATS.DPS.key).
*     - min: The lowest possible value this stat can roll (at the lowest end of a 'common' item).
*     - max: The highest possible value this stat can roll (at the highest end of a 'legendary' item).
*/

export const ITEMS = {
    // --- SWORDS ---
    RUSTY_SWORD: {
        name: "Rusty Sword",
        type: 'sword',
        icon: 'images/icons/sword.png', // You can create new icons later
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 15 }
        ]
    },
    GLADIATORS_LONGSWORD: {
        name: "Gladiator's Longsword",
        type: 'sword',
        icon: 'images/icons/sword.png',
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 20, max: 100 },
            { key: STATS.DPS.key, min: 50, max: 250 }
        ]
    },

    // --- SHIELDS ---
    WOODEN_SHIELD: {
        name: "Wooden Shield",
        type: 'shield',
        icon: 'images/icons/shield.png',
        possibleStats: [
            { key: STATS.DPS.key, min: 5, max: 40 }
        ]
    },

    // --- HELMETS ---
    LEATHER_CAP: {
        name: "Leather Cap",
        type: 'helmet',
        icon: 'images/icons/helmet.png',
        possibleStats: [
            { key: STATS.GOLD_GAIN.key, min: 1, max: 8 }
        ]
    },

    // --- ARMOR ---
    APPRENTICE_ROBE: {
        name: "Apprentice Robe",
        type: 'platebody',
        icon: 'images/icons/platebody.png',
        possibleStats: [
            { key: STATS.GOLD_GAIN.key, min: 5, max: 25 }
        ]
    },
    KNIGHTS_PLATELEGS: {
        name: "Knight's Platelegs",
        type: 'platelegs',
        icon: 'images/icons/platelegs.png',
        possibleStats: [
            { key: STATS.DPS.key, min: 25, max: 120 }
        ]
    },

    // --- ACCESSORIES ---
    RING_OF_WEALTH: {
        name: "Ring of Wealth",
        type: 'ring',
        icon: 'images/icons/ring.png',
        possibleStats: [
            { key: STATS.GOLD_GAIN.key, min: 10, max: 50 }
        ]
    },
    AMULET_OF_POWER: {
        name: "Amulet of Power",
        type: 'necklace',
        icon: 'images/icons/necklace.png',
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 15, max: 75 },
            { key: STATS.DPS.key, min: 30, max: 150 }
        ]
    },
    MIGHTY_BELT: {
        name: "Mighty Belt",
        type: 'belt',
        icon: 'images/icons/belt.png',
        possibleStats: [
            { key: STATS.DPS.key, min: 10, max: 80 }
        ]
    }
};