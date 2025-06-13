import { STATS } from './stat_pools.js';

export const ITEMS = {
    SWORD: {
        name: 'Sword',
        icon: 'images/icons/sword.png',
        possibleStats: [STATS.CLICK_DAMAGE, STATS.DPS]
    },
    SHIELD: {
        name: 'Shield',
        icon: 'images/icons/shield.png',
        possibleStats: [STATS.DPS]
    },
    HELMET: {
        name: 'Helmet',
        icon: 'images/icons/helmet.png',
        possibleStats: [STATS.GOLD_GAIN]
    },
    NECKLACE: {
        name: 'Necklace',
        icon: 'images/icons/necklace.png',
        possibleStats: [STATS.GOLD_GAIN]
    },
    PLATEBODY: {
        name: 'Platebody',
        icon: 'images/icons/platebody.png',
        possibleStats: [STATS.DPS]
    },
    PLATELEGS: {
        name: 'Platelegs',
        icon: 'images/icons/platelegs.png',
        possibleStats: [STATS.DPS]
    },
    RING: {
        name: 'Ring',
        icon: 'images/icons/ring.png',
        possibleStats: [STATS.CLICK_DAMAGE, STATS.GOLD_GAIN]
    },
    BELT: {
        name: 'Belt',
        icon: 'images/icons/belt.png',
        possibleStats: [STATS.DPS]
    },
};