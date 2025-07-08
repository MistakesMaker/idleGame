// --- START OF FILE data/items/overworld_items.js ---

import { STATS } from '../stat_pools.js';

// ====================================================================================
// --- Green Meadows Zone (Levels 1-100) ---
// ====================================================================================
const greenMeadowsItems = {
    // --- Sub-Zone: Verdant Fields (Levels 1-24) ---
    RUSTY_SWORD: {
        id: 'RUSTY_SWORD',
        name: "Rusty Sword",
        type: 'sword',
        icon: 'images/icons/rusty_sword.png',
        width: 2, height: 3,
        possibleStats: [ { key: STATS.CLICK_DAMAGE.key, min: 1, max: 15 } ]
    },
    LEATHER_CAP: {
        id: 'LEATHER_CAP',
        name: "Leather Cap",
        type: 'helmet',
        icon: 'images/icons/leather_cap.png',
        width: 2, height: 2,
        possibleStats: [ 
            { key: STATS.GOLD_GAIN.key, min: 1, max: 8 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 1 }
         ]
    },
    LEATHER_TUNIC: {
        id: 'LEATHER_TUNIC',
        name: "Leather Tunic",
        type: 'platebody',
        icon: 'images/icons/leather_tunic.png',
        width: 2, height: 3,
        possibleStats: [ 
            { key: STATS.DPS.key, min: 50, max: 150 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 1 }
         ]
    },
    IRON_SHORTSWORD: {
        id: 'IRON_SHORTSWORD',
        name: "Iron Shortsword",
        type: 'sword',
        icon: 'images/icons/iron_shortsword.png',
        width: 2, height: 3,
        possibleStats: [ { key: STATS.CLICK_DAMAGE.key, min: 10, max: 30 } ]
    },
    WOODEN_SHIELD: {
        id: 'WOODEN_SHIELD',
        name: "Wooden Shield",
        type: 'shield',
        icon: 'images/icons/wooden_shield.png',
        width: 2, height: 3,
        possibleStats: [ { key: STATS.DPS.key, min: 50, max: 250 } ]
    },
    LEATHER_BELT: {
        id: 'LEATHER_BELT',
        name: "Leather Belt",
        type: 'belt',
        icon: 'images/icons/leather_belt.png',
        width: 2, height: 1,
        possibleStats: [ 
            { key: STATS.DPS.key, min: 30, max: 90 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 1 }
         ]
    },
    LEATHER_TROUSERS: {
        id: 'LEATHER_TROUSERS',
        name: "Leather Trousers",
        type: 'platelegs',
        icon: 'images/icons/leather_trousers.png',
        width: 2, height: 3,
        possibleStats: [ 
            { key: STATS.DPS.key, min: 30, max: 100 },
            { key: STATS.CLICK_DAMAGE.key, min: 1, max: 1 }
         ]
    },
    SIMPLE_SASH: {
        id: 'SIMPLE_SASH',
        name: "Simple Sash",
        type: 'belt',
        icon: 'images/icons/simple_sash.png',
        width: 2, height: 1,
        possibleStats: [ { key: STATS.DPS.key, min: 20, max: 60 } ]
    },

    // --- Sub-Zone: General's Outpost (Boss Lvl 25) ---
    STEEL_LONGSWORD: {
        id: 'STEEL_LONGSWORD',
        name: "Steel Longsword",
        type: 'sword',
        icon: 'images/icons/steel_longsword.png',
        width: 2, height: 3,
        possibleStats: [ { key: STATS.CLICK_DAMAGE.key, min: 25, max: 75 } ]
    },
    IRON_KITESHIELD: {
        id: 'IRON_KITESHIELD',
        name: "Iron Kiteshield",
        type: 'shield',
        icon: 'images/icons/iron_kiteshield.png',
        width: 2, height: 3,
        possibleStats: [ 
            { key: STATS.DPS.key, min: 500, max: 1000 },
            { key: STATS.CLICK_DAMAGE.key, min: 5, max: 15 }        
         ]
    },
    GLADIATORS_LONGSWORD: {
        id: 'GLADIATORS_LONGSWORD',
        name: "Gladiator's Longsword",
        type: 'sword',
        icon: 'images/icons/gladiators_longsword.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 20, max: 100 },
            { key: STATS.DPS.key, min: 500, max: 2500 }
        ]
    },
    VISAGE_OF_THE_ABYSS: {
        id: 'VISAGE_OF_THE_ABYSS',
        name: "Slimey Strawhat",
        type: 'helmet',
        icon: 'images/icons/slimey_strawhat.png',
        width: 2, height: 2,
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 1000, max: 3000 },
            { key: STATS.GOLD_GAIN.key, min: 10, max: 30 },
            { key: STATS.MAGIC_FIND.key, min: 0.5, max: 1.5 },
        ]
    },

    // --- Sub-Zone: Whispering Woods (Levels 26-49) ---
    SIMPLE_PENDANT: {
        id: 'SIMPLE_PENDANT',
        name: "Simple Pendant",
        type: 'necklace',
        icon: 'images/icons/simple_pendant.png',
        width: 2, height: 2,
        possibleStats: [ { key: STATS.GOLD_GAIN.key, min: 2, max: 6 } ]
    },
    IRON_RING: {
        id: 'IRON_RING',
        name: "Iron Ring",
        type: 'ring',
        icon: 'images/icons/iron_ring.png',
        width: 1, height: 1,
        possibleStats: [ { key: STATS.DPS.key, min: 30, max: 90 } ]
    },
    SERRATED_DAGGER: {
        id: 'SERRATED_DAGGER',
        name: "Serrated Dagger",
        type: 'sword',
        icon: 'images/icons/serrated_dagger.png',
        width: 2, height: 3,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 40, max: 120 },
            { key: STATS.DPS.key, min: 8000, max: 12000 }
        ]
    },
    CHAINMAIL_HAUBERK: {
        id: 'CHAINMAIL_HAUBERK',
        name: "Chainmail Hauberk",
        type: 'platebody',
        icon: 'images/icons/chainmail_hauberk.png',
        width: 2, height: 3,
        possibleStats: [ { key: STATS.DPS.key, min: 120, max: 360 } ]
    },
    CHAINMAIL_LEGGINGS: {
        id: 'CHAINMAIL_LEGGINGS',
        name: "Chainmail Leggings",
        type: 'platelegs',
        icon: 'images/icons/chainmail_leggings.png',
        width: 2, height: 3,
        possibleStats: [ 
            { key: STATS.DPS.key, min: 100, max: 300 },
            { key: STATS.CLICK_DAMAGE.key, min: 5, max: 20 }
         ]
    },
    BRONZE_BUCKLER: {
        id: 'BRONZE_BUCKLER',
        name: "Bronze Buckler",
        type: 'shield',
        icon: 'images/icons/bronze_buckler.png',
        width: 2, height: 3,
        possibleStats: [ { key: STATS.DPS.key, min: 200, max: 500 } ]
    },
    STUDDED_LEATHER_BELT: {
        id: 'STUDDED_LEATHER_BELT',
        name: "Studded Leather Belt",
        type: 'belt',
        icon: 'images/icons/studded_leather_belt.png',
        width: 2, height: 1,
        possibleStats: [ { key: STATS.DPS.key, min: 120, max: 300 } ]
    },

    // --- Sub-Zone: Guardian's Knoll (Boss Lvl 50) ---
    TOWER_SHIELD: {
        id: 'TOWER_SHIELD',
        name: "Tower Shield",
        type: 'shield',
        icon: 'images/icons/tower_shield.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 1,
        possibleStats: [ 
            { key: STATS.DPS.key, min: 500, max: 1500 },
            { key: STATS.CLICK_DAMAGE.key, min: 25, max: 30 },
         ]
    },
    AEGIS_OF_THE_GUARDIAN: {
        id: 'AEGIS_OF_THE_GUARDIAN',
        name: "Aegis of the Guardian",
        type: 'shield',
        icon: 'images/icons/aegis_of_the_guardian.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 2,
        possibleStats: [
            { key: STATS.DPS.key, min: 1000, max: 2500 },
            { key: STATS.MAGIC_FIND.key, min: 1, max: 2.5 },
        ]
    },
    GIRDLE_OF_COLOSSAL_STRENGTH: {
        id: 'GIRDLE_OF_COLOSSAL_STRENGTH',
        name: "Slimey Belt",
        type: 'belt',
        icon: 'images/icons/slimey_belt.png',
        width: 2, height: 1,
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 50, max: 250 },
            { key: STATS.DPS.key, min: 1500, max: 3500 },
        ]
    },
    RUNIC_BLADE: {
        id: 'RUNIC_BLADE',
        name: "Runic Blade",
        type: 'sword',
        icon: 'images/icons/runic_blade.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 80, max: 150 },
            { key: STATS.DPS.key, min: 1500, max: 4000 }
        ]
    },

    // --- Sub-Zone: Sun-dappled Hills (Levels 51-74) ---
    MIGHTY_BELT: {
        id: 'MIGHTY_BELT',
        name: "Mighty Belt",
        type: 'belt',
        icon: 'images/icons/mighty_belt.png',
        width: 2, height: 1,
        possibleStats: [ { key: STATS.DPS.key, min: 100, max: 800 } ]
    },
    IRON_HELM: {
        id: 'IRON_HELM',
        name: "Iron Helm",
        type: 'helmet',
        icon: 'images/icons/iron_helm.png',
        width: 2, height: 2,
        possibleStats: [ 
            { key: STATS.GOLD_GAIN.key, min: 5, max: 15 },
            { key: STATS.CLICK_DAMAGE.key, min: 10, max: 15 }
         ]
    },
    IRON_PLATELEGS: {
        id: 'IRON_PLATELEGS',
        name: "Iron Platelegs",
        type: 'platelegs',
        icon: 'images/icons/iron_platelegs.png',
        width: 2, height: 3,
        possibleStats: [ { key: STATS.DPS.key, min: 250, max: 500 } ]
    },
    SILVER_LOCKET: {
        id: 'SILVER_LOCKET',
        name: "Silver Locket",
        type: 'necklace',
        icon: 'images/icons/silver_locket.png',
        width: 2, height: 2,
        possibleStats: [ { key: STATS.GOLD_GAIN.key, min: 5, max: 15 } ]
    },
    SILVER_RING: {
        id: 'SILVER_RING',
        name: "Silver Ring",
        type: 'ring',
        icon: 'images/icons/silver_ring.png',
        width: 1, height: 1,
        possibleStats: [ { key: STATS.GOLD_GAIN.key, min: 3, max: 9 } ]
    },
    KNIGHTS_PLATELEGS: {
        id: 'KNIGHTS_PLATELEGS',
        name: "Knight's Platelegs",
        type: 'platelegs',
        icon: 'images/icons/knights_platelegs.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 1,
        possibleStats: [ 
        { key: STATS.CLICK_DAMAGE.key, min: 50, max: 150 }, ]
    },

    // --- Sub-Zone: Royal Vanguard (Boss Lvl 75) ---
    AMULET_OF_POWER: {
        id: 'AMULET_OF_POWER',
        name: "Amulet of Power",
        type: 'necklace',
        icon: 'images/icons/amulet_of_power.png',
        width: 2, height: 2,
        isUnique: true,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 200, max: 250 },
            { key: STATS.DPS.key, min: 400, max: 750 }
        ]
    },
    RING_OF_WEALTH: {
        id: 'RING_OF_WEALTH',
        name: "Ring of Wealth",
        type: 'ring',
        icon: 'images/icons/ring_of_wealth.png',
        width: 1, height: 1,
        possibleStats: [ { key: STATS.GOLD_GAIN.key, min: 10, max: 25 } ]
    },
    BAND_OF_ETERNAL_SORROW: {
        id: 'BAND_OF_ETERNAL_SORROW',
        name: "Slimy Ring",
        type: 'ring',
        icon: 'images/icons/slimey_ring.png',
        width: 1, height: 1,
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 2,
        possibleStats: [
            { key: STATS.MAGIC_FIND.key, min: 3, max: 5 },
            { key: STATS.GOLD_GAIN.key, min: 10, max: 40 },
        ]
    },

    // --- Sub-Zone: Royal Hunting Grounds (Levels 76-99) ---
    HUNTERS_MEDALLION: {
        id: 'HUNTERS_MEDALLION',
        name: "Hunter's Medallion",
        type: 'necklace',
        icon: 'images/icons/hunters_medallion.png', // ICON PATH CORRECTED
        width: 2, height: 2,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 150, max: 400 },
            { key: STATS.GOLD_GAIN.key, min: 10, max: 25 },
        ]
    },

    // --- Sub-Zone: King's Castle (Boss Lvl 100) ---
    ROYAL_CIRCLET: {
        id: 'ROYAL_CIRCLET',
        name: "Royal Circlet",
        type: 'helmet',
        icon: 'images/icons/royal_circlet.png',
        width: 2, height: 2,
        canHaveSockets: true,
        maxSockets: 2,
        possibleStats: [
            { key: STATS.GOLD_GAIN.key, min: 30, max: 40 },
            { key: STATS.MAGIC_FIND.key, min: 1, max: 3 },
        ]
    },
    SEAL_OF_THE_KING: {
        id: 'SEAL_OF_THE_KING',
        name: "Seal of the King",
        type: 'ring',
        icon: 'images/icons/seal_of_the_king.png',
        canHaveSockets: true,
        maxSockets: 1,
        width: 1, height: 1,
        isUnique: true,
        possibleStats: [
            { key: STATS.GOLD_GAIN.key, min: 25, max: 50 },
            { key: STATS.MAGIC_FIND.key, min: 1.5, max: 4.5 },
        ]
    },
    HEART_OF_THE_VOLCANO: {
        id: 'HEART_OF_THE_VOLCANO',
        name: "Slimey Sword",
        type: 'sword',
        icon: 'images/icons/slimey_sword.png',
        width: 2, height: 3,
        isUnique: true,
        uniqueEffect: 'slimeSplit',
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 400, max: 900 },
            { key: STATS.DPS.key, min: 2000, max: 6500 },
            { key: STATS.GOLD_GAIN.key, min: 20, max: 20 },
        ]
    },
};

