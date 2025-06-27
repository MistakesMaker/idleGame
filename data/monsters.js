// --- START OF FILE monsters.js ---

import { ITEMS } from './items.js';
import { GEMS } from './gems.js';

/*
* ====================================================================================
* MONSTER DEFINITION GUIDE
*
* This file organizes monsters by the ZONE in which they appear.
* This provides a clear "bestiary" for each part of the world.
*
* Each zone has its own constant object (e.g., greenMeadowsMonsters).
* At the bottom, all these objects are merged into a single, flat 'MONSTERS' export.
* This allows the game logic (especially realms.js) to access monsters like
* MONSTERS.SLIME without needing to know which zone it came from, requiring
* NO logic changes.
*
* When adding a new monster, place it in the constant for its zone.
* ====================================================================================
*/

// ====================================================================================
// --- Green Meadows Zone Monsters (Levels 1-100) ---
// ====================================================================================
const greenMeadowsMonsters = {
    // --- Sub-Zone: Verdant Fields (Levels 1-24) ---
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
    WILD_BOAR: {
        name: 'Wild Boar',
        image: 'images/monsters/wild_boar.png',
        dropChance: 20,
        lootTable: [
            { item: ITEMS.LEATHER_TROUSERS, weight: 1 },
            { item: ITEMS.SIMPLE_SASH, weight: 1 },
        ]
    },

    // --- Sub-Zone: General's Outpost (Boss Lvl 25) ---
    SLIME_GENERAL: {
        name: 'Slime General',
        image: 'images/monsters/slime_general.png',
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.GLADIATORS_LONGSWORD, weight: 10 },
            { item: ITEMS.STEEL_LONGSWORD, weight: 20 },
            { item: ITEMS.IRON_KITESHIELD, weight: 20 },
            { item: ITEMS.VISAGE_OF_THE_ABYSS, weight: 1 },
        ]
    },

    // --- Sub-Zone: Whispering Woods (Levels 26-49) ---
    WOLF: {
        name: 'Wolf',
        image: 'images/monsters/wolf.png',
        dropChance: 20,
        lootTable: [
            { item: ITEMS.LEATHER_TUNIC, weight: 10 },
            { item: ITEMS.STUDDED_LEATHER_BELT, weight: 1 },
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
    GIANT_SPIDER: {
        name: 'Giant Spider',
        image: 'images/monsters/giant_spider.png',
        dropChance: 22,
        lootTable: [
            { item: ITEMS.CHAINMAIL_HAUBERK, weight: 1 },
            { item: ITEMS.CHAINMAIL_LEGGINGS, weight: 1 },
            { item: ITEMS.BRONZE_BUCKLER, weight: 1 },
        ]
    },

    // --- Sub-Zone: Sun-dappled Hills (Levels 51-74) ---
    TREANT_SPROUT: {
        name: 'Treant Sprout',
        image: 'images/monsters/treant_sprout.png',
        dropChance: 28,
        lootTable: [
            { item: ITEMS.WOODEN_SHIELD, weight: 8 },
            { item: ITEMS.MIGHTY_BELT, weight: 2 },
        ]
    },
    HOBGOBLIN: {
        name: 'Hobgoblin',
        image: 'images/monsters/hobgoblin.png',
        dropChance: 30,
        lootTable: [
            { item: ITEMS.IRON_HELM, weight: 5 },
            { item: ITEMS.IRON_PLATELEGS, weight: 5 },
            { item: ITEMS.IRON_SHORTSWORD, weight: 2 },
        ]
    },
    FOREST_SPRITE: {
        name: 'Forest Sprite',
        image: 'images/monsters/forest_sprite.png',
        dropChance: 25,
        lootTable: [
            { item: ITEMS.SILVER_LOCKET, weight: 5 },
            { item: ITEMS.SILVER_RING, weight: 5 },
        ]
    },

    // --- Sub-Zone: Royal Vanguard (Boss Lvl 75) ---
    ROYAL_GRIFFIN: {
        name: 'Royal Griffin',
        image: 'images/monsters/griffin_chick.png', // Using chick image for now
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.AMULET_OF_POWER, weight: 10 },
            { item: ITEMS.RING_OF_WEALTH, weight: 10 },
            { item: ITEMS.AEGIS_OF_THE_GUARDIAN, weight: 5 },
            { item: ITEMS.BAND_OF_ETERNAL_SORROW, weight: 1 },
        ]
    },

    // --- Sub-Zone: Royal Hunting Grounds (Levels 76-99) ---
    GRIFFIN_CHICK: {
        name: 'Griffin Chick',
        image: 'images/monsters/griffin_chick.png',
        dropChance: 25,
        lootTable: [
            { item: ITEMS.AMULET_OF_POWER, weight: 1 },
            { item: ITEMS.RING_OF_WEALTH, weight: 1 },
        ]
    },

    // --- Sub-Zone: King's Castle (Boss Lvl 100) ---
    KING_OF_SLIMES: {
        name: 'King of Slimes',
        image: 'images/monsters/king_of_slimes.png',
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.ROYAL_CIRCLET, weight: 20 },
            { item: ITEMS.SEAL_OF_THE_KING, weight: 10 },
            { item: ITEMS.HEART_OF_THE_VOLCANO, weight: 1 },
            { item: ITEMS.STEEL_LONGSWORD, weight: 30 },
            { item: GEMS.BASE_EMERALD, weight: 39 },
        ]
    },
};

