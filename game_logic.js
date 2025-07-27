// --- START OF FILE game_logic.js ---

import { MONSTERS } from './data/monsters.js';
import { ITEMS } from './data/items.js';
import { GEMS } from './data/gems.js';
import { rarities } from './game.js';
import { isBossLevel, isBigBossLevel, isMiniBossLevel, findSubZoneByLevel, formatNumber, findNextAvailableSpot } from './utils.js';
import { PERMANENT_UPGRADES } from './data/upgrades.js';
import { STATS } from './data/stat_pools.js';
import * as player from './player_actions.js'; // --- MODIFICATION: Import player actions ---

/**
 * Checks if a dropped item should be kept based on the player's salvage filter settings (strict AND logic).
 * @param {object} item - The item that was just dropped.
 * @param {object} filter - The player's salvage filter settings from gameState.
 * @returns {boolean} True if the item should be kept, false if it should be salvaged.
 */
function shouldKeepItem(item, filter) {
    if (!filter.enabled) {
        return true; // If the filter is off, keep everything.
    }

    // Rarity Check
    const itemRarityIndex = rarities.indexOf(item.rarity);
    const keepRarityIndex = rarities.indexOf(filter.keepRarity);
    if (itemRarityIndex < keepRarityIndex) {
        return false; // Salvage because its rarity is too low.
    }

    // Sockets Check
    const itemSocketCount = item.sockets ? item.sockets.length : 0;
    if (itemSocketCount < filter.keepSockets) {
        return false; // Salvage because it doesn't have enough sockets.
    }

    // Stats Check (must have ALL checked stats)
    for (const statKey in filter.keepStats) {
        if (filter.keepStats[statKey]) { // If this stat is required by the filter...
            if (!item.stats || !item.stats[statKey]) {
                return false; // ... and the item doesn't have it, salvage.
            }
        }
    }

    // If the item has passed all the above checks, it's a keeper.
    return true;
}


/**
 * Generates a new item based on rarity, level, and a base item definition.
 * @param {string} rarity - The rarity of the item.
 * @param {number} itemLevel - The level of the item (influences stats).
 * @param {object} itemBase - The base item definition from items.js.
 * @returns {object} The newly generated item.
 */
export function generateItem(rarity, itemLevel, itemBase) {
    const rarityIndex = rarities.indexOf(rarity);

    const item = {
        id: Date.now() + Math.random(),
        baseId: itemBase.id,
        name: `${rarity.charAt(0).toUpperCase() + rarity.slice(1)} ${itemBase.name}`,
        rarity: rarity,
        type: itemBase.type.toLowerCase(),
        icon: itemBase.icon,
        width: itemBase.width,
        height: itemBase.height,
        x: -1, // Not placed in grid yet
        y: -1, // Not placed in grid yet
        stats: {},
        locked: false,
        rerollAttempts: 0 // Initialize the failsafe counter
    };

    const rarityStatsCount = rarityIndex + 1;
    const maxPossibleStats = itemBase.possibleStats.length;
    const numStatsToGenerate = Math.min(rarityStatsCount, maxPossibleStats);

    const availableStats = [...itemBase.possibleStats];
    const chosenStats = [];
    for (let i = 0; i < numStatsToGenerate; i++) {
        if (availableStats.length === 0) break;
        const statIndex = Math.floor(Math.random() * availableStats.length);
        chosenStats.push(availableStats.splice(statIndex, 1)[0]);
    }

    chosenStats.forEach(statInfo => {
        const total_stat_range = statInfo.max - statInfo.min;
        const range_per_tier = total_stat_range / rarities.length;
        
        const min_for_tier = statInfo.min + (range_per_tier * rarityIndex);
        const max_for_tier = statInfo.min + (range_per_tier * (rarityIndex + 1));
        
        const tier_specific_range = max_for_tier - min_for_tier;
        
        let final_stat_value = min_for_tier + (Math.random() * tier_specific_range);

        // --- START OF MODIFICATION: Enforce minimum stat values ---
        const statDefinition = Object.values(STATS).find(s => s.key === statInfo.key);
        if (statDefinition) {
            if (statDefinition.type === 'flat') {
                final_stat_value = Math.max(1, final_stat_value);
            } else if (statDefinition.type === 'percent') {
                final_stat_value = Math.max(0.01, final_stat_value);
            }
        }
        // --- END OF MODIFICATION ---

        item.stats[statInfo.key] = parseFloat(final_stat_value.toFixed(2));
    });

    if (itemBase.canHaveSockets && itemBase.maxSockets > 0) {
        // Rarity defines the "potential" cap for sockets as a percentage of the item's max.
        const rarityPotential = {
            common: 0.34,
            uncommon: 0.50,
            rare: 0.75,
            epic: 0.90,
            legendary: 1.00
        };

        const potentialMultiplier = rarityPotential[item.rarity] || 0.34; // Default to common
        const dynamicCap = Math.floor(itemBase.maxSockets * potentialMultiplier);
        
        const createdSockets = [];
        if (dynamicCap > 0) {
            const SOCKET_CHANCE = 0.10; // 10% chance for each potential socket

            // Perform cascading rolls up to the dynamic cap
            for (let i = 0; i < dynamicCap; i++) {
                if (Math.random() < SOCKET_CHANCE) {
                    // Success! Add a socket.
                    createdSockets.push(null);
                } else {
                    // Failure. Stop trying to add more sockets.
                    break;
                }
            }
        }
        
        // Only add the sockets property if at least one was successfully created.
        if (createdSockets.length > 0) {
            item.sockets = createdSockets;
        }
    }

    return item;
}

