// --- START OF FILE data/monsters/celestial_planes_monsters.js ---

import { ITEMS } from '../items.js';
import { GEMS } from '../gems.js';

export const celestialPlanesMonsters = {
    // --- Zone: Azure Pathway (Levels 1201-1300) ---
    CLOUD_SERPENT: {
        name: "Cloud Serpent",
        image: "images/monsters/cloud_serpent.png",
        dropChance: 30,
        lootTable: [
            { item: ITEMS.BLADE_OF_THE_SERAPH, weight: 1 },
            { item: ITEMS.ARCHONS_PLATEMAIL, weight: 1 },
            { item: ITEMS.CLOUDSTRIDER_BOOTS, weight: 1 }
        ]
    },
    SKY_WISP: {
        name: "Sky Wisp",
        image: "images/monsters/sky_wisp.png",
        dropChance: 25,
        lootTable: [
            { item: ITEMS.RING_OF_CONSTELLATIONS, weight: 1 },
            { item: ITEMS.GALEFORCE_GUARD, weight: 1 }
        ]
    },
    GRYPHON_SENTINEL: {
        name: "Gryphon Sentinel",
        image: "images/monsters/gryphon_sentinel.png",
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.BLADE_OF_THE_SERAPH, weight: 5 },
            { item: ITEMS.ARCHONS_PLATEMAIL, weight: 5 },
            { item: ITEMS.CLOUDSTRIDER_BOOTS, weight: 5 }
        ]
    },
    // --- Zone: Halls of Valor (Levels 1301-1400) ---
    VALKYRIE: {
        name: "Valkyrie",
        image: "images/monsters/valkyrie.png",
        dropChance: 30,
        lootTable: [
            { item: ITEMS.STARFORGED_GREAVES, weight: 1 },
            { item: ITEMS.RING_OF_CONSTELLATIONS, weight: 1 },
            { item: ITEMS.EINHERJARS_AXE, weight: 1 }
        ]
    },
    EINHERJAR: {
        name: "Einherjar",
        image: "images/monsters/einherjar.png",
        dropChance: 25,
        lootTable: [
            { item: ITEMS.AEGIS_OF_DAWN, weight: 1 },
            { item: ITEMS.VALKYRIES_EMBRACE, weight: 1 }
        ]
    },
    ODINS_RAVEN: {
        name: "Odin's Raven",
        image: "images/monsters/odins_raven.png",
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.STARFORGED_GREAVES, weight: 5 },
            { item: ITEMS.AEGIS_OF_DAWN, weight: 5 },
            { item: ITEMS.VALKYRIES_EMBRACE, weight: 5 }
        ]
    },
    // --- Zone: The Astral Sea (Levels 1401-1500) ---
    STARWHALE: {
        name: "Star-whale",
        image: "images/monsters/starwhale.png",
        dropChance: 30,
        lootTable: [
            { item: ITEMS.HALO_OF_LIGHT, weight: 1 },
            { item: ITEMS.AEGIS_OF_DAWN, weight: 1 },
            { item: ITEMS.STARWHALE_TALISMAN, weight: 1 }
        ]
    },
    COMET_ELEMENTAL: {
        name: "Comet Elemental",
        image: "images/monsters/comet_elemental.png",
        dropChance: 25,
        lootTable: [
            { item: ITEMS.CELESTIAL_DECREE, weight: 0.5 },
            { item: ITEMS.COMETSTONE_BELT, weight: 1 }
        ]
    },
    THE_LIVING_CONSTELLATION: {
        name: "The Living Constellation",
        image: "images/monsters/the_living_constellation.png",
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.HALO_OF_LIGHT, weight: 5 },
            { item: ITEMS.CELESTIAL_DECREE, weight: 2 },
            { item: ITEMS.STARWHALE_TALISMAN, weight: 5 }
        ]
    },
    // --- Zone: The Empyrean Throne (Levels 1501-1600) ---
    SERAPH: {
        name: "Seraph",
        image: "images/monsters/seraph.png",
        dropChance: 30,
        lootTable: [
            { item: ITEMS.HEART_OF_A_STAR, weight: 1 },
            { item: ITEMS.CELESTIAL_DECREE, weight: 0.5 }
        ]
    },
    ARCHON: {
        name: "Archon",
        image: "images/monsters/archon.png",
        dropChance: 25,
        lootTable: [
            { item: ITEMS.HEART_OF_A_STAR, weight: 1 }
        ]
    },
    CELESTIAL_JUDGE: {
        name: "Celestial Judge",
        image: "images/monsters/celestial_judge.png",
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.CELESTIAL_DECREE, weight: 5 },
            { item: ITEMS.HEART_OF_A_STAR, weight: 5 }
        ]
    }
};