// ====================================================================================
// --- Orc Volcano Zone Monsters (Levels 101-200) ---
// ====================================================================================
const orcVolcanoMonsters = {
    // --- Sub-Zone: Ashfall Plains (Levels 101-124) ---
    ORC: {
        name: 'Orc',
        image: 'images/monsters/orc.png',
        dropChance: 25,
        lootTable: [
            { item: ITEMS.STEEL_LONGSWORD, weight: 2 },
            { item: ITEMS.IRON_PLATEBODY, weight: 2 },
            { item: ITEMS.MIGHTY_BELT, weight: 1 },
        ]
    },
    MAGMA_SLIME: {
        name: 'Magma Slime',
        image: 'images/monsters/magma_slime.png',
        dropChance: 22,
        lootTable: [
            { item: ITEMS.RUBY_AMULET, weight: 3 },
            { item: ITEMS.IRON_GIRDLE, weight: 7 },
        ]
    },

    // --- Sub-Zone: Orc Watchtower (Boss Lvl 125) ---
    GIANT_ORC: {
        name: 'Giant Orc',
        image: 'images/monsters/giant_orc.png',
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.BELT_OF_THE_GIANT, weight: 2 },
            { item: ITEMS.ORCISH_CLEAVER, weight: 2 },
            { item: ITEMS.TOWER_SHIELD, weight: 1 },
            { item: ITEMS.STEEL_PLATEMAIL, weight: 2 },
        ]
    },

    // --- Sub-Zone: Scorched Path (Levels 126-149) ---
    ORC_SHAMAN: {
        name: 'Orc Shaman',
        image: 'images/monsters/orc_shaman.png',
        dropChance: 28,
        lootTable: [
            { item: ITEMS.MAGE_HOOD, weight: 3 },
            { item: ITEMS.SAPPHIRE_AMULET, weight: 5 },
            { item: ITEMS.SASH_OF_THE_SORCERER, weight: 4 },
            { item: GEMS.BASE_RUBY, weight: 0.5 },
        ]
    },
    LAVA_TURTLE: {
        name: 'Lava Turtle',
        image: 'images/monsters/lava_turtle.png',
        dropChance: 35,
        lootTable: [
            { item: ITEMS.STEEL_HEATER, weight: 8 },
            { item: ITEMS.STEEL_FULL_HELM, weight: 6 },
        ]
    },

    // --- Sub-Zone: Molten Heart (Boss Lvl 150) ---
    MOLTEN_GUARDIAN: {
        name: 'Molten Guardian',
        image: 'images/monsters/obsidian_guardian.png', 
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.SUNSTONE_BUCKLE, weight: 15 },
            { item: ITEMS.STEEL_FULL_HELM, weight: 15 },
            { item: ITEMS.ORCISH_CLEAVER, weight: 10 },
            { item: GEMS.BASE_RUBY, weight: 10 },
        ]
    },

    // --- Sub-Zone: Charred Forest (Levels 151-174) ---
    FIRE_ELEMENTAL: {
        name: 'Fire Elemental',
        image: 'images/monsters/fire_elemental.png',
        dropChance: 30,
        lootTable: [
            { item: ITEMS.SUNSTONE_BUCKLE, weight: 1 },
            { item: GEMS.BASE_RUBY, weight: 1.5 },
        ]
    },
    SALAMANDER: {
        name: 'Salamander',
        image: 'images/monsters/salamander.png',
        dropChance: 25,
        lootTable: [
            { item: ITEMS.SERRATED_DAGGER, weight: 5 },
            { item: GEMS.BASE_SAPPHIRE, weight: 0.5 },
        ]
    },

    // --- Sub-Zone: Chieftain's Camp (Boss Lvl 175) ---
    OBSIDIAN_GOLEM: {
        name: 'Obsidian Golem',
        isBoss: true,
        image: 'images/monsters/obsidian_golem.png',
        dropChance: 33, // Note: This is a boss subzone but monster dropchance is not 100
        lootTable: [
            { item: ITEMS.OBSIDIAN_BAND, weight: 1 },
            { item: ITEMS.TOWER_SHIELD, weight: 1 },
        ]
    },
    
    // --- Sub-Zone: Volcano's Maw (Levels 176-199) ---
    ORC_BERSERKER: {
        name: 'Orc Berserker',
        image: 'images/monsters/orc_berserker.png',
        dropChance: 30,
        lootTable: [
            { item: ITEMS.ORCISH_CLEAVER, weight: 3 },
            { item: ITEMS.STEEL_PLATEMAIL, weight: 5 },
        ]
    },

    // --- Sub-Zone: Volcano Peak (Boss Lvl 200) ---
    RULER_OF_ORCS: {
        name: 'Ruler of Orcs',
        image: 'images/monsters/ruler_of_orcs.png',
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.HELM_OF_VALOR, weight: 10 },
            { item: ITEMS.OBSIDIAN_BAND, weight: 15 },
            { item: ITEMS.MITHRIL_SCIMITAR, weight: 20 },
            { item: GEMS.BASE_TOPAZ, weight: 8 },
        ]
    },
};

