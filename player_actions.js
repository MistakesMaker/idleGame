// --- START OF FILE player_actions.js ---

import { rarities } from './game.js';
import { REALMS } from './data/realms.js';
import { getXpForNextLevel, getUpgradeCost, findEmptySpot, getRandomInt, findSubZoneByLevel, formatNumber } from './utils.js';
import { GEMS } from './data/gems.js';
import { ITEMS } from './data/items.js';
import { PERMANENT_UPGRADES } from './data/upgrades.js';
import { CONSUMABLES } from './data/consumables.js';
import { HUNT_POOLS } from './data/hunts.js';
import { MONSTERS } from './data/monsters.js';

/**
 * Finds an item by its ID from all possible sources (main inventory and all preset inventories).
 * @param {object} gameState - The main game state object.
 * @param {string} itemId - The ID of the item to find.
 * @returns {object|null} The found item object, or null.
 */
export function findItemFromAllSources(gameState, itemId) {
    // Check loose inventory first
    let item = gameState.inventory.find(i => String(i.id) === itemId);
    if (item) return item;

    // Check consumables inventory
    item = gameState.consumables.find(i => String(i.id) === itemId);
    if (item) return item;

    // Check all presets
    for (const preset of gameState.presets) {
        // Check equipped items in the preset
        for (const slot in preset.equipment) {
            const equippedItem = preset.equipment[slot];
            if (equippedItem && String(equippedItem.id) === itemId) {
                return equippedItem;
            }
        }
    }
    return null;
}

/**
 * Gets a flat array of all items the player owns, regardless of location.
 * @param {object} gameState - The main game state object.
 * @returns {Array<object>} An array of all item objects.
 */
export function getAllItems(gameState) {
    const allItems = [...gameState.inventory];
    const itemIds = new Set(allItems.map(i => i.id));

    for (const preset of gameState.presets) {
        for (const slot in preset.equipment) {
            const item = preset.equipment[slot];
            if (item && !itemIds.has(item.id)) {
                allItems.push(item);
                itemIds.add(item.id);
            }
        }
    }
    return allItems;
}

/**
 * Gets a Set of all item IDs that are equipped in any preset.
 * @param {object} gameState - The main game state object.
 * @returns {Set<any>} A Set containing the IDs of all equipped items.
 */
export function getAllEquippedItemIds(gameState) {
    const equippedIds = new Set();
    for (const preset of gameState.presets) {
        for (const slot in preset.equipment) {
            const item = preset.equipment[slot];
            if (item) {
                equippedIds.add(item.id);
            }
        }
    }
    return equippedIds;
}


/**
 * Re-packs the inventory to remove any gaps.
 * @param {Array<object>} inventory - The current inventory array.
 * @returns {Array<object>} The compacted inventory array.
 */
export function compactInventory(inventory) {
    const newInventory = [];
    // Sort items to ensure a consistent packing order (top-to-bottom, left-to-right)
    const sortedItems = [...inventory].sort((a, b) => {
        if (a.y !== b.y) return a.y - b.y;
        return a.x - b.x;
    });

    for (const item of sortedItems) {
        const spot = findEmptySpot(item.width, item.height, newInventory);
        if (spot) {
            item.x = spot.x;
            item.y = spot.y;
            newInventory.push(item);
        } else {
            // This should not happen in a compaction, but is a safe fallback
            console.error("Failed to find space during inventory compaction for item:", item);
            newInventory.push(item); // Add it anyway to prevent data loss
        }
    }
    return newInventory;
}

/**
 * Equips an item from the loose inventory.
 * @param {object} gameState - The main game state object.
 * @param {object} itemToEquip - The item object from the inventory to equip.
 * @returns {{isPendingRing: boolean, item: object|null, success: boolean, message: string}}
 */
