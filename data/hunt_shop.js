// --- START OF FILE data/hunt_shop.js ---

/*
* HUNT SHOP DEFINITION GUIDE
*
* This file defines the items available in the Hunt Shop, organized by category.
*
* CATEGORY KEY: (e.g., 'Utility', 'Potions', 'Gems', 'Permanent')
*   - id: The item ID from CONSUMABLES.js, GEMS.js, or a special unique key for shop-only actions.
*   - cost: The price in Hunt Tokens.
*   - unlock: (Optional) The number of total hunts the player must complete to unlock this item for purchase.
*   - oneTimePurchase: (Optional) If true, this item can only be purchased once per save file.
*/
export const HUNT_SHOP_INVENTORY = {

    // ===================================
    // --- UTILITY ITEMS ---
    // ===================================
    Utility: [
        {
            id: 'HUNT_CANCEL',
            cost: 3,
        },
        {
            id: 'HUNT_REROLL',
            cost: 5,
        },
        {
            id: 'PRESTIGE_TOKEN',
            cost: 20, // This is the BASE cost. We'll make it dynamic later.
        },
        { 
            id: 'ARTISAN_DRILL', 
            cost: 50,
            unlock: 100 
        },
    
    ],

    // ===================================
    // --- POTIONS (TIMED BUFFS & CONSUMABLES) ---
    // ===================================
    Potions: [
        { id: 'SCRAP_CACHE_SMALL', cost: 2 },
        { id: 'GOLD_BOOSTER_MINOR', cost: 3 },
        { id: 'XP_ELIXIR_MINOR', cost: 5, unlock: 10 },
        { id: 'GEM_SEEKER_DRAFT_MINOR', cost: 20, unlock: 50 },
        { id: 'GOLD_BOOSTER_MAJOR', cost: 10, unlock: 50 },
        { id: 'MAGIC_FIND_POTION_MINOR', cost: 12, unlock: 50 },
        { id: 'XP_ELIXIR_MAJOR', cost: 15, unlock: 100 },
        { id: 'POTION_LIQUID_LUCK', cost: 20, unlock: 100 },
        { id: 'POTION_BOSS_SLAYER', cost: 25, unlock: 100 },
        { id: 'POTION_GIANTS_STRENGTH', cost: 25, unlock: 150 },
        { id: 'POTION_FUSED_POWER', cost: 40, unlock: 150 },
        { id: 'POTION_DEADLY_FOCUS', cost: 30, unlock: 200 },
        { id: 'POTION_RAGING_AUTOMATON', cost: 50, unlock: 300 },
    ],
    
    // ===================================
    // --- GEMS ---
    // ===================================
    Gems: [
        // Tier 1 (Cost: 1)
        { id: 'BASE_RUBY', cost: 1 },
        { id: 'BASE_SAPPHIRE', cost: 1 },
        { id: 'BASE_EMERALD', cost: 1 },
        { id: 'BASE_TOPAZ', cost: 1 },
        // Tier 2 (Cost: 2 Unlock: 5)
        { id: 'BASE_RUBY_T2', cost: 2, unlock: 5 },
        { id: 'BASE_SAPPHIRE_T2', cost: 2, unlock: 5 },
        { id: 'BASE_EMERALD_T2', cost: 2, unlock: 5 },
        { id: 'BASE_TOPAZ_T2', cost: 2, unlock: 5 },
        // Tier 3 (Cost: 4 Unlock: 25)
        { id: 'BASE_RUBY_T3', cost: 3, unlock: 25 },
        { id: 'BASE_SAPPHIRE_T3', cost: 3, unlock: 25 },
        { id: 'BASE_EMERALD_T3', cost: 3, unlock: 25 },
        { id: 'BASE_TOPAZ_T3', cost: 3, unlock: 25 },
        // Tier 4 (Cost: 8, Unlock: 50)
        { id: 'BASE_RUBY_T4', cost: 6 , unlock: 50 },
        { id: 'BASE_SAPPHIRE_T4', cost: 6 , unlock: 50 },
        { id: 'BASE_EMERALD_T4', cost: 6 , unlock: 50 },
        { id: 'BASE_TOPAZ_T4', cost: 6 , unlock: 50 },
        // Tier 5 (Cost: 16, Unlock: 100)
        { id: 'BASE_RUBY_T5', cost: 12 , unlock: 100 },
        { id: 'BASE_SAPPHIRE_T5', cost: 12 , unlock: 100 },
        { id: 'BASE_EMERALD_T5', cost: 12 , unlock: 100 },
        { id: 'BASE_TOPAZ_T5', cost: 12 , unlock: 100 },
        // Tier 6 (Cost: 32, Unlock: 150)
        { id: 'BASE_RUBY_T6', cost: 24 , unlock: 150 },
        { id: 'BASE_SAPPHIRE_T6', cost: 24 , unlock: 150 },
        { id: 'BASE_EMERALD_T6', cost: 24 , unlock: 150 },
        { id: 'BASE_TOPAZ_T6', cost: 24 , unlock: 150 },
        // Tier 7 (Cost: 64, Unlock: 200)
        { id: 'BASE_RUBY_T7', cost: 48 , unlock: 200 },
        { id: 'BASE_SAPPHIRE_T7', cost: 48 , unlock: 200 },
        { id: 'BASE_EMERALD_T7', cost: 48 , unlock: 200 },
        { id: 'BASE_TOPAZ_T7', cost: 48 , unlock: 200 },
        // Tier 8 (Cost: 128, Unlock: 250)
        { id: 'BASE_RUBY_T8', cost: 96 , unlock: 250 },
        { id: 'BASE_SAPPHIRE_T8', cost: 96 , unlock: 250 },
        { id: 'BASE_EMERALD_T8', cost: 96 , unlock: 250 },
        { id: 'BASE_TOPAZ_T8', cost: 96 , unlock: 250 },
        // Tier 9 (Cost: 256, Unlock: 300)
        { id: 'BASE_RUBY_T9', cost: 192 , unlock: 300 },
        { id: 'BASE_SAPPHIRE_T9', cost: 192 , unlock: 300 },
        { id: 'BASE_EMERALD_T9', cost: 192 , unlock: 300 },
        { id: 'BASE_TOPAZ_T9', cost: 192 , unlock: 300 },
        // Tier 10 (Cost: 512, Unlock: 350)
        { id: 'BASE_RUBY_T10', cost: 384 , unlock: 350 },
        { id: 'BASE_SAPPHIRE_T10', cost: 384 , unlock: 350 },
        { id: 'BASE_EMERALD_T10', cost: 384 , unlock: 350 },
        { id: 'BASE_TOPAZ_T10', cost: 384 , unlock: 350 },
    ],

    // ===================================
    // --- PERMANENT UPGRADES ---
    // ===================================
    Permanent: [
        {
            id: 'TOME_OF_STRENGTH',
            cost: 500, 
            unlock: 200, 
        },
        {
            id: 'TOME_OF_AGILITY',
            cost: 500,
            unlock: 200
        }
    ],
};