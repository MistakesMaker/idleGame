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

    // -- Gameplay Feel --
    TARGET_TTK_SECONDS: 90,         // <-- CHANGE THIS: The target Time-to-Kill (in seconds) for a player with a fully gemmed new gear set.
};


// ====================================================================================
//                      CALCULATION STEPS (Do not edit this part)
// ====================================================================================

// Step 1: Calculate Player's DPS Multiplier
// ------------------------------------------------------------------------------------
// Formula: Multiplier = 1 + (PLAYER_AGILITY_POINTS * 0.8 / 100)
// Example: 1 + (300 * 0.8 / 100) = 3.4
const DPS_MULTIPLIER = 1 + (CONFIG.PLAYER_AGILITY_POINTS * 0.8 / 100);


// Step 2: Get Monster HP
// ------------------------------------------------------------------------------------
// Use the in-game formula from `game_logic.js` to find the HP of a standard
// monster at `NEW_REALM_START_LEVEL`.
// Example: getMonsterHP(401) = 2,580,000,000
const MONSTER_HP = 2580000000; // <-- CHANGE THIS: Paste the calculated monster HP here.


// Step 3: Calculate Required Total DPS
// ------------------------------------------------------------------------------------
// Formula: Required_Total_DPS = MONSTER_HP / TARGET_TTK_SECONDS
// Example: 2,580,000,000 / 90 = 28,666,667
const REQUIRED_TOTAL_DPS = MONSTER_HP / CONFIG.TARGET_TTK_SECONDS;


// Step 4: Calculate Required Base DPS
// ------------------------------------------------------------------------------------
// This is the total power needed *before* the player's Agility multiplier is applied.
// Formula: Required_Base_DPS = REQUIRED_TOTAL_DPS / DPS_MULTIPLIER
// Example: 28,666,667 / 3.4 = 8,431,372
const REQUIRED_BASE_DPS = REQUIRED_TOTAL_DPS / DPS_MULTIPLIER;


// Step 5: Isolate the Gear's Stat Budget
// ------------------------------------------------------------------------------------
// This calculates how much power the new gear set must provide by subtracting
// the power the player already has from Prestige and Gems.

//  5a. Calculate Base DPS from Gems
//  Formula: Gem_DPS = SOCKETS_IN_NEW_SET * GEM_DPS_VALUE
//  Example: 23 * 64000 = 1,472,000
const GEM_BASE_DPS = CONFIG.SOCKETS_IN_NEW_SET * CONFIG.GEM_DPS_VALUE;

//  5b. Calculate Total Non-Gear Base DPS
//  Formula: Non_Gear_DPS = Gem_DPS + PLAYER_PRESTIGE_DPS
//  Example: 1,472,000 + 600,000 = 2,072,000
const TOTAL_NON_GEAR_BASE_DPS = GEM_BASE_DPS + CONFIG.PLAYER_PRESTIGE_DPS;

//  5c. Calculate the Raw Stat Budget for the Gear Set
//  Formula: Raw_Budget = Required_Base_DPS - Total_Non_Gear_Base_DPS
//  Example: 8,431,372 - 2,072,000 = 6,359,372
const STAT_BUDGET_RAW = REQUIRED_BASE_DPS - TOTAL_NON_GEAR_BASE_DPS;

//  5d. Apply the Final Balance Scalar
//  This is the crucial adjustment to lengthen the initial grind and make potions/gems more impactful.
const FINAL_BUDGET_SCALAR = 0.5; // <-- We are halving the gear's power contribution.

//  5e. Calculate the Final Gear Set Stat Budget
//  Formula: Final_Budget = Raw_Budget * FINAL_BUDGET_SCALAR
//  Example: 6,359,372 * 0.5 = 3,179,686
const FINAL_GEAR_STAT_BUDGET = STAT_BUDGET_RAW * FINAL_BUDGET_SCALAR;


// ====================================================================================
//                      IMPLEMENTATION GUIDE
// ====================================================================================
// Use the `FINAL_GEAR_STAT_BUDGET` to create the stats for your new items.

// Step 6: Distribute the Budget Across Item Slots
// ------------------------------------------------------------------------------------
// Divide the `FINAL_GEAR_STAT_BUDGET` among the different item types at the realm's start level.

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

// Example for a Level 401 Sword:
// 3,179,686 * 0.25 = 794,921 DPS. This becomes the `max` value for the DPS stat.


// Step 7: Scale the Budget for Higher Levels
// ------------------------------------------------------------------------------------
// To calculate stats for items at higher levels, increase their budget exponentially.
// A good rule of thumb that mirrors the game's monster HP growth is:

// --> For every 25 levels, multiply the previous stat budget by ~1.7x.

// Example for a Level 426 Sword:
// 794,921 (Lvl 401 budget) * 1.7 = 1,351,365 DPS. This becomes the new `max` value.


// Step 8: Calculate Other Stats and Apply Final Rules
// ------------------------------------------------------------------------------------
// 1. Click Damage: Set the `max` value to be 10% of the item's DPS `max` value.
//    - Example: A sword with 1,582,500 max DPS will have 158,250 max Click Damage.

// 2. Gold Gain: Scale this separately to keep up with upgrade costs. A good goal
//    is for the total Gold Gain from a full gear set to triple or quadruple
//    every 100 levels.

// 3. Boss Items (The "Sawtooth"): For items that *only* drop from a boss at
//    Level `X`, calculate their stats as if they were a regular item from
//    Level `X + 10`. This makes them feel powerful and last longer.

// 4. Min Value: Set all `min` stat values to `1`. This creates a wide stat roll
//    range and encourages players to use the Forge system to improve their gear.