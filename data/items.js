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
        icon: 'images/icons/rusty_sword.png', 
        possibleStats: [ { key: STATS.CLICK_DAMAGE.key, min: 1, max: 15 } ]
    },
    IRON_SHORTSWORD: {
        id: 'IRON_SHORTSWORD',
        name: "Iron Shortsword",
        type: 'sword',
        icon: 'images/icons/iron_shortsword.png', 
        possibleStats: [ { key: STATS.CLICK_DAMAGE.key, min: 10, max: 35 } ]
    },
    STEEL_LONGSWORD: {
        id: 'STEEL_LONGSWORD',
        name: "Steel Longsword",
        type: 'sword',
        icon: 'images/icons/steel_longsword.png', 
        possibleStats: [ { key: STATS.CLICK_DAMAGE.key, min: 50, max: 150 } ]
    },
    MITHRIL_SCIMITAR: {
        id: 'MITHRIL_SCIMITAR',
        name: "Mithril Scimitar",
        type: 'sword',
        icon: 'images/icons/mithril_scimitar.png', 
        possibleStats: [ { key: STATS.CLICK_DAMAGE.key, min: 180, max: 400 } ]
    },
    SERRATED_DAGGER: {
        id: 'SERRATED_DAGGER',
        name: "Serrated Dagger",
        type: 'sword',
        icon: 'images/icons/serrated_dagger.png', 
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 25, max: 60 },
            { key: STATS.DPS.key, min: 50, max: 120 }
        ]
    },
    GLADIATORS_LONGSWORD: { // Lvl 25 Boss Drop
        id: 'GLADIATORS_LONGSWORD',
        name: "Gladiator's Longsword",
        type: 'sword',
        icon: 'images/icons/gladiators_longsword.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 40, max: 120 },
            { key: STATS.DPS.key, min: 80, max: 240 }
        ]
    },
    ORCISH_CLEAVER: { // Lvl 125/175 Boss Drop
        id: 'ORCISH_CLEAVER',
        name: "Orcish Cleaver",
        type: 'sword',
        icon: 'images/icons/orcish_cleaver.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 2,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 450, max: 1350 },
            { key: STATS.GOLD_GAIN.key, min: 10, max: 25 }
        ]
    },
    RUNIC_BLADE: { // Lvl 200 Boss Drop (and others)
        id: 'RUNIC_BLADE',
        name: "Runic Blade",
        type: 'sword',
        icon: 'images/icons/runic_blade.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 1500, max: 4500 },
            { key: STATS.DPS.key, min: 3000, max: 9000 }
        ]
    },
    BLADE_OF_THE_SPECTRE: { // Lvl 300 Boss Drop
        id: 'BLADE_OF_THE_SPECTRE',
        name: "Blade of the Spectre",
        type: 'sword',
        icon: 'images/icons/blade_of_the_spectre.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 5000, max: 15000 },
            { key: STATS.MAGIC_FIND.key, min: 20, max: 50 }
        ]
    },
    DRAGONFANG: { // Lvl 400 Boss Drop
        id: 'DRAGONFANG',
        name: "Dragonfang",
        type: 'sword',
        icon: 'images/icons/dragonfang.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 20000, max: 60000 },
            { key: STATS.DPS.key, min: 40000, max: 120000 }
        ]
    },


    // ====================================================================================
    // --- SHIELDS --- (10 items)
    // ====================================================================================
    WOODEN_SHIELD: {
        id: 'WOODEN_SHIELD',
        name: "Wooden Shield",
        type: 'shield',
        icon: 'images/icons/wooden_shield.png',
        possibleStats: [ { key: STATS.DPS.key, min: 5, max: 25 } ]
    },
    BRONZE_BUCKLER: { // Not in loot tables, but balanced for T1
        id: 'BRONZE_BUCKLER',
        name: "Bronze Buckler",
        type: 'shield',
        icon: 'images/icons/bronze_buckler.png',
        possibleStats: [ { key: STATS.DPS.key, min: 20, max: 50 } ]
    },
    IRON_KITESHIELD: { // Lvl 25 Boss Drop (non-unique)
        id: 'IRON_KITESHIELD',
        name: "Iron Kiteshield",
        type: 'shield',
        icon: 'images/icons/kiteshield.png',
        possibleStats: [ { key: STATS.DPS.key, min: 60, max: 120 } ]
    },
    STEEL_HEATER: { // Not in loot tables, but balanced for T2
        id: 'STEEL_HEATER',
        name: "Steel Heater",
        type: 'shield',
        icon: 'images/icons/steel_heater.png',
        possibleStats: [ { key: STATS.DPS.key, min: 150, max: 300 } ]
    },
    TOWER_SHIELD: { // Lvl 125, 301 Boss Drop (non-unique)
        id: 'TOWER_SHIELD',
        name: "Tower Shield",
        type: 'shield',
        icon: 'images/icons/tower_shield.png',
        canHaveSockets: true,
        maxSockets: 1,
        possibleStats: [ { key: STATS.DPS.key, min: 500, max: 1500 } ]
    },
    BONE_SHIELD: { // Lvl 201+ Unique
        id: 'BONE_SHIELD',
        name: "Bone Shield",
        type: 'shield',
        icon: 'images/icons/bone_shield.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 2,
        possibleStats: [
            { key: STATS.DPS.key, min: 1800, max: 5400 },
            { key: STATS.GOLD_GAIN.key, min: 15, max: 30 },
        ]
    },
    SPIKED_BULWARK: { // Lvl 226+ Unique
        id: 'SPIKED_BULWARK',
        name: "Spiked Bulwark",
        type: 'shield',
        icon: 'images/icons/spiked_bulwark.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 2500, max: 7500 },
            { key: STATS.CLICK_DAMAGE.key, min: 600, max: 1800 },
        ]
    },
    AEGIS_OF_THE_GUARDIAN: { // Lvl 50+ Boss Drop
        id: 'AEGIS_OF_THE_GUARDIAN',
        name: "Aegis of the Guardian",
        type: 'shield',
        icon: 'images/icons/aegis_of_the_guardian.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 200, max: 600 },
            { key: STATS.MAGIC_FIND.key, min: 10, max: 20 },
        ]
    },
    MIRRORED_SHIELD: { // Lvl 351+ Unique
        id: 'MIRRORED_SHIELD',
        name: "Mirrored Shield",
        type: 'shield',
        icon: 'images/icons/mirrored_shield.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 6000, max: 18000 },
            { key: STATS.GOLD_GAIN.key, min: 25, max: 60 },
        ]
    },
    DRAGONSCALE_WARD: { // Lvl 400 Boss Drop
        id: 'DRAGONSCALE_WARD',
        name: "Dragonscale Ward",
        type: 'shield',
        icon: 'images/icons/dragonscale_ward.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 50000, max: 150000 },
            { key: STATS.MAGIC_FIND.key, min: 30, max: 90 },
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
    IRON_HELM: { // Not in loot tables
        id: 'IRON_HELM',
        name: "Iron Helm",
        type: 'helmet',
        icon: 'images/icons/helmet.png',
        possibleStats: [ { key: STATS.GOLD_GAIN.key, min: 5, max: 15 } ]
    },
    STEEL_FULL_HELM: { // Not in loot tables
        id: 'STEEL_FULL_HELM',
        name: "Steel Full Helm",
        type: 'helmet',
        icon: 'images/icons/helmet.png',
        possibleStats: [ { key: STATS.GOLD_GAIN.key, min: 12, max: 36 } ]
    },
    MAGE_HOOD: { // Lvl 101+ drop
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
    ROYAL_CIRCLET: { // Lvl 100 Boss Drop
        id: 'ROYAL_CIRCLET',
        name: "Royal Circlet",
        type: 'helmet',
        icon: 'images/icons/helmet.png',
        isUnique: true, // Made unique to signify its power
        canHaveSockets: true,
        maxSockets: 2,
        possibleStats: [
            { key: STATS.GOLD_GAIN.key, min: 50, max: 150 },
            { key: STATS.MAGIC_FIND.key, min: 15, max: 45 },
        ]
    },
    HELM_OF_VALOR: { // Lvl 200 Boss Drop
        id: 'HELM_OF_VALOR',
        name: "Helm of Valor",
        type: 'helmet',
        icon: 'images/icons/helmet.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 2,
        possibleStats: [
            { key: STATS.DPS.key, min: 3500, max: 10500 },
            { key: STATS.GOLD_GAIN.key, min: 30, max: 90 },
        ]
    },
    SKULL_HELM: { // Not in loot tables
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
    SHADOW_COWL: { // Lvl 326+ Unique
        id: 'SHADOW_COWL',
        name: "Shadow Cowl",
        type: 'helmet',
        icon: 'images/icons/helmet.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 2,
        possibleStats: [
            { key: STATS.DPS.key, min: 7000, max: 21000 },
            { key: STATS.MAGIC_FIND.key, min: 20, max: 60 },
        ]
    },
    CROWN_OF_WISDOM: { // Not in loot tables
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
    DRAGONBONE_HEADDRESS: { // Lvl 400 Boss Drop
        id: 'DRAGONBONE_HEADDRESS',
        name: "Dragonbone Headdress",
        type: 'helmet',
        icon: 'images/icons/helmet.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 2,
        possibleStats: [
            { key: STATS.DPS.key, min: 60000, max: 180000 },
            { key: STATS.GOLD_GAIN.key, min: 50, max: 150 },
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
    CHAINMAIL_HAUBERK: { // Lvl 25 Boss Drop (non-unique)
        id: 'CHAINMAIL_HAUBERK',
        name: "Chainmail Hauberk",
        type: 'platebody',
        icon: 'images/icons/platebody.png',
        possibleStats: [ { key: STATS.DPS.key, min: 40, max: 90 } ]
    },
    IRON_PLATEBODY: { // Lvl 101+ drop
        id: 'IRON_PLATEBODY',
        name: "Iron Platebody",
        type: 'platebody',
        icon: 'images/icons/platebody.png',
        possibleStats: [ { key: STATS.DPS.key, min: 100, max: 300 } ]
    },
    STEEL_PLATEMAIL: { // Lvl 125+ drop
        id: 'STEEL_PLATEMAIL',
        name: "Steel Platemail",
        type: 'platebody',
        icon: 'images/icons/platebody.png',
        possibleStats: [ { key: STATS.DPS.key, min: 600, max: 1800 } ]
    },
    MITHRIL_CHAINMAIL: { // Lvl 226+ drop
        id: 'MITHRIL_CHAINMAIL',
        name: "Mithril Chainmail",
        type: 'platebody',
        icon: 'images/icons/platebody.png',
        possibleStats: [ { key: STATS.DPS.key, min: 2800, max: 8400 } ]
    },
    APPRENTICE_ROBE: { // Lvl 226+ drop
        id: 'APPRENTICE_ROBE',
        name: "Apprentice Robe",
        type: 'platebody',
        icon: 'images/icons/platebody.png',
        possibleStats: [ { key: STATS.GOLD_GAIN.key, min: 20, max: 50 } ]
    },
    ROBE_OF_THE_ARCHMAGE: { // Not in loot tables
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
    GHASTLY_ROBES: { // Lvl 326+ Unique
        id: 'GHASTLY_ROBES',
        name: "Ghastly Robes",
        type: 'platebody',
        icon: 'images/icons/platebody.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 8000, max: 24000 },
            { key: STATS.MAGIC_FIND.key, min: 20, max: 60 },
        ]
    },
    CARAPACE_OF_THE_SCARAB: { // Lvl 225/250 Boss Drop
        id: 'CARAPACE_OF_THE_SCARAB',
        name: "Carapace of the Scarab",
        type: 'platebody',
        icon: 'images/icons/platebody.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 3000, max: 9000 },
            { key: STATS.GOLD_GAIN.key, min: 25, max: 75 },
        ]
    },
    DRAGONHIDE_VEST: { // Lvl 400 Boss Drop
        id: 'DRAGONHIDE_VEST',
        name: "Dragonhide Vest",
        type: 'platebody',
        icon: 'images/icons/platebody.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 75000, max: 225000 },
            { key: STATS.CLICK_DAMAGE.key, min: 18000, max: 54000 },
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
    CHAINMAIL_LEGGINGS: { // Not in loot tables
        id: 'CHAINMAIL_LEGGINGS',
        name: "Chainmail Leggings",
        type: 'platelegs',
        icon: 'images/icons/platelegs.png',
        possibleStats: [ { key: STATS.DPS.key, min: 10, max: 30 } ]
    },
    IRON_PLATELEGS: { // Not in loot tables
        id: 'IRON_PLATELEGS',
        name: "Iron Platelegs",
        type: 'platelegs',
        icon: 'images/icons/platelegs.png',
        possibleStats: [ { key: STATS.DPS.key, min: 25, max: 50 } ]
    },
    STEEL_GREAVES: { // Lvl 201+ drop
        id: 'STEEL_GREAVES',
        name: "Steel Greaves",
        type: 'platelegs',
        icon: 'images/icons/platelegs.png',
        possibleStats: [ { key: STATS.DPS.key, min: 2000, max: 6000 } ]
    },
    MAGE_PANTS: { // Lvl 226+ drop
        id: 'MAGE_PANTS',
        name: "Mage Pants",
        type: 'platelegs',
        icon: 'images/icons/platelegs.png',
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.GOLD_GAIN.key, min: 18, max: 55 },
            { key: STATS.MAGIC_FIND.key, min: 8, max: 24 },
        ]
    },
    KNIGHTS_PLATELEGS: { // Not in loot tables
        id: 'KNIGHTS_PLATELEGS',
        name: "Knight's Platelegs",
        type: 'platelegs',
        icon: 'images/icons/platelegs.png',
        canHaveSockets: true,
        maxSockets: 1,
        possibleStats: [ { key: STATS.DPS.key, min: 25, max: 120 } ]
    },
    GREAVES_OF_HASTE: { // Lvl 326+ Unique
        id: 'GREAVES_OF_HASTE',
        name: "Greaves of Haste",
        type: 'platelegs',
        icon: 'images/icons/platelegs.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 7500, max: 22500 },
            { key: STATS.CLICK_DAMAGE.key, min: 1800, max: 5400 },
        ]
    },
    BONE_LEGPLATES: { // Lvl 301+ Unique
        id: 'BONE_LEGPLATES',
        name: "Bone Legplates",
        type: 'platelegs',
        icon: 'images/icons/platelegs.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 6500, max: 19500 },
            { key: STATS.MAGIC_FIND.key, min: 18, max: 55 },
        ]
    },
    SANDSTRIDER_LEGGINGS: { // Lvl 225/250 Boss Drop
        id: 'SANDSTRIDER_LEGGINGS',
        name: "Sandstrider Leggings",
        type: 'platelegs',
        icon: 'images/icons/platelegs.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 2800, max: 8400 },
            { key: STATS.GOLD_GAIN.key, min: 28, max: 84 },
        ]
    },
    DRAGONBONE_GREAVES: { // Lvl 400 Boss Drop
        id: 'DRAGONBONE_GREAVES',
        name: "Dragonbone Greaves",
        type: 'platelegs',
        icon: 'images/icons/platelegs.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 70000, max: 210000 },
            { key: STATS.GOLD_GAIN.key, min: 45, max: 135 },
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
    SILVER_LOCKET: { // Not in loot tables
        id: 'SILVER_LOCKET',
        name: "Silver Locket",
        type: 'necklace',
        icon: 'images/icons/necklace.png',
        possibleStats: [ { key: STATS.GOLD_GAIN.key, min: 5, max: 15 } ]
    },
    RUBY_AMULET: { // Lvl 101+, 301+
        id: 'RUBY_AMULET',
        name: "Ruby Amulet",
        type: 'necklace',
        icon: 'images/icons/necklace.png',
        possibleStats: [ { key: STATS.CLICK_DAMAGE.key, min: 100, max: 300 } ]
    },
    SAPPHIRE_AMULET: { // Lvl 101+
        id: 'SAPPHIRE_AMULET',
        name: "Sapphire Amulet",
        type: 'necklace',
        icon: 'images/icons/necklace.png',
        possibleStats: [ { key: STATS.DPS.key, min: 200, max: 600 } ]
    },
    EMERALD_CHARM: { // Not in loot tables
        id: 'EMERALD_CHARM',
        name: "Emerald Charm",
        type: 'necklace',
        icon: 'images/icons/necklace.png',
        possibleStats: [ { key: STATS.GOLD_GAIN.key, min: 15, max: 45 } ]
    },
    TOPAZ_TALISMAN: { // Lvl 226+
        id: 'TOPAZ_TALISMAN',
        name: "Topaz Talisman",
        type: 'necklace',
        icon: 'images/icons/necklace.png',
        possibleStats: [ { key: STATS.MAGIC_FIND.key, min: 10, max: 30 } ]
    },
    AMULET_OF_THE_VIPER: { // Lvl 225/250 Boss Drop
        id: 'AMULET_OF_THE_VIPER',
        name: "Amulet of the Viper",
        type: 'necklace',
        icon: 'images/icons/necklace.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.DPS.key, min: 2000, max: 6000 },
            { key: STATS.MAGIC_FIND.key, min: 15, max: 45 },
        ]
    },
    BLOODSTONE_PENDANT: { // Lvl 301+ Unique
        id: 'BLOODSTONE_PENDANT',
        name: "Bloodstone Pendant",
        type: 'necklace',
        icon: 'images/icons/necklace.png',
        isUnique: true,
        canHaveSockets: true,
        maxSockets: 3,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 5500, max: 16500 },
            { key: STATS.DPS.key, min: 11000, max: 33000 },
        ]
    },
    AMULET_OF_POWER: { // Lvl 50+ Boss Drop
        id: 'AMULET_OF_POWER',
        name: "Amulet of Power",
        type: 'necklace',
        icon: 'images/icons/necklace.png',
        isUnique: true,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 80, max: 240 },
            { key: STATS.DPS.key, min: 160, max: 480 }
        ]
    },
    EYE_OF_THE_DRAGON: { // Lvl 400 Boss Drop
        id: 'EYE_OF_THE_DRAGON',
        name: "Eye of the Dragon",
        type: 'necklace',
        icon: 'images/icons/necklace.png',
        isUnique: true,
        canHaveSockets: true, // A rare socketed accessory
        maxSockets: 1,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 25000, max: 75000 },
            { key: STATS.DPS.key, min: 50000, max: 150000 },
            { key: STATS.MAGIC_FIND.key, min: 40, max: 120 },
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
    SILVER_RING: { // Not in loot tables
        id: 'SILVER_RING',
        name: "Silver Ring",
        type: 'ring',
        icon: 'images/icons/ring.png',
        possibleStats: [ { key: STATS.GOLD_GAIN.key, min: 3, max: 9 } ]
    },
    GOLD_RING: { // Lvl 100 Boss drop
        id: 'GOLD_RING',
        name: "Gold Ring",
        type: 'ring',
        icon: 'images/icons/ring.png',
        possibleStats: [ { key: STATS.GOLD_GAIN.key, min: 40, max: 120 } ]
    },
    BAND_OF_MIGHT: { // Not in loot tables
        id: 'BAND_OF_MIGHT',
        name: "Band of Might",
        type: 'ring',
        icon: 'images/icons/ring.png',
        possibleStats: [ { key: STATS.CLICK_DAMAGE.key, min: 15, max: 45 } ]
    },
    BAND_OF_AGILITY: { // Lvl 201+ drop
        id: 'BAND_OF_AGILITY',
        name: "Band of Agility",
        type: 'ring',
        icon: 'images/icons/ring.png',
        possibleStats: [ { key: STATS.DPS.key, min: 1500, max: 4500 } ]
    },
    RING_OF_WEALTH: { // Not in loot tables
        id: 'RING_OF_WEALTH',
        name: "Ring of Wealth",
        type: 'ring',
        icon: 'images/icons/ring.png',
        possibleStats: [ { key: STATS.GOLD_GAIN.key, min: 10, max: 50 } ]
    },
    OBSIDIAN_BAND: { // Lvl 200 Boss, Lvl 326+ mob drop
        id: 'OBSIDIAN_BAND',
        name: "Obsidian Band",
        type: 'ring',
        icon: 'images/icons/ring.png',
        isUnique: true,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 2000, max: 6000 },
            { key: STATS.DPS.key, min: 4000, max: 12000 },
        ]
    },
    SIGNET_OF_THE_LEECH: { // Lvl 300 Boss Drop
        id: 'SIGNET_OF_THE_LEECH',
        name: "Signet of the Leech",
        type: 'ring',
        icon: 'images/icons/ring.png',
        isUnique: true,
        possibleStats: [
            { key: STATS.DPS.key, min: 6000, max: 18000 },
            { key: STATS.MAGIC_FIND.key, min: 18, max: 54 },
        ]
    },
    SEAL_OF_THE_KING: { // Lvl 100 Boss Drop
        id: 'SEAL_OF_THE_KING',
        name: "Seal of the King",
        type: 'ring',
        icon: 'images/icons/ring.png',
        isUnique: true,
        possibleStats: [
            { key: STATS.GOLD_GAIN.key, min: 60, max: 180 },
            { key: STATS.MAGIC_FIND.key, min: 20, max: 60 },
        ]
    },
    DRAGONFIRE_LOOP: { // Lvl 400 Boss Drop
        id: 'DRAGONFIRE_LOOP',
        name: "Dragonfire Loop",
        type: 'ring',
        icon: 'images/icons/ring.png',
        isUnique: true,
        canHaveSockets: true, // A rare socketed accessory
        maxSockets: 1,
        possibleStats: [
            { key: STATS.CLICK_DAMAGE.key, min: 20000, max: 60000 },
            { key: STATS.DPS.key, min: 40000, max: 120000 },
            { key: STATS.GOLD_GAIN.key, min: 40, max: 120 },
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
    STUDDED_LEATHER_BELT: { // Not in loot tables
        id: 'STUDDED_LEATHER_BELT',
        name: "Studded Leather Belt",
        type: 'belt',
        icon: 'images/icons/belt.png',
        possibleStats: [ { key: STATS.DPS.key, min: 12, max: 36 } ]
    },
    IRON_GIRDLE: { // Lvl 101+ drop
        id: 'IRON_GIRDLE',
        name: "Iron Girdle",
        type: 'belt',
        icon: 'images/icons/belt.png',
        possibleStats: [ { key: STATS.DPS.key, min: 250, max: 750 } ]
    },
    SASH_OF_THE_SORCERER: { // Lvl 101+ drop
        id: 'SASH_OF_THE_SORCERER',
        name: "Sash of the Sorcerer",
        type: 'belt',
        icon: 'images/icons/belt.png',
        possibleStats: [
            { key: STATS.GOLD_GAIN.key, min: 20, max: 60 },
            { key: STATS.MAGIC_FIND.key, min: 5, max: 15 },
        ]
    },
    MIGHTY_BELT: { // Lvl 101+ drop
        id: 'MIGHTY_BELT',
        name: "Mighty Belt",
        type: 'belt',
        icon: 'images/icons/belt.png',
        possibleStats: [ { key: STATS.DPS.key, min: 300, max: 900 } ]
    },
    PLAGUE_STITCHED_CINCH: { // Lvl 351+ Unique
        id: 'PLAGUE_STITCHED_CINCH',
        name: "Plague-Stitched Cinch",
        type: 'belt',
        icon: 'images/icons/belt.png',
        isUnique: true,
        possibleStats: [
            { key: STATS.DPS.key, min: 5000, max: 15000 },
            { key: STATS.MAGIC_FIND.key, min: 18, max: 54 },
        ]
    },
    BELT_OF_THE_GIANT: { // Lvl 125/175 Boss Drop
        id: 'BELT_OF_THE_GIANT',
        name: "Belt of the Giant",
        type: 'belt',
        icon: 'images/icons/belt.png',
        isUnique: true,
        possibleStats: [
            { key: STATS.DPS.key, min: 800, max: 2400 },
            { key: STATS.CLICK_DAMAGE.key, min: 200, max: 600 },
        ]
    },
    SUNSTONE_BUCKLE: { // Not in loot tables
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
    DRAGONSCALE_BELT: { // Lvl 400 Boss Drop
        id: 'DRAGONSCALE_BELT',
        name: "Dragonscale Belt",
        type: 'belt',
        icon: 'images/icons/belt.png',
        isUnique: true,
        canHaveSockets: true, // A rare socketed accessory
        maxSockets: 1,
        possibleStats: [
            { key: STATS.DPS.key, min: 65000, max: 195000 },
            { key: STATS.CLICK_DAMAGE.key, min: 15000, max: 45000 },
        ]
    }
};