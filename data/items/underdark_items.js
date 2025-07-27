// --- START OF FILE data/items/underdark_items.js ---

import { STATS } from '../stat_pools.js';

export const underdarkItems = {
    // ====================================================================================
    // --- Crystal Caverns (Levels 401-500) ---
    // ====================================================================================

    // --- Sub-Zone: Glimmering Path (Levels 401-424) ---
    CRYSTALVEIN_GAUNTLETS: {
        id: 'CRYSTALVEIN_GAUNTLETS',
        name: "Crystalvein Gauntlets",
        type: 'belt',
        icon: 'images/icons/crystalvein_gauntlets.png',
        width: 2, height: 1,
        canHaveSockets: true,
        maxSockets: 1,
        possibleStats: [ 
            { key: STATS.DPS.key, min: 1, max: 158250 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 15825 },
            { key: STATS.GOLD_GAIN.key, min: 1, max: 220 } 
         ]
    },
    SHIMMERING_LEGGINGS: {
        id: 'SHIMMERING_LEGGINGS',
        name: "Shimmering Leggings",
        type: 'platelegs',
        icon: 'images/icons/shimmering_leggings.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ 
            { key: STATS.GOLD_GAIN.key, min: 1, max: 250 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 53409 },
            { key: STATS.DPS.key, min: 1, max: 534093 }
         ]
    },
    FOCAL_GEM_RING: {
        id: 'FOCAL_GEM_RING',
        name: "Focal Gem Ring",
        type: 'ring',
        icon: 'images/icons/focal_gem_ring.png',
        width: 1, height: 1,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ { key: STATS.CLICK_DAMAGE.key, min: 1, max: 79125 } ]
    },
    CRYSTAL_TIPPED_SPEAR: {
        id: 'CRYSTAL_TIPPED_SPEAR',
        name: "Crystal-Tipped Spear",
        type: 'sword',
        icon: 'images/icons/crystal_tipped_spear.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ 
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 79125 },
            { key: STATS.DPS.key, min: 1, max: 791250 },
         ]
    },

    // --- Sub-Zone: Crystal Golem (Boss Lvl 425) ---
    CROWN_OF_WISDOM: {
        id: 'CROWN_OF_WISDOM',
        name: "Crown of Wisdom",
        type: 'helmet',
        icon: 'images/icons/crown_of_wisdom.png',
        width: 2, height: 2,
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ // Boss Item Bonus (Stats of a Level 435 Item)
            { key: STATS.GOLD_GAIN.key, min: 1, max: 480 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 49921 },
            { key: STATS.DPS.key, min: 1, max: 499218 },
        ]
    },
    
    // --- Sub-Zone: Resonant Tunnels (Levels 426-449) ---
    LURKERS_HIDE_SHIELD: {
        id: 'LURKERS_HIDE_SHIELD',
        name: "Lurker's Hide Shield",
        type: 'shield',
        icon: 'images/icons/lurkers_hide_shield.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 1,
        possibleStats: [ 
            { key: STATS.DPS.key, min: 1, max: 549250 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 54925 } ,
         ]
    },
    ACOLYTES_ROBE: {
        id: 'ACOLYTES_ROBE',
        name: "Acolyte's Robe",
        type: 'platebody',
        icon: 'images/icons/acolytes_robe.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ 
            { key: STATS.GOLD_GAIN.key, min: 1, max: 500 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 65910 } 
         ]
    },
    RESONANT_AMULET: {
        id: 'RESONANT_AMULET',
        name: "Resonant Amulet",
        type: 'necklace',
        icon: 'images/icons/resonant_amulet.png',
        width: 2, height: 2,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ 
            { key: STATS.DPS.key, min: 1, max: 263640 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 26364 },
            { key: STATS.GOLD_GAIN.key, min: 1, max: 200 },
         ]
    },

    // --- Sub-Zone: Crystal Guardian's Lair (Boss Lvl 450) ---
    GEODE_CRUSHER: {
        id: 'GEODE_CRUSHER',
        name: "Geode Crusher",
        type: 'sword',
        icon: 'images/icons/geode_crusher.png',
        width: 2, height: 3,
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ // Boss Item Bonus (Stats of a Level 460 Item)
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 126093 },
            { key: STATS.DPS.key, min: 1, max: 1260937 },
            { key: STATS.GOLD_GAIN.key, min: 1, max: 600 }
        ]
    },

    // --- Sub-Zone: Deep Caverns (Levels 451-474) ---
    GNOMISH_MINING_HELM: {
        id: 'GNOMISH_MINING_HELM',
        name: "Gnomish Mining Helm",
        type: 'helmet',
        icon: 'images/icons/gnomish_mining_helm.png',
        width: 2, height: 2,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ { key: STATS.GOLD_GAIN.key, min: 1, max: 1000 } ]
    },
    CAVE_STALKER_TUNIC: {
        id: 'CAVE_STALKER_TUNIC',
        name: "Cave Stalker Tunic",
        type: 'platebody',
        icon: 'images/icons/cave_stalker_tunic.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ { key: STATS.DPS.key, min: 1, max: 945500 } ]
    },
    DEEP_GNOME_PICKAXE: {
        id: 'DEEP_GNOME_PICKAXE',
        name: "Deep Gnome Pickaxe",
        type: 'sword',
        icon: 'images/icons/deep_gnome_pickaxe.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 1,
        possibleStats: [ 
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 118187 },
            { key: STATS.GOLD_GAIN.key, min: 1, max: 800 }
         ]
    },

    // --- Sub-Zone: Gemstone Hoard (Boss Lvl 475) ---
    HYDRA_SCALE_SHIELD: {
        id: 'HYDRA_SCALE_SHIELD',
        name: "Hydra-Scale Shield",
        type: 'shield',
        icon: 'images/icons/hydra_scale_shield.png',
        width: 2, height: 3,
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ // Boss Item Bonus (Stats of a Level 485 Item)
            { key: STATS.DPS.key, min: 1, max: 825187 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 82518 },
            { key: STATS.GOLD_GAIN.key, min: 1, max: 800 }
         ]
    },

    // --- Sub-Zone: Crystalline Heart (Levels 476-499) ---
    QUARTZ_RING: {
        id: 'QUARTZ_RING',
        name: 'Quartz Ring',
        type: 'ring',
        icon: 'images/icons/quartz_ring.png',
        width: 1, height: 1,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ 
            { key: STATS.GOLD_GAIN.key, min: 1, max: 850 },
            { key: STATS.DPS.key, min: 1, max: 431640 }
         ]
    },
    LIVING_CRYSTAL_LEGGINGS: {
        id: 'LIVING_CRYSTAL_LEGGINGS',
        name: 'Living Crystal Leggings',
        type: 'platelegs',
        icon: 'images/icons/living_crystal_leggings.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ 
            { key: STATS.DPS.key, min: 1, max: 1095781 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 109578 },
         ]
    },

    // --- Sub-Zone: Crystal King's Throne (Boss Lvl 500) ---
    HEARTSTONE_AMULET: {
        id: 'HEARTSTONE_AMULET',
        name: "Heartstone Amulet",
        type: 'necklace',
        icon: 'images/icons/heartstone_amulet.png',
        width: 2, height: 2,
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 1,
        possibleStats: [ // Boss Item Bonus (Stats of a Level 510 Item)
            { key: STATS.DPS.key, min: 1, max: 550265 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 55026 },
            { key: STATS.GOLD_GAIN.key, min: 1, max: 750 }
        ]
    },

    // ====================================================================================
    // --- Fungal Forest (Levels 501-600) ---
    // ====================================================================================

    // --- Sub-Zone: Spore Meadows (Levels 501-524) ---
    MYCONID_LEATHER_BELT: {
        id: 'MYCONID_LEATHER_BELT',
        name: "Myconid Leather Belt",
        type: 'belt',
        icon: 'images/icons/myconid_leather_belt.png',
        width: 2, height: 1,
        canHaveSockets: true,
        maxSockets: 1,
        possibleStats: [ 
            { key: STATS.DPS.key, min: 1, max: 521250 },
            { key: STATS.GOLD_GAIN.key, min: 1, max: 700 }
         ]
    },
    SPOREWEAVE_PANTS: {
        id: 'SPOREWEAVE_PANTS',
        name: "Spore-weave Pants",
        type: 'platelegs',
        icon: 'images/icons/spore-weave_pants.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ 
            { key: STATS.GOLD_GAIN.key, min: 1, max: 800 },
            { key: STATS.DPS.key, min: 1, max: 1407375 }
         ]
    },
    GLOWCAP_RING: {
        id: 'GLOWCAP_RING',
        name: "Glowcap Ring",
        type: 'ring',
        icon: 'images/icons/glowcap_ring.png',
        width: 1, height: 1,
        canHaveSockets: true,
        maxSockets: 1,
        possibleStats: [ 
            { key: STATS.DPS.key, min: 1, max: 521250 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 52125 },
         ]
    },
    FUNGAL_TIPPED_ARROW: {
        id: 'FUNGAL_TIPPED_ARROW',
        name: "Fungal-Tipped Arrow",
        type: 'sword',
        icon: 'images/icons/fungal_tipped_arrow.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 1,
        possibleStats: [ 
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 130312 },
            { key: STATS.DPS.key, min: 1, max: 1303125 }]
    },

    // --- Sub-Zone: Fungal Guardian (Boss Lvl 525) ---
    MYCONID_KINGS_CROWN: {
        id: 'MYCONID_KINGS_CROWN',
        name: "Myconid King's Crown",
        type: 'helmet',
        icon: 'images/icons/myconid_kings_crown.png',
        width: 2, height: 2,
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ // Boss Item Bonus (Stats of a Level 535 Item)
            { key: STATS.DPS.key, min: 1, max: 837890 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 83789 },
            { key: STATS.GOLD_GAIN.key, min: 1, max: 950 } ]
    },

    // --- Sub-Zone: Mycelial Network (Levels 526-549) ---
    SHRIEKER_AMULET: {
        id: 'SHRIEKER_AMULET',
        name: "Shrieker Amulet",
        type: 'necklace',
        icon: 'images/icons/shrieker_amulet.png',
        width: 2, height: 2,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ { key: STATS.CLICK_DAMAGE.key, min: 1, max: 99450 } ]
    },
    FUNGAL_BARRIER: {
        id: 'FUNGAL_BARRIER',
        name: "Fungal Barrier",
        type: 'shield',
        icon: 'images/icons/fungal_barrier.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ 
            { key: STATS.DPS.key, min: 1, max: 994500 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 99450 },
            { key: STATS.GOLD_GAIN.key, min: 1, max: 900 }       
        ]
    },

    // --- Sub-Zone: Gas Spore Grotto (Boss Lvl 550) ---
    FUNGAL_SPIRE: {
        id: 'FUNGAL_SPIRE',
        name: "Fungal Spire",
        type: 'sword',
        icon: 'images/icons/fungal_spire.png',
        width: 2, height: 3,
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ // Boss Item Bonus (Stats of a Level 560 Item)
            { key: STATS.DPS.key, min: 1, max: 2340781 },
            { key: STATS.GOLD_GAIN.key, min: 1, max: 1200 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 234078 }
        ]
    },

    // --- Sub-Zone: Shrieking Hollows (Levels 551-574) ---
    GLIMMERWEAVE_ROBES: {
        id: 'GLIMMERWEAVE_ROBES',
        name: "Glimmerweave Robes",
        type: 'platebody',
        icon: 'images/icons/glimmerweave_robes.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ 
            { key: STATS.GOLD_GAIN.key, min: 1, max: 1100 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 153600 }
         ]
    },
    FUNGAL_CRAWLER_RING: {
        id: 'FUNGAL_CRAWLER_RING',
        name: "Fungal Crawler Ring",
        type: 'ring',
        icon: 'images/icons/fungal_crawler_ring.png',
        width: 1, height: 1,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 1, max: 768000 },
            { key: STATS.GOLD_GAIN.key, min: 1, max: 950 }
        ]
    },
    MIND_FLAYER_CIRCLET: {
        id: 'MIND_FLAYER_CIRCLET',
        name: "Mind Flayer Circlet",
        type: 'helmet',
        icon: 'images/icons/mind_flayer_circlet.png',
        width: 2, height: 2,
        possibleStats: [ 
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 76800 },
            { key: STATS.DPS.key, min: 1, max: 768000 },
            { key: STATS.GOLD_GAIN.key, min: 1, max: 900 }
         ]
    },

    // --- Sub-Zone: Mycelial Core (Boss Lvl 575) ---
    TITANS_FUNGAL_HEART: {
        id: 'TITANS_FUNGAL_HEART',
        name: "Titan's Fungal Heart",
        type: 'belt',
        icon: 'images/icons/titans_fungal_heart.png',
        width: 2, height: 1,
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 1,
        possibleStats: [ // Boss Item Bonus (Stats of a Level 585 Item)
            { key: STATS.DPS.key, min: 1, max: 1132500 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 113250 },
            { key: STATS.GOLD_GAIN.key, min: 1, max: 1300 },
        ]
    },

    // --- Sub-Zone: Heart of the Forest (Levels 576-599) ---
    SPORE_WOLF_PELT: {
        id: 'SPORE_WOLF_PELT',
        name: 'Spore-wolf Pelt',
        type: 'platebody',
        icon: 'images/icons/spore_wolf_pelt.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 1,
        possibleStats: [ { key: STATS.DPS.key, min: 1, max: 2048000 } ]
    },
    MANDRAGORA_ROOT: {
        id: 'MANDRAGORA_ROOT',
        name: 'Mandragora Root',
        type: 'sword',
        icon: 'images/icons/mandragora_root.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ 
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 256000 },
            { key: STATS.GOLD_GAIN.key, min: 1, max: 1100 }
         ]
    },
    
    // --- Sub-Zone: The Great Fungus (Boss Lvl 600) ---
    GREAT_FUNGUS_HEART: {
        id: 'GREAT_FUNGUS_HEART',
        name: "Great Fungus' Heart",
        type: 'necklace',
        icon: 'images/icons/great_fungus_heart.png',
        isUnique: true,
        width: 2, height: 2,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ // Boss Item Bonus (Stats of a Level 610 Item)
            { key: STATS.DPS.key, min: 1, max: 1544000 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 154400 },
            { key: STATS.GOLD_GAIN.key, min: 1, max: 1500 }
         ]
    },

    // ====================================================================================
    // --- Drow City (Levels 601-700) ---
    // ====================================================================================
    
    // --- Sub-Zone: Outer Spires (Levels 601-624) ---
    DROW_ASSASSINS_BLADE: {
        id: 'DROW_ASSASSINS_BLADE',
        name: "Drow Assassin's Blade",
        type: 'sword',
        icon: 'images/icons/drow_assassins_blade.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ { key: STATS.CLICK_DAMAGE.key, min: 1, max: 320000 } ]
    },
    SPIDERSILK_SASH: {
        id: 'SPIDERSILK_SASH',
        name: "Spidersilk Sash",
        type: 'belt',
        icon: 'images/icons/spidersilk_sash.png',
        width: 2, height: 1,
        canHaveSockets: true,
        maxSockets: 1,
        possibleStats: [ 
            { key: STATS.GOLD_GAIN.key, min: 1, max: 1200 },
            { key: STATS.DPS.key, min: 1, max: 1088000 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 108800 }
         ]
    },
    DROW_CHAINMAIL: {
        id: 'DROW_CHAINMAIL',
        name: "Drow Chainmail",
        type: 'platebody',
        icon: 'images/icons/drow_chainmail.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ 
            { key: STATS.DPS.key, min: 1, max: 2176000 },
            { key: STATS.GOLD_GAIN.key, min: 1, max: 1100 }
         ]
    },

    // --- Sub-Zone: Drow Patrol (Boss Lvl 625) ---
    DROW_MATRONS_SIGNET: {
        id: 'DROW_MATRONS_SIGNET',
        name: "Drow Matron's Signet",
        type: 'ring',
        icon: 'images/icons/drow_matrons_signet.png',
        width: 1, height: 1,
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ // Boss Item Bonus (Stats of a Level 635 Item)
            { key: STATS.DPS.key, min: 1, max: 1576800 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 157680 },
        ]
    },

    // --- Sub-Zone: Webbed Catacombs (Levels 626-649) ---
    SHADOW_SPUN_LEGGINGS: {
        id: 'SHADOW_SPUN_LEGGINGS',
        name: "Shadow-spun Leggings",
        type: 'platelegs',
        icon: 'images/icons/shadow-spun_leggings.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ 
            { key: STATS.DPS.key, min: 1, max: 2448000 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 244800 },
            { key: STATS.GOLD_GAIN.key, min: 1, max: 1300 }
         ]
    },
    SPIDERFANG_PENDANT: {
        id: 'SPIDERFANG_PENDANT',
        name: "Spiderfang Pendant",
        type: 'necklace',
        icon: 'images/icons/spiderfang_pendant.png',
        width: 2, height: 2,
        canHaveSockets: true,
        maxSockets: 1,
        possibleStats: [ 
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 276480 },
            { key: STATS.GOLD_GAIN.key, min: 1, max: 1400 }
         ]
    },
    DROW_MAGE_HOOD: {
        id: 'DROW_MAGE_HOOD',
        name: "Drow Mage Hood",
        type: 'helmet',
        icon: 'images/icons/drow_mage_hood.png',
        width: 2, height: 2,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ 
            { key: STATS.GOLD_GAIN.key, min: 1, max: 1500 },
            { key: STATS.DPS.key, min: 1, max: 1382400 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 138240 }
         ]
    },

    // --- Sub-Zone: Drow Barracks (Boss Lvl 650) ---
    LOLTHS_EMBRACE: {
        id: 'LOLTHS_EMBRACE',
        name: "Lolth's Embrace",
        type: 'platebody',
        icon: 'images/icons/lolths_embrace.png',
        width: 2, height: 3,
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ // Boss Item Bonus (Stats of a Level 660 Item)
            { key: STATS.DPS.key, min: 1, max: 3712000 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 371200 },
         ]
    },

    // --- Sub-Zone: Noble District (Levels 651-674) ---
    DROW_NOBLE_SIGNET: {
        id: 'DROW_NOBLE_SIGNET',
        name: "Drow Noble Signet",
        type: 'ring',
        icon: 'images/icons/drow_noble_signet.png',
        width: 1, height: 1,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ { key: STATS.GOLD_GAIN.key, min: 1, max: 2000 } ]
    },
    OBSIDIAN_PLATEBODY: {
        id: 'OBSIDIAN_PLATEBODY',
        name: "Obsidian Platebody",
        type: 'platebody',
        icon: 'images/icons/obsidian_platebody.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ { key: STATS.DPS.key, min: 1, max: 3072000 } ]
    },
    DROW_SPELLWEAVER_BLADE: {
        id: 'DROW_SPELLWEAVER_BLADE',
        name: 'Drow Spellweaver Blade',
        type: 'sword',
        icon: 'images/icons/drow_spellweaver_blade.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 2,
        possibleStats: [ 
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 384000 },
            { key: STATS.DPS.key, min: 1, max: 3840000 },
         ]
    },

    // --- Sub-Zone: House of Shadows (Boss Lvl 675) ---
    DEMONWEAVE_CLOAK: {
        id: 'DEMONWEAVE_CLOAK',
        name: "Demon-Weave Cloak",
        type: 'platebody',
        icon: 'images/icons/demon-weave_cloak.png',
        width: 2, height: 3,
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ // Boss Item Bonus (Stats of a Level 685 Item)
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 393000 },
            { key: STATS.DPS.key, min: 1, max: 3930000 },
            { key: STATS.GOLD_GAIN.key, min: 1, max: 1800 },
        ]
    },

    // --- Sub-Zone: Matron's Court (Levels 676-699) ---
    SPIDER_CARAPACE_SHIELD: {
        id: 'SPIDER_CARAPACE_SHIELD',
        name: "Spider Carapace Shield",
        type: 'shield',
        icon: 'images/icons/spider_carapace_shield.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ 
            { key: STATS.DPS.key, min: 1, max: 2736000 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 273600 }
         ]
    },
    HIGH_PRIESTESS_ROBES: {
        id: 'HIGH_PRIESTESS_ROBES',
        name: "High Priestess' Robes",
        type: 'platebody',
        icon: 'images/icons/high_priestess_robes.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ { key: STATS.GOLD_GAIN.key, min: 1, max: 2000 } ]
    },

    // --- Sub-Zone: Spider Queen's Lair (Boss Lvl 700) ---
    THE_WEAVERS_ENVY: {
        id: 'THE_WEAVERS_ENVY',
        name: "The Weaver's Envy",
        type: 'sword',
        icon: 'images/icons/weavers_envy.png',
        width: 2, height: 3,
        isUnique: true,
        uniqueEffect: 'weaversEnvy',
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ { key: STATS.DPS.key, min: 1, max: 6200000 } ] // Boss Item Bonus (Stats of a Level 710 Item)
    },

    // ====================================================================================
    // --- Abyssal Rift (Levels 701-800) ---
    // ====================================================================================
    VOIDFORGED_HELM: {
        id: 'VOIDFORGED_HELM',
        name: "Voidforged Helm",
        type: 'helmet',
        icon: 'images/icons/voidforged_helm.png',
        width: 2, height: 2,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ 
            { key: STATS.DPS.key, min: 1, max: 3200000 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 320000 } 
         ]
    },
    VOIDFORGED_GREAVES: {
        id: 'VOIDFORGED_GREAVES',
        name: "Voidforged Greaves",
        type: 'platelegs',
        icon: 'images/icons/voidforged_greaves.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ 
            { key: STATS.DPS.key, min: 1, max: 5440000 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 544000 },
            { key: STATS.GOLD_GAIN.key, min: 1, max: 1800 }
         ]
    },
    SHADOW_WEAVE_TUNIC: {
        id: 'SHADOW_WEAVE_TUNIC',
        name: "Shadow-weave Tunic",
        type: 'platebody',
        icon: 'images/icons/shadow-weave_tunic.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ { key: STATS.DPS.key, min: 1, max: 6400000 } ]
    },
    SHADOW_WEAVE_SASH: {
        id: 'SHADOW_WEAVE_SASH',
        name: "Shadow-weave Sash",
        type: 'belt',
        icon: 'images/icons/shadow-weave_sash.png',
        width: 2, height: 1,
        canHaveSockets: true,
        maxSockets: 1,
        possibleStats: [ 
            { key: STATS.GOLD_GAIN.key, min: 1, max: 1700 },
            { key: STATS.DPS.key, min: 1, max: 3200000 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 320000 }
         ]
    },
    ABYSSAL_EDGE: {
        id: 'ABYSSAL_EDGE',
        name: "Abyssal Edge",
        type: 'sword',
        icon: 'images/icons/abyssal_edge.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ { key: STATS.CLICK_DAMAGE.key, min: 1, max: 800000 } ]
    },
    RIFT_WARD: {
        id: 'RIFT_WARD',
        name: "Rift Ward",
        type: 'shield',
        icon: 'images/icons/rift_ward.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ 
            { key: STATS.DPS.key, min: 1, max: 4160000 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 416000 },
            { key: STATS.GOLD_GAIN.key, min: 1, max: 1600 }
         ]
    },
    SOUL_EATER_RING: {
        id: 'SOUL_EATER_RING',
        name: "Soul Eater Ring",
        type: 'ring',
        icon: 'images/icons/soul_eater_ring.png',
        width: 1, height: 1,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ 
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 800000 },
            { key: STATS.GOLD_GAIN.key, min: 1, max: 1900 }
         ]
    },
    CHAOS_HOUND_COLLAR: {
        id: 'CHAOS_HOUND_COLLAR',
        name: "Chaos Hound Collar",
        type: 'necklace',
        icon: 'images/icons/chaos_hound_collar.png',
        width: 2, height: 2,
        canHaveSockets: true,
        maxSockets: 1,
        possibleStats: [ { key: STATS.GOLD_GAIN.key, min: 1, max: 2000 }, ]
    },
    FLESH_GOLEM_HEART: {
        id: 'FLESH_GOLEM_HEART',
        name: "Flesh Golem Heart",
        type: 'necklace',
        icon: 'images/icons/flesh_golem_heart.png',
        width: 2, height: 2,
        canHaveSockets: true,
        maxSockets: 1,
        possibleStats: [ { key: STATS.DPS.key, min: 1, max: 1280000 } ]
    },
    RIFT_STALKER_CLOAK: {
        id: 'RIFT_STALKER_CLOAK',
        name: "Rift Stalker Cloak",
        type: 'platebody',
        icon: 'images/icons/rift_stalker_cloak.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 1, max: 8192000 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 819200 }
        ]
    },

    // --- Unique Boss Drops for Abyssal Rift ---
    SOULCAGE_AMULET: {
        id: 'SOULCAGE_AMULET',
        name: "Soul-cage Amulet",
        type: 'necklace',
        icon: 'images/icons/soul-cage_amulet.png',
        width: 2, height: 2,
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 1,
        possibleStats: [ // Boss Item Bonus (Stats of a Level 810 Item)
            { key: STATS.DPS.key, min: 1, max: 1966080 },
            { key: STATS.GOLD_GAIN.key, min: 1, max: 2200 }
        ]
    },
    RING_OF_DESPAIR: {
        id: 'RING_OF_DESPAIR',
        name: "Ring of Despair",
        type: 'ring',
        icon: 'images/icons/ring_of_despair.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 5,
        width: 1, height: 1,
        possibleStats: [ 
            { key: STATS.GOLD_GAIN.key, min: 1, max: 2500 },
            { key: STATS.DPS.key, min: 1, max: 1408000 },
         ]
    },
    BALORS_WHIP: {
        id: 'BALORS_WHIP',
        name: "Balor's Whip",
        type: 'sword',
        icon: 'images/icons/balors_whip.png',
        isUnique: true,
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ // Boss Item Bonus (Stats of a Level 760 Item)
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 1080000 },
            { key: STATS.DPS.key, min: 1, max: 10800000 }
        ]
    },
    CHAOS_CORE: {
        id: 'CHAOS_CORE',
        name: "Chaos Core",
        type: 'belt',
        icon: 'images/icons/chaos_core.png',
        width: 2, height: 1,
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 1,
        possibleStats: [ // Boss Item Bonus (Stats of a Level 785 Item)
            { key: STATS.GOLD_GAIN.key, min: 1, max: 2400 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 432000 },
            { key: STATS.DPS.key, min: 1, max: 4320000 },
        ]
    }
};