// ====================================================================================
// --- Undead Desert Zone Monsters (Levels 201-300) ---
// ====================================================================================
const undeadDesertMonsters = {
    // --- Sub-Zone: Lost Tombs (Levels 201-224) ---
    SKELETON: {
        name: 'Skeleton',
        image: 'images/monsters/skeleton.png',
        dropChance: 25,
        lootTable: [
            { item: ITEMS.MITHRIL_SCIMITAR, weight: 10 },
            { item: ITEMS.STEEL_GREAVES, weight: 8 },
            { item: GEMS.BASE_SAPPHIRE, weight: 0.2 }
        ]
    },
    VULTURE: {
        name: 'Vulture',
        image: 'images/monsters/vulture.png',
        dropChance: 20,
        lootTable: [
            { item: ITEMS.BAND_OF_MIGHT, weight: 5 },
            { item: ITEMS.RING_OF_WEALTH, weight: 2 },
        ]
    },

    // --- Sub-Zone: Mummy's Crypt (Boss Lvl 225) ---
    CURSED_MUMMY: {
        name: 'Cursed Mummy',
        image: 'images/monsters/cursed_mummy.png',
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.SANDSTRIDER_LEGGINGS, weight: 10 },
            { item: ITEMS.CARAPACE_OF_THE_SCARAB, weight: 10 },
            { item: ITEMS.AMULET_OF_THE_VIPER, weight: 15 },
            { item: GEMS.BASE_EMERALD, weight: 10 },
        ]
    },
    
    // --- Sub-Zone: Shifting Sands (Levels 226-249) ---
    ZOMBIE: {
        name: 'Zombie',
        image: 'images/monsters/zombie.png',
        dropChance: 25,
        lootTable: [
            { item: ITEMS.APPRENTICE_ROBE, weight: 10 },
            { item: ITEMS.MAGE_PANTS, weight: 8 },
        ]
    },
    GHOUL: {
        name: 'Ghoul',
        image: 'images/monsters/ghoul.png',
        dropChance: 28,
        lootTable: [
            { item: ITEMS.BONE_SHIELD, weight: 2 },
            { item: ITEMS.BAND_OF_AGILITY, weight: 5 },
        ]
    },

    // --- Sub-Zone: Cursed Pyramid (Boss Lvl 250) ---
    TOMB_ROBBER: {
        name: 'Tomb Robber',
        image: 'images/monsters/tomb_robber.png',
        isBoss: true,
        dropChance: 35, // Note: Boss subzone, but not 100% drop chance
        lootTable: [
            { item: ITEMS.RING_OF_WEALTH, weight: 8 },
            { item: ITEMS.GOLD_RING, weight: 6 },
            { item: ITEMS.EMERALD_CHARM, weight: 4 },
        ]
    },

    // --- Sub-Zone: Scorpion Nest (Levels 251-274) ---
    GIANT_SCORPION: {
        name: 'Giant Scorpion',
        image: 'images/monsters/giant_scorpion.png',
        dropChance: 30,
        lootTable: [
            { item: ITEMS.SPIKED_BULWARK, weight: 1 },
            { item: ITEMS.MITHRIL_CHAINMAIL, weight: 5 },
            { item: ITEMS.TOPAZ_TALISMAN, weight: 4 },
        ]
    },
    SKELETAL_ARCHER: {
        name: 'Skeletal Archer',
        image: 'images/monsters/skeletal_archer.png',
        dropChance: 28,
        lootTable: [
            { item: ITEMS.BONE_LEGPLATES, weight: 1 },
            { item: GEMS.BASE_AMETHYST, weight: 0.2 },
        ]
    },

    // --- Sub-Zone: Tomb of the Guardian (Boss Lvl 275) ---
    SAND_WRAITH: {
        name: 'Sand Wraith',
        image: 'images/monsters/sand_wraith.png',
        isBoss: true,
        dropChance: 32, // Note: Boss subzone, but not 100% drop chance
        lootTable: [
            { item: ITEMS.SANDSTRIDER_LEGGINGS, weight: 1 },
            { item: GEMS.BASE_TOPAZ, weight: 0.8 },
        ]
    },

    // --- Sub-Zone: The Sand Pit (Boss Lvl 300) ---
    GATEKEEPER_OF_THE_SANDS: {
        name: 'Gatekeeper of the Sands',
        image: 'images/monsters/gatekeeper_of_the_sands.png',
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.AEGIS_OF_THE_GUARDIAN, weight: 10 },
            { item: ITEMS.BLADE_OF_THE_SPECTRE, weight: 10 },
            { item: ITEMS.SIGNET_OF_THE_LEECH, weight: 15 },
            { item: GEMS.BASE_AMETHYST, weight: 5 },
        ]
    },
};

