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

    // --- Path 1: Player defeated a Golden Slime ---
    if (currentMonster.data.id === 'GOLDEN_SLIME') {
        const encounter = gameState.specialEncounter;
        const continueCheck = Math.random() * 100 < encounter.nextChance;

        if (continueCheck) {
            // The chain continues!
            const nextChainLevel = encounter.chainLevel + 1;
            const nextChance = encounter.nextChance * 0.9;
            const newHp = encounter.baseHp * Math.pow(1.5, nextChainLevel);
            const newGoldReward = encounter.baseGold * Math.pow(5, nextChainLevel);

            gameState.specialEncounter = {
                ...encounter,
                chainLevel: nextChainLevel,
                hp: newHp,
                goldReward: newGoldReward,
                nextChance: nextChance,
            };
            logMessages.push({ message: `The chain continues! The slime grows stronger... (Next chance: ${nextChance.toFixed(1)}%)`, class: 'legendary' });
        } else {
            // The chain breaks! Award the gold from the slime that was just defeated.
            const goldGained = encounter.goldReward;
            gameState.gold += goldGained;
            const goldTier = Math.floor(Math.log10(goldGained) / 3);
            const goldText = `<span class="currency-tier-${goldTier}">${formatNumber(goldGained)}</span>`;
            logMessages.push({ message: `The chain breaks! You receive a massive bonus of ${goldText} gold!`, class: 'legendary' });
            
            // Reset the encounter and progress to the next level.
            gameState.specialEncounter = null;
            if (gameState.isAutoProgressing) {
                const nextLevel = level + 1;
                const nextSubZone = findSubZoneByLevel(nextLevel);
                if (nextSubZone) gameState.currentFightingLevel = nextLevel;
            }
        }
        // No XP or regular loot is given from Golden Slimes.
        return { goldGained: 0, xpGained: 0, droppedItems: [], droppedGems: [], logMessages, events: [] };
    }
    
    // --- Path 2: Player defeated a normal monster ---
    if (!gameState.completedLevels.includes(level)) gameState.completedLevels.push(level);
    if (!gameState.currentRunCompletedLevels.includes(level)) gameState.currentRunCompletedLevels.push(level);

    const monsterKey = Object.keys(MONSTERS).find(key => MONSTERS[key] === currentMonster.data);
    if (monsterKey) {
        if (!gameState.monsterKillCounts) gameState.monsterKillCounts = {};
        gameState.monsterKillCounts[monsterKey] = (gameState.monsterKillCounts[monsterKey] || 0) + 1;
    }

    // Calculate base rewards
    const tier = Math.floor((level - 1) / 10);
    const difficultyResetFactor = 1;
    const effectiveLevel = level - (tier * difficultyResetFactor);

    let goldGained = 10 + (3 * Math.pow(effectiveLevel, 2.0));
    let xpGained = 20 * Math.pow(level, 1.2);
    
    if (isBigBossLevel(level)) { xpGained *= 3; goldGained *= 3; } 
    else if (isBossLevel(level)) { xpGained *= 2; goldGained *= 2; } 
    else if (isMiniBossLevel(level)) { xpGained *= 1.5; goldGained *= 1.5; }
    
    goldGained = Math.ceil(goldGained * (1 + (playerStats.bonusGold / 100)));
    xpGained = Math.ceil(xpGained);

    // Give XP and handle item drops immediately
    gameState.xpGained += xpGained;
    const lootResult = (Math.random() * 100 < currentMonster.data.dropChance) ? dropLoot(currentMonster, gameState, playerStats) : { droppedItems: [], droppedGems: [], logMessages: [], events: [] };
    logMessages.push({ message: `You defeated the ${currentMonster.name} and gained ${formatNumber(xpGained)} XP.`, class: '' });
    lootResult.logMessages.forEach(msg => logMessages.push(msg));
    if (lootResult.droppedItems.length > 0 || lootResult.droppedGems.length > 0) {
        logMessages.push({ message: `The ${currentMonster.name} dropped something!`, class: '' });
        [...lootResult.droppedItems, ...lootResult.droppedGems].forEach(drop => {
            logMessages.push({ message: `<span class="${drop.rarity || 'epic'}">${drop.name}</span>`, class: '' });
        });
    }

    // Check if a slime chain starts
    let initialSlimeSplitChance = 0;
    const equippedSword = gameState.equipment.sword;
    const swordBase = equippedSword ? ITEMS[equippedSword.baseId] : null;
    if (swordBase && swordBase.uniqueEffect === 'slimeSplit') initialSlimeSplitChance += 10;
    if (gameState.absorbedUniqueEffects && gameState.absorbedUniqueEffects['slimeSplit']) initialSlimeSplitChance += gameState.absorbedUniqueEffects['slimeSplit'] * 10;

    if (initialSlimeSplitChance > 0 && Math.random() * 100 < initialSlimeSplitChance) {
        // A chain starts! Withhold gold and create the first slime.
        logMessages.push({ message: `The monster's essence coalesces into a <span class="legendary">Golden Slime!</span>`, class: '' });
        gameState.specialEncounter = {
            type: 'GOLDEN_SLIME',
            chainLevel: 1,
            baseHp: previousMonsterMaxHp,
            baseGold: goldGained, // Store the gold that would have been gained
            hp: previousMonsterMaxHp * 1.5,
            goldReward: goldGained * 5,
            nextChance: initialSlimeSplitChance * 0.9,
        };
    } else {
        // No chain started. Give the normal gold and progress.
        gameState.gold += goldGained;
        logMessages.push({ message: `You gained ${formatNumber(goldGained)} gold.`, class: '' });
        if (gameState.isAutoProgressing) {
            const nextLevel = level + 1;
            const nextSubZone = findSubZoneByLevel(nextLevel);
            if (nextSubZone) gameState.currentFightingLevel = nextLevel;
        }
    }

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