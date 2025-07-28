// ====================================================================================
//            ITEM BALANCING FORMULA & GUIDE FOR NEW REALMS (Final Version)
// ====================================================================================
// This guide provides a repeatable formula for calculating item stats for a new
// realm. Follow the steps from top to bottom, filling in the CONFIG section first.
// ====================================================================================


// ====================================================================================
//                              CONFIGURATION
// ====================================================================================
// Fill in these values for the new realm you are balancing.

const CONFIG = {
    // -- Player & Realm Baseline --
    NEW_REALM_START_LEVEL: 401,     // <-- CHANGE THIS: The first monster level of the new realm.
    PLAYER_AGILITY_POINTS: 300,     // <-- CHANGE THIS: The expected Agility of a player entering this realm.
    PLAYER_PRESTIGE_DPS: 600000,    // <-- CHANGE THIS: The expected base DPS from `absorbedStats` for this player.
    
    // -- Gem Assumptions --
    GEM_DPS_VALUE: 64000,           // <-- CHANGE THIS: The DPS value of a single gem the player is expected to be using.
    SOCKETS_IN_NEW_SET: 23,         // <-- CHANGE THIS: The total number of sockets in a full set of gear from this new realm.

    // -- Gameplay Feel & Tuning Knobs --
    TARGET_TTK_SECONDS: 90,         // <-- CHANGE THIS: The target Time-to-Kill (in seconds) for a player with a fully gemmed new gear set.
    GEAR_POWER_SCALAR: 0.5,         // <-- TUNE THIS: A scalar for the overall power of gear. 0.5 means gear provides 50% of the calculated required power, making gems/prestige more important.
    GLOBAL_DAMAGE_NERF: 0.9,        // <-- TUNE THIS: A final multiplier applied to all damage stats. 0.9 = a 10% nerf.
};


// ====================================================================================
//                      CALCULATION STEPS (Do not edit this part)
// ====================================================================================

// Step 1: Calculate Player's DPS Multiplier
// ------------------------------------------------------------------------------------
const DPS_MULTIPLIER = 1 + (CONFIG.PLAYER_AGILITY_POINTS * 0.8 / 100);


// Step 2: Get Monster HP
// ------------------------------------------------------------------------------------
const MONSTER_HP = 2580000000; // <-- CHANGE THIS: Paste the calculated HP of a monster at NEW_REALM_START_LEVEL.


// Step 3: Calculate Required Total & Base DPS
// ------------------------------------------------------------------------------------
const REQUIRED_TOTAL_DPS = MONSTER_HP / CONFIG.TARGET_TTK_SECONDS;
const REQUIRED_BASE_DPS = REQUIRED_TOTAL_DPS / DPS_MULTIPLIER;


// Step 4: Isolate the Gear's Stat Budget
// ------------------------------------------------------------------------------------
const GEM_BASE_DPS = CONFIG.SOCKETS_IN_NEW_SET * CONFIG.GEM_DPS_VALUE;
const TOTAL_NON_GEAR_BASE_DPS = GEM_BASE_DPS + CONFIG.PLAYER_PRESTIGE_DPS;

const RAW_STAT_BUDGET = REQUIRED_BASE_DPS - TOTAL_NON_GEAR_BASE_DPS;

const FINAL_GEAR_STAT_BUDGET = RAW_STAT_BUDGET * CONFIG.GEAR_POWER_SCALAR;


// ====================================================================================
//                      IMPLEMENTATION GUIDE
// ====================================================================================
// Use the `FINAL_GEAR_STAT_BUDGET` to create the stats for your new items by following these rules in order.

// Rule 1: Calculate the Base Max DPS for an Item
// ------------------------------------------------------------------------------------
// a. Distribute the `FINAL_GEAR_STAT_BUDGET` across item slots based on their importance.
/*
    Distribution Percentages:
    - Weapon:   25%
    - Chest:    20%
    - Legs:     17%
    - Shield:   13%
    - Helmet:   10%
    - Belt:     5%
    - Neck:     5%
    - Ring:     2.5% (per ring)
*/
// b. Scale this value exponentially for higher-level items. A good rule of thumb is to
//    multiply the budget by ~1.7x for every 25 levels.


// Rule 2: Apply Conditional Bonuses to the Base Max DPS
// ------------------------------------------------------------------------------------
// These rules are applied to the number calculated in Rule 1.

//  a. Boss Item Bonus ("The Sawtooth"):
//     If an item drops exclusively from a boss at Level `X`, recalculate its
//     Base Max DPS as if it were a regular item from Level `X + 20`.

//  b. Specialist Item Bonus:
//     If an item has ONLY DPS and NO Click Damage stat, give it a random bonus.
//     Formula: Base_Max_DPS *= (1 + (Math.random() * 0.07 + 0.07)) // Random bonus between +7% and +14%


// Rule 3: Calculate the Final Max Stats
// ------------------------------------------------------------------------------------
// Use the modified Base Max DPS from Rule 2 to determine the final stats.

//  a. Final Max DPS:
//     Apply the global damage nerf to the result from Rule 2.
//     Formula: Final_Max_DPS = Modified_Base_Max_DPS * CONFIG.GLOBAL_DAMAGE_NERF

//  b. Final Max Click Damage:
//     - For SPECIALIST items (only Click Damage), apply the same logic as Rule 2b and Rule 3a.
//     - For HYBRID items (both DPS and Click Damage), calculate it based on the Final Max DPS.
//       Formula: Final_Max_Click_Damage = Final_Max_DPS * (Math.random() * 0.02 + 0.09) // Random value between 9% and 11% of the DPS

//  c. Gold Gain:
//     This stat is calculated independently. A good goal is for the total Gold Gain from a
//     full gear set to triple or quadruple every 100 levels to keep pace with upgrade costs.

//  d. Min Value:
//     Set the `min` value for ALL stats to `1`.