// --- START OF FILE game_logic.js ---

import { MONSTERS } from './data/monsters.js';
import { ITEMS } from './data/items.js';
import { GEMS } from './data/gems.js';
import { rarities } from './game.js';
import { isBossLevel, isBigBossLevel, isMiniBossLevel, findSubZoneByLevel, formatNumber, findEmptySpot } from './utils.js';

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
        
        const final_stat_value = min_for_tier + (Math.random() * tier_specific_range);

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
 */
export function dropLoot(currentMonster, gameState, playerStats) {
    const monsterDef = currentMonster.data;
    if (!monsterDef || !monsterDef.lootTable || monsterDef.lootTable.length === 0) return { droppedItem: null, logMessages: [] };

    const logMessages = [];
    const totalWeight = monsterDef.lootTable.reduce((sum, entry) => sum + entry.weight, 0);
    let roll = Math.random() * totalWeight;

    let itemBaseToDrop;
    for (const entry of monsterDef.lootTable) {
        if (roll < entry.weight) {
            itemBaseToDrop = entry.item;
            break;
        }
        roll -= entry.weight;
    }

    if (!itemBaseToDrop) return { droppedItem: null, logMessages: [] };

    // Check if the drop is a gem by looking for a 'tier' property
    const isGem = itemBaseToDrop.tier >= 1;

    if (isGem) {
        const gem = { ...itemBaseToDrop, id: Date.now() + Math.random() };

        // NEW: Check for auto-salvage gems setting
        if (gameState.salvageFilter.autoSalvageGems) {
            const scrapGained = 100;
            gameState.scrap += scrapGained;
            logMessages.push({ message: `Auto-salvaged <span class="epic">${gem.name}</span> for ${scrapGained} scrap.`, class: '' });
            return { droppedItem: null, logMessages }; // Return early, no gem is added
        }

        if (!gameState.gems) gameState.gems = []; // Safety check for old saves
        
        // Add the primary gem
        gameState.gems.push(gem);
        
        // Check for the new Gem Find (duplication) bonus
        if (playerStats.gemFindChance > 0 && Math.random() * 100 < playerStats.gemFindChance) {
            const duplicateGem = { ...itemBaseToDrop, id: Date.now() + Math.random() + 1 };
            gameState.gems.push(duplicateGem);
            logMessages.push({ message: `Gem Find! You found a duplicate <span class="epic">${duplicateGem.name}</span>!`, class: '' });
        }
        
        return { droppedItem: gem, logMessages };
    }
    
    // It's a regular item, proceed with rarity roll etc.
    let rarityRoll = Math.random() * 100;
    rarityRoll -= playerStats.magicFind;

    let rarity;
    const isAnyBoss = isBossLevel(gameState.currentFightingLevel) || isBigBossLevel(gameState.currentFightingLevel) || isMiniBossLevel(gameState.currentFightingLevel);

    if (isAnyBoss && rarityRoll < 5) rarity = 'legendary';
    else if (rarityRoll < 5) rarity = 'legendary';
    else if (rarityRoll < 20) rarity = 'epic';
    else if (rarityRoll < 50) rarity = 'rare';
    else if (rarityRoll < 85) rarity = 'uncommon';
    else rarity = 'common';

    const item = generateItem(rarity, gameState.currentFightingLevel, itemBaseToDrop);

    if (!shouldKeepItem(item, gameState.salvageFilter)) {
        const rarityIndex = rarities.indexOf(item.rarity);
        const scrapGained = Math.ceil(Math.pow(4, rarityIndex) * playerStats.scrapBonus);
        gameState.scrap += scrapGained;
        logMessages.push({ message: `Auto-salvaged <span class="${item.rarity}">${item.name}</span> for ${scrapGained} scrap.`, class: '' });
        return { droppedItem: null, logMessages };
    }

    const spot = findEmptySpot(item.width, item.height, gameState.inventory);
    
    if (spot) {
        item.x = spot.x;
        item.y = spot.y;
        gameState.inventory.push(item);
        return { droppedItem: item, logMessages };
    } else {
        // Inventory is full, can't add the item.
        return { droppedItem: null, logMessages: [{ message: `The ${currentMonster.name} dropped an item, but your inventory is full!`, class: 'rare' }] };
    }
}

