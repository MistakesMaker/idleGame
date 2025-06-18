// --- START OF FILE player_actions.js ---

import { rarities } from './game.js';
import { REALMS } from './data/realms.js';
import { getXpForNextLevel, getUpgradeCost, findEmptySpot } from './utils.js';
import { GEMS } from './data/gems.js';
import { ITEMS } from './data/items.js';

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
 * Equips an item from the inventory.
 * @param {object} gameState - The main game state object.
 * @param {object} itemToEquip - The item object from the inventory to equip.
 * @returns {{isPendingRing: boolean, item: object|null, success: boolean, message: string}}
 */
export function equipItem(gameState, itemToEquip) {
    if (!itemToEquip) return { isPendingRing: false, item: null, success: false, message: "Invalid item." };

    const inventoryItemIndex = gameState.inventory.findIndex(i => i.id === itemToEquip.id);
    if (inventoryItemIndex === -1) {
        return { isPendingRing: false, item: null, success: false, message: "Item not found in inventory." };
    }

    let targetSlot = itemToEquip.type;
    if (itemToEquip.type === 'ring') {
        if (!gameState.equipment.ring1) targetSlot = 'ring1';
        else if (!gameState.equipment.ring2) targetSlot = 'ring2';
        else {
            return { isPendingRing: true, item: itemToEquip, success: true, message: "Select a ring to replace." };
        }
    }

    const itemInSlot = gameState.equipment[targetSlot];
    const [equippedItem] = gameState.inventory.splice(inventoryItemIndex, 1);
    
    // Perform the direct swap
    if (itemInSlot) {
        // Place the previously worn item in the exact spot of the newly equipped item
        itemInSlot.x = equippedItem.x;
        itemInSlot.y = equippedItem.y;
        gameState.inventory.push(itemInSlot);
    }
    
    gameState.equipment[targetSlot] = equippedItem;
    
    return { isPendingRing: false, item: null, success: true, message: `Equipped ${equippedItem.name}.` };
}

/**
 * Equips a pending ring to a specific slot.
 * @param {object} gameState - The main game state object.
 * @param {object} pendingRing - The ring item waiting to be equipped.
 * @param {string} targetSlot - The specific ring slot ('ring1' or 'ring2').
 */
export function equipRing(gameState, pendingRing, targetSlot) {
    const inventoryItemIndex = gameState.inventory.findIndex(i => i.id === pendingRing.id);
    if (inventoryItemIndex === -1) return;

    const itemInSlot = gameState.equipment[targetSlot];
    const [equippedItem] = gameState.inventory.splice(inventoryItemIndex, 1);

    if (itemInSlot) {
        // Direct swap logic for rings as well
        itemInSlot.x = equippedItem.x;
        itemInSlot.y = equippedItem.y;
        gameState.inventory.push(itemInSlot);
    }
    gameState.equipment[targetSlot] = equippedItem;
}


/**
 * Unequips an item from an equipment slot back to the inventory.
 */
export function unequipItem(gameState, slotName) {
    const item = gameState.equipment[slotName];
    if (!item) return;

    const spot = findEmptySpot(item.width, item.height, gameState.inventory);
    if (spot) {
        item.x = spot.x;
        item.y = spot.y;
        gameState.inventory.push(item);
        gameState.equipment[slotName] = null;
    } else {
        alert("Cannot unequip item, inventory is full!");
    }
}

/**
 * Spends an attribute point on a given attribute.
 */