// ====================================================================================
// --- Orc Volcano Zone (Levels 101-200) ---
// ====================================================================================
const orcVolcanoItems = {
    // --- Sub-Zone: Ashfall Plains (Levels 101-124) ---
    IRON_PLATEBODY: {
        id: 'IRON_PLATEBODY',
        name: "Iron Platebody",
        type: 'platebody',
        icon: 'images/icons/iron_platebody.png',
        width: 2, height: 3,
        possibleStats: [ 
            { key: STATS.DPS.key, min: 300, max: 900 },
            { key: STATS.CLICK_DAMAGE.key, min: 10, max: 30 }
         ]
    },
    RUBY_AMULET: {
        id: 'RUBY_AMULET',
        name: "Ruby Amulet",
        type: 'necklace',
        icon: 'images/icons/ruby_amulet.png',
        width: 2, height: 2,
        possibleStats: [ { key: STATS.CLICK_DAMAGE.key, min: 1000, max: 1500} ]
    },
    IRON_GIRDLE: {
        id: 'IRON_GIRDLE',
        name: "Iron Girdle",
        type: 'belt',
        icon: 'images/icons/iron_girdle.png',
        width: 2, height: 1,
        possibleStats: [ { key: STATS.DPS.key, min: 300, max: 900 } ]
    },

    // --- Sub-Zone: Orc Watchtower (Boss Lvl 125) ---
    BELT_OF_THE_GIANT: {
        id: 'BELT_OF_THE_GIANT',
        name: "Belt of the Giant",
        type: 'belt',
        icon: 'images/icons/belt_of_the_giant.png',
        width: 2, height: 1,
        isUnique: true,
        possibleStats: [
            { key: STATS.DPS.key, min: 2000, max: 6000 },
            { key: STATS.CLICK_DAMAGE.key, min: 50, max: 550 },
        ]
    },
    ORCISH_CLEAVER: {
        id: 'ORCISH_CLEAVER',
        name: "Orcish Cleaver",
        type: 'sword',
        icon: 'images/icons/orcish_cleaver.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 2,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 100, max: 1500 },
            { key: STATS.GOLD_GAIN.key, min: 5, max: 15 }
        ]
    },
    STEEL_PLATEMAIL: {
        id: 'STEEL_PLATEMAIL',
        name: "Steel Platemail",
        type: 'platebody',
        icon: 'images/icons/steel_platemail.png',
        width: 2, height: 3,
        possibleStats: [ { key: STATS.DPS.key, min: 800, max: 2400 } ]
    },

    // --- Sub-Zone: Scorched Path (Levels 126-149) ---
    MAGE_HOOD: {
        id: 'MAGE_HOOD',
        name: "Mage Hood",
        type: 'helmet',
        icon: 'images/icons/mage_hood.png',
        width: 2, height: 2,
        canHaveSockets: true,
        maxSockets: 2,
        possibleStats: [
            { key: STATS.GOLD_GAIN.key, min: 20, max: 60 },
            { key: STATS.MAGIC_FIND.key, min: 0.5, max: 1.5 },
        ]
    },
    SAPPHIRE_AMULET: {
        id: 'SAPPHIRE_AMULET',
        name: "Sapphire Amulet",
        type: 'necklace',
        icon: 'images/icons/sapphire_amulet.png',
        width: 2, height: 2,
        possibleStats: [ { key: STATS.DPS.key, min: 600, max: 1300 } ]
    },
    SASH_OF_THE_SORCERER: {
        id: 'SASH_OF_THE_SORCERER',
        name: "Sash of the Sorcerer",
        type: 'belt',
        icon: 'images/icons/sash_of_the_sorcerer.png',
        width: 2, height: 1,
        possibleStats: [
            { key: STATS.GOLD_GAIN.key, min: 20, max: 60 },
            { key: STATS.MAGIC_FIND.key, min: 1, max: 1.5 },
        ]
    },
    STEEL_HEATER: {
        id: 'STEEL_HEATER',
        name: "Steel Heater",
        type: 'shield',
        icon: 'images/icons/steel_heater.png',
        width: 2, height: 3,
        possibleStats: [ 
            { key: STATS.DPS.key, min: 2200, max: 5000 },
            { key: STATS.CLICK_DAMAGE.key, min: 50, max: 400 }
         ]
    },
    STEEL_FULL_HELM: {
        id: 'STEEL_FULL_HELM',
        name: "Steel Full Helm",
        type: 'helmet',
        icon: 'images/icons/steel_full_helm.png',
        width: 2, height: 2,
        possibleStats: [ 
            { key: STATS.GOLD_GAIN.key, min: 12, max: 36 },
            { key: STATS.CLICK_DAMAGE.key, min: 20, max: 60 }
         ]
    },

    // --- Sub-Zone: Molten Heart (Boss Lvl 150) ---
    OBSIDIAN_GREATHELM: {
        id: 'OBSIDIAN_GREATHELM',
        name: 'Obsidian Greathelm',
        type: 'helmet',
        icon: 'images/icons/obsidian_greathelm.png', // ICON PATH CORRECTED
        width: 2, height: 2,
        canHaveSockets: true,
        maxSockets: 2,
        possibleStats: [
            { key: STATS.DPS.key, min: 3000, max: 7000 },
            { key: STATS.CLICK_DAMAGE.key, min: 500, max: 800 },
        ]
    },

    // --- Sub-Zone: Charred Forest (Levels 151-174) ---
    SUNSTONE_BUCKLE: {
        id: 'SUNSTONE_BUCKLE',
        name: "Sunstone Buckle",
        type: 'belt',
        icon: 'images/icons/sunstone_buckle.png',
        width: 2, height: 1,
        possibleStats: [
            { key: STATS.DPS.key, min: 3000, max: 9000 },
            { key: STATS.GOLD_GAIN.key, min: 20, max: 60 },
        ]
    },
    VOLCANIC_ROCK_RING: {
        id: 'VOLCANIC_ROCK_RING',
        name: "Volcanic Rock Ring",
        type: 'ring',
        icon: 'images/icons/volcanic_rock_ring.png', // ICON PATH CORRECTED
        width: 1, height: 1,
        possibleStats: [
            { key: STATS.DPS.key, min: 1000, max: 1500 },
        ]
    },

    // --- Sub-Zone: Chieftain's Camp (Boss Lvl 175) ---.
    OBSIDIAN_BAND: {
        id: 'OBSIDIAN_BAND',
        name: "Obsidian Band",
        type: 'ring',
        icon: 'images/icons/obsidian_band.png',
        width: 1, height: 1,
        canHaveSockets: true,
        maxSockets: 1,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 500, max: 2500 },
        ]
    },
    
    // --- Sub-Zone: Volcano's Maw (Levels 176-199) ---
    MITHRIL_SCIMITAR: {
        id: 'MITHRIL_SCIMITAR',
        name: "Mithril scimitar",
        type: 'sword',
        icon: 'images/icons/mithril_scimitar.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [ { key: STATS.CLICK_DAMAGE.key, min: 1250, max: 5500 } ]
    },
    MAGMA_FORGED_GREAVES: {
        id: 'MAGMA_FORGED_GREAVES',
        name: "Magma-Forged Greaves",
        type: 'platelegs',
        icon: 'images/icons/magma-forged_greaves.png', // ICON PATH CORRECTED
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 2,
        possibleStats: [
            { key: STATS.DPS.key, min: 5000, max: 12000 },
            { key: STATS.CLICK_DAMAGE.key, min: 30, max: 100 },
        ]
    },

    // --- Sub-Zone: Volcano Peak (Boss Lvl 200) ---
    HELM_OF_VALOR: {
        id: 'HELM_OF_VALOR',
        name: "Helm of Valor",
        type: 'helmet',
        icon: 'images/icons/helm_of_valor.png',
        width: 2, height: 2,
        canHaveSockets: true,
        maxSockets: 2,
        possibleStats: [
            { key: STATS.DPS.key, min: 10000, max: 30000 },
            { key: STATS.GOLD_GAIN.key, min: 50, max: 100 },
        ]
    },
};