/**
 * Handles the logic when a monster is defeated.
 */
export function monsterDefeated(gameState, playerStats, currentMonster) {
    const level = gameState.currentFightingLevel;
    const logMessages = [];
    const previousMonsterMaxHp = gameState.monster.maxHp;

    // --- NEW: Kill Count Logic ---
    const monsterKey = Object.keys(MONSTERS).find(key => MONSTERS[key] === currentMonster.data);
    if (monsterKey) {
        if (!gameState.monsterKillCounts) {
            gameState.monsterKillCounts = {};
        }
        gameState.monsterKillCounts[monsterKey] = (gameState.monsterKillCounts[monsterKey] || 0) + 1;
    }
    // --- END: Kill Count Logic ---

    if (!gameState.completedLevels.includes(level)) {
        gameState.completedLevels.push(level);
    }
    if (!gameState.currentRunCompletedLevels.includes(level)) {
        gameState.currentRunCompletedLevels.push(level);
    }

    // --- REWARD CALCULATION (NEW POLYNOMIAL MODEL) ---
    const tier = Math.floor((level - 1) / 10);
    const difficultyResetFactor = 1;
    const effectiveLevel = level - (tier * difficultyResetFactor);

    // Gold Calculation
    const baseGold = 10;
    const goldFactor = 3;
    const goldPower = 2.0;
    let goldGained = baseGold + (goldFactor * Math.pow(effectiveLevel, goldPower));
    goldGained = Math.ceil(goldGained * (1 + (playerStats.bonusGold / 100)));

    // XP Calculation
    const baseXp = 20;
    const xpPower = 1.2;
    let xpGained = baseXp * Math.pow(level, xpPower); // XP scales with the actual level, not effectiveLevel

    let droppedItem = null;

    // Handle special monster rewards (Golden Slime)
    if (currentMonster.data.isSpecial && currentMonster.data.id === 'GOLDEN_SLIME') {
        gameState.goldenSlimeStreak = (gameState.goldenSlimeStreak || 0) + 1;
        goldGained = gameState.specialEncounter.goldReward * gameState.goldenSlimeStreak;
        xpGained = 0; // No XP from Golden Slime
        logMessages.push({ message: `You defeated the Golden Slime! (Streak: ${gameState.goldenSlimeStreak}) You gained a massive bonus of ${formatNumber(goldGained)} gold!`, class: '' });
        gameState.specialEncounter = null; // Clear the special encounter
    } else {
        // Apply regular boss multipliers to rewards
        if (isBigBossLevel(level)) {
            xpGained *= 3;
            goldGained *= 3;
        } else if (isBossLevel(level)) {
            xpGained *= 2;
            goldGained *= 2;
        } else if (isMiniBossLevel(level)) {
            xpGained *= 1.5;
            goldGained *= 1.5;
        }
        
        xpGained = Math.ceil(xpGained);
        goldGained = Math.ceil(goldGained);

        logMessages.push({ message: `You defeated the ${currentMonster.name} and gained ${formatNumber(goldGained)} gold and ${formatNumber(xpGained)} XP.`, class: '' });

        const dropRoll = Math.random() * 100;
        if (dropRoll < currentMonster.data.dropChance) {
            const lootResult = dropLoot(currentMonster, gameState, playerStats);
            droppedItem = lootResult.droppedItem;
            
            lootResult.logMessages.forEach(msg => logMessages.push(msg));

            if (droppedItem) {
                const isGem = droppedItem.tier >= 1;
                const rarityClass = isGem ? 'epic' : droppedItem.rarity;
                logMessages.push({ message: `The ${currentMonster.name} dropped something!`, class: '' });
                logMessages.push({ message: `<span class="${rarityClass}">${droppedItem.name}</span>`, class: '' });
            }
        }
    }
    
    // --- Check for unique effects ---
    let slimeSplitChance = 0;
    
    // Check equipped item
    const equippedSword = gameState.equipment.sword;
    const swordBase = equippedSword ? ITEMS[equippedSword.baseId] : null;
    if (swordBase && swordBase.uniqueEffect === 'slimeSplit') {
        slimeSplitChance += 10; // Base 10% chance
    }

    // Check absorbed effects
    if (gameState.absorbedUniqueEffects && gameState.absorbedUniqueEffects['slimeSplit']) {
        slimeSplitChance += gameState.absorbedUniqueEffects['slimeSplit'] * 10;
    }

    if (slimeSplitChance > 0 && Math.random() * 100 < slimeSplitChance) {
        logMessages.push({ message: 'The defeated monster splits into a <span class="legendary">Golden Slime!</span>', class: '' });
        gameState.specialEncounter = {
            type: 'GOLDEN_SLIME',
            hp: previousMonsterMaxHp / 2,
            goldReward: goldGained * 3,
        };
    } else {
        if (gameState.isAutoProgressing) {
            const nextLevel = level + 1;
            const nextSubZone = findSubZoneByLevel(nextLevel);
            if (nextSubZone) {
                gameState.currentFightingLevel = nextLevel;
            }
        }
    }

    gameState.gold += goldGained;

    if (gameState.currentFightingLevel > gameState.maxLevel) {
        gameState.maxLevel = gameState.currentFightingLevel;
    }
    
    return { goldGained, xpGained, droppedItem, logMessages };
}

