// --- START OF FILE game_logic.js ---

import { MONSTERS } from './data/monsters.js';
import { ITEMS } from './data/items.js';
import { rarities } from './game.js';
import { isBossLevel, isBigBossLevel, isMiniBossLevel, findSubZoneByLevel, formatNumber, findEmptySpot } from './utils.js';

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
        type: itemBase.type.toLowerCase(),
        icon: itemBase.icon,
        rarity: rarity,
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
        item.sockets = [];
        
        if (Math.random() < 0.10) {
            item.sockets.push(null);
            
            if (item.sockets.length < itemBase.maxSockets && Math.random() < 0.05) {
                item.sockets.push(null);

                if (item.sockets.length < itemBase.maxSockets && Math.random() < 0.01) {
                    item.sockets.push(null);
                }
            }
        }
    }

    return item;
}

/**
 * Determines and generates loot from the current monster.
 */
export function dropLoot(currentMonster, gameState, playerStats) {
    const monsterDef = currentMonster.data;
    if (!monsterDef || !monsterDef.lootTable || monsterDef.lootTable.length === 0) return null;

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

    if (!itemBaseToDrop) return null;

    // Check if the drop is a gem by looking for a 'tier' property
    const isGem = itemBaseToDrop.tier >= 1;

    if (isGem) {
        // It's a gem, add it to the gems inventory
        const newGem = { ...itemBaseToDrop, id: Date.now() + Math.random() };
        if (!gameState.gems) gameState.gems = []; // Safety check for old saves
        gameState.gems.push(newGem);
        return newGem;
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
    
    // Find a spot in the grid for the new item
    const spot = findEmptySpot(item.width, item.height, gameState.inventory);
    
    if (spot) {
        item.x = spot.x;
        item.y = spot.y;
        gameState.inventory.push(item);
        return item;
    } else {
        // Inventory is full, can't add the item.
        return null;
    }
}

/**
 * Handles the logic when a monster is defeated.
 */
export function monsterDefeated(gameState, playerStats, currentMonster) {
    const level = gameState.currentFightingLevel;
    const logMessages = [];

    // --- FIX: Add level to BOTH permanent and current run trackers ---
    if (!gameState.completedLevels.includes(level)) {
        gameState.completedLevels.push(level);
    }
    if (!gameState.currentRunCompletedLevels.includes(level)) {
        gameState.currentRunCompletedLevels.push(level);
    }

    // --- REWARD CALCULATION (Reverted to old tier-based system) ---
    const tier = Math.floor((level - 1) / 10);
    const difficultyResetFactor = 4;
    const effectiveLevel = level - (tier * difficultyResetFactor);
    const goldExponent = 1.17;
    const baseGold = 15;
    let goldGained = Math.ceil(baseGold * Math.pow(goldExponent, effectiveLevel) * (1 + (playerStats.bonusGold / 100)));
    let xpGained = gameState.currentFightingLevel * 5;
    let droppedItem = null;

    // Apply boss multipliers
    if (isBigBossLevel(level)) {
        xpGained *= 5;
        goldGained *= 5;
    } else if (isBossLevel(level)) {
        xpGained *= 3;
        goldGained *= 3;
    } else if (isMiniBossLevel(level)) {
        xpGained *= 2;
        goldGained *= 2;
    }

    logMessages.push(`You defeated the ${currentMonster.name} and gained ${formatNumber(goldGained)} gold and ${formatNumber(xpGained)} XP.`);

    const dropRoll = Math.random() * 100;
    if (dropRoll < currentMonster.data.dropChance) {
        droppedItem = dropLoot(currentMonster, gameState, playerStats);
        if (droppedItem) {
            const isGem = droppedItem.tier >= 1;
            const rarityClass = isGem ? 'epic' : droppedItem.rarity;
            logMessages.push(`The ${currentMonster.name} dropped something! <span class="${rarityClass}" style="font-weight:bold;">${droppedItem.name}</span>`);
        } else {
            // A drop was rolled, but dropLoot returned null. This means the inventory is full.
            logMessages.push(`The ${currentMonster.name} dropped an item, but your inventory is full!`, 'rare');
        }
    }
    
    // --- Update state after rewards ---
    gameState.gold += goldGained;

    if (gameState.isAutoProgressing) {
        const nextLevel = level + 1;
        const nextSubZone = findSubZoneByLevel(nextLevel);
        if (nextSubZone) {
            gameState.currentFightingLevel = nextLevel;
        }
    }

    if (gameState.currentFightingLevel > gameState.maxLevel) {
        gameState.maxLevel = gameState.currentFightingLevel;
    }
    
    return { goldGained, xpGained, droppedItem, logMessages };
}

/**
 * Generates a new monster based on the current fighting level.
 */
export function generateMonster(level) {
    let monsterData;

    const subZone = findSubZoneByLevel(level);

    if (subZone && subZone.monsterPool && subZone.monsterPool.length > 0) {
        // Select a random monster from the pool defined in realms.js
        monsterData = subZone.monsterPool[Math.floor(Math.random() * subZone.monsterPool.length)];
    } else {
        // Fallback if no sub-zone or monster pool is defined for the current level
        console.error("No sub-zone or monster pool found for level:", level, ". Falling back to Slime.");
        monsterData = MONSTERS.SLIME;
    }

    // --- REVERTED TO OLD TIER-BASED SCALING ---
    const baseExponent = 1.15;
    const tier = Math.floor((level - 1) / 10);
    const difficultyResetFactor = 4;
    const effectiveLevel = level - (tier * difficultyResetFactor);
    let monsterHealth = Math.ceil(10 * Math.pow(baseExponent, effectiveLevel));

    // Apply explicit multipliers ONLY for designated boss levels.
    if (isBigBossLevel(level)) {
        monsterHealth *= 10;
    } else if (isBossLevel(level)) {
        monsterHealth *= 5;
    } else if (isMiniBossLevel(level)) {
        monsterHealth *= 2.5;
    }
    
    const newMonster = { name: monsterData.name, data: monsterData };
    const newMonsterState = { hp: monsterHealth, maxHp: monsterHealth };
    
    return { newMonster, newMonsterState };
}