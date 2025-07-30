// --- START OF FILE data/items/aetherium_forge_items.js ---
import { STATS } from '../stat_pools.js';

export const aetheriumForgeItems = {
    // 1601-1700
    REALITY_CUTTER: {
        id: 'REALITY_CUTTER',
        name: "Reality-Cutter",
        type: 'sword',
        icon: 'images/icons/reality-cutter.png',
        width: 2, height: 3,
        possibleStats: [ { key: STATS.CLICK_DAMAGE.key, min: 1e21, max: 3e21 } ]
    },
    CLOCKWORK_PAULDRONS: {
        id: 'CLOCKWORK_PAULDRONS',
        name: "Clockwork Pauldrons",
        type: 'platebody',
        icon: 'images/icons/clockwork_pauldrons.png',
        width: 2, height: 3,
        possibleStats: [ { key: STATS.DPS.key, min: 2e21, max: 6e21 } ]
    },
    MANAWEAVE_LEGGINGS: {
        id: 'MANAWEAVE_LEGGINGS',
        name: "Manaweave Leggings",
        type: 'platelegs',
        icon: 'images/icons/manaweave_leggings.png',
        width: 2, height: 3,
        possibleStats: [ { key: STATS.DPS.key, min: 2.1e21, max: 6.3e21 } ]
    },
    AUTOMATONS_EYE: {
        id: 'AUTOMATONS_EYE',
        name: "Automaton's Eye",
        type: 'ring',
        icon: 'images/icons/automatons_eye.png',
        width: 1, height: 1,
        possibleStats: [ { key: STATS.GOLD_GAIN.key, min: 8000, max: 24000 } ]
    },
    // 1701-1800
    RUNEFORGED_LEGGINGS: {
        id: 'RUNEFORGED_LEGGINGS',
        name: "Runeforged Leggings",
        type: 'platelegs',
        icon: 'images/icons/runeforged_leggings.png',
        width: 2, height: 3,
        possibleStats: [ { key: STATS.DPS.key, min: 5e22, max: 1.5e23 } ]
    },
    BAND_OF_INFINITE_POTENTIAL: {
        id: 'BAND_OF_INFINITE_POTENTIAL',
        name: "Band of Infinite Potential",
        type: 'ring',
        icon: 'images/icons/band_of_infinite_potential.png',
        width: 1, height: 1,
        possibleStats: [ { key: STATS.GOLD_GAIN.key, min: 10000, max: 30000 } ]
    },
    HELM_OF_FORBIDDEN_KNOWLEDGE: {
        id: 'HELM_OF_FORBIDDEN_KNOWLEDGE',
        name: "Helm of Forbidden Knowledge",
        type: 'helmet',
        icon: 'images/icons/helm_of_forbidden_knowledge.png',
        width: 2, height: 2,
        possibleStats: [ { key: STATS.MAGIC_FIND.key, min: 800, max: 2400 } ]
    },
    SCROLL_OF_POWER: {
        id: 'SCROLL_OF_POWER',
        name: "Scroll of Power",
        type: 'shield',
        icon: 'images/icons/scroll_of_power.png',
        width: 2, height: 3,
        possibleStats: [ { key: STATS.DPS.key, min: 5.5e22, max: 1.65e23 } ]
    },
    // 1801-1900
    AEGIS_OF_THE_MAKER: {
        id: 'AEGIS_OF_THE_MAKER',
        name: "Aegis of the Maker",
        type: 'shield',
        icon: 'images/icons/aegis_of_the_maker.png',
        width: 2, height: 3,
        possibleStats: [ { key: STATS.DPS.key, min: 1e24, max: 3e24 } ]
    },
    CROWN_OF_THE_ARCHITECT: {
        id: 'CROWN_OF_THE_ARCHITECT',
        name: "Crown of the Architect",
        type: 'helmet',
        icon: 'images/icons/crown_of_the_architect.png',
        width: 2, height: 2,
        possibleStats: [ { key: STATS.MAGIC_FIND.key, min: 1000, max: 3000 } ]
    },
    AETHERIUM_WEAVE_ROBES: {
        id: 'AETHERIUM_WEAVE_ROBES',
        name: "Aetherium-Weave Robes",
        type: 'platebody',
        icon: 'images/icons/aetherium_weave_robes.png',
        width: 2, height: 3,
        possibleStats: [ { key: STATS.DPS.key, min: 1.1e24, max: 3.3e24 } ]
    },
    NEXUS_SHARD_PENDANT: {
        id: 'NEXUS_SHARD_PENDANT',
        name: "Nexus Shard Pendant",
        type: 'necklace',
        icon: 'images/icons/nexus_shard_pendant.png',
        width: 2, height: 2,
        possibleStats: [ { key: STATS.GOLD_GAIN.key, min: 15000, max: 45000 } ]
    },
    // 1901-2000
    THE_UNMAKER: {
        id: 'THE_UNMAKER',
        name: "The Unmaker",
        type: 'sword',
        icon: 'images/icons/the_unmaker.png',
        isUnique: true,
        width: 2, height: 4,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 1e26, max: 3e26 },
            { key: STATS.DPS.key, min: 1e26, max: 3e26 }
        ]
    },
    THE_FIRST_SPARK: {
        id: 'THE_FIRST_SPARK',
        name: "The First Spark",
        type: 'belt',
        icon: 'images/icons/the_first_spark.png',
        isUnique: true,
        width: 2, height: 1,
        possibleStats: [
            { key: STATS.GOLD_GAIN.key, min: 25000, max: 75000 },
            { key: STATS.MAGIC_FIND.key, min: 2000, max: 6000 }
        ]
    }
};