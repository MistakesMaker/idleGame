// --- START OF FILE player_actions.js ---

import { rarities } from './game.js';
import { REALMS } from './data/realms.js';
import { getXpForNextLevel, getUpgradeCost, findEmptySpot, getRandomInt, findSubZoneByLevel, formatNumber, findNextAvailableSpot } from './utils.js';
import { GEMS } from './data/gems.js';
import { ITEMS } from './data/items.js';
import { PERMANENT_UPGRADES } from './data/upgrades.js';
import { CONSUMABLES } from './data/consumables.js';
import { HUNT_POOLS } from './data/hunts.js';
import { HUNT_SHOP_INVENTORY } from './data/hunt_shop.js';
import { MONSTERS } from './data/monsters.js';
import { playSound } from './sound_manager.js';


/**
 * Helper function to deeply compare two gems to see if they can be stacked.
 * @param {object} gemA - The first gem object.
 * @param {object} gemB - The second gem object.
 * @returns {boolean} True if the gems are identical enough to stack.
 */
function areGemsStackable(gemA, gemB) {
    if (gemA.tier !== gemB.tier) return false;

    // Handle base T1 gems that just use baseId
    if (gemA.tier === 1 && gemA.baseId === gemB.baseId) {
        return true;
    }

    // Handle fused gems by comparing stats and synergy
    const statsA = gemA.stats || {};
    const statsB = gemB.stats || {};
    const keysA = Object.keys(statsA);
    const keysB = Object.keys(statsB);

    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
        if (statsA[key] !== statsB[key]) return false;
    }

    const synergyA = gemA.synergy;
    const synergyB = gemB.synergy;

    if (!synergyA && !synergyB) return true; // Both have no synergy
    if (synergyA && synergyB) {
        return synergyA.source === synergyB.source &&
               synergyA.target === synergyB.target &&
               synergyA.value === synergyB.value;
    }
    
    return false; // One has synergy and the other doesn't
}


/**
 * Adds an item (consumable or gem) to the correct inventory, handling stacking.
 * @param {object} gameState The main game state object.
 * @param {object} itemBase The base definition of the item to add.
 * @param {'consumables' | 'gems'} inventoryType The key for the inventory array in gameState.
 * @returns {object} The stack that was added to or created.
 */
export function addToPlayerStacks(gameState, itemBase, inventoryType) {
    const inventory = gameState[inventoryType];
    let targetStack = null;

    if (inventoryType === 'gems') {
        // Use the advanced comparison for gems
        targetStack = inventory.find(stack => 
            (stack.quantity || 1) < 99 && areGemsStackable(stack, itemBase)
        );
    } else {
        // Use simple baseId check for consumables
        targetStack = inventory.find(stack => 
            stack.baseId === itemBase.id && (stack.quantity || 1) < 99
        );
    }

    if (targetStack) {
        // Add to the existing stack
        targetStack.quantity = (targetStack.quantity || 1) + 1;
    } else {
        // Create a new stack
        targetStack = {
            ...itemBase,
            id: Date.now() + Math.random(), // Unique ID for the stack itself
            baseId: itemBase.id || itemBase.baseId, // Fused gems won't have an ID, but will have a baseId
            quantity: 1,
        };
        // --- THIS IS THE CORRECTED LOGIC ---
        // It now correctly finds the first available spot even if existing items have no position data.
        const spot = findNextAvailableSpot(itemBase.width || 1, itemBase.height || 1, inventory);
        if (spot) {
            targetStack.x = spot.x;
            targetStack.y = spot.y;
        } else {
            console.error(`No space found for new ${inventoryType} stack!`);
            targetStack.x = -1; // Failsafe
            targetStack.y = -1; // Failsafe
        }
        // --- END OF CORRECTION ---
        inventory.push(targetStack);
    }
    return targetStack;
}


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
 * Plays the appropriate equipment sound based on item type.
 * @param {string} itemType The `type` property of the item.
 */
