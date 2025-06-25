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
    // --- Green Meadows Monsters (Levels 1-100) ---
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
    FOREST_SPRITE: {
        name: 'Forest Sprite',
        image: 'images/monsters/forest_sprite.png', 
        dropChance: 25,
        lootTable: [
            { item: ITEMS.SILVER_LOCKET, weight: 5 },
            { item: ITEMS.SILVER_RING, weight: 5 },
        ]
    },
    GIANT_SPIDER: {
        name: 'Giant Spider',
        image: 'images/monsters/giant_spider.png', 
        dropChance: 22,
        lootTable: [
            { item: ITEMS.CHAINMAIL_HAUBERK, weight: 1 },
            { item: ITEMS.CHAINMAIL_LEGGINGS, weight: 1 },
        ]
    },
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
    GRIFFIN_CHICK: {
        name: 'Griffin Chick',
        image: 'images/monsters/griffin_chick.png', 
        dropChance: 25,
        lootTable: [
            { item: ITEMS.AMULET_OF_POWER, weight: 1 },
            { item: ITEMS.RING_OF_WEALTH, weight: 1 },
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
            { item: ITEMS.VISAGE_OF_THE_ABYSS, weight: 5 },
        ]
    },
    KING_OF_SLIMES: {
        name: 'King of Slimes',
        image: 'images/monsters/king_of_slimes.png',
        dropChance: 100,
        lootTable: [
            { item: ITEMS.ROYAL_CIRCLET, weight: 10 },
            { item: ITEMS.SEAL_OF_THE_KING, weight: 5 },
            { item: ITEMS.HEART_OF_THE_VOLCANO, weight: 5 },
            { item: ITEMS.STEEL_LONGSWORD, weight: 15 },
            { item: GEMS.BASE_EMERALD, weight: 8 },
        ]
    },
    ROYAL_GRIFFIN: {
        name: 'Royal Griffin',
        image: 'images/monsters/griffin_chick.png', // Using chick image for now
        dropChance: 100,
        isBoss: true,
        lootTable: [
            { item: ITEMS.AMULET_OF_POWER, weight: 10 },
            { item: ITEMS.RING_OF_WEALTH, weight: 10 },
            { item: ITEMS.BAND_OF_ETERNAL_SORROW, weight: 5 },
        ]
    },

    // ====================================================================================
    // --- Special Monsters ---
    // ====================================================================================
    GOLDEN_SLIME: {
        id: 'GOLDEN_SLIME',
        name: 'Golden Slime',
        image: 'images/monsters/golden_slime.png',
        dropChance: 0, // No item drops
        lootTable: [],
        isSpecial: true,
    },

    // ====================================================================================
    // --- Orc Volcano Monsters (Levels 101-200) ---
    // ====================================================================================
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
    MAGMA_SLIME: {
        name: 'Magma Slime',
        image: 'images/monsters/magma_slime.png', 
        dropChance: 22,
        lootTable: [
            { item: ITEMS.RUBY_AMULET, weight: 3 },
            { item: ITEMS.IRON_GIRDLE, weight: 7 },
        ]
    },
    FIRE_ELEMENTAL: {
        name: 'Fire Elemental',
        image: 'images/monsters/fire_elemental.png', 
        dropChance: 30,
        lootTable: [
            { item: ITEMS.SUNSTONE_BUCKLE, weight: 1 },
            { item: GEMS.BASE_RUBY, weight: 1.5 },
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
    SALAMANDER: {
        name: 'Salamander',
        image: 'images/monsters/salamander.png', 
        dropChance: 25,
        lootTable: [
            { item: ITEMS.SERRATED_DAGGER, weight: 5 },
            { item: GEMS.BASE_SAPPHIRE, weight: 0.5 },
        ]
    },
    OBSIDIAN_GOLEM: {
        name: 'Obsidian Golem',
        image: 'images/monsters/obsidian_golem.png', 
        dropChance: 33,
        lootTable: [
            { item: ITEMS.OBSIDIAN_BAND, weight: 1 },
            { item: ITEMS.TOWER_SHIELD, weight: 1 },
        ]
    },
    ORC_BERSERKER: {
        name: 'Orc Berserker',
        image: 'images/monsters/orc_berserker.png', 
        dropChance: 30,
        lootTable: [
            { item: ITEMS.ORCISH_CLEAVER, weight: 3 },
            { item: ITEMS.STEEL_PLATEMAIL, weight: 5 },
        ]
    },
    GIANT_ORC: {
        name: 'Giant Orc',
        image: 'images/monsters/giant_orc.png',
        dropChance: 100,
        lootTable: [
            { item: ITEMS.BELT_OF_THE_GIANT, weight: 2 },
            { item: ITEMS.ORCISH_CLEAVER, weight: 2 },
            { item: ITEMS.TOWER_SHIELD, weight: 1 },
            { item: ITEMS.STEEL_PLATEMAIL, weight: 2 },
        ]
    },
    RULER_OF_ORCS: {
        name: 'Ruler of Orcs',
        image: 'images/monsters/ruler_of_orcs.png',
        dropChance: 100,
        lootTable: [
            { item: ITEMS.RUNIC_BLADE, weight: 10 },
            { item: ITEMS.HELM_OF_VALOR, weight: 10 },
            { item: ITEMS.OBSIDIAN_BAND, weight: 15 },
            { item: ITEMS.MITHRIL_SCIMITAR, weight: 20 },
            { item: GEMS.BASE_TOPAZ, weight: 8 },
        ]
    },

    // ====================================================================================
    // --- Undead Desert Monsters (Levels 201-300) ---
    // ====================================================================================
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
    SAND_WRAITH: {
        name: 'Sand Wraith',
        image: 'images/monsters/sand_wraith.png', 
        dropChance: 32,
        lootTable: [
            { item: ITEMS.SANDSTRIDER_LEGGINGS, weight: 1 },
            { item: GEMS.BASE_TOPAZ, weight: 0.8 },
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
    SKELETAL_ARCHER: {
        name: 'Skeletal Archer',
        image: 'images/monsters/skeletal_archer.png', 
        dropChance: 28,
        lootTable: [
            { item: ITEMS.BONE_LEGPLATES, weight: 1 },
            { item: GEMS.BASE_AMETHYST, weight: 0.2 },
        ]
    },
    TOMB_ROBBER: {
        name: 'Tomb Robber',
        image: 'images/monsters/tomb_robber.png', 
        dropChance: 35,
        lootTable: [
            { item: ITEMS.RING_OF_WEALTH, weight: 8 },
            { item: ITEMS.GOLD_RING, weight: 6 },
            { item: ITEMS.EMERALD_CHARM, weight: 4 },
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
    // --- Final Dungeon Monsters (Levels 301-400) ---
    // ====================================================================================
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
    PIT_FIEND: {
        name: 'Pit Fiend',
        image: 'images/monsters/pit_fiend.png', 
        dropChance: 38,
        lootTable: [
            { item: ITEMS.DRAGONHIDE_VEST, weight: 1 },
            { item: ITEMS.DRAGONBONE_GREAVES, weight: 1 },
        ]
    },
    CHAOS_DEMON: {
        name: 'Chaos Demon',
        image: 'images/monsters/chaos_demon.png', 
        dropChance: 40,
        lootTable: [
            { item: ITEMS.DRAGONFANG, weight: 1 },
            { item: ITEMS.DRAGONSCALE_WARD, weight: 1 },
        ]
    },
    ARCHDEMON_OVERLORD: {
        name: 'Archdemon Overlord',
        image: 'images/monsters/bigboss.png',
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

    // ====================================================================================
    // --- Crystal Caverns Monsters (Levels 401-500) ---
    // ====================================================================================
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
        dropChance: 100,
        lootTable: [
            { item: ITEMS.DRAGONBONE_HEADDRESS, weight: 10 },
            { item: ITEMS.MIRRORED_SHIELD, weight: 10 },
            { item: GEMS.BASE_AMETHYST, weight: 5 },
            { item: GEMS.BASE_TOPAZ, weight: 15 },
        ]
    },

    // ====================================================================================
    // --- Fungal Forest Monsters (Levels 501-600) ---
    // ====================================================================================
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
            { item: ITEMS.STUDDED_LEATHER_BELT, weight: 8 },
        ]
    },
    GAS_SPORE: {
        name: 'Gas Spore',
        image: 'images/monsters/gas_spore.png',
        dropChance: 35,
        lootTable: [
            { item: ITEMS.TOXIC_SULPHUR_GAS, weight: 0 }, // This is a monster name, not an item. Using a fitting item instead.
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
        dropChance: 100,
        lootTable: [
            { item: ITEMS.DRAGONHIDE_VEST, weight: 10 },
            { item: ITEMS.PLAGUE_STITCHED_CINCH, weight: 10 },
            { item: GEMS.BASE_AMETHYST, weight: 6 },
            { item: GEMS.BASE_EMERALD, weight: 15 },
        ]
    },

    // ====================================================================================
    // --- Drow City Monsters (Levels 601-700) ---
    // ====================================================================================
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
        dropChance: 100,
        lootTable: [
            { item: ITEMS.RUNIC_BLADE, weight: 10 },
            { item: ITEMS.GHASTLY_ROBES, weight: 10 },
            { item: GEMS.BASE_AMETHYST, weight: 15 },
        ]
    },
    SPIDER_QUEEN_MATRON: {
        name: 'Spider Queen Matron',
        image: 'images/monsters/spider_queen_matron.png',
        dropChance: 100,
        lootTable: [
            { item: ITEMS.DRAGONFIRE_LOOP, weight: 10 },
            { item: ITEMS.EYE_OF_THE_DRAGON, weight: 10 },
            { item: ITEMS.BLADE_OF_THE_SPECTRE, weight: 15 },
            { item: GEMS.BASE_AMETHYST, weight: 20 },
        ]
    },

    // A generic boss template for other zones until they get unique monsters
    DUNGEON_GUARDIAN: {
        name: 'Dungeon Guardian',
        image: 'images/boss.png',
        dropChance: 100,
        lootTable: [
            { item: ITEMS.RUNIC_BLADE, weight: 10 },
            { item: ITEMS.GIRDLE_OF_COLOSSAL_STRENGTH, weight: 5 },
            { item: ITEMS.AEGIS_OF_THE_GUARDIAN, weight: 10 },
            { item: ITEMS.TOWER_SHIELD, weight: 20 },
            { item: GEMS.BASE_EMERALD, weight: 8 },
            { item: GEMS.BASE_TOPAZ, weight: 8 }
        ]
    },
};