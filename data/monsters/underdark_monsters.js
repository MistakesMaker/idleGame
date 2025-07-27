// --- START OF FILE data/monsters/underdark_monsters.js ---

import { ITEMS } from '../items.js';
import { GEMS } from '../gems.js';

export const underdarkMonsters = {
    // ====================================================================================
    // --- Crystal Caverns (Levels 401-500) ---
    // ====================================================================================

    // --- Sub-Zone: Glimmering Path (Levels 401-424) ---
    CRYSTAL_SPIDER: {
        name: 'Crystal Spider',
        image: 'images/monsters/crystal_spider.png',
        dropChance: 100, // Changed from 30
        lootTable: [
            { item: ITEMS.SHIMMERING_LEGGINGS, weight: 15  },
            { item: ITEMS.FOCAL_GEM_RING, weight: 5 },
            { item: GEMS.BASE_RUBY_T4, weight: 80 }, // Increased weight
        ]
    },
    SHARD_SLIME: {
        name: 'Shard Slime',
        image: 'images/monsters/shard_slime.png',
        dropChance: 100, // Changed from 15
        lootTable: [
            { item: ITEMS.FOCAL_GEM_RING, weight: 10 },
            { item: ITEMS.CRYSTAL_TIPPED_SPEAR, weight: 10 },
            { item: GEMS.BASE_SAPPHIRE_T4, weight: 80 }, // Added gem, total weight is 100
        ]
    },
    CRYSTAL_SCUTTLER: {
        name: 'Crystal Scuttler',
        image: 'images/monsters/crystal_scuttler.png',
        dropChance: 100, // Changed from 15
        lootTable: [
            { item: ITEMS.CRYSTALVEIN_GAUNTLETS, weight: 15 },
            { item: GEMS.BASE_SAPPHIRE_T4, weight: 85 }, // Adjusted weight, total is 100
        ]
    },

    // --- Sub-Zone: Crystal Golem (Boss Lvl 425) ---
    CRYSTAL_GOLEM: {
        name: 'Crystal Golem',
        image: 'images/monsters/crystal_golem.png',
        isBoss: true,
        dropChance: 100, // Changed from 50
        lootTable: [
            { item: ITEMS.CROWN_OF_WISDOM, weight: 10 },
            { item: ITEMS.CRYSTAL_TIPPED_SPEAR, weight: 25 },
            { item: GEMS.BASE_RUBY_T5, weight: 65 }, // Adjusted weights, total is 100
        ]
    },

    // --- Sub-Zone: Resonant Tunnels (Levels 426-449) ---
    DEEP_GNOME_MINER: {
        name: 'Deep Gnome Miner',
        image: 'images/monsters/deep_gnome_miner.png',
        dropChance: 100, // Changed from 30
        lootTable: [
            { item: ITEMS.GNOMISH_MINING_HELM, weight: 10 },
            { item: ITEMS.DEEP_GNOME_PICKAXE, weight: 5 },
            { item: GEMS.BASE_EMERALD_T4, weight: 85 }, // Adjusted weights, total is 100
        ]
    },
    CAVE_LURKER: {
        name: 'Cave Lurker',
        image: 'images/monsters/cave_lurker.png',
        dropChance: 100, // Changed from 15
        lootTable: [
            { item: ITEMS.LURKERS_HIDE_SHIELD, weight: 8 },
            { item: ITEMS.ACOLYTES_ROBE, weight: 5 },
            { item: GEMS.BASE_TOPAZ_T4, weight: 87 }, // Added gem, total weight is 100
        ]
    },
    ECHO_WISP: {
        name: 'Echo Wisp',
        image: 'images/monsters/echo_wisp.png',
        dropChance: 100, // Changed from 15
        lootTable: [
            { item: ITEMS.RESONANT_AMULET, weight: 12.5 },
            { item: GEMS.BASE_TOPAZ_T4, weight: 87.5 }, // Adjusted weights, total is 100
        ]
    },

    // --- Sub-Zone: Crystal Guardian's Lair (Boss Lvl 450) ---
    CRYSTALLINE_ELEMENTAL: {
        name: 'Crystalline Elemental',
        image: 'images/monsters/crystalline_elemental.png',
        isBoss: true,
        dropChance: 100, // Changed from 50
        lootTable: [
            { item: ITEMS.GEODE_CRUSHER, weight: 9 },
            { item: ITEMS.ACOLYTES_ROBE, weight: 17 },
            { item: GEMS.BASE_SAPPHIRE_T5, weight: 74 }, // Adjusted weights, total is 100
        ]
},

    // --- Sub-Zone: Deep Caverns (Levels 451-474) ---
    ROCKWORM: {
        name: 'Rockworm',
        image: 'images/monsters/rockworm.png',
        dropChance: 100,
        lootTable: [
            { item: ITEMS.DEEP_GNOME_PICKAXE, weight: 13 },
            { item: GEMS.BASE_RUBY_T4, weight: 87},
        ]
    },
    CAVERN_PROWLER: {
        name: 'Cavern Prowler',
        image: 'images/monsters/cavern_prowler.png',
        dropChance: 100, // Changed from 15
        lootTable: [
            { item: ITEMS.CAVE_STALKER_TUNIC, weight: 5 },
            { item: ITEMS.LURKERS_HIDE_SHIELD, weight: 15 },
            { item: GEMS.BASE_TOPAZ_T4, weight: 80 }, // Added gem, total weight is 100
        ]
    },
    
    // --- Sub-Zone: Gemstone Hoard (Boss Lvl 475) ---
    GEMSTONE_HYDRA: {
        name: 'Gemstone Hydra',
        image: 'images/monsters/gemstone_hydra.png',
        isBoss: true,
        dropChance: 100, // Changed from 50
        lootTable: [
            { item: ITEMS.HYDRA_SCALE_SHIELD, weight: 3.333 },
            { item: GEMS.BASE_EMERALD_T5, weight: 96.666 }, // Adjusted weights, total is 100
        ]
    },

    // --- Sub-Zone: Crystalline Heart (Levels 476-499) ---
    QUARTZ_BEAST: {
        name: 'Quartz Beast',
        image: 'images/monsters/quartz_beast.png',
        dropChance: 100, // Changed from 15
        lootTable: [
            { item: ITEMS.QUARTZ_RING, weight: 10 },
            { item: GEMS.BASE_TOPAZ_T4, weight: 90 }, // Adjusted weights, total is 100
        ]
    },

    LIVING_CRYSTAL: {
        name: 'Living Crystal',
        image: 'images/monsters/living_crystal.png',
        dropChance: 100,
        lootTable: [
            { item: ITEMS.LIVING_CRYSTAL_LEGGINGS, weight: 10 },
            { item: GEMS.BASE_SAPPHIRE_T4, weight: 80 },
            { item: ITEMS.CAVE_STALKER_TUNIC, weight: 10 }, // Rare cross-drop
        ]
    },

    // --- Sub-Zone: Crystal King's Throne (Boss Lvl 500) ---
    CRYSTAL_KING: {
        name: 'The Crystal King',
        image: 'images/monsters/crystal_king.png',
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.HEARTSTONE_AMULET, weight: 7.777 },
            { item: GEMS.BASE_TOPAZ_T5, weight: 92.2229 },
        ]
    },

    // ====================================================================================
    // --- Fungal Forest (Levels 501-600) ---
    // ====================================================================================

    // --- Sub-Zone: Spore Meadows (Levels 501-524) ---
    MYCONID_SPOREKEEPER: {
        name: 'Myconid Sporekeeper',
        image: 'images/monsters/myconid_sporekeeper.png',
        dropChance: 15,
        lootTable: [
            { item: ITEMS.MYCONID_LEATHER_BELT, weight: 1 },
            { item: GEMS.BASE_EMERALD_T4, weight: 0.3 },
        ]
    },
    SPORE_BAT: {
        name: 'Spore Bat',
        image: 'images/monsters/spore_bat.png',
        dropChance: 15,
        lootTable: [
            { item: ITEMS.SPOREWEAVE_PANTS, weight: 1 },
            { item: ITEMS.FUNGAL_CRAWLER_RING, weight: 0.1 }, // Rare cross-drop
        ]
    },
    FUNGAL_HULK: {
        name: 'Fungal Hulk',
        image: 'images/monsters/fungal_hulk.png',
        dropChance: 15,
        lootTable: [
            { item: ITEMS.FUNGAL_TIPPED_ARROW, weight: 1 },
        ]
    },

    // --- Sub-Zone: Fungal Guardian (Boss Lvl 525) ---
    FUNGAL_BEHEMOTH: {
        name: 'Fungal Behemoth',
        image: 'images/monsters/fungal_behemoth.png',
        isBoss: true,
        dropChance: 66,
        lootTable: [
            { item: ITEMS.MYCONID_KINGS_CROWN, weight: 10 },
            { item: ITEMS.GLOWCAP_RING, weight: 8 },
            { item: GEMS.BASE_RUBY_T5, weight: 10 },
        ]
    },

    // --- Sub-Zone: Mycelial Network (Levels 526-549) ---
    FUNGAL_CRAWLER: {
        name: 'Fungal Crawler',
        image: 'images/monsters/fungal_crawler.png',
        dropChance: 15,
        lootTable: [ { item: ITEMS.FUNGAL_CRAWLER_RING, weight: 1 } ]
    },
    SHRIEKER: {
        name: 'Shrieker',
        image: 'images/monsters/shrieker.png',
        dropChance: 15,
        lootTable: [
            { item: ITEMS.SHRIEKER_AMULET, weight: 1 },
            { item: GEMS.BASE_SAPPHIRE_T4, weight: 0.3 },
        ]
    },
    MYCELIAL_WEBBER: {
        name: 'Mycelial Webber',
        image: 'images/monsters/mycelial_webber.png',
        dropChance: 15,
        lootTable: [ { item: ITEMS.FUNGAL_BARRIER, weight: 1 } ]
    },

    // --- Sub-Zone: Gas Spore Grotto (Boss Lvl 550) ---
    GAS_SPORE: {
        name: 'Gas Spore',
        image: 'images/monsters/gas_spore.png',
        isBoss: true,
        dropChance: 41,
        lootTable: [
            { item: ITEMS.FUNGAL_SPIRE, weight: 0.5 },
            { item: GEMS.BASE_SAPPHIRE_T5, weight: 5 },
        ]
    },

    // --- Sub-Zone: Shrieking Hollows (Levels 551-574) ---
    MIND_FLAYER_SPORE: {
        name: 'Mind Flayer Spore',
        image: 'images/monsters/mind_flayer_spore.png',
        dropChance: 15,
        lootTable: [ { item: ITEMS.MIND_FLAYER_CIRCLET, weight: 1 } ]
    },
    CORRUPTED_DRYAD: {
        name: 'Corrupted Dryad',
        image: 'images/monsters/corrupted_dryad.png',
        dropChance: 15,
        lootTable: [
            { item: ITEMS.GLIMMERWEAVE_ROBES, weight: 1 },
            { item: GEMS.BASE_EMERALD_T4, weight: 0.35 },
            { item: ITEMS.SHRIEKER_AMULET, weight: 0.15 }, // Rare cross-drop
        ]
    },

    // --- Sub-Zone: Mycelial Core (Boss Lvl 575) ---
    FUNGAL_TITAN: {
        name: 'Fungal Titan',
        image: 'images/monsters/fungal_titan.png',
        isBoss: true,
        dropChance: 66,
        lootTable: [
            { item: ITEMS.TITANS_FUNGAL_HEART, weight: 1 },
            { item: GEMS.BASE_EMERALD_T5, weight: 6 },
        ]
    },

    // --- Sub-Zone: Heart of the Forest (Levels 576-599) ---
    SPORE_WOLF: {
        name: 'Spore Wolf',
        image: 'images/monsters/spore_wolf.png',
        dropChance: 15,
        lootTable: [ { item: ITEMS.SPORE_WOLF_PELT, weight: 1 } ]
    },
    MANDRAGORA: {
        name: 'Mandragora',
        image: 'images/monsters/mandragora.png',
        dropChance: 28,
        lootTable: [
            { item: ITEMS.MANDRAGORA_ROOT, weight: 1 },
            { item: GEMS.BASE_TOPAZ_T5, weight: 0.35 },
        ]
    },
    
    // --- Sub-Zone: The Great Fungus (Boss Lvl 600) ---
    THE_GREAT_MYCELIUM: {
        name: 'The Great Mycelium',
        image: 'images/monsters/the_great_mycelium.png',
        isBoss: true,
        dropChance: 47,
        lootTable: [
            { item: ITEMS.GREAT_FUNGUS_HEART, weight: 1 },
            { item: GEMS.BASE_TOPAZ_T5, weight: 6 },
        ]
    },

    // ====================================================================================
    // --- Drow City (Levels 601-700) ---
    // ====================================================================================

    // --- Sub-Zone: Outer Spires (Levels 601-624) ---
    DROW_WARRIOR: {
        name: 'Drow Warrior',
        image: 'images/monsters/drow_warrior.png',
        dropChance: 15,
        lootTable: [ { item: ITEMS.DROW_CHAINMAIL, weight: 1 } ]
    },
    GIANT_CAVE_SPIDER: {
        name: 'Giant Cave Spider',
        image: 'images/monsters/giant_cave_spider.png',
        dropChance: 15,
        lootTable: [
            { item: ITEMS.SPIDERSILK_SASH, weight: 1 },
            { item: GEMS.BASE_RUBY_T4, weight: 0.4 },
        ]
    },
    DROW_SCOUT: {
        name: 'Drow Scout',
        image: 'images/monsters/drow_scout.png',
        dropChance: 15,
        lootTable: [ { item: ITEMS.DROW_ASSASSINS_BLADE, weight: 1 } ]
    },

    // --- Sub-Zone: Drow Patrol (Boss Lvl 625) ---
    DRIDER: {
        name: 'Drider',
        image: 'images/monsters/drider.png',
        isBoss: true,
        dropChance: 66,
        lootTable: [
            { item: ITEMS.DROW_MATRONS_SIGNET, weight: 1 },
            { item: GEMS.BASE_RUBY_T5, weight: 10 },
        ]
    },

    // --- Sub-Zone: Webbed Catacombs (Levels 626-649) ---
    DROW_MAGE: {
        name: 'Drow Mage',
        image: 'images/monsters/drow_mage.png',
        dropChance: 15,
        lootTable: [ { item: ITEMS.DROW_MAGE_HOOD, weight: 1 } ]
    },
    SHADOW_STALKER: {
        name: 'Shadow Stalker',
        image: 'images/monsters/shadow_stalker.png',
        dropChance: 15,
        lootTable: [
            { item: ITEMS.SHADOW_SPUN_LEGGINGS, weight: 1 },
            { item: ITEMS.DROW_ASSASSINS_BLADE, weight: 0.2 }, // Rare cross-drop
        ]
    },
    PHASE_SPIDER: {
        name: 'Phase Spider',
        image: 'images/monsters/phase_spider.png',
        dropChance: 15,
        lootTable: [
            { item: ITEMS.SPIDERFANG_PENDANT, weight: 1 },
            { item: GEMS.BASE_SAPPHIRE_T4, weight: 0.4 },
        ]
    },

    // --- Sub-Zone: Drow Barracks (Boss Lvl 650) ---
    DROW_PRIESTESS: {
        name: 'Drow Priestess',
        image: 'images/monsters/drow_priestess.png',
        isBoss: true,
        dropChance: 80,
        lootTable: [
            { item: ITEMS.LOLTHS_EMBRACE, weight: 1 },
            { item: GEMS.BASE_SAPPHIRE_T5, weight: 10 },
        ]
    },

    // --- Sub-Zone: Noble District (Levels 651-674) ---
    DROW_ELITE_GUARD: {
        name: 'Drow Elite Guard',
        image: 'images/monsters/drow_elite_guard.png',
        dropChance: 15,
        lootTable: [
            { item: ITEMS.OBSIDIAN_PLATEBODY, weight: 1 },
            { item: ITEMS.DROW_CHAINMAIL, weight: 0.2 },
        ]
    },
    DROW_SPELLWEAVER: {
        name: 'Drow Spellweaver',
        image: 'images/monsters/drow_spellweaver.png',
        dropChance: 15,
        lootTable: [
            { item: ITEMS.DROW_SPELLWEAVER_BLADE, weight: 1 },
            { item: GEMS.BASE_EMERALD_T4, weight: 0.4 },
        ]
    },

    // --- Sub-Zone: House of Shadows (Boss Lvl 675) ---
    YOCHLOL: {
        name: 'Yochlol',
        image: 'images/monsters/yochlol.png',
        isBoss: true,
        dropChance: 50,
        lootTable: [
            { item: ITEMS.DEMONWEAVE_CLOAK, weight: 2 },
            { item: ITEMS.DROW_NOBLE_SIGNET, weight: 2 },
            { item: GEMS.BASE_EMERALD_T5, weight: 10 },
        ]
    },
    
    // --- Sub-Zone: Matron's Court (Levels 676-699) ---
    SPIDER_SWARM: {
        name: 'Spider Swarm',
        image: 'images/monsters/spider_swarm.png',
        dropChance: 15,
        lootTable: [ { item: ITEMS.SPIDER_CARAPACE_SHIELD, weight: 1 } ]
    },
    DROW_HIGH_PRIESTESS: {
        name: 'Drow High Priestess',
        image: 'images/monsters/drow_high_priestess.png',
        dropChance: 15,
        lootTable: [
            { item: ITEMS.HIGH_PRIESTESS_ROBES, weight: 1 },
            { item: GEMS.BASE_TOPAZ_T4, weight: 0.4 },
        ]
    },

    // --- Sub-Zone: Spider Queen's Lair (Boss Lvl 700) ---
    SPIDER_QUEEN_MATRON: {
        name: 'Spider Queen Matron',
        image: 'images/monsters/spider_queen_matron.png',
        isBoss: true,
        dropChance: 10,
        lootTable: [
            { item: ITEMS.THE_WEAVERS_ENVY, weight: 1 },
            { item: GEMS.BASE_RUBY_T5, weight: 9 },
        ]
    },

    // ====================================================================================
    // --- Abyssal Rift (Levels 701-800) ---
    // ====================================================================================

    // --- Sub-Zone: Chasm Descent (Levels 701-724) ---
    SHADOW_FIEND: {
        name: 'Shadow Fiend',
        image: 'images/monsters/shadow_stalker.png',
        dropChance: 15,
        lootTable: [
            { item: ITEMS.VOIDFORGED_HELM, weight: 1 },
            { item: GEMS.BASE_RUBY_T4, weight: 0.5 },
        ]
    },
    ABYSSAL_LEECH: {
        name: 'Abyssal Leech',
        image: 'images/monsters/abyssal_leech.png',
        dropChance: 15,
        lootTable: [ { item: ITEMS.SHADOW_WEAVE_SASH, weight: 1 } ]
    },
    WARPED_SOUL: {
        name: 'Warped Soul',
        image: 'images/monsters/warped_soul.png',
        dropChance: 15,
        lootTable: [ { item: ITEMS.RIFT_WARD, weight: 1 } ]
    },

    // --- Sub-Zone: Demonic Gate (Boss Lvl 725) ---
    DEMONIC_OVERSEER: {
        name: 'Demonic Overseer',
        image: 'images/monsters/demonic_overseer.png',
        isBoss: true,
        dropChance: 33,
        lootTable: [
            { item: ITEMS.ABYSSAL_EDGE, weight: 1 },
            { item: GEMS.BASE_RUBY_T5, weight: 2 },
        ]
    },

    // --- Sub-Zone: Fields of Madness (Levels 726-749) ---
    VOID_WRAITH: {
        name: 'Void Wraith',
        image: 'images/monsters/void_wraith.png',
        dropChance: 15,
        lootTable: [
            { item: ITEMS.SHADOW_WEAVE_TUNIC, weight: 1 },
            { item: GEMS.BASE_SAPPHIRE_T4, weight: 0.5 },
        ]
    },
    SOUL_EATER: {
        name: 'Soul Eater',
        image: 'images/monsters/soul_eater.png',
        dropChance: 15,
        lootTable: [ { item: ITEMS.VOIDFORGED_GREAVES, weight: 1 } ]
    },
    MIND_SHARD: {
        name: 'Mind Shard',
        image: 'images/monsters/mind_shard.png',
        dropChance: 15,
        lootTable: [ { item: ITEMS.SOUL_EATER_RING, weight: 1 } ]
    },

    // --- Sub-Zone: Balor's Roost (Boss Lvl 750) ---
    BALOR: {
        name: 'Balor',
        image: 'images/monsters/balor.png',
        isBoss: true,
        dropChance: 22,
        lootTable: [
            { item: ITEMS.BALORS_WHIP, weight: 1 },
            { item: GEMS.BASE_SAPPHIRE_T5, weight: 5 },
        ]
    },

    // --- Sub-Zone: Heart of Chaos (Levels 751-774) ---
    CHAOS_HOUND: {
        name: 'Chaos Hound',
        image: 'images/monsters/chaos_hound.png',
        dropChance: 15,
        lootTable: [ { item: ITEMS.CHAOS_HOUND_COLLAR, weight: 1 } ]
    },
    FLESH_GOLEM: {
        name: 'Flesh Golem',
        image: 'images/monsters/flesh_golem.png',
        dropChance: 15,
        lootTable: [
            { item: ITEMS.FLESH_GOLEM_HEART, weight: 1 },
            { item: GEMS.BASE_EMERALD_T4, weight: 0.5 },
        ]
    },

    // --- Sub-Zone: The Soul Well (Boss Lvl 775) ---
    ABYSSAL_TYRANT: {
        name: 'Abyssal Tyrant',
        image: 'images/monsters/abyssal_tyrant.png',
        isBoss: true,
        dropChance: 50,
        lootTable: [
            { item: ITEMS.CHAOS_CORE, weight: 1 },
            { item: GEMS.BASE_EMERALD_T5, weight: 7 },
        ]
    },

    // --- Sub-Zone: The Brink (Levels 776-799) ---
    RIFT_STALKER: {
        name: 'Rift Stalker',
        image: 'images/monsters/rift_stalker.png',
        dropChance: 15,
        lootTable: [ { item: ITEMS.RIFT_STALKER_CLOAK, weight: 1 } ]
    },
    CHAOS_BEAST: {
        name: 'Chaos Beast',
        image: 'images/monsters/chaos_beast.png',
        dropChance: 15,
        lootTable: [
            { item: GEMS.BASE_TOPAZ_T4, weight: 0.5 },
            { item: ITEMS.VOIDFORGED_HELM, weight: 0.2 }, // Rare cross-drop
        ]
    },
    
    // --- Sub-Zone: The Final Abyss (Boss Lvl 800) ---
    MAW_OF_THE_ABYSS: {
        name: 'Maw of the Abyss',
        image: 'images/monsters/maw_of_the_abyss.png',
        isBoss: true,
        dropChance: 10,
        lootTable: [
            { item: ITEMS.SOULCAGE_AMULET, weight: 1 },
            { item: GEMS.BASE_TOPAZ_T5, weight: 7 },
        ]
    }
};