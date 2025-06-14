// --- START OF FILE player_actions.js ---

import { rarities } from './game.js'; // We'll export rarities from game.js
import { REALMS } from './data/realms.js';
import { getXpForNextLevel } from './utils.js';

/**
 * Equips an item from the inventory.
 * @param {object} gameState - The main game state object.
 * @param {number} inventoryIndex - The index of the item in the inventory.
 */
export function equipItem(gameState, inventoryIndex) {
    const item = gameState.inventory[inventoryIndex];
    if (!item) return;

    let targetSlot = item.type;
    if (item.type === 'ring') {
        if (!gameState.equipment.ring1) targetSlot = 'ring1';
        else if (!gameState.equipment.ring2) targetSlot = 'ring2';
        else targetSlot = 'ring1'; // Default to replacing ring1
    }

    const currentEquipped = gameState.equipment[targetSlot];
    if (currentEquipped) {
        gameState.inventory.push(currentEquipped);
    }
    gameState.equipment[targetSlot] = item;
    gameState.inventory.splice(inventoryIndex, 1);
}

/**
 * Unequips an item from an equipment slot back to the inventory.
 * @param {object} gameState - The main game state object.
 * @param {string} slotName - The name of the equipment slot.
 */
export function unequipItem(gameState, slotName) {
    const item = gameState.equipment[slotName];
    if (!item) return;
    gameState.inventory.push(item);
    gameState.equipment[slotName] = null;
}

/**
 * Spends an attribute point on a given attribute.
 * @param {object} gameState - The main game state object.
 * @param {string} attribute - The attribute to increase ('strength', 'agility', 'luck').
 */
export function spendAttributePoint(gameState, attribute) {
    if (gameState.hero.attributePoints > 0) {
        gameState.hero.attributePoints--;
        gameState.hero.attributes[attribute]++;
    }
}

/**
 * Adds experience to the hero, handling level-ups.
 * @param {object} gameState - The main game state object.
 * @param {number} amount - The amount of XP to gain.
 * @returns {Array<string>} An array of log messages for level-ups.
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
 * Buys a gold upgrade.
 * @param {object} gameState - The main game state object.
 * @param {string} upgradeType - The type of upgrade ('clickDamage' or 'dps').
 * @param {number} cost - The calculated cost of the upgrade.
 * @returns {{success: boolean, message: string}} Result of the purchase.
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
 * Buys a loot crate with scrap.
 * @param {object} gameState - The main game state object.
 * @param {function} generateItemFn - The generateItem function from game_logic.
 * @returns {{success: boolean, message: string, item: object|null}} Result of the purchase.
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
 * @param {object} gameState - The main game state object.
 * @param {object} salvageMode - The salvage mode state object.
 * @returns {{count: number, scrapGained: number}} The result of the salvage operation.
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
 * Toggles the lock state of an inventory item.
 * @param {object} gameState - The main game state object.
 * @param {number} inventoryIndex - The index of the item.
 * @returns {string} A log message.
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
 * @param {object} gameState - The main game state object.
 * @param {number} presetIndex - The index of the preset to activate.
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
// --- END OF FILE player_actions.js ---