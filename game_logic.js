// --- START OF FILE game_logic.js ---

import { MONSTERS } from './data/monsters.js';
import { rarities } from './game.js';
import { isBossLevel, isBigBossLevel, findSubZoneByLevel, formatNumber } from './utils.js';

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
        rarity: rarity,
        stats: {},
        locked: false
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

    const tier_min_percent = rarityIndex / rarities.length;
    const tier_max_percent = (rarityIndex + 1) / rarities.length;

    chosenStats.forEach(statInfo => {
        const stat_range = statInfo.max - statInfo.min;
        const random_roll_in_tier = Math.random();
        const final_percent = tier_min_percent + (random_roll_in_tier * (tier_max_percent - tier_min_percent));
        const final_stat_value = statInfo.min + (stat_range * final_percent);
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
    const isBoss = isBossLevel(gameState.currentFightingLevel) || isBigBossLevel(gameState.currentFightingLevel);

    if (isBoss && rarityRoll < 5) rarity = 'legendary';
    else if (rarityRoll < 5) rarity = 'legendary';
    else if (rarityRoll < 20) rarity = 'epic';
    else if (rarityRoll < 50) rarity = 'rare';
    else if (rarityRoll < 85) rarity = 'uncommon';
    else rarity = 'common';

    const item = generateItem(rarity, gameState.currentFightingLevel, itemBaseToDrop);
    gameState.inventory.push(item);
    return item;
}

/**
 * Handles the logic when a monster is defeated.
 */
export function monsterDefeated(gameState, playerStats, currentMonster) {
    const level = gameState.currentFightingLevel;
    const logMessages = [];

    if (!gameState.completedLevels.includes(level)) {
        gameState.completedLevels.push(level);
    }

    const tier = Math.floor((level - 1) / 10);
    const difficultyResetFactor = 4;
    const effectiveLevel = level - (tier * difficultyResetFactor);
    const goldExponent = 1.17;
    const baseGold = 15;
    let goldGained = Math.ceil(baseGold * Math.pow(goldExponent, effectiveLevel) * (1 + (playerStats.bonusGold / 100)));
    gameState.gold += goldGained;

    let xpGained = gameState.currentFightingLevel * 5;
    let droppedItem = null;

    if (isBossLevel(level) || isBigBossLevel(level)) {
        xpGained *= 5;
    }

    logMessages.push(`You defeated the ${currentMonster.name} and gained ${formatNumber(goldGained)} gold and ${formatNumber(xpGained)} XP.`);

    const dropRoll = Math.random() * 100;
    if (dropRoll < currentMonster.data.dropChance) {
        droppedItem = dropLoot(currentMonster, gameState, playerStats);
        if (droppedItem) {
            const isGem = droppedItem.tier >= 1;
            const rarityClass = isGem ? 'epic' : droppedItem.rarity;
            logMessages.push(`The ${currentMonster.name} dropped something! <span class="${rarityClass}" style="font-weight:bold;">${droppedItem.name}</span>`);
        }
    }

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

    if (isBigBossLevel(level)) {
        monsterData = MONSTERS.ARCHDEMON_OVERLORD;
    } else if (isBossLevel(level)) {
        monsterData = MONSTERS.DUNGEON_GUARDIAN;
    } else {
        const subZone = findSubZoneByLevel(level);
        if (subZone && subZone.monsterPool.length > 0) {
            monsterData = subZone.monsterPool[Math.floor(Math.random() * subZone.monsterPool.length)];
        } else {
            console.error("No sub-zone or monster pool found for level:", level, "Falling back to Slime.");
            monsterData = MONSTERS.SLIME;
        }
    }

    const baseExponent = 1.15;
    const tier = Math.floor((level - 1) / 10);
    const difficultyResetFactor = 4;
    const effectiveLevel = level - (tier * difficultyResetFactor);
    let monsterHealth = Math.ceil(10 * Math.pow(baseExponent, effectiveLevel));

    if (isBigBossLevel(level)) {
        monsterHealth *= 10;
    } else if (isBossLevel(level)) {
        monsterHealth *= 5;
    }

    const newMonster = { name: monsterData.name, data: monsterData };
    const newMonsterState = { hp: monsterHealth, maxHp: monsterHealth };
    
    return { newMonster, newMonsterState };
}