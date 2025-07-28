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
            { key: STATS.DPS.key, min: 1, max: 144883 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 14064 },
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
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 50824 },
            { key: STATS.DPS.key, min: 1, max: 486774 }
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
        possibleStats: [ { key: STATS.CLICK_DAMAGE.key, min: 1, max: 80862 } ] // Specialist Bonus Applied
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
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 71228 },
            { key: STATS.DPS.key, min: 1, max: 715206 },
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
        possibleStats: [ // Boss Item Bonus (Stats of a Level 445 Item)
            { key: STATS.GOLD_GAIN.key, min: 1, max: 480 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 81898 },
            { key: STATS.DPS.key, min: 1, max: 825700 },
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
            { key: STATS.DPS.key, min: 1, max: 501309 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 53123 } ,
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
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 74900 } // Specialist Bonus Applied
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
            { key: STATS.DPS.key, min: 1, max: 240409 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 23640 },
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
        possibleStats: [ // Boss Item Bonus (Stats of a Level 470 Item)
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 191262 },
            { key: STATS.DPS.key, min: 1, max: 2056345 },
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
        possibleStats: [ { key: STATS.DPS.key, min: 1, max: 1025066 } ] // Specialist Bonus Applied
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
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 107693 },
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
        possibleStats: [ // Boss Item Bonus (Stats of a Level 495 Item)
            { key: STATS.DPS.key, min: 1, max: 1246199 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 125183 },
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
            { key: STATS.DPS.key, min: 1, max: 393962 }
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
            { key: STATS.DPS.key, min: 1, max: 999337 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 104719 },
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
        possibleStats: [ // Boss Item Bonus (Stats of a Level 520 Item)
            { key: STATS.DPS.key, min: 1, max: 818951 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 85331 },
            { key: STATS.GOLD_GAIN.key, min: 1, max: 750 }
        ]
    },

    // ====================================================================================
    // --- Fungal Forest (Levels 501-600) ---
    // ====================================================================================
    MYCONID_LEATHER_BELT: {
        id: 'MYCONID_LEATHER_BELT',
        name: "Myconid Leather Belt",
        type: 'belt',
        icon: 'images/icons/myconid_leather_belt.png',
        width: 2, height: 1,
        canHaveSockets: true,
        maxSockets: 1,
        possibleStats: [ 
            { key: STATS.DPS.key, min: 1, max: 475510 },
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
            { key: STATS.DPS.key, min: 1, max: 1283876 }
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
            { key: STATS.DPS.key, min: 1, max: 237755 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 23145 },
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
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 125139 },
            { key: STATS.DPS.key, min: 1, max: 1182276 }]
    },
    MYCONID_KINGS_CROWN: {
        id: 'MYCONID_KINGS_CROWN',
        name: "Myconid King's Crown",
        type: 'helmet',
        icon: 'images/icons/myconid_kings_crown.png',
        width: 2, height: 2,
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ // Boss Item Bonus (Stats of a Level 545 Item)
            { key: STATS.DPS.key, min: 1, max: 1211108 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 119842 },
            { key: STATS.GOLD_GAIN.key, min: 1, max: 950 } ]
    },
    SHRIEKER_AMULET: {
        id: 'SHRIEKER_AMULET',
        name: "Shrieker Amulet",
        type: 'necklace',
        icon: 'images/icons/shrieker_amulet.png',
        width: 2, height: 2,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ { key: STATS.CLICK_DAMAGE.key, min: 1, max: 104085 } ] // Specialist Bonus Applied
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
            { key: STATS.DPS.key, min: 1, max: 907293 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 92842 },
            { key: STATS.GOLD_GAIN.key, min: 1, max: 900 }       
        ]
    },
    FUNGAL_SPIRE: {
        id: 'FUNGAL_SPIRE',
        name: "Fungal Spire",
        type: 'sword',
        icon: 'images/icons/fungal_spire.png',
        width: 2, height: 3,
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ // Boss Item Bonus (Stats of a Level 570 Item)
            { key: STATS.DPS.key, min: 1, max: 2028682 },
            { key: STATS.GOLD_GAIN.key, min: 1, max: 1200 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 219717 }
        ]
    },
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
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 172993 } // Specialist Bonus Applied
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
            { key: STATS.DPS.key, min: 1, max: 699553 },
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
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 74673 },
            { key: STATS.DPS.key, min: 1, max: 700057 },
            { key: STATS.GOLD_GAIN.key, min: 1, max: 900 }
         ]
    },
    TITANS_FUNGAL_HEART: {
        id: 'TITANS_FUNGAL_HEART',
        name: "Titan's Fungal Heart",
        type: 'belt',
        icon: 'images/icons/titans_fungal_heart.png',
        width: 2, height: 1,
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 1,
        possibleStats: [ // Boss Item Bonus (Stats of a Level 595 Item)
            { key: STATS.DPS.key, min: 1, max: 1043743 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 105652 },
            { key: STATS.GOLD_GAIN.key, min: 1, max: 1300 },
        ]
    },
    SPORE_WOLF_PELT: {
        id: 'SPORE_WOLF_PELT',
        name: 'Spore-wolf Pelt',
        type: 'platebody',
        icon: 'images/icons/spore_wolf_pelt.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 1,
        possibleStats: [ { key: STATS.DPS.key, min: 1, max: 2362572 } ] // Specialist Bonus Applied
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
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 236040 },
            { key: STATS.GOLD_GAIN.key, min: 1, max: 1100 }
         ]
    },
    GREAT_FUNGUS_HEART: {
        id: 'GREAT_FUNGUS_HEART',
        name: "Great Fungus' Heart",
        type: 'necklace',
        icon: 'images/icons/great_fungus_heart.png',
        isUnique: true,
        width: 2, height: 2,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ // Boss Item Bonus (Stats of a Level 620 Item)
            { key: STATS.DPS.key, min: 1, max: 1435777 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 147571 },
            { key: STATS.GOLD_GAIN.key, min: 1, max: 1500 }
         ]
    },

    // ====================================================================================
    // --- Drow City (Levels 601-700) ---
    // ====================================================================================
    DROW_ASSASSINS_BLADE: {
        id: 'DROW_ASSASSINS_BLADE',
        name: "Drow Assassin's Blade",
        type: 'sword',
        icon: 'images/icons/drow_assassins_blade.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ { key: STATS.CLICK_DAMAGE.key, min: 1, max: 367252 } ] // Specialist Bonus Applied
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
            { key: STATS.DPS.key, min: 1, max: 994665 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 99343 }
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
            { key: STATS.DPS.key, min: 1, max: 1989330 },
            { key: STATS.GOLD_GAIN.key, min: 1, max: 1100 }
         ]
    },
    DROW_MATRONS_SIGNET: {
        id: 'DROW_MATRONS_SIGNET',
        name: "Drow Matron's Signet",
        type: 'ring',
        icon: 'images/icons/drow_matrons_signet.png',
        width: 1, height: 1,
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ // Boss Item Bonus (Stats of a Level 645 Item)
            { key: STATS.DPS.key, min: 1, max: 1470710 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 149488 },
        ]
    },
    SHADOW_SPUN_LEGGINGS: {
        id: 'SHADOW_SPUN_LEGGINGS',
        name: "Shadow-spun Leggings",
        type: 'platelegs',
        icon: 'images/icons/shadow-spun_leggings.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ 
            { key: STATS.DPS.key, min: 1, max: 2232938 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 222874 },
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
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 252190 },
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
            { key: STATS.DPS.key, min: 1, max: 1260950 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 125191 }
         ]
    },
    LOLTHS_EMBRACE: {
        id: 'LOLTHS_EMBRACE',
        name: "Lolth's Embrace",
        type: 'platebody',
        icon: 'images/icons/lolths_embrace.png',
        width: 2, height: 3,
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ // Boss Item Bonus (Stats of a Level 670 Item)
            { key: STATS.DPS.key, min: 1, max: 3410714 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 342411 },
         ]
    },
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
        possibleStats: [ { key: STATS.DPS.key, min: 1, max: 2800332 } ] // Specialist Bonus Applied
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
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 345098 },
            { key: STATS.DPS.key, min: 1, max: 3504191 },
         ]
    },
    DEMONWEAVE_CLOAK: {
        id: 'DEMONWEAVE_CLOAK',
        name: "Demon-Weave Cloak",
        type: 'platebody',
        icon: 'images/icons/demon-weave_cloak.png',
        width: 2, height: 3,
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ // Boss Item Bonus (Stats of a Level 695 Item)
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 360064 },
            { key: STATS.DPS.key, min: 1, max: 3603417 },
            { key: STATS.GOLD_GAIN.key, min: 1, max: 1800 },
        ]
    },
    SPIDER_CARAPACE_SHIELD: {
        id: 'SPIDER_CARAPACE_SHIELD',
        name: "Spider Carapace Shield",
        type: 'shield',
        icon: 'images/icons/spider_carapace_shield.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ 
            { key: STATS.DPS.key, min: 1, max: 2501064 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 243916 }
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
        possibleStats: [ { key: STATS.DPS.key, min: 1, max: 5900593 } ] // Boss Item Bonus (Stats of a Level 720 Item) + Specialist Bonus
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
            { key: STATS.DPS.key, min: 1, max: 2920320 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 291776 } 
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
            { key: STATS.DPS.key, min: 1, max: 4964544 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 496019 },
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
        possibleStats: [ { key: STATS.DPS.key, min: 1, max: 6736735 } ] // Specialist Bonus Applied
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
            { key: STATS.DPS.key, min: 1, max: 2920320 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 291264 }
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
        possibleStats: [ { key: STATS.CLICK_DAMAGE.key, min: 1, max: 887204 } ] // Specialist Bonus Applied
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
            { key: STATS.DPS.key, min: 1, max: 3796416 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 379555 },
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
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 730080 },
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
        possibleStats: [ { key: STATS.DPS.key, min: 1, max: 1421443 } ] // Specialist Bonus Applied
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
            { key: STATS.DPS.key, min: 1, max: 7464960 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 745814 }
        ]
    },
    SOULCAGE_AMULET: {
        id: 'SOULCAGE_AMULET',
        name: "Soul-cage Amulet",
        type: 'necklace',
        icon: 'images/icons/soul-cage_amulet.png',
        width: 2, height: 2,
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 1,
        possibleStats: [ // Boss Item Bonus (Stats of a Level 820 Item)
            { key: STATS.DPS.key, min: 1, max: 2187320 },
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
        possibleStats: [ // Boss Item Bonus (Stats of a Level 780 Item)
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 978912 },
            { key: STATS.DPS.key, min: 1, max: 9840960 }
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
        possibleStats: [ // Boss Item Bonus (Stats of a Level 805 Item)
            { key: STATS.GOLD_GAIN.key, min: 1, max: 2400 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 407076 },
            { key: STATS.DPS.key, min: 1, max: 4035978 },
        ]
    }
};