/**
 * Determines and generates loot from the current monster.
 * Returns an object containing arrays of items and gems.
 */
export function dropLoot(currentMonster, gameState, playerStats) {
    const monsterDef = currentMonster.data;
    if (!monsterDef || !monsterDef.lootTable || monsterDef.lootTable.length === 0) {
        return { droppedItems: [], droppedGems: [], logMessages: [], events: [] };
    }

    let effectiveLootTable = [...monsterDef.lootTable];
    let totalWeight = effectiveLootTable.reduce((sum, entry) => sum + entry.weight, 0);
    let roll = Math.random() * totalWeight;
    let itemBaseToDrop;

    for (const entry of effectiveLootTable) {
        if (roll < entry.weight) {
            itemBaseToDrop = entry.item;
            break;
        }
        roll -= entry.weight;
    }

    // Check if the rolled item is the Wisdom scroll and if it should be re-rolled.
    if (itemBaseToDrop && itemBaseToDrop.id === 'WISDOM_OF_THE_OVERWORLD' && gameState.wisdomOfTheOverworldDropped) {
        // The player has already had the scroll drop, so we must re-roll from the remaining loot pool.
        effectiveLootTable = effectiveLootTable.filter(entry => entry.item.id !== 'WISDOM_OF_THE_OVERWORLD');
        totalWeight = effectiveLootTable.reduce((sum, entry) => sum + entry.weight, 0);
        
        if (totalWeight > 0) {
            roll = Math.random() * totalWeight;
            itemBaseToDrop = null; // Reset before re-rolling
            for (const entry of effectiveLootTable) {
                if (roll < entry.weight) {
                    itemBaseToDrop = entry.item;
                    break;
                }
                roll -= entry.weight;
            }
        } else {
            // This case occurs if the scroll was the only item in the loot table.
            itemBaseToDrop = null;
        }
    }

    if (!itemBaseToDrop) return { droppedItems: [], droppedGems: [], logMessages: [], events: [] };

    const isConsumable = itemBaseToDrop.type === 'consumable';
    if (isConsumable && itemBaseToDrop.id === 'WISDOM_OF_THE_OVERWORLD' && !gameState.wisdomOfTheOverworldDropped) {
        gameState.wisdomOfTheOverworldDropped = true;
    }

    const logMessages = [];
    const droppedItems = [];
    const droppedGems = [];
    const events = [];

    const isGem = itemBaseToDrop.tier >= 1;

    if (isGem) {
        const handleGemDrop = (baseGem) => {
            if (gameState.salvageFilter.autoSalvageGems) {
                const scrapGained = Math.floor(100 * playerStats.scrapBonus);
                gameState.scrap += scrapGained;
                logMessages.push({ message: `Auto-salvaged <span class="epic">${baseGem.name}</span> for ${scrapGained} scrap.`, class: '' });
                return null; // Return null to indicate it was salvaged
            }
            // Use the new stacking function
            const updatedStack = player.addToPlayerStacks(gameState, baseGem, 'gems');
            return updatedStack;
        };
        
        const initialDrop = handleGemDrop(itemBaseToDrop);
        if (initialDrop) {
             droppedGems.push(initialDrop); // We animate the stack
        }

        return { droppedItems, droppedGems, logMessages, events };
    }
    
    // It's a regular item or a consumable
    let rarity;
    if (isConsumable) {
        rarity = 'legendary';
    } else {
        let rarityRoll = Math.random() * 100;
        rarityRoll -= playerStats.magicFind;

        const isAnyBoss = isBossLevel(gameState.currentFightingLevel) || isBigBossLevel(gameState.currentFightingLevel) || isMiniBossLevel(gameState.currentFightingLevel);

        if (isAnyBoss && rarityRoll < 5) rarity = 'legendary';
        else if (rarityRoll < 5) rarity = 'legendary';
        else if (rarityRoll < 20) rarity = 'epic';
        else if (rarityRoll < 50) rarity = 'rare';
        else if (rarityRoll < 85) rarity = 'uncommon';
        else rarity = 'common';
    }

    const item = isConsumable 
        ? itemBaseToDrop
        : generateItem(rarity, gameState.currentFightingLevel, itemBaseToDrop);

    if (!isConsumable && !shouldKeepItem(item, gameState.salvageFilter)) {
        const rarityIndex = rarities.indexOf(item.rarity);
        const scrapGained = Math.ceil(Math.pow(3, rarityIndex) * playerStats.scrapBonus);
        gameState.scrap += scrapGained;
        logMessages.push({ message: `Auto-salvaged <span class="${item.rarity}">${item.name}</span> for ${scrapGained} scrap.`, class: '' });
        return { droppedItems: [], droppedGems: [], logMessages, events };
    }

    // Route item to correct inventory
    if (isConsumable) {
        const updatedStack = player.addToPlayerStacks(gameState, item, 'consumables');
        droppedItems.push(updatedStack); // Animate the stack
    } else {
        const spot = findNextAvailableSpot(item.width, item.height, gameState.inventory);
        if (spot) {
            item.x = spot.x;
            item.y = spot.y;
            gameState.inventory.push(item);
            droppedItems.push(item);
        } else {
            logMessages.push({ message: `The ${currentMonster.name} dropped an item, but your inventory is full!`, class: 'rare' });
        }
    }

    return { droppedItems, droppedGems, logMessages, events };
}