/**
 * Generates a new monster based on the current fighting level.
 */
export function generateMonster(level, specialEncounter = null) {
    let monsterData;
    let monsterHealth;

    // --- NEW: Handle Special Encounters first ---
    if (specialEncounter && specialEncounter.type === 'GOLDEN_SLIME') {
        monsterData = MONSTERS.GOLDEN_SLIME;
        monsterHealth = specialEncounter.hp;
    } else {
        const subZone = findSubZoneByLevel(level);

        if (subZone && subZone.monsterPool && subZone.monsterPool.length > 0) {
            // Select a random monster from the pool defined in realms.js
            monsterData = subZone.monsterPool[Math.floor(Math.random() * subZone.monsterPool.length)];
        } else {
            // Fallback if no sub-zone or monster pool is defined for the current level
            console.error("No sub-zone or monster pool found for level:", level, ". Falling back to Slime.");
            monsterData = MONSTERS.SLIME;
        }

        // --- NEW: POLYNOMIAL SCALING ---
        const baseHealthFactor = 4;
        const healthPower = 2.4;
        
        const tier = Math.floor((level - 1) / 10);
        const difficultyResetFactor = 1;
        const effectiveLevel = level - (tier * difficultyResetFactor);

        monsterHealth = 10 + (baseHealthFactor * Math.pow(effectiveLevel, healthPower));

        // --- CHANGE: Added a linear "World Tier" HP multiplier for difficulty spikes ---
        const worldTier = Math.floor((level - 1) / 100);
        if (worldTier > 0) {
            const spikeMultiplier = 4; // Each world tier adds 400% of base HP. (e.g., 1+4=5x, 1+8=9x, etc.)
            const worldTierMultiplier = 1 + (worldTier * spikeMultiplier);
            monsterHealth *= worldTierMultiplier;
        }

        // Apply explicit multipliers ONLY for designated boss levels.
        if (isBigBossLevel(level)) {
            monsterHealth *= 5;
        } else if (isBossLevel(level)) {
            monsterHealth *= 3;
        } else if (isMiniBossLevel(level)) {
            monsterHealth *= 2;
        }
    }
    
    // Final rounding to keep numbers clean
    monsterHealth = Math.ceil(monsterHealth);

    const newMonster = { name: monsterData.name, data: monsterData };
    const newMonsterState = { hp: monsterHealth, maxHp: monsterHealth };
    
    return { newMonster, newMonsterState };
}