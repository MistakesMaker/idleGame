// --- START OF FILE data/gems.js ---

/*
* GEM DEFINITION GUIDE
*
* These are the "base" gems that drop from monsters.
* Tier 1 gems are common, while Tier 2 gems start dropping in later-game zones.
* Fusing gems creates new, more powerful multi-stat gems.
*
* id: A unique key for this gem base.
* name: The display name of the base gem.
* type: The general category (e.g., a "Ruby" is a T1 Gem).
* tier: The power level of the gem.
* icon: The path to the gem's image.
* width/height: The item's size in grid cells.
* stats/synergy: The bonus the gem provides.
*/

import { STATS } from './stat_pools.js';

export const GEMS = {
    // ===================================
    // --- TIER 1 GEMS (Levels 1-400) ---
    // ===================================
    BASE_RUBY: {
        id: 'BASE_RUBY',
        name: 'T1 Gem (Ruby)',
        type: 'ruby',
        tier: 1,
        icon: 'images/gems/ruby_1.png',
        width: 1, height: 1,
        stats: { [STATS.CLICK_DAMAGE.key]: 250 }
    },
    BASE_SAPPHIRE: {
        id: 'BASE_SAPPHIRE',
        name: 'T1 Gem (Sapphire)',
        type: 'sapphire',
        tier: 1,
        icon: 'images/gems/sapphire_1.png',
        width: 1, height: 1,
        stats: { [STATS.DPS.key]: 1000 }
    },
    BASE_EMERALD: {
        id: 'BASE_EMERALD',
        name: 'T1 Gem (Emerald)',
        type: 'emerald',
        tier: 1,
        icon: 'images/gems/emerald_1.png',
        width: 1, height: 1,
        stats: { [STATS.GOLD_GAIN.key]: 5 }
    },
    BASE_TOPAZ: {
        id: 'BASE_TOPAZ',
        name: 'T1 Gem (Topaz)',
        type: 'topaz',
        tier: 1,
        icon: 'images/gems/topaz_1.png',
        width: 1, height: 1,
        stats: { [STATS.MAGIC_FIND.key]: 0.25 }
    },
    BASE_AMETHYST: {
        id: 'BASE_AMETHYST',
        name: 'T1 Gem (Amethyst)',
        type: 'amethyst',
        tier: 1,
        isUnique: true,
        icon: 'images/gems/amethyst_1.png',
        width: 1, height: 1,
        synergy: {
            source: 'dps',
            target: 'clickDamage',
            value: 0.01
        }
    },

    // ================================================
    // --- TIER 2 GEMS (Drops starting in Levels 401+) ---
    // These are single-stat T2 gems that can drop directly,
    // giving players a head start on crafting.
    // ================================================
    BASE_RUBY_T2: {
        id: 'BASE_RUBY_T2',
        name: 'T2 Fused Gem',
        type: 'ruby',
        tier: 2,
        icon: 'images/gems/fused_t2.png',
        width: 1, height: 1,
        stats: { [STATS.CLICK_DAMAGE.key]: 500 } // 2x T1
    },
    BASE_SAPPHIRE_T2: {
        id: 'BASE_SAPPHIRE_T2',
        name: 'T2 Fused Gem',
        type: 'sapphire',
        tier: 2,
        icon: 'images/gems/fused_t2.png',
        width: 1, height: 1,
        stats: { [STATS.DPS.key]: 2000 } // 2x T1
    },
    BASE_EMERALD_T2: {
        id: 'BASE_EMERALD_T2',
        name: 'T2 Fused Gem',
        type: 'emerald',
        tier: 2,
        icon: 'images/gems/fused_t2.png',
        width: 1, height: 1,
        stats: { [STATS.GOLD_GAIN.key]: 10 } // 2x T1
    },
    BASE_TOPAZ_T2: {
        id: 'BASE_TOPAZ_T2',
        name: 'T2 Fused Gem',
        type: 'topaz',
        tier: 2,
        icon: 'images/gems/fused_t2.png',
        width: 1, height: 1,
        stats: { [STATS.MAGIC_FIND.key]: 0.5 } // 2x T1
    },
    BASE_AMETHYST_T2: {
        id: 'BASE_AMETHYST_T2',
        name: 'T2 Fused Gem',
        type: 'amethyst',
        tier: 2,
        isUnique: true,
        icon: 'images/gems/fused_t2.png',
        width: 1, height: 1,
        synergy: {
            source: 'dps',
            target: 'clickDamage',
            value: 0.02 // 2x T1
        }
    },
};