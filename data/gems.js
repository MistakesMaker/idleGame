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

     // ===================================
    // --- TIER 2 GEMS ---
    // ===================================
    BASE_RUBY_T2: {
        id: 'BASE_RUBY_T2',
        name: 'T2 Gem (Ruby)',
        type: 'ruby',
        tier: 2,
        icon: 'images/gems/fused_t2.png',
        width: 1, height: 1,
        stats: { [STATS.CLICK_DAMAGE.key]: 500 }
    },
    BASE_SAPPHIRE_T2: {
        id: 'BASE_SAPPHIRE_T2',
        name: 'T2 Gem (Sapphire)',
        type: 'sapphire',
        tier: 2,
        icon: 'images/gems/fused_t2.png',
        width: 1, height: 1,
        stats: { [STATS.DPS.key]: 2000 }
    },
    BASE_EMERALD_T2: {
        id: 'BASE_EMERALD_T2',
        name: 'T2 Gem (Emerald)',
        type: 'emerald',
        tier: 2,
        icon: 'images/gems/fused_t2.png',
        width: 1, height: 1,
        stats: { [STATS.GOLD_GAIN.key]: 10 }
    },
    BASE_TOPAZ_T2: {
        id: 'BASE_TOPAZ_T2',
        name: 'T2 Gem (Topaz)',
        type: 'topaz',
        tier: 2,
        icon: 'images/gems/fused_t2.png',
        width: 1, height: 1,
        stats: { [STATS.MAGIC_FIND.key]: 0.5 }
    },
    
    // ===================================
    // --- TIER 3 GEMS ---
    // ===================================
    BASE_RUBY_T3: { id: 'BASE_RUBY_T3', name: 'T3 Gem (Ruby)', type: 'ruby', tier: 3, icon: 'images/gems/fused_t3.png', width: 1, height: 1, stats: { [STATS.CLICK_DAMAGE.key]: 1000 } },
    BASE_SAPPHIRE_T3: { id: 'BASE_SAPPHIRE_T3', name: 'T3 Gem (Sapphire)', type: 'sapphire', tier: 3, icon: 'images/gems/fused_t3.png', width: 1, height: 1, stats: { [STATS.DPS.key]: 4000 } },
    BASE_EMERALD_T3: { id: 'BASE_EMERALD_T3', name: 'T3 Gem (Emerald)', type: 'emerald', tier: 3, icon: 'images/gems/fused_t3.png', width: 1, height: 1, stats: { [STATS.GOLD_GAIN.key]: 20 } },
    BASE_TOPAZ_T3: { id: 'BASE_TOPAZ_T3', name: 'T3 Gem (Topaz)', type: 'topaz', tier: 3, icon: 'images/gems/fused_t3.png', width: 1, height: 1, stats: { [STATS.MAGIC_FIND.key]: 1.0 } },
    
    // ===================================
    // --- TIER 4 GEMS ---
    // ===================================
    BASE_RUBY_T4: { id: 'BASE_RUBY_T4', name: 'T4 Gem (Ruby)', type: 'ruby', tier: 4, icon: 'images/gems/fused_t4.png', width: 1, height: 1, stats: { [STATS.CLICK_DAMAGE.key]: 2000 } },
    BASE_SAPPHIRE_T4: { id: 'BASE_SAPPHIRE_T4', name: 'T4 Gem (Sapphire)', type: 'sapphire', tier: 4, icon: 'images/gems/fused_t4.png', width: 1, height: 1, stats: { [STATS.DPS.key]: 8000 } },
    BASE_EMERALD_T4: { id: 'BASE_EMERALD_T4', name: 'T4 Gem (Emerald)', type: 'emerald', tier: 4, icon: 'images/gems/fused_t4.png', width: 1, height: 1, stats: { [STATS.GOLD_GAIN.key]: 40 } },
    BASE_TOPAZ_T4: { id: 'BASE_TOPAZ_T4', name: 'T4 Gem (Topaz)', type: 'topaz', tier: 4, icon: 'images/gems/fused_t4.png', width: 1, height: 1, stats: { [STATS.MAGIC_FIND.key]: 2.0 } },
    
    // ===================================
    // --- TIER 5 GEMS ---
    // ===================================
    BASE_RUBY_T5: { id: 'BASE_RUBY_T5', name: 'T5 Gem (Ruby)', type: 'ruby', tier: 5, icon: 'images/gems/fused_t5.png', width: 1, height: 1, stats: { [STATS.CLICK_DAMAGE.key]: 4000 } },
    BASE_SAPPHIRE_T5: { id: 'BASE_SAPPHIRE_T5', name: 'T5 Gem (Sapphire)', type: 'sapphire', tier: 5, icon: 'images/gems/fused_t5.png', width: 1, height: 1, stats: { [STATS.DPS.key]: 16000 } },
    BASE_EMERALD_T5: { id: 'BASE_EMERALD_T5', name: 'T5 Gem (Emerald)', type: 'emerald', tier: 5, icon: 'images/gems/fused_t5.png', width: 1, height: 1, stats: { [STATS.GOLD_GAIN.key]: 80 } },
    BASE_TOPAZ_T5: { id: 'BASE_TOPAZ_T5', name: 'T5 Gem (Topaz)', type: 'topaz', tier: 5, icon: 'images/gems/fused_t5.png', width: 1, height: 1, stats: { [STATS.MAGIC_FIND.key]: 4.0 } },
    
    // ===================================
    // --- TIER 6 GEMS ---
    // ===================================
    BASE_RUBY_T6: { id: 'BASE_RUBY_T6', name: 'T6 Gem (Ruby)', type: 'ruby', tier: 6, icon: 'images/gems/fused_t6.png', width: 1, height: 1, stats: { [STATS.CLICK_DAMAGE.key]: 8000 } },
    BASE_SAPPHIRE_T6: { id: 'BASE_SAPPHIRE_T6', name: 'T6 Gem (Sapphire)', type: 'sapphire', tier: 6, icon: 'images/gems/fused_t6.png', width: 1, height: 1, stats: { [STATS.DPS.key]: 32000 } },
    BASE_EMERALD_T6: { id: 'BASE_EMERALD_T6', name: 'T6 Gem (Emerald)', type: 'emerald', tier: 6, icon: 'images/gems/fused_t6.png', width: 1, height: 1, stats: { [STATS.GOLD_GAIN.key]: 160 } },
    BASE_TOPAZ_T6: { id: 'BASE_TOPAZ_T6', name: 'T6 Gem (Topaz)', type: 'topaz', tier: 6, icon: 'images/gems/fused_t6.png', width: 1, height: 1, stats: { [STATS.MAGIC_FIND.key]: 8.0 } },
    
    // ===================================
    // --- TIER 7 GEMS ---
    // ===================================
    BASE_RUBY_T7: { id: 'BASE_RUBY_T7', name: 'T7 Gem (Ruby)', type: 'ruby', tier: 7, icon: 'images/gems/fused_t7.png', width: 1, height: 1, stats: { [STATS.CLICK_DAMAGE.key]: 16000 } },
    BASE_SAPPHIRE_T7: { id: 'BASE_SAPPHIRE_T7', name: 'T7 Gem (Sapphire)', type: 'sapphire', tier: 7, icon: 'images/gems/fused_t7.png', width: 1, height: 1, stats: { [STATS.DPS.key]: 64000 } },
    BASE_EMERALD_T7: { id: 'BASE_EMERALD_T7', name: 'T7 Gem (Emerald)', type: 'emerald', tier: 7, icon: 'images/gems/fused_t7.png', width: 1, height: 1, stats: { [STATS.GOLD_GAIN.key]: 320 } },
    BASE_TOPAZ_T7: { id: 'BASE_TOPAZ_T7', name: 'T7 Gem (Topaz)', type: 'topaz', tier: 7, icon: 'images/gems/fused_t7.png', width: 1, height: 1, stats: { [STATS.MAGIC_FIND.key]: 16.0 } },
    
    // ===================================
    // --- TIER 8 GEMS ---
    // ===================================
    BASE_RUBY_T8: { id: 'BASE_RUBY_T8', name: 'T8 Gem (Ruby)', type: 'ruby', tier: 8, icon: 'images/gems/fused_t8.png', width: 1, height: 1, stats: { [STATS.CLICK_DAMAGE.key]: 32000 } },
    BASE_SAPPHIRE_T8: { id: 'BASE_SAPPHIRE_T8', name: 'T8 Gem (Sapphire)', type: 'sapphire', tier: 8, icon: 'images/gems/fused_t8.png', width: 1, height: 1, stats: { [STATS.DPS.key]: 128000 } },
    BASE_EMERALD_T8: { id: 'BASE_EMERALD_T8', name: 'T8 Gem (Emerald)', type: 'emerald', tier: 8, icon: 'images/gems/fused_t8.png', width: 1, height: 1, stats: { [STATS.GOLD_GAIN.key]: 640 } },
    BASE_TOPAZ_T8: { id: 'BASE_TOPAZ_T8', name: 'T8 Gem (Topaz)', type: 'topaz', tier: 8, icon: 'images/gems/fused_t8.png', width: 1, height: 1, stats: { [STATS.MAGIC_FIND.key]: 32.0 } },
    
    // ===================================
    // --- TIER 9 GEMS ---
    // ===================================
    BASE_RUBY_T9: { id: 'BASE_RUBY_T9', name: 'T9 Gem (Ruby)', type: 'ruby', tier: 9, icon: 'images/gems/fused_t9.png', width: 1, height: 1, stats: { [STATS.CLICK_DAMAGE.key]: 64000 } },
    BASE_SAPPHIRE_T9: { id: 'BASE_SAPPHIRE_T9', name: 'T9 Gem (Sapphire)', type: 'sapphire', tier: 9, icon: 'images/gems/fused_t9.png', width: 1, height: 1, stats: { [STATS.DPS.key]: 256000 } },
    BASE_EMERALD_T9: { id: 'BASE_EMERALD_T9', name: 'T9 Gem (Emerald)', type: 'emerald', tier: 9, icon: 'images/gems/fused_t9.png', width: 1, height: 1, stats: { [STATS.GOLD_GAIN.key]: 1280 } },
    BASE_TOPAZ_T9: { id: 'BASE_TOPAZ_T9', name: 'T9 Gem (Topaz)', type: 'topaz', tier: 9, icon: 'images/gems/fused_t9.png', width: 1, height: 1, stats: { [STATS.MAGIC_FIND.key]: 64.0 } },
    
    // ===================================
    // --- TIER 10 GEMS ---
    // ===================================
    BASE_RUBY_T10: { id: 'BASE_RUBY_T10', name: 'T10 Gem (Ruby)', type: 'ruby', tier: 10, icon: 'images/gems/fused_t10.png', width: 1, height: 1, stats: { [STATS.CLICK_DAMAGE.key]: 128000 } },
    BASE_SAPPHIRE_T10: { id: 'BASE_SAPPHIRE_T10', name: 'T10 Gem (Sapphire)', type: 'sapphire', tier: 10, icon: 'images/gems/fused_t10.png', width: 1, height: 1, stats: { [STATS.DPS.key]: 512000 } },
    BASE_EMERALD_T10: { id: 'BASE_EMERALD_T10', name: 'T10 Gem (Emerald)', type: 'emerald', tier: 10, icon: 'images/gems/fused_t10.png', width: 1, height: 1, stats: { [STATS.GOLD_GAIN.key]: 2560 } },
    BASE_TOPAZ_T10: { id: 'BASE_TOPAZ_T10', name: 'T10 Gem (Topaz)', type: 'topaz', tier: 10, icon: 'images/gems/fused_t10.png', width: 1, height: 1, stats: { [STATS.MAGIC_FIND.key]: 128.0 } },
};