export function spendAttributePoint(gameState, attribute) {
    if (gameState.hero.attributePoints > 0) {
        gameState.hero.attributePoints--;
        gameState.hero.attributes[attribute]++;
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
        gameState.hero.attributePoints += 5;
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
 * @returns {{count: number, scrapGained: number}}
 */
export function salvageSelectedItems(gameState, salvageMode) {
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
    
    gameState.inventory = gameState.inventory.filter(item => !idsToSalvage.has(item.id));
    gameState.scrap += totalScrapGained;

    // Compact the inventory after salvaging
    gameState.inventory = compactInventory(gameState.inventory);

    return { count: selectedCount, scrapGained: totalScrapGained };
}

/**
 * Salvages all non-locked items of a specific rarity.
 */
export function salvageByRarity(gameState, rarityToSalvage) {
    let scrapGained = 0;
    let itemsSalvagedCount = 0;
    const itemsToKeep = [];
    
    gameState.inventory.forEach(item => {
        if (item.rarity === rarityToSalvage && !item.locked) {
            const rarityIndex = rarities.indexOf(item.rarity);
            scrapGained += Math.ceil(Math.pow(4, rarityIndex));
            itemsSalvagedCount++;
        } else {
            itemsToKeep.push(item);
        }
    });

    if (itemsSalvagedCount > 0) {
        gameState.inventory = itemsToKeep;
        gameState.scrap += scrapGained;
        // Compact the inventory after salvaging
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
    const item = gameState.inventory.find(i => i.id === itemToToggle.id);
    if (item) {
        item.locked = !item.locked;
        return `Item ${item.name} ${item.locked ? 'locked' : 'unlocked'}.`;
    }
    return "";
}

/**
 * Activates a given equipment preset.
 */
export function activatePreset(gameState, presetIndex) {
    gameState.presets[gameState.activePresetIndex].equipment = { ...gameState.equipment };

    const itemsToUnequip = Object.values(gameState.equipment).filter(Boolean);
    for (const item of itemsToUnequip) {
        const spot = findEmptySpot(item.width, item.height, gameState.inventory);
        if (spot) {
            item.x = spot.x;
            item.y = spot.y;
            gameState.inventory.push(item);
        } else {
            console.error(`No space for ${item.name} when swapping presets!`);
            gameState.inventory.push(item); 
        }
    }
    
    for (const slot in gameState.equipment) {
        gameState.equipment[slot] = null;
    }

    const newPresetEquipment = { ...gameState.presets[presetIndex].equipment };
    const newInventory = [];
    
    gameState.inventory.forEach(invItem => {
        let equipped = false;
        for (const slot in newPresetEquipment) {
            const presetItem = newPresetEquipment[slot];
            if (presetItem && invItem && presetItem.id === invItem.id) {
                gameState.equipment[slot] = invItem;
                delete newPresetEquipment[slot]; 
                equipped = true;
                break;
            }
        }
        if (!equipped) {
            newInventory.push(invItem);
        }
    });

    gameState.inventory = compactInventory(newInventory); // Compact after preset load
    gameState.activePresetIndex = presetIndex;
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
        
        const id1 = gem1.id;
        const id2 = gem2.id;
        gameState.gems = gameState.gems.filter(g => g.id !== id1 && g.id !== id2);

        gameState.gems.push(newGem);

        return { success: true, message: `Success! You fused a ${newGem.name}!`, newGem: newGem };
    } else {
        // FAILURE
        const id1 = gem1.id;
        const id2 = gem2.id;
        gameState.gems = gameState.gems.filter(g => g.id !== id1 && g.id !== id2);
        
        return { success: true, message: "The gems shattered... you lost everything.", newGem: null };
    }
}

/**
 * Rerolls the stat values of a given item from either inventory or equipment.
 * @param {object} gameState The main game state object.
 * @param {object} itemToReroll The item object to be rerolled.
 * @returns {{success: boolean, message: string}}
 */
export function rerollItemStats(gameState, itemToReroll) {
    const cost = 50;
    if (gameState.scrap < cost) {
        return { success: false, message: "Not enough Scrap to reroll!" };
    }
    
    if (!itemToReroll || !itemToReroll.baseId) {
        return { success: false, message: "Invalid item selected for rerolling." };
    }

    const itemBase = ITEMS[itemToReroll.baseId];
    if (!itemBase) {
        return { success: false, message: `Could not find base definition for ${itemToReroll.name}.` };
    }
    
    const rarityIndex = rarities.indexOf(itemToReroll.rarity);
    const tier_max_percent = (rarityIndex + 1) / rarities.length;
    let isMaxed = true;
    
    const currentStatKeys = Object.keys(itemToReroll.stats);

    if (currentStatKeys.length === 0) {
        isMaxed = false;
    }

    for (const statKey of currentStatKeys) {
        const statDefinition = itemBase.possibleStats.find(p => p.key === statKey);
        if (!statDefinition) {
            isMaxed = false; 
            break;
        }

        const statRange = statDefinition.max - statDefinition.min;
        const maxStatForTier = statDefinition.min + (statRange * tier_max_percent);

        if (itemToReroll.stats[statKey] < maxStatForTier - 0.001) {
            isMaxed = false;
            break; 
        }
    }

    if (isMaxed) {
        return { success: false, message: "This item's stats are already perfect for its tier!" };
    }

    gameState.scrap -= cost;
    
    if (typeof itemToReroll.rerollAttempts !== 'number') {
        itemToReroll.rerollAttempts = 0;
    }
    itemToReroll.rerollAttempts++;
    
    const isGuaranteedRoll = itemToReroll.rerollAttempts >= 100;

    const newStats = {};
    const tier_min_percent = rarityIndex / rarities.length;
    
    for(const statKey of currentStatKeys) {
        const statDefinition = itemBase.possibleStats.find(p => p.key === statKey);
        if (statDefinition) {
            const total_stat_range = statDefinition.max - statDefinition.min;
            const range_per_tier = total_stat_range / rarities.length;

            const min_for_tier = statDefinition.min + (range_per_tier * rarityIndex);
            const max_for_tier = statDefinition.min + (range_per_tier * (rarityIndex + 1));
            
            let final_stat_value;

            if (isGuaranteedRoll) {
                final_stat_value = max_for_tier;
            } else {
                const tier_specific_range = max_for_tier - min_for_tier;
                final_stat_value = min_for_tier + (Math.random() * tier_specific_range);
            }
            
            newStats[statKey] = parseFloat(final_stat_value.toFixed(2));
        }
    }
    
    itemToReroll.stats = newStats;
    
    if (isGuaranteedRoll) {
        itemToReroll.rerollAttempts = 0;
        return { success: true, message: `FAILSAFE! After 100 attempts, the forge grants a PERFECT reroll on ${itemToReroll.name}!` };
    } else {
        return { success: true, message: `Successfully rerolled ${itemToReroll.name}! (Attempt #${itemToReroll.rerollAttempts})` };
    }
}