/**
 * Handles the logic when a monster is defeated.
 */
export function monsterDefeated(gameState, playerStats, currentMonster) {
    // --- START MODIFICATION: Call hunt progress check ---
    player.checkHuntProgress(gameState, currentMonster);
    // --- END MODIFICATION ---

    const level = gameState.currentFightingLevel;
    const logMessages = [];
    const previousMonsterMaxHp = gameState.monster.maxHp;

    const monsterKey = Object.keys(MONSTERS).find(key => MONSTERS[key] === currentMonster.data);
    if (monsterKey) {
        if (!gameState.monsterKillCounts) gameState.monsterKillCounts = {};
        gameState.monsterKillCounts[monsterKey] = (gameState.monsterKillCounts[monsterKey] || 0) + 1;
    }

    // --- Path 1: Player defeated a Golden Slime ---
    if (currentMonster.data.id === 'GOLDEN_SLIME') {
        const encounter = gameState.specialEncounter;
        const continueCheck = Math.random() * 100 < encounter.nextChance;
        const result = { goldGained: 0, xpGained: 0, droppedItems: [], droppedGems: [], logMessages, events: [] };

        if (continueCheck) {
            // The chain continues!
            const nextChainLevel = encounter.chainLevel + 1;
            const nextChance = encounter.nextChance * 0.9;
            const newHp = encounter.hp * 0.5; 
            const newGoldReward = encounter.baseGold * Math.pow(3, nextChainLevel);

            gameState.specialEncounter = {
                ...encounter,
                chainLevel: nextChainLevel,
                hp: newHp,
                goldReward: newGoldReward,
                nextChance: nextChance,
            };
            logMessages.push({ message: `The chain continues! The slime grows stronger... (Next chance: ${nextChance.toFixed(1)}%)`, class: 'legendary' });
        } else {
            // The chain breaks! Update records and award gold.
            if (!gameState.goldenSlimeStreak) {
                gameState.goldenSlimeStreak = { max: 0, maxGold: 0 };
            }
            
            if (encounter.chainLevel > gameState.goldenSlimeStreak.max) {
                gameState.goldenSlimeStreak.max = encounter.chainLevel;
            }
            if (encounter.goldReward > gameState.goldenSlimeStreak.maxGold) {
                gameState.goldenSlimeStreak.maxGold = encounter.goldReward;
            }
            
            const goldGained = encounter.goldReward;
            gameState.gold += goldGained;
            const goldTier = Math.floor(Math.log10(goldGained) / 3);
            const goldText = `<span class="currency-tier-${goldTier}">${formatNumber(goldGained)}</span>`;
            logMessages.push({ message: `The chain breaks! You receive a massive bonus of ${goldText} gold!`, class: 'legendary' });
            
            result.encounterEnded = true;

            if (gameState.isAutoProgressing) {
                const nextLevel = level + 1;
                const nextSubZone = findSubZoneByLevel(nextLevel);
                if (nextSubZone) gameState.currentFightingLevel = nextLevel;
            }
        }
        
        result.logMessages = logMessages;
        return result;
    }
    
    // --- Path 2: Player defeated a normal monster ---
    if (!gameState.completedLevels.includes(level)) gameState.completedLevels.push(level);
    if (!gameState.currentRunCompletedLevels.includes(level)) gameState.currentRunCompletedLevels.push(level);

    const tier = Math.floor((level - 1) / 10);
    const difficultyResetFactor = 1;
    const effectiveLevel = level - (tier * difficultyResetFactor);

    let baseGoldDrop = 10 + (3 * Math.pow(effectiveLevel, 2.1));
    let xpGained = 20 * Math.pow(level, 1.2);
    xpGained *= (1 + (playerStats.bonusXp / 100)); // Apply XP bonus from consumables
    
    if (isBigBossLevel(level)) { xpGained *= 3; baseGoldDrop *= 3; } 
    else if (isBossLevel(level)) { xpGained *= 2; baseGoldDrop *= 2; } 
    else if (isMiniBossLevel(level)) { xpGained *= 1.5; baseGoldDrop *= 1.5; }
    
    const heroLevel = gameState.hero.level;
    const levelDifference = heroLevel - level;

    if (levelDifference > 0) {
        const reductionPercent = levelDifference * 0.01; // 1% per level difference
        const xpMultiplier = Math.max(0.1, 1 - reductionPercent); // Floor at 10%
        xpGained *= xpMultiplier;
    }

    const goldMasteryLevel = gameState.permanentUpgrades.GOLD_MASTERY || 0;
    const goldMasteryBonus = PERMANENT_UPGRADES.GOLD_MASTERY.bonusPerLevel * goldMasteryLevel;
    let goldAfterMastery = baseGoldDrop * (1 + (goldMasteryBonus / 100));

    let finalGoldGained = Math.ceil(goldAfterMastery * (1 + (playerStats.bonusGold / 100)));
    xpGained = Math.ceil(xpGained);

    gameState.gold += finalGoldGained;

    // --- START OF MODIFICATION: Guarantee drop on first kill ---
    let dropOccurs = false;
    if (!gameState.firstKillCompleted && gameState.currentFightingLevel === 1) {
        dropOccurs = true;
        gameState.firstKillCompleted = true; // Set flag immediately to prevent re-triggering
    } else {
        dropOccurs = Math.random() * 100 < currentMonster.data.dropChance;
    }

    const lootResult = dropOccurs ? dropLoot(currentMonster, gameState, playerStats) : { droppedItems: [], droppedGems: [], logMessages: [], events: [] };
    // --- END OF MODIFICATION ---
    
    logMessages.push({ message: `You defeated the ${currentMonster.name} and gained ${formatNumber(xpGained)} XP.`, class: '' });
    
    logMessages.push({ message: `You gained ${formatNumber(finalGoldGained)} gold.`, class: '' });

    lootResult.logMessages.forEach(msg => logMessages.push(msg));
    if (lootResult.droppedItems.length > 0 || lootResult.droppedGems.length > 0) {
        logMessages.push({ message: `The ${currentMonster.name} dropped something!`, class: '' });
        [...lootResult.droppedItems, ...lootResult.droppedGems].forEach(drop => {
            logMessages.push({ message: `<span class="${drop.rarity || 'epic'}">${drop.name}</span>`, class: '' });
        });
    }

    // Check for Slime Split
    let slimeSplitChance = 0;
    const equippedSword = gameState.equipment.sword;
    const swordBase = equippedSword ? ITEMS[equippedSword.baseId] : null;
    if (swordBase && swordBase.uniqueEffect === 'slimeSplit') {
        slimeSplitChance += 10;
    }
    if (gameState.absorbedUniqueEffects && gameState.absorbedUniqueEffects['slimeSplit']) {
        slimeSplitChance += (gameState.absorbedUniqueEffects['slimeSplit'] * 10);
    }

    if (gameState.isSlimeSplitEnabled && slimeSplitChance > 0 && Math.random() * 100 < slimeSplitChance) {
        
        const slimeSpawnedResult = { 
            goldGained: finalGoldGained, 
            xpGained, 
            droppedItems: lootResult.droppedItems, 
            droppedGems: lootResult.droppedGems, 
            logMessages, 
            events: lootResult.events,
            slimeSpawned: true 
        };

        logMessages.push({ message: `The monster's essence coalesces into a <span class="legendary">Golden Slime!</span>`, class: '' });
        gameState.specialEncounter = {
            type: 'GOLDEN_SLIME',
            chainLevel: 1,
            baseGold: finalGoldGained, 
            hp: previousMonsterMaxHp * 0.5,
            goldReward: finalGoldGained * 3,
            nextChance: slimeSplitChance * 0.9,
        };
        
        return slimeSpawnedResult;

    } else {
        if (gameState.isAutoProgressing) {
            const nextLevel = level + 1;
            const nextSubZone = findSubZoneByLevel(nextLevel);
            if (nextSubZone) gameState.currentFightingLevel = nextLevel;
        }
    }
    
    if (gameState.currentFightingLevel > gameState.maxLevel) {
        gameState.maxLevel = gameState.currentFightingLevel;
    }
    
    return { goldGained: finalGoldGained, xpGained, droppedItems: lootResult.droppedItems, droppedGems: lootResult.droppedGems, logMessages, events: lootResult.events };
}