export function equipItem(gameState, itemToEquip) {
    if (!itemToEquip) return { isPendingRing: false, item: null, success: false, message: "Invalid item." };

    // Find the item in the loose inventory.
    const inventoryItemIndex = gameState.inventory.findIndex(i => i.id === itemToEquip.id);
    if (inventoryItemIndex === -1) {
        return { isPendingRing: false, item: null, success: false, message: "Item not found in loose inventory. It might be part of another preset." };
    }

    let targetSlot = itemToEquip.type;
    const activePreset = gameState.presets[gameState.activePresetIndex];

    if (itemToEquip.type === 'ring') {
        if (!activePreset.equipment.ring1) targetSlot = 'ring1';
        else if (!activePreset.equipment.ring2) targetSlot = 'ring2';
        else {
            return { isPendingRing: true, item: itemToEquip, success: true, message: "Select a ring to replace." };
        }
    }

    const itemInSlot = activePreset.equipment[targetSlot];
    const [equippedItem] = gameState.inventory.splice(inventoryItemIndex, 1);
    
    // Place the previously worn item back into the loose inventory
    if (itemInSlot) {
        const spot = findEmptySpot(itemInSlot.width, itemInSlot.height, gameState.inventory);
        if (spot) {
            itemInSlot.x = spot.x;
            itemInSlot.y = spot.y;
            gameState.inventory.push(itemInSlot);
        } else {
            // Failsafe: push it anyway if no grid spot is found, though this shouldn't happen with a large grid.
            gameState.inventory.push(itemInSlot);
            console.error("No space in loose inventory for unequipped item!");
        }
    }
    
    activePreset.equipment[targetSlot] = equippedItem;
    gameState.inventory = compactInventory(gameState.inventory);
    
    return { isPendingRing: false, item: null, success: true, message: `Equipped ${equippedItem.name}.` };
}

/**
 * Equips a pending ring to a specific slot for the active preset.
 * @param {object} gameState - The main game state object.
 * @param {object} pendingRing - The ring item waiting to be equipped.
 * @param {string} targetSlot - The specific ring slot ('ring1' or 'ring2').
 */
export function equipRing(gameState, pendingRing, targetSlot) {
    const inventoryItemIndex = gameState.inventory.findIndex(i => i.id === pendingRing.id);
    if (inventoryItemIndex === -1) return;
    
    const activePreset = gameState.presets[gameState.activePresetIndex];
    const itemInSlot = activePreset.equipment[targetSlot];
    const [equippedItem] = gameState.inventory.splice(inventoryItemIndex, 1);

    if (itemInSlot) {
        const spot = findEmptySpot(itemInSlot.width, itemInSlot.height, gameState.inventory);
        if (spot) {
            itemInSlot.x = spot.x;
            itemInSlot.y = spot.y;
            gameState.inventory.push(itemInSlot);
        } else {
            gameState.inventory.push(itemInSlot);
            console.error("No space in loose inventory for unequipped ring!");
        }
    }
    activePreset.equipment[targetSlot] = equippedItem;
    gameState.inventory = compactInventory(gameState.inventory);
}


/**
 * Unequips an item from an equipment slot back to the loose inventory.
 */
export function unequipItem(gameState, slotName) {
    const activePreset = gameState.presets[gameState.activePresetIndex];
    const item = activePreset.equipment[slotName];
    if (!item) return;

    const spot = findEmptySpot(item.width, item.height, gameState.inventory);
    if (spot) {
        item.x = spot.x;
        item.y = spot.y;
        gameState.inventory.push(item);
        activePreset.equipment[slotName] = null;
    } else {
        alert("Cannot unequip item, inventory is full!");
    }
}

/**
 * Spends a specified number of attribute points on a given attribute.
 * @param {object} gameState The main game state object.
 * @param {string} attribute The attribute to increase ('strength', 'agility', 'luck').
 * @param {number | 'max'} amount The number of points to spend, or 'max' to spend all available points.
 */
export function spendMultipleAttributePoints(gameState, attribute, amount) {
    let pointsToSpend = 0;
    const availablePoints = gameState.hero.attributePoints;

    if (amount === 'max') {
        pointsToSpend = availablePoints;
    } else {
        pointsToSpend = Number(amount);
    }

    if (isNaN(pointsToSpend) || pointsToSpend <= 0) {
        return; // Invalid amount
    }

    // Don't spend more points than are available
    pointsToSpend = Math.min(pointsToSpend, availablePoints);

    if (pointsToSpend > 0) {
        gameState.hero.attributePoints -= pointsToSpend;
        gameState.hero.attributes[attribute] += pointsToSpend;
    }
}


/**
 * Adds experience to the hero, handling level-ups.
 */