function playEquipSound(itemType) {
    const type = itemType.replace(/\d/g, ''); // Removes numbers from 'ring1', 'ring2'
    switch (type) {
        case 'sword':
            playSound('equip_weapon');
            break;
        case 'ring':
        case 'necklace':
            playSound('equip_jewelry');
            break;
        case 'helmet':
        case 'platebody':
        case 'platelegs':
        case 'shield':
        case 'belt':
            playSound('equip_armor');
            break;
        default:
            // Fallback for any new types
            playSound('equip_armor');
            break;
    }
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
    
    playEquipSound(equippedItem.type);
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
    playEquipSound('ring');
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
        playEquipSound(item.type);
        gameState.inventory = compactInventory(gameState.inventory); 
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
        playSound('salvage');
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
 * @param {object} gem1 A temporary instance of the first gem.
 * @param {object} gem2 A temporary instance of the second gem.
 * @returns {{success: boolean, message: string, newGem: object|null}}
 */
export function combineGems(gameState, gem1, gem2) {
    const cost = 100;
    if (gameState.scrap < cost) {
        // Since the gems were already removed from the inventory, we must return them on failure.
        addToPlayerStacks(gameState, gem1, 'gems');
        addToPlayerStacks(gameState, gem2, 'gems');
        return { success: false, message: "Not enough Scrap to combine.", newGem: null };
    }

    if (!gem1 || !gem2 || gem1.tier !== gem2.tier) {
        // This is a failsafe; the UI should prevent this. Return gems to inventory.
        addToPlayerStacks(gameState, gem1, 'gems');
        addToPlayerStacks(gameState, gem2, 'gems');
        return { success: false, message: "You must combine two gems of the same tier.", newGem: null };
    }
    
    gameState.scrap -= cost;

    let successChance = 0.5;
    // START OF MODIFICATION
    if (gem1.tier <= 4 && gameState.wisdomOfTheOverworldUsed) {
        successChance = 0.6;
    } else if (gem1.tier >= 5 && gem1.tier <= 8 && gameState.wisdomOfTheUnderdarkUsed) {
        successChance = 0.6;
    }
    // END OF MODIFICATION

    if (Math.random() < successChance) {
        // SUCCESS
        playSound('gem_success');
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

        const newGemBase = {
            baseId: `FUSED_T${newTier}`,
            name: `T${newTier} Fused Gem`,
            tier: newTier,
            icon: `images/gems/fused_t${newTier}.png`,
            width: 1, height: 1,
            stats: newStats,
            synergy: newSynergy
        };
        
        const newGemStack = addToPlayerStacks(gameState, newGemBase, 'gems');

        return { success: true, message: `Success! You fused a ${newGemStack.name}!`, newGem: newGemStack };
    } else {
        // FAILURE
        playSound('gem_fail');
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
        let totalQuantity = 0;
        matchingGems.forEach(stack => totalQuantity += stack.quantity);
        if (totalQuantity < 2) {
            return { success: false, message: "Not enough matching gems to combine.", successes: 0, failures: 0, cost: 0 };
        }
    }

    let successes = 0;
    let failures = 0;
    let totalCost = 0;
    
    let successChance = 0.5;
    // START OF MODIFICATION
    if (tier <= 4 && gameState.wisdomOfTheOverworldUsed) {
        successChance = 0.6;
    } else if (tier >= 5 && tier <= 8 && gameState.wisdomOfTheUnderdarkUsed) {
        successChance = 0.6;
    }

    let individualGems = [];
    matchingGems.forEach(stack => {
        for (let i = 0; i < stack.quantity; i++) {
            individualGems.push({ ...stack, quantity: 1 });
        }
    });

    const idsToRemove = new Set(matchingGems.map(s => s.id));
    gameState.gems = gameState.gems.filter(g => !idsToRemove.has(g.id));

    while (individualGems.length >= 2) {
        if (gameState.scrap < costPerCombine) {
            break; 
        }

        const gem1 = individualGems.pop();
        const gem2 = individualGems.pop();
        
        gameState.scrap -= costPerCombine;
        totalCost += costPerCombine;

        if (Math.random() < successChance) {
            successes++;
            const newTier = tier + 1;
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

            const newGemBase = {
                baseId: `FUSED_T${newTier}`,
                name: `T${newTier} Fused Gem`,
                tier: newTier,
                icon: `images/gems/fused_t${newTier}.png`,
                width: 1, height: 1,
                stats: newStats,
                synergy: newSynergy
            };
            addToPlayerStacks(gameState, newGemBase, 'gems');
        } else {
            failures++;
        }
    }

if (successes > 0 || failures > 0) { 
    if (successes > failures) {
        playSound('gem_success');
    } else { 
        playSound('gem_fail');
    }
}

    individualGems.forEach(gem => addToPlayerStacks(gameState, gem, 'gems'));

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
    const improvementFactor = Math.random() * 0.5;
    const improvementAmount = gap * improvementFactor;
    
    let newValue = currentValue + improvementAmount;
    
    if (parseFloat(newValue.toFixed(2)) <= currentValue) {
        newValue = currentValue + 0.01;
    }

    const finalValue = Math.min(newValue, max_for_tier);
    
    const actualImprovement = finalValue - currentValue;

    itemToReroll.stats[statToRerollKey] = parseFloat(finalValue.toFixed(2));

    return { success: true, improvement: parseFloat(actualImprovement.toFixed(2)) };
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
 * @param {string|number} stackId - The ID of the consumable stack to use.
 * @returns {{success: boolean, message: string, specialAction: string|null}}
 */
export function consumeItem(gameState, stackId) {
    const stackIndex = gameState.consumables.findIndex(c => c.id === stackId);
    if (stackIndex === -1) {
        return { success: false, message: "Consumable item not found.", specialAction: null };
    }

    const stack = gameState.consumables[stackIndex];
    const itemBase = CONSUMABLES[stack.baseId];
    if (!itemBase || !itemBase.effect) {
        return { success: false, message: "Item has no defined effect.", specialAction: null };
    }

    const effect = itemBase.effect;
    let message = `You activated the ${stack.name}!`;

    let result = { success: true, message: message, specialAction: null };

    switch (effect.type) {
        case 'triggerPrestigeView':
            // --- START OF MODIFICATION ---
            // Set the persistent flag and prepare the special action.
            gameState.isTokenPrestigePending = true; 
            result.specialAction = 'showPrestigeView';
            result.message = "The Mark glows with power, opening the path to a new beginning...";
            // --- END OF MODIFICATION ---
            break;

        case 'permanentFlag':
            if (gameState[effect.key]) {
                return { success: false, message: "You have already gained this permanent effect.", specialAction: null };
            }
            gameState[effect.key] = true;
            break;

        case 'timedBuff':
            const existingBuff = gameState.activeBuffs.find(b => b.name === effect.name);
            const newExpiresAt = Date.now() + (effect.duration * 1000);

            if (existingBuff) {
                existingBuff.expiresAt = newExpiresAt;
                result.message = `You refreshed the duration of <b>${effect.name}</b>!`;
            } else {
                gameState.activeBuffs.push({ ...effect, expiresAt: newExpiresAt });
                result.message = `You feel the effects of <b>${effect.name}</b>!`;
            }
            break;   

        case 'resource':
            gameState[effect.resource] = (gameState[effect.resource] || 0) + effect.amount;
            result.message = `You gained <b>${formatNumber(effect.amount)} ${effect.resource.charAt(0).toUpperCase() + effect.resource.slice(1)}</b>!`;
            break;
        
        case 'permanentStat':
            gameState.permanentStatBonuses[effect.key] = (gameState.permanentStatBonuses[effect.key] || 0) + effect.value;
            result.message += ` Your power grows permanently!`;
            break;

        case 'targetedItemModifier':
            gameState.activeTargetedConsumable = {
                sourceStackId: stack.id,
                effect: effect.key,
                name: stack.name
            };
            result.message = `Select an item to use your <b>${stack.name}</b> on.`;
            break;

        default:
            return { success: false, message: "Unknown consumable effect type.", specialAction: null };
    }

    // --- START OF MODIFICATION ---
    // Only remove the item if it's NOT our special prestige token.
    if (effect.type !== 'triggerPrestigeView') {
        if (stack.quantity && stack.quantity > 1) {
            stack.quantity--;
        } else {
            gameState.consumables.splice(stackIndex, 1);
        }
    }
    // --- END OF MODIFICATION ---
    
    return result;
}

/**
 * Applies the effect of an active targeted consumable to a target item.
 * @param {object} gameState The main game state object.
 * @param {object} targetItem The item being clicked on.
 * @returns {{success: boolean, message: string}}
 */
export function applyTargetedConsumable(gameState, targetItem) {
    const consumableInfo = gameState.activeTargetedConsumable;
    if (!consumableInfo) {
        return { success: false, message: "" }; // Should not happen
    }

    let result = { success: false, message: "" };

    switch (consumableInfo.effect) {
        case 'addSocket':
            const itemBase = ITEMS[targetItem.baseId];
            if (!itemBase || !itemBase.canHaveSockets || itemBase.maxSockets <= 0) {
                result.message = `The <b>${targetItem.name}</b> cannot have sockets.`;
                break;
            }

            const currentSockets = targetItem.sockets ? targetItem.sockets.length : 0;
            if (currentSockets >= itemBase.maxSockets) {
                result.message = `The <b>${targetItem.name}</b> already has the maximum number of sockets.`;
                break;
            }

            if (!targetItem.sockets) {
                targetItem.sockets = [];
            }
            targetItem.sockets.push(null);
            playSound('socket_gem');
            result.success = true;
            result.message = `Successfully added a socket to <b>${targetItem.name}</b>!`;
            break;

        default:
            result.message = "Unknown targeted effect.";
            break;
    }

    // Always clear the targeting state after an attempt
    gameState.activeTargetedConsumable = null;
    return result;
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

    // --- START OF FIX ---
    // 1. Strictly filter for ONLY the tiers the player has unlocked in this run.
    const availableTiers = huntPools.filter(tier => currentHighPoint >= tier.requiredLevel);
    if (availableTiers.length === 0) {
        console.error("No available hunt tiers for the current player level.");
        return;
    }

    // 2. Create a dynamic weighted list from the available tiers.
    const weightedTiers = availableTiers.map((tier, index) => {
        // This gives the highest tier the most weight, the next one less, and so on.
        // Example with 4 unlocked tiers: weights will be roughly 50, 25, 12.5, 6.25
        const weight = 100 / Math.pow(2, availableTiers.length - index);
        return { tier: tier, weight: weight };
    });

    // 3. Perform a weighted roll to select a tier.
    const totalWeight = weightedTiers.reduce((sum, wt) => sum + wt.weight, 0);
    let roll = Math.random() * totalWeight;
    
    let chosenTier;
    for (const weightedTier of weightedTiers) {
        roll -= weightedTier.weight;
        if (roll <= 0) {
            chosenTier = weightedTier.tier;
            break;
        }
    }
    // Failsafe in case of floating point inaccuracies
    if (!chosenTier) {
        chosenTier = weightedTiers[weightedTiers.length - 1].tier;
    }

    const chosenTierPool = chosenTier.hunts;
    // --- END OF FIX ---
    
    const availableHuntIds = gameState.hunts.available.map(h => h ? h.id : null);
    let potentialHunts = chosenTierPool.filter(hunt => !availableHuntIds.includes(hunt.id));
    
    if (potentialHunts.length === 0) {
        // Fallback: search ALL available tiers for any possible hunt
        console.warn(`Hunt pool exhausted for the selected tier. Searching all available tiers.`);
        const allAvailableHuntsFromAllTiers = availableTiers.flatMap(t => t.hunts);
        potentialHunts = allAvailableHuntsFromAllTiers.filter(hunt => !availableHuntIds.includes(hunt.id));
        
        if (potentialHunts.length === 0) {
             console.error("No available unique hunts to generate across all tiers. Aborting hunt generation.");
             return; 
        }
    }

    const huntTemplate = { ...potentialHunts[Math.floor(Math.random() * potentialHunts.length)] };

    const completionCount = gameState.hunts.completionCounts[huntTemplate.id] || 0;
    const completionBonus = completionCount * 2;// Each completion gives +2 to the quantity range
    const quantity = getRandomInt(huntTemplate.quantityMin, huntTemplate.quantityMax + completionBonus);

    const chosenRewardId = huntTemplate.rewardIds[Math.floor(Math.random() * huntTemplate.rewardIds.length)];

    // --- START OF MODIFICATION ---
    // Find the index of the tier this hunt belongs to.
    const tierIndex = huntPools.findIndex(tier => tier.hunts.some(h => h.id === huntTemplate.id));
    const maxTokens = 3 + (tierIndex > -1 ? tierIndex : 0); // Base 3, +1 for each tier index.
    
    // NEW: Calculate the minimum tokens based on the tier index.
    const minTokens = 1 + Math.floor((tierIndex > -1 ? tierIndex : 0) / 2);
    
    const newHunt = {
        ...huntTemplate,
        quantity: quantity,
        rewardId: chosenRewardId,
        tokenReward: getRandomInt(minTokens, maxTokens), // The actual rolled amount for this specific bounty
        maxTokens: maxTokens,                   // The potential maximum for this tier
        instanceId: Date.now() + Math.random(),
    };
    // --- END OF MODIFICATION ---

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
            
            // --- THIS IS THE CORRECTED LINE ---
            if (activeHunt.target.nameContains && defeatedMonster.name.toLowerCase().includes(activeHunt.target.nameContains.toLowerCase())) conditionsMet++;
            
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
 * @returns {{reward: object|null, tokens: number, justUnlockedTravel: boolean}} The reward, tokens, and if the travel feature was just unlocked.
 */
export function completeHunt(gameState) {
    const activeHunt = gameState.hunts.active;
    if (!activeHunt || gameState.hunts.progress < activeHunt.quantity) {
        return { reward: null, tokens: 0, justUnlockedTravel: false };
    }

    const rewardBase = CONSUMABLES[activeHunt.rewardId];
    addToPlayerStacks(gameState, rewardBase, 'consumables');
    
    if (!gameState.unlockedFeatures.consumables) {
        gameState.unlockedFeatures.consumables = true;
        gameState.pendingSubTabViewFlash = 'inventory-consumables-view';
    }

    const count = gameState.hunts.completionCounts[activeHunt.id] || 0;
    gameState.hunts.completionCounts[activeHunt.id] = count + 1;
    gameState.hunts.totalCompleted++;
    
    // --- START MODIFICATION: Unlock Hunt Travel ---
    let justUnlockedTravel = false;
    if (gameState.hunts.totalCompleted >= 5 && !gameState.unlockedFeatures.huntTravel) {
        gameState.unlockedFeatures.huntTravel = true;
        justUnlockedTravel = true;
    }
    // --- END MODIFICATION ---

    const tokensGained = activeHunt.tokenReward || getRandomInt(1, 3);
    gameState.hunts.tokens += tokensGained;
    
    gameState.hunts.active = null;
    gameState.hunts.progress = 0;
    
    return { reward: rewardBase, tokens: tokensGained, justUnlockedTravel: justUnlockedTravel };
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

/**
 * Cancels the player's active hunt at a cost.
 * @param {object} gameState
 * @returns {{success: boolean, message: string}}
 */
export function cancelActiveHunt(gameState) {
    const shopItem = HUNT_SHOP_INVENTORY.Utility.find(item => item.id === 'HUNT_CANCEL');
    if (!shopItem) return { success: false, message: "Cancel item not found in shop data." };
    const cost = shopItem.cost;

    if (!gameState.hunts.active) {
        return { success: false, message: "You don't have an active hunt to cancel." };
    }
    if (gameState.hunts.tokens < cost) {
        return { success: false, message: `Not enough tokens. Requires ${cost}.` };
    }

    gameState.hunts.tokens -= cost;
    gameState.hunts.active = null;
    gameState.hunts.progress = 0;

    return { success: true, message: `Active hunt cancelled for ${cost} tokens.` };
}

/**
 * Handles the logic of purchasing an item from the hunt shop.
 * @param {object} gameState
 * @param {string} itemId
 * @returns {{success: boolean, message: string, itemType: string|null}}
 */
export function purchaseHuntShopItem(gameState, itemId) {
    let shopItem = null;
    // Find the item across all categories
    for (const category in HUNT_SHOP_INVENTORY) {
        const found = HUNT_SHOP_INVENTORY[category].find(item => item.id === itemId);
        if (found) {
            shopItem = found;
            break;
        }
    }

    if (!shopItem) {
        return { success: false, message: "Item not found in shop.", itemType: null };
    }

    if (shopItem.unlock && gameState.hunts.totalCompleted < shopItem.unlock) {
        return { success: false, message: `You have not completed enough hunts to purchase this. Unlocks at ${shopItem.unlock}.`, itemType: null };
    }
    if (shopItem.oneTimePurchase && gameState.purchasedOneTimeShopItems.includes(itemId)) {
        return { success: false, message: "You have already purchased this unique item.", itemType: null };
    }

    // --- START OF MODIFICATION ---
    // Special check for the prestige token
    if (itemId === 'PRESTIGE_TOKEN' && gameState.prestigeTokenPurchasedThisRun) {
        return { success: false, message: "You have already purchased a Mark of the Hunter on this run.", itemType: null };
    }
    // --- END OF MODIFICATION ---

    // Calculate the final cost, accounting for dynamic pricing.
    let finalCost = shopItem.cost;
    if (itemId === 'PRESTIGE_TOKEN') {
        const purchaseCount = gameState.prestigeTokenPurchases || 0;
        finalCost = shopItem.cost + (purchaseCount * 10);
    }

    if (gameState.hunts.tokens < finalCost) {
        return { success: false, message: `You need ${formatNumber(finalCost)} tokens to buy this.`, itemType: null };
    }
    
    // Special handlers for non-item shop actions
    if (itemId === 'HUNT_REROLL') {
        gameState.hunts.tokens -= finalCost;
        gameState.hunts.dailyRerollsLeft++;
        return { success: true, message: "Purchased 1 Bounty Reroll charge.", itemType: 'utility' };
    }
    if (itemId === 'HUNT_CANCEL') {
        const cancelResult = cancelActiveHunt(gameState);
        return { ...cancelResult, itemType: 'utility' };
    }

    const itemBase = GEMS[itemId] || CONSUMABLES[itemId];

    if (!itemBase) {
        return { success: false, message: "Data not found for this item.", itemType: null };
    }

    // Deduct the final cost and increment the purchase counter if necessary.
    gameState.hunts.tokens -= finalCost;
    if (itemId === 'PRESTIGE_TOKEN') {
        gameState.prestigeTokenPurchases = (gameState.prestigeTokenPurchases || 0) + 1;
        gameState.prestigeTokenPurchasedThisRun = true; // <-- SET THE FLAG
    }
    
    let itemType = null;
    if (itemBase.tier >= 1) {
        addToPlayerStacks(gameState, itemBase, 'gems');
        itemType = 'gem';
    } else if (itemBase.type === 'consumable') {
        addToPlayerStacks(gameState, itemBase, 'consumables');
        itemType = 'consumable';
    } else {
        console.error("Unknown item type purchased from Hunt Shop:", itemBase);
        return { success: true, message: `Purchased ${itemBase.name}, but it's an unknown type!`, itemType: null };
    }

    if (shopItem.oneTimePurchase) {
        gameState.purchasedOneTimeShopItems.push(itemId);
    }

    return { success: true, message: `Purchased ${itemBase.name}!`, itemType };
}

export function resetAttributes(gameState) {
    const { strength, agility, luck } = gameState.hero.attributes;
    const totalSpentPoints = strength + agility + luck;

    if (totalSpentPoints === 0) {
        return { success: false, message: "You have no attribute points to reset." };
    }

    const costPerPoint = 100;
    const totalCost = totalSpentPoints * costPerPoint;

    if (gameState.scrap < totalCost) {
        return { success: false, message: `You need ${formatNumber(totalCost)} Scrap to reset, but you only have ${formatNumber(gameState.scrap)}.` };
    }

    // Deduct cost and refund points
    gameState.scrap -= totalCost;
    gameState.hero.attributePoints += totalSpentPoints;

    // Reset attributes to zero
    gameState.hero.attributes.strength = 0;
    gameState.hero.attributes.agility = 0;
    gameState.hero.attributes.luck = 0;

    return { success: true, message: `Successfully reset ${totalSpentPoints} attribute points for ${formatNumber(totalCost)} Scrap!` };
}