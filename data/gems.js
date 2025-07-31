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
        stats: { [STATS.CLICK_DAMAGE.key]: 125 } // Halved from 250
    },
    BASE_SAPPHIRE: {
        id: 'BASE_SAPPHIRE',
        name: 'T1 Gem (Sapphire)',
        type: 'sapphire',
        tier: 1,
        icon: 'images/gems/sapphire_1.png',
        width: 1, height: 1,
        stats: { [STATS.DPS.key]: 500 } // Halved from 1000
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
        stats: { [STATS.CLICK_DAMAGE.key]: 250 } // Halved from 500
    },
    BASE_SAPPHIRE_T2: {
        id: 'BASE_SAPPHIRE_T2',
        name: 'T2 Gem (Sapphire)',
        type: 'sapphire',
        tier: 2,
        icon: 'images/gems/fused_t2.png',
        width: 1, height: 1,
        stats: { [STATS.DPS.key]: 1000 } // Halved from 2000
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
    BASE_RUBY_T3: { id: 'BASE_RUBY_T3', name: 'T3 Gem (Ruby)', type: 'ruby', tier: 3, icon: 'images/gems/fused_t3.png', width: 1, height: 1, stats: { [STATS.CLICK_DAMAGE.key]: 500 } }, // Halved
    BASE_SAPPHIRE_T3: { id: 'BASE_SAPPHIRE_T3', name: 'T3 Gem (Sapphire)', type: 'sapphire', tier: 3, icon: 'images/gems/fused_t3.png', width: 1, height: 1, stats: { [STATS.DPS.key]: 2000 } }, // Halved
    BASE_EMERALD_T3: { id: 'BASE_EMERALD_T3', name: 'T3 Gem (Emerald)', type: 'emerald', tier: 3, icon: 'images/gems/fused_t3.png', width: 1, height: 1, stats: { [STATS.GOLD_GAIN.key]: 20 } },
    BASE_TOPAZ_T3: { id: 'BASE_TOPAZ_T3', name: 'T3 Gem (Topaz)', type: 'topaz', tier: 3, icon: 'images/gems/fused_t3.png', width: 1, height: 1, stats: { [STATS.MAGIC_FIND.key]: 1.0 } },
    
    // ===================================
    // --- TIER 4 GEMS ---
    // ===================================
    BASE_RUBY_T4: { id: 'BASE_RUBY_T4', name: 'T4 Gem (Ruby)', type: 'ruby', tier: 4, icon: 'images/gems/fused_t4.png', width: 1, height: 1, stats: { [STATS.CLICK_DAMAGE.key]: 1000 } }, // Halved
    BASE_SAPPHIRE_T4: { id: 'BASE_SAPPHIRE_T4', name: 'T4 Gem (Sapphire)', type: 'sapphire', tier: 4, icon: 'images/gems/fused_t4.png', width: 1, height: 1, stats: { [STATS.DPS.key]: 4000 } }, // Halved
    BASE_EMERALD_T4: { id: 'BASE_EMERALD_T4', name: 'T4 Gem (Emerald)', type: 'emerald', tier: 4, icon: 'images/gems/fused_t4.png', width: 1, height: 1, stats: { [STATS.GOLD_GAIN.key]: 40 } },
    BASE_TOPAZ_T4: { id: 'BASE_TOPAZ_T4', name: 'T4 Gem (Topaz)', type: 'topaz', tier: 4, icon: 'images/gems/fused_t4.png', width: 1, height: 1, stats: { [STATS.MAGIC_FIND.key]: 2.0 } },
    
    // ===================================
    // --- TIER 5 GEMS ---
    // ===================================
    BASE_RUBY_T5: { id: 'BASE_RUBY_T5', name: 'T5 Gem (Ruby)', type: 'ruby', tier: 5, icon: 'images/gems/fused_t5.png', width: 1, height: 1, stats: { [STATS.CLICK_DAMAGE.key]: 2000 } }, // Halved
    BASE_SAPPHIRE_T5: { id: 'BASE_SAPPHIRE_T5', name: 'T5 Gem (Sapphire)', type: 'sapphire', tier: 5, icon: 'images/gems/fused_t5.png', width: 1, height: 1, stats: { [STATS.DPS.key]: 8000 } }, // Halved
    BASE_EMERALD_T5: { id: 'BASE_EMERALD_T5', name: 'T5 Gem (Emerald)', type: 'emerald', tier: 5, icon: 'images/gems/fused_t5.png', width: 1, height: 1, stats: { [STATS.GOLD_GAIN.key]: 80 } },
    BASE_TOPAZ_T5: { id: 'BASE_TOPAZ_T5', name: 'T5 Gem (Topaz)', type: 'topaz', tier: 5, icon: 'images/gems/fused_t5.png', width: 1, height: 1, stats: { [STATS.MAGIC_FIND.key]: 4.0 } },
    
    // ===================================
    // --- TIER 6 GEMS ---
    // ===================================
    BASE_RUBY_T6: { id: 'BASE_RUBY_T6', name: 'T6 Gem (Ruby)', type: 'ruby', tier: 6, icon: 'images/gems/fused_t6.png', width: 1, height: 1, stats: { [STATS.CLICK_DAMAGE.key]: 4000 } }, // Halved
    BASE_SAPPHIRE_T6: { id: 'BASE_SAPPHIRE_T6', name: 'T6 Gem (Sapphire)', type: 'sapphire', tier: 6, icon: 'images/gems/fused_t6.png', width: 1, height: 1, stats: { [STATS.DPS.key]: 16000 } }, // Halved
    BASE_EMERALD_T6: { id: 'BASE_EMERALD_T6', name: 'T6 Gem (Emerald)', type: 'emerald', tier: 6, icon: 'images/gems/fused_t6.png', width: 1, height: 1, stats: { [STATS.GOLD_GAIN.key]: 160 } },
    BASE_TOPAZ_T6: { id: 'BASE_TOPAZ_T6', name: 'T6 Gem (Topaz)', type: 'topaz', tier: 6, icon: 'images/gems/fused_t6.png', width: 1, height: 1, stats: { [STATS.MAGIC_FIND.key]: 8.0 } },
    
    // ===================================
    // --- TIER 7 GEMS ---
    // ===================================
    BASE_RUBY_T7: { id: 'BASE_RUBY_T7', name: 'T7 Gem (Ruby)', type: 'ruby', tier: 7, icon: 'images/gems/fused_t7.png', width: 1, height: 1, stats: { [STATS.CLICK_DAMAGE.key]: 8000 } }, // Halved
    BASE_SAPPHIRE_T7: { id: 'BASE_SAPPHIRE_T7', name: 'T7 Gem (Sapphire)', type: 'sapphire', tier: 7, icon: 'images/gems/fused_t7.png', width: 1, height: 1, stats: { [STATS.DPS.key]: 32000 } }, // Halved
    BASE_EMERALD_T7: { id: 'BASE_EMERALD_T7', name: 'T7 Gem (Emerald)', type: 'emerald', tier: 7, icon: 'images/gems/fused_t7.png', width: 1, height: 1, stats: { [STATS.GOLD_GAIN.key]: 320 } },
    BASE_TOPAZ_T7: { id: 'BASE_TOPAZ_T7', name: 'T7 Gem (Topaz)', type: 'topaz', tier: 7, icon: 'images/gems/fused_t7.png', width: 1, height: 1, stats: { [STATS.MAGIC_FIND.key]: 16.0 } },
    
    // ===================================
    // --- TIER 8 GEMS ---
    // ===================================
    BASE_RUBY_T8: { id: 'BASE_RUBY_T8', name: 'T8 Gem (Ruby)', type: 'ruby', tier: 8, icon: 'images/gems/fused_t8.png', width: 1, height: 1, stats: { [STATS.CLICK_DAMAGE.key]: 16000 } }, // Halved
    BASE_SAPPHIRE_T8: { id: 'BASE_SAPPHIRE_T8', name: 'T8 Gem (Sapphire)', type: 'sapphire', tier: 8, icon: 'images/gems/fused_t8.png', width: 1, height: 1, stats: { [STATS.DPS.key]: 64000 } }, // Halved
    BASE_EMERALD_T8: { id: 'BASE_EMERALD_T8', name: 'T8 Gem (Emerald)', type: 'emerald', tier: 8, icon: 'images/gems/fused_t8.png', width: 1, height: 1, stats: { [STATS.GOLD_GAIN.key]: 640 } },
    BASE_TOPAZ_T8: { id: 'BASE_TOPAZ_T8', name: 'T8 Gem (Topaz)', type: 'topaz', tier: 8, icon: 'images/gems/fused_t8.png', width: 1, height: 1, stats: { [STATS.MAGIC_FIND.key]: 32.0 } },
    
    // ===================================
    // --- TIER 9 GEMS ---
    // ===================================
    BASE_RUBY_T9: { id: 'BASE_RUBY_T9', name: 'T9 Gem (Ruby)', type: 'ruby', tier: 9, icon: 'images/gems/fused_t9.png', width: 1, height: 1, stats: { [STATS.CLICK_DAMAGE.key]: 32000 } }, // Halved
    BASE_SAPPHIRE_T9: { id: 'BASE_SAPPHIRE_T9', name: 'T9 Gem (Sapphire)', type: 'sapphire', tier: 9, icon: 'images/gems/fused_t9.png', width: 1, height: 1, stats: { [STATS.DPS.key]: 128000 } }, // Halved
    BASE_EMERALD_T9: { id: 'BASE_EMERALD_T9', name: 'T9 Gem (Emerald)', type: 'emerald', tier: 9, icon: 'images/gems/fused_t9.png', width: 1, height: 1, stats: { [STATS.GOLD_GAIN.key]: 1280 } },
    BASE_TOPAZ_T9: { id: 'BASE_TOPAZ_T9', name: 'T9 Gem (Topaz)', type: 'topaz', tier: 9, icon: 'images/gems/fused_t9.png', width: 1, height: 1, stats: { [STATS.MAGIC_FIND.key]: 64.0 } },
    
    // ===================================
    // --- TIER 10 GEMS ---
    // ===================================
    BASE_RUBY_T10: { id: 'BASE_RUBY_T10', name: 'T10 Gem (Ruby)', type: 'ruby', tier: 10, icon: 'images/gems/fused_t10.png', width: 1, height: 1, stats: { [STATS.CLICK_DAMAGE.key]: 64000 } }, // Halved
    BASE_SAPPHIRE_T10: { id: 'BASE_SAPPHIRE_T10', name: 'T10 Gem (Sapphire)', type: 'sapphire', tier: 10, icon: 'images/gems/fused_t10.png', width: 1, height: 1, stats: { [STATS.DPS.key]: 256000 } }, // Halved
    BASE_EMERALD_T10: { id: 'BASE_EMERALD_T10', name: 'T10 Gem (Emerald)', type: 'emerald', tier: 10, icon: 'images/gems/fused_t10.png', width: 1, height: 1, stats: { [STATS.GOLD_GAIN.key]: 2560 } },
    BASE_TOPAZ_T10: { id: 'BASE_TOPAZ_T10', name: 'T10 Gem (Topaz)', type: 'topaz', tier: 10, icon: 'images/gems/fused_t10.png', width: 1, height: 1, stats: { [STATS.MAGIC_FIND.key]: 128.0 } },

    // --- TIER 11 GEMS ---
    BASE_RUBY_T11: { id: 'BASE_RUBY_T11', name: 'T11 Gem (Ruby)', type: 'ruby', tier: 11, icon: 'images/gems/fused_t11.png', width: 1, height: 1, stats: { [STATS.CLICK_DAMAGE.key]: 128000 } }, // Halved
    BASE_SAPPHIRE_T11: { id: 'BASE_SAPPHIRE_T11', name: 'T11 Gem (Sapphire)', type: 'sapphire', tier: 11, icon: 'images/gems/fused_t11.png', width: 1, height: 1, stats: { [STATS.DPS.key]: 512000 } }, // Halved
    BASE_EMERALD_T11: { id: 'BASE_EMERALD_T11', name: 'T11 Gem (Emerald)', type: 'emerald', tier: 11, icon: 'images/gems/fused_t11.png', width: 1, height: 1, stats: { [STATS.GOLD_GAIN.key]: 5120 } },
    BASE_TOPAZ_T11: { id: 'BASE_TOPAZ_T11', name: 'T11 Gem (Topaz)', type: 'topaz', tier: 11, icon: 'images/gems/fused_t11.png', width: 1, height: 1, stats: { [STATS.MAGIC_FIND.key]: 256 } },
    
    // --- TIER 12 GEMS ---
    BASE_RUBY_T12: { id: 'BASE_RUBY_T12', name: 'T12 Gem (Ruby)', type: 'ruby', tier: 12, icon: 'images/gems/fused_t12.png', width: 1, height: 1, stats: { [STATS.CLICK_DAMAGE.key]: 256000 } }, // Halved
    BASE_SAPPHIRE_T12: { id: 'BASE_SAPPHIRE_T12', name: 'T12 Gem (Sapphire)', type: 'sapphire', tier: 12, icon: 'images/gems/fused_t12.png', width: 1, height: 1, stats: { [STATS.DPS.key]: 1024000 } }, // Halved
    BASE_EMERALD_T12: { id: 'BASE_EMERALD_T12', name: 'T12 Gem (Emerald)', type: 'emerald', tier: 12, icon: 'images/gems/fused_t12.png', width: 1, height: 1, stats: { [STATS.GOLD_GAIN.key]: 10240 } },
    BASE_TOPAZ_T12: { id: 'BASE_TOPAZ_T12', name: 'T12 Gem (Topaz)', type: 'topaz', tier: 12, icon: 'images/gems/fused_t12.png', width: 1, height: 1, stats: { [STATS.MAGIC_FIND.key]: 512 } },
    
    // --- TIER 13 GEMS ---
    BASE_RUBY_T13: { id: 'BASE_RUBY_T13', name: 'T13 Gem (Ruby)', type: 'ruby', tier: 13, icon: 'images/gems/fused_t13.png', width: 1, height: 1, stats: { [STATS.CLICK_DAMAGE.key]: 512000 } }, // Halved
    BASE_SAPPHIRE_T13: { id: 'BASE_SAPPHIRE_T13', name: 'T13 Gem (Sapphire)', type: 'sapphire', tier: 13, icon: 'images/gems/fused_t13.png', width: 1, height: 1, stats: { [STATS.DPS.key]: 2048000 } }, // Halved
    BASE_EMERALD_T13: { id: 'BASE_EMERALD_T13', name: 'T13 Gem (Emerald)', type: 'emerald', tier: 13, icon: 'images/gems/fused_t13.png', width: 1, height: 1, stats: { [STATS.GOLD_GAIN.key]: 20480 } },
    BASE_TOPAZ_T13: { id: 'BASE_TOPAZ_T13', name: 'T13 Gem (Topaz)', type: 'topaz', tier: 13, icon: 'images/gems/fused_t13.png', width: 1, height: 1, stats: { [STATS.MAGIC_FIND.key]: 1024 } },
    
    // --- TIER 14 GEMS ---
    BASE_RUBY_T14: { id: 'BASE_RUBY_T14', name: 'T14 Gem (Ruby)', type: 'ruby', tier: 14, icon: 'images/gems/fused_t14.png', width: 1, height: 1, stats: { [STATS.CLICK_DAMAGE.key]: 1024000 } }, // Halved
    BASE_SAPPHIRE_T14: { id: 'BASE_SAPPHIRE_T14', name: 'T14 Gem (Sapphire)', type: 'sapphire', tier: 14, icon: 'images/gems/fused_t14.png', width: 1, height: 1, stats: { [STATS.DPS.key]: 4096000 } }, // Halved
    BASE_EMERALD_T14: { id: 'BASE_EMERALD_T14', name: 'T14 Gem (Emerald)', type: 'emerald', tier: 14, icon: 'images/gems/fused_t14.png', width: 1, height: 1, stats: { [STATS.GOLD_GAIN.key]: 40960 } },
    BASE_TOPAZ_T14: { id: 'BASE_TOPAZ_T14', name: 'T14 Gem (Topaz)', type: 'topaz', tier: 14, icon: 'images/gems/fused_t14.png', width: 1, height: 1, stats: { [STATS.MAGIC_FIND.key]: 2048 } },
    
    // --- TIER 15 GEMS ---
    BASE_RUBY_T15: { id: 'BASE_RUBY_T15', name: 'T15 Gem (Ruby)', type: 'ruby', tier: 15, icon: 'images/gems/fused_t15.png', width: 1, height: 1, stats: { [STATS.CLICK_DAMAGE.key]: 2048000 } }, // Halved
    BASE_SAPPHIRE_T15: { id: 'BASE_SAPPHIRE_T15', name: 'T15 Gem (Sapphire)', type: 'sapphire', tier: 15, icon: 'images/gems/fused_t15.png', width: 1, height: 1, stats: { [STATS.DPS.key]: 8192000 } }, // Halved
    BASE_EMERALD_T15: { id: 'BASE_EMERALD_T15', name: 'T15 Gem (Emerald)', type: 'emerald', tier: 15, icon: 'images/gems/fused_t15.png', width: 1, height: 1, stats: { [STATS.GOLD_GAIN.key]: 81920 } },
    BASE_TOPAZ_T15: { id: 'BASE_TOPAZ_T15', name: 'T15 Gem (Topaz)', type: 'topaz', tier: 15, icon: 'images/gems/fused_t15.png', width: 1, height: 1, stats: { [STATS.MAGIC_FIND.key]: 4096 } },
    
    // --- TIER 16 GEMS ---
    BASE_RUBY_T16: { id: 'BASE_RUBY_T16', name: 'T16 Gem (Ruby)', type: 'ruby', tier: 16, icon: 'images/gems/fused_t16.png', width: 1, height: 1, stats: { [STATS.CLICK_DAMAGE.key]: 4096000 } }, // Halved
    BASE_SAPPHIRE_T16: { id: 'BASE_SAPPHIRE_T16', name: 'T16 Gem (Sapphire)', type: 'sapphire', tier: 16, icon: 'images/gems/fused_t16.png', width: 1, height: 1, stats: { [STATS.DPS.key]: 16384000 } }, // Halved
    BASE_EMERALD_T16: { id: 'BASE_EMERALD_T16', name: 'T16 Gem (Emerald)', type: 'emerald', tier: 16, icon: 'images/gems/fused_t16.png', width: 1, height: 1, stats: { [STATS.GOLD_GAIN.key]: 163840 } },
    BASE_TOPAZ_T16: { id: 'BASE_TOPAZ_T16', name: 'T16 Gem (Topaz)', type: 'topaz', tier: 16, icon: 'images/gems/fused_t16.png', width: 1, height: 1, stats: { [STATS.MAGIC_FIND.key]: 8192 } },
    
    // --- TIER 17 GEMS ---
    BASE_RUBY_T17: { id: 'BASE_RUBY_T17', name: 'T17 Gem (Ruby)', type: 'ruby', tier: 17, icon: 'images/gems/fused_t17.png', width: 1, height: 1, stats: { [STATS.CLICK_DAMAGE.key]: 8192000 } }, // Halved
    BASE_SAPPHIRE_T17: { id: 'BASE_SAPPHIRE_T17', name: 'T17 Gem (Sapphire)', type: 'sapphire', tier: 17, icon: 'images/gems/fused_t17.png', width: 1, height: 1, stats: { [STATS.DPS.key]: 32768000 } }, // Halved
    BASE_EMERALD_T17: { id: 'BASE_EMERALD_T17', name: 'T17 Gem (Emerald)', type: 'emerald', tier: 17, icon: 'images/gems/fused_t17.png', width: 1, height: 1, stats: { [STATS.GOLD_GAIN.key]: 327680 } },
    BASE_TOPAZ_T17: { id: 'BASE_TOPAZ_T17', name: 'T17 Gem (Topaz)', type: 'topaz', tier: 17, icon: 'images/gems/fused_t17.png', width: 1, height: 1, stats: { [STATS.MAGIC_FIND.key]: 16384 } },
    
    // --- TIER 18 GEMS ---
    BASE_RUBY_T18: { id: 'BASE_RUBY_T18', name: 'T18 Gem (Ruby)', type: 'ruby', tier: 18, icon: 'images/gems/fused_t18.png', width: 1, height: 1, stats: { [STATS.CLICK_DAMAGE.key]: 16384000 } }, // Halved
    BASE_SAPPHIRE_T18: { id: 'BASE_SAPPHIRE_T18', name: 'T18 Gem (Sapphire)', type: 'sapphire', tier: 18, icon: 'images/gems/fused_t18.png', width: 1, height: 1, stats: { [STATS.DPS.key]: 65536000 } }, // Halved
    BASE_EMERALD_T18: { id: 'BASE_EMERALD_T18', name: 'T18 Gem (Emerald)', type: 'emerald', tier: 18, icon: 'images/gems/fused_t18.png', width: 1, height: 1, stats: { [STATS.GOLD_GAIN.key]: 655360 } },
    BASE_TOPAZ_T18: { id: 'BASE_TOPAZ_T18', name: 'T18 Gem (Topaz)', type: 'topaz', tier: 18, icon: 'images/gems/fused_t18.png', width: 1, height: 1, stats: { [STATS.MAGIC_FIND.key]: 32768 } },
    
    // --- TIER 19 GEMS ---
    BASE_RUBY_T19: { id: 'BASE_RUBY_T19', name: 'T19 Gem (Ruby)', type: 'ruby', tier: 19, icon: 'images/gems/fused_t19.png', width: 1, height: 1, stats: { [STATS.CLICK_DAMAGE.key]: 32768000 } }, // Halved
    BASE_SAPPHIRE_T19: { id: 'BASE_SAPPHIRE_T19', name: 'T19 Gem (Sapphire)', type: 'sapphire', tier: 19, icon: 'images/gems/fused_t19.png', width: 1, height: 1, stats: { [STATS.DPS.key]: 131072000 } }, // Halved
    BASE_EMERALD_T19: { id: 'BASE_EMERALD_T19', name: 'T19 Gem (Emerald)', type: 'emerald', tier: 19, icon: 'images/gems/fused_t19.png', width: 1, height: 1, stats: { [STATS.GOLD_GAIN.key]: 1310720 } },
    BASE_TOPAZ_T19: { id: 'BASE_TOPAZ_T19', name: 'T19 Gem (Topaz)', type: 'topaz', tier: 19, icon: 'images/gems/fused_t19.png', width: 1, height: 1, stats: { [STATS.MAGIC_FIND.key]: 65536 } },
    
    // --- TIER 20 GEMS ---
    BASE_RUBY_T20: { id: 'BASE_RUBY_T20', name: 'T20 Gem (Ruby)', type: 'ruby', tier: 20, icon: 'images/gems/fused_t20.png', width: 1, height: 1, stats: { [STATS.CLICK_DAMAGE.key]: 65536000 } }, // Halved
    BASE_SAPPHIRE_T20: { id: 'BASE_SAPPHIRE_T20', name: 'T20 Gem (Sapphire)', type: 'sapphire', tier: 20, icon: 'images/gems/fused_t20.png', width: 1, height: 1, stats: { [STATS.DPS.key]: 262144000 } }, // Halved
    BASE_EMERALD_T20: { id: 'BASE_EMERALD_T20', name: 'T20 Gem (Emerald)', type: 'emerald', tier: 20, icon: 'images/gems/fused_t20.png', width: 1, height: 1, stats: { [STATS.GOLD_GAIN.key]: 2621440 } },
    BASE_TOPAZ_T20: { id: 'BASE_TOPAZ_T20', name: 'T20 Gem (Topaz)', type: 'topaz', tier: 20, icon: 'images/gems/fused_t20.png', width: 1, height: 1, stats: { [STATS.MAGIC_FIND.key]: 131072 } },
    
    // --- TIER 21 GEMS ---
    BASE_RUBY_T21: { id: 'BASE_RUBY_T21', name: 'T21 Gem (Ruby)', type: 'ruby', tier: 21, icon: 'images/gems/fused_t21.png', width: 1, height: 1, stats: { [STATS.CLICK_DAMAGE.key]: 131072000 } }, // Halved
    BASE_SAPPHIRE_T21: { id: 'BASE_SAPPHIRE_T21', name: 'T21 Gem (Sapphire)', type: 'sapphire', tier: 21, icon: 'images/gems/fused_t21.png', width: 1, height: 1, stats: { [STATS.DPS.key]: 524288000 } }, // Halved
    BASE_EMERALD_T21: { id: 'BASE_EMERALD_T21', name: 'T21 Gem (Emerald)', type: 'emerald', tier: 21, icon: 'images/gems/fused_t21.png', width: 1, height: 1, stats: { [STATS.GOLD_GAIN.key]: 5242880 } },
    BASE_TOPAZ_T21: { id: 'BASE_TOPAZ_T21', name: 'T21 Gem (Topaz)', type: 'topaz', tier: 21, icon: 'images/gems/fused_t21.png', width: 1, height: 1, stats: { [STATS.MAGIC_FIND.key]: 262144 } },
    
    // --- TIER 22 GEMS ---
    BASE_RUBY_T22: { id: 'BASE_RUBY_T22', name: 'T22 Gem (Ruby)', type: 'ruby', tier: 22, icon: 'images/gems/fused_t22.png', width: 1, height: 1, stats: { [STATS.CLICK_DAMAGE.key]: 262144000 } }, // Halved
    BASE_SAPPHIRE_T22: { id: 'BASE_SAPPHIRE_T22', name: 'T22 Gem (Sapphire)', type: 'sapphire', tier: 22, icon: 'images/gems/fused_t22.png', width: 1, height: 1, stats: { [STATS.DPS.key]: 1048576000 } }, // Halved
    BASE_EMERALD_T22: { id: 'BASE_EMERALD_T22', name: 'T22 Gem (Emerald)', type: 'emerald', tier: 22, icon: 'images/gems/fused_t22.png', width: 1, height: 1, stats: { [STATS.GOLD_GAIN.key]: 10485760 } },
    BASE_TOPAZ_T22: { id: 'BASE_TOPAZ_T22', name: 'T22 Gem (Topaz)', type: 'topaz', tier: 22, icon: 'images/gems/fused_t22.png', width: 1, height: 1, stats: { [STATS.MAGIC_FIND.key]: 524288 } },
    
    // --- TIER 23 GEMS ---
    BASE_RUBY_T23: { id: 'BASE_RUBY_T23', name: 'T23 Gem (Ruby)', type: 'ruby', tier: 23, icon: 'images/gems/fused_t23.png', width: 1, height: 1, stats: { [STATS.CLICK_DAMAGE.key]: 524288000 } }, // Halved
    BASE_SAPPHIRE_T23: { id: 'BASE_SAPPHIRE_T23', name: 'T23 Gem (Sapphire)', type: 'sapphire', tier: 23, icon: 'images/gems/fused_t23.png', width: 1, height: 1, stats: { [STATS.DPS.key]: 2097152000 } }, // Halved
    BASE_EMERALD_T23: { id: 'BASE_EMERALD_T23', name: 'T23 Gem (Emerald)', type: 'emerald', tier: 23, icon: 'images/gems/fused_t23.png', width: 1, height: 1, stats: { [STATS.GOLD_GAIN.key]: 20971520 } },
    BASE_TOPAZ_T23: { id: 'BASE_TOPAZ_T23', name: 'T23 Gem (Topaz)', type: 'topaz', tier: 23, icon: 'images/gems/fused_t23.png', width: 1, height: 1, stats: { [STATS.MAGIC_FIND.key]: 1048576 } },
    
    // --- TIER 24 GEMS ---
    BASE_RUBY_T24: { id: 'BASE_RUBY_T24', name: 'T24 Gem (Ruby)', type: 'ruby', tier: 24, icon: 'images/gems/fused_t24.png', width: 1, height: 1, stats: { [STATS.CLICK_DAMAGE.key]: 1048576000 } }, // Halved
    BASE_SAPPHIRE_T24: { id: 'BASE_SAPPHIRE_T24', name: 'T24 Gem (Sapphire)', type: 'sapphire', tier: 24, icon: 'images/gems/fused_t24.png', width: 1, height: 1, stats: { [STATS.DPS.key]: 4194304000 } }, // Halved
    BASE_EMERALD_T24: { id: 'BASE_EMERALD_T24', name: 'T24 Gem (Emerald)', type: 'emerald', tier: 24, icon: 'images/gems/fused_t24.png', width: 1, height: 1, stats: { [STATS.GOLD_GAIN.key]: 41943040 } },
    BASE_TOPAZ_T24: { id: 'BASE_TOPAZ_T24', name: 'T24 Gem (Topaz)', type: 'topaz', tier: 24, icon: 'images/gems/fused_t24.png', width: 1, height: 1, stats: { [STATS.MAGIC_FIND.key]: 2097152 } },
    
    // --- TIER 25 GEMS ---
    BASE_RUBY_T25: { id: 'BASE_RUBY_T25', name: 'T25 Gem (Ruby)', type: 'ruby', tier: 25, icon: 'images/gems/fused_t25.png', width: 1, height: 1, stats: { [STATS.CLICK_DAMAGE.key]: 2097152000 } }, // Halved
    BASE_SAPPHIRE_T25: { id: 'BASE_SAPPHIRE_T25', name: 'T25 Gem (Sapphire)', type: 'sapphire', tier: 25, icon: 'images/gems/fused_t25.png', width: 1, height: 1, stats: { [STATS.DPS.key]: 8388608000 } }, // Halved
    BASE_EMERALD_T25: { id: 'BASE_EMERALD_T25', name: 'T25 Gem (Emerald)', type: 'emerald', tier: 25, icon: 'images/gems/fused_t25.png', width: 1, height: 1, stats: { [STATS.GOLD_GAIN.key]: 83886080 } },
    BASE_TOPAZ_T25: { id: 'BASE_TOPAZ_T25', name: 'T25 Gem (Topaz)', type: 'topaz', tier: 25, icon: 'images/gems/fused_t25.png', width: 1, height: 1, stats: { [STATS.MAGIC_FIND.key]: 4194304 } },
    
    // --- TIER 26 GEMS ---
    BASE_RUBY_T26: { id: 'BASE_RUBY_T26', name: 'T26 Gem (Ruby)', type: 'ruby', tier: 26, icon: 'images/gems/fused_t26.png', width: 1, height: 1, stats: { [STATS.CLICK_DAMAGE.key]: 4194304000 } }, // Halved
    BASE_SAPPHIRE_T26: { id: 'BASE_SAPPHIRE_T26', name: 'T26 Gem (Sapphire)', type: 'sapphire', tier: 26, icon: 'images/gems/fused_t26.png', width: 1, height: 1, stats: { [STATS.DPS.key]: 16777216000 } }, // Halved
    BASE_EMERALD_T26: { id: 'BASE_EMERALD_T26', name: 'T26 Gem (Emerald)', type: 'emerald', tier: 26, icon: 'images/gems/fused_t26.png', width: 1, height: 1, stats: { [STATS.GOLD_GAIN.key]: 167772160 } },
    BASE_TOPAZ_T26: { id: 'BASE_TOPAZ_T26', name: 'T26 Gem (Topaz)', type: 'topaz', tier: 26, icon: 'images/gems/fused_t26.png', width: 1, height: 1, stats: { [STATS.MAGIC_FIND.key]: 8388608 } },
    
    // --- TIER 27 GEMS ---
    BASE_RUBY_T27: { id: 'BASE_RUBY_T27', name: 'T27 Gem (Ruby)', type: 'ruby', tier: 27, icon: 'images/gems/fused_t27.png', width: 1, height: 1, stats: { [STATS.CLICK_DAMAGE.key]: 8388608000 } }, // Halved
    BASE_SAPPHIRE_T27: { id: 'BASE_SAPPHIRE_T27', name: 'T27 Gem (Sapphire)', type: 'sapphire', tier: 27, icon: 'images/gems/fused_t27.png', width: 1, height: 1, stats: { [STATS.DPS.key]: 33554432000 } }, // Halved
    BASE_EMERALD_T27: { id: 'BASE_EMERALD_T27', name: 'T27 Gem (Emerald)', type: 'emerald', tier: 27, icon: 'images/gems/fused_t27.png', width: 1, height: 1, stats: { [STATS.GOLD_GAIN.key]: 335544320 } },
    BASE_TOPAZ_T27: { id: 'BASE_TOPAZ_T27', name: 'T27 Gem (Topaz)', type: 'topaz', tier: 27, icon: 'images/gems/fused_t27.png', width: 1, height: 1, stats: { [STATS.MAGIC_FIND.key]: 16777216 } },
    
    // --- TIER 28 GEMS ---
    BASE_RUBY_T28: { id: 'BASE_RUBY_T28', name: 'T28 Gem (Ruby)', type: 'ruby', tier: 28, icon: 'images/gems/fused_t28.png', width: 1, height: 1, stats: { [STATS.CLICK_DAMAGE.key]: 16777216000 } }, // Halved
    BASE_SAPPHIRE_T28: { id: 'BASE_SAPPHIRE_T28', name: 'T28 Gem (Sapphire)', type: 'sapphire', tier: 28, icon: 'images/gems/fused_t28.png', width: 1, height: 1, stats: { [STATS.DPS.key]: 67108864000 } }, // Halved
    BASE_EMERALD_T28: { id: 'BASE_EMERALD_T28', name: 'T28 Gem (Emerald)', type: 'emerald', tier: 28, icon: 'images/gems/fused_t28.png', width: 1, height: 1, stats: { [STATS.GOLD_GAIN.key]: 671088640 } },
    BASE_TOPAZ_T28: { id: 'BASE_TOPAZ_T28', name: 'T28 Gem (Topaz)', type: 'topaz', tier: 28, icon: 'images/gems/fused_t28.png', width: 1, height: 1, stats: { [STATS.MAGIC_FIND.key]: 33554432 } },
    
    // --- TIER 29 GEMS ---
    BASE_RUBY_T29: { id: 'BASE_RUBY_T29', name: 'T29 Gem (Ruby)', type: 'ruby', tier: 29, icon: 'images/gems/fused_t29.png', width: 1, height: 1, stats: { [STATS.CLICK_DAMAGE.key]: 33554432000 } }, // Halved
    BASE_SAPPHIRE_T29: { id: 'BASE_SAPPHIRE_T29', name: 'T29 Gem (Sapphire)', type: 'sapphire', tier: 29, icon: 'images/gems/fused_t29.png', width: 1, height: 1, stats: { [STATS.DPS.key]: 134217728000 } }, // Halved
    BASE_EMERALD_T29: { id: 'BASE_EMERALD_T29', name: 'T29 Gem (Emerald)', type: 'emerald', tier: 29, icon: 'images/gems/fused_t29.png', width: 1, height: 1, stats: { [STATS.GOLD_GAIN.key]: 1342177280 } },
    BASE_TOPAZ_T29: { id: 'BASE_TOPAZ_T29', name: 'T29 Gem (Topaz)', type: 'topaz', tier: 29, icon: 'images/gems/fused_t29.png', width: 1, height: 1, stats: { [STATS.MAGIC_FIND.key]: 67108864 } },
    
    // --- TIER 30 GEMS ---
    BASE_RUBY_T30: { id: 'BASE_RUBY_T30', name: 'T30 Gem (Ruby)', type: 'ruby', tier: 30, icon: 'images/gems/fused_t30.png', width: 1, height: 1, stats: { [STATS.CLICK_DAMAGE.key]: 67108864000 } }, // Halved
    BASE_SAPPHIRE_T30: { id: 'BASE_SAPPHIRE_T30', name: 'T30 Gem (Sapphire)', type: 'sapphire', tier: 30, icon: 'images/gems/fused_t30.png', width: 1, height: 1, stats: { [STATS.DPS.key]: 268435456000 } }, // Halved
    BASE_EMERALD_T30: { id: 'BASE_EMERALD_T30', name: 'T30 Gem (Emerald)', type: 'emerald', tier: 30, icon: 'images/gems/fused_t30.png', width: 1, height: 1, stats: { [STATS.GOLD_GAIN.key]: 2684354560 } },
    BASE_TOPAZ_T30: { id: 'BASE_TOPAZ_T30', name: 'T30 Gem (Topaz)', type: 'topaz', tier: 30, icon: 'images/gems/fused_t30.png', width: 1, height: 1, stats: { [STATS.MAGIC_FIND.key]: 134217728 } },
};