// --- START OF FILE data/gems.js ---

/*
* GEM DEFINITION GUIDE
*
* These are the "base" gems that drop from monsters.
* They are all Tier 1 and only have a single stat.
* Fusing them creates new, multi-stat gems.
*
* id: A unique key for this gem base.
* name: The display name of the base gem.
* type: The general category, used for the name (e.g., a "Ruby" is a T1 Gem).
* tier: All base gems are Tier 1.
* icon: The path to the gem's image.
* width: The item's width in grid cells.
* height: The item's height in grid cells.
* stat & value: The single stat this base gem provides.
*/

import { STATS } from './stat_pools.js';

export const GEMS = {
    // These are now considered "ingredient" gems of T1
    BASE_RUBY: {
        id: 'BASE_RUBY',
        name: 'T1 Gem (Ruby)',
        type: 'ruby',
        tier: 1,
        icon: 'images/gems/ruby_1.png',
        width: 1, height: 1,
        stats: { [STATS.CLICK_DAMAGE.key]: 5 }
    },
    BASE_SAPPHIRE: {
        id: 'BASE_SAPPHIRE',
        name: 'T1 Gem (Sapphire)',
        type: 'sapphire',
        tier: 1,
        icon: 'images/gems/sapphire_1.png',
        width: 1, height: 1,
        stats: { [STATS.DPS.key]: 10 }
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
        stats: { [STATS.MAGIC_FIND.key]: 3 }
    },
    BASE_AMETHYST: {
        id: 'BASE_AMETHYST',
        name: 'T1 Gem (Amethyst)',
        type: 'amethyst',
        tier: 1,
        icon: 'images/gems/amethyst_1.png',
        width: 1, height: 1,
        synergy: {
            source: 'dps',
            target: 'clickDamage',
            value: 0.1
        }
    },
};