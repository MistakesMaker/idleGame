/*
* PERMANENT UPGRADES DEFINITION GUIDE
*
* These upgrades are purchased with gold but are PERMANENT and survive prestige resets.
* They represent the long-term progression for the player.
*
* id: A unique key for the upgrade. This will be used to store its level in the gameState.
* name: The display name for the UI.
* description: A player-facing description. Use placeholders like `{value}` which will be
*              dynamically replaced in the UI with the calculated bonus.
* icon: A Font Awesome icon class for display.
* baseCost: The gold cost for the very first level (level 1).
* costScalar: A multiplier that determines how fast the cost increases. The formula used
*             will be: cost = baseCost * (costScalar ^ currentLevel). A higher scalar
*             means the cost ramps up very quickly, making it a long-term gold sink.
* bonusType: 'PERCENT' or 'FLAT'. Used for display purposes.
* bonusPerLevel: The amount of bonus each level provides. For 'PERCENT', 0.5 means +0.5%.
* maxLevel: The maximum level for this upgrade. Can be used to cap certain powerful bonuses.
*/

export const PERMANENT_UPGRADES = {
    GOLD_MASTERY: {
        id: 'GOLD_MASTERY',
        name: "Gold Mastery",
        description: "Increases the base Gold dropped by monsters by <span>{value}%</span>.",
        icon: 'fas fa-coins',
        baseCost: 1000,
        costScalar: 1.25,
        bonusType: 'PERCENT',
        bonusPerLevel: 1, // +1% per level
        maxLevel: Infinity,
    },
    CRITICAL_POWER: {
        id: 'CRITICAL_POWER',
        name: "Critical Power",
        description: "Gain a <span>{value}%</span> chance to deal a critical hit.",
        icon: 'fas fa-bolt',
        baseCost: 5000,
        costScalar: 2.2,
        bonusType: 'PERCENT',
        bonusPerLevel: 0.2, // +0.2% per level
        maxLevel: 500, // Capped at 100%
    },
    CRITICAL_DAMAGE: {
        id: 'CRITICAL_DAMAGE',
        name: "Critical Damage",
        description: "Critical hits deal an additional <span>{value}%</span> damage. Base crit damage is 1.5x.",
        icon: 'fas fa-crosshairs',
        baseCost: 4000,
        costScalar: 1.4,
        bonusType: 'PERCENT',
        bonusPerLevel: 5, // +5% per level
        maxLevel: Infinity,
    },
    PRESTIGE_POWER: {
        id: 'PRESTIGE_POWER',
        name: "Prestige Power",
        description: "For each Prestige, increase absorbed stat bonuses by <span>{value}%</span>.",
        icon: 'fas fa-award',
        baseCost: 100000,
        costScalar: 3,
        bonusType: 'PERCENT',
        bonusPerLevel: 0.25, // %0.25 per level
        maxLevel: Infinity,
    },
    SCRAP_SCAVENGER: {
        id: 'SCRAP_SCAVENGER',
        name: "Scrap Scavenger",
        description: "Gain <span>{value}%</span> more Scrap from salvaging items.",
        icon: 'fas fa-cogs',
        baseCost: 7500,
        costScalar: 1.5,
        bonusType: 'PERCENT',
        bonusPerLevel: 2, // +2% per level
        maxLevel: Infinity,
    },
    GEM_FIND: {
        id: 'GEM_FIND',
        name: "Gem Find",
        description: "Gain a <span>{value}%</span> chance to double any gem drop you receive.",
        icon: 'fas fa-search-plus',
        baseCost: 50000,
        costScalar: 2.0,
        bonusType: 'PERCENT',
        bonusPerLevel: 0.5, // +0.5% per level
        maxLevel: 200, // Capped at 100%
    },
    BOSS_HUNTER: {
        id: 'BOSS_HUNTER',
        name: "Boss Hunter",
        description: "Deal <span>{value}%</span> more damage to Mini-Bosses, Bosses, and Big Bosses.",
        icon: 'fas fa-skull-crossbones',
        baseCost: 20000,
        costScalar: 1.6,
        bonusType: 'PERCENT',
        bonusPerLevel: 2, // +2% per level
        maxLevel: Infinity,
    },
    SWIFT_STRIKES: {
        id: 'SWIFT_STRIKES',
        name: "Swift Strikes",
        description: "Your attacks have a <span>{value}%</span> chance to hit an additional time.",
        icon: 'fas fa-fighter-jet',
        baseCost: 100000,
        costScalar: 2.8,
        bonusType: 'PERCENT',
        bonusPerLevel: 0.1, // +0.1% per level
        maxLevel: Infinity,
    },
    LEGACY_KEEPER: {
        id: 'LEGACY_KEEPER',
        name: "Legacy Keeper",
        description: "Carry over <span>{value}</span> additional item(s) through Prestige.",
        icon: 'fas fa-archive',
        baseCost: 1000000, // Starts very expensive
        costScalar: 100,  // Cost scales extremely fast
        bonusType: 'FLAT',
        bonusPerLevel: 1, // +1 item slot per level
        maxLevel: 8, 
    },
};