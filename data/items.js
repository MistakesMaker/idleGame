// --- START OF FILE data/items.js ---

import { STATS } from './stat_pools.js';

/*
* ITEM DEFINITION GUIDE
*
* id: A unique key for this item base. Should match the key in the ITEMS object.
* name: The display name of the item.
* type: The equipment slot this item uses.
* icon: The path to the item's image.
* possibleStats: An array of stat objects that can roll on this item.
* isUnique: (Optional) If true, this item is considered a "unique" or "boss" item.
*           This can be used to exclude it from certain loot pools, like loot crates.
* canHaveSockets: (Optional) If true, this item is eligible to roll for sockets.
* maxSockets: (Optional) If canHaveSockets is true, this defines the maximum number of
*             sockets this item base can have.
*/

export const ITEMS = {
    // ====================================================================================
    // --- SWORDS --- (10 items)
    // ====================================================================================
    RUSTY_SWORD: {
        id: 'RUSTY_SWORD',
        name: "Rusty Sword",
        type: 'sword',
        icon: 'images/icons/sword.png', 
        possibleStats: [ { key: STATS.CLICK_DAMAGE.key, min: 1, max: 15 } ]
    },
    IRON_SHORTSWORD: {
        id: 'IRON_SHORTSWORD',
        name: "Iron Shortsword",
        type: 'sword',
        icon: 'images/icons/sword.png', 
        possibleStats: [ { key: STATS.CLICK_DAMAGE.key, min: 10, max: 30 } ]
    },
    STEEL_LONGSWORD: {
        id: 'STEEL_LONGSWORD',
        name: "Steel Longsword",
        type: 'sword',
        icon: 'images/icons/sword.png', 
        possibleStats: [ { key: STATS.CLICK_DAMAGE.key, min: 25, max: 75 } ]
    },
    MITHRIL_SCIMITAR: {
        id: 'MITHRIL_SCIMITAR',
        name: "Mithril Scimitar",
        type: 'sword',
        icon: 'images/icons/sword.png', 
        possibleStats: [ { key: STATS.CLICK_DAMAGE.key, min: 50, max: 150 } ]
    },
    SERRATED_DAGGER: {
        id: 'SERRATED_DAGGER',
        name: "Serrated Dagger",
        type: 'sword',
        icon: 'images/icons/sword.png', 
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 40, max: 120 },
            { key: STATS.DPS.key, min: 80, max: 240 }
        ]
    },
    GLADIATORS_LONGSWORD: { // Existing unique
        id: 'GLADIATORS_LONGSWORD',
        name: "Gladiator's Longsword",
        type: 'sword',
        icon: 'images/icons/sword.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 20, max: 100 },
            { key: STATS.DPS.key, min: 50, max: 250 }
        ]
    },
    ORCISH_CLEAVER: {
        id: 'ORCISH_CLEAVER',
        name: "Orcish Cleaver",
        type: 'sword',
        icon: 'images/icons/sword.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 2,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 100, max: 300 },
            { key: STATS.GOLD_GAIN.key, min: 5, max: 15 }
        ]
    },
    RUNIC_BLADE: {
        id: 'RUNIC_BLADE',
        name: "Runic Blade",
        type: 'sword',
        icon: 'images/icons/sword.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 150, max: 450 },
            { key: STATS.DPS.key, min: 300, max: 900 }
        ]
    },
    BLADE_OF_THE_SPECTRE: {
        id: 'BLADE_OF_THE_SPECTRE',
        name: "Blade of the Spectre",
        type: 'sword',
        icon: 'images/icons/sword.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 200, max: 600 },
            { key: STATS.MAGIC_FIND.key, min: 10, max: 30 }
        ]
    },
    DRAGONFANG: {
        id: 'DRAGONFANG',
        name: "Dragonfang",
        type: 'sword',
        icon: 'images/icons/sword.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 500, max: 1500 },
            { key: STATS.DPS.key, min: 1000, max: 3000 }
        ]
    },


    // ====================================================================================
    // --- SHIELDS --- (10 items)
    // ====================================================================================
    WOODEN_SHIELD: {
        id: 'WOODEN_SHIELD',
        name: "Wooden Shield",
        type: 'shield',
        icon: 'images/icons/shield.png',
        possibleStats: [ { key: STATS.DPS.key, min: 5, max: 25 } ]
    },
    BRONZE_BUCKLER: {
        id: 'BRONZE_BUCKLER',
        name: "Bronze Buckler",
        type: 'shield',
        icon: 'images/icons/shield.png',
        possibleStats: [ { key: STATS.DPS.key, min: 20, max: 60 } ]
    },
    IRON_KITESHIELD: {
        id: 'IRON_KITESHIELD',
        name: "Iron Kiteshield",
        type: 'shield',
        icon: 'images/icons/shield.png',
        possibleStats: [ { key: STATS.DPS.key, min: 50, max: 100 } ]
    },
    STEEL_HEATER: {
        id: 'STEEL_HEATER',
        name: "Steel Heater",
        type: 'shield',
        icon: 'images/icons/shield.png',
        possibleStats: [ { key: STATS.DPS.key, min: 120, max: 160 } ]
    },
    TOWER_SHIELD: {
        id: 'TOWER_SHIELD',
        name: "Tower Shield",
        type: 'shield',
        icon: 'images/icons/shield.png',
        canHaveSockets: true,
        maxSockets: 1,
        possibleStats: [ { key: STATS.DPS.key, min: 250, max: 750 } ]
    },
    BONE_SHIELD: {
        id: 'BONE_SHIELD',
        name: "Bone Shield",
        type: 'shield',
        icon: 'images/icons/shield.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 2,
        possibleStats: [
            { key: STATS.DPS.key, min: 100, max: 300 },
            { key: STATS.GOLD_GAIN.key, min: 5, max: 15 },
        ]
    },
    SPIKED_BULWARK: {
        id: 'SPIKED_BULWARK',
        name: "Spiked Bulwark",
        type: 'shield',
        icon: 'images/icons/shield.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 200, max: 600 },
            { key: STATS.CLICK_DAMAGE.key, min: 50, max: 150 },
        ]
    },
    AEGIS_OF_THE_GUARDIAN: {
        id: 'AEGIS_OF_THE_GUARDIAN',
        name: "Aegis of the Guardian",
        type: 'shield',
        icon: 'images/icons/shield.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 300, max: 900 },
            { key: STATS.MAGIC_FIND.key, min: 10, max: 25 },
        ]
    },
    MIRRORED_SHIELD: {
        id: 'MIRRORED_SHIELD',
        name: "Mirrored Shield",
        type: 'shield',
        icon: 'images/icons/shield.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 400, max: 1200 },
            { key: STATS.GOLD_GAIN.key, min: 20, max: 50 },
        ]
    },
    DRAGONSCALE_WARD: {
        id: 'DRAGONSCALE_WARD',
        name: "Dragonscale Ward",
        type: 'shield',
        icon: 'images/icons/shield.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 1200, max: 3600 },
            { key: STATS.MAGIC_FIND.key, min: 15, max: 45 },
        ]
    },


    // ====================================================================================
    // --- HELMETS --- (10 items)
    // ====================================================================================
    LEATHER_CAP: {
        id: 'LEATHER_CAP',
        name: "Leather Cap",
        type: 'helmet',
        icon: 'images/icons/helmet.png',
        possibleStats: [ { key: STATS.GOLD_GAIN.key, min: 1, max: 8 } ]
    },
    IRON_HELM: {
        id: 'IRON_HELM',
        name: "Iron Helm",
        type: 'helmet',
        icon: 'images/icons/helmet.png',
        possibleStats: [ { key: STATS.GOLD_GAIN.key, min: 5, max: 15 } ]
    },
    STEEL_FULL_HELM: {
        id: 'STEEL_FULL_HELM',
        name: "Steel Full Helm",
        type: 'helmet',
        icon: 'images/icons/helmet.png',
        possibleStats: [ { key: STATS.GOLD_GAIN.key, min: 12, max: 36 } ]
    },
    MAGE_HOOD: {
        id: 'MAGE_HOOD',
        name: "Mage Hood",
        type: 'helmet',
        icon: 'images/icons/helmet.png',
        canHaveSockets: true,
        maxSockets: 2,
        possibleStats: [
            { key: STATS.GOLD_GAIN.key, min: 20, max: 60 },
            { key: STATS.MAGIC_FIND.key, min: 5, max: 15 },
        ]
    },
    ROYAL_CIRCLET: {
        id: 'ROYAL_CIRCLET',
        name: "Royal Circlet",
        type: 'helmet',
        icon: 'images/icons/helmet.png',
        canHaveSockets: true,
        maxSockets: 2,
        possibleStats: [
            { key: STATS.GOLD_GAIN.key, min: 30, max: 90 },
            { key: STATS.MAGIC_FIND.key, min: 10, max: 30 },
        ]
    },
    HELM_OF_VALOR: {
        id: 'HELM_OF_VALOR',
        name: "Helm of Valor",
        type: 'helmet',
        icon: 'images/icons/helmet.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 2,
        possibleStats: [
            { key: STATS.DPS.key, min: 100, max: 300 },
            { key: STATS.GOLD_GAIN.key, min: 10, max: 30 },
        ]
    },
    SKULL_HELM: {
        id: 'SKULL_HELM',
        name: "Skull Helm",
        type: 'helmet',
        icon: 'images/icons/helmet.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 2,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 50, max: 150 },
            { key: STATS.MAGIC_FIND.key, min: 10, max: 30 },
        ]
    },
    SHADOW_COWL: {
        id: 'SHADOW_COWL',
        name: "Shadow Cowl",
        type: 'helmet',
        icon: 'images/icons/helmet.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 2,
        possibleStats: [
            { key: STATS.DPS.key, min: 250, max: 750 },
            { key: STATS.MAGIC_FIND.key, min: 15, max: 45 },
        ]
    },
    CROWN_OF_WISDOM: {
        id: 'CROWN_OF_WISDOM',
        name: "Crown of Wisdom",
        type: 'helmet',
        icon: 'images/icons/helmet.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 2,
        possibleStats: [
            { key: STATS.GOLD_GAIN.key, min: 50, max: 150 },
            { key: STATS.MAGIC_FIND.key, min: 20, max: 60 },
        ]
    },
    DRAGONBONE_HEADDRESS: {
        id: 'DRAGONBONE_HEADDRESS',
        name: "Dragonbone Headdress",
        type: 'helmet',
        icon: 'images/icons/helmet.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 2,
        possibleStats: [
            { key: STATS.DPS.key, min: 800, max: 2400 },
            { key: STATS.GOLD_GAIN.key, min: 30, max: 90 },
        ]
    },
    
    // ====================================================================================
    // --- PLATEBODIES --- (10 items)
    // ====================================================================================
    LEATHER_TUNIC: {
        id: 'LEATHER_TUNIC',
        name: "Leather Tunic",
        type: 'platebody',
        icon: 'images/icons/platebody.png',
        possibleStats: [ { key: STATS.DPS.key, min: 5, max: 15 } ]
    },
    CHAINMAIL_HAUBERK: {
        id: 'CHAINMAIL_HAUBERK',
        name: "Chainmail Hauberk",
        type: 'platebody',
        icon: 'images/icons/platebody.png',
        possibleStats: [ { key: STATS.DPS.key, min: 12, max: 36 } ]
    },
    IRON_PLATEBODY: {
        id: 'IRON_PLATEBODY',
        name: "Iron Platebody",
        type: 'platebody',
        icon: 'images/icons/platebody.png',
        possibleStats: [ { key: STATS.DPS.key, min: 30, max: 90 } ]
    },
    STEEL_PLATEMAIL: {
        id: 'STEEL_PLATEMAIL',
        name: "Steel Platemail",
        type: 'platebody',
        icon: 'images/icons/platebody.png',
        possibleStats: [ { key: STATS.DPS.key, min: 80, max: 240 } ]
    },
    MITHRIL_CHAINMAIL: {
        id: 'MITHRIL_CHAINMAIL',
        name: "Mithril Chainmail",
        type: 'platebody',
        icon: 'images/icons/platebody.png',
        possibleStats: [ { key: STATS.DPS.key, min: 200, max: 600 } ]
    },
    APPRENTICE_ROBE: { // Existing item
        id: 'APPRENTICE_ROBE',
        name: "Apprentice Robe",
        type: 'platebody',
        icon: 'images/icons/platebody.png',
        possibleStats: [ { key: STATS.GOLD_GAIN.key, min: 5, max: 25 } ]
    },
    ROBE_OF_THE_ARCHMAGE: {
        id: 'ROBE_OF_THE_ARCHMAGE',
        name: "Robe of the Archmage",
        type: 'platebody',
        icon: 'images/icons/platebody.png',
        canHaveSockets: true,
        maxSockets: 1,
        possibleStats: [
            { key: STATS.GOLD_GAIN.key, min: 30, max: 90 },
            { key: STATS.MAGIC_FIND.key, min: 10, max: 30 },
        ]
    },
    GHASTLY_ROBES: {
        id: 'GHASTLY_ROBES',
        name: "Ghastly Robes",
        type: 'platebody',
        icon: 'images/icons/platebody.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 250, max: 750 },
            { key: STATS.MAGIC_FIND.key, min: 15, max: 45 },
        ]
    },
    CARAPACE_OF_THE_SCARAB: {
        id: 'CARAPACE_OF_THE_SCARAB',
        name: "Carapace of the Scarab",
        type: 'platebody',
        icon: 'images/icons/platebody.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 400, max: 1200 },
            { key: STATS.GOLD_GAIN.key, min: 20, max: 60 },
        ]
    },
    DRAGONHIDE_VEST: {
        id: 'DRAGONHIDE_VEST',
        name: "Dragonhide Vest",
        type: 'platebody',
        icon: 'images/icons/platebody.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 1000, max: 3000 },
            { key: STATS.CLICK_DAMAGE.key, min: 250, max: 750 },
        ]
    },


    // ====================================================================================
    // --- PLATELEGS --- (10 items)
    // ====================================================================================
    LEATHER_TROUSERS: {
        id: 'LEATHER_TROUSERS',
        name: "Leather Trousers",
        type: 'platelegs',
        icon: 'images/icons/platelegs.png',
        possibleStats: [ { key: STATS.DPS.key, min: 3, max: 10 } ]
    },
    CHAINMAIL_LEGGINGS: {
        id: 'CHAINMAIL_LEGGINGS',
        name: "Chainmail Leggings",
        type: 'platelegs',
        icon: 'images/icons/platelegs.png',
        possibleStats: [ { key: STATS.DPS.key, min: 10, max: 30 } ]
    },
    IRON_PLATELEGS: {
        id: 'IRON_PLATELEGS',
        name: "Iron Platelegs",
        type: 'platelegs',
        icon: 'images/icons/platelegs.png',
        possibleStats: [ { key: STATS.DPS.key, min: 25, max: 50 } ]
    },
    STEEL_GREAVES: {
        id: 'STEEL_GREAVES',
        name: "Steel Greaves",
        type: 'platelegs',
        icon: 'images/icons/platelegs.png',
        possibleStats: [ { key: STATS.DPS.key, min: 70, max: 210 } ]
    },
    MAGE_PANTS: {
        id: 'MAGE_PANTS',
        name: "Mage Pants",
        type: 'platelegs',
        icon: 'images/icons/platelegs.png',
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.GOLD_GAIN.key, min: 15, max: 45 },
            { key: STATS.MAGIC_FIND.key, min: 5, max: 15 },
        ]
    },
    KNIGHTS_PLATELEGS: { // Existing item
        id: 'KNIGHTS_PLATELEGS',
        name: "Knight's Platelegs",
        type: 'platelegs',
        icon: 'images/icons/platelegs.png',
        canHaveSockets: true,
        maxSockets: 1,
        possibleStats: [ { key: STATS.DPS.key, min: 25, max: 120 } ]
    },
    GREAVES_OF_HASTE: {
        id: 'GREAVES_OF_HASTE',
        name: "Greaves of Haste",
        type: 'platelegs',
        icon: 'images/icons/platelegs.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 300, max: 900 },
            { key: STATS.CLICK_DAMAGE.key, min: 50, max: 150 },
        ]
    },
    BONE_LEGPLATES: {
        id: 'BONE_LEGPLATES',
        name: "Bone Legplates",
        type: 'platelegs',
        icon: 'images/icons/platelegs.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 350, max: 1050 },
            { key: STATS.MAGIC_FIND.key, min: 10, max: 30 },
        ]
    },
    SANDSTRIDER_LEGGINGS: {
        id: 'SANDSTRIDER_LEGGINGS',
        name: "Sandstrider Leggings",
        type: 'platelegs',
        icon: 'images/icons/platelegs.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 500, max: 1500 },
            { key: STATS.GOLD_GAIN.key, min: 25, max: 75 },
        ]
    },
    DRAGONBONE_GREAVES: {
        id: 'DRAGONBONE_GREAVES',
        name: "Dragonbone Greaves",
        type: 'platelegs',
        icon: 'images/icons/platelegs.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 900, max: 2700 },
            { key: STATS.GOLD_GAIN.key, min: 30, max: 90 },
        ]
    },


    // ====================================================================================
    // --- NECKLACES --- (10 items)
    // ====================================================================================
    SIMPLE_PENDANT: {
        id: 'SIMPLE_PENDANT',
        name: "Simple Pendant",
        type: 'necklace',
        icon: 'images/icons/necklace.png',
        possibleStats: [ { key: STATS.GOLD_GAIN.key, min: 2, max: 6 } ]
    },
    SILVER_LOCKET: {
        id: 'SILVER_LOCKET',
        name: "Silver Locket",
        type: 'necklace',
        icon: 'images/icons/necklace.png',
        possibleStats: [ { key: STATS.GOLD_GAIN.key, min: 5, max: 15 } ]
    },
    RUBY_AMULET: {
        id: 'RUBY_AMULET',
        name: "Ruby Amulet",
        type: 'necklace',
        icon: 'images/icons/necklace.png',
        possibleStats: [ { key: STATS.CLICK_DAMAGE.key, min: 10, max: 30 } ]
    },
    SAPPHIRE_AMULET: {
        id: 'SAPPHIRE_AMULET',
        name: "Sapphire Amulet",
        type: 'necklace',
        icon: 'images/icons/necklace.png',
        possibleStats: [ { key: STATS.DPS.key, min: 20, max: 60 } ]
    },
    EMERALD_CHARM: {
        id: 'EMERALD_CHARM',
        name: "Emerald Charm",
        type: 'necklace',
        icon: 'images/icons/necklace.png',
        possibleStats: [ { key: STATS.GOLD_GAIN.key, min: 15, max: 45 } ]
    },
    TOPAZ_TALISMAN: {
        id: 'TOPAZ_TALISMAN',
        name: "Topaz Talisman",
        type: 'necklace',
        icon: 'images/icons/necklace.png',
        possibleStats: [ { key: STATS.MAGIC_FIND.key, min: 10, max: 30 } ]
    },
    AMULET_OF_THE_VIPER: {
        id: 'AMULET_OF_THE_VIPER',
        name: "Amulet of the Viper",
        type: 'necklace',
        icon: 'images/icons/necklace.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 150, max: 450 },
            { key: STATS.MAGIC_FIND.key, min: 10, max: 30 },
        ]
    },
    BLOODSTONE_PENDANT: {
        id: 'BLOODSTONE_PENDANT',
        name: "Bloodstone Pendant",
        type: 'necklace',
        icon: 'images/icons/necklace.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 100, max: 300 },
            { key: STATS.DPS.key, min: 200, max: 600 },
        ]
    },
    AMULET_OF_POWER: { // Existing item
        id: 'AMULET_OF_POWER',
        name: "Amulet of Power",
        type: 'necklace',
        icon: 'images/icons/necklace.png',
        isUnique: true,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 15, max: 75 },
            { key: STATS.DPS.key, min: 30, max: 150 }
        ]
    },
    EYE_OF_THE_DRAGON: {
        id: 'EYE_OF_THE_DRAGON',
        name: "Eye of the Dragon",
        type: 'necklace',
        icon: 'images/icons/necklace.png',
        isUnique: true,
        canHaveSockets: true, // A rare socketed accessory
        maxSockets: 1,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 400, max: 1200 },
            { key: STATS.DPS.key, min: 800, max: 2400 },
            { key: STATS.MAGIC_FIND.key, min: 20, max: 60 },
        ]
    },


    // ====================================================================================
    // --- RINGS --- (10 items)
    // ====================================================================================
    IRON_RING: {
        id: 'IRON_RING',
        name: "Iron Ring",
        type: 'ring',
        icon: 'images/icons/ring.png',
        possibleStats: [ { key: STATS.DPS.key, min: 3, max: 9 } ]
    },
    SILVER_RING: {
        id: 'SILVER_RING',
        name: "Silver Ring",
        type: 'ring',
        icon: 'images/icons/ring.png',
        possibleStats: [ { key: STATS.GOLD_GAIN.key, min: 3, max: 9 } ]
    },
    GOLD_RING: {
        id: 'GOLD_RING',
        name: "Gold Ring",
        type: 'ring',
        icon: 'images/icons/ring.png',
        possibleStats: [ { key: STATS.GOLD_GAIN.key, min: 10, max: 30 } ]
    },
    BAND_OF_MIGHT: {
        id: 'BAND_OF_MIGHT',
        name: "Band of Might",
        type: 'ring',
        icon: 'images/icons/ring.png',
        possibleStats: [ { key: STATS.CLICK_DAMAGE.key, min: 15, max: 45 } ]
    },
    BAND_OF_AGILITY: {
        id: 'BAND_OF_AGILITY',
        name: "Band of Agility",
        type: 'ring',
        icon: 'images/icons/ring.png',
        possibleStats: [ { key: STATS.DPS.key, min: 30, max: 90 } ]
    },
    RING_OF_WEALTH: { // Existing item
        id: 'RING_OF_WEALTH',
        name: "Ring of Wealth",
        type: 'ring',
        icon: 'images/icons/ring.png',
        possibleStats: [ { key: STATS.GOLD_GAIN.key, min: 10, max: 50 } ]
    },
    OBSIDIAN_BAND: {
        id: 'OBSIDIAN_BAND',
        name: "Obsidian Band",
        type: 'ring',
        icon: 'images/icons/ring.png',
        isUnique: true,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 50, max: 150 },
            { key: STATS.DPS.key, min: 100, max: 300 },
        ]
    },
    SIGNET_OF_THE_LEECH: {
        id: 'SIGNET_OF_THE_LEECH',
        name: "Signet of the Leech",
        type: 'ring',
        icon: 'images/icons/ring.png',
        isUnique: true,
        possibleStats: [
            { key: STATS.DPS.key, min: 200, max: 600 },
            { key: STATS.MAGIC_FIND.key, min: 10, max: 30 },
        ]
    },
    SEAL_OF_THE_KING: {
        id: 'SEAL_OF_THE_KING',
        name: "Seal of the King",
        type: 'ring',
        icon: 'images/icons/ring.png',
        isUnique: true,
        possibleStats: [
            { key: STATS.GOLD_GAIN.key, min: 40, max: 120 },
            { key: STATS.MAGIC_FIND.key, min: 15, max: 45 },
        ]
    },
    DRAGONFIRE_LOOP: {
        id: 'DRAGONFIRE_LOOP',
        name: "Dragonfire Loop",
        type: 'ring',
        icon: 'images/icons/ring.png',
        isUnique: true,
        canHaveSockets: true, // A rare socketed accessory
        maxSockets: 1,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 300, max: 900 },
            { key: STATS.DPS.key, min: 600, max: 1800 },
            { key: STATS.GOLD_GAIN.key, min: 25, max: 75 },
        ]
    },
    

    // ====================================================================================
    // --- BELTS --- (10 items)
    // ====================================================================================
    SIMPLE_SASH: {
        id: 'SIMPLE_SASH',
        name: "Simple Sash",
        type: 'belt',
        icon: 'images/icons/belt.png',
        possibleStats: [ { key: STATS.DPS.key, min: 2, max: 6 } ]
    },
    LEATHER_BELT: {
        id: 'LEATHER_BELT',
        name: "Leather Belt",
        type: 'belt',
        icon: 'images/icons/belt.png',
        possibleStats: [ { key: STATS.DPS.key, min: 5, max: 15 } ]
    },
    STUDDED_LEATHER_BELT: {
        id: 'STUDDED_LEATHER_BELT',
        name: "Studded Leather Belt",
        type: 'belt',
        icon: 'images/icons/belt.png',
        possibleStats: [ { key: STATS.DPS.key, min: 12, max: 36 } ]
    },
    IRON_GIRDLE: {
        id: 'IRON_GIRDLE',
        name: "Iron Girdle",
        type: 'belt',
        icon: 'images/icons/belt.png',
        possibleStats: [ { key: STATS.DPS.key, min: 30, max: 90 } ]
    },
    SASH_OF_THE_SORCERER: {
        id: 'SASH_OF_THE_SORCERER',
        name: "Sash of the Sorcerer",
        type: 'belt',
        icon: 'images/icons/belt.png',
        possibleStats: [
            { key: STATS.GOLD_GAIN.key, min: 20, max: 60 },
            { key: STATS.MAGIC_FIND.key, min: 5, max: 15 },
        ]
    },
    MIGHTY_BELT: { // Existing item
        id: 'MIGHTY_BELT',
        name: "Mighty Belt",
        type: 'belt',
        icon: 'images/icons/belt.png',
        possibleStats: [ { key: STATS.DPS.key, min: 10, max: 80 } ]
    },
    PLAGUE_STITCHED_CINCH: {
        id: 'PLAGUE_STITCHED_CINCH',
        name: "Plague-Stitched Cinch",
        type: 'belt',
        icon: 'images/icons/belt.png',
        isUnique: true,
        possibleStats: [
            { key: STATS.DPS.key, min: 150, max: 450 },
            { key: STATS.MAGIC_FIND.key, min: 10, max: 30 },
        ]
    },
    BELT_OF_THE_GIANT: {
        id: 'BELT_OF_THE_GIANT',
        name: "Belt of the Giant",
        type: 'belt',
        icon: 'images/icons/belt.png',
        isUnique: true,
        possibleStats: [
            { key: STATS.DPS.key, min: 200, max: 600 },
            { key: STATS.CLICK_DAMAGE.key, min: 50, max: 150 },
        ]
    },
    SUNSTONE_BUCKLE: {
        id: 'SUNSTONE_BUCKLE',
        name: "Sunstone Buckle",
        type: 'belt',
        icon: 'images/icons/belt.png',
        isUnique: true,
        possibleStats: [
            { key: STATS.DPS.key, min: 300, max: 900 },
            { key: STATS.GOLD_GAIN.key, min: 20, max: 60 },
        ]
    },
    DRAGONSCALE_BELT: {
        id: 'DRAGONSCALE_BELT',
        name: "Dragonscale Belt",
        type: 'belt',
        icon: 'images/icons/belt.png',
        isUnique: true,
        canHaveSockets: true, // A rare socketed accessory
        maxSockets: 1,
        possibleStats: [
            { key: STATS.DPS.key, min: 800, max: 2400 },
            { key: STATS.CLICK_DAMAGE.key, min: 200, max: 600 },
        ]
    }
};