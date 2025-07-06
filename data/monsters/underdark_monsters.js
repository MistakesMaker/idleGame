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
        dropChance: 30,
        lootTable: [ { item: ITEMS.SHIMMERING_LEGGINGS, weight: 1 } ]
    },
    SHARD_SLIME: {
        name: 'Shard Slime',
        image: 'images/monsters/shard_slime.png',
        dropChance: 28,
        lootTable: [ { item: ITEMS.FOCAL_GEM_RING, weight: 1 } ]
    },
    CRYSTAL_SCUTTLER: {
        name: 'Crystal Scuttler',
        image: 'images/monsters/crystal_scuttler.png',
        dropChance: 25,
        lootTable: [ { item: ITEMS.CRYSTALVEIN_GAUNTLETS, weight: 1 } ]
    },

    // --- Sub-Zone: Crystal Golem (Boss Lvl 425) ---
    CRYSTAL_GOLEM: {
        name: 'Crystal Golem',
        image: 'images/monsters/crystal_golem.png',
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.CROWN_OF_WISDOM, weight: 10 },
            { item: ITEMS.CRYSTAL_TIPPED_SPEAR, weight: 8 },
            { item: GEMS.BASE_RUBY_T2, weight: 5 },
        ]
    },

    // --- Sub-Zone: Resonant Tunnels (Levels 426-449) ---
    DEEP_GNOME_MINER: {
        name: 'Deep Gnome Miner',
        image: 'images/monsters/deep_gnome_miner.png',
        dropChance: 35,
        lootTable: [ { item: ITEMS.GNOMISH_MINING_HELM, weight: 1 } ]
    },
    CAVE_LURKER: {
        name: 'Cave Lurker',
        image: 'images/monsters/cave_lurker.png',
        dropChance: 32,
        lootTable: [ { item: ITEMS.LURKERS_HIDE_SHIELD, weight: 1 } ]
    },
    ECHO_WISP: {
        name: 'Echo Wisp',
        image: 'images/monsters/echo_wisp.png',
        dropChance: 22,
        lootTable: [ { item: ITEMS.RESONANT_AMULET, weight: 1 } ]
    },

    // --- Sub-Zone: Crystal Guardian's Lair (Boss Lvl 450) ---
    CRYSTALLINE_ELEMENTAL: {
        name: 'Crystalline Elemental',
        image: 'images/monsters/crystalline_elemental.png',
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.GEODE_CRUSHER, weight: 10 },
            { item: ITEMS.ACOLYTES_ROBE, weight: 8 },
            { item: GEMS.BASE_SAPPHIRE_T2, weight: 5 },
        ]
    },

    // --- Sub-Zone: Deep Caverns (Levels 451-474) ---
    ROCKWORM: {
        name: 'Rockworm',
        image: 'images/monsters/rockworm.png',
        dropChance: 30,
        lootTable: [ { item: ITEMS.DEEP_GNOME_PICKAXE, weight: 1 } ]
    },
    CAVERN_PROWLER: {
        name: 'Cavern Prowler',
        image: 'images/monsters/cavern_prowler.png',
        dropChance: 28,
        lootTable: [ { item: ITEMS.CAVE_STALKER_TUNIC, weight: 1 } ]
    },
    // Deep Gnome Miner also appears here.
    
    // --- Sub-Zone: Gemstone Hoard (Boss Lvl 475) ---
    GEMSTONE_HYDRA: {
        name: 'Gemstone Hydra',
        image: 'images/monsters/gemstone_hydra.png',
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.HYDRA_SCALE_SHIELD, weight: 10 },
            { item: GEMS.BASE_EMERALD_T2, weight: 5 },
        ]
    },

    // --- Sub-Zone: Crystalline Heart (Levels 476-499) ---
    QUARTZ_BEAST: {
        name: 'Quartz Beast',
        image: 'images/monsters/quartz_beast.png',
        dropChance: 35,
        lootTable: [ { item: ITEMS.QUARTZ_RING, weight: 1 } ]
    },
    LIVING_CRYSTAL: {
        name: 'Living Crystal',
        image: 'images/monsters/living_crystal.png',
        dropChance: 30,
        lootTable: [ { item: ITEMS.LIVING_CRYSTAL_LEGGINGS, weight: 1 } ]
    },
    // Rockworm also appears here.

    // --- Sub-Zone: Crystal King's Throne (Boss Lvl 500) ---
    CRYSTAL_KING: {
        name: 'The Crystal King',
        image: 'images/monsters/crystal_king.png',
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.HEARTSTONE_AMULET, weight: 10 },
            { item: GEMS.BASE_TOPAZ_T2, weight: 5 },
        ]
    },

    // ====================================================================================
    // --- Fungal Forest (Levels 501-600) ---
    // ====================================================================================

    // --- Sub-Zone: Spore Meadows (Levels 501-524) ---
    MYCONID_SPOREKEEPER: {
        name: 'Myconid Sporekeeper',
        image: 'images/monsters/myconid_sporekeeper.png',
        dropChance: 30,
        lootTable: [ { item: ITEMS.MYCONID_LEATHER_BELT, weight: 1 } ]
    },
    SPORE_BAT: {
        name: 'Spore Bat',
        image: 'images/monsters/spore_bat.png',
        dropChance: 25,
        lootTable: [ { item: ITEMS.SPOREWEAVE_PANTS, weight: 1 } ]
    },
    FUNGAL_HULK: {
        name: 'Fungal Hulk',
        image: 'images/monsters/fungal_hulk.png',
        dropChance: 22,
        lootTable: [ { item: ITEMS.FUNGAL_TIPPED_ARROW, weight: 1 } ]
    },

    // --- Sub-Zone: Fungal Guardian (Boss Lvl 525) ---
    FUNGAL_BEHEMOTH: {
        name: 'Fungal Behemoth',
        image: 'images/monsters/fungal_behemoth.png',
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.MYCONID_KINGS_CROWN, weight: 10 },
            { item: ITEMS.GLOWCAP_RING, weight: 8 },
            { item: GEMS.BASE_RUBY_T2, weight: 5 },
        ]
    },

    // --- Sub-Zone: Mycelial Network (Levels 526-549) ---
    FUNGAL_CRAWLER: {
        name: 'Fungal Crawler',
        image: 'images/monsters/fungal_crawler.png',
        dropChance: 28,
        lootTable: [ { item: ITEMS.FUNGAL_CRAWLER_RING, weight: 1 } ]
    },
    SHRIEKER: {
        name: 'Shrieker',
        image: 'images/monsters/shrieker.png',
        dropChance: 33,
        lootTable: [ { item: ITEMS.SHRIEKER_AMULET, weight: 1 } ]
    },
    MYCELIAL_WEBBER: {
        name: 'Mycelial Webber',
        image: 'images/monsters/mycelial_webber.png',
        dropChance: 25,
        lootTable: [ { item: ITEMS.FUNGAL_BARRIER, weight: 1 } ]
    },

    // --- Sub-Zone: Gas Spore Grotto (Boss Lvl 550) ---
    GAS_SPORE: {
        name: 'Gas Spore',
        image: 'images/monsters/gas_spore.png',
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.FUNGAL_SPIRE, weight: 10 },
            { item: GEMS.BASE_SAPPHIRE_T2, weight: 5 },
        ]
    },

    // --- Sub-Zone: Shrieking Hollows (Levels 551-574) ---
    MIND_FLAYER_SPORE: {
        name: 'Mind Flayer Spore',
        image: 'images/monsters/mind_flayer_spore.png',
        dropChance: 30,
        lootTable: [ { item: ITEMS.MIND_FLAYER_CIRCLET, weight: 1 } ]
    },
    CORRUPTED_DRYAD: {
        name: 'Corrupted Dryad',
        image: 'images/monsters/corrupted_dryad.png',
        dropChance: 32,
        lootTable: [ { item: ITEMS.GLIMMERWEAVE_ROBES, weight: 1 } ]
    },
    // Shrieker also appears here.

    // --- Sub-Zone: Mycelial Core (Boss Lvl 575) ---
    FUNGAL_TITAN: {
        name: 'Fungal Titan',
        image: 'images/monsters/fungal_titan.png',
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.TITANS_FUNGAL_HEART, weight: 10 },
            { item: GEMS.BASE_EMERALD_T2, weight: 5 },
        ]
    },

    // --- Sub-Zone: Heart of the Forest (Levels 576-599) ---
    SPORE_WOLF: {
        name: 'Spore Wolf',
        image: 'images/monsters/spore_wolf.png',
        dropChance: 35,
        lootTable: [ { item: ITEMS.SPORE_WOLF_PELT, weight: 1 } ]
    },
    MANDRAGORA: {
        name: 'Mandragora',
        image: 'images/monsters/mandragora.png',
        dropChance: 28,
        lootTable: [ { item: ITEMS.MANDRAGORA_ROOT, weight: 1 } ]
    },
    // Fungal Hulk also appears here.
    
    // --- Sub-Zone: The Great Fungus (Boss Lvl 600) ---
    THE_GREAT_MYCELIUM: {
        name: 'The Great Mycelium',
        image: 'images/monsters/the_great_mycelium.png',
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.GREAT_FUNGUS_HEART, weight: 10 },
            { item: GEMS.BASE_AMETHYST_T2, weight: 3 },
        ]
    },

    // ====================================================================================
    // --- Drow City (Levels 601-700) ---
    // ====================================================================================

    // --- Sub-Zone: Outer Spires (Levels 601-624) ---
    DROW_WARRIOR: {
        name: 'Drow Warrior',
        image: 'images/monsters/drow_warrior.png',
        dropChance: 30,
        lootTable: [ { item: ITEMS.DROW_CHAINMAIL, weight: 1 } ]
    },
    GIANT_CAVE_SPIDER: {
        name: 'Giant Cave Spider',
        image: 'images/monsters/giant_cave_spider.png',
        dropChance: 28,
        lootTable: [ { item: ITEMS.SPIDERSILK_SASH, weight: 1 } ]
    },
    DROW_SCOUT: {
        name: 'Drow Scout',
        image: 'images/monsters/drow_scout.png',
        dropChance: 25,
        lootTable: [ { item: ITEMS.DROW_ASSASSINS_BLADE, weight: 1 } ]
    },

    // --- Sub-Zone: Drow Patrol (Boss Lvl 625) ---
    DRIDER: {
        name: 'Drider',
        image: 'images/monsters/drider.png',
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.DROW_MATRONS_SIGNET, weight: 10 },
            { item: GEMS.BASE_RUBY_T2, weight: 5 },
        ]
    },

    // --- Sub-Zone: Webbed Catacombs (Levels 626-649) ---
    DROW_MAGE: {
        name: 'Drow Mage',
        image: 'images/monsters/drow_mage.png',
        dropChance: 35,
        lootTable: [ { item: ITEMS.DROW_MAGE_HOOD, weight: 1 } ]
    },
    SHADOW_STALKER: {
        name: 'Shadow Stalker',
        image: 'images/monsters/shadow_stalker.png',
        dropChance: 38,
        lootTable: [ { item: ITEMS.SHADOW_SPUN_LEGGINGS, weight: 1 } ]
    },
    PHASE_SPIDER: {
        name: 'Phase Spider',
        image: 'images/monsters/phase_spider.png',
        dropChance: 20,
        lootTable: [ { item: ITEMS.SPIDERFANG_PENDANT, weight: 1 } ]
    },

    // --- Sub-Zone: Drow Barracks (Boss Lvl 650) ---
    DROW_PRIESTESS: {
        name: 'Drow Priestess',
        image: 'images/monsters/drow_priestess.png',
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.LOLTHS_EMBRACE, weight: 10 },
            { item: GEMS.BASE_SAPPHIRE_T2, weight: 5 },
        ]
    },

    // --- Sub-Zone: Noble District (Levels 651-674) ---
    DROW_ELITE_GUARD: {
        name: 'Drow Elite Guard',
        image: 'images/monsters/drow_elite_guard.png',
        dropChance: 30,
        lootTable: [ { item: ITEMS.OBSIDIAN_PLATEBODY, weight: 1 } ]
    },
    DROW_SPELLWEAVER: {
        name: 'Drow Spellweaver',
        image: 'images/monsters/drow_spellweaver.png',
        dropChance: 33,
        lootTable: [ { item: ITEMS.DROW_SPELLWEAVER_BLADE, weight: 1 } ]
    },
    // Drow Warrior also appears here.

    // --- Sub-Zone: House of Shadows (Boss Lvl 675) ---
    YOCHLOL: {
        name: 'Yochlol',
        image: 'images/monsters/yochlol.png',
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.DEMONWEAVE_CLOAK, weight: 10 },
            { item: ITEMS.DROW_NOBLE_SIGNET, weight: 8 },
            { item: GEMS.BASE_EMERALD_T2, weight: 5 },
        ]
    },
    
    // --- Sub-Zone: Matron's Court (Levels 676-699) ---
    SPIDER_SWARM: {
        name: 'Spider Swarm',
        image: 'images/monsters/spider_swarm.png',
        dropChance: 40,
        lootTable: [ { item: ITEMS.SPIDER_CARAPACE_SHIELD, weight: 1 } ]
    },
    DROW_HIGH_PRIESTESS: {
        name: 'Drow High Priestess',
        image: 'images/monsters/drow_high_priestess.png',
        dropChance: 25,
        lootTable: [ { item: ITEMS.HIGH_PRIESTESS_ROBES, weight: 1 } ]
    },
    // Drow Elite Guard also appears here.

    // --- Sub-Zone: Spider Queen's Lair (Boss Lvl 700) ---
    SPIDER_QUEEN_MATRON: {
        name: 'Spider Queen Matron',
        image: 'images/monsters/spider_queen_matron.png',
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.THE_WEAVERS_ENVY, weight: 10 },
            { item: GEMS.BASE_AMETHYST_T2, weight: 3 },
        ]
    },

    // ====================================================================================
    // --- Abyssal Rift (Levels 701-800) ---
    // ====================================================================================

    // --- Sub-Zone: Chasm Descent (Levels 701-724) ---
    SHADOW_FIEND: {
        name: 'Shadow Fiend',
        image: 'images/monsters/shadow_stalker.png', // Re-using image
        dropChance: 30,
        lootTable: [ { item: ITEMS.VOIDFORGED_HELM, weight: 1 } ]
    },
    ABYSSAL_LEECH: {
        name: 'Abyssal Leech',
        image: 'images/monsters/abyssal_leech.png',
        dropChance: 28,
        lootTable: [ { item: ITEMS.SHADOW_WEAVE_SASH, weight: 1 } ]
    },
    WARPED_SOUL: {
        name: 'Warped Soul',
        image: 'images/monsters/warped_soul.png',
        dropChance: 25,
        lootTable: [ { item: ITEMS.RIFT_WARD, weight: 1 } ]
    },

    // --- Sub-Zone: Demonic Gate (Boss Lvl 725) ---
    DEMONIC_OVERSEER: {
        name: 'Demonic Overseer',
        image: 'images/monsters/demonic_overseer.png',
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.ABYSSAL_EDGE, weight: 10 },
            { item: GEMS.BASE_RUBY_T2, weight: 5 },
        ]
    },

    // --- Sub-Zone: Fields of Madness (Levels 726-749) ---
    VOID_WRAITH: {
        name: 'Void Wraith',
        image: 'images/monsters/sand_wraith.png', // Re-using image
        dropChance: 35,
        lootTable: [ { item: ITEMS.SHADOW_WEAVE_TUNIC, weight: 1 } ]
    },
    SOUL_EATER: {
        name: 'Soul Eater',
        image: 'images/monsters/soul_eater.png',
        dropChance: 32,
        lootTable: [ { item: ITEMS.VOIDFORGED_GREAVES, weight: 1 } ]
    },
    MIND_SHARD: {
        name: 'Mind Shard',
        image: 'images/monsters/mind_shard.png',
        dropChance: 28,
        lootTable: [ { item: ITEMS.SOUL_EATER_RING, weight: 1 } ]
    },

    // --- Sub-Zone: Balor's Roost (Boss Lvl 750) ---
    BALOR: {
        name: 'Balor',
        image: 'images/monsters/balor.png',
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.BALORS_WHIP, weight: 10 },
            { item: GEMS.BASE_SAPPHIRE_T2, weight: 5 },
        ]
    },

    // --- Sub-Zone: Heart of Chaos (Levels 751-774) ---
    CHAOS_HOUND: {
        name: 'Chaos Hound',
        image: 'images/monsters/chaos_hound.png',
        dropChance: 30,
        lootTable: [ { item: ITEMS.CHAOS_HOUND_COLLAR, weight: 1 } ]
    },
    FLESH_GOLEM: {
        name: 'Flesh Golem',
        image: 'images/monsters/flesh_golem.png',
        dropChance: 33,
        lootTable: [ { item: ITEMS.FLESH_GOLEM_HEART, weight: 1 } ]
    },
    // Abyssal Leech also appears here.

    // --- Sub-Zone: The Soul Well (Boss Lvl 775) ---
    ABYSSAL_TYRANT: {
        name: 'Abyssal Tyrant',
        image: 'images/monsters/abyssal_tyrant.png',
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.CHAOS_CORE, weight: 8 },
            { item: GEMS.BASE_EMERALD_T2, weight: 5 },
        ]
    },

    // --- Sub-Zone: The Brink (Levels 776-799) ---
    RIFT_STALKER: {
        name: 'Rift Stalker',
        image: 'images/monsters/rift_stalker.png',
        dropChance: 35,
        lootTable: [ { item: ITEMS.RIFT_STALKER_CLOAK, weight: 1 } ]
    },
    CHAOS_BEAST: {
        name: 'Chaos Beast',
        image: 'images/monsters/chaos_beast.png',
        dropChance: 31,
        lootTable: [ { item: ITEMS.RING_OF_DESPAIR, weight: 1 } ]
    },
    // Soul Eater also appears here.
    
    // --- Sub-Zone: The Final Abyss (Boss Lvl 800) ---
    MAW_OF_THE_ABYSS: {
        name: 'Maw of the Abyss',
        image: 'images/monsters/maw_of_the_abyss.png',
        isBoss: true,
        dropChance: 100,
        lootTable: [
            { item: ITEMS.SOULCAGE_AMULET, weight: 10 },
            { item: GEMS.BASE_AMETHYST_T2, weight: 3 },
        ]
    }
};