/**
 * Calculates the raw, unmodified, exponential HP of a monster at a specific level.
 * This function no longer considers monster type (Boss, Mini-Boss, etc.).
 * @param {number} level - The level to calculate HP for.
 * @returns {number} The calculated raw HP.
 */
function calculateRawMonsterHp(level) {
    const baseHealthFactor = 4;
    const healthPower = 2.6;

    // 1. Base HP Calculation
    let monsterHealth = (baseHealthFactor * Math.pow(level, healthPower));

    // 2. World Tier Multiplier
    const worldTier = Math.floor((level - 1) / 100);
    if (worldTier > 0) {
        const worldTierMultiplier = 1 + (worldTier * 6);
        monsterHealth *= worldTierMultiplier;
    }

    // 3. Compounding Realm Multiplier
    const realmIndex = Math.floor((level - 1) / 400);
    if (realmIndex > 0) {
        const realmJumpFactor = 8;
        const realmMultiplier = Math.pow(realmJumpFactor, realmIndex);
        monsterHealth *= realmMultiplier;
    }

    // NOTE: All boss-specific multipliers have been moved to generateMonster.
    return monsterHealth;
}

// --- Centralized Multiplier Constants for Easy Tuning ---
/** Multiplier for Big Boss HP relative to the previous monster. */
const BIG_BOSS_HP_MULTIPLIER = 7.4; 
/** Multiplier for regular Bosses (levels 10, 20, etc.) applied to their raw HP. */
const BOSS_HP_MULTIPLIER = 5.287;
/** Multiplier for Mini-Bosses (levels 5, 15, etc.) applied to their raw HP. */
const MINI_BOSS_HP_MULTIPLIER = 3.1123;