// ====================================================================================
// --- Undead Desert Zone (Levels 201-300) ---
// ====================================================================================
const undeadDesertItems = {
    // --- Sub-Zone: Lost Tombs (Levels 201-224) ---
    STEEL_GREAVES: {
        id: 'STEEL_GREAVES',
        name: "Steel Greaves",
        type: 'platelegs',
        icon: 'images/icons/steel_greaves.png',
        width: 2, height: 3,
        possibleStats: [ { key: STATS.DPS.key, min: 700, max: 2100 },
            { key: STATS.CLICK_DAMAGE.key, min: 20, max: 220 }
         ]
    },
    BAND_OF_MIGHT: {
        id: 'BAND_OF_MIGHT',
        name: "Band of Might",
        type: 'ring',
        icon: 'images/icons/band_of_might.png',
        width: 1, height: 1,
        possibleStats: [ { key: STATS.CLICK_DAMAGE.key, min: 500, max: 1500 } ]
    },

    // --- Sub-Zone: Mummy's Crypt (Boss Lvl 225) ---
    SANDSTRIDER_LEGGINGS: {
        id: 'SANDSTRIDER_LEGGINGS',
        name: "Sandstrider Leggings",
        type: 'platelegs',
        icon: 'images/icons/sandstrider_leggings.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 5000, max: 15000 },
            { key: STATS.GOLD_GAIN.key, min: 25, max: 75 },
        ]
    },
    CARAPACE_OF_THE_SCARAB: {
        id: 'CARAPACE_OF_THE_SCARAB',
        name: "Carapace of the Scarab",
        type: 'platebody',
        icon: 'images/icons/carapace_of_the_scarab.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 4000, max: 12000 },
            { key: STATS.CLICK_DAMAGE.key, min: 100, max: 120 },
            { key: STATS.GOLD_GAIN.key, min: 20, max: 60 },
        ]
    },
    AMULET_OF_THE_VIPER: {
        id: 'AMULET_OF_THE_VIPER',
        name: "Amulet of the Viper",
        type: 'necklace',
        icon: 'images/icons/amulet_of_the_viper.png',
        width: 2, height: 2,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 1500, max: 4500 },
            { key: STATS.MAGIC_FIND.key, min: 1, max: 3 },
        ]
    },

    // --- Sub-Zone: Shifting Sands (Levels 226-249) ---
    APPRENTICE_ROBE: {
        id: 'APPRENTICE_ROBE',
        name: "Apprentice Robe",
        type: 'platebody',
        icon: 'images/icons/apprentice_robe.png',
        width: 2, height: 3,
         canHaveSockets: true,
        maxSockets: 2,
        possibleStats: [ { key: STATS.GOLD_GAIN.key, min: 200, max: 500 } ]
    },
    MAGE_PANTS: {
        id: 'MAGE_PANTS',
        name: "Mage Pants",
        type: 'platelegs',
        icon: 'images/icons/mage_pants.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.GOLD_GAIN.key, min: 15, max: 45 },
            { key: STATS.MAGIC_FIND.key, min: 5, max: 5 }, // Note: Min and max are the same here
        ]
    },
    BONE_SHIELD: {
        id: 'BONE_SHIELD',
        name: "Bone Shield",
        type: 'shield',
        icon: 'images/icons/bone_shield.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 2,
        possibleStats: [
            { key: STATS.DPS.key, min: 7000, max: 10000 },
            { key: STATS.GOLD_GAIN.key, min: 15, max: 30 },
        ]
    },
    BAND_OF_AGILITY: {
        id: 'BAND_OF_AGILITY',
        name: "Band of Agility",
        type: 'ring',
        icon: 'images/icons/band_of_agility.png',
        width: 1, height: 1,
        possibleStats: [ { key: STATS.DPS.key, min: 2000, max: 3000 } ]
    },

    // --- Sub-Zone: Cursed Pyramid (Boss Lvl 250) ---
    GOLD_RING: {
        id: 'GOLD_RING',
        name: "Gold Ring",
        type: 'ring',
        icon: 'images/icons/gold_ring.png',
        width: 1, height: 1,
        possibleStats: [ { key: STATS.GOLD_GAIN.key, min: 100, max: 250 } ]
    },
    EMERALD_CHARM: {
        id: 'EMERALD_CHARM',
        name: "Emerald Charm",
        type: 'necklace',
        icon: 'images/icons/emerald_charm.png',
        width: 2, height: 2,
        possibleStats: [ { key: STATS.MAGIC_FIND.key, min: 10, max: 10 } ]
    },

    // --- Sub-Zone: Scorpion Nest (Levels 251-274) ---
    SPIKED_BULWARK: {
        id: 'SPIKED_BULWARK',
        name: "Spiked Bulwark",
        type: 'shield',
        icon: 'images/icons/spiked_bulwark.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 300, max: 2500 },
        ]
    },
    MITHRIL_CHAINMAIL: {
        id: 'MITHRIL_CHAINMAIL',
        name: "Mithril Chainmail",
        type: 'platebody',
        icon: 'images/icons/mithril_chainmail.png',
        width: 2, height: 3,
        possibleStats: [ { key: STATS.DPS.key, min: 2000, max: 6000 } ]
    },
    TOPAZ_TALISMAN: {
        id: 'TOPAZ_TALISMAN',
        name: "Topaz Talisman",
        type: 'necklace',
        icon: 'images/icons/topaz_talisman.png',
        width: 2, height: 2,
        possibleStats: [ { key: STATS.MAGIC_FIND.key, min: 5, max: 10 } ]
    },
    BONE_LEGPLATES: {
        id: 'BONE_LEGPLATES',
        name: "Bone Legplates",
        type: 'platelegs',
        icon: 'images/icons/bone_legplates.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 3500, max: 10500 },
            { key: STATS.MAGIC_FIND.key, min: 1, max: 3 },
        ]
    },
    SKULL_HELM: {
        id: 'SKULL_HELM',
        name: "Skull Helm",
        type: 'helmet',
        icon: 'images/icons/skull_helm.png',
        width: 2, height: 2,
        canHaveSockets: true,
        maxSockets: 2,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 500, max: 1000 },
            { key: STATS.MAGIC_FIND.key, min: 1, max: 3 },
        ]
    },

    // --- Sub-Zone: Tomb of the Guardian (Boss Lvl 275) ---
    SCARAB_BROOCH: {
        id: 'SCARAB_BROOCH',
        name: "Scarab Brooch",
        type: 'necklace',
        icon: 'images/icons/scarab_brooch.png', // ICON PATH CORRECTED
        width: 2, height: 2,
        canHaveSockets: true,
        maxSockets: 1,
        isUnique: true,
        possibleStats: [
            { key: STATS.MAGIC_FIND.key, min: 5, max: 15 },
            { key: STATS.GOLD_GAIN.key, min: 25, max: 75 },
        ]
    },

    // --- Sub-Zone: Endless Dunes (Levels 276-299) ---
    PHARAOHS_CURSE: {
        id: 'PHARAOHS_CURSE',
        name: "Pharaoh's Curse",
        type: 'shield',
        icon: 'images/icons/pharaohs_curse.png', // ICON PATH CORRECTED
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 2000, max: 8000 },
            { key: STATS.GOLD_GAIN.key, min: 20, max: 50 },
        ]
    },
    DUNE_STRIDERS_SASH: {
        id: 'DUNE_STRIDERS_SASH',
        name: "Dune Strider's Sash",
        type: 'belt',
        icon: 'images/icons/dune_striders_sash.png', // ICON PATH CORRECTED
        width: 2, height: 1,
        canHaveSockets: true,
        maxSockets: 1,
        possibleStats: [
            { key: STATS.GOLD_GAIN.key, min: 30, max: 90 },
            { key: STATS.MAGIC_FIND.key, min: 2, max: 5 },
            { key: STATS.CLICK_DAMAGE.key, min: 750, max: 1250 },
        ]
    },

    // --- Sub-Zone: The Sand Pit (Boss Lvl 300) ---
    BLADE_OF_THE_SPECTRE: {
        id: 'BLADE_OF_THE_SPECTRE',
        name: "Blade of the Spectre",
        type: 'sword',
        icon: 'images/icons/blade_of_the_spectre.png',
        width: 2, height: 3,
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 2500, max: 11000 },
            { key: STATS.MAGIC_FIND.key, min: 1, max: 3 }
        ]
    },
    SIGNET_OF_THE_LEECH: {
        id: 'SIGNET_OF_THE_LEECH',
        name: "Signet of the Leech",
        type: 'ring',
        icon: 'images/icons/signet_of_the_leech.png',
        width: 1, height: 1,
        isUnique: true,
        possibleStats: [
            { key: STATS.DPS.key, min: 2000, max: 6000 },
            { key: STATS.MAGIC_FIND.key, min: 1, max: 3 },
        ]
    },
};

