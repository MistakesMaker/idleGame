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
 * Returns an object containing arrays of items and gems.
 */
export function dropLoot(currentMonster, gameState, playerStats) {
    const monsterDef = currentMonster.data;
    if (!monsterDef || !monsterDef.lootTable || monsterDef.lootTable.length === 0) {
        return { droppedItems: [], droppedGems: [], logMessages: [], events: [] };
    }

    const logMessages = [];
    const droppedItems = [];
    const droppedGems = [];
    const events = [];
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

    if (!itemBaseToDrop) return { droppedItems: [], droppedGems: [], logMessages: [], events: [] };

    const isGem = itemBaseToDrop.tier >= 1;

    if (isGem) {
        const gem = {
            ...itemBaseToDrop,
            id: Date.now() + Math.random(),
            baseId: itemBaseToDrop.id
        };

        if (gameState.salvageFilter.autoSalvageGems) {
            const scrapGained = 100;
            gameState.scrap += scrapGained;
            logMessages.push({ message: `Auto-salvaged <span class="epic">${gem.name}</span> for ${scrapGained} scrap.`, class: '' });
            return { droppedItems: [], droppedGems: [], logMessages, events };
        }

        if (!gameState.gems) gameState.gems = [];
        
        // Add the primary gem
        gameState.gems.push(gem);
        droppedGems.push(gem);
        
        // Check for the Gem Find (duplication) bonus
        if (playerStats.gemFindChance > 0 && Math.random() * 100 < playerStats.gemFindChance) {
            const duplicateGem = {
                ...itemBaseToDrop,
                id: Date.now() + Math.random() + 1,
                baseId: itemBaseToDrop.id
            };
            gameState.gems.push(duplicateGem);
            droppedGems.push(duplicateGem); // Add the duplicate to the dropped list for UI feedback
            logMessages.push({ message: `Gem Find! You found a duplicate <span class="epic">${duplicateGem.name}</span>!`, class: '' });
            events.push('gemFind');
        }
        
        return { droppedItems, droppedGems, logMessages, events };
    }
    
    // It's a regular item
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
        return { droppedItems: [], droppedGems: [], logMessages, events };
    }

    const spot = findEmptySpot(item.width, item.height, gameState.inventory);
    
    if (spot) {
        item.x = spot.x;
        item.y = spot.y;
        gameState.inventory.push(item);
        droppedItems.push(item);
    } else {
        logMessages.push({ message: `The ${currentMonster.name} dropped an item, but your inventory is full!`, class: 'rare' });
    }

    return { droppedItems, droppedGems, logMessages, events };
}

/**
 * Handles the logic when a monster is defeated.
 */
