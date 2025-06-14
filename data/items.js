import { STATS } from './stat_pools.js';

/*
* ITEM DEFINITION GUIDE
*
* isUnique: (Optional) If true, this item is considered a "unique" or "boss" item.
*           This can be used to exclude it from certain loot pools, like loot crates.
*/

export const ITEMS = {
    // --- SWORDS ---
    RUSTY_SWORD: {
        name: "Rusty Sword",
        type: 'sword',
        icon: 'images/icons/sword.png', 
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 15 }
        ]
    },
    GLADIATORS_LONGSWORD: {
        name: "Gladiator's Longsword",
        type: 'sword',
        icon: 'images/icons/sword.png',
        isUnique: true, // This is a special boss/unique item
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
    DEAMONS_HEAD: {
        name: "Leather Cap",
        type: 'helmet',
        icon: 'images/icons/helmet.png',
        possibleStats: [
            { key: STATS.DPS.key, min: 1, max: 100 }
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
        isUnique: true, // This is also a special boss/unique item
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