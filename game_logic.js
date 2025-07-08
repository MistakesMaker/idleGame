// --- START OF FILE game_logic.js ---

import { MONSTERS } from './data/monsters.js';
import { ITEMS } from './data/items.js';
import { GEMS } from './data/gems.js';
import { rarities } from './game.js';
import { isBossLevel, isBigBossLevel, isMiniBossLevel, findSubZoneByLevel, formatNumber, findNextAvailableSpot } from './utils.js';
import { PERMANENT_UPGRADES } from './data/upgrades.js';

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
            baseId: itemBaseToDrop.id,
            width: itemBaseToDrop.width || 1, // Default to 1x1 if not defined
            height: itemBaseToDrop.height || 1
        };

        if (gameState.salvageFilter.autoSalvageGems) {
            const scrapGained = 100;
            gameState.scrap += scrapGained;
            logMessages.push({ message: `Auto-salvaged <span class="epic">${gem.name}</span> for ${scrapGained} scrap.`, class: '' });
            return { droppedItems: [], droppedGems: [], logMessages, events };
        }

        if (!gameState.gems) gameState.gems = [];
        const gemsToPlace = [gem];
        
        // Check for the Gem Find (duplication) bonus
        if (playerStats.gemFindChance > 0 && Math.random() * 100 < playerStats.gemFindChance) {
            const duplicateGem = {
                ...itemBaseToDrop,
                id: Date.now() + Math.random() + 1,
                baseId: itemBaseToDrop.id,
                width: itemBaseToDrop.width || 1,
                height: itemBaseToDrop.height || 1
            };
            gemsToPlace.push(duplicateGem);
            logMessages.push({ message: `Gem Find! You found a duplicate <span class="epic">${duplicateGem.name}</span>!`, class: '' });
            events.push('gemFind');
        }
        
        const placedGems = gameState.gems.filter(g => g.x !== undefined && g.x !== -1);
        gemsToPlace.forEach(newGem => {
            const spot = findNextAvailableSpot(newGem.width, newGem.height, placedGems);
            if (spot) {
                newGem.x = spot.x;
                newGem.y = spot.y;
                gameState.gems.push(newGem); // Add to state
                droppedGems.push(newGem); // Add to result for animation
                placedGems.push(newGem); // Add to temp list for this loop's collision check
            } else {
                 logMessages.push({ message: `Your gem pouch is full! A ${newGem.name} was lost.`, class: 'rare' });
            }
        });
        
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

    const spot = findNextAvailableSpot(item.width, item.height, gameState.inventory);
    
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
    
    if (isBigBossLevel(level)) { xpGained *= 3; baseGoldDrop *= 3; } 
    else if (isBossLevel(level)) { xpGained *= 2; baseGoldDrop *= 2; } 
    else if (isMiniBossLevel(level)) { xpGained *= 1.5; baseGoldDrop *= 1.5; }
    
    const goldMasteryLevel = gameState.permanentUpgrades.GOLD_MASTERY || 0;
    const goldMasteryBonus = PERMANENT_UPGRADES.GOLD_MASTERY.bonusPerLevel * goldMasteryLevel;
    let goldAfterMastery = baseGoldDrop * (1 + (goldMasteryBonus / 100));

    let finalGoldGained = Math.ceil(goldAfterMastery * (1 + (playerStats.bonusGold / 100)));
    xpGained = Math.ceil(xpGained);

    gameState.gold += finalGoldGained;

    const lootResult = (Math.random() * 100 < currentMonster.data.dropChance) ? dropLoot(currentMonster, gameState, playerStats) : { droppedItems: [], droppedGems: [], logMessages: [], events: [] };
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
    let initialSlimeSplitChance = 0;
    const equippedSword = gameState.equipment.sword;
    const swordBase = equippedSword ? ITEMS[equippedSword.baseId] : null;
    if (swordBase && swordBase.uniqueEffect === 'slimeSplit') initialSlimeSplitChance += 10;
    if (gameState.absorbedUniqueEffects && gameState.absorbedUniqueEffects['slimeSplit']) initialSlimeSplitChance += gameState.absorbedUniqueEffects['slimeSplit'] * 10;

    if (gameState.isSlimeSplitEnabled && initialSlimeSplitChance > 0 && Math.random() * 100 < initialSlimeSplitChance) {
        
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
            nextChance: initialSlimeSplitChance * 0.9,
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
 * Generates a new monster based on the current fighting level.
 */
export function generateMonster(level, specialEncounter = null) {
    let monsterData;
    let monsterHealth;

    const baseHealthFactor = 4;
    const healthPower = 2.6;

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

        // --- START OF FINAL HP SCALING LOGIC ---

        // 1. Base HP Calculation
        monsterHealth = (baseHealthFactor * Math.pow(level, healthPower));

        // 2. World Tier Multiplier (applies to all)
        const worldTier = Math.floor((level - 1) / 100);
        if (worldTier > 0) {
            const worldTierMultiplier = 1 + (worldTier * 6);
            monsterHealth *= worldTierMultiplier;
        }

        // 3. Compounding Realm Multiplier (applies to all monsters in higher realms)
        const realmIndex = Math.floor((level - 1) / 400);
        if (realmIndex > 0) {
            const realmJumpFactor = 8; // This is our main tuning knob for realm difficulty
            const realmMultiplier = Math.pow(realmJumpFactor, realmIndex);
            monsterHealth *= realmMultiplier;
        }

        // 4. Final Boss & Mini-Boss Multipliers
        if (isBigBossLevel(level)) {
            monsterHealth *= 15.546;
        } else if (isBossLevel(level)) {
            monsterHealth *= 6.287;
        } else if (isMiniBossLevel(level)) {
            monsterHealth *= 3.1123;
        }

        // 5. SPECIAL OVERRIDE for the first level of a new realm
        const isFirstLevelOfNewRealm = level > 1 && level % 400 === 1;
        if (isFirstLevelOfNewRealm) {
            const prevBossLevel = level - 1;
            
            // We must fully calculate the previous boss's HP using the exact same logic
            let prevBossHp = (baseHealthFactor * Math.pow(prevBossLevel, healthPower));
            
            const prevWorldTier = Math.floor((prevBossLevel - 1) / 100);
            if (prevWorldTier > 0) {
                prevBossHp *= (1 + (prevWorldTier * 6));
            }
            
            const prevRealmIndex = Math.floor((prevBossLevel - 1) / 400);
            if (prevRealmIndex > 0) {
                const realmJumpFactor = 8;
                prevBossHp *= Math.pow(realmJumpFactor, prevRealmIndex);
            }
            
            prevBossHp *= 15.546; // Big Boss multiplier

            const targetPercentage = 0.73737373;
            monsterHealth = prevBossHp * targetPercentage;
        }

        // --- END OF FINAL HP SCALING LOGIC ---
    }
    
    monsterHealth = Math.ceil(monsterHealth);
    
    const newMonster = { name: monsterData.name, data: monsterData };
    const newMonsterState = { hp: monsterHealth, maxHp: monsterHealth };
    
    return { newMonster, newMonsterState };
}