export function gainXP(gameState, amount, bonusXpPercent = 0) {
    const finalAmount = Math.ceil(amount * (1 + (bonusXpPercent / 100)));
    const levelUpLogs = [];
    gameState.hero.xp += finalAmount;
    let xpToNextLevel = getXpForNextLevel(gameState.hero.level);

    while (gameState.hero.xp >= xpToNextLevel) {
        gameState.hero.xp -= xpToNextLevel;
        gameState.hero.level++;
        gameState.hero.attributePoints += 2;
        levelUpLogs.push(`Congratulations! You reached Level ${gameState.hero.level}!`);
        xpToNextLevel = getXpForNextLevel(gameState.hero.level);
    }
    return levelUpLogs;
}

/**
 * Buys a single gold upgrade.
 */
export function buyUpgrade(gameState, upgradeType, cost) {
    if (gameState.gold >= cost) {
        gameState.gold -= cost;
        gameState.upgrades[upgradeType]++;
        return { success: true, message: `Upgraded ${upgradeType} to level ${gameState.upgrades[upgradeType]}!` };
    } else {
        return { success: false, message: "Not enough gold!" };
    }
}

/**
 * Buys the maximum possible levels for a gold upgrade.
 */
export function buyMaxUpgrade(gameState, upgradeType) {
    let gold = gameState.gold;
    let currentLevel = gameState.upgrades[upgradeType];
    let levelsBought = 0;
    
    while (true) {
        const cost = getUpgradeCost(upgradeType, currentLevel);
        if (gold >= cost) {
            gold -= cost;
            currentLevel++;
            levelsBought++;
        } else {
            break; 
        }
    }

    if (levelsBought > 0) {
        gameState.gold = gold;
        gameState.upgrades[upgradeType] = currentLevel;
    }

    return { levelsBought };
}

/**
 * Salvages selected items for scrap.
 * @param {object} gameState - The main game state object.
 * @param {object} salvageMode - The salvage mode state, containing selections.
 * @param {object} playerStats - The calculated player stats, for scrap bonus.
 * @returns {{count: number, scrapGained: number}}
 */
export function salvageSelectedItems(gameState, salvageMode, playerStats) {
    if (salvageMode.selections.length === 0) {
        return { count: 0, scrapGained: 0 };
    }

    let totalScrapGained = 0;
    const selectedCount = salvageMode.selections.length;
    const idsToSalvage = new Set(salvageMode.selections.map(item => item.id));

    salvageMode.selections.forEach(item => {
        const rarityIndex = rarities.indexOf(item.rarity);
        totalScrapGained += Math.ceil(Math.pow(3, rarityIndex));
    });
    
    totalScrapGained = Math.floor(totalScrapGained * playerStats.scrapBonus);
    
    // Remove from loose inventory
    gameState.inventory = gameState.inventory.filter(item => !idsToSalvage.has(item.id));
    
    // Remove from all preset equipment slots
    for (const preset of gameState.presets) {
        for (const slot in preset.equipment) {
            if (preset.equipment[slot] && idsToSalvage.has(preset.equipment[slot].id)) {
                preset.equipment[slot] = null;
            }
        }
    }

    gameState.scrap += totalScrapGained;

    // Compact the loose inventory after salvaging
    gameState.inventory = compactInventory(gameState.inventory);

    return { count: selectedCount, scrapGained: totalScrapGained };
}

/**
 * Salvages all non-locked items of a specific rarity.
 * @param {object} gameState - The main game state object.
 * @param {string} rarityToSalvage - The rarity to salvage.
 * @param {object} playerStats - The calculated player stats, for scrap bonus.
 */
export function salvageByRarity(gameState, rarityToSalvage, playerStats) {
    let scrapGained = 0;
    let itemsSalvagedCount = 0;
    
    const equippedIds = getAllEquippedItemIds(gameState);
    
    // Filter loose inventory
    const itemsToKeepInInventory = [];
    gameState.inventory.forEach(item => {
        if (item.rarity === rarityToSalvage && !item.locked && !equippedIds.has(item.id)) {
            const rarityIndex = rarities.indexOf(item.rarity);
            scrapGained += Math.ceil(Math.pow(3, rarityIndex));
            itemsSalvagedCount++;
        } else {
            itemsToKeepInInventory.push(item);
        }
    });
    gameState.inventory = itemsToKeepInInventory;
    
    if (itemsSalvagedCount > 0) {
        scrapGained = Math.floor(scrapGained * playerStats.scrapBonus);
        gameState.scrap += scrapGained;
        // Compact the loose inventory after salvaging
        gameState.inventory = compactInventory(gameState.inventory);
    }
    
    return { count: itemsSalvagedCount, scrapGained };
}


/**
 * Toggles the lock state of an inventory item.
 * @param {object} gameState - The main game state object.
 * @param {object} itemToToggle - The item object to lock/unlock.
 * @returns {string} A message describing the action.
 */
export function toggleItemLock(gameState, itemToToggle) {
    if (itemToToggle) {
        itemToToggle.locked = !itemToToggle.locked;
        return `Item ${itemToToggle.name} ${itemToToggle.locked ? 'locked' : 'unlocked'}.`;
    }
    return "Could not find item to toggle lock.";
}

/**
 * Activates a given equipment preset, swapping all gear.
 */
export function activatePreset(gameState, presetIndex) {
    if (presetIndex === gameState.activePresetIndex) return;

    // The currently active preset (which is also gameState.equipment) is now the "old" one.
    const oldPreset = gameState.presets[gameState.activePresetIndex];
    const newPreset = gameState.presets[presetIndex];

    // No changes needed to the "old" preset's inventory, its gear is already stored correctly.

    // Set the new active preset and update the master equipment reference
    gameState.activePresetIndex = presetIndex;
    gameState.equipment = newPreset.equipment;
}

/**
 * Attempts to combine two identical-tier gems into a new, higher-tier gem.
 * @param {object} gameState The main game state object.
 * @param {Array<object>} craftingGems An array of the two gems being combined.
 * @returns {{success: boolean, message: string, newGem: object|null}}
 */
export function combineGems(gameState, craftingGems) {
    const cost = 100;
    if (gameState.scrap < cost) {
        return { success: false, message: "Not enough Scrap to combine.", newGem: null };
    }

    const [gem1, gem2] = craftingGems;
    
    if (!gem1 || !gem2 || gem1.tier !== gem2.tier) {
        return { success: false, message: "You must combine two gems of the same tier.", newGem: null };
    }
    
    gameState.scrap -= cost;
    const id1 = gem1.id;
    const id2 = gem2.id;
    gameState.gems = gameState.gems.filter(g => g.id !== id1 && g.id !== id2);

    let successChance = 0.5;
    if (gem1.tier === 1 && gameState.artisanChiselUsed) {
        successChance = 0.6;
    }

    if (Math.random() < successChance) {
        // SUCCESS
        const newTier = gem1.tier + 1;
        const newStats = {};
        let newSynergy = null;

        [gem1, gem2].forEach(parentGem => {
            if (parentGem.stats) {
                for (const statKey in parentGem.stats) {
                    newStats[statKey] = (newStats[statKey] || 0) + parentGem.stats[statKey];
                }
            }
            if (parentGem.synergy) {
                if (!newSynergy) {
                    newSynergy = { ...parentGem.synergy };
                } else {
                    newSynergy.value += parentGem.synergy.value;
                }
            }
        });

        const newGem = {
            id: Date.now() + Math.random(),
            baseId: `FUSED_T${newTier}`,
            name: `T${newTier} Fused Gem`,
            tier: newTier,
            icon: `images/gems/fused_t${newTier}.png`,
            width: 1, height: 1,
            stats: newStats,
            synergy: newSynergy
        };
        
        gameState.gems.push(newGem);

        return { success: true, message: `Success! You fused a ${newGem.name}!`, newGem: newGem };
    } else {
        // FAILURE
        return { success: true, message: "The gems shattered... you lost everything.", newGem: null };
    }
}


/**
 * Automatically combines all matching gems of a given tier and stat.
 * @param {object} gameState - The main game state object.
 * @param {number} tier - The tier of gems to combine.
 * @param {string} selectionKey - The stat key or a special key (like 'synergy_dps_to_clickDamage') of gems to combine.
 * @param {Set<any>} excludedIds - A set of gem IDs to exclude from this operation.
 * @returns {{success: boolean, message: string, successes: number, failures: number, cost: number}}
 */
export function bulkCombineGems(gameState, tier, selectionKey, excludedIds) {
    const costPerCombine = 100;
    const isSynergyCombine = selectionKey.startsWith('synergy_');
    
    const matchingGems = gameState.gems.filter(gem => {
        if (gem.tier !== tier || excludedIds.has(gem.id)) {
            return false;
        }
        if (isSynergyCombine) {
            const synergyKey = selectionKey.replace('synergy_', '');
            return gem.synergy && `${gem.synergy.source}_to_${gem.synergy.target}` === synergyKey;
        } else {
            return gem.stats && gem.stats[selectionKey];
        }
    });

    if (matchingGems.length < 2) {
        return { success: false, message: "Not enough matching gems to combine.", successes: 0, failures: 0, cost: 0 };
    }

    let successes = 0;
    let failures = 0;
    let totalCost = 0;
    const gemsToCombine = [...matchingGems];
    const newGems = [];
    const usedGemIds = new Set();
    
    let successChance = 0.5;
    if (tier === 1 && gameState.artisanChiselUsed) {
        successChance = 0.6;
    }

    while (gemsToCombine.length >= 2) {
        if (gameState.scrap < costPerCombine) {
            break; // Stop if we can't afford the next one
        }

        const gem1 = gemsToCombine.shift();
        const gem2 = gemsToCombine.shift();
        
        gameState.scrap -= costPerCombine;
        totalCost += costPerCombine;
        usedGemIds.add(gem1.id);
        usedGemIds.add(gem2.id);

        if (Math.random() < successChance) {
            successes++;
            const newTier = gem1.tier + 1;
            const newStats = {};
            let newSynergy = null;

            [gem1, gem2].forEach(parentGem => {
                if (parentGem.stats) {
                    for (const key in parentGem.stats) {
                        newStats[key] = (newStats[key] || 0) + parentGem.stats[key];
                    }
                }
                if (parentGem.synergy) {
                    if (!newSynergy) newSynergy = { ...parentGem.synergy };
                    else newSynergy.value += parentGem.synergy.value;
                }
            });

            newGems.push({
                id: Date.now() + Math.random() + successes,
                baseId: `FUSED_T${newTier}`,
                name: `T${newTier} Fused Gem`,
                tier: newTier,
                icon: `images/gems/fused_t${newTier}.png`,
                width: 1, height: 1,
                stats: newStats,
                synergy: newSynergy
            });
        } else { // Failure
            failures++;
        }
    }

    // Update the main gem list
    gameState.gems = gameState.gems.filter(g => !usedGemIds.has(g.id));
    gameState.gems.push(...newGems);

    const message = `Bulk combine finished. Successes: ${successes}, Failures: ${failures}. Total cost: ${totalCost} Scrap.`;
    return { success: true, message, successes, failures, cost: totalCost };
}


/**
 * Rerolls a single selected stat on a given item.
 * @param {object} gameState The main game state object.
 * @param {object} itemToReroll The item object to be rerolled.
 * @param {string} statToRerollKey The key of the stat to reroll.
 * @returns {{success: boolean, improvement: number}}
 */
export function rerollItemStats(gameState, itemToReroll, statToRerollKey) {
    const cost = 500;
    if (gameState.scrap < cost) {
        return { success: false, improvement: 0 };
    }

    if (!itemToReroll || !itemToReroll.baseId || !statToRerollKey) {
        return { success: false, improvement: 0 };
    }

    const itemBase = ITEMS[itemToReroll.baseId];
    if (!itemBase) {
        return { success: false, improvement: 0 };
    }
    
    const statDefinition = itemBase.possibleStats.find(p => p.key === statToRerollKey);
    if (!statDefinition) {
        return { success: false, improvement: 0 };
    }

    const rarityIndex = rarities.indexOf(itemToReroll.rarity);
    const total_stat_range = statDefinition.max - statDefinition.min;
    const range_per_tier = total_stat_range / rarities.length;
    const max_for_tier = statDefinition.min + (range_per_tier * (rarityIndex + 1));
    const currentValue = itemToReroll.stats[statToRerollKey];

    if (currentValue >= max_for_tier - 0.001) {
        return { success: false, improvement: 0 };
    }

    gameState.scrap -= cost;

    if (Math.random() < 0.5) {
        return { success: true, improvement: 0 };
    }

    const gap = max_for_tier - currentValue;
    const improvementFactor = Math.random();
    const improvementAmount = gap * improvementFactor;
    
    const newValue = currentValue + improvementAmount;
    
    itemToReroll.stats[statToRerollKey] = parseFloat(newValue.toFixed(2));

    return { success: true, improvement: parseFloat(improvementAmount.toFixed(2)) };
}

/**
 * Buys a level of a permanent upgrade.
 * @param {object} gameState The main game state object.
 * @param {string} upgradeId The ID of the upgrade to purchase.
 * @returns {{success: boolean, message: string, newLevel: number|null}}
 */
export function buyPermanentUpgrade(gameState, upgradeId) {
    // Legacy Keeper is handled separately in game.js via a modal
    if (upgradeId === 'LEGACY_KEEPER') {
        return { success: false, message: "This upgrade must be chosen from its special menu.", newLevel: null };
    }

    const upgrade = PERMANENT_UPGRADES[upgradeId];
    if (!upgrade) {
        return { success: false, message: "Upgrade not found.", newLevel: null };
    }

    const currentLevel = gameState.permanentUpgrades[upgradeId] || 0;
    if (currentLevel >= upgrade.maxLevel) {
        return { success: false, message: "This upgrade is already at its max level.", newLevel: null };
    }

    const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costScalar, currentLevel));
    if (gameState.gold < cost) {
        return { success: false, message: "Not enough gold!", newLevel: null };
    }

    gameState.gold -= cost;
    gameState.permanentUpgrades[upgradeId]++;
    
    return { success: true, message: `Purchased ${upgrade.name}!`, newLevel: gameState.permanentUpgrades[upgradeId] };
}

/**
 * Consumes an item, applying its effect and removing it from the player's possession.
 * @param {object} gameState - The main game state object.
 * @param {string|number} itemId - The ID of the consumable item to use.
 * @returns {{success: boolean, message: string}}
 */
export function consumeItem(gameState, itemId) {
    const itemIndex = gameState.consumables.findIndex(c => c.id === itemId);
    if (itemIndex === -1) {
        return { success: false, message: "Consumable item not found." };
    }

    const item = gameState.consumables[itemIndex];
    const itemBase = CONSUMABLES[item.baseId];
    if (!itemBase || !itemBase.effect) {
        return { success: false, message: "Item has no defined effect." };
    }

    const effect = itemBase.effect;
    let message = `You consumed the ${item.name}!`;

    // Dispatcher for different effect types
    switch (effect.type) {
        case 'permanentFlag':
            if (gameState[effect.key]) {
                return { success: false, message: "You have already gained this permanent effect." };
            }
            gameState[effect.key] = true;
            break;

    case 'timedBuff':
        const existingBuff = gameState.activeBuffs.find(b => b.name === effect.name);
        const newExpiresAt = Date.now() + (effect.duration * 1000);

        if (existingBuff) {
            // If the buff already exists, just refresh its timer.
            existingBuff.expiresAt = newExpiresAt;
            message = `You refreshed the duration of <b>${effect.name}</b>!`;
        } else {
            // Otherwise, add the new buff.
            gameState.activeBuffs.push({ ...effect, expiresAt: newExpiresAt });
            message = `You feel the effects of <b>${effect.name}</b>!`;
        }
    break;   


        case 'resource':
            gameState[effect.resource] = (gameState[effect.resource] || 0) + effect.amount;
            message = `You gained <b>${formatNumber(effect.amount)} ${effect.resource.charAt(0).toUpperCase() + effect.resource.slice(1)}</b>!`;
            break;

        default:
            return { success: false, message: "Unknown consumable effect type." };
    }

    // --- START OF MODIFICATION ---
    // Handle stacking logic
    if (item.quantity && item.quantity > 1) {
        item.quantity--;
    } else {
        // Remove the item from the consumables array if it's the last one
        gameState.consumables.splice(itemIndex, 1);
        // Compact the consumables grid
        gameState.consumables = compactInventory(gameState.consumables);
    }
    // --- END OF MODIFICATION ---

    return { success: true, message };
}

// ===================================
// --- HUNTS SYSTEM LOGIC ---
// ===================================

/**
 * Generates a new hunt to fill an empty slot on the board.
 * Uses a weighted system based on the player's current progress.
 * @param {object} gameState
 * @param {number} indexToReplace The index in the `available` array to fill.
 * @param {object[]} huntPools The full definition of all possible hunts.
 */
export function generateNewHunt(gameState, indexToReplace, huntPools) {
    const currentHighPoint = gameState.currentRunCompletedLevels.length > 0 ? Math.max(...gameState.currentRunCompletedLevels) : 1;

    // 1. Find all tiers the player has unlocked in this run
    const availableTiers = huntPools.filter(tier => currentHighPoint >= tier.requiredLevel);
    if (availableTiers.length === 0) return;

    // 2. Assign weights based on proximity to the player's current tier
    const currentTierIndex = availableTiers.length - 1;
    const tierWeights = [
        { tierIndex: currentTierIndex, weight: 50 },
        { tierIndex: currentTierIndex - 1, weight: 35 },
        { tierIndex: currentTierIndex - 2, weight: 15 }, 
    ];

    const validWeightedTiers = tierWeights.filter(t => t.tierIndex >= 0);

    // 3. Roll to select a tier
    const roll = Math.random() * 100;
    let selectedTierIndex;
    let cumulativeWeight = 0;

    for (const tier of validWeightedTiers) {
        cumulativeWeight += tier.weight;
        if (roll <= cumulativeWeight) {
            if (tier.tierIndex === currentTierIndex - 2) {
                // If we landed in the "all older tiers" bucket, pick one of them randomly
                selectedTierIndex = getRandomInt(0, Math.max(0, currentTierIndex - 2));
            } else {
                selectedTierIndex = tier.tierIndex;
            }
            break;
        }
    }
    
    if (selectedTierIndex === undefined) {
        selectedTierIndex = currentTierIndex;
    }

    const chosenTierPool = availableTiers[selectedTierIndex].hunts;
    
    // 4. Select a random hunt from the chosen tier, avoiding duplicates
    const availableHuntIds = gameState.hunts.available.map(h => h ? h.id : null);
    let potentialHunts = chosenTierPool.filter(hunt => !availableHuntIds.includes(hunt.id));
    
    if (potentialHunts.length === 0) {
        const allAvailableHunts = availableTiers.flatMap(t => t.hunts);
        potentialHunts = allAvailableHunts.filter(hunt => !availableHuntIds.includes(hunt.id));
        if (potentialHunts.length === 0) return; 
    }

    const huntTemplate = { ...potentialHunts[Math.floor(Math.random() * potentialHunts.length)] };

    // 5. Calculate dynamic quantity
    const completionCount = gameState.hunts.completionCounts[huntTemplate.id] || 0;
    const completionBonus = completionCount * 10;
    const quantity = getRandomInt(huntTemplate.quantityMin + completionBonus, huntTemplate.quantityMax + completionBonus);

    // 6. Create the final hunt object for the game state
    const chosenRewardId = huntTemplate.rewardIds[Math.floor(Math.random() * huntTemplate.rewardIds.length)];

    const newHunt = {
        ...huntTemplate,
        quantity: quantity,
        rewardId: chosenRewardId, // Set the specific, chosen reward for this instance
        instanceId: Date.now() + Math.random(),
    };

    gameState.hunts.available[indexToReplace] = newHunt;
}

/**
 * Sets an available hunt as the player's active hunt.
 * @param {object} gameState
 * @param {number} index The index of the hunt in the `available` array.
 * @returns {boolean} True if successful.
 */
export function acceptHunt(gameState, index) {
    if (gameState.hunts.active || !gameState.hunts.available[index]) {
        return false;
    }
    gameState.hunts.active = gameState.hunts.available[index];
    gameState.hunts.available[index] = null;
    gameState.hunts.progress = 0;
    return true;
}

/**
 * Checks if a defeated monster contributes to the active hunt.
 * @param {object} gameState
 * @param {object} defeatedMonster - The `currentMonster` object.
 */
export function checkHuntProgress(gameState, defeatedMonster) {
    const activeHunt = gameState.hunts.active;
    if (!activeHunt || gameState.hunts.progress >= activeHunt.quantity) return;

    let isMatch = false;
    const monsterId = Object.keys(MONSTERS).find(key => MONSTERS[key] === defeatedMonster.data);

    switch (activeHunt.type) {
        case 'kill_specific':
            if (monsterId === activeHunt.target) {
                isMatch = true;
            }
            break;
        case 'kill_category':
            const subZone = findSubZoneByLevel(gameState.currentFightingLevel);
            const realm = subZone ? REALMS.find(r => Object.values(r.zones).includes(subZone.parentZone)) : null;
            const zoneId = realm ? Object.keys(realm.zones).find(id => realm.zones[id] === subZone.parentZone) : null;

            let conditionsMet = 0;
            let conditionsRequired = Object.keys(activeHunt.target).length;

            if (activeHunt.target.isBoss && defeatedMonster.data.isBoss) conditionsMet++;
            if (activeHunt.target.realm && realm && realm.name === activeHunt.target.realm) conditionsMet++;
            if (activeHunt.target.zoneId && zoneId === activeHunt.target.zoneId) conditionsMet++;
            if (activeHunt.target.nameContains && defeatedMonster.name.includes(activeHunt.target.nameContains)) conditionsMet++;
            
            if (conditionsMet === conditionsRequired) {
                isMatch = true;
            }
            break;
    }

    if (isMatch) {
        gameState.hunts.progress++;
    }
}

/**
 * Completes the active hunt, grants the reward, and clears the active slot.
 * @param {object} gameState
 * @returns {object|null} The reward consumable object if successful.
 */
export function completeHunt(gameState) {
    const activeHunt = gameState.hunts.active;
    if (!activeHunt || gameState.hunts.progress < activeHunt.quantity) {
        return null;
    }

    // Grant reward
    const rewardBase = CONSUMABLES[activeHunt.rewardId];
    
    // --- START OF MODIFICATION ---
    // Check for an existing stack
    const existingStack = gameState.consumables.find(c => c.baseId === rewardBase.id);

    if (existingStack) {
        existingStack.quantity = (existingStack.quantity || 1) + 1;
    } else {
        const rewardItem = {
            ...rewardBase,
            id: Date.now() + Math.random(),
            baseId: rewardBase.id,
            quantity: 1, // Start the stack
        };
        gameState.consumables.push(rewardItem);
        gameState.consumables = compactInventory(gameState.consumables);
    }
    // --- END OF MODIFICATION ---
    
    if (!gameState.unlockedFeatures.consumables) {
        gameState.unlockedFeatures.consumables = true;
        gameState.pendingSubTabViewFlash = 'inventory-consumables-view'; // Flag for the UI to flash the correct sub-tab
    }

    // Update completion count
    const count = gameState.hunts.completionCounts[activeHunt.id] || 0;
    gameState.hunts.completionCounts[activeHunt.id] = count + 1;

    // Clear active hunt
    gameState.hunts.active = null;
    gameState.hunts.progress = 0;
    
    // --- MODIFICATION: Return the base definition for the log message, since we might not have created a new item ---
    return rewardBase;
}

/**
 * Spends a reroll charge to replace all available hunts.
 * @param {object} gameState
 * @returns {boolean} True if successful.
 */
export function rerollHunts(gameState) {
    if (gameState.hunts.dailyRerollsLeft <= 0) {
        return false;
    }
    gameState.hunts.dailyRerollsLeft--;
    for (let i = 0; i < gameState.hunts.available.length; i++) {
        // Only replace unaccepted hunts
        if (gameState.hunts.available[i]) {
            generateNewHunt(gameState, i, HUNT_POOLS);
        }
    }
    return true;
}

/**
 * Checks if the daily reroll reset timestamp has passed and resets if needed.
 * @param {object} gameState
 */
export function checkDailyResets(gameState) {
    const now = new Date();
    const lastReset = gameState.hunts.lastRerollTimestamp ? new Date(gameState.hunts.lastRerollTimestamp) : null;

    if (!lastReset || lastReset.getUTCDay() !== now.getUTCDay()) {
        gameState.hunts.dailyRerollsLeft = 5;
        gameState.hunts.lastRerollTimestamp = now.getTime();
    }
}