// ====================================================================================
// --- Final Dungeon Zone Monsters (Levels 301-400) ---
// ====================================================================================
const finalDungeonMonsters = {
    // --- Sub-Zone: The Gatehouse (Levels 301-324) ---
    GARGOYLE: {
        name: 'Gargoyle',
        image: 'images/monsters/gargoyle.png',
        dropChance: 30,
        lootTable: [
            { item: ITEMS.TOWER_SHIELD, weight: 3 },
            { item: ITEMS.STEEL_PLATEMAIL, weight: 5 },
            { item: ITEMS.BONE_LEGPLATES, weight: 2 },
        ]
    },
    IMP: {
        name: 'Imp',
        image: 'images/monsters/imp.png',
        dropChance: 25,
        lootTable: [
            { item: ITEMS.BLOODSTONE_PENDANT, weight: 1 },
            { item: ITEMS.RUBY_AMULET, weight: 5 },
            { item: GEMS.BASE_RUBY, weight: 0.6 },
        ]
    },
    // --- Sub-Zone: Demon Sentry (Boss Lvl 325) ---
    DEMON_SENTRY_BOSS: {
        name: 'Demon Sentry',
        image: 'images/monsters/demon_sentry.png', 
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.GREAVES_OF_HASTE, weight: 10 },
            { item: ITEMS.GHASTLY_ROBES, weight: 10 },
            { item: ITEMS.SHADOW_COWL, weight: 15 },
            { item: GEMS.BASE_AMETHYST, weight: 5 },
        ]
    },
    // --- Sub-Zone: Halls of Damnation (Levels 326-349) ---
    HELLHOUND: {
        name: 'Hellhound',
        image: 'images/monsters/hellhound.png',
        dropChance: 32,
        lootTable: [
            { item: ITEMS.OBSIDIAN_BAND, weight: 2 },
            { item: ITEMS.GREAVES_OF_HASTE, weight: 1 },
        ]
    },
    CULTIST: {
        name: 'Cultist',
        image: 'images/monsters/cultist.png',
        dropChance: 28,
        lootTable: [
            { item: ITEMS.GHASTLY_ROBES, weight: 1 },
            { item: ITEMS.SHADOW_COWL, weight: 1 },
            { item: GEMS.BASE_AMETHYST, weight: 0.2 },
        ]
    },
    // --- Sub-Zone: The Hellforge (Boss Lvl 350) ---
    HELLFORGE_GUARDIAN: {
        name: 'Hellforge Guardian',
        image: 'images/monsters/hellforge_demon.png',
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.MIRRORED_SHIELD, weight: 10 },
            { item: ITEMS.PLAGUE_STITCHED_CINCH, weight: 10 },
            { item: ITEMS.BLOODSTONE_PENDANT, weight: 15 },
            { item: GEMS.BASE_DIAMOND, weight: 5 }, // Assuming a future gem
        ]
    },
    // --- Sub-Zone: Brimstone Corridors (Levels 351-374) ---
    TOXIC_SULPHUR_GAS: {
        name: 'Toxic Sulphur Gas',
        image: 'images/monsters/toxic_sulphur_gas.png',
        dropChance: 26,
        lootTable: [
            { item: ITEMS.MIRRORED_SHIELD, weight: 1 },
            { item: ITEMS.PLAGUE_STITCHED_CINCH, weight: 1 },
            { item: GEMS.BASE_SAPPHIRE, weight: 0.5 },
            { item: GEMS.BASE_EMERALD, weight: 0.5 },
        ]
    },
    SUCCUBUS: {
        name: 'Succubus',
        image: 'images/monsters/succubus.png',
        dropChance: 35,
        lootTable: [
            { item: ITEMS.SIGNET_OF_THE_LEECH, weight: 1 },
            { item: ITEMS.BLOODSTONE_PENDANT, weight: 1 },
        ]
    },
    // --- Sub-Zone: Pit Lord's Arena (Boss Lvl 375) ---
    PIT_FIEND: {
        name: 'Pit Fiend',
        image: 'images/monsters/pit_fiend.png',
        isBoss: true,
        dropChance: 38, // Note: Boss subzone, but not 100% drop chance
        lootTable: [
            { item: ITEMS.DRAGONHIDE_VEST, weight: 1 },
            { item: ITEMS.DRAGONBONE_GREAVES, weight: 1 },
        ]
    },
    // --- Sub-Zone: Throne Approach (Levels 376-399) ---
    CHAOS_DEMON: {
        name: 'Chaos Demon',
        image: 'images/monsters/chaos_demon.png',
        dropChance: 40,
        lootTable: [
            { item: ITEMS.DRAGONFANG, weight: 1 },
            { item: ITEMS.DRAGONSCALE_WARD, weight: 1 },
        ]
    },
    // --- Sub-Zone: Archdemon's Lair (Boss Lvl 400) ---
    ARCHDEMON_OVERLORD: {
        name: 'Archdemon Overlord',
        image: 'images/boss.png', // Was bigboss.png, using a consistent one
        isBoss: true,
        dropChance: 100,
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
};