export function monsterDefeated(gameState, playerStats, currentMonster) {
    const level = gameState.currentFightingLevel;
    const logMessages = [];
    const previousMonsterMaxHp = gameState.monster.maxHp;

    const monsterKey = Object.keys(MONSTERS).find(key => MONSTERS[key] === currentMonster.data);
    if (monsterKey) {
        if (!gameState.monsterKillCounts) gameState.monsterKillCounts = {};
        gameState.monsterKillCounts[monsterKey] = (gameState.monsterKillCounts[monsterKey] || 0) + 1;
    }

    if (!gameState.completedLevels.includes(level)) gameState.completedLevels.push(level);
    if (!gameState.currentRunCompletedLevels.includes(level)) gameState.currentRunCompletedLevels.push(level);

    const tier = Math.floor((level - 1) / 10);
    const difficultyResetFactor = 1;
    const effectiveLevel = level - (tier * difficultyResetFactor);

    const baseGold = 10;
    const goldFactor = 3;
    const goldPower = 2.0;
    let goldGained = baseGold + (goldFactor * Math.pow(effectiveLevel, goldPower));
    goldGained = Math.ceil(goldGained * (1 + (playerStats.bonusGold / 100)));

    const baseXp = 20;
    const xpPower = 1.2;
    let xpGained = baseXp * Math.pow(level, xpPower);

    let lootResult = { droppedItems: [], droppedGems: [], logMessages: [], events: [] };

    if (currentMonster.data.isSpecial && currentMonster.data.id === 'GOLDEN_SLIME') {
        gameState.goldenSlimeStreak = (gameState.goldenSlimeStreak || 0) + 1;
        // --- FIX START: Corrected Golden Slime gold reward logic ---
        // The reward is now taken directly from the encounter data, without the extra streak multiplier.
        goldGained = gameState.specialEncounter.goldReward;
        // --- FIX END ---
        xpGained = 0;

        // Check for and update the max streak for this run
        if (gameState.goldenSlimeStreak > (gameState.maxGoldenSlimeStreak || 0)) {
            gameState.maxGoldenSlimeStreak = gameState.goldenSlimeStreak;
            // Record the gold from this new max streak. Note: This uses the already calculated goldGained.
            gameState.maxGoldenSlimeStreakGold = goldGained;
        }

        const getNumberTier = (amount) => {
            if (amount < 1e3) return 0; if (amount < 1e6) return 1; if (amount < 1e9) return 2;
            if (amount < 1e12) return 3; if (amount < 1e15) return 4; if (amount < 1e18) return 5;
            return 6;
        };
        const goldTier = getNumberTier(goldGained);
        const goldText = `<span class="currency-tier-${goldTier}">${formatNumber(goldGained)}</span>`;

        logMessages.push({ message: `Golden Slime defeated! (Streak: <span class="golden-streak-text">${gameState.goldenSlimeStreak}</span>) You gained a massive bonus of ${goldText} gold!`, class: '' });
        gameState.specialEncounter = null;
    } else {
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
            lootResult = dropLoot(currentMonster, gameState, playerStats);
            lootResult.logMessages.forEach(msg => logMessages.push(msg));

            const allDrops = [...lootResult.droppedItems, ...lootResult.droppedGems];
            if (allDrops.length > 0) {
                logMessages.push({ message: `The ${currentMonster.name} dropped something!`, class: '' });
                allDrops.forEach(droppedItem => {
                    const isGem = droppedItem.tier >= 1;
                    const rarityClass = isGem ? 'epic' : droppedItem.rarity;
                    logMessages.push({ message: `<span class="${rarityClass}">${droppedItem.name}</span>`, class: '' });
                });
            }
        }
    }
    
    let initialSlimeSplitChance = 0;
    
    const equippedSword = gameState.equipment.sword;
    const swordBase = equippedSword ? ITEMS[equippedSword.baseId] : null;
    if (swordBase && swordBase.uniqueEffect === 'slimeSplit') {
        initialSlimeSplitChance += 10;
    }

    if (gameState.absorbedUniqueEffects && gameState.absorbedUniqueEffects['slimeSplit']) {
        initialSlimeSplitChance += gameState.absorbedUniqueEffects['slimeSplit'] * 10;
    }

    if (initialSlimeSplitChance > 0) {
        let slimeCounter = 0;
        let currentSplitChance = Math.min(100, initialSlimeSplitChance);

        while (Math.random() * 100 < currentSplitChance) {
            slimeCounter++;
            currentSplitChance *= 0.9;
        }

        if (slimeCounter > 0) {
            const mutationText = slimeCounter === 1 ? "once" : `${slimeCounter} times`;
            logMessages.push({ message: `The monster's essence mutates <span class="legendary">${mutationText}</span>, creating a powerful Golden Slime!`, class: '' });
            
            gameState.specialEncounter = {
                type: 'GOLDEN_SLIME',
                hp: (previousMonsterMaxHp / 2) * Math.pow(1.5, slimeCounter),
                goldReward: goldGained * Math.pow(5, slimeCounter), 
            };
        } else {
            if (gameState.isAutoProgressing) {
                const nextLevel = level + 1;
                const nextSubZone = findSubZoneByLevel(nextLevel);
                if (nextSubZone) gameState.currentFightingLevel = nextLevel;
            }
        }
    } else {
        if (gameState.isAutoProgressing) {
            const nextLevel = level + 1;
            const nextSubZone = findSubZoneByLevel(nextLevel);
            if (nextSubZone) gameState.currentFightingLevel = nextLevel;
        }
    }

    gameState.gold += goldGained;

    if (gameState.currentFightingLevel > gameState.maxLevel) {
        gameState.maxLevel = gameState.currentFightingLevel;
    }
    
    return { goldGained, xpGained, droppedItems: lootResult.droppedItems, droppedGems: lootResult.droppedGems, logMessages, events: lootResult.events };
}

/**
 * Generates a new monster based on the current fighting level.
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

        const baseHealthFactor = 4;
        const healthPower = 2.4;
        
        const tier = Math.floor((level - 1) / 10);
        const difficultyResetFactor = 1;
        const effectiveLevel = level - (tier * difficultyResetFactor);

        monsterHealth = 10 + (baseHealthFactor * Math.pow(effectiveLevel, healthPower));

        const worldTier = Math.floor((level - 1) / 100);
        if (worldTier > 0) {
            const spikeMultiplier = 4;
            const worldTierMultiplier = 1 + (worldTier * spikeMultiplier);
            monsterHealth *= worldTierMultiplier;
        }

        if (isBigBossLevel(level)) monsterHealth *= 5;
        else if (isBossLevel(level)) monsterHealth *= 3;
        else if (isMiniBossLevel(level)) monsterHealth *= 2;
    }
    
    monsterHealth = Math.ceil(monsterHealth);

    const newMonster = { name: monsterData.name, data: monsterData };
    const newMonsterState = { hp: monsterHealth, maxHp: monsterHealth };
    
    return { newMonster, newMonsterState };
}