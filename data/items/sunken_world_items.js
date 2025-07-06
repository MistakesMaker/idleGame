// --- START OF FILE data/items/sunken_world_items.js ---

import { STATS } from '../stat_pools.js';

export const sunkenWorldItems = {
    // 801-900
    TRIDENT_OF_TIDES: {
        id: 'TRIDENT_OF_TIDES',
        name: "Trident of Tides",
        type: 'sword',
        icon: 'images/icons/trident_of_tides.png',
        width: 2, height: 4,
        possibleStats: [ { key: STATS.CLICK_DAMAGE.key, min: 1e9, max: 3e9 } ]
    },
    CORAL_PLATEMAIL: {
        id: 'CORAL_PLATEMAIL',
        name: "Coral Platemail",
        type: 'platebody',
        icon: 'images/icons/coral_platemail.png',
        width: 2, height: 3,
        possibleStats: [ { key: STATS.DPS.key, min: 2e9, max: 6e9 } ]
    },
    HELMET_OF_THE_TIDES: {
        id: 'HELMET_OF_THE_TIDES',
        name: 'Helmet of the Tides',
        type: 'helmet',
        icon: 'images/icons/helmet_of_the_tides.png',
        width: 2, height: 2,
        possibleStats: [ { key: STATS.GOLD_GAIN.key, min: 250, max: 750 } ]
    },
    SIRENSONG_CHARM: {
        id: 'SIRENSONG_CHARM',
        name: "Sirensong Charm",
        type: 'necklace',
        icon: 'images/icons/sirensong_charm.png',
        width: 2, height: 2,
        possibleStats: [ { key: STATS.MAGIC_FIND.key, min: 30, max: 90 } ]
    },
    // 901-1000
    KRAKEN_HIDE_LEGGINGS: {
        id: 'KRAKEN_HIDE_LEGGINGS',
        name: "Kraken-hide Leggings",
        type: 'platelegs',
        icon: 'images/icons/kraken_hide_leggings.png',
        width: 2, height: 3,
        possibleStats: [ { key: STATS.DPS.key, min: 5e10, max: 1.5e11 } ]
    },
    PEARL_OF_WISDOM: {
        id: 'PEARL_OF_WISDOM',
        name: "Pearl of Wisdom",
        type: 'necklace',
        icon: 'images/icons/pearl_of_wisdom.png',
        width: 2, height: 2,
        possibleStats: [ { key: STATS.GOLD_GAIN.key, min: 500, max: 1500 } ]
    },
    CRUSHING_GRASP_GAUNTLETS: {
        id: 'CRUSHING_GRASP_GAUNTLETS',
        name: "Crushing Grasp Gauntlets",
        type: 'belt',
        icon: 'images/icons/crushing_grasp_gauntlets.png',
        width: 2, height: 1,
        possibleStats: [ { key: STATS.CLICK_DAMAGE.key, min: 2e10, max: 6e10 } ]
    },
    RING_OF_THE_DEEP: {
        id: 'RING_OF_THE_DEEP',
        name: "Ring of the Deep",
        type: 'ring',
        icon: 'images/icons/ring_of_the_deep.png',
        width: 1, height: 1,
        possibleStats: [ { key: STATS.DPS.key, min: 3e10, max: 9e10 } ]
    },
    // 1001-1100
    ABYSSAL_LANTERN: {
        id: 'ABYSSAL_LANTERN',
        name: "Abyssal Lantern",
        type: 'shield',
        icon: 'images/icons/abyssal_lantern.png',
        width: 2, height: 3,
        possibleStats: [ { key: STATS.DPS.key, min: 1e12, max: 3e12 } ]
    },
    HELM_OF_THE_DEEP: {
        id: 'HELM_OF_THE_DEEP',
        name: "Helm of the Deep",
        type: 'helmet',
        icon: 'images/icons/helm_of_the_deep.png',
        width: 2, height: 2,
        possibleStats: [ { key: STATS.MAGIC_FIND.key, min: 50, max: 150 } ]
    },
    PRESSUREPLATE_ARMOR: {
        id: 'PRESSUREPLATE_ARMOR',
        name: "Pressureplate Armor",
        type: 'platebody',
        icon: 'images/icons/pressureplate_armor.png',
        width: 2, height: 3,
        possibleStats: [ { key: STATS.DPS.key, min: 1.2e12, max: 3.6e12 } ]
    },
    VOLCANIC_LOOP: {
        id: 'VOLCANIC_LOOP',
        name: "Volcanic Loop",
        type: 'ring',
        icon: 'images/icons/volcanic_loop.png',
        width: 1, height: 1,
        possibleStats: [ { key: STATS.CLICK_DAMAGE.key, min: 5e11, max: 1.5e12 } ]
    },
    // 1101-1200
    LEVIATHANS_BITE: {
        id: 'LEVIATHANS_BITE',
        name: "Leviathan's Bite",
        type: 'sword',
        icon: 'images/icons/leviathans_bite.png',
        isUnique: true,
        width: 2, height: 4,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 1e14, max: 3e14 },
            { key: STATS.DPS.key, min: 1e14, max: 3e14 }
        ]
    },
    EYE_OF_THE_MAELSTROM: {
        id: 'EYE_OF_THE_MAELSTROM',
        name: "Eye of the Maelstrom",
        type: 'ring',
        icon: 'images/icons/eye_of_the_maelstrom.png',
        isUnique: true,
        width: 1, height: 1,
        possibleStats: [
            { key: STATS.GOLD_GAIN.key, min: 1000, max: 3000 },
            { key: STATS.MAGIC_FIND.key, min: 100, max: 300 }
        ]
    }
};