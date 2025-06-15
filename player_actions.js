// --- START OF FILE player_actions.js ---

import { rarities } from './game.js';
import { REALMS } from './data/realms.js';
import { getXpForNextLevel, getUpgradeCost } from './utils.js';
import { GEMS } from './data/gems.js';
import { ITEMS } from './data/items.js';

/**
 * Equips an item from the inventory.
 * @param {object} gameState - The main game state object.
 * @param {number} inventoryIndex - The index of the item in the inventory.
 * @returns {{isPendingRing: boolean, item: object|null}} Returns true if the equip is pending user choice for a ring slot.
 */
export function equipItem(gameState, inventoryIndex) {
    const item = gameState.inventory[inventoryIndex];
    if (!item) return { isPendingRing: false, item: null };

    let targetSlot = item.type;
    if (item.type === 'ring') {
        if (!gameState.equipment.ring1) targetSlot = 'ring1';
        else if (!gameState.equipment.ring2) targetSlot = 'ring2';
        else {
            return { isPendingRing: true, item: item };
        }
    }

    const currentEquipped = gameState.equipment[targetSlot];
    if (currentEquipped) {
        gameState.inventory.push(currentEquipped);
    }
    gameState.equipment[targetSlot] = item;
    gameState.inventory.splice(inventoryIndex, 1);
    return { isPendingRing: false, item: null };
}

/**
 * Equips a pending ring to a specific slot.
 * @param {object} gameState - The main game state object.
 * @param {object} pendingRing - The ring item waiting to be equipped.
 * @param {string} targetSlot - The specific ring slot ('ring1' or 'ring2').
 */
export function equipRing(gameState, pendingRing, targetSlot) {
    const inventoryIndex = gameState.inventory.findIndex(invItem => invItem.id === pendingRing.id);
    if (inventoryIndex === -1) return;

    const currentEquipped = gameState.equipment[targetSlot];
    if (currentEquipped) {
        gameState.inventory.push(currentEquipped);
    }
    gameState.equipment[targetSlot] = pendingRing;
    gameState.inventory.splice(inventoryIndex, 1);
}


/**
 * Unequips an item from an equipment slot back to the inventory.
 */
export function unequipItem(gameState, slotName) {
    const item = gameState.equipment[slotName];
    if (!item) return;
    gameState.inventory.push(item);
    gameState.equipment[slotName] = null;
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
    gameState.inventory.push(item);

    return { success: true, message: `Bought a loot crate for ${cost} Scrap!`, item };
}

/**
 * Salvages selected items for scrap.
 */
export function salvageSelectedItems(gameState, salvageMode) {
    if (salvageMode.selections.length === 0) {
        return { count: 0, scrapGained: 0 };
    }
    let totalScrapGained = 0;
    const selectedCount = salvageMode.selections.length;
    salvageMode.selections.sort((a, b) => b - a);
    salvageMode.selections.forEach(index => {
        const item = gameState.inventory[index];
        if (item) {
            const rarityIndex = rarities.indexOf(item.rarity);
            const scrapGained = Math.ceil(Math.pow(4, rarityIndex));
            totalScrapGained += scrapGained;
            gameState.inventory.splice(index, 1);
        }
    });
    gameState.scrap += totalScrapGained;
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
    }
    return { count: itemsSalvagedCount, scrapGained };
}


/**
 * Toggles the lock state of an inventory item.
 */
export function toggleItemLock(gameState, inventoryIndex) {
    const item = gameState.inventory[inventoryIndex];
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
    const newPresetEquipment = gameState.presets[presetIndex].equipment;
    const itemsToUnequip = { ...gameState.equipment };
    for (const slot in gameState.equipment) {
        gameState.equipment[slot] = null;
    }
    for (const slot in itemsToUnequip) {
        if (itemsToUnequip[slot]) {
            gameState.inventory.push(itemsToUnequip[slot]);
        }
    }
    const newInventory = [];
    const presetEquipmentCopy = { ...newPresetEquipment };
    gameState.inventory.forEach(invItem => {
        let equipped = false;
        for (const slot in presetEquipmentCopy) {
            const presetItem = presetEquipmentCopy[slot];
            if (presetItem && invItem && presetItem.id === invItem.id) {
                gameState.equipment[slot] = invItem;
                delete presetEquipmentCopy[slot];
                equipped = true;
                break;
            }
        }
        if (!equipped) {
            newInventory.push(invItem);
        }
    });
    gameState.inventory = newInventory;
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
                    newSynergy = { ...parentGem.synergy }; // Copy the first synergy
                } else {
                    // If a synergy already exists, add the values (assuming they are the same type)
                    newSynergy.value += parentGem.synergy.value;
                }
            }
        });

        // --- FIX: Add baseId and make name/icon dynamic for fused gems ---
        const newGem = {
            id: Date.now() + Math.random(),
            baseId: `FUSED_T${newTier}`,
            name: `T${newTier} Fused Gem`,
            tier: newTier,
            icon: `images/gems/fused_t${newTier}.png`,
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
    
    // --- FAILSAFE LOGIC ---
    // Initialize counter if it doesn't exist (for items from old saves)
    if (typeof itemToReroll.rerollAttempts !== 'number') {
        itemToReroll.rerollAttempts = 0;
    }
    itemToReroll.rerollAttempts++;
    
    const isGuaranteedRoll = itemToReroll.rerollAttempts >= 100;
    // --- END OF FAILSAFE LOGIC ---

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
                // Guaranteed perfect roll
                final_stat_value = max_for_tier;
            } else {
                // Normal random roll within the tier's range
                const tier_specific_range = max_for_tier - min_for_tier;
                final_stat_value = min_for_tier + (Math.random() * tier_specific_range);
            }
            
            newStats[statKey] = parseFloat(final_stat_value.toFixed(2));
        }
    }
    
    itemToReroll.stats = newStats;
    
    if (isGuaranteedRoll) {
        itemToReroll.rerollAttempts = 0; // Reset the counter
        return { success: true, message: `FAILSAFE! After 100 attempts, the forge grants a PERFECT reroll on ${itemToReroll.name}!` };
    } else {
        return { success: true, message: `Successfully rerolled ${itemToReroll.name}! (Attempt #${itemToReroll.rerollAttempts})` };
    }
}