// ====================================================================================
// --- The Underdark Zone Monsters (Levels 401-700) ---
// ====================================================================================
const underdarkMonsters = {
    // --- Sub-Zone: Crystal Caverns (Levels 401-500) ---
    CRYSTAL_SPIDER: {
        name: 'Crystal Spider',
        image: 'images/monsters/crystal_spider.png',
        dropChance: 30,
        lootTable: [
            { item: ITEMS.TOPAZ_TALISMAN, weight: 5 },
            { item: GEMS.BASE_TOPAZ, weight: 1 },
        ]
    },
    DEEP_GNOME_MINER: {
        name: 'Deep Gnome Miner',
        image: 'images/monsters/deep_gnome_miner.png',
        dropChance: 35,
        lootTable: [
            { item: ITEMS.MITHRIL_CHAINMAIL, weight: 3 },
            { item: ITEMS.GOLD_RING, weight: 8 },
        ]
    },
    SHARD_SLIME: {
        name: 'Shard Slime',
        image: 'images/monsters/shard_slime.png',
        dropChance: 28,
        lootTable: [
            { item: ITEMS.SPIKED_BULWARK, weight: 1 },
            { item: GEMS.BASE_SAPPHIRE, weight: 0.8 },
        ]
    },
    CAVE_LURKER: {
        name: 'Cave Lurker',
        image: 'images/monsters/cave_lurker.png',
        dropChance: 32,
        lootTable: [
            { item: ITEMS.SHADOW_COWL, weight: 1 },
            { item: ITEMS.SERRATED_DAGGER, weight: 5 },
        ]
    },
    CRYSTALLINE_ELEMENTAL: {
        name: 'Crystalline Elemental',
        image: 'images/monsters/crystalline_elemental.png',
        dropChance: 40,
        lootTable: [
            { item: GEMS.BASE_RUBY, weight: 1 },
            { item: GEMS.BASE_SAPPHIRE, weight: 1 },
            { item: GEMS.BASE_EMERALD, weight: 1 },
            { item: GEMS.BASE_TOPAZ, weight: 1 },
        ]
    },
    CRYSTAL_GOLEM: {
        name: 'Crystal Golem',
        image: 'images/monsters/crystal_golem.png',
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.CROWN_OF_WISDOM, weight: 10 },
            { item: ITEMS.AEGIS_OF_THE_GUARDIAN, weight: 10 },
            { item: GEMS.BASE_SAPPHIRE, weight: 15 },
        ]
    },
    CRYSTAL_KING: {
        name: 'The Crystal King',
        image: 'images/monsters/crystal_king.png',
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.DRAGONBONE_HEADDRESS, weight: 10 },
            { item: ITEMS.MIRRORED_SHIELD, weight: 10 },
            { item: GEMS.BASE_AMETHYST, weight: 5 },
            { item: GEMS.BASE_TOPAZ, weight: 15 },
        ]
    },

    // --- Sub-Zone: Fungal Forest (Levels 501-600) ---
    MYCONID_SPOREKEEPER: {
        name: 'Myconid Sporekeeper',
        image: 'images/monsters/myconid_sporekeeper.png',
        dropChance: 30,
        lootTable: [
            { item: ITEMS.ROBE_OF_THE_ARCHMAGE, weight: 2 },
            { item: GEMS.BASE_EMERALD, weight: 1.2 },
        ]
    },
    SPORE_BAT: {
        name: 'Spore Bat',
        image: 'images/monsters/spore_bat.png',
        dropChance: 25,
        lootTable: [
            { item: ITEMS.PLAGUE_STITCHED_CINCH, weight: 1 },
            { item: ITEMS.AMULET_OF_THE_VIPER, weight: 1 },
        ]
    },
    FUNGAL_CRAWLER: {
        name: 'Fungal Crawler',
        image: 'images/monsters/fungal_crawler.png',
        dropChance: 28,
        lootTable: [
            { item: ITEMS.SANDSTRIDER_LEGGINGS, weight: 2 },
            // Studded leather belt was here, now moved to a lower level monster
        ]
    },
    GAS_SPORE: {
        name: 'Gas Spore',
        image: 'images/monsters/gas_spore.png',
        dropChance: 35,
        lootTable: [
            { item: ITEMS.GHASTLY_ROBES, weight: 1 },
            { item: GEMS.BASE_EMERALD, weight: 1.5 },
        ]
    },
    SHRIEKER: {
        name: 'Shrieker',
        image: 'images/monsters/shrieker.png',
        dropChance: 33,
        lootTable: [
            { item: ITEMS.GREAVES_OF_HASTE, weight: 1 },
            { item: ITEMS.BAND_OF_AGILITY, weight: 4 },
        ]
    },
    FUNGAL_BEHEMOTH: {
        name: 'Fungal Behemoth',
        image: 'images/monsters/fungal_behemoth.png',
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.BELT_OF_THE_GIANT, weight: 10 },
            { item: ITEMS.CARAPACE_OF_THE_SCARAB, weight: 10 },
            { item: GEMS.BASE_EMERALD, weight: 15 },
        ]
    },
    THE_GREAT_MYCELIUM: {
        name: 'The Great Mycelium',
        image: 'images/monsters/the_great_mycelium.png',
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.DRAGONHIDE_VEST, weight: 10 },
            { item: ITEMS.PLAGUE_STITCHED_CINCH, weight: 10 },
            { item: GEMS.BASE_AMETHYST, weight: 6 },
            { item: GEMS.BASE_EMERALD, weight: 15 },
        ]
    },

    // --- Sub-Zone: Drow City (Levels 601-700) ---
    DROW_WARRIOR: {
        name: 'Drow Warrior',
        image: 'images/monsters/drow_warrior.png',
        dropChance: 30,
        lootTable: [
            { item: ITEMS.MITHRIL_SCIMITAR, weight: 8 },
            { item: ITEMS.MITHRIL_CHAINMAIL, weight: 4 },
        ]
    },
    DROW_MAGE: {
        name: 'Drow Mage',
        image: 'images/monsters/drow_mage.png',
        dropChance: 35,
        lootTable: [
            { item: ITEMS.SHADOW_COWL, weight: 2 },
            { item: ITEMS.SASH_OF_THE_SORCERER, weight: 5 },
            { item: GEMS.BASE_AMETHYST, weight: 0.8 },
        ]
    },
    GIANT_CAVE_SPIDER: {
        name: 'Giant Cave Spider',
        image: 'images/monsters/giant_cave_spider.png',
        dropChance: 28,
        lootTable: [
            { item: ITEMS.AMULET_OF_THE_VIPER, weight: 1 },
            { item: ITEMS.BLOODSTONE_PENDANT, weight: 1 },
        ]
    },
    DRIDER: {
        name: 'Drider',
        image: 'images/monsters/drider.png',
        dropChance: 40,
        lootTable: [
            { item: ITEMS.BLADE_OF_THE_SPECTRE, weight: 2 },
            { item: ITEMS.GHASTLY_ROBES, weight: 1 },
        ]
    },
    SHADOW_STALKER: {
        name: 'Shadow Stalker',
        image: 'images/monsters/shadow_stalker.png',
        dropChance: 38,
        lootTable: [
            { item: ITEMS.SIGNET_OF_THE_LEECH, weight: 1 },
            { item: ITEMS.BAND_OF_MIGHT, weight: 5 },
            { item: GEMS.BASE_AMETHYST, weight: 1 },
        ]
    },
    DROW_PRIESTESS: {
        name: 'Drow Priestess',
        image: 'images/monsters/drow_priestess.png',
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.GHASTLY_ROBES, weight: 10 },
            { item: GEMS.BASE_AMETHYST, weight: 15 },
        ]
    },
    SPIDER_QUEEN_MATRON: {
        name: 'Spider Queen Matron',
        image: 'images/monsters/spider_queen_matron.png',
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.DRAGONFIRE_LOOP, weight: 10 },
            { item: ITEMS.EYE_OF_THE_DRAGON, weight: 10 },
            { item: ITEMS.BLADE_OF_THE_SPECTRE, weight: 15 },
            { item: GEMS.BASE_AMETHYST, weight: 20 },
        ]
    },
};

