// --- START OF FILE data/items.js ---

import { STATS } from './stat_pools.js';

/*
* ITEM DEFINITION GUIDE
*
* id: A unique key for this item base. Should match the key in the ITEMS object.
* isUnique: (Optional) If true, this item is considered a "unique" or "boss" item.
*           This can be used to exclude it from certain loot pools, like loot crates.
*/

export const ITEMS = {
    // --- SWORDS ---
    RUSTY_SWORD: {
        id: 'RUSTY_SWORD', // Added ID
        name: "Rusty Sword",
        type: 'sword',
        icon: 'images/icons/sword.png', 
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 15 }
        ]
    },
    GLADIATORS_LONGSWORD: {
        id: 'GLADIATORS_LONGSWORD', // Added ID
        name: "Gladiator's Longsword",
        type: 'sword',
        icon: 'images/icons/sword.png',
        isUnique: true,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 20, max: 100 },
            { key: STATS.DPS.key, min: 50, max: 250 }
        ]
    },

    // --- SHIELDS ---
    WOODEN_SHIELD: {
        id: 'WOODEN_SHIELD', // Added ID
        name: "Wooden Shield",
        type: 'shield',
        icon: 'images/icons/shield.png',
        possibleStats: [
            { key: STATS.DPS.key, min: 5, max: 40 }
        ]
    },

    // --- HELMETS ---
    LEATHER_CAP: {
        id: 'LEATHER_CAP', // Added ID
        name: "Leather Cap",
        type: 'helmet',
        icon: 'images/icons/helmet.png',
        possibleStats: [
            { key: STATS.GOLD_GAIN.key, min: 1, max: 8 }
        ]
    },

    // --- ARMOR ---
    APPRENTICE_ROBE: {
        id: 'APPRENTICE_ROBE', // Added ID
        name: "Apprentice Robe",
        type: 'platebody',
        icon: 'images/icons/platebody.png',
        possibleStats: [
            { key: STATS.GOLD_GAIN.key, min: 5, max: 25 }
        ]
    },
    KNIGHTS_PLATELEGS: {
        id: 'KNIGHTS_PLATELEGS', // Added ID
        name: "Knight's Platelegs",
        type: 'platelegs',
        icon: 'images/icons/platelegs.png',
        possibleStats: [
            { key: STATS.DPS.key, min: 25, max: 120 }
        ]
    },

    // --- ACCESSORIES ---
    RING_OF_WEALTH: {
        id: 'RING_OF_WEALTH', // Added ID
        name: "Ring of Wealth",
        type: 'ring',
        icon: 'images/icons/ring.png',
        possibleStats: [
            { key: STATS.GOLD_GAIN.key, min: 10, max: 50 }
        ]
    },
    AMULET_OF_POWER: {
        id: 'AMULET_OF_POWER', // Added ID
        name: "Amulet of Power",
        type: 'necklace',
        icon: 'images/icons/necklace.png',
        isUnique: true,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 15, max: 75 },
            { key: STATS.DPS.key, min: 30, max: 150 }
        ]
    },
    MIGHTY_BELT: {
        id: 'MIGHTY_BELT', // Added ID
        name: "Mighty Belt",
        type: 'belt',
        icon: 'images/icons/belt.png',
        possibleStats: [
            { key: STATS.DPS.key, min: 10, max: 80 }
        ]
    }
};