// ====================================================================================
// --- Final Dungeon Zone (Levels 301-400) ---
// ====================================================================================
const finalDungeonItems = {
    // --- Sub-Zone: Gatehouse & Halls of Damnation (Levels 301-349) ---
    IMPISH_HORN: {
        id: 'IMPISH_HORN',
        name: "Impish Horn",
        type: 'helmet',
        icon: 'images/icons/impish_horn.png', // ICON PATH CORRECTED
        width: 2, height: 2,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 800, max: 2400 },
            { key: STATS.MAGIC_FIND.key, min: 1, max: 4 },
        ]
    },
    BLOODSTONE_PENDANT: {
        id: 'BLOODSTONE_PENDANT',
        name: "Bloodstone Pendant",
        type: 'necklace',
        icon: 'images/icons/bloodstone_pendant.png',
        width: 2, height: 2,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 1000, max: 3000 },
            { key: STATS.DPS.key, min: 2000, max: 6000 },
        ]
    },
    GREAVES_OF_HASTE: {
        id: 'GREAVES_OF_HASTE',
        name: "Greaves of Haste",
        type: 'platelegs',
        icon: 'images/icons/greaves_of_haste.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 3000, max: 9000 },
            { key: STATS.CLICK_DAMAGE.key, min: 50, max: 2400 },
        ]
    },
    GHASTLY_ROBES: {
        id: 'GHASTLY_ROBES',
        name: "Ghastly Robes",
        type: 'platebody',
        icon: 'images/icons/ghastly_robes.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 12000, max: 20000 },
            { key: STATS.MAGIC_FIND.key, min: 10, max: 10 },
            { key: STATS.GOLD_GAIN.key, min: 10, max: 100},
        ]
    },
    SHADOW_COWL: {
        id: 'SHADOW_COWL',
        name: "Shadow Cowl",
        type: 'helmet',
        icon: 'images/icons/shadow_cowl.png',
        width: 2, height: 2,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 2500, max: 40000 },
            { key: STATS.MAGIC_FIND.key, min: 1.5, max: 3 },
        ]
    },
    HELLHOUNDS_COLLAR: {
        id: 'HELLHOUNDS_COLLAR',
        name: "Hellhound's Collar",
        type: 'necklace',
        icon: 'images/icons/hellhounds_collar.png', // ICON PATH CORRECTED
        width: 2, height: 2,
        canHaveSockets: true,
        maxSockets: 2,
        possibleStats: [
            { key: STATS.DPS.key, min: 10000, max: 25000 },
            { key: STATS.CLICK_DAMAGE.key, min: 500, max: 1500 },
        ]
    },

    // --- Sub-Zone: Demon Sentry (Boss Lvl 325) ---
    // (Currently no new items are introduced here)

    // --- Sub-Zone: The Hellforge (Boss Lvl 350) ---
    // (Currently no new items are introduced here)

    // --- Sub-Zone: Brimstone Corridors (Levels 351-374) ---
    MIRRORED_SHIELD: {
        id: 'MIRRORED_SHIELD',
        name: "Mirrored Shield",
        type: 'shield',
        icon: 'images/icons/mirrored_shield.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 12000, max: 20000 },
            { key: STATS.GOLD_GAIN.key, min: 70, max: 120 },
        ]
    },
    PLAGUE_STITCHED_CINCH: {
        id: 'PLAGUE_STITCHED_CINCH',
        name: "Plague-Stitched Cinch",
        type: 'belt',
        icon: 'images/icons/plague_stitched_cinch.png',
        width: 2, height: 1,
        possibleStats: [
            { key: STATS.DPS.key, min: 10000, max: 13000 },
            { key: STATS.MAGIC_FIND.key, min: 1, max: 3},
        ]
    },
    
    // --- Sub-Zone: Pit Lord's Arena (Boss Lvl 375) ---
    HELLFIRE_RING: {
        id: 'HELLFIRE_RING',
        name: "Hellfire Ring",
        type: 'ring',
        icon: 'images/icons/hellfire_ring.png', // ICON PATH CORRECTED
        width: 1, height: 1,
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 1,
        possibleStats: [
            { key: STATS.DPS.key, min: 9000, max: 23000 },
            { key: STATS.CLICK_DAMAGE.key, min: 1000, max: 3000 },
        ]
    },

    // --- Sub-Zone: Throne Approach & Archdemon's Lair (Levels 376-400) ---
    DRAGONHIDE_VEST: {
        id: 'DRAGONHIDE_VEST',
        name: "Dragonhide Vest",
        type: 'platebody',
        icon: 'images/icons/dragonhide_vest.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 10000, max: 30000 },
            { key: STATS.CLICK_DAMAGE.key, min: 250, max: 1500 },
        ]
    },
    DRAGONBONE_GREAVES: {
        id: 'DRAGONBONE_GREAVES',
        name: "Dragonbone Greaves",
        type: 'platelegs',
        icon: 'images/icons/dragonbone_greaves.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 9000, max: 27000 },
            { key: STATS.GOLD_GAIN.key, min: 30, max: 90 },
        ]
    },
    DRAGONFANG: {
        id: 'DRAGONFANG',
        name: "Dragonfang",
        type: 'sword',
        icon: 'images/icons/dragonfang.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 500, max: 1500 },
            { key: STATS.DPS.key, min: 10000, max: 30000 }
        ]
    },
    DRAGONSCALE_WARD: {
        id: 'DRAGONSCALE_WARD',
        name: "Dragonscale Ward",
        type: 'shield',
        icon: 'images/icons/dragonscale_ward.png',
        width: 2, height: 3,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 12000, max: 36000 },
            { key: STATS.MAGIC_FIND.key, min: 1.5, max: 3 },
        ]
    },
    DRAGONBONE_HEADDRESS: {
        id: 'DRAGONBONE_HEADDRESS',
        name: "Dragonbone Headdress",
        type: 'helmet',
        icon: 'images/icons/dragonbone_headdress.png',
        width: 2, height: 2,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 12000, max: 29000 },
            { key: STATS.GOLD_GAIN.key, min: 30, max: 90 },
        ]
    },
    EYE_OF_THE_DRAGON: {
        id: 'EYE_OF_THE_DRAGON',
        name: "Eye of the Dragon",
        type: 'necklace',
        icon: 'images/icons/eye_of_the_dragon.png',
        width: 2, height: 2,
        canHaveSockets: true,
        maxSockets: 1,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 500, max: 1300 },
            { key: STATS.DPS.key, min: 10000, max: 26000 },
            { key: STATS.MAGIC_FIND.key, min: 2, max: 6 },
        ]
    },
    DRAGONFIRE_LOOP: {
        id: 'DRAGONFIRE_LOOP',
        name: "Dragonfire Loop",
        type: 'ring',
        icon: 'images/icons/dragonfire_loop.png',
        width: 1, height: 1,
        canHaveSockets: true,
        maxSockets: 2,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 2000, max: 6000 },
            { key: STATS.DPS.key, min: 9000, max: 14000 },
            { key: STATS.GOLD_GAIN.key, min: 25, max: 75 },
        ]
    },
    DRAGONSCALE_BELT: {
        id: 'DRAGONSCALE_BELT',
        name: "Dragonscale Belt",
        type: 'belt',
        icon: 'images/icons/dragonscale_belt.png',
        width: 2, height: 1,
        canHaveSockets: true,
        maxSockets: 1,
        possibleStats: [
            { key: STATS.DPS.key, min: 8000, max: 24000 },
            { key: STATS.CLICK_DAMAGE.key, min: 200, max: 1500 },
        ]
    },
};

export const overworldItems = {
    ...greenMeadowsItems,
    ...orcVolcanoItems,
    ...undeadDesertItems,
    ...finalDungeonItems,
};