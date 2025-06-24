import { ITEMS } from './items.js';
import { GEMS } from './gems.js';

/*
* MONSTER LOOT TABLE GUIDE
*
* lootTable: An array of possible drops for a monster.
*   - When a monster is defeated, it first rolls its `dropChance`.
*   - If successful, it then processes this `lootTable` to pick one item.
*
* Each entry in the lootTable is an object with two properties:
*   - item: A reference to a specific item from data/items.js or data/gems.js.
*   - weight: A number representing how common this drop is. Higher numbers are more common.
*
* The system adds up all weights and picks a random number in that range to select a drop.
* Example: weight 1 and weight 99. Total weight is 100.
*   - Item 1 has a 1/100 (1%) chance to drop.
*   - Item 2 has a 99/100 (99%) chance to drop.
*/

export const MONSTERS = {

    // ====================================================================================
    // --- Green Meadows Monsters (Levels 1-20) ---
    // ====================================================================================
    SLIME: {
        name: 'Slime',
        image: 'images/monsters/slime.png',
        dropChance: 20,
        lootTable: [
            { item: ITEMS.RUSTY_SWORD, weight: 1 },
            { item: ITEMS.LEATHER_CAP, weight: 1 },
            { item: ITEMS.LEATHER_TUNIC, weight: 1 },
        ]
    },
    GOBLIN: {
        name: 'Goblin',
        image: 'images/monsters/goblin.png',
        dropChance: 20,
        lootTable: [
            { item: ITEMS.IRON_SHORTSWORD, weight: 1 },
            { item: ITEMS.WOODEN_SHIELD, weight: 1 },
            { item: ITEMS.LEATHER_BELT, weight: 1 },
        ]
    },
    BAT: {
        name: 'Bat',
        image: 'images/monsters/bat.png',
        dropChance: 20,
        lootTable: [
            { item: ITEMS.SIMPLE_PENDANT, weight: 1 },
            { item: ITEMS.IRON_RING, weight: 1 },
        ]
    },

    WILD_BOAR: {
        name: 'Wild Boar',
        image: 'images/monsters/wild_boar.png', 
        dropChance: 20,
        lootTable: [
            { item: ITEMS.LEATHER_TROUSERS, weight: 1 },
            { item: ITEMS.SIMPLE_SASH, weight: 1 },
        ]
    },
    WOLF: {
        name: 'Wolf',
        image: 'images/monsters/wolf.png', 
        dropChance: 20,
        lootTable: [
            { item: ITEMS.SERRATED_DAGGER, weight: 2 },
            { item: ITEMS.LEATHER_TUNIC, weight: 10 },
        ]
    },
    SLIME_GENERAL: {
        name: 'Slime General',
        image: 'images/monsters/slime_general.png',
        dropChance: 100,
        lootTable: [
            { item: ITEMS.GLADIATORS_LONGSWORD, weight: 10 },
            { item: ITEMS.STEEL_LONGSWORD, weight: 20 },
            { item: ITEMS.IRON_KITESHIELD, weight: 20 },
            { item: ITEMS.CHAINMAIL_HAUBERK, weight: 15 },
        ]
    },
    KING_OF_SLIMES: {
        name: 'King of Slimes',
        image: 'images/monsters/king_of_slimes.png',
        dropChance: 100,
        lootTable: [
            { item: ITEMS.ROYAL_CIRCLET, weight: 10 },
            { item: ITEMS.SEAL_OF_THE_KING, weight: 5 },
            { item: ITEMS.GOLD_RING, weight: 20 },
            { item: ITEMS.STEEL_LONGSWORD, weight: 15 },
            { item: GEMS.BASE_EMERALD, weight: 8 },
        ]
    },

    // ====================================================================================
    // --- Orc Volcano Monsters (Levels 21-40) ---
    // ====================================================================================
    ORC: {
        name: 'Orc',
        image: 'images/monsters/orc.png',
        dropChance: 3.5,
        lootTable: [
            { item: ITEMS.STEEL_LONGSWORD, weight: 2 },
            { item: ITEMS.IRON_PLATEBODY, weight: 2 },
            { item: ITEMS.MIGHTY_BELT, weight: 1 },
        ]
    },
    // --- NEW VOLCANO MONSTERS ---
    ORC_SHAMAN: {
        name: 'Orc Shaman',
        image: 'images/monsters/orc_shaman.png', 
        dropChance: 4.0,
        lootTable: [
            { item: ITEMS.MAGE_HOOD, weight: 3 },
            { item: ITEMS.SAPPHIRE_AMULET, weight: 5 },
            { item: ITEMS.SASH_OF_THE_SORCERER, weight: 4 },
            { item: GEMS.BASE_RUBY, weight: 0.5 },
        ]
    },
    MAGMA_SLIME: {
        name: 'Magma Slime',
        image: 'images/monsters/magma_slime.png', 
        dropChance: 3.0,
        lootTable: [
            { item: ITEMS.RUBY_AMULET, weight: 3 },
            { item: ITEMS.IRON_GIRDLE, weight: 7 },
        ]
    },
    GIANT_ORC: {
        name: 'Giant Orc',
        image: 'images/monsters/giant_orc.png',
        dropChance: 25,
        lootTable: [
            { item: ITEMS.BELT_OF_THE_GIANT, weight: 2 },
            { item: ITEMS.ORCISH_CLEAVER, weight: 2 },
            { item: ITEMS.TOWER_SHIELD, weight: 1 },
            { item: ITEMS.STEEL_PLATEMAIL, weight: 2 },
        ]
    },
    RULER_OF_ORCS: {
        name: 'Ruler of Orcs',
        image: 'images//monsters/ruler_of_orcs.png',
        dropChance: 50,
        lootTable: [
            { item: ITEMS.RUNIC_BLADE, weight: 10 },
            { item: ITEMS.HELM_OF_VALOR, weight: 10 },
            { item: ITEMS.OBSIDIAN_BAND, weight: 15 },
            { item: ITEMS.MITHRIL_SCIMITAR, weight: 20 },
            { item: GEMS.BASE_TOPAZ, weight: 8 },
        ]
    },

    // ====================================================================================
    // --- Undead Desert Monsters (Levels 41-60) ---
    // ====================================================================================
    SKELETON: {
        name: 'Skeleton',
        image: 'images/monsters/skeleton.png',
        dropChance: 3.0,
        lootTable: [
            { item: ITEMS.MITHRIL_SCIMITAR, weight: 10 },
            { item: ITEMS.STEEL_GREAVES, weight: 8 },
            { item: GEMS.BASE_SAPPHIRE, weight: 0.2 }
        ]
    },
    ZOMBIE: {
        name: 'Zombie',
        image: 'images/monsters/zombie.png',
        dropChance: 3.0,
        lootTable: [
            { item: ITEMS.APPRENTICE_ROBE, weight: 10 },
            { item: ITEMS.MAGE_PANTS, weight: 8 },
        ]
    },
    // --- NEW DESERT MONSTERS ---
    GHOUL: {
        name: 'Ghoul',
        image: 'images/monsters/ghoul.png', 
        dropChance: 3.5,
        lootTable: [
            { item: ITEMS.BONE_SHIELD, weight: 2 },
            { item: ITEMS.BAND_OF_AGILITY, weight: 5 },
        ]
    },
    GIANT_SCORPION: {
        name: 'Giant Scorpion',
        image: 'images/monsters/giant_scorpion.png', 
        dropChance: 4.0,
        lootTable: [
            { item: ITEMS.SPIKED_BULWARK, weight: 1 },
            { item: ITEMS.MITHRIL_CHAINMAIL, weight: 5 },
            { item: ITEMS.TOPAZ_TALISMAN, weight: 4 },
        ]
    },
    CURSED_MUMMY: {
        name: 'Cursed Mummy',
        image: 'images/monsters/cursed_mummy.png',
        dropChance: 100,
        lootTable: [
            { item: ITEMS.SANDSTRIDER_LEGGINGS, weight: 10 },
            { item: ITEMS.CARAPACE_OF_THE_SCARAB, weight: 10 },
            { item: ITEMS.AMULET_OF_THE_VIPER, weight: 15 },
            { item: GEMS.BASE_EMERALD, weight: 10 },
        ]
    },
    GATEKEEPER_OF_THE_SANDS: {
        name: 'Gatekeeper of the Sands',
        image: 'images/monsters/gatekeeper_of_the_sands.png',
        dropChance: 100,
        lootTable: [
            { item: ITEMS.AEGIS_OF_THE_GUARDIAN, weight: 10 },
            { item: ITEMS.BLADE_OF_THE_SPECTRE, weight: 10 },
            { item: ITEMS.SIGNET_OF_THE_LEECH, weight: 15 },
            { item: GEMS.BASE_AMETHYST, weight: 5 },
        ]
    },
    
    // ====================================================================================
    // --- Final Dungeon Monsters (Levels 61-100) ---
    // ====================================================================================
    // --- NEW DUNGEON MONSTERS ---
    GARGOYLE: {
        name: 'Gargoyle',
        image: 'images/monsters/gargoyle.png', 
        dropChance: 4.0,
        lootTable: [
            { item: ITEMS.TOWER_SHIELD, weight: 3 },
            { item: ITEMS.STEEL_PLATEMAIL, weight: 5 },
            { item: ITEMS.BONE_LEGPLATES, weight: 2 },
        ]
    },
    IMP: {
        name: 'Imp',
        image: 'images/monsters/imp.png', 
        dropChance: 3.5,
        lootTable: [
            { item: ITEMS.BLOODSTONE_PENDANT, weight: 1 },
            { item: ITEMS.RUBY_AMULET, weight: 5 },
            { item: GEMS.BASE_RUBY, weight: 0.6 },
        ]
    },
    HELLHOUND: {
        name: 'Hellhound',
        image: 'images/monsters/hellhound.png', 
        dropChance: 4.5,
        lootTable: [
            { item: ITEMS.OBSIDIAN_BAND, weight: 2 },
            { item: ITEMS.GREAVES_OF_HASTE, weight: 1 },
        ]
    },
    CULTIST: {
        name: 'Cultist',
        image: 'images/monsters/cultist.png', 
        dropChance: 4.0,
        lootTable: [
            { item: ITEMS.GHASTLY_ROBES, weight: 1 },
            { item: ITEMS.SHADOW_COWL, weight: 1 },
            { item: GEMS.BASE_AMETHYST, weight: 0.2 },
        ]
    },
    TOXIC_SULPHUR_GAS: {
        name: 'Toxic Sulphur Gas',
        image: 'images/monsters/toxic_sulphur_gas.png',
        dropChance: 4.0,
        lootTable: [
            { item: ITEMS.MIRRORED_SHIELD, weight: 1 },
            { item: ITEMS.PLAGUE_STITCHED_CINCH, weight: 1 },
            { item: GEMS.BASE_SAPPHIRE, weight: 0.5 },
            { item: GEMS.BASE_EMERALD, weight: 0.5 },
        ]
    },
    ARCHDEMON_OVERLORD: {
        name: 'Archdemon Overlord',
        image: 'images/monsters/bigboss.png',
        dropChance: 50,
        lootTable: [
            { item: ITEMS.DRAGONFANG, weight: 10 },
            { item: ITEMS.DRAGONSCALE_WARD, weight: 10 },
            { item: ITEMS.DRAGONBONE_HEADDRESS, weight: 10 },
            { item: ITEMS.DRAGONHIDE_VEST, weight: 10 },
            { item: ITEMS.DRAGONBONE_GREAVES, weight: 10 },
            { item: ITEMS.EYE_OF_THE_DRAGON, weight: 10 },
            { item: ITEMS.DRAGONFIRE_LOOP, weight: 10 },
            { item: ITEMS.DRAGONSCALE_BELT, weight: 10 },
            { item: GEMS.BASE_AMETHYST, weight: 1 }
        ]
    },

    // A generic boss template for other zones until they get unique monsters
    DUNGEON_GUARDIAN: {
        name: 'Dungeon Guardian',
        image: 'images/boss.png',
        dropChance: 50,
        lootTable: [
            { item: ITEMS.RUNIC_BLADE, weight: 10 },
            { item: ITEMS.AMULET_OF_POWER, weight: 10 },
            { item: ITEMS.AEGIS_OF_THE_GUARDIAN, weight: 10 },
            { item: ITEMS.TOWER_SHIELD, weight: 20 },
            { item: GEMS.BASE_EMERALD, weight: 8 },
            { item: GEMS.BASE_TOPAZ, weight: 8 }
        ]
    },
};