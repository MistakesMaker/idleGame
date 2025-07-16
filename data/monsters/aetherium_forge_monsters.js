// --- START OF FILE data/monsters/aetherium_forge_monsters.js ---

import { ITEMS } from '../items.js';
import { GEMS } from '../gems.js';

export const aetheriumForgeMonsters = {
    // --- Zone: Mana Wastes (Levels 1601-1700) ---
    MANA_WRAITH: {
        name: "Mana Wraith",
        image: "images/monsters/mana_wraith.png",
        dropChance: 30,
        lootTable: [
            { item: ITEMS.REALITY_CUTTER, weight: 1 },
            { item: ITEMS.CLOCKWORK_PAULDRONS, weight: 1 },
            { item: ITEMS.AUTOMATONS_EYE, weight: 1 }
        ]
    },
    CHAOS_SPAWN: {
        name: "Chaos Spawn",
        image: "images/monsters/chaos_spawn.png",
        dropChance: 25,
        lootTable: [
            { item: ITEMS.BAND_OF_INFINITE_POTENTIAL, weight: 1 },
            { item: ITEMS.MANAWEAVE_LEGGINGS, weight: 1 }
        ]
    },
    GUARDIAN_AUTOMATON: {
        name: "Guardian Automaton",
        image: "images/monsters/guardian_automaton.png",
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.REALITY_CUTTER, weight: 5 },
            { item: ITEMS.CLOCKWORK_PAULDRONS, weight: 5 },
            { item: ITEMS.MANAWEAVE_LEGGINGS, weight: 5 }
        ]
    },
    // --- Zone: Clockwork City (Levels 1701-1800) ---
    LIVING_SPELLBOOK: {
        name: "Living Spellbook",
        image: "images/monsters/living_spellbook.png",
        dropChance: 30,
        lootTable: [
            { item: ITEMS.RUNEFORGED_LEGGINGS, weight: 1 },
            { item: ITEMS.BAND_OF_INFINITE_POTENTIAL, weight: 1 },
            { item: ITEMS.SCROLL_OF_POWER, weight: 1 }
        ]
    },
    RUNE_GOLEM: {
        name: "Rune Golem",
        image: "images/monsters/rune_golem.png",
        dropChance: 25,
        lootTable: [
            { item: ITEMS.AEGIS_OF_THE_MAKER, weight: 1 },
            { item: ITEMS.HELM_OF_FORBIDDEN_KNOWLEDGE, weight: 1 }
        ]
    },
    THE_LIBRARIAN: {
        name: "The Librarian",
        image: "images/monsters/the_librarian.png",
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.RUNEFORGED_LEGGINGS, weight: 5 },
            { item: ITEMS.AEGIS_OF_THE_MAKER, weight: 5 },
            { item: ITEMS.SCROLL_OF_POWER, weight: 5 }
        ]
    },
    // --- Zone: Rune Scriptorium (Levels 1801-1900) ---
    AETHER_ELEMENTAL: {
        name: "Aether Elemental",
        image: "images/monsters/aether_elemental.png",
        dropChance: 30,
        lootTable: [
            { item: ITEMS.CROWN_OF_THE_ARCHITECT, weight: 1 },
            { item: ITEMS.AEGIS_OF_THE_MAKER, weight: 1 },
            { item: ITEMS.NEXUS_SHARD_PENDANT, weight: 1 }
        ]
    },
    NEXUS_STALKER: {
        name: "Nexus Stalker",
        image: "images/monsters/nexus_stalker.png",
        dropChance: 25,
        lootTable: [
            { item: ITEMS.THE_UNMAKER, weight: 0.5 },
            { item: ITEMS.AETHERIUM_WEAVE_ROBES, weight: 1 }
        ]
    },
    THE_FORGEMASTER: {
        name: "The Forgemaster",
        image: "images/monsters/the_forgemaster.png",
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.CROWN_OF_THE_ARCHITECT, weight: 5 },
            { item: ITEMS.THE_UNMAKER, weight: 2 },
            { item: ITEMS.AETHERIUM_WEAVE_ROBES, weight: 5 }
        ]
    },
    // --- Zone: Nexus of Creation (Levels 1901-2000) ---
    PRIMORDIAL_BEING: {
        name: "Primordial Being",
        image: "images/monsters/primordial_being.png",
        dropChance: 30,
        lootTable: [
            { item: ITEMS.THE_FIRST_SPARK, weight: 1 },
            { item: ITEMS.THE_UNMAKER, weight: 0.5 }
        ]
    },
    ECHO_OF_CREATION: {
        name: "Echo of Creation",
        image: "images/monsters/echo_of_creation.png",
        dropChance: 25,
        lootTable: [
            { item: ITEMS.THE_FIRST_SPARK, weight: 1 }
        ]
    },
    THE_FIRST_SENTIENCE: {
        name: "The First Sentience",
        image: "images/monsters/the_first_sentience.png",
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.THE_UNMAKER, weight: 5 },
            { item: ITEMS.THE_FIRST_SPARK, weight: 5 }
        ]
    }
};