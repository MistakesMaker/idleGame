// --- START OF FILE data/consumables.js ---

/*
* CONSUMABLE DEFINITION GUIDE
*
* id: A unique key for the consumable.
* name: The display name for the UI.
* type: Must be 'consumable'.
* icon: Path to the item's image.
* width/height: Item's size in the inventory grid.
* description: Player-facing explanation of what the item does.
* effect: An object describing the item's function.
*   - type: 'permanentFlag' -> Sets a boolean flag in gameState to true.
*   - type: 'resource' -> Instantly grants a specified amount of a resource.
*   - type: 'timedBuff' -> Applies a temporary buff to a player stat.
*   - type: 'permanentStat' -> Permanently adds a value to a stat in gameState.
*   - type: 'targetedItemModifier' -> Puts the player in a state to select an item to modify.
*/
export const CONSUMABLES = {
    // --- PERMANENT UPGRADES ---
    WISDOM_OF_THE_OVERWORLD: {
        id: 'WISDOM_OF_THE_OVERWORLD',
        name: "Wisdom of the Overworld",
        type: 'consumable',
        icon: 'images/consumables/wisdom_of_the_overworld.png',
        width: 2, height: 2,
        description: "A one-time use scroll from ancient times. When consumed, permanently increases your T1-T4 gems combining success rate from 50% to 60%.",
        effect: {
            type: 'permanentFlag',
            key: 'wisdomOfTheOverworldUsed'
        }
    },
     WISDOM_OF_THE_UNDERDARK: {
        id: 'WISDOM_OF_THE_UNDERDARK',
        name: "Wisdom of the Underdark",
        type: 'consumable',
        icon: 'images/consumables/wisdom_of_the_underdark.png',
        width: 2, height: 2,
        description: "A one-time use scroll from a forgotten realm. When consumed, permanently increases your T5-T8 gems combining success rate from 50% to 60%.",
        effect: {
            type: 'permanentFlag',
            key: 'wisdomOfTheUnderdarkUsed'
        }
    },
    ARTISAN_DRILL: {
        id: 'ARTISAN_DRILL',
        name: "Artisan's Drill",
        type: 'consumable',
        icon: 'images/consumables/artisan_drill.png',
        width: 2, height: 2,
        description: "A master craftsman's tool. Use on an item to carve a new socket, up to the item's maximum potential. Requires selecting an item after use.",
        effect: {
            type: 'targetedItemModifier',
            key: 'addSocket'
        }
    },
    TOME_OF_STRENGTH: {
        id: 'TOME_OF_STRENGTH',
        name: "Tome of Strength",
        type: 'consumable',
        icon: 'images/consumables/tome_of_strength.png',
        width: 2, height: 2,
        description: "A book of forgotten power. Consuming it permanently increases your total Click Damage by 5%.",
        effect: {
            type: 'permanentStat',
            key: 'totalClickDamage',
            value: 5, // Represents +5%
        }
    },
    TOME_OF_AGILITY: {
        id: 'TOME_OF_AGILITY',
        name: "Tome of Agility",
        type: 'consumable',
        icon: 'images/consumables/tome_of_agility.png',
        width: 2, height: 2,
        description: "A book of forgotten techniques. Consuming it permanently increases your total DPS by 5%.",
        effect: {
            type: 'permanentStat',
            key: 'totalDps',
            value: 5, // Represents +5%
        }
    },

    // --- RESOURCE REWARDS ---
    SCRAP_CACHE_SMALL: {
        id: 'SCRAP_CACHE_SMALL',
        name: 'Small Scrap Cache',
        type: 'consumable',
        icon: 'images/consumables/scrap_cache_small.png',
        width: 1, height: 1,
        description: "A small bundle of salvaged parts. Grants 1,000 Scrap when consumed.",
        effect: {
            type: 'resource',
            resource: 'scrap',
            amount: 1000
        }
    },
    SCRAP_CACHE_MEDIUM: {
        id: 'SCRAP_CACHE_MEDIUM',
        name: 'Medium Scrap Cache',
        type: 'consumable',
        icon: 'images/consumables/scrap_cache_medium.png',
        width: 1, height: 1,
        description: "A well-packed crate of salvaged parts. Grants 5,000 Scrap when consumed.",
        effect: {
            type: 'resource',
            resource: 'scrap',
            amount: 5000
        }
    },
    SCRAP_CACHE_LARGE: {
        id: 'SCRAP_CACHE_LARGE',
        name: 'Large Scrap Cache',
        type: 'consumable',
        icon: 'images/consumables/scrap_cache_large.png',
        width: 1, height: 1,
        description: "A massive hoard of salvaged parts. Grants 25,000 Scrap when consumed.",
        effect: {
            type: 'resource',
            resource: 'scrap',
            amount: 25000
        }
    },

    // --- TIMED BUFFS ---
    GOLD_BOOSTER_MINOR: {
        id: 'GOLD_BOOSTER_MINOR',
        name: 'Minor Gold Booster',
        type: 'consumable',
        icon: 'images/consumables/gold_booster_minor.png',
        width: 1, height: 1,
        description: "A charm of minor fortune. Increases Gold Gain by 50% for 10 minutes.",
        effect: {
            type: 'timedBuff',
            name: 'Minor Gold Boost',
            stats: { bonusGold: 50 },
            duration: 600 // 10 minutes in seconds
        }
    },
    GOLD_BOOSTER_MAJOR: {
        id: 'GOLD_BOOSTER_MAJOR',
        name: 'Major Gold Booster',
        type: 'consumable',
        icon: 'images/consumables/gold_booster_major.png',
        width: 1, height: 1,
        description: "A charm of major fortune. Increases Gold Gain by 200% for 10 minutes.",
        effect: {
            type: 'timedBuff',
            name: 'Major Gold Boost',
            stats: { bonusGold: 200 },
            duration: 600
        }
    },
    XP_ELIXIR_MINOR: {
        id: 'XP_ELIXIR_MINOR',
        name: 'Minor Elixir of Learning',
        type: 'consumable',
        icon: 'images/consumables/xp_elixir_minor.png',
        width: 1, height: 1,
        description: "A simple brew that sharpens the mind. Increases XP Gain by 50% for 15 minutes.",
        effect: {
            type: 'timedBuff',
            name: 'Minor XP Boost',
            stats: { bonusXp: 50 },
            duration: 900 // 15 minutes
        }
    },
    XP_ELIXIR_MAJOR: {
        id: 'XP_ELIXIR_MAJOR',
        name: 'Major Elixir of Learning',
        type: 'consumable',
        icon: 'images/consumables/xp_elixir_major.png',
        width: 1, height: 1,
        description: "A potent brew that expands the mind. Increases XP Gain by 200% for 15 minutes.",
        effect: {
            type: 'timedBuff',
            name: 'Major XP Boost',
            stats: { bonusXp: 200 },
            duration: 900
        }
    },
    MAGIC_FIND_POTION_MINOR: {
        id: 'MAGIC_FIND_POTION_MINOR',
        name: 'Potion of Minor Luck',
        type: 'consumable',
        icon: 'images/consumables/magic_find_potion_minor.png',
        width: 1, height: 1,
        description: "A swirling, iridescent liquid. Increases Magic Find by 10% for 10 minutes.",
        effect: {
            type: 'timedBuff',
            name: 'Minor Luck',
            stats: { magicFind: 10 },
            duration: 600 // 10 minutes
        }
    },
    GEM_SEEKER_DRAFT_MINOR: {
        id: 'GEM_SEEKER_DRAFT_MINOR',
        name: 'Minor Gem Seeker\'s Draft',
        type: 'consumable',
        icon: 'images/consumables/gem_seeker_draft_minor.png',
        width: 1, height: 1,
        description: "Makes your eyes sharp to the glimmer of gems. Increases Gem Find chance by 5% for 10 minutes.",
        effect: {
            type: 'timedBuff',
            name: 'Minor Gem Seeker',
            stats: { gemFindChance: 5 },
            duration: 600
        }
    },

    // --- NEW POTIONS START HERE ---
    POTION_FUSED_POWER: {
        id: 'POTION_FUSED_POWER',
        name: 'Potion of Fused Power',
        type: 'consumable',
        icon: 'images/consumables/potion_fused_power.png',
        width: 1, height: 1,
        description: "For 5 minutes, 100% of your total DPS is added to your total Click Damage.",
        effect: {
            type: 'timedBuff',
            name: 'Fused Power',
            stats: { dpsToClickDamagePercent: 100 },
            duration: 300 // 5 minutes in seconds
        }
    },
    POTION_GIANTS_STRENGTH: {
        id: 'POTION_GIANTS_STRENGTH',
        name: "Potion of Giant's Strength",
        type: 'consumable',
        icon: 'images/consumables/potion_giants_strength.png',
        width: 1, height: 1,
        description: "For 5 minutes, your total Click Damage is increased by 100%.",
        effect: {
            type: 'timedBuff',
            name: "Giant's Strength",
            stats: { bonusClickDamagePercent: 100 },
            duration: 300 // 5 minutes in seconds
        }
    },
    POTION_BOSS_SLAYER: {
        id: 'POTION_BOSS_SLAYER',
        name: "Boss Slayer's Brew",
        type: 'consumable',
        icon: 'images/consumables/potion_boss_slayer.png',
        width: 1, height: 1,
        description: "For 3 minutes, deal 100% more damage to all Boss-type monsters.",
        effect: {
            type: 'timedBuff',
            name: "Boss Slayer",
            stats: { bonusBossDamagePercent: 100 },
            duration: 300 // 3 minutes in seconds
        }
    },
    POTION_DEADLY_FOCUS: {
        id: 'POTION_DEADLY_FOCUS',
        name: "Flask of Deadly Focus",
        type: 'consumable',
        icon: 'images/consumables/potion_deadly_focus.png',
        width: 1, height: 1,
        description: "For 5 minutes, increases your Critical Hit Chance by 30% and Critical Hit Damage by 50%.",
        effect: {
            type: 'timedBuff',
            name: "Deadly Focus",
            stats: { bonusCritChance: 30, bonusCritDamage: 50 },
            duration: 300 // 5 minutes in seconds
        }
    },
    POTION_RAGING_AUTOMATON: {
        id: 'POTION_RAGING_AUTOMATON',
        name: "Draught of the Raging Automaton",
        type: 'consumable',
        icon: 'images/consumables/potion_raging_automaton.png',
        width: 1, height: 1,
        description: "For 5 minute, all of your automatic DPS hits are guaranteed to be critical hits.",
        effect: {
            type: 'timedBuff',
            name: "Raging Automaton",
            specialEffect: 'guaranteedDpsCrit',
            duration: 300 // 5 minutes in seconds
        }
    },
    POTION_LIQUID_LUCK: {
        id: 'POTION_LIQUID_LUCK',
        name: "Liquid Luck",
        type: 'consumable',
        icon: 'images/consumables/potion_liquid_luck.png',
        width: 1, height: 1,
        description: "For 15 minutes, gain +1000% Gold Gain, +100% Magic Find.",
        effect: {
            type: 'timedBuff',
            name: "Liquid Luck",
            stats: { bonusGold: 1000, magicFind: 100 },
            duration: 900 // 15 minutes in seconds
        }
    },
};