/**
 * Generates a new monster based on the current fighting level.
 * This function is now the single source of truth for applying all HP multipliers.
 */
export function generateMonster(level, specialEncounter = null) {
    let monsterData;
    let monsterHealth;

    if (specialEncounter && specialEncounter.type === 'GOLDEN_SLIME') {
        monsterData = MONSTERS.GOLDEN_SLIME;
        monsterHealth = specialEncounter.hp;
    } else {
        const subZone = findSubZoneByLevel(level);
        if (subZone && subZone.monsterPool && subZone.monsterPool.length > 0) {
            monsterData = subZone.monsterPool[Math.floor(Math.random() * subZone.monsterPool.length)];
        } else {
            console.error("No sub-zone or monster pool found for level:", level, ". Falling back to Slime.");
            monsterData = MONSTERS.SLIME;
        }

        // --- REFACTORED AND CENTRALIZED HP CALCULATION LOGIC ---

        if (isBigBossLevel(level) && level > 1) {
            // Case 1: Big Boss (e.g., 100, 200). Uses the "chained" logic based on the previous level.
            const prevMonsterResult = generateMonster(level - 1);
            const prevMonsterHp = prevMonsterResult.newMonsterState.maxHp;
            monsterHealth = prevMonsterHp * BIG_BOSS_HP_MULTIPLIER;

        } else {
            // Case 2: Handles all other monsters (Regular, Mini-Boss, and Boss).
            
            // Step A: Determine the base HP, accounting for the "zone reset" logic.
            let baseHpForLevel;
            const zoneIndex = Math.floor((level - 1) / 100);

            if (zoneIndex === 0) {
                // For the first zone (1-99), the base is simply the raw HP.
                baseHpForLevel = calculateRawMonsterHp(level);
            } else {
                // For zones 2+, we apply the "reset and scale" logic.
                const targetPercentage = 0.45;
                const prevBossLevel = zoneIndex * 100;
                const prevBossHp = generateMonster(prevBossLevel).newMonsterState.maxHp;
                const zoneStartLevel = prevBossLevel + 1;
                const targetStartHp = prevBossHp * targetPercentage;
                const normalStartHp = calculateRawMonsterHp(zoneStartLevel);
                const zoneMultiplier = targetStartHp / normalStartHp;
                baseHpForLevel = calculateRawMonsterHp(level) * zoneMultiplier;
            }

            // Step B: Apply final multipliers for non-Big-Boss types.
            if (isBossLevel(level)) {
                monsterHealth = baseHpForLevel * BOSS_HP_MULTIPLIER;
            } else if (isMiniBossLevel(level)) {
                monsterHealth = baseHpForLevel * MINI_BOSS_HP_MULTIPLIER;
            } else {
                // For a regular monster, the base HP is the final HP.
                monsterHealth = baseHpForLevel;
            }
        }
    }
    
    monsterHealth = Math.ceil(monsterHealth);
    
    const newMonster = { name: monsterData.name, data: monsterData };
    const newMonsterState = { 
        hp: monsterHealth, 
        maxHp: monsterHealth,
        instanceId: Date.now() + Math.random(), // <-- NEW: Unique ID for this specific monster spawn
        statusEffects: {
            poisonStacks: 0
        }
    };
    
    return { newMonster, newMonsterState };
}