// ====================================================================================
// --- Special & Generic Monsters ---
// ====================================================================================
const otherMonsters = {
    GOLDEN_SLIME: {
        id: 'GOLDEN_SLIME',
        name: 'Golden Slime',
        image: 'images/monsters/golden_slime.png',
        dropChance: 0, // No item drops
        lootTable: [],
        isSpecial: true,
        background: 'images/backgrounds/bg_golden_slime.png'
    },
    DUNGEON_GUARDIAN: {
        name: 'Dungeon Guardian',
        image: 'images/boss.png',
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.RUNIC_BLADE, weight: 10 },
            { item: ITEMS.GIRDLE_OF_COLOSSAL_STRENGTH, weight: 1 },
            { item: ITEMS.TOWER_SHIELD, weight: 20 },
            { item: GEMS.BASE_EMERALD, weight: 8 },
            { item: GEMS.BASE_TOPAZ, weight: 8 }
        ]
    },
};

// ====================================================================================
// --- Master Export ---
// ====================================================================================

/**
 * The master list of all monsters in the game.
 * It's a single, flat object, merged from the zone-specific objects above.
 * This makes it easy for the game logic to access any monster by its ID
 * without needing to know which zone it's from.
 */
export const MONSTERS = {
    ...greenMeadowsMonsters,
    ...orcVolcanoMonsters,
    ...undeadDesertMonsters,
    ...finalDungeonMonsters,
    ...underdarkMonsters,
    ...otherMonsters
};