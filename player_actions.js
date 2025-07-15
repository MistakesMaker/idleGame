// --- START OF FILE player_actions.js ---

import { rarities } from './game.js';
import { REALMS } from './data/realms.js';
import { getXpForNextLevel, getUpgradeCost, findEmptySpot } from './utils.js';
import { GEMS } from './data/gems.js';
import { ITEMS } from './data/items.js';
import { PERMANENT_UPGRADES } from './data/upgrades.js';

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
export function gainXP(gameState, amount) {
    const levelUpLogs = [];
    gameState.hero.xp += amount;
    let xpToNextLevel = getXpForNextLevel(gameState.hero.level);

    while (gameState.hero.xp >= xpToNextLevel) {
        gameState.hero.xp -= xpToNextLevel;
        gameState.hero.level++;
        gameState.hero.attributePoints += 2; // MODIFIED
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
 * Buys a loot crate with scrap.
 */
export function buyLootCrate(gameState, generateItemFn) {
    const cost = 50;
    if (gameState.scrap < cost) {
        return { success: false, message: "Not enough Scrap!", item: null };
    }

    const currentRealmData = REALMS[gameState.currentRealmIndex];
    if (!currentRealmData) {
         return { success: false, message: "Error: Could not find current realm data.", item: null };
    }

    const realmMonsters = new Set();
    for (const zoneId in currentRealmData.zones) {
        const zone = currentRealmData.zones[zoneId];
        for (const subZoneId in zone.subZones) {
            const subZone = zone.subZones[subZoneId];
            if (gameState.completedLevels.some(lvl => lvl >= subZone.levelRange[0] && lvl <= subZone.levelRange[1])) {
                subZone.monsterPool.forEach(monster => realmMonsters.add(monster));
            }
        }
    }

    const availableItems = [];
    realmMonsters.forEach(monster => {
        if (monster.lootTable) {
            monster.lootTable.forEach(lootEntry => {
                if (!lootEntry.item.isUnique) {
                    availableItems.push(lootEntry.item);
                }
            });
        }
    });

    if (availableItems.length === 0) {
        return { success: false, message: "No available items in loot crate! Defeat more monsters in this realm to unlock their drops.", item: null };
    }

    gameState.scrap -= cost;
    const itemBase = availableItems[Math.floor(Math.random() * availableItems.length)];
    const rarityRoll = Math.floor(Math.random() * (rarities.length - 1)) + 1;
    const rarity = rarities[rarityRoll];
    const item = generateItemFn(rarity, gameState.maxLevel, itemBase);
    
    const spot = findEmptySpot(item.width, item.height, gameState.inventory);
    if (spot) {
        item.x = spot.x;
        item.y = spot.y;
        gameState.inventory.push(item);
        return { success: true, message: `Bought a loot crate for ${cost} Scrap!`, item };
    } else {
        gameState.scrap += cost;
        return { success: false, message: "Not enough space in your inventory for the item from the crate!", item: null };
    }
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
        totalScrapGained += Math.ceil(Math.pow(4, rarityIndex));
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
            scrapGained += Math.ceil(Math.pow(4, rarityIndex));
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

    if (Math.random() < 0.5) {
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

        if (Math.random() < 0.5) { // Success
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
 * @returns {{success: boolean, message: string, improvement: number}}
 */
export function rerollItemStats(gameState, itemToReroll, statToRerollKey) {
    const cost = 500;
    if (gameState.scrap < cost) {
        return { success: false, message: "Not enough Scrap to enhance!", improvement: 0 };
    }

    if (!itemToReroll || !itemToReroll.baseId || !statToRerollKey) {
        return { success: false, message: "Invalid item or stat selected.", improvement: 0 };
    }

    const itemBase = ITEMS[itemToReroll.baseId];
    if (!itemBase) {
        return { success: false, message: `Could not find base definition for ${itemToReroll.name}.`, improvement: 0 };
    }
    
    const statDefinition = itemBase.possibleStats.find(p => p.key === statToRerollKey);
    if (!statDefinition) {
        return { success: false, message: "Stat is not a valid rerollable stat for this item.", improvement: 0 };
    }

    const rarityIndex = rarities.indexOf(itemToReroll.rarity);
    const total_stat_range = statDefinition.max - statDefinition.min;
    const range_per_tier = total_stat_range / rarities.length;
    const max_for_tier = statDefinition.min + (range_per_tier * (rarityIndex + 1));
    const currentValue = itemToReroll.stats[statToRerollKey];

    if (currentValue >= max_for_tier - 0.001) {
        return { success: false, message: "This stat is already at its maximum value for this rarity!", improvement: 0 };
    }

    // Pay the cost
    gameState.scrap -= cost;

    // First Roll: 50/50 chance to improve
    if (Math.random() < 0.5) {
        // 50% chance to fail
        return { success: true, message: "The enhancement failed. The stat remains unchanged.", improvement: 0 };
    }

    // Success! Proceed to the second roll for improvement amount.
    const gap = max_for_tier - currentValue;
    const improvementFactor = Math.random(); // A random percentage from 0% to 100%
    const improvementAmount = gap * improvementFactor;
    
    const newValue = currentValue + improvementAmount;
    
    itemToReroll.stats[statToRerollKey] = parseFloat(newValue.toFixed(2));

    return { success: true, message: `Enhancement successful!`, improvement: parseFloat(improvementAmount